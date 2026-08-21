import { describe, expect, it } from 'bun:test'
import { PUBLIC_FALLBACK_RPC_URL, getPublicRpcUrl, getServerRpcUrl } from './rpc'

describe('RPC configuration', () => {
	it('falls back to the public node when nothing is configured', () => {
		const prev = { ...process.env }
		process.env.NEXT_PUBLIC_STARKNET_RPC_URL = undefined as never
		process.env.STARKNET_RPC_URL = undefined as never
		delete process.env.NEXT_PUBLIC_STARKNET_RPC_URL
		delete process.env.STARKNET_RPC_URL

		expect(getPublicRpcUrl()).toBe(PUBLIC_FALLBACK_RPC_URL)
		expect(getServerRpcUrl()).toBe(PUBLIC_FALLBACK_RPC_URL)

		Object.assign(process.env, prev)
	})

	it('prefers the server-only URL on the server', () => {
		const prev = { ...process.env }
		process.env.STARKNET_RPC_URL = 'https://server-only.example'
		process.env.NEXT_PUBLIC_STARKNET_RPC_URL = 'https://public.example'

		expect(getServerRpcUrl()).toBe('https://server-only.example')
		expect(getPublicRpcUrl()).toBe('https://public.example')

		for (const k of Object.keys(process.env)) delete process.env[k]
		Object.assign(process.env, prev)
	})

	// The previous fallback (blastapi) was shut down while this project sat idle,
	// which silently broke every on-chain read when no env var was set. This is a
	// live network check so the same rot is caught by CI instead of by a user.
	it('the fallback node actually answers', async () => {
		const res = await fetch(PUBLIC_FALLBACK_RPC_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				jsonrpc: '2.0',
				id: 1,
				method: 'starknet_chainId',
				params: [],
			}),
			signal: AbortSignal.timeout(15_000),
		})

		expect(res.ok).toBe(true)
		const body = await res.json()
		// 0x534e5f4d41494e === "SN_MAIN"
		expect(body.result).toBe('0x534e5f4d41494e')
	}, 20_000)
})
