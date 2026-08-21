import { type NextRequest, NextResponse } from 'next/server'
import { isAuthConfigured, issueNonce, normalizeAddress } from '@/lib/auth/session'

/**
 * POST /api/auth/nonce
 *
 * Step 1 of sign-in: hand out a single-use challenge bound to the address the
 * caller claims. Handing out a nonce proves nothing — the address is only
 * trusted once /api/auth/login verifies a signature over this nonce.
 */
export async function POST(request: NextRequest) {
	if (!isAuthConfigured()) {
		return NextResponse.json(
			{ error: 'Authentication is not configured on this server' },
			{ status: 503 }
		)
	}

	const body = await request.json().catch(() => null)
	const address = typeof body?.address === 'string' ? body.address : null

	if (!address || !normalizeAddress(address)) {
		return NextResponse.json(
			{ error: 'A valid wallet address is required' },
			{ status: 400 }
		)
	}

	const issued = issueNonce(address)
	if (!issued) {
		return NextResponse.json(
			{ error: 'Failed to issue nonce' },
			{ status: 500 }
		)
	}

	return NextResponse.json({ nonce: issued.nonce, token: issued.token })
}
