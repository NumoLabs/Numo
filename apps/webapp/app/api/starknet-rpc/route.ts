import { type NextRequest, NextResponse } from 'next/server'
import { getServerRpcUrl } from '@/lib/rpc'

/**
 * Proxy route for Starknet RPC to avoid CORS issues.
 *
 * This endpoint is same-origin only and read-only. Without both restrictions it
 * is an open relay: anyone on the internet could burn this project's RPC quota,
 * and a wildcard CORS header would let any site do it from a victim's browser.
 */

/** JSON-RPC methods the frontend actually needs. Everything else is rejected. */
const ALLOWED_METHODS = new Set([
	'starknet_call',
	'starknet_chainId',
	'starknet_blockNumber',
	'starknet_blockHashAndNumber',
	'starknet_getBlockWithTxHashes',
	'starknet_getBlockWithTxs',
	'starknet_getClassAt',
	'starknet_getClassHashAt',
	'starknet_getNonce',
	'starknet_getStorageAt',
	'starknet_getTransactionByHash',
	'starknet_getTransactionReceipt',
	'starknet_getTransactionStatus',
	'starknet_getEvents',
	'starknet_estimateFee',
	'starknet_specVersion',
	'starknet_syncing',
])

/** Cap on batch size, so one request cannot fan out into hundreds of upstream calls. */
const MAX_BATCH_SIZE = 20

type JsonRpcRequest = { method?: unknown }

function isSameOrigin(req: NextRequest): boolean {
	const origin = req.headers.get('origin')

	// Same-origin fetches from a browser omit `Origin` on simple requests, and
	// server-side callers have no origin at all. Both are fine.
	if (!origin) return true

	const allowed = new Set<string>()
	allowed.add(new URL(req.url).origin)
	if (process.env.NEXT_PUBLIC_SITE_URL) {
		try {
			allowed.add(new URL(process.env.NEXT_PUBLIC_SITE_URL).origin)
		} catch {
			// ignore a malformed NEXT_PUBLIC_SITE_URL rather than failing every request
		}
	}

	return allowed.has(origin)
}

function methodsOf(body: unknown): string[] | null {
	if (Array.isArray(body)) {
		if (body.length === 0 || body.length > MAX_BATCH_SIZE) return null
		const methods: string[] = []
		for (const entry of body as JsonRpcRequest[]) {
			if (!entry || typeof entry.method !== 'string') return null
			methods.push(entry.method)
		}
		return methods
	}

	const single = body as JsonRpcRequest | null
	if (!single || typeof single.method !== 'string') return null
	return [single.method]
}

export async function POST(req: NextRequest) {
	try {
		if (!isSameOrigin(req)) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
		}

		const body = await req.json()

		const methods = methodsOf(body)
		if (!methods) {
			return NextResponse.json(
				{ error: 'Malformed JSON-RPC request' },
				{ status: 400 }
			)
		}

		const rejected = methods.filter((m) => !ALLOWED_METHODS.has(m))
		if (rejected.length > 0) {
			return NextResponse.json(
				{ error: `RPC method not allowed: ${rejected.join(', ')}` },
				{ status: 403 }
			)
		}

		const response = await fetch(getServerRpcUrl(), {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		})

		if (!response.ok) {
			// Upstream errors can carry the keyed RPC URL or provider internals.
			// Log them server-side, return something generic to the caller.
			console.error(
				'Starknet RPC error:',
				response.status,
				await response.text()
			)
			return NextResponse.json(
				{ error: 'RPC request failed', status: response.status },
				{ status: response.status }
			)
		}

		return NextResponse.json(await response.json(), { status: 200 })
	} catch (error) {
		console.error('Starknet RPC proxy error:', error)
		return NextResponse.json(
			{ error: 'Failed to proxy RPC request' },
			{ status: 500 }
		)
	}
}
