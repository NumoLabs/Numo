'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useAccount } from '@starknet-react/core'
import { buildLoginTypedData } from '@/lib/auth/message'

/**
 * Establishes an authenticated session for the connected wallet.
 *
 * Connecting a wallet proves nothing to the server — it happens entirely in the
 * browser. This asks the wallet to sign a challenge once, and the server sets an
 * httpOnly cookie that every later `/api/*` call rides on automatically.
 *
 * Signing is free and off-chain: no transaction, no gas.
 */

export type SessionStatus =
	| 'idle'
	| 'checking'
	| 'authenticating'
	| 'authenticated'
	| 'unauthenticated'
	| 'error'

export function useWalletSession() {
	const { account, address, isConnected } = useAccount()
	const [status, setStatus] = useState<SessionStatus>('idle')
	const [error, setError] = useState<string | null>(null)

	// Guards against a second signature prompt while one is already open —
	// wallets queue these, and a duplicate prompt reads as the app being broken.
	const inFlightFor = useRef<string | null>(null)

	const signIn = useCallback(async () => {
		if (!account || !address) return false

		setStatus('authenticating')
		setError(null)

		try {
			const nonceRes = await fetch('/api/auth/nonce', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ address }),
			})

			if (!nonceRes.ok) {
				const data = await nonceRes.json().catch(() => ({}))
				throw new Error(data.error || 'Could not start sign-in')
			}

			const { nonce, token } = await nonceRes.json()
			const issuedAt = Math.floor(Date.now() / 1000)

			const signature = await account.signMessage(
				buildLoginTypedData({ nonce, issuedAt })
			)

			const loginRes = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					address,
					network: 'mainnet',
					nonce,
					token,
					issuedAt,
					signature: Array.isArray(signature)
						? signature.map(String)
						: signature,
				}),
			})

			if (!loginRes.ok) {
				const data = await loginRes.json().catch(() => ({}))
				throw new Error(data.error || 'Sign-in failed')
			}

			setStatus('authenticated')
			return true
		} catch (err) {
			// A user declining the signature prompt is a normal outcome, not a bug.
			const message = err instanceof Error ? err.message : 'Sign-in failed'
			setError(message)
			setStatus(/reject|denied|abort/i.test(message) ? 'unauthenticated' : 'error')
			return false
		}
	}, [account, address])

	const signOut = useCallback(async () => {
		try {
			await fetch('/api/auth/logout', { method: 'POST' })
		} catch {
			// The cookie expires on its own; a failed logout call is not fatal.
		}
		inFlightFor.current = null
		setStatus('unauthenticated')
	}, [])

	useEffect(() => {
		if (!isConnected || !address || !account) {
			setStatus('idle')
			inFlightFor.current = null
			return
		}

		if (inFlightFor.current === address) return
		inFlightFor.current = address

		let cancelled = false

		const run = async () => {
			setStatus('checking')

			// Reuse an existing cookie rather than prompting on every page load.
			try {
				const res = await fetch('/api/auth/session')
				const data = await res.json()
				if (cancelled) return

				if (
					data.authenticated &&
					typeof data.address === 'string' &&
					BigInt(data.address) === BigInt(address)
				) {
					setStatus('authenticated')
					return
				}
			} catch {
				// Fall through to signing in.
			}

			if (!cancelled) await signIn()
		}

		void run()

		return () => {
			cancelled = true
		}
	}, [isConnected, address, account, signIn])

	return {
		status,
		error,
		isAuthenticated: status === 'authenticated',
		signIn,
		signOut,
	}
}
