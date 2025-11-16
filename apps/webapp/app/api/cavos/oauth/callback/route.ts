import { NextRequest, NextResponse } from 'next/server'
import { getCavosConfig } from '@/lib/cavos-config'
import { saveCavosUser } from '@/lib/supabase/cavos-users'
import type { CavosNormalizedResponse } from '@/types/cavos'

interface AegisAccount {
  handleOAuthCallback?: (callbackResult: string) => Promise<CavosNormalizedResponse>
  [key: string]: unknown
}

interface ErrorWithCode extends Error {
  code?: string
}

interface UserDataParams {
  user_id?: string
  userId?: string
  id?: string
  sub?: string
  email?: string
  email_address?: string
  organization?: {
    org_id: number | string
    org_name?: string
  } | string
  org_id?: number | string
  wallet?: {
    address?: string
    network?: string
    [key: string]: unknown
  } | string
  access_token?: string
  accessToken?: string
  token?: string
  auth_token?: string
  refresh_token?: string
  refreshToken?: string
  expires_in?: number | string
  expiresIn?: number | string
  timestamp?: number
  authData?: {
    accessToken?: string
    refreshToken?: string
    [key: string]: unknown
  }
  auth?: {
    accessToken?: string
    refreshToken?: string
    [key: string]: unknown
  }
  user?: {
    [key: string]: unknown
  }
  data?: {
    [key: string]: unknown
  }
  [key: string]: unknown
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { callbackResult } = body

    if (!callbackResult) {
      return NextResponse.json(
        { error: 'Callback result is required' },
        { status: 400 }
      )
    }

