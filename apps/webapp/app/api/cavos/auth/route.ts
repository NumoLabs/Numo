import { NextRequest, NextResponse } from 'next/server'
import { authenticateUserDirect } from '@/lib/cavos-config'
import { saveCavosUser } from '@/lib/supabase/cavos-users'
import type { CavosNormalizedResponse } from '@/types/cavos'

interface ErrorWithStatus extends Error {
  status?: number
  code?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, action } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (!action || !['signup', 'signin'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be either "signup" or "signin"' },
        { status: 400 }
      )
    }

    try {
      const result = await authenticateUserDirect(email, password)
      
      const userData: CavosNormalizedResponse = {
        user: {
          id: result.data.user_id,
          email: result.data.email,
          organization: result.data.organization
        },
        wallet: result.data.wallet,
        access_token: result.data.authData.accessToken,
        refresh_token: result.data.authData.refreshToken,
        expires_in: result.data.authData.expiresIn,
        timestamp: result.data.authData.timestamp
      }

      const cavosUser = {
        ...userData.user,
        wallet: userData.wallet
      }
      
      try {
        const savedUserId = await saveCavosUser(cavosUser)
        if (!savedUserId) {
          console.error('Failed to save user to Supabase:', {
            userId: userData.user.id,
            email: userData.user.email
          })
        }
      } catch (error) {
        console.error('Exception saving user to Supabase:', error)
      }

      return NextResponse.json(userData)
    } catch (error: unknown) {
      // Determine appropriate status code based on error type
      let statusCode = 400
      let errorMessage = `${action} failed`
      
      if (error instanceof Error) {
        errorMessage = error.message
        const errorWithStatus = error as ErrorWithStatus
        
        // Use status from error if available
        if (errorWithStatus.status) {
          statusCode = errorWithStatus.status
        } else if (error.message?.toLowerCase().includes('invalid credentials') || 
                   error.message?.toLowerCase().includes('wrong password') ||
                   error.message?.toLowerCase().includes('authentication failed') ||
                   error.message?.toLowerCase().includes('invalid email') ||
                   error.message?.toLowerCase().includes('invalid password')) {
          statusCode = 401
        } else if (error.message?.toLowerCase().includes('network') || 
                   error.message?.toLowerCase().includes('fetch') ||
                   error.message?.toLowerCase().includes('timeout')) {
          statusCode = 503
        }
        
        errorMessage = errorMessage.replace(/^(signUp|signIn)\s+failed:\s*/gi, '')
        errorMessage = errorMessage.replace(/\s*\d{3}\s*\{[\s\S]*\}/g, '')
      }
      
      const errorWithStatus = error as ErrorWithStatus
      return NextResponse.json(
        { 
          error: errorMessage,
          code: errorWithStatus?.code || undefined
        },
        { status: statusCode }
      )
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
    console.error('Cavos API error:', error)
    }
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}
