import { type NextRequest, NextResponse } from 'next/server';
import { getUserByWallet, getOrCreateUserByWallet, updateUserProfile } from '@/lib/supabase/users';
import { getSession } from '@/lib/auth/session';

const UNAUTHENTICATED = {
  error: 'Authentication required. Sign in with your wallet first.',
};

/**
 * GET /api/profile
 * Get the current user's profile.
 *
 * Identity comes from the signed session cookie, which is only issued after a
 * verified wallet signature (see /api/auth/login). It is deliberately NOT taken
 * from a request header: a header is caller-controlled, so that let anyone read
 * or overwrite any profile by naming someone else's address.
 */
export async function GET(request: NextRequest) {
  try {
    const wallet = getSession(request);

    if (!wallet) {
      return NextResponse.json(UNAUTHENTICATED, { status: 401 });
    }

    // Get or create user profile
    let userProfile = await getUserByWallet(wallet.address, wallet.network);

    // If user doesn't exist, create it
    if (!userProfile) {
      const userId = await getOrCreateUserByWallet({
        walletAddress: wallet.address,
        walletNetwork: wallet.network,
      });

      if (!userId) {
        return NextResponse.json(
          { error: 'Failed to create user profile' },
          { status: 500 }
        );
      }

      // Fetch the newly created profile
      userProfile = await getUserByWallet(wallet.address, wallet.network);

    if (!userProfile) {
      return NextResponse.json(
          { error: 'User profile not found after creation' },
        { status: 404 }
      );
      }
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
 * Update the current user's profile. Identity comes from the session cookie.
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, avatar_url } = body;

    const wallet = getSession(request);

    if (!wallet) {
      return NextResponse.json(UNAUTHENTICATED, { status: 401 });
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

    // Ensure user exists before updating
    let userProfile = await getUserByWallet(wallet.address, wallet.network);
    
    if (!userProfile) {
      // Create user if doesn't exist
      const userId = await getOrCreateUserByWallet({
        walletAddress: wallet.address,
        walletNetwork: wallet.network,
        username: username !== undefined ? username : undefined,
        avatarUrl: avatar_url !== undefined ? avatar_url : undefined,
      });

      if (!userId) {
        return NextResponse.json(
          { error: 'Failed to create user profile' },
          { status: 500 }
        );
      }

      // Fetch the newly created profile
      userProfile = await getUserByWallet(wallet.address, wallet.network);
      
      if (!userProfile) {
        return NextResponse.json(
          { error: 'User profile not found after creation' },
          { status: 404 }
        );
      }

      return NextResponse.json(userProfile);
    }

    // Update existing user profile
    const updatedProfile = await updateUserProfile(wallet.address, wallet.network, {
      username: username !== undefined ? username : undefined,
      avatar_url: avatar_url !== undefined ? avatar_url : undefined,
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

