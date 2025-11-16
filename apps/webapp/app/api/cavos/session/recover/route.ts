import { NextRequest, NextResponse } from 'next/server'
import { getCavosConfig } from '@/lib/cavos-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { access_token } = body

    if (!access_token) {
      return NextResponse.json(
        { error: 'Access token is required' },
        { status: 400 }
      )
    }

    const config = getCavosConfig()
    const baseURL = config.baseURL || 'https://services.cavos.xyz/api/v1/external'
    
    const response = await fetch(`${baseURL}/auth/session/recover`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
        'X-API-Key': config.apiKey || '',
      },
      body: JSON.stringify({
        app_id: config.appId,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Session recovery failed' }))
      
      return NextResponse.json(
        {
          error: errorData.error || errorData.message || 'Session recovery failed',
          code: errorData.code,
          details: errorData.details,
        },
        { status: response.status }
      )
    }

    const result = await response.json()
    
    if (!result.data) {
      return NextResponse.json(
        { error: 'Invalid session recovery response' },
        { status: 500 }
      )
    }

    const { authData, user, wallet } = result.data
    
    return NextResponse.json({
      user: {
        id: user?.user_id || user?.id || authData?.user_id || '',
        email: user?.email || authData?.email || '',
        organization: user?.organization || {},
      },
      wallet: wallet || null,
      access_token: authData?.accessToken || '',
      refresh_token: authData?.refreshToken || '',
      expires_in: authData?.expiresIn || 300,
      timestamp: authData?.timestamp || Date.now(),
    })
  } catch (error: unknown) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Session recover API error:', error)
    }
    
    const errorObj = error as { status?: number; message?: string; code?: string }
    const statusCode = errorObj?.status || 500
    const errorMessage = errorObj?.message || 'Internal server error. Please try again later.'
    
    return NextResponse.json(
      {
        error: errorMessage,
        code: errorObj?.code,
      },
      { status: statusCode }
    )
  }
}

