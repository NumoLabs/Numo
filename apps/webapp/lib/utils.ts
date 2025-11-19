/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Token } from '@/types/Tokens';
import axios from 'axios';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const q96 = 2 ** 96;

export const normalizeHex = (hex: string) => hex.replace(/^0x0+/, '0x');

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function tickToPrice(tick: number) {
	// biome-ignore lint/style/useExponentiationOperator: <explanation>
	const price = Math.pow(1.000001, tick);
	return price;
}

export function priceToTick(price: number): number {
	return Math.round(Math.log(price) / Math.log(1.0001));
}

export function calculateDepositAmounts(
	Pmin: number,
	Pmax: number,
	Pcurrent: number,
	depositUSD: number
) {
	const sqrtPmin = Math.sqrt(Pmin);
	const sqrtPmax = Math.sqrt(Pmax);
	const sqrtPcurrent = Math.sqrt(Pcurrent);
	const numerator = sqrtPcurrent - sqrtPmin;
	const denominator = 1 / sqrtPcurrent - 1 / sqrtPmax;
	const R = numerator / denominator;
	const deltaX = depositUSD / (Pcurrent + R);
	const deltaY = R * deltaX;

	return [deltaX * Pcurrent, deltaY];
}

export async function fetchCryptoPrice(symbol: string): Promise<number> {
	const { data: price } = (
		// biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
		await axios.post(`/api/pragma`, { endpoint: symbol })
	).data;
	return price !== null ? price : 0;
}

/**
 * Parse a Vesu amount from human-readable format to wei
 * @param amount - The amount in human-readable format (e.g., "1.5")
 * @param decimals - The number of decimals for the token (e.g., 18 for ETH, 8 for WBTC)
 * @returns The amount in wei as a string
 */
export function parseVesuAmount(amount: number | string, decimals: number): string {
	const amountStr = typeof amount === 'string' ? amount : amount.toString();
	const [integerPart, decimalPart = ''] = amountStr.split('.');
	const paddedDecimal = decimalPart.padEnd(decimals, '0').slice(0, decimals);
	return integerPart + paddedDecimal;
}

export function findActiveTick(
	price: number,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	liquidityData: any[],
	t0: Token,
	t1: Token
): number {
	let returnTick = 0;
	// biome-ignore lint/complexity/noForEach: <explanation>
	[...liquidityData].forEach(({ tick }: { tick: number }) => {
		const tickPrice =
			tickToPrice(Number(tick)) * 10 ** (t0.decimals - t1.decimals);
		if (tickPrice <= price) {
			returnTick = tick;
		} else {
			return returnTick;
		}
	});
	return returnTick;
}

export function getTicksInRange(
	minTick: number,
	maxTick: number,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	liquidityData: any[],
	tick_spacing: number
) {
	const ticks: number[] = [];
	// biome-ignore lint/complexity/noForEach: <explanation>
	[...liquidityData].forEach(({ tick }: { tick: number }) => {
		if (minTick <= tick && tick <= maxTick && tick % tick_spacing === 0) {
			ticks.push(tick);
		} else {
			return ticks;
		}
	});
	return ticks;
}

export function getTickFromPrice(
	price: number,
	t0: Token,
	t1: Token,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	liquidityData: any[],
	tick_spacing: number
) {
	let returnTick = 0;
	// biome-ignore lint/complexity/noForEach: <explanation>
	[...liquidityData].forEach(({ tick }: { tick: number }) => {
		const tickPrice =
			tickToPrice(Number(tick)) * 10 ** (t0.decimals - t1.decimals);
		if (tickPrice <= price && tick % tick_spacing === 0) {
			returnTick = tickPrice;
		} else {
			return returnTick;
		}
	});
	return returnTick;
}

export const getPoolFeePercentage = (fee: number): string => {
	// biome-ignore lint/style/useTemplate: <explanation>
	return ((Number(fee) / Number(2 ** 128)) * 100).toFixed(2) + '%';
};

export const getTickSpacing = (fee: number, tickSpacing: number) => {
	const feeStr = ((Number(fee) / Number(2 ** 128)) * 100).toString();
	// biome-ignore lint/suspicious/noDoubleEquals: <explanation>
	if (tickSpacing == 354892) {
		return 'DCA-Enabled';
	}
	switch (feeStr) {
		case '0.01':
			return '0.02%';
		case '0.05':
			return '0.1%';
		case '0.3':
			return '0.6%';
		case '1':
			return '2%';
		case '5':
			return '10%';
	}
};