import { describe, expect, it } from 'bun:test'
import {
	formatTokenAmount,
	fromU256,
	parseTokenAmount,
	toU256,
} from './units'

const WBTC = 8
const ETH = 18

describe('parseTokenAmount', () => {
	it('converts whole and fractional amounts', () => {
		expect(parseTokenAmount('1', WBTC)).toBe(100_000_000n)
		expect(parseTokenAmount('1.5', WBTC)).toBe(150_000_000n)
		expect(parseTokenAmount('0.5', WBTC)).toBe(50_000_000n)
		expect(parseTokenAmount('0', WBTC)).toBe(0n)
	})

	// The old implementation multiplied by 10 ** decimals, so 0.29 became
	// 28999999.999999996 and every downstream BigInt() threw.
	it('is exact for amounts that float math gets wrong', () => {
		expect(parseTokenAmount(0.29, WBTC)).toBe(29_000_000n)
		expect(parseTokenAmount(0.07, WBTC)).toBe(7_000_000n)
		expect(parseTokenAmount(1.1, WBTC)).toBe(110_000_000n)
		expect(parseTokenAmount(0.57, WBTC)).toBe(57_000_000n)
	})

	// String(0.0000001) === '1e-7'; naive splitting produced '1e-700000000'.
	it('handles numbers that stringify to exponential notation', () => {
		expect(parseTokenAmount(0.0000001, WBTC)).toBe(10n)
		expect(parseTokenAmount(5e-8, WBTC)).toBe(5n)
		expect(parseTokenAmount(1e21, ETH)).toBe(10n ** 39n)
	})

	it('keeps full precision for 18-decimal tokens', () => {
		expect(parseTokenAmount('1', ETH)).toBe(10n ** 18n)
		expect(parseTokenAmount('1234567.123456789012345678', ETH)).toBe(
			1_234_567_123_456_789_012_345_678n
		)
	})

	it('truncates excess precision instead of rounding up', () => {
		// Rounding up could exceed the user's balance and revert the transaction.
		expect(parseTokenAmount('1.123456789', WBTC)).toBe(112_345_678n)
		expect(parseTokenAmount('0.999999999', WBTC)).toBe(99_999_999n)
	})

	it('accepts the Spanish decimal comma', () => {
		expect(parseTokenAmount('1,5', WBTC)).toBe(150_000_000n)
	})

	it('tolerates surrounding whitespace', () => {
		expect(parseTokenAmount('  1.5  ', WBTC)).toBe(150_000_000n)
	})

	it('rejects input that is not a non-negative decimal', () => {
		for (const bad of ['', '.', '-1', 'abc', '1.2.3', '1e5', '1 000', '1,234.5']) {
			expect(() => parseTokenAmount(bad, WBTC)).toThrow()
		}
		expect(() => parseTokenAmount(Number.NaN, WBTC)).toThrow()
		expect(() => parseTokenAmount(Number.POSITIVE_INFINITY, WBTC)).toThrow()
	})
})

describe('formatTokenAmount', () => {
	it('round-trips with parseTokenAmount', () => {
		for (const amount of ['1', '0.5', '1.5', '0.00000001', '123456.789']) {
			expect(formatTokenAmount(parseTokenAmount(amount, WBTC), WBTC)).toBe(
				amount,
			)
		}
	})

	it('is exact where Number(raw) / 1e18 would not be', () => {
		expect(formatTokenAmount(1_234_567_123_456_789_012_345_678n, ETH)).toBe(
			'1234567.123456789012345678'
		)
	})

	it('trims trailing zeros and honours maxFractionDigits', () => {
		expect(formatTokenAmount(100_000_000n, WBTC)).toBe('1')
		expect(formatTokenAmount(150_000_000n, WBTC)).toBe('1.5')
		expect(formatTokenAmount(123_456_789n, WBTC, 4)).toBe('1.2345')
	})
})

describe('u256', () => {
	it('round-trips values above 2^128', () => {
		const big = (1n << 130n) + 12345n
		expect(fromU256(toU256(big))).toBe(big)
	})

	it('splits at the 128-bit boundary', () => {
		expect(toU256(1n << 128n)).toEqual({ low: 0n, high: 1n })
		expect(toU256(5n)).toEqual({ low: 5n, high: 0n })
	})

	it('reads string and number fields coming back from the RPC', () => {
		expect(fromU256({ low: '5', high: '0' })).toBe(5n)
		expect(fromU256({ low: 5, high: 1 })).toBe((1n << 128n) + 5n)
	})
})
