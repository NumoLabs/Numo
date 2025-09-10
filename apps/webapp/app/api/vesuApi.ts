/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchCryptoPrice } from '@/lib/utils';
import type { VesuPool, VesuAsset, ProcessedAsset } from '@/types/VesuPools';
import type { VesuEarnPosition } from '@/types/VesuPositions';
import axios from 'axios';

// Helper function to process Vesu asset data for UI display
export function processVesuAsset(asset: VesuAsset): ProcessedAsset {
	const currentUtilization = (Number(asset.stats.currentUtilization.value) / 10 ** asset.stats.currentUtilization.decimals) * 100;
	const apy = (Number(asset.stats.supplyApy.value) / 10 ** asset.stats.supplyApy.decimals) * 100;
	const defiSpringApy = (Number(asset.stats.defiSpringSupplyApr.value) / 10 ** asset.stats.defiSpringSupplyApr.decimals) * 100;
	const borrowApr = (Number(asset.stats.borrowApr.value) / 10 ** asset.stats.borrowApr.decimals) * 100;
	const lstApr = (Number(asset.stats.lstApr.value) / 10 ** asset.stats.lstApr.decimals) * 100;
	const totalSupplied = Number(asset.stats.totalSupplied.value) / 10 ** asset.stats.totalSupplied.decimals;
	const totalDebt = Number(asset.stats.totalDebt.value) / 10 ** asset.stats.totalDebt.decimals;

	return {
		name: asset.name,
		symbol: asset.symbol,
		currentUtilization,
		apy,
		defiSpringApy,
		borrowApr,
		lstApr,
		decimals: asset.decimals,
		address: asset.address,
		vTokenAddress: asset.vToken.address,
		totalSupplied,
		totalDebt,
		canBeBorrowed: asset.stats.canBeBorrowed,
	};
}

export async function getEarnPositions(address: string) {
	if (!address) {
		return [];
	}
	const { data } = (
		await axios.get(
			`https://api.vesu.xyz/positions?walletAddress=${address}`
		)
	).data;
	const filteredData = data.filter(
		(item: { type: string }) => item.type === 'earn'
	);

	const pools = await getVesuPools();

	const vesuPositions: VesuEarnPosition[] = await Promise.all(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		filteredData.map(async (position: any) => {
			const poolData = pools.find(
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				(pool: { id: any }) => pool.id === position.pool.id
			);
			let poolApy = 0;
			let rewardsApy = 0;
			let risk = 'Low';

			const tokenPrice = await fetchCryptoPrice(
				position.collateral.symbol
			);

			if (poolData) {
				const asset = poolData.assets.find(
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					(asset: { symbol: any }) =>
						asset.symbol === position.collateral.symbol
				);
				if (asset) {
					poolApy = asset.apy;
					rewardsApy = asset.defiSpringApy;
					if (asset.currentUtilization > 80) {
						risk = 'High';
					} else if (asset.currentUtilization > 50) {
						risk = 'Medium';
					}
				}
			}

			return {
				poolId: position.pool.id,
				pool: position.pool.name,
				type: position.type,
				collateral: position.collateral.symbol,
				total_supplied:
					(Number(position.collateral.value) /
						10 ** position.collateral.decimals) *
					tokenPrice,
				risk,
				poolApy,
				rewardsApy,
			};
		})
	);
	return vesuPositions;
}

export async function getVesuPools() {
	const { data } = (await axios.get(`https://api.vesu.xyz/pools`)).data;
	return data
		.filter((pool: any) => pool.isVerified)
		.map((pool: any) => ({
			id: pool.id,
			name: pool.name,
			extensionContractAddress: pool.extensionContractAddress,
			owner: pool.owner,
			isVerified: pool.isVerified,
			shutdownMode: pool.shutdownMode,
			assets: pool.assets.map((asset: any) => ({
				address: asset.address,
				name: asset.name,
				symbol: asset.symbol,
				decimals: asset.decimals,
				vToken: {
					address: asset.vToken.address,
					name: asset.vToken.name,
					symbol: asset.vToken.symbol,
					decimals: asset.vToken.decimals,
				},
				listedBlockNumber: asset.listedBlockNumber,
				config: {
					isLegacy: asset.config.isLegacy,
					debtFloor: asset.config.debtFloor,
					feeRate: asset.config.feeRate,
					lastFullUtilizationRate: asset.config.lastFullUtilizationRate,
					lastRateAccumulator: asset.config.lastRateAccumulator,
					lastUpdated: asset.config.lastUpdated,
					maxUtilization: asset.config.maxUtilization,
					reserve: asset.config.reserve,
					totalCollateralShares: asset.config.totalCollateralShares,
					totalNominalDebt: asset.config.totalNominalDebt,
				},
				oracleConfig: {
					pragmaKey: asset.oracleConfig.pragmaKey,
					timeout: asset.oracleConfig.timeout,
					numberOfSources: asset.oracleConfig.numberOfSources,
					startTimeOffset: asset.oracleConfig.startTimeOffset,
					timeWindow: asset.oracleConfig.timeWindow,
					aggregationMode: asset.oracleConfig.aggregationMode,
				},
				interestRate: asset.interestRate,
				stats: {
					canBeBorrowed: asset.stats.canBeBorrowed,
					totalSupplied: asset.stats.totalSupplied,
					totalDebt: asset.stats.totalDebt,
					currentUtilization: asset.stats.currentUtilization,
					supplyApy: asset.stats.supplyApy,
					defiSpringSupplyApr: asset.stats.defiSpringSupplyApr,
					borrowApr: asset.stats.borrowApr,
					lstApr: asset.stats.lstApr,
				},
				risk: {
					url: asset.risk.url,
					mdxUrl: asset.risk.mdxUrl,
				},
			})),
			pairs: pool.pairs || [],
		}));
}

export async function getBestVesuPool(
	token: string
): Promise<VesuPool | undefined> {
	const pools = await getVesuPools();
	let maxApy = 0;
	let bestPool: VesuPool | undefined = undefined;
	
	pools.forEach((pool) => {
		pool.assets.forEach((asset) => {
			if (asset.symbol === token) {
				const processedAsset = processVesuAsset(asset);
				const totalApy = processedAsset.apy + processedAsset.defiSpringApy;
				if (totalApy > maxApy) {
					maxApy = totalApy;
					bestPool = pool;
				}
			}
		});
	});
	return bestPool;
}

export async function getVesuTokens() {
	// biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
	const { data } = (await axios.get(`https://api.vesu.xyz/tokens`)).data;

	return data;
}