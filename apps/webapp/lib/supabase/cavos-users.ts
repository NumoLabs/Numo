import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'
import type { CavosUser } from '@/types/cavos'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    'Missing Supabase environment variables. ' +
    'Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env file.'
  )
}

// Use service role key for server-side operations to bypass RLS
const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

export type NetworkType = 'mainnet' | 'sepolia' | 'goerli' | 'devnet'
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending'

interface UpsertCavosUserParams {
  cavosUserId: string
  email: string
  orgId?: number
  orgName?: string
  username?: string
  avatarUrl?: string
  metadata?: Record<string, unknown>
}

interface UpsertCavosWalletParams {
  userId: string
  cavosWalletId?: number
  address: string
  network?: NetworkType
  isPrimary?: boolean
  metadata?: Record<string, unknown>
}

interface GetOrCreateCavosUserParams extends UpsertCavosUserParams {
  walletAddress?: string
  walletNetwork?: NetworkType
}

interface UserWithPrimaryWallet {
  id: string
  cavos_user_id: string
  email: string
  email_verified: boolean
  organization_id: number | null
  status: UserStatus
  username: string | null
  avatar_url: string | null
  last_login_at: string | null
  created_at: string
  updated_at: string
  metadata: Record<string, unknown>
  primary_wallet_address: string | null
  primary_wallet_network: NetworkType | null
  primary_wallet_id: number | null
}

/**
 * Upserts a user from Cavos authentication data
 */
