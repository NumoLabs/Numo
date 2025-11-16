import { CavosAuth, getBalanceOf } from 'cavos-service-sdk'

interface ErrorWithStatus extends Error {
  status?: number
  code?: string
}

interface ApiErrorResponse {
  error?: string
  code?: string
}

// Environment variables setup
const config = {
  appId: process.env.NEXT_PUBLIC_CAVOS_APP_ID!,
  orgSecret: process.env.NEXT_PUBLIC_CAVOS_ORG_SECRET!,
  apiKey: process.env.NEXT_PUBLIC_CAVOS_API_KEY!,
  baseURL: 'https://services.cavos.xyz/api/v1/external',
  defaultNetwork: 'mainnet' // or 'sepolia'
}

// Validate required environment variables
if (!config.appId || !config.orgSecret || !config.apiKey) {
  throw new Error(
    'Missing required Cavos environment variables. Please check your .env.local file and ensure NEXT_PUBLIC_CAVOS_APP_ID, NEXT_PUBLIC_CAVOS_ORG_SECRET, and NEXT_PUBLIC_CAVOS_API_KEY are set.'
  )
}

// Initialize CavosAuth instance
export const cavosAuth = new CavosAuth(config.defaultNetwork, config.appId)

// Get environment-specific configuration
export const getCavosConfig = () => {

  const customApiUrl = process.env.NEXT_PUBLIC_CAVOS_API_URL
  const baseURL = customApiUrl || 'https://services.cavos.xyz/api/v1/external'
  
  const isDevelopment = process.env.NODE_ENV === 'development'
  const defaultNetwork = process.env.NEXT_PUBLIC_CAVOS_NETWORK || 'mainnet'
  
  return {
    appId: process.env.NEXT_PUBLIC_CAVOS_APP_ID!,
    orgSecret: process.env.NEXT_PUBLIC_CAVOS_ORG_SECRET!,
    apiKey: process.env.NEXT_PUBLIC_CAVOS_API_KEY!,
    baseURL,
    defaultNetwork,
    
    // Development-specific settings
    debug: isDevelopment,
    timeout: isDevelopment ? 30000 : 10000
  }
}

// Create environment-specific CavosAuth instance
export const createCavosAuth = () => {
  const config = getCavosConfig()
  return new CavosAuth(config.defaultNetwork, config.appId)
}

export const authenticateUser = async (email: string, password: string, action: 'signup' | 'signin' = 'signup') => {
  try {
    const response = await fetch('/api/cavos/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        action
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      return result
    } else {
      const errorData = await response.json().catch(() => ({ error: 'Request failed' }))
      const errorMessage = errorData.error || `${action === 'signup' ? 'Registration' : 'Sign in'} failed`
      const errorCode = errorData.code
      
      // If signing up and user already exists, try to sign in
      if (action === 'signup' && (response.status === 409 || errorData.error?.toLowerCase().includes('already exists'))) {
        const signInResponse = await fetch('/api/cavos/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password,
            action: 'signin'
          })
        })
        
        if (signInResponse.ok) {
          const signInResult = await signInResponse.json()
          return signInResult
        } else {
          const signInError = await signInResponse.json().catch(() => ({ error: 'Sign in failed' }))
          // Create error with proper message
          const signInErrorMessage = signInError.error || 'Sign in failed'
          const authError = new Error(signInErrorMessage) as ErrorWithStatus
          // Preserve status code and error code if available
          if (signInResponse.status) {
            authError.status = signInResponse.status
          }
          if (signInError.code) {
            authError.code = signInError.code
          }
          throw authError
        }
      } else {
        // Create error with proper message and status
        const authError = new Error(errorMessage) as ErrorWithStatus
        if (response.status) {
          authError.status = response.status
        }
        if (errorCode) {
          authError.code = errorCode
        }
        throw authError
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
    throw error
    }
    throw new Error('Authentication failed')
  }
}

