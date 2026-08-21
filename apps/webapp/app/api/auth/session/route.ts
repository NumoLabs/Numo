import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'

/**
 * GET /api/auth/session
 *
 * Lets the client find out whether it already has a valid session, so it only
 * prompts for a signature when one is actually needed.
 */
export async function GET(request: NextRequest) {
	const session = getSession(request)

	if (!session) {
		return NextResponse.json({ authenticated: false }, { status: 200 })
	}

	return NextResponse.json({
		authenticated: true,
		address: session.address,
		network: session.network,
	})
}