export async function upsertCavosUser(params: UpsertCavosUserParams): Promise<string | null> {
  if (!supabase) {
    console.error('Supabase client not initialized. Check your environment variables.')
    return null
  }

  try {
    const { data, error } = await supabase.rpc('upsert_cavos_user', {
      p_cavos_user_id: params.cavosUserId,
      p_email: params.email,
      p_org_id: params.orgId || null,
      p_org_name: params.orgName || null,
      p_username: params.username || null,
      p_avatar_url: params.avatarUrl || null,
      p_metadata: params.metadata || null
    })

    if (error) {
      console.error('Error upserting Cavos user:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Exception upserting Cavos user:', error)
    return null
  }
}

/**
 * Upserts a wallet for a user from Cavos
 */
export async function upsertCavosWallet(params: UpsertCavosWalletParams): Promise<number | null> {
  if (!supabase) {
    console.error('Supabase client not initialized. Check your environment variables.')
    return null
  }

  try {
    const { data, error } = await supabase.rpc('upsert_cavos_wallet', {
      p_user_id: params.userId,
      p_address: params.address,
      p_cavos_wallet_id: params.cavosWalletId || null,
      p_network: params.network || 'mainnet',
      p_is_primary: params.isPrimary || false,
      p_metadata: params.metadata || null
    })

    if (error) {
      console.error('Error upserting Cavos wallet:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Exception upserting Cavos wallet:', error)
    return null
  }
}

/**
 * Convenience function to get or create a user with wallet in one call
 */
export async function getOrCreateCavosUser(
  params: GetOrCreateCavosUserParams
): Promise<{
  user_id: string
  cavos_user_id: string
  email: string
  organization_id: number | null
  wallet_id: number | null
  wallet_address: string | null
  is_new_user: boolean
} | null> {
  if (!supabase) {
    console.error('Supabase client not initialized. Check your environment variables.')
    return null
  }

  try {
    const { data, error } = await supabase.rpc('get_or_create_cavos_user', {
      p_cavos_user_id: params.cavosUserId,
      p_email: params.email,
      p_org_id: params.orgId || null,
      p_org_name: params.orgName || null,
      p_wallet_address: params.walletAddress || null,
      p_wallet_network: params.walletNetwork || 'mainnet',
      p_username: params.username || null,
      p_avatar_url: params.avatarUrl || null,
      p_metadata: params.metadata || null
    })

    if (error) {
      console.error('Error getting/creating Cavos user:', error)
      return null
    }

    if (!data || data.length === 0) {
      return null
    }

    return data[0]
  } catch (error) {
    console.error('Exception getting/creating Cavos user:', error)
    return null
  }
}

/**
 * Saves a user from Cavos authentication response
 * This is the main function to use after successful Cavos authentication
 */
export async function saveCavosUser(user: CavosUser): Promise<string | null> {
  if (!supabase) {
    console.error('Supabase client not initialized. Check your environment variables.')
    return null
  }

  try {
    if (!user.id || !user.email) {
      console.error('Invalid user data: missing id or email')
      return null
    }

    const result = await getOrCreateCavosUser({
      cavosUserId: user.id,
      email: user.email,
      orgId: user.organization?.org_id,
      orgName: user.organization?.org_name,
      walletAddress: user.wallet?.address,
      walletNetwork: (user.wallet?.network as NetworkType) || 'mainnet',
      metadata: {}
    })

    return result?.user_id || null
  } catch (error) {
    console.error('Exception saving Cavos user:', error)
    return null
  }
}

/**
 * Gets a user with their primary wallet
 */
export async function getUserWithPrimaryWallet(
  cavosUserId: string
): Promise<UserWithPrimaryWallet | null> {
  if (!supabase) {
    console.error('Supabase client not initialized. Check your environment variables.')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('users_with_primary_wallet')
      .select('*')
      .eq('cavos_user_id', cavosUserId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      console.error('Error fetching user with primary wallet:', error)
      return null
    }

    return data as UserWithPrimaryWallet
  } catch (error) {
    console.error('Exception fetching user with primary wallet:', error)
    return null
  }
}

/**
 * Gets user by email
 */
export async function getUserByEmail(email: string): Promise<UserWithPrimaryWallet | null> {
  if (!supabase) {
    console.error('Supabase client not initialized. Check your environment variables.')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('users_with_primary_wallet')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Error fetching user by email:', error)
      return null
    }

    return data as UserWithPrimaryWallet
  } catch (error) {
    console.error('Exception fetching user by email:', error)
    return null
  }
}

/**
 * Gets all wallets for a user
 */
export async function getUserWallets(userId: string) {
  if (!supabase) {
    console.error('Supabase client not initialized. Check your environment variables.')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user wallets:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Exception fetching user wallets:', error)
    return []
  }
}

/**
 * Logs a user session (for audit purposes)
 * Tokens should be hashed before calling this function
 */
export async function logUserSession(params: {
  userId: string
  accessTokenHash: string
  refreshTokenHash: string
  expiresAt: Date
  deviceInfo?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
}): Promise<string | null> {
  if (!supabase) {
    console.error('Supabase client not initialized. Check your environment variables.')
    return null
  }

  try {
    const { data, error } = await supabase.rpc('log_user_session', {
      p_user_id: params.userId,
      p_access_token_hash: params.accessTokenHash,
      p_refresh_token_hash: params.refreshTokenHash,
      p_expires_at: params.expiresAt.toISOString(),
      p_device_info: params.deviceInfo || null,
      p_ip_address: params.ipAddress || null,
      p_user_agent: params.userAgent || null
    })

    if (error) {
      console.error('Error logging user session:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Exception logging user session:', error)
    return null
  }
}

/**
 * Revokes all sessions for a user (useful for logout)
 */
export async function revokeAllUserSessions(userId: string): Promise<number> {
  if (!supabase) {
    console.error('Supabase client not initialized. Check your environment variables.')
    return 0
  }

  try {
    const { data, error } = await supabase.rpc('revoke_all_user_sessions', {
      p_user_id: userId
    })

    if (error) {
      console.error('Error revoking user sessions:', error)
      return 0
    }

    return data || 0
  } catch (error) {
    console.error('Exception revoking user sessions:', error)
    return 0
  }
}

/**
 * Update user profile information
 */
export async function updateUserProfile(
  cavosUserId: string,
  updates: {
    username?: string | null;
    avatar_url?: string | null;
  }
): Promise<UserWithPrimaryWallet | null> {
  if (!supabase) {
    console.error('Supabase client not initialized. Check your environment variables.')
    return null
  }

  try {
    // First, get the user's internal ID
    const user = await getUserWithPrimaryWallet(cavosUserId)
    if (!user) {
      console.error('User not found:', cavosUserId)
      return null
    }

    // Update the user profile
    const { data, error } = await supabase
      .from('users')
      .update({
        username: updates.username ?? null,
        avatar_url: updates.avatar_url ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating user profile:', error)
      return null
    }

    // Fetch updated user with primary wallet
    const updatedUser = await getUserWithPrimaryWallet(cavosUserId)
    return updatedUser
  } catch (error) {
    console.error('Exception updating user profile:', error)
    return null
  }
}

/**
 * Hash function for tokens (for audit logging)
 * Uses SHA-256 cryptographic hash for production security
 */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

