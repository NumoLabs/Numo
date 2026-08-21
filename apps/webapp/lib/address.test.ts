import { describe, expect, it } from 'bun:test'
import { addressKey, isSameAddress, normalizeAddress } from './address'

// The Vesu "Prime" pool, as it actually appears in two places in this repo.
const PRIME_UNPADDED =
	'0x451fe483d5921a2919ddd81d0de6696669bccdacd859f72a4fba7656b97c3b5'
const PRIME_PADDED =
	'0x0451fe483d5921a2919ddd81d0de6696669bccdacd859f72a4fba7656b97c3b5'

const WBTC_MIXED_CASE =
	'0x03Fe2b97C1Fd336E750087D68B9b867997Fd64a2661fF3ca5A7C771641e8e7AC'
const WBTC_LOWER =
	'0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac'

describe('isSameAddress', () => {
	// This is the bug: vesu-config.ts stores the unpadded form, the Vesu API
	// returns the padded one, and `toLowerCase() === toLowerCase()` says false.
	it('matches the same pool written with and without leading zeros', () => {
		expect(PRIME_UNPADDED.toLowerCase() === PRIME_PADDED.toLowerCase()).toBe(false)
		expect(isSameAddress(PRIME_UNPADDED, PRIME_PADDED)).toBe(true)
	})

	it('ignores letter case', () => {
		expect(isSameAddress(WBTC_MIXED_CASE, WBTC_LOWER)).toBe(true)
	})

	it('accepts bigint and mixed input types', () => {
		expect(isSameAddress(BigInt(PRIME_PADDED), PRIME_UNPADDED)).toBe(true)
	})

	it('still distinguishes genuinely different addresses', () => {
		expect(isSameAddress(WBTC_LOWER, PRIME_PADDED)).toBe(false)
		// Not a prefix match: 0x45… and 0x451… are different addresses.
		expect(isSameAddress('0x45', '0x451')).toBe(false)
	})

	it('treats missing or malformed values as non-matching', () => {
		expect(isSameAddress(undefined, WBTC_LOWER)).toBe(false)
		expect(isSameAddress(null, null)).toBe(false)
		expect(isSameAddress('', '')).toBe(false)
		expect(isSameAddress('not-an-address', 'not-an-address')).toBe(false)
	})
})

describe('normalizeAddress', () => {
	it('produces one canonical 66-character form', () => {
		expect(normalizeAddress(PRIME_UNPADDED)).toBe(PRIME_PADDED)
		expect(normalizeAddress(PRIME_PADDED)).toBe(PRIME_PADDED)
		expect(normalizeAddress(WBTC_MIXED_CASE)).toBe(WBTC_LOWER)
		expect(normalizeAddress(PRIME_PADDED)).toHaveLength(66)
	})

	it('returns null rather than throwing on bad input', () => {
		expect(normalizeAddress('nope')).toBeNull()
		expect(normalizeAddress(undefined)).toBeNull()
		expect(normalizeAddress('-0x1')).toBeNull()
	})
})

describe('addressKey', () => {
	it('collapses both spellings onto one map key', () => {
		const balances: Record<string, number> = {}
		balances[addressKey(PRIME_UNPADDED)] = 42
		expect(balances[addressKey(PRIME_PADDED)]).toBe(42)
	})
})
