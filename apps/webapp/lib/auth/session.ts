import 'server-only'

import crypto from 'node:crypto'
import type { NextRequest } from 'next/server'
import { validateAndParseAddress } from 'starknet'
import type { NetworkType } from '@/lib/supabase/users'
import { NONCE_TTL_SECONDS, SESSION_TTL_SECONDS } from '@/lib/auth/message'

/**
 * Server-side session handling.
 *
 * Identity comes from a signed cookie that is only ever issued after a wallet
 * signature has been verified on-chain. Nothing here trusts a client-supplied
 * address: that was the previous model, and it let anyone read or overwrite any
 * profile just by setting a header.
 */

export const SESSION_COOKIE = 'numo_session'

export const VALID_NETWORKS: NetworkType[] = [
	'mainnet',
	'sepolia',
	'goerli',
	'devnet',
]

export interface Session {
	address: string
	network: NetworkType
}

/**
 * Canonical form of a Starknet address: lowercase, zero-padded to 66 chars.
 *
 * Wallets hand back both `0x03fe…` and `0x3FE…` for the same account. Without
 * normalising, the same user gets multiple `users` rows and profile lookups
 * silently miss.
 */
export function normalizeAddress(address: string): string | null {
	try {
		return validateAndParseAddress(address.trim()).toLowerCase()
	} catch {
		return null
	}
}

function getSecret(): Buffer | null {
	const secret = process.env.AUTH_SECRET
	// Refuse to run rather than fall back to a default: a predictable key means
	// anyone can mint a session cookie for any wallet.
	if (!secret || secret.length < 32) return null
	return Buffer.from(secret, 'utf8')
}

export function isAuthConfigured(): boolean {
	return getSecret() !== null
}

const b64url = (buf: Buffer | string) =>
	Buffer.from(buf as never).toString('base64url')

function sign(payload: string, secret: Buffer): string {
	return crypto.createHmac('sha256', secret).update(payload).digest('base64url')
}

/** Constant-time compare, so a bad signature cannot be guessed byte by byte. */
function safeEqual(a: string, b: string): boolean {
	const bufA = Buffer.from(a)
	const bufB = Buffer.from(b)
	if (bufA.length !== bufB.length) return false
	return crypto.timingSafeEqual(bufA, bufB)
}

function encodeToken(data: object, secret: Buffer): string {
	const payload = b64url(JSON.stringify(data))
	return `${payload}.${sign(payload, secret)}`
}

function decodeToken<T>(token: string, secret: Buffer): T | null {
	const [payload, signature] = token.split('.')
	if (!payload || !signature) return null
	if (!safeEqual(signature, sign(payload, secret))) return null
	try {
		return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as T
	} catch {
		return null
	}
}

// --- nonce -----------------------------------------------------------------

interface NoncePayload {
	n: string
	a: string
	exp: number
}

/**
 * Issue a short-lived nonce bound to one address.
 *
 * The nonce is stateless (an HMAC over the address + expiry) so this works
 * without Redis or an extra table. The trade-off: a nonce can be reused inside
 * its 5-minute window. That window is short and the signature is bound to the
 * address, so it does not let an attacker sign in as someone else — but if you
 * later want strict one-time nonces, persist consumed ones and check here.
 */
export function issueNonce(address: string): { nonce: string; token: string } | null {
	const secret = getSecret()
	const normalized = normalizeAddress(address)
	if (!secret || !normalized) return null

	const nonce = crypto.randomBytes(24).toString('base64url')
	const payload: NoncePayload = {
		n: nonce,
		a: normalized,
		exp: Math.floor(Date.now() / 1000) + NONCE_TTL_SECONDS,
	}
	return { nonce, token: encodeToken(payload, secret) }
}

export function verifyNonce(
	token: string,
	nonce: string,
	address: string
): boolean {
	const secret = getSecret()
	const normalized = normalizeAddress(address)
	if (!secret || !normalized) return false

	const payload = decodeToken<NoncePayload>(token, secret)
	if (!payload) return false
	if (payload.exp < Math.floor(Date.now() / 1000)) return false
	if (payload.a !== normalized) return false
	return safeEqual(payload.n, nonce)
}

// --- session cookie --------------------------------------------------------

interface SessionPayload {
	a: string
	nw: NetworkType
	exp: number
}

export function issueSessionToken(
	address: string,
	network: NetworkType
): string | null {
	const secret = getSecret()
	const normalized = normalizeAddress(address)
	if (!secret || !normalized) return null

	const payload: SessionPayload = {
		a: normalized,
		nw: network,
		exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
	}
	return encodeToken(payload, secret)
}

/**
 * The authenticated caller, or null. This is the only way a route handler
 * should learn who is making a request.
 */
export function getSession(request: NextRequest): Session | null {
	const secret = getSecret()
	if (!secret) return null

	const token = request.cookies.get(SESSION_COOKIE)?.value
	if (!token) return null

	const payload = decodeToken<SessionPayload>(token, secret)
	if (!payload) return null
	if (payload.exp < Math.floor(Date.now() / 1000)) return null
	if (!VALID_NETWORKS.includes(payload.nw)) return null

	return { address: payload.a, network: payload.nw }
}

export const sessionCookieOptions = {
	httpOnly: true,
	// Not readable from JavaScript, not sent on cross-site requests, and
	// HTTPS-only outside local development.
	sameSite: 'lax' as const,
	secure: process.env.NODE_ENV === 'production',
	path: '/',
	maxAge: SESSION_TTL_SECONDS,
}
