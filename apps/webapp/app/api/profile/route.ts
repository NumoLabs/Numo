import { NextRequest, NextResponse } from 'next/server';
import { getUserWithPrimaryWallet, updateUserProfile } from '@/lib/supabase/cavos-users';
import { verifyTokenWithCavos } from '@/app/api/cavos/verify-token';

async function getUserIdFromToken(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7).trim(); // Remove 'Bearer ' prefix
  
  if (!token || token.length === 0) {
    return null;
  }
  
  try {
    const cavosVerification = await verifyTokenWithCavos(token);
    if (cavosVerification?.valid && cavosVerification.userId) {
      return cavosVerification.userId;
    }
    if (cavosVerification?.valid === false) {
    }
  } catch {
    // Ignore API verification errors, try local JWT decode
  }
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    let payload: Record<string, unknown>;
    try {
      const base64Payload = parts[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      
      const paddedPayload = base64Payload + '='.repeat((4 - base64Payload.length % 4) % 4);
      
      payload = JSON.parse(
        Buffer.from(paddedPayload, 'base64').toString('utf-8')
      );
    } catch {
      return null;
    }
    
    if (payload.exp) {
      const expirationTime = typeof payload.exp === 'number' 
        ? payload.exp 
        : parseInt(String(payload.exp), 10);
      
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (expirationTime < currentTime) {
        return null;
      }
    }
    
    if (payload.iat) {
      const issuedAt = typeof payload.iat === 'number'
        ? payload.iat
        : parseInt(String(payload.iat), 10);
      
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (issuedAt > currentTime + 300) {
        return null;
      }
      
      const thirtyDaysAgo = currentTime - (30 * 24 * 60 * 60);
      if (issuedAt < thirtyDaysAgo) {
        return null;
      }
    }
    
    const userId = payload.user_id 
      || payload.userId 
      || payload.sub 
      || payload.id
      || (payload.data && typeof payload.data === 'object' && 'user_id' in payload.data 
        ? (payload.data as Record<string, unknown>).user_id 
        : null);
        
    if (!userId || (typeof userId !== 'string' && typeof userId !== 'number')) {
      return null;
    }
    
    const finalUserId = String(userId);
    return finalUserId;
  } catch {
    return null;
  }
}

/**
 * GET /api/profile
 * Get the current user's profile
 * Requires Authorization header with Bearer token
 */
export async function GET(request: NextRequest) {
  try {
    const cavosUserId = await getUserIdFromToken(request);
    
    if (!cavosUserId) {
      return NextResponse.json(
        { error: 'Authentication required. Please provide Authorization header with Bearer token.' },
        { status: 401 }
      );
    }

    const userProfile = await getUserWithPrimaryWallet(cavosUserId);

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(userProfile);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/profile
 * Update the current user's profile
 * Requires Authorization header with Bearer token
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, avatar_url } = body;

    const cavosUserId = await getUserIdFromToken(request);

    if (!cavosUserId) {
      return NextResponse.json(
        { error: 'Authentication required. Please provide Authorization header with Bearer token.' },
        { status: 401 }
      );
    }

    if (username !== undefined && username !== null && typeof username !== 'string') {
      return NextResponse.json(
        { error: 'Invalid username format. Username must be a string or null.' },
        { status: 400 }
      );
    }

    if (avatar_url !== undefined && avatar_url !== null && typeof avatar_url !== 'string') {
      return NextResponse.json(
        { error: 'Invalid avatar_url format. Avatar URL must be a string or null.' },
        { status: 400 }
      );
    }

    // Update user profile
    const updatedProfile = await updateUserProfile(cavosUserId, {
      username: username || null,
      avatar_url: avatar_url || null,
    });

    if (!updatedProfile) {
      return NextResponse.json(
        { error: 'Failed to update user profile' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedProfile);
  } catch {
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}