    try {
      const config = getCavosConfig()
      
      let result: CavosNormalizedResponse | undefined
      
      try {
        const { createCavosAuth } = await import('@/lib/cavos-config')
        const aegisAccount = createCavosAuth()
        
        const typedAccount = aegisAccount as unknown as AegisAccount
        if (typeof typedAccount.handleOAuthCallback === 'function') {
          try {
            result = await typedAccount.handleOAuthCallback(callbackResult)
          } catch (sdkMethodError: unknown) {
            // Re-throw to fall back to URL parsing
            throw sdkMethodError
          }
        } else {
          throw new Error('SDK method not available')
        }
      } catch (sdkError) {
        
        // Fallback: Try to extract user data from the callback URL
        // We need to check if we have code/state (OAuth flow) or if data is already in the URL
        try {
          const callbackUrl = new URL(callbackResult)
          const code = callbackUrl.searchParams.get('code')
          const state = callbackUrl.searchParams.get('state')
          
          if (code && state) {
            
            // Determine if this is Google or Apple based on the callback URL or state
            const isGoogle = callbackUrl.pathname.includes('google') || callbackUrl.searchParams.get('provider') === 'google'
            const provider = isGoogle ? 'google' : 'apple'
            
            // Construct the Cavos callback endpoint URL
            const baseURL = config.baseURL
            const callbackEndpoint = `${baseURL}/auth/${provider}/callback`
            
            // Build query parameters for Cavos callback
            const callbackUrlObj = new URL(callbackResult)
            const finalRedirectUri = `${callbackUrlObj.origin}${callbackUrlObj.pathname}`
            
            const callbackParams = new URLSearchParams({
              code: code,
              state: state || '',
              network: config.defaultNetwork,
              app_id: config.appId,
              final_redirect_uri: finalRedirectUri // Our callback page
            })
            
            // If we have org_id in the original URL, include it
            const orgId = callbackUrl.searchParams.get('org_id')
            if (orgId) {
              callbackParams.append('org_id', orgId)
            }
            
            const cavosCallbackUrl = `${callbackEndpoint}?${callbackParams.toString()}`
            
            // Call Cavos callback endpoint with redirect following
            // This should redirect to our final_redirect_uri with user data
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
            
            try {
              await fetch(cavosCallbackUrl, {
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                  'User-Agent': 'PayStark/1.0'
                },
                redirect: 'follow', // Follow redirects to get final URL
                signal: controller.signal
              })
              
              clearTimeout(timeoutId)
              
              throw new Error(
                `OAuth callback received code and state, but server-side processing requires ` +
                `the client to call Cavos callback endpoint directly. Please configure the OAuth flow ` +
                `so that Cavos callback endpoint is called before redirecting to final_redirect_uri.`
              )
            } catch (fetchError: unknown) {
              clearTimeout(timeoutId)
              
              // If fetch fails, throw a more helpful error
              const errorMessage = fetchError instanceof Error ? fetchError.message : String(fetchError)
              throw new Error(
                `Failed to process OAuth callback with Cavos. ` +
                `Received code and state but could not exchange them for user data. ` +
                `This may indicate a configuration issue with the OAuth flow. ` +
                `Error: ${errorMessage}`
              )
            }
          }
          
          // Try to extract user data directly from query parameters
          let userDataFromParams: UserDataParams = {}
          
          const userDataParam = callbackUrl.searchParams.get('user_data')
          if (userDataParam) {
            try {
              try {
                userDataFromParams = JSON.parse(userDataParam)
              } catch {
                // Try URL decoded
                try {
                  const decoded = decodeURIComponent(userDataParam)
                  userDataFromParams = JSON.parse(decoded)
                } catch {
                  // Try double URL decoded (sometimes it's encoded twice)
                  try {
                    const doubleDecoded = decodeURIComponent(decodeURIComponent(userDataParam))
                    userDataFromParams = JSON.parse(doubleDecoded)
                  } catch {
                    // Try base64 encoded JSON
                    try {
                      const decoded = Buffer.from(userDataParam, 'base64').toString('utf-8')
                      userDataFromParams = JSON.parse(decoded)
                    } catch (base64Error) {
                      throw base64Error
                    }
                  }
                }
              }
            } catch {
              userDataFromParams = {}
            }
          }
          
          if (userDataFromParams && typeof userDataFromParams === 'object') {
            if (userDataFromParams.user && typeof userDataFromParams.user === 'object') {
              Object.assign(userDataFromParams, userDataFromParams.user)
            }
            if (userDataFromParams.data && typeof userDataFromParams.data === 'object') {
              Object.assign(userDataFromParams, userDataFromParams.data)
            }
          }
          
          const userId = (userDataFromParams && typeof userDataFromParams === 'object' && userDataFromParams.user_id) || 
                        (userDataFromParams && userDataFromParams.userId) || 
                        (userDataFromParams && userDataFromParams.id) ||
                        (userDataFromParams && userDataFromParams.sub) ||
                        callbackUrl.searchParams.get('user_id') || 
                        callbackUrl.searchParams.get('userId') || 
                        callbackUrl.searchParams.get('id') ||
                        callbackUrl.searchParams.get('sub')
                        
          const email = (userDataFromParams && userDataFromParams.email) ||
                       (userDataFromParams && userDataFromParams.email_address) ||
                       callbackUrl.searchParams.get('email')
          
          const accessToken = (userDataFromParams && userDataFromParams.access_token) ||
                             (userDataFromParams && userDataFromParams.accessToken) ||
                             (userDataFromParams && userDataFromParams.token) ||
                             (userDataFromParams && userDataFromParams.auth_token) ||
                             (userDataFromParams && userDataFromParams.authData?.accessToken) ||
                             (userDataFromParams && userDataFromParams.auth?.accessToken) ||
                             callbackUrl.searchParams.get('access_token') || 
                             callbackUrl.searchParams.get('accessToken') || 
                             callbackUrl.searchParams.get('token') ||
                             callbackUrl.searchParams.get('auth_token')
          
          const refreshToken = (userDataFromParams && userDataFromParams.refresh_token) ||
                              (userDataFromParams && userDataFromParams.refreshToken) ||
                              (userDataFromParams && userDataFromParams.authData?.refreshToken) ||
                              (userDataFromParams && userDataFromParams.auth?.refreshToken) ||
                              callbackUrl.searchParams.get('refresh_token') || 
                              callbackUrl.searchParams.get('refreshToken')
          
          let wallet: CavosNormalizedResponse['wallet'] = undefined
          const walletFromParams = userDataFromParams?.wallet
          if (walletFromParams) {
            if (typeof walletFromParams === 'object' && walletFromParams !== null) {
              wallet = walletFromParams as CavosNormalizedResponse['wallet']
              // Normalize network to mainnet (Cavos sometimes returns sepolia)
              if (wallet && 'network' in wallet) {
                wallet = {
                  ...wallet,
                  network: 'mainnet'
                }
              }
            }
          }
          if (!wallet) {
            const walletParam = callbackUrl.searchParams.get('wallet') || 
                               callbackUrl.searchParams.get('wallet_address')
            if (walletParam) {
              try {
                // Try to parse as JSON if it's a string
                const parsed = JSON.parse(walletParam)
                if (typeof parsed === 'object' && parsed !== null) {
                  wallet = {
                    ...parsed,
                    network: 'mainnet' // Normalize to mainnet
                  } as CavosNormalizedResponse['wallet']
                }
              } catch {
                // If parsing fails, ignore - wallet stays undefined
              }
            }
          }
          
          // Organization - can be object or just org_id
          let organization: { org_id: number; org_name: string } | undefined = undefined
          const orgFromParams = userDataFromParams?.organization
          if (orgFromParams) {
            if (typeof orgFromParams === 'object' && orgFromParams !== null && 'org_id' in orgFromParams) {
              const orgId = typeof orgFromParams.org_id === 'number' ? orgFromParams.org_id : parseInt(String(orgFromParams.org_id))
              if (!isNaN(orgId)) {
                organization = { 
                  org_id: orgId, 
                  org_name: typeof orgFromParams.org_name === 'string' ? orgFromParams.org_name : '' 
                }
              }
            }
          }
          if (!organization && userDataFromParams?.org_id) {
            const orgId = typeof userDataFromParams.org_id === 'number' ? userDataFromParams.org_id : parseInt(String(userDataFromParams.org_id))
            if (!isNaN(orgId)) {
              organization = { org_id: orgId, org_name: '' }
            }
          }
          if (!organization) {
            const orgParam = callbackUrl.searchParams.get('organization') || 
                            callbackUrl.searchParams.get('org_id')
            if (orgParam) {
              try {
                const parsed = JSON.parse(orgParam)
                if (typeof parsed === 'object' && parsed !== null && 'org_id' in parsed) {
                  const orgId = typeof parsed.org_id === 'number' ? parsed.org_id : parseInt(String(parsed.org_id))
                  if (!isNaN(orgId)) {
                    organization = { 
                      org_id: orgId, 
                      org_name: typeof parsed.org_name === 'string' ? parsed.org_name : '' 
                    }
                  }
                }
              } catch {
                const orgIdNum = parseInt(orgParam)
                if (!isNaN(orgIdNum)) {
                  organization = { org_id: orgIdNum, org_name: '' }
                }
              }
            }
          }
          
          // Final values
          const finalUserId = userId || ''
          const finalEmail = email || ''
          const finalAccessToken = accessToken || ''
          const finalRefreshToken = refreshToken || ''
          const finalWallet = wallet
          const finalOrganization = organization
          
          const expiresInStr = callbackUrl.searchParams.get('expires_in') || 
                             (userDataFromParams?.expires_in ? String(userDataFromParams.expires_in) : null) || 
                             (userDataFromParams?.expiresIn ? String(userDataFromParams.expiresIn) : null) || 
                             (finalAccessToken ? '3600' : null)
          const finalExpiresIn = expiresInStr ? parseInt(expiresInStr) : 3600
          
          if (finalUserId || finalEmail) {
            result = {
              user: {
                id: finalUserId || finalEmail,
                email: finalEmail,
                organization: finalOrganization || { org_id: 0, org_name: '' }
              },
              wallet: finalWallet,
              access_token: finalAccessToken,
              refresh_token: finalRefreshToken,
              expires_in: finalExpiresIn,
              timestamp: userDataFromParams?.timestamp ? Number(userDataFromParams.timestamp) : Date.now()
            }
            
          } else {
            
            // Provide helpful error message
            if (code && state) {
              throw new Error(
                `OAuth callback received authorization code but user data is not available. ` +
                `This may indicate that Cavos callback endpoint needs to be called with code=${code.substring(0, 10)}... and state=${state}. ` +
                `Please check the OAuth flow implementation.`
              )
            } else if (userDataParam) {
              throw new Error(
                `Could not extract required user data from user_data parameter. ` +
                `Found user_data parameter but missing user identification: ` +
                `userId=${!!finalUserId}, email=${!!finalEmail}. ` +
                `Parsed user_data keys: ${Object.keys(userDataFromParams).join(', ')}. ` +
                `Please check the user_data format. Access token may need to be obtained separately.`
              )
            } else {
              throw new Error(
                `Could not extract user data from callback URL. ` +
                `Found: userId=${!!finalUserId}, email=${!!finalEmail}. ` +
                `URL params: ${Array.from(callbackUrl.searchParams.keys()).join(', ')}. ` +
                `Please check the callback URL format or ensure Cavos is redirecting with the correct parameters.`
              )
            }
          }
        } catch (urlError) {
          // If we can't extract data, provide a more helpful error message
          const errorMsg = urlError instanceof Error ? urlError.message : 'Unknown error'
          throw new Error(
            `OAuth callback processing failed: ${errorMsg}. ` +
            `SDK error: ${sdkError instanceof Error ? sdkError.message : 'Unknown'}. ` +
            `Please verify the callback URL format and ensure Cavos is configured correctly.`
          )
        }
      }
      
