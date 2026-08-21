/**
 * Conversion between human-readable token amounts and on-chain integer amounts.
 *
 * Every deposit, withdrawal and approval goes through here, so the rules are
 * strict on purpose — a silently wrong amount is a wrong transaction.
 *
 * Two traps this exists to avoid:
 *
 *  1. Floating point. `0.29 * 10 ** 8` is `28999999.999999996`, not 29000000.
 *     Never multiply a token amount by a power of ten; build the integer from
 *     the digits instead.
 *  2. Exponential notation. `String(0.0000001)` is `"1e-7"`, and naive string
 *     splitting turns that into garbage. Numbers are expanded before parsing.
 */

/** Renders a number as plain decimal digits, expanding exponential notation. */
function toPlainDecimalString(n: number): string {
	if (!Number.isFinite(n)) {
		throw new Error(`Invalid amount: ${n}`)
	}

	const str = String(n)
	if (!/e/i.test(str)) return str

	const [mantissa, exponent] = str.split(/e/i)
	const exp = Number(exponent)
	const negative = mantissa.startsWith('-')
	const unsigned = negative ? mantissa.slice(1) : mantissa
	const [intPart, fracPart = ''] = unsigned.split('.')

	const digits = intPart + fracPart
	const pointPosition = intPart.length + exp

	let out: string
	if (pointPosition <= 0) {
		out = `0.${'0'.repeat(-pointPosition)}${digits}`
	} else if (pointPosition >= digits.length) {
		out = digits + '0'.repeat(pointPosition - digits.length)
	} else {
		out = `${digits.slice(0, pointPosition)}.${digits.slice(pointPosition)}`
	}

	return negative ? `-${out}` : out
}

/**
 * Human-readable amount -> integer base units.
 *
 * Extra fractional digits beyond the token's precision are truncated, never
 * rounded up: rounding up can ask for more than the user holds and revert the
 * transaction.
 *
 * Throws on anything that is not a non-negative decimal number. Callers pass
 * user input straight in, and failing loudly here beats sending a malformed
 * felt to a contract.
 */
export function parseTokenAmount(
	value: string | number,
	decimals: number
): bigint {
	if (!Number.isInteger(decimals) || decimals < 0 || decimals > 77) {
		throw new Error(`Invalid decimals: ${decimals}`)
	}

	let str = typeof value === 'number' ? toPlainDecimalString(value) : value.trim()

	// Accept the Spanish decimal comma ("1,5"), which is what a lot of this
	// project's users will type. A comma used as a thousands separator is
	// rejected rather than guessed at.
	if (str.includes(',') && !str.includes('.')) {
		str = str.replace(',', '.')
	}

	const match = /^(\d*)(?:\.(\d*))?$/.exec(str)
	if (!match || str === '' || str === '.') {
		throw new Error(`Invalid amount: "${value}"`)
	}

	const [, intPart = '', fracPart = ''] = match
	const truncated = fracPart.slice(0, decimals).padEnd(decimals, '0')

	return BigInt((intPart || '0') + truncated)
}

/**
 * Integer base units -> human-readable string.
 *
 * Exact: works entirely on BigInt and strings, so large balances and
 * 18-decimal tokens do not lose precision the way `Number(raw) / 1e18` does.
 */
export function formatTokenAmount(
	raw: bigint | string | number,
	decimals: number,
	maxFractionDigits: number = decimals
): string {
	const value = typeof raw === 'bigint' ? raw : BigInt(raw)
	const negative = value < 0n
	const abs = negative ? -value : value

	const divisor = 10n ** BigInt(decimals)
	const whole = abs / divisor
	const fraction = abs % divisor

	let fractionStr = fraction
		.toString()
		.padStart(decimals, '0')
		.slice(0, maxFractionDigits)
		.replace(/0+$/, '')

	if (fractionStr === '') fractionStr = ''

	const sign = negative ? '-' : ''
	return fractionStr ? `${sign}${whole}.${fractionStr}` : `${sign}${whole}`
}

/**
 * Splits an integer amount into the { low, high } pair Cairo expects for u256.
 */
export function toU256(value: bigint): { low: bigint; high: bigint } {
	if (value < 0n) throw new Error('u256 cannot be negative')
	const MASK = (1n << 128n) - 1n
	return { low: value & MASK, high: value >> 128n }
}

/** Rebuilds an integer from a Cairo u256 { low, high } pair. */
export function fromU256(u256: {
	low: bigint | string | number
	high: bigint | string | number
}): bigint {
	return (BigInt(u256.high ?? 0) << 128n) + BigInt(u256.low ?? 0)
}
