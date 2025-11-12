import { NextRequest, NextResponse } from 'next/server'
import { createCavosAuth, getCavosConfig } from '@/lib/cavos-config'
import type { CavosNormalizedResponse } from '@/types/cavos'

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
      
      let result: any
      
      try {
        const { createCavosAuth } = await import('@/lib/cavos-config')
        const aegisAccount = createCavosAuth()
        
        // Log available methods for debugging
        if (process.env.NODE_ENV === 'development') {
          const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(aegisAccount))
          console.log('Available methods on aegisAccount:', methods.filter(m => typeof (aegisAccount as any)[m] === 'function'))
          console.log('Callback result URL:', callbackResult)
        }
        
        if (typeof (aegisAccount as any).handleOAuthCallback === 'function') {
          try {
            result = await (aegisAccount as any).handleOAuthCallback(callbackResult)
            
            if (process.env.NODE_ENV === 'development') {
              console.log('Successfully processed OAuth callback with SDK:', result)
            }
          } catch (sdkMethodError: any) {
            if (process.env.NODE_ENV === 'development') {
              console.error('SDK method execution error:', sdkMethodError)
            }
            // Re-throw to fall back to URL parsing
            throw sdkMethodError
          }
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.log('handleOAuthCallback method not found on SDK, trying to extract data from URL...')
          }
          throw new Error('SDK method not available')
        }
      } catch (sdkError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('SDK OAuth callback method error:', sdkError)
          console.log('Attempting to extract user data from callback URL...')
        }
        
        // Fallback: Try to extract user data from the callback URL
        // We need to check if we have code/state (OAuth flow) or if data is already in the URL
        try {
          const callbackUrl = new URL(callbackResult)
          
          if (process.env.NODE_ENV === 'development') {
            console.log('Callback URL:', callbackResult)
            console.log('Callback URL query params:', Object.fromEntries(callbackUrl.searchParams.entries()))
          }
          
          const code = callbackUrl.searchParams.get('code')
          const state = callbackUrl.searchParams.get('state')
          
          if (code && state) {

            // Endpoint: GET /api/v1/external/auth/google/callback
            if (process.env.NODE_ENV === 'development') {
              console.log('Found OAuth code and state, calling Cavos callback endpoint...')
              console.log('Code:', code.substring(0, 20) + '...')
              console.log('State:', state)
            }
            
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
            
            if (process.env.NODE_ENV === 'development') {
              console.log('Calling Cavos callback endpoint:', cavosCallbackUrl.replace(code, 'CODE_HIDDEN'))
            }
            
            // Call Cavos callback endpoint with redirect following
            // This should redirect to our final_redirect_uri with user data
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
            
            try {
              const response = await fetch(cavosCallbackUrl, {
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
            } catch (fetchError: any) {
              clearTimeout(timeoutId)
              
              if (process.env.NODE_ENV === 'development') {
                console.error('Error calling Cavos callback endpoint:', fetchError)
              }
              
              // If fetch fails, throw a more helpful error
              throw new Error(
                `Failed to process OAuth callback with Cavos. ` +
                `Received code and state but could not exchange them for user data. ` +
                `This may indicate a configuration issue with the OAuth flow. ` +
                `Error: ${fetchError.message}`
              )
            }
          }
          
          // Try to extract user data directly from query parameters
          let userDataFromParams: any = {}
          
          const userDataParam = callbackUrl.searchParams.get('user_data')
          if (userDataParam) {
            if (process.env.NODE_ENV === 'development') {
              console.log('=== Found user_data parameter ===')
              console.log('Raw user_data length:', userDataParam.length)
              console.log('Raw user_data (first 500 chars):', userDataParam.substring(0, 500))
            }
            
            try {
              try {
                userDataFromParams = JSON.parse(userDataParam)
                if (process.env.NODE_ENV === 'development') {
                  console.log('✅ Parsed user_data as direct JSON')
                }
              } catch (directParseError) {
                // Try URL decoded
                try {
                  const decoded = decodeURIComponent(userDataParam)
                  userDataFromParams = JSON.parse(decoded)
                  if (process.env.NODE_ENV === 'development') {
                    console.log('✅ Parsed user_data as URL-decoded JSON')
                  }
                } catch (urlDecodeError) {
                  // Try double URL decoded (sometimes it's encoded twice)
                  try {
                    const doubleDecoded = decodeURIComponent(decodeURIComponent(userDataParam))
                    userDataFromParams = JSON.parse(doubleDecoded)
                    if (process.env.NODE_ENV === 'development') {
                      console.log('✅ Parsed user_data as double URL-decoded JSON')
                    }
                  } catch (doubleDecodeError) {
                    // Try base64 encoded JSON
                    try {
                      const decoded = Buffer.from(userDataParam, 'base64').toString('utf-8')
                      userDataFromParams = JSON.parse(decoded)
                      if (process.env.NODE_ENV === 'development') {
                        console.log('✅ Parsed user_data as base64-encoded JSON')
                      }
                    } catch (base64Error) {
                      if (process.env.NODE_ENV === 'development') {
                        console.error('❌ Failed to parse user_data with all methods:', {
                          directParse: directParseError instanceof Error ? directParseError.message : String(directParseError),
                          urlDecode: urlDecodeError instanceof Error ? urlDecodeError.message : String(urlDecodeError),
                          doubleDecode: doubleDecodeError instanceof Error ? doubleDecodeError.message : String(doubleDecodeError),
                          base64: base64Error instanceof Error ? base64Error.message : String(base64Error)
                        })
                      }
                      throw base64Error
                    }
                  }
                }
              }
              
              if (process.env.NODE_ENV === 'development') {
                console.log('✅ Successfully parsed user_data:', JSON.stringify(userDataFromParams, null, 2))
                console.log('Parsed user_data type:', typeof userDataFromParams)
                console.log('Parsed user_data keys:', Object.keys(userDataFromParams))
              }
            } catch (parseError) {
              if (process.env.NODE_ENV === 'development') {
                console.error('❌ All parsing methods failed for user_data:', parseError)
                console.log('Raw user_data value:', userDataParam)
              }
              userDataFromParams = {}
            }
          }
          
          if (userDataFromParams && typeof userDataFromParams === 'object') {
            if (userDataFromParams.user && typeof userDataFromParams.user === 'object') {
              if (process.env.NODE_ENV === 'development') {
                console.log('Merging user_data.user into main object')
              }
              Object.assign(userDataFromParams, userDataFromParams.user)
            }
            if (userDataFromParams.data && typeof userDataFromParams.data === 'object') {
              if (process.env.NODE_ENV === 'development') {
                console.log('Merging user_data.data into main object')
              }
              Object.assign(userDataFromParams, userDataFromParams.data)
            }
          }
          
          if (process.env.NODE_ENV === 'development') {
            console.log('=== OAuth Callback Debug ===')
            if (userDataParam) {
              console.log('Raw user_data parameter (first 500 chars):', userDataParam.substring(0, 500))
              console.log('Parsed user_data structure:', JSON.stringify(userDataFromParams, null, 2))
              console.log('All keys in user_data:', Object.keys(userDataFromParams))
              console.log('user_id value:', userDataFromParams.user_id)
              console.log('email value:', userDataFromParams.email)
              console.log('wallet value:', userDataFromParams.wallet)
              console.log('org_id value:', userDataFromParams.org_id)
            } else {
              console.log('No user_data parameter found in URL')
            }
            console.log('All URL params:', Array.from(callbackUrl.searchParams.keys()))
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
                       
          if (process.env.NODE_ENV === 'development') {
            console.log('=== Field Extraction ===')
            console.log('userId extracted:', userId || 'NOT FOUND')
            console.log('email extracted:', email || 'NOT FOUND')
            if (userDataFromParams && typeof userDataFromParams === 'object') {
              console.log('userDataFromParams.user_id:', userDataFromParams.user_id)
              console.log('userDataFromParams.email:', userDataFromParams.email)
            }
          }
          
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
                             
          if (process.env.NODE_ENV === 'development') {
            console.log('accessToken extracted:', accessToken ? 'FOUND' : 'NOT FOUND (this is normal for OAuth)')
          }
          
          const refreshToken = (userDataFromParams && userDataFromParams.refresh_token) ||
                              (userDataFromParams && userDataFromParams.refreshToken) ||
                              (userDataFromParams && userDataFromParams.authData?.refreshToken) ||
                              (userDataFromParams && userDataFromParams.auth?.refreshToken) ||
                              callbackUrl.searchParams.get('refresh_token') || 
                              callbackUrl.searchParams.get('refreshToken')
          
          let wallet = (userDataFromParams && userDataFromParams.wallet) || undefined
          if (!wallet) {
            const walletParam = callbackUrl.searchParams.get('wallet') || 
                               callbackUrl.searchParams.get('wallet_address')
            if (walletParam) {
              try {
                // Try to parse as JSON if it's a string
                wallet = JSON.parse(walletParam)
              } catch {
                wallet = walletParam
              }
            }
          }
          
          // Organization - can be object or just org_id
          let organization = (userDataFromParams && userDataFromParams.organization) || undefined
          if (!organization && userDataFromParams && userDataFromParams.org_id) {
            organization = { org_id: userDataFromParams.org_id, org_name: '' }
          }
          if (!organization) {
            const orgParam = callbackUrl.searchParams.get('organization') || 
                            callbackUrl.searchParams.get('org_id')
            if (orgParam) {
              try {
                organization = JSON.parse(orgParam)
              } catch {
                const orgIdNum = parseInt(orgParam)
                if (!isNaN(orgIdNum)) {
                  organization = { org_id: orgIdNum, org_name: '' }
                }
              }
            }
          }
          
          // Final values
          const finalUserId = userId
          const finalEmail = email
          const finalAccessToken = accessToken
          const finalRefreshToken = refreshToken
          const finalWallet = wallet
          const finalOrganization = organization
          
          if (finalUserId || finalEmail) {
            result = {
              data: {
                user_id: finalUserId || finalEmail,
                email: finalEmail || '',
                access_token: finalAccessToken || undefined,
                refresh_token: finalRefreshToken || undefined,
                wallet: finalWallet || undefined,
                organization: finalOrganization || undefined,
                org_id: userDataFromParams.org_id || organization?.org_id || undefined,
                expires_in: callbackUrl.searchParams.get('expires_in') || 
                           userDataFromParams.expires_in || 
                           userDataFromParams.expiresIn || 
                           (finalAccessToken ? '3600' : undefined)
              }
            }
            
            if (!finalAccessToken) {
              if (process.env.NODE_ENV === 'development') {
                console.warn('OAuth callback received user data but no access_token. User may need to authenticate via email/password or token generation may be required.')
              }
            }
            
            if (process.env.NODE_ENV === 'development') {
              console.log('Extracted user data from callback URL:', {
                source: userDataParam ? 'user_data parameter' : 'individual parameters',
                userId: result.data.user_id,
                email: result.data.email,
                hasAccessToken: !!result.data.access_token,
                hasRefreshToken: !!result.data.refresh_token,
                hasWallet: !!result.data.wallet,
                walletData: userDataFromParams.wallet
              })
            }
          } else {
            // Log what we found for debugging
            if (process.env.NODE_ENV === 'development') {
              console.error('Missing required fields in callback URL:', {
                hasCode: !!code,
                hasState: !!state,
                hasUserDataParam: !!userDataParam,
                userDataFromParams: userDataFromParams,
                hasUserId: !!finalUserId,
                hasEmail: !!finalEmail,
                hasAccessToken: !!finalAccessToken,
                allParams: Object.fromEntries(callbackUrl.searchParams.entries())
              })
            }
            
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
          if (process.env.NODE_ENV === 'development') {
            console.error('Failed to extract data from URL:', urlError)
          }
          // If we can't extract data, provide a more helpful error message
          const errorMsg = urlError instanceof Error ? urlError.message : 'Unknown error'
          throw new Error(
            `OAuth callback processing failed: ${errorMsg}. ` +
            `SDK error: ${sdkError instanceof Error ? sdkError.message : 'Unknown'}. ` +
            `Please verify the callback URL format and ensure Cavos is configured correctly.`
          )
        }
      }
      
      // Extract data from the response
      const data = result.data || result
      
      // Extract user info
      const userId = data.user_id || data.user?.id || data.id || data.userId
      const email = data.email || data.user?.email
      const wallet = data.wallet || data.user?.wallet
      const organization = data.organization || data.user?.organization || (data.org_id ? { org_id: data.org_id } : undefined)
      
      // Extract tokens (may be undefined for OAuth flows)
      const accessToken = data.authData?.accessToken || data.access_token || data.accessToken || data.token
      const refreshToken = data.authData?.refreshToken || data.refresh_token || data.refreshToken
      
      if ((userId || email) && !accessToken) {
        if (process.env.NODE_ENV === 'development') {
          console.log('OAuth callback: User authenticated but no access_token provided. This may require additional authentication step.')
        }
        
        const userData: any = {
          user: {
            id: userId || email || '',
            email: email || '',
            organization: organization || undefined
          },
          wallet: wallet || undefined,
          access_token: '',
          refresh_token: '',
          expires_in: 0,
          timestamp: Date.now(),
          requires_password: true,
          oauth_authenticated: true
        }
        
        return NextResponse.json(userData)
      }
      
      // Standard response with tokens
      const userData: CavosNormalizedResponse = {
        user: {
          id: userId || email || '',
          email: email || '',
          organization: organization
        },
        wallet: wallet,
        access_token: accessToken || '',
        refresh_token: refreshToken || '',
        expires_in: data.authData?.expiresIn || data.expires_in || data.expiresIn || 3600,
        timestamp: data.authData?.timestamp || data.timestamp || Date.now()
      }

      return NextResponse.json(userData)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'OAuth callback failed'
      const errorCode = (error as any)?.code
      
      let statusCode = 400
      if (errorMessage.toLowerCase().includes('invalid') || errorMessage.toLowerCase().includes('invalid token')) {
        statusCode = 401
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.error('OAuth callback error:', error)
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          code: errorCode
        },
        { status: statusCode }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
