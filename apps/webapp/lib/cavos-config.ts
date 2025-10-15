import { CavosAuth, getBalanceOf } from 'cavos-service-sdk'

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
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  return {
    appId: process.env.NEXT_PUBLIC_CAVOS_APP_ID!,
    orgSecret: process.env.NEXT_PUBLIC_CAVOS_ORG_SECRET!,
    apiKey: process.env.NEXT_PUBLIC_CAVOS_API_KEY!,
    baseURL: isDevelopment 
      ? 'https://services-dev.cavos.xyz/api/v1/external'
      : 'https://services.cavos.xyz/api/v1/external',
    defaultNetwork: isDevelopment ? 'sepolia' : 'mainnet',
    
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

// Authentication flow helper using local API route
export const authenticateUser = async (email: string, password: string) => {
  try {
    // Try to register new user first using local API route
    const signUpResponse = await fetch('/api/cavos/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        action: 'signup'
      })
    })
    
    if (signUpResponse.ok) {
      const signUpResult = await signUpResponse.json()
      return signUpResult
    } else {
      const errorData = await signUpResponse.json()
      
      // If user already exists, try to sign in
      if (signUpResponse.status === 409 || errorData.error?.includes('already exists')) {
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
          const signInError = await signInResponse.json()
          throw new Error(signInError.error || 'Sign in failed')
        }
      } else {
        throw new Error(errorData.error || 'Registration failed')
      }
    }
  } catch (error: unknown) {
    console.error('Authentication error:', error)
    throw error
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
    // If user already exists, try to sign in
    if (error instanceof Error && (error.message?.includes('already exists') || 
        error.message?.includes('already registered') ||
        error.message?.includes('already has an account'))) {
      
      try {
        const signInResult = await cavosAuth.signIn(
          email,
          password,
          config.orgSecret
        )
        
        return signInResult
      } catch (signInError: unknown) {
        console.error('Sign in also failed:', signInError)
        throw signInError
      }
    }
    
    // If it's not a "user already exists" error, throw the original error
    throw error
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
  } catch (error) {
    console.error('Token refresh failed:', error)
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

export default config
