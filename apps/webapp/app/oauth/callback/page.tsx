'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function OAuthCallbackPage() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the callback result from URL (the full URL including query params)
        // Cavos redirects to this page with user data in query params after OAuth
        const callbackResult = window.location.href
        const url = new URL(callbackResult)
        
        // Check if we're in a popup window (opened by parent)
        const isPopup = window.opener && !window.opener.closed
        
        // Check for error in URL
        const error = url.searchParams.get('error')
        const errorDescription = url.searchParams.get('error_description')
        
        if (error) {
          // OAuth error occurred
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
        
        // According to Cavos Swagger documentation:
        // 1. User is redirected to OAuth provider (Google/Apple)
        // 2. OAuth provider redirects to Cavos callback with code and state
        // 3. Cavos callback endpoint processes and redirects to final_redirect_uri with user data
        // 
        // Check if we have code/state (means we're at step 2, need to call Cavos callback)
        // OR if we have user data (means we're at step 3, Cavos already processed)
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
        
        // If we have code and state but no user data, we need to call Cavos callback endpoint
        // This happens when OAuth provider redirects directly to us instead of to Cavos first
        if (code && state && !url.searchParams.get('user_id') && !url.searchParams.get('access_token')) {
          // We need to redirect to Cavos callback endpoint
          // The endpoint will process the code/state and redirect back to us with user data
          
          // Determine provider - check if we have a provider param, or infer from URL
          // We can also check localStorage for the provider we used
          const storedProvider = localStorage.getItem('oauth_provider') || 'google'
          const isGoogle = storedProvider === 'google' || url.pathname.includes('google')
          const provider = isGoogle ? 'google' : 'apple'
          
          // Build Cavos callback URL
          // Get config from environment variables (available in client-side via NEXT_PUBLIC_)
          const baseURL = process.env.NEXT_PUBLIC_CAVOS_API_URL || 'https://services.cavos.xyz/api/v1/external'
          const network = process.env.NEXT_PUBLIC_CAVOS_NETWORK || 'sepolia'
          const appId = process.env.NEXT_PUBLIC_CAVOS_APP_ID || ''
          
          // Construct final_redirect_uri - this should be our callback page
          const finalRedirectUri = `${url.origin}${url.pathname}`
          
          const cavosCallbackParams = new URLSearchParams({
            code: code,
            state: state || '',
            network: network,
            app_id: appId,
            final_redirect_uri: finalRedirectUri // Redirect back to this page after processing
          })
          
          // Include org_id if present in original URL
          const orgId = url.searchParams.get('org_id')
          if (orgId) {
            cavosCallbackParams.append('org_id', orgId)
          }
          
          const cavosCallbackUrl = `${baseURL}/auth/${provider}/callback?${cavosCallbackParams.toString()}`
          
          console.log('Redirecting to Cavos callback endpoint to exchange code for user data...')
          
          // Redirect to Cavos callback endpoint
          // Cavos will process and redirect back to final_redirect_uri with user data
          window.location.href = cavosCallbackUrl
          return
        }
        
        // If we have user data or no code/state, process normally
        // Send the callback URL to parent window (or process it)
        // The API route will handle extracting data
        if (isPopup) {
          // Send callback result to parent window via postMessage
          // The parent will call handleOAuthCallback which processes it via API
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
          // If not in popup, store callback result for processing
          localStorage.setItem('oauth_callback_result', callbackResult)
          
          // Redirect to home - the app should check localStorage and process the callback
          window.location.href = '/'
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

