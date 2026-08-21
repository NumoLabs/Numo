import { type NextRequest, NextResponse } from 'next/server'
import { RpcProvider, type Signature } from 'starknet'
import { getServerRpcUrl } from '@/lib/rpc'
import { buildLoginTypedData } from '@/lib/auth/message'
import {
	isAuthConfigured,
	issueSessionToken,
	normalizeAddress,
	sessionCookieOptions,
	SESSION_COOKIE,
	VALID_NETWORKS,
	verifyNonce,
} from '@/lib/auth/session'
import type { NetworkType } from '@/lib/supabase/users'
import { getOrCreateUserByWallet } from '@/lib/supabase/users'

/**
 * POST /api/auth/login
 *
 * Step 2 of sign-in. Verifies that `signature` is a valid signature of the
 * login message by the account contract at `address`, then issues the session
 * cookie. Verification happens on-chain against the account's
 * `is_valid_signature` so it works for every Starknet account type
 * (Argent, Braavos, multisig) rather than assuming a single-key layout.
 */
export async function POST(request: NextRequest) {
	if (!isAuthConfigured()) {
		return NextResponse.json(
			{ error: 'Authentication is not configured on this server' },
			{ status: 503 }
		)
	}

	try {
		const body = await request.json().catch(() => null)
		const { address, signature, nonce, token, issuedAt } = body ?? {}

		const normalized =
			typeof address === 'string' ? normalizeAddress(address) : null

		if (
			!normalized ||
			typeof nonce !== 'string' ||
			typeof token !== 'string' ||
			typeof issuedAt !== 'number' ||
			!Array.isArray(signature)
		) {
			return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
		}

		const network: NetworkType = VALID_NETWORKS.includes(body?.network)
			? body.network
			: 'mainnet'

		if (!verifyNonce(token, nonce, normalized)) {
			return NextResponse.json(
				{ error: 'Challenge expired or invalid. Please try again.' },
				{ status: 401 }
			)
		}

		const typedData = buildLoginTypedData({ nonce, issuedAt })
		const provider = new RpcProvider({ nodeUrl: getServerRpcUrl() })

		let isValid = false
		try {
			isValid = await provider.verifyMessageInStarknet(
				typedData,
				signature as Signature,
				normalized
			)
		} catch (error) {
			// Thrown when the account is not deployed, or the contract has no
			// recognisable signature-verification entrypoint.
			console.error('Signature verification failed:', error)
			return NextResponse.json(
				{ error: 'Could not verify signature for this account' },
				{ status: 401 }
			)
		}

		if (!isValid) {
			return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
		}

		// Only now is the address trusted enough to touch the database.
		await getOrCreateUserByWallet({
			walletAddress: normalized,
			walletNetwork: network,
		})

		const sessionToken = issueSessionToken(normalized, network)
		if (!sessionToken) {
			return NextResponse.json(
				{ error: 'Failed to create session' },
				{ status: 500 }
			)
		}

		const response = NextResponse.json({ address: normalized, network })
		response.cookies.set(SESSION_COOKIE, sessionToken, sessionCookieOptions)
		return response
	} catch (error) {
		console.error('Login error:', error)
		return NextResponse.json({ error: 'Login failed' }, { status: 500 })
	}
}
