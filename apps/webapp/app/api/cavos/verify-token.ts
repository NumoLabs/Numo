import { getCavosConfig } from '@/lib/cavos-config';

/**
 * Verify token with Cavos API
 * Uses POST /api/v1/external/auth/token/check to validate the token server-side
 * 
 * Reference: https://docs.cavos.xyz/swagger#/Authentication/checkTokenStatus
 * 
 * @param token - The access token to verify
 * @returns Object with validation result and userId if valid, or null on error
 */
export async function verifyTokenWithCavos(
  token: string
): Promise<{ valid: boolean; userId?: string; decoded?: Record<string, unknown> } | null> {
  try {
    const config = getCavosConfig();
    const baseURL = config.baseURL || 'https://services.cavos.xyz/api/v1/external';
    
    const response = await fetch(`${baseURL}/auth/token/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.apiKey || '',
      },
      body: JSON.stringify({
        access_token: token,
      }),
    });

    if (!response.ok) {
      console.error('Cavos token verification failed:', response.status, response.statusText);
      return null;
    }

    const result = await response.json();
    
    // If token is valid, extract userId from decoded payload
    if (result.valid && !result.expired && !result.used && result.decoded) {
      const decoded = result.decoded as Record<string, unknown>;
      const userId = decoded.user_id || decoded.userId || decoded.sub || decoded.id;
      
      return {
        valid: true,
        userId: userId ? String(userId) : undefined,
        decoded,
      };
    }

    // Log why token is invalid
    if (!result.valid || result.expired || result.used) {
      console.warn('[verifyTokenWithCavos] Token invalid:', {
        valid: result.valid,
        expired: result.expired,
        used: result.used,
        reason: !result.valid ? 'not valid' : result.expired ? 'expired' : result.used ? 'already used' : 'unknown'
      });
    }

    return { valid: false };
  } catch (error) {
    console.error('Error verifying token with Cavos API:', error);
    return null;
  }
}

