export interface CavosUser {
  id?: string
  email: string
  organization?: {
    org_id: number
    org_name: string
  }
  wallet?: {
    id: number
    org_id: number
    public_key: string
    private_key: string
    created_at: string
    address: string
    network: string
    user_id: string
    transactions: any
  }
}

export interface CavosAuthData {
  accessToken: string
  refreshToken: string
  expiresIn: number
  timestamp: number
  user_id: string
  email: string
  org_id: number
}

export interface CavosAuthResponse {
  success: boolean
  message: string
  data: {
    user_id: string
    email: string
    organization: {
      org_id: number
      org_name: string
    }
    wallet: CavosUser['wallet']
    authData: CavosAuthData
  }
}

// Normalized response for frontend use
export interface CavosNormalizedResponse {
  user: {
    id: string
    email: string
    organization: {
      org_id: number
      org_name: string
    }
  }
  wallet: CavosUser['wallet']
  access_token: string
  refresh_token: string
  expires_in: number
  timestamp: number
}

export interface CavosTransactionCall {
  contractAddress: string
  entrypoint: string
  calldata: string[]
}

export interface CavosTransactionResult {
  txHash: string
  accessToken?: string
}

export interface CavosTokenRefreshResult {
  access_token: string
  refresh_token: string
}

export interface CavosConfig {
  appId: string
  orgSecret: string
  apiKey: string
  baseURL: string
  defaultNetwork: 'sepolia' | 'mainnet'
  debug?: boolean
  timeout?: number
}

export type AuthType = 'wallet' | 'cavos' | 'none'

export interface AuthState {
  type: AuthType
  user: CavosUser | { address: string } | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface PasswordResetResponse {
  message: string
  timestamp: number
}

export interface PasswordResetConfirmResponse {
  message: string
  timestamp: number
}