      // result is already a CavosNormalizedResponse
      if (!result) {
        throw new Error('OAuth callback processing failed: No result data available')
      }
      
      // Normalize wallet network to mainnet if present
      if (result.wallet && typeof result.wallet === 'object' && 'network' in result.wallet) {
        result.wallet = {
          ...result.wallet,
          network: 'mainnet'
        }
      }

      if (result.user && result.user.id && result.user.email) {
        try {
          const userToSave = {
            ...result.user,
            wallet: result.wallet
          }
          const savedUserId = await saveCavosUser(userToSave)
          if (!savedUserId) {
            console.error('Failed to save OAuth user to Supabase:', {
              userId: result.user.id,
              email: result.user.email
            })
          }
        } catch (error) {
          console.error('Failed to save OAuth user to Supabase:', error)
        }
      }

      // Check if user is authenticated but no access token (may need password)
      if ((result.user.id || result.user.email) && !result.access_token) {
        
        const userData: CavosNormalizedResponse & { requires_password?: boolean; oauth_authenticated?: boolean } = {
          user: result.user,
          wallet: result.wallet,
          access_token: '',
          refresh_token: '',
          expires_in: 0,
          timestamp: result.timestamp || Date.now(),
          requires_password: true,
          oauth_authenticated: true
        }
        
        return NextResponse.json(userData)
      }
      
      // Standard response with tokens
      return NextResponse.json(result)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'OAuth callback failed'
      const errorWithCode = error as ErrorWithCode
      const errorCode = errorWithCode?.code
      
      let statusCode = 400
      if (errorMessage.toLowerCase().includes('invalid') || errorMessage.toLowerCase().includes('invalid token')) {
        statusCode = 401
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          code: errorCode
        },
        { status: statusCode }
      )
    }
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
