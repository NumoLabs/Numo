/**
 * Starknet address comparison and normalisation.
 *
 * Starknet addresses are felts, so the same address has many valid textual
 * forms: `0x451fe4…` and `0x0451fe4…` are the same account. Sources disagree —
 * this project's own `vesu-config.ts` stores the Vesu Prime pool unpadded while
 * the Vesu API returns it padded — so `a.toLowerCase() === b.toLowerCase()`
 * silently returns false for roughly one address in sixteen (any whose leading
 * nibble is zero).
 *
 * Compare with `isSameAddress`, key maps with `normalizeAddress`. Never `===`.
 */

/**
 * Canonical form: lowercase, `0x`-prefixed, zero-padded to 64 hex digits.
 * Returns null for anything that is not a parseable address.
 */
export function normalizeAddress(address: string | bigint | undefined | null): string | null {
	if (address === undefined || address === null) return null

	let value: bigint
	if (typeof address === 'bigint') {
		value = address
	} else {
		const trimmed = String(address).trim()
		// BigInt('') and BigInt(' ') are 0n, not an error, so an empty field would
		// otherwise normalise to the zero address and compare equal to itself.
		if (!/^(0[xX][0-9a-fA-F]+|\d+)$/.test(trimmed)) return null
		try {
			value = BigInt(trimmed)
		} catch {
			return null
		}
	}

	if (value < 0n) return null
	// Anything wider than 251 bits is not a valid Starknet felt.
	if (value >= 1n << 252n) return null

	return `0x${value.toString(16).padStart(64, '0')}`
}

/**
 * True when both strings denote the same on-chain address, regardless of
 * zero-padding or letter case.
 */
export function isSameAddress(
	a: string | bigint | undefined | null,
	b: string | bigint | undefined | null
): boolean {
	const left = normalizeAddress(a)
	if (left === null) return false
	return left === normalizeAddress(b)
}

/**
 * Key for Map/Record lookups keyed by address. Falls back to a lowercased
 * string so a malformed value still gets a stable (if unmatched) key rather
 * than colliding on `null`.
 */
export function addressKey(address: string | bigint): string {
	return normalizeAddress(address) ?? String(address).toLowerCase()
}
