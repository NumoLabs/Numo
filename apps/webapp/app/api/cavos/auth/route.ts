import { NextRequest, NextResponse } from 'next/server'
import { authenticateUserDirect } from '@/lib/cavos-config'
import type { CavosNormalizedResponse } from '@/types/cavos'

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
      // Use the direct SDK authentication function
      const result = await authenticateUserDirect(email, password)
      
      // Extract data from the nested structure
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

      return NextResponse.json(userData)
    } catch (error: unknown) {
      // Determine appropriate status code based on error type
      let statusCode = 400
      const errorMessage = error instanceof Error ? error.message : `${action} failed`
      
      if (error instanceof Error) {
        if (error.message?.includes('Invalid credentials') || 
            error.message?.includes('wrong password') ||
            error.message?.includes('authentication failed')) {
          statusCode = 401
        } else if (error.message?.includes('network') || 
                   error.message?.includes('fetch') ||
                   error.message?.includes('timeout')) {
          statusCode = 503
        }
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: statusCode }
      )
    }
  } catch (error) {
    console.error('Cavos API error:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
