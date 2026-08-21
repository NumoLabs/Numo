/**
 * Single source of truth for the Starknet RPC endpoint.
 *
 * Do NOT hardcode node URLs (and never an API key) anywhere else: anything that
 * reaches a `"use client"` component ends up verbatim in the browser bundle.
 *
 * - `NEXT_PUBLIC_STARKNET_RPC_URL` is the client-visible endpoint. Point it at a
 *   provider URL that is safe to expose (domain-restricted key, or a public node).
 * - `STARKNET_RPC_URL` is server-only and may hold a privileged/keyed URL. It is
 *   used by route handlers, which never ship their source to the browser.
 */

/**
 * Public fallback node. Rate-limited, fine as a last resort, no key involved.
 *
 * NOT blastapi: that host was this project's fallback everywhere and has been
 * shut down ("Blast API is no longer available"), so with no env var set every
 * on-chain read failed. Verified against this repo's starknet.js by reading
 * wBTC.decimals — see lib/rpc.test.ts.
 */
export const PUBLIC_FALLBACK_RPC_URL = 'https://rpc.starknet.lava.build'

/**
 * RPC URL for browser-side providers. Safe to inline in client components.
 */
export function getPublicRpcUrl(): string {
	return process.env.NEXT_PUBLIC_STARKNET_RPC_URL || PUBLIC_FALLBACK_RPC_URL
}

/**
 * RPC URL for server-side code (route handlers, server components).
 * Prefers the server-only secret, then the public one, then the fallback.
 *
 * Never return this to the client or embed it in a client component.
 */
export function getServerRpcUrl(): string {
	return (
		process.env.STARKNET_RPC_URL ||
		process.env.NEXT_PUBLIC_STARKNET_RPC_URL ||
		PUBLIC_FALLBACK_RPC_URL
	)
}
