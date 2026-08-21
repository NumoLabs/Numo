import type { TypedData } from 'starknet'

/**
 * SNIP-12 typed data for "prove you control this wallet".
 *
 * Both the browser (which asks the wallet to sign) and the server (which
 * verifies) build the message from here. If the two ever drift, every signature
 * fails verification — so keep this the single definition.
 */

export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7 // 7 days
export const NONCE_TTL_SECONDS = 5 * 60 // 5 minutes

export interface LoginMessageParams {
	nonce: string
	/** Unix seconds. Included so the user can see what they are signing. */
	issuedAt: number
}

export function buildLoginTypedData({
	nonce,
	issuedAt,
}: LoginMessageParams): TypedData {
	return {
		domain: {
			name: 'Numo',
			version: '1',
			chainId: 'SN_MAIN',
			revision: '1',
		},
		types: {
			StarknetDomain: [
				{ name: 'name', type: 'shortstring' },
				{ name: 'version', type: 'shortstring' },
				{ name: 'chainId', type: 'shortstring' },
				{ name: 'revision', type: 'shortstring' },
			],
			Login: [
				{ name: 'statement', type: 'string' },
				{ name: 'nonce', type: 'string' },
				{ name: 'issuedAt', type: 'felt' },
			],
		},
		primaryType: 'Login',
		message: {
			statement: 'Sign in to Numo. This does not trigger a transaction.',
			nonce,
			issuedAt,
		},
	}
}
