import axios from 'axios';
import type { VesuMarket, ProcessedMarket } from '@/types/VesuMarkets';

// Helper function to process Vesu market data for UI display
export function processVesuMarket(market: VesuMarket): ProcessedMarket {
	const currentUtilization = (Number(market.stats.currentUtilization.value) / 10 ** market.stats.currentUtilization.decimals) * 100;
	const supplyApy = (Number(market.stats.supplyApy.value) / 10 ** market.stats.supplyApy.decimals) * 100;
	const defiSpringApy = (Number(market.stats.defiSpringSupplyApr.value) / 10 ** market.stats.defiSpringSupplyApr.decimals) * 100;
	const borrowApr = (Number(market.stats.borrowApr.value) / 10 ** market.stats.borrowApr.decimals) * 100;
	const lstApr = market.stats.lstApr ? (Number(market.stats.lstApr.value) / 10 ** market.stats.lstApr.decimals) * 100 : 0;
	const totalSupplied = Number(market.stats.totalSupplied.value) / 10 ** market.stats.totalSupplied.decimals;
	const totalDebt = Number(market.stats.totalDebt.value) / 10 ** market.stats.totalDebt.decimals;
	const feeRate = (Number(market.feeRate.value) / 10 ** market.feeRate.decimals) * 100;
	const interestRate = (Number(market.interestRate.value) / 10 ** market.interestRate.decimals) * 100;
	const debtFloor = Number(market.config.debtFloor.value) / 10 ** market.config.debtFloor.decimals;
	const maxUtilization = (Number(market.config.maxUtilization.value) / 10 ** market.config.maxUtilization.decimals) * 100;
	const reserve = market.config.reserve ? Number(market.config.reserve.value) / 10 ** market.config.reserve.decimals : 0;
	const totalCollateralShares = market.config.totalCollateralShares ? Number(market.config.totalCollateralShares.value) / 10 ** market.config.totalCollateralShares.decimals : 0;
	const totalNominalDebt = market.config.totalNominalDebt ? Number(market.config.totalNominalDebt.value) / 10 ** market.config.totalNominalDebt.decimals : 0;
	const minTargetUtilization = (Number(market.interestRateConfig.minTargetUtilization.value) / 10 ** market.interestRateConfig.minTargetUtilization.decimals) * 100;
	const maxTargetUtilization = (Number(market.interestRateConfig.maxTargetUtilization.value) / 10 ** market.interestRateConfig.maxTargetUtilization.decimals) * 100;
	const targetUtilization = (Number(market.interestRateConfig.targetUtilization.value) / 10 ** market.interestRateConfig.targetUtilization.decimals) * 100;
	const minFullUtilizationRate = (Number(market.interestRateConfig.minFullUtilizationRate.value) / 10 ** market.interestRateConfig.minFullUtilizationRate.decimals) * 100;
	const maxFullUtilizationRate = (Number(market.interestRateConfig.maxFullUtilizationRate.value) / 10 ** market.interestRateConfig.maxFullUtilizationRate.decimals) * 100;
	const zeroUtilizationRate = (Number(market.interestRateConfig.zeroUtilizationRate.value) / 10 ** market.interestRateConfig.zeroUtilizationRate.decimals) * 100;
	const targetRatePercent = (Number(market.interestRateConfig.targetRatePercent.value) / 10 ** market.interestRateConfig.targetRatePercent.decimals) * 100;

	return {
		poolId: market.pool.id,
		poolName: market.pool.name,
		poolAddress: market.pool.extensionContractAddress,
		address: market.address,
		name: market.name,
		symbol: market.symbol,
		decimals: market.decimals,
		vTokenAddress: market.vToken.address,
		vTokenName: market.vToken.name,
		vTokenSymbol: market.vToken.symbol,
		currentUtilization,
		supplyApy,
		defiSpringApy,
		borrowApr,
		lstApr,
		totalSupplied,
		totalDebt,
		canBeBorrowed: market.stats.canBeBorrowed,
		feeRate,
		interestRate,
		debtFloor,
		maxUtilization,
		reserve,
		totalCollateralShares,
		totalNominalDebt,
		minTargetUtilization,
		maxTargetUtilization,
		targetUtilization,
		minFullUtilizationRate,
		maxFullUtilizationRate,
		zeroUtilizationRate,
		rateHalfLife: market.interestRateConfig.rateHalfLife,
		targetRatePercent,
		pragmaKey: market.oracleConfig.pragmaKey,
		timeout: market.oracleConfig.timeout,
		numberOfSources: market.oracleConfig.numberOfSources,
		aggregationMode: market.oracleConfig.aggregationMode,
		riskUrl: market.risk.url,
		riskMdxUrl: market.risk.mdxUrl,
	};
}

export async function getVesuMarkets(): Promise<VesuMarket[]> {
	const { data } = (await axios.get(`https://api.vesu.xyz/markets`)).data;
	return data;
}

export async function getVesuMarketsByToken(token: string): Promise<ProcessedMarket[]> {
	const markets = await getVesuMarkets();
	return markets
		.filter(market => market.symbol === token)
		.map(market => processVesuMarket(market));
}

export async function getBestVesuMarket(token: string): Promise<ProcessedMarket | undefined> {
	const markets = await getVesuMarketsByToken(token);
	if (markets.length === 0) return undefined;
	
	// Find market with highest total APY
	return markets.reduce((best, current) => {
		const bestTotalApy = best.supplyApy + best.defiSpringApy;
		const currentTotalApy = current.supplyApy + current.defiSpringApy;
		return currentTotalApy > bestTotalApy ? current : best;
	});
}

export async function getVesuMarketsByPool(poolId: string): Promise<ProcessedMarket[]> {
	const markets = await getVesuMarkets();
	return markets
		.filter(market => market.pool.id === poolId)
		.map(market => processVesuMarket(market));
}
