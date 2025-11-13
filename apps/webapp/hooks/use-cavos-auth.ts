"use client"

import { useState, useCallback, useEffect } from 'react'
import { authenticateUser, refreshUserToken, executeTransaction, requestPasswordReset, confirmPasswordReset, getGoogleOAuthUrl, getAppleOAuthUrl, handleOAuthCallback } from '@/lib/cavos-config'
import type { PasswordResetResponse, PasswordResetConfirmResponse } from '@/types/cavos'

interface CavosUser {
  id: string
  email: string
  wallet: {
    address: string
  }
}

interface AuthState {
  user: CavosUser | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  isInitialized: boolean
}

export function useCavosAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isInitialized: false
  })

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      // Only run on client side
      if (typeof window === 'undefined') {
        setAuthState(prev => ({
          ...prev,
          isInitialized: true
        }))
        return
      }

      try {
        const storedAccessToken = localStorage.getItem('cavos_access_token')
        const storedRefreshToken = localStorage.getItem('cavos_refresh_token')
        const storedUser = localStorage.getItem('cavos_user')

        // Check if we have stored auth data
        const hasStoredData = storedAccessToken && storedRefreshToken && storedUser && storedUser !== 'undefined'

        // Validate that all required data exists and is valid
        if (hasStoredData) {
          try {
            const parsedUser = JSON.parse(storedUser)
            
            // Additional validation to ensure user object has required fields
            if (parsedUser && typeof parsedUser === 'object' && parsedUser.email) {
              setAuthState({
                user: parsedUser,
                accessToken: storedAccessToken,
                refreshToken: storedRefreshToken,
                isAuthenticated: true,
                isLoading: false,
                error: null,
                isInitialized: true
              })
              
              // Dispatch custom event to notify other components
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('cavos-auth-update', { 
                  detail: { isAuthenticated: true, user: parsedUser } 
                }))
              }
              
              return
            } else {
              throw new Error('Invalid user data structure')
            }
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError)
            throw parseError
          }
        }
        
        // If no valid stored data, mark as initialized but not authenticated
        setAuthState(prev => ({
          ...prev,
          isInitialized: true
        }))
      } catch (error) {
        console.error('Error initializing auth state:', error)
        // Clear invalid stored data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cavos_access_token')
          localStorage.removeItem('cavos_refresh_token')
          localStorage.removeItem('cavos_user')
        }
        
        // Mark as initialized but not authenticated
        setAuthState(prev => ({
          ...prev,
          isInitialized: true
        }))
      }
    }

    initializeAuth()
  }, [])

  // Store auth data in localStorage
  const storeAuthData = useCallback((user: CavosUser, accessToken: string, refreshToken: string) => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return
    }

    try {
      // Validate user object before storing - more flexible validation
      if (!user || typeof user !== 'object') {
        throw new Error('Invalid user object: not an object')
      }
      
      // Check if user has email property (direct or nested)
      const userEmail = user.email || (user as any)?.user?.email || (user as any)?.data?.email
      if (!userEmail) {
        throw new Error('Invalid user object: missing email')
      }
      
      // Create a normalized user object
      const normalizedUser = {
        id: user.id || (user as any)?.user?.id || (user as any)?.data?.id,
        email: userEmail,
        wallet: user.wallet || (user as any)?.user?.wallet || (user as any)?.data?.wallet
      }
      
      localStorage.setItem('cavos_access_token', accessToken)
      localStorage.setItem('cavos_refresh_token', refreshToken)
      localStorage.setItem('cavos_user', JSON.stringify(normalizedUser))
    } catch (error) {
      console.error('Error storing auth data:', error)
      // Clear any partial data
      clearAuthData()
      throw error
    }
  }, [])

  // Clear auth data from localStorage
  const clearAuthData = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('cavos_access_token')
        localStorage.removeItem('cavos_refresh_token')
        localStorage.removeItem('cavos_user')
      } catch (error) {
        console.error('Error clearing auth data:', error)
      }
    }
  }, [])

  // Reset auth state and clear localStorage
  const resetAuth = useCallback(() => {
    setAuthState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isInitialized: true
    })
    clearAuthData()
  }, [clearAuthData])

  // Sign up or sign in user
  const signIn = useCallback(async (email: string, password: string, action: 'signup' | 'signin' = 'signup') => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const result = await authenticateUser(email, password, action)
      
      // Handle the normalized response structure from our API
      const user = result.user
      const accessToken = result.access_token
      const refreshToken = result.refresh_token
      
      const newAuthState = {
        user: user,
        accessToken: accessToken,
        refreshToken: refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        isInitialized: true
      }
      
      // Update state immediately
      setAuthState(newAuthState)
      
      // Store in localStorage
      storeAuthData(user, accessToken, refreshToken)
      
      // Dispatch custom event to notify other components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cavos-auth-update', { 
          detail: { isAuthenticated: true, user } 
        }))
      }

      return result
    } catch (error: any) {
      // Improve error messages for better user experience
      let errorMessage = 'Authentication failed'
      
      if (error?.message) {
        const message = error.message.toLowerCase()
        
        if (message.includes('password must contain') || 
            message.includes('invalid_password') ||
            message.includes('password requirements') ||
            error?.code === 'INVALID_PASSWORD') {

          errorMessage = error.message.charAt(0).toUpperCase() + error.message.slice(1)
          // Ensure it ends with a period
          if (!errorMessage.endsWith('.') && !errorMessage.endsWith('!')) {
            errorMessage += '.'
          }
        } else if (message.includes('invalid email') || message.includes('invalid password') || 
                   message.includes('invalid credentials') || message.includes('wrong password') ||
                   error?.status === 401) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.'
        } else if (message.includes('already registered') || message.includes('already has an account') ||
                   message.includes('already exists')) {
          errorMessage = 'This email is already registered. Please sign in instead.'
        } else if (message.includes('network') || message.includes('fetch') || 
                   message.includes('timeout') || error?.status === 503) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else {
          errorMessage = error.message
            .replace(/^(signUp|signIn)\s+failed:\s*/gi, '')
            .replace(/\s*\d{3}\s*\{[\s\S]*\}/g, '')
            .trim()
          
          // Capitalize first letter
          if (errorMessage) {
            errorMessage = errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1)
            // Ensure it ends with punctuation
            if (!errorMessage.endsWith('.') && !errorMessage.endsWith('!') && !errorMessage.endsWith('?')) {
              errorMessage += '.'
            }
          } else {
            errorMessage = 'Authentication failed. Please try again.'
          }
        }
      }
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        isInitialized: true
      }))
      
      return null
    }
  }, [storeAuthData])

  // Sign out user
  const signOut = useCallback(() => {
    resetAuth()
  }, [resetAuth])

  // Refresh access token
  const refreshToken = useCallback(async () => {
    if (!authState.refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const result = await refreshUserToken(authState.refreshToken)
      
      const newAuthState = {
        ...authState,
        accessToken: result.access_token,
        refreshToken: result.refresh_token
      }

      setAuthState(newAuthState)
      storeAuthData(authState.user!, result.access_token, result.refresh_token)

      return result
    } catch (error: any) {
      signOut()
      throw error
    }
  }, [authState, storeAuthData, signOut])

  // Execute transaction with automatic token refresh
  const executeCavosTransaction = useCallback(async (
    walletAddress: string,
    calls: any[]
  ) => {
    if (!authState.accessToken) {
      throw new Error('No access token available')
    }

    try {
      const result = await executeTransaction(
        authState.accessToken,
        walletAddress,
        calls
      )

      // Handle potential token refresh from transaction
      if (result.accessToken) {
        const newAuthState = {
          ...authState,
          accessToken: result.accessToken
        }
        setAuthState(newAuthState)
        storeAuthData(authState.user!, result.accessToken, authState.refreshToken!)
      }

      return result
    } catch (error: any) {
      // If token is expired, try to refresh and retry
      if (error.message?.includes('token') || error.message?.includes('unauthorized')) {
        try {
          await refreshToken()
          // Retry the transaction with new token
          const retryResult = await executeTransaction(
            authState.accessToken!,
            walletAddress,
            calls
          )
          return retryResult
        } catch (refreshError) {
          throw refreshError
        }
      }
      throw error
    }
  }, [authState, storeAuthData, refreshToken])

  // Clear error manually
  const clearError = useCallback(() => {
    setAuthState(prev => ({
      ...prev,
      error: null
    }))
  }, [])

  // Password reset - request reset email
  const passwordReset = useCallback(async (email: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const result = await requestPasswordReset(email)
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: null
      }))
      return result as PasswordResetResponse
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to request password reset'
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
      throw error
    }
  }, [])

  // Password reset - confirm with token and new password
  const passwordResetConfirm = useCallback(async (token: string, newPassword: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const result = await confirmPasswordReset(token, newPassword)
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: null
      }))
      return result as PasswordResetConfirmResponse
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to confirm password reset'
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
      throw error
    }
  }, [])

  // Get Google OAuth URL
  const getGoogleOAuthUrlHandler = useCallback(async (redirectUri: string) => {
    try {
      const url = await getGoogleOAuthUrl(redirectUri)
      return url
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to get Google OAuth URL'
      setAuthState(prev => ({
        ...prev,
        error: errorMessage
      }))
      throw error
    }
  }, [])

  // Get Apple OAuth URL
  const getAppleOAuthUrlHandler = useCallback(async (redirectUri: string) => {
    try {
      const url = await getAppleOAuthUrl(redirectUri)
      return url
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to get Apple OAuth URL'
      setAuthState(prev => ({
        ...prev,
        error: errorMessage
      }))
      throw error
    }
  }, [])

  // Handle OAuth callback
  const handleOAuthCallbackHandler = useCallback(async (callbackResult: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const result = await handleOAuthCallback(callbackResult)
      
      // Handle the normalized response structure
      const user = result.user
      const accessToken = result.access_token
      const refreshToken = result.refresh_token
      
      // Check if OAuth returned user but requires password (partial authentication)
      if ((result as any).requires_password && (result as any).oauth_authenticated) {
        // OAuth user authenticated but needs to complete with password
        setAuthState(prev => ({
          ...prev,
          user: user,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'OAuth authentication successful. Please enter your password to complete login.',
          isInitialized: true
        }))
        
        return { ...result, requires_password: true }
      }
      
      const newAuthState = {
        user: user,
        accessToken: accessToken,
        refreshToken: refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        isInitialized: true
      }
      
      setAuthState(newAuthState)
      storeAuthData(user, accessToken, refreshToken)
      
      // Dispatch custom event to notify other components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cavos-auth-update', { 
          detail: { isAuthenticated: true, user } 
        }))
      }

      return result
    } catch (error: any) {
      const errorMessage = error?.message || 'OAuth callback failed'
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
      throw error
    }
  }, [storeAuthData])

  return {
    // State
    user: authState.user,
    accessToken: authState.accessToken,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,
    isInitialized: authState.isInitialized,
    
    // Actions
    signIn,
    signOut,
    refreshToken,
    executeTransaction: executeCavosTransaction,
    resetAuth,
    clearError,
    passwordReset,
    passwordResetConfirm,
    getGoogleOAuthUrl: getGoogleOAuthUrlHandler,
    getAppleOAuthUrl: getAppleOAuthUrlHandler,
    handleOAuthCallback: handleOAuthCallbackHandler
  }
}
