import { NextRequest, NextResponse } from 'next/server'
import { getCavosConfig } from '@/lib/cavos-config'

interface AegisAccount {
  getGoogleOAuthUrl?: (redirectUri: string) => Promise<string>
  [key: string]: unknown
}

interface ErrorWithCode extends Error {
  code?: string
}

interface ApiErrorResponse {
  error?: string
  message?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { redirectUri } = body

    if (!redirectUri) {
      return NextResponse.json(
        { error: 'Redirect URI is required' },
        { status: 400 }
      )
    }

    try {
      const config = getCavosConfig()
      
      let url: string | undefined
      
      // Try SDK method first
      let useFallback = false
      try {
        const { createCavosAuth } = await import('@/lib/cavos-config')
        const aegisAccount = createCavosAuth()
        
        // Log available methods for debugging
        if (process.env.NODE_ENV === 'development') {
          const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(aegisAccount))
          console.log('Available methods on aegisAccount:', methods.filter(m => typeof (aegisAccount as unknown as AegisAccount)[m] === 'function'))
        }
        
        const typedAccount = aegisAccount as unknown as AegisAccount
        if (typeof typedAccount.getGoogleOAuthUrl === 'function') {
          try {
            url = await typedAccount.getGoogleOAuthUrl(redirectUri)
            
            if (!url) {
              throw new Error('SDK method returned no URL')
            }
            
            if (process.env.NODE_ENV === 'development') {
              console.log('Successfully got Google OAuth URL from SDK:', url)
            }
            
            // If we got a URL from SDK, return it immediately
            return NextResponse.json({ url })
          } catch (sdkMethodError: unknown) {
            if (process.env.NODE_ENV === 'development') {
              console.error('SDK method execution error:', sdkMethodError)
            }
            // Use fallback
            useFallback = true
          }
        } else {
          // SDK method not available, use direct API call fallback
          if (process.env.NODE_ENV === 'development') {
            console.log('getGoogleOAuthUrl method not found on SDK, using direct API call')
          }
          useFallback = true
        }
      } catch (sdkError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('SDK OAuth method error:', sdkError)
        }
        useFallback = true
      }
      
      // Fallback: Direct API call (either SDK method not available or it failed)
      if (useFallback) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Attempting direct API call fallback...')
        }

        // Endpoint: GET /api/v1/external/auth/google
        const baseURL = config.baseURL
        
        // Build query parameters
        const params = new URLSearchParams({
          network: config.defaultNetwork,
          final_redirect_uri: redirectUri,
          app_id: config.appId
        })
        
        const apiUrl = `${baseURL}/auth/google?${params.toString()}`
        
        // Log for debugging in development
        if (process.env.NODE_ENV === 'development') {
          console.log('SDK method not available, using direct API call')
          console.log('Calling:', apiUrl)
          console.log('Config:', {
            hasApiKey: !!config.apiKey,
            hasAppId: !!config.appId,
            network: config.defaultNetwork,
            redirectUri,
            baseURL
          })
        }

        // Endpoint: GET /api/v1/external/auth/google
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout
        
        try {
          const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'PayStark/1.0'
            },
            signal: controller.signal,
            // Add redirect handling
            redirect: 'follow'
          })
          
          clearTimeout(timeoutId)
          
          if (!response.ok) {
            const errorText = await response.text()
            let errorData: ApiErrorResponse = {}
            try {
              errorData = JSON.parse(errorText) as ApiErrorResponse
            } catch {
              errorData = { error: errorText || `HTTP ${response.status}: Failed to get Google OAuth URL` }
            }
            
            if (process.env.NODE_ENV === 'development') {
              console.error('Cavos API error response:', {
                status: response.status,
                statusText: response.statusText,
                url: apiUrl,
                error: errorData,
                headers: Object.fromEntries(response.headers.entries())
              })
            }
            
            // Provide more specific error messages
            if (response.status === 400) {
              throw new Error(errorData.error || errorData.message || 'Bad request: Check that app_id, network, and final_redirect_uri are valid')
            } else if (response.status === 401) {
              throw new Error(errorData.error || errorData.message || 'Unauthorized: Invalid app_id or organization not active for mainnet')
            }
            
            throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: Failed to get Google OAuth URL`)
          }
          
          const result = await response.json()
          
          if (process.env.NODE_ENV === 'development') {
            console.log('Cavos API response:', result)
          }
          
          url = result.url || result.data?.url
          
          if (!url) {
            throw new Error('No OAuth URL returned from API. Response: ' + JSON.stringify(result))
          }
        } catch (fetchError: unknown) {
          clearTimeout(timeoutId)
          
          if (process.env.NODE_ENV === 'development') {
            console.error('Fetch error details:', fetchError)
            if (fetchError instanceof Error) {
              console.error('Error name:', fetchError.name)
              console.error('Error message:', fetchError.message)
              console.error('Error stack:', fetchError.stack)
            }
          }
          
          // Check if it's an AbortError (timeout)
          if (fetchError instanceof Error && fetchError.name === 'AbortError') {
            throw new Error(`Request timeout: The API request took too long. Please check your network connection and verify the API endpoint is accessible.`)
          }
          
          // Check if it's a network error
          if (fetchError instanceof TypeError) {
            if (fetchError.message.includes('fetch') || fetchError.message.includes('Failed to fetch')) {
              throw new Error(`Network error: Unable to connect to Cavos API at ${baseURL}. The API endpoint may not be accessible. Please verify the endpoint URL and check your network connection.`)
            }
          }
          
          // Re-throw the original error if it's already an Error
          if (fetchError instanceof Error) {
            throw fetchError
          }
          
          throw new Error(`Unknown error: ${String(fetchError)}`)
        }
      }
      
      if (!url) {
        throw new Error('No OAuth URL returned from API')
      }
      
      return NextResponse.json({ url })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get Google OAuth URL'
      const errorWithCode = error as ErrorWithCode
      const errorCode = errorWithCode?.code
      
      // Log the error for debugging
      if (process.env.NODE_ENV === 'development') {
        console.error('Google OAuth URL error:', error)
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          code: errorCode
        },
        { status: 400 }
      )
    }
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

