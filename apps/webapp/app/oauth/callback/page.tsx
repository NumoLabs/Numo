'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function OAuthCallbackContent() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const callbackResult = window.location.href
        const url = new URL(callbackResult)
        
        const isPopup = window.opener && !window.opener.closed
        
        const error = url.searchParams.get('error')
        const errorDescription = url.searchParams.get('error_description')
        
        if (error) {
          const errorMessage = errorDescription || error || 'OAuth authentication failed'
          
          if (isPopup) {
            window.opener.postMessage(
              {
                type: 'OAUTH_ERROR',
                error: errorMessage
              },
              window.location.origin
            )
            window.close()
          } else {
            window.location.href = `/?error=${encodeURIComponent(errorMessage)}`
          }
          return
        }
        
        const code = url.searchParams.get('code')
        const state = url.searchParams.get('state')
        
        // Log all parameters for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log('OAuth callback received:', {
            hasCode: !!code,
            hasState: !!state,
            allParams: Object.fromEntries(url.searchParams.entries()),
            fullUrl: callbackResult
          })
        }
        
        // Check if we have user data directly in URL (after Cavos callback processing)
        const userId = url.searchParams.get('user_id')
        const accessToken = url.searchParams.get('access_token')
        
        if (userId && accessToken) {
          // We have user data directly in URL - process immediately
          console.log('OAuth callback has user data in URL, processing directly...')
          
          if (isPopup) {
            window.opener.postMessage(
              {
                type: 'OAUTH_CALLBACK',
                callbackResult: callbackResult
              },
              window.location.origin
            )
            window.close()
          } else {
            // Store callback result in both localStorage and sessionStorage for reliability
            // Also pass in URL as fallback (most reliable for Chrome mobile)
            try {
              localStorage.setItem('oauth_callback_result', callbackResult)
              sessionStorage.setItem('oauth_callback_result', callbackResult)
            } catch (storageError) {
              console.error('Error storing callback result:', storageError)
            }
            
            // Redirect immediately with callback in URL (most reliable for Chrome mobile)
            // The hook will check URL params first, then storage
            window.location.href = `/?oauth_callback=${encodeURIComponent(callbackResult)}`
          }
          return
        }
        
        if (code && state && !userId && !accessToken) {
          const storedProvider = localStorage.getItem('oauth_provider') || 'google'
          const isGoogle = storedProvider === 'google' || url.pathname.includes('google')
          const provider = isGoogle ? 'google' : 'apple'
          
          const baseURL = process.env.NEXT_PUBLIC_CAVOS_API_URL || 'https://services.cavos.xyz/api/v1/external'
          const network = process.env.NEXT_PUBLIC_CAVOS_NETWORK || 'sepolia'
          const appId = process.env.NEXT_PUBLIC_CAVOS_APP_ID || ''
          
          const finalRedirectUri = `${url.origin}${url.pathname}`
          
          const cavosCallbackParams = new URLSearchParams({
            code: code,
            state: state || '',
            network: network,
            app_id: appId,
            final_redirect_uri: finalRedirectUri // Redirect back to this page after processing
          })
          
          const orgId = url.searchParams.get('org_id')
          if (orgId) {
            cavosCallbackParams.append('org_id', orgId)
          }
          
          const cavosCallbackUrl = `${baseURL}/auth/${provider}/callback?${cavosCallbackParams.toString()}`
          
          console.log('Redirecting to Cavos callback endpoint to exchange code for user data...')
          
          window.location.href = cavosCallbackUrl
          return
        }
        
        if (isPopup) {
          window.opener.postMessage(
            {
              type: 'OAUTH_CALLBACK',
              callbackResult: callbackResult
            },
            window.location.origin
          )
          // Close the popup
          window.close()
        } else {
          // If not in popup, store callback result in both storages for reliability
          // Also pass in URL as fallback (most reliable for Chrome mobile)
          try {
            localStorage.setItem('oauth_callback_result', callbackResult)
            sessionStorage.setItem('oauth_callback_result', callbackResult)
          } catch (storageError) {
            console.error('Error storing callback result:', storageError)
          }
          
          // Redirect immediately with callback in URL (most reliable for Chrome mobile)
          // The hook will check URL params first, then storage
          window.location.href = `/?oauth_callback=${encodeURIComponent(callbackResult)}`
        }
      } catch (error) {
        console.error('OAuth callback error:', error)
        
        const errorMessage = error instanceof Error ? error.message : 'OAuth callback failed'
        
        // Send error to parent if in popup
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(
            {
              type: 'OAUTH_ERROR',
              error: errorMessage
            },
            window.location.origin
          )
          window.close()
        } else {
          // Redirect to home with error
          window.location.href = `/?error=${encodeURIComponent(errorMessage)}`
        }
      }
    }

    handleCallback()
  }, [searchParams])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-gray-400">Completing authentication...</p>
      </div>
    </div>
  )
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  )
}