// Helper function to parse Cavos error messages
const parseCavosError = (error: unknown): { message: string; code?: string; status?: number } => {
  if (!(error instanceof Error)) {
    return { message: 'Authentication failed' }
  }

  let errorMessage = error.message
  let errorCode: string | undefined
  let statusCode: number | undefined

  try {
    const jsonMatch = errorMessage.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const errorJson = JSON.parse(jsonMatch[0])
      if (errorJson.error) {
        errorMessage = errorJson.error
      }
      if (errorJson.code) {
        errorCode = errorJson.code
      }
    }

    const statusMatch = errorMessage.match(/(\d{3})\s*\{/)
    if (statusMatch) {
      statusCode = parseInt(statusMatch[1], 10)
    }
  } catch {
    // Ignore parse errors
  }

  // Create a new error with the parsed message
  const parsedError = new Error(errorMessage) as ErrorWithStatus
  if (errorCode) {
    parsedError.code = errorCode
  }
  if (statusCode) {
    parsedError.status = statusCode
  }

  return {
    message: errorMessage,
    code: errorCode,
    status: statusCode
  }
}

// Direct SDK authentication 
export const authenticateUserDirect = async (email: string, password: string) => {
  try {
    // Register new user
    const signUpResult = await cavosAuth.signUp(
      email,
      password,
      config.orgSecret
    )
    
    return signUpResult
  } catch (error: unknown) {
    const parsedError = parseCavosError(error)
    
    // If user already exists, try to sign in
    if (parsedError.message?.toLowerCase().includes('already exists') || 
        parsedError.message?.toLowerCase().includes('already registered') ||
        parsedError.message?.toLowerCase().includes('already has an account')) {
      
      try {
        const signInResult = await cavosAuth.signIn(
          email,
          password,
          config.orgSecret
        )
        
        return signInResult
      } catch (signInError: unknown) {
        const parsedSignInError = parseCavosError(signInError)
        const signInErr = new Error(parsedSignInError.message) as ErrorWithStatus
        if (parsedSignInError.code) {
          signInErr.code = parsedSignInError.code
        }
        if (parsedSignInError.status) {
          signInErr.status = parsedSignInError.status
        }
        throw signInErr
      }
    }
    
    // Throw the parsed error
    const err = new Error(parsedError.message) as ErrorWithStatus
    if (parsedError.code) {
      err.code = parsedError.code
    }
    if (parsedError.status) {
      err.status = parsedError.status
    }
    throw err
  }
}

// Transaction execution (session-based)
export const executeTransaction = async (
  accessToken: string,
  walletAddress: string,
  calls: unknown[]
) => {
  try {
    const result = await cavosAuth.executeCalls(
      walletAddress,
      calls,
      accessToken
    )
    
    // Handle potential token refresh
    if (result.accessToken) {
      console.log('Token automatically refreshed')
      // Update stored token
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', result.accessToken)
      }
    }
    return result
  } catch (error) {
    console.error('Transaction failed:', error)
    throw error
  }
}

// Balance checking
export const checkTokenBalance = async (
  walletAddress: string,
  tokenAddress: string,
  decimals: string = '18'
) => {
  try {
    const balance = await getBalanceOf(
      walletAddress,
      tokenAddress,
      decimals,
      config.apiKey
    )
    
    return balance
  } catch (error) {
    console.error('Balance check failed:', error)
    throw error
  }
}

// Token refresh helper
export const refreshUserToken = async (refreshToken: string) => {
  try {
    const result = await cavosAuth.refreshToken(refreshToken, config.defaultNetwork)
    return result
  } catch (error: unknown) {
    // Check if error is due to expired/invalid refresh token (401)
    // Don't log these errors here as they're handled gracefully in the hook
    const errorObj = error as { status?: number; response?: { status?: number }; message?: string }
    const isExpiredTokenError = 
      errorObj?.status === 401 ||
      errorObj?.response?.status === 401 ||
      (errorObj?.message && (
        errorObj.message.includes('401') ||
        errorObj.message.includes('Invalid or expired refresh token') ||
        errorObj.message.toLowerCase().includes('unauthorized')
      )) ||
      (typeof error === 'string' && error.includes('401')) ||
      (typeof error === 'object' && JSON.stringify(error).includes('Invalid or expired refresh token'))
    
    if (!isExpiredTokenError) {
      // Only log non-401 errors (network issues, etc.)
      console.error('Token refresh failed:', error)
    }
    
    throw error
  }
}

