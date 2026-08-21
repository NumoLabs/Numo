import { NextResponse } from 'next/server'
import axios from 'axios'

/**
 * Price feed proxy for Pragma.
 *
 * `endpoint` is caller-controlled and is interpolated into the upstream URL, so
 * it must be validated. An unvalidated value lets a caller walk out of the
 * intended path (`../../admin`, an `@host` authority, an absolute URL) and turn
 * this route into an SSRF gadget that carries our API key along for the ride.
 */

const PRAGMA_BASE_URL = 'https://api.dev.pragma.build/node/v1/data'

/**
 * A ticker is letters and digits only. This is deliberately strict rather than a
 * fixed allowlist so new tokens keep working, while `/`, `.`, `:` and `@` — the
 * characters needed to escape the path or swap the host — can never get through.
 */
const TICKER_PATTERN = /^[a-z0-9]{2,12}$/

export async function POST(req: Request) {
	try {
		if (!process.env.PRAGMA_API_KEY) {
			console.error('PRAGMA_API_KEY is not configured')
			return NextResponse.json(
				{ message: 'Price feed not configured' },
				{ status: 503 }
			)
		}

		const body = await req.json().catch(() => null)
		const endpoint = body?.endpoint

		if (typeof endpoint !== 'string') {
			return NextResponse.json(
				{ message: 'Missing or invalid "endpoint"' },
				{ status: 400 }
			)
		}

		const ticker = endpoint.trim().toLowerCase()
		if (!TICKER_PATTERN.test(ticker)) {
			return NextResponse.json({ message: 'Invalid ticker' }, { status: 400 })
		}

		const response = await axios.get(`${PRAGMA_BASE_URL}/${ticker}/usd`, {
			headers: {
				'x-api-key': process.env.PRAGMA_API_KEY,
				Accept: 'application/json',
			},
			timeout: 10_000,
		})

		const { price, decimals } = response.data ?? {}
		if (price === undefined || decimals === undefined) {
			return NextResponse.json(
				{ message: 'Unexpected response from price feed' },
				{ status: 502 }
			)
		}

		return NextResponse.json(
			{ data: Number(BigInt(price)) / 10 ** Number(decimals) },
			{ status: 200 }
		)
	} catch (error) {
		console.error(
			'Error in pragma API:',
			error instanceof Error ? error.message : error
		)
		return NextResponse.json(
			{ message: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}
