import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
}

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

export type NetworkType = 'mainnet' | 'sepolia' | 'goerli' | 'devnet'

export interface UserProfile {
  id: string
  wallet_address: string
  wallet_network: NetworkType
  username: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

interface UpsertUserParams {
  walletAddress: string
  walletNetwork?: NetworkType
  username?: string | null
  avatarUrl?: string | null
}

/**
 * Gets or creates a user by wallet address
 * Returns the user ID
 */
export async function getOrCreateUserByWallet(params: UpsertUserParams): Promise<string | null> {
  if (!supabase) {
    console.error('Supabase client not initialized. Check your environment variables.')
    return null
  }

  try {
    const network = params.walletNetwork || 'mainnet'

    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('wallet_address', params.walletAddress)
      .eq('wallet_network', network)
      .maybeSingle()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking for existing user:', fetchError)
      return null
    }

    if (existingUser) {
      // Update last login
      const { error: updateError } = await supabase
        .from('users')
        .update({
          updated_at: new Date().toISOString()
        })
        .eq('id', existingUser.id)

      if (updateError) {
        console.error('Error updating user:', updateError)
        return null
      }

      return existingUser.id
    }

    // Create new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        wallet_address: params.walletAddress,
        wallet_network: network,
        username: params.username || null,
        avatar_url: params.avatarUrl || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id')
      .single()

    if (insertError) {
      // Handle race condition: if another request created it, fetch it
      if (insertError.code === '23505') {
        const { data: raceConditionUser, error: raceError } = await supabase
          .from('users')
          .select('id')
          .eq('wallet_address', params.walletAddress)
          .eq('wallet_network', network)
          .single()

        if (raceError || !raceConditionUser) {
          console.error('Error fetching user after race condition:', raceError)
          return null
        }

        return raceConditionUser.id
      }

      console.error('Error creating user:', insertError)
      return null
    }

    return newUser.id
  } catch (error) {
    console.error('Exception in getOrCreateUserByWallet:', error)
    return null
  }
}

/**
 * Gets a user by wallet address
 */
export async function getUserByWallet(
  walletAddress: string,
  walletNetwork: NetworkType = 'mainnet'
): Promise<UserProfile | null> {
  if (!supabase) {
    console.error('Supabase client not initialized. Check your environment variables.')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .eq('wallet_network', walletNetwork)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      console.error('Error fetching user by wallet:', error)
      return null
    }

    return data as UserProfile
  } catch (error) {
    console.error('Exception fetching user by wallet:', error)
    return null
  }
}

/**
 * Gets a user by ID
 */
export async function getUserById(userId: string): Promise<UserProfile | null> {
  if (!supabase) {
    console.error('Supabase client not initialized. Check your environment variables.')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Error fetching user by ID:', error)
      return null
    }

    return data as UserProfile
  } catch (error) {
    console.error('Exception fetching user by ID:', error)
    return null
  }
}

/**
 * Updates user profile information
 */
export async function updateUserProfile(
  walletAddress: string,
  walletNetwork: NetworkType,
  updates: {
    username?: string | null
    avatar_url?: string | null
  }
): Promise<UserProfile | null> {
  if (!supabase) {
    console.error('Supabase client not initialized. Check your environment variables.')
    return null
  }

  try {
    const { error } = await supabase
      .from('users')
      .update({
        username: updates.username !== undefined ? updates.username : undefined,
        avatar_url: updates.avatar_url !== undefined ? updates.avatar_url : undefined,
        updated_at: new Date().toISOString()
      })
      .eq('wallet_address', walletAddress)
      .eq('wallet_network', walletNetwork)

    if (error) {
      console.error('Error updating user profile:', error)
      return null
    }

    // Fetch updated user
    const updatedUser = await getUserByWallet(walletAddress, walletNetwork)
    return updatedUser
  } catch (error) {
    console.error('Exception updating user profile:', error)
    return null
  }
}