// Transaction execution helper 
export const executeUserTransaction = async (
  walletAddress: string,
  calls: unknown[],
  accessToken: string
) => {
  try {
    const result = await cavosAuth.executeCalls(walletAddress, calls, accessToken)
    return result
  } catch (error) {
    console.error('Transaction execution failed:', error)
    throw error
  }
}

// Password reset - request reset email
export const requestPasswordReset = async (email: string) => {
  try {
    const response = await fetch('/api/cavos/password-reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    })
    
    if (response.ok) {
      const result = await response.json()
      return result
    } else {
      const errorData = await response.json().catch(() => ({ error: 'Password reset request failed' })) as ApiErrorResponse
      const error = new Error(errorData.error || 'Password reset request failed') as ErrorWithStatus
      if (response.status) {
        error.status = response.status
      }
      if (errorData.code) {
        error.code = errorData.code
      }
      throw error
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Password reset request failed')
  }
}

// Password reset - confirm reset with token and new password
export const confirmPasswordReset = async (token: string, newPassword: string) => {
  try {
    const response = await fetch('/api/cavos/password-reset/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, newPassword })
    })
    
    if (response.ok) {
      const result = await response.json()
      return result
    } else {
      const errorData = await response.json().catch(() => ({ error: 'Password reset confirmation failed' })) as ApiErrorResponse
      const error = new Error(errorData.error || 'Password reset confirmation failed') as ErrorWithStatus
      if (response.status) {
        error.status = response.status
      }
      if (errorData.code) {
        error.code = errorData.code
      }
      throw error
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Password reset confirmation failed')
  }
}

export const getGoogleOAuthUrl = async (redirectUri: string) => {
  try {
    const response = await fetch('/api/cavos/oauth/google/url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ redirectUri })
    })
    
    if (response.ok) {
      const result = await response.json()
      return result.url
    } else {
      const errorData = await response.json().catch(() => ({ error: 'Failed to get Google OAuth URL' })) as ApiErrorResponse
      const error = new Error(errorData.error || 'Failed to get Google OAuth URL') as ErrorWithStatus
      if (response.status) {
        error.status = response.status
      }
      if (errorData.code) {
        error.code = errorData.code
      }
      throw error
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to get Google OAuth URL')
  }
}

export const getAppleOAuthUrl = async (redirectUri: string) => {
  try {
    const response = await fetch('/api/cavos/oauth/apple/url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ redirectUri })
    })
    
    if (response.ok) {
      const result = await response.json()
      return result.url
    } else {
      const errorData = await response.json().catch(() => ({ error: 'Failed to get Apple OAuth URL' })) as ApiErrorResponse
      const error = new Error(errorData.error || 'Failed to get Apple OAuth URL') as ErrorWithStatus
      if (response.status) {
        error.status = response.status
      }
      if (errorData.code) {
        error.code = errorData.code
      }
      throw error
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to get Apple OAuth URL')
  }
}

export const handleOAuthCallback = async (callbackResult: string) => {
  try {
    const response = await fetch('/api/cavos/oauth/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ callbackResult })
    })
    
    if (response.ok) {
      const result = await response.json()
      return result
    } else {
      const errorData = await response.json().catch(() => ({ error: 'OAuth callback failed' })) as ApiErrorResponse
      const error = new Error(errorData.error || 'OAuth callback failed') as ErrorWithStatus
      if (response.status) {
        error.status = response.status
      }
      if (errorData.code) {
        error.code = errorData.code
      }
      throw error
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('OAuth callback failed')
  }
}

export default config
