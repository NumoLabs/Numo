interface VesuValue {
	value: string;
	decimals: number;
}

interface VesuPool {
	id: string;
	name: string;
	extensionContractAddress: string;
	owner: string;
}

interface VesuVToken {
	address: string;
	name: string;
	symbol: string;
	decimals: number;
}

interface VesuRisk {
	url: string;
	mdxUrl: string;
}

interface VesuAssetConfig {
	isLegacy: boolean;
	debtFloor: VesuValue;
	feeRate: VesuValue;
	lastFullUtilizationRate: VesuValue;
	lastRateAccumulator: VesuValue;
	lastUpdated: string;
	maxUtilization: VesuValue;
	reserve: VesuValue;
	totalCollateralShares: VesuValue;
	totalNominalDebt: VesuValue;
}

interface VesuInterestRateConfig {
	minTargetUtilization: VesuValue;
	maxTargetUtilization: VesuValue;
	targetUtilization: VesuValue;
	minFullUtilizationRate: VesuValue;
	maxFullUtilizationRate: VesuValue;
	zeroUtilizationRate: VesuValue;
	rateHalfLife: number;
	targetRatePercent: VesuValue;
}

interface VesuOracleConfig {
	pragmaKey: string;
	timeout: number;
	numberOfSources: number;
	startTimeOffset: number;
	timeWindow: number;
	aggregationMode: "median" | "mean";
}

interface VesuMarketStats {
	canBeBorrowed: boolean;
	totalSupplied: VesuValue;
	totalDebt: VesuValue;
	currentUtilization: VesuValue;
	supplyApy: VesuValue;
	defiSpringSupplyApr: VesuValue;
	borrowApr: VesuValue;
	lstApr: VesuValue;
}

export interface VesuMarket {
	pool: VesuPool;
	address: string;
	name: string;
	symbol: string;
	decimals: number;
	vToken: VesuVToken;
	listedBlockNumber: number;
	risk: VesuRisk;
	feeRate: VesuValue;
	interestRate: VesuValue;
	config: VesuAssetConfig;
	interestRateConfig: VesuInterestRateConfig;
	oracleConfig: VesuOracleConfig;
	stats: VesuMarketStats;
}

// Processed market for UI display
export interface ProcessedMarket {
	poolId: string;
	poolName: string;
	poolAddress: string;
	address: string;
	name: string;
	symbol: string;
	decimals: number;
	vTokenAddress: string;
	vTokenName: string;
	vTokenSymbol: string;
	currentUtilization: number;
	supplyApy: number;
	defiSpringApy: number;
	borrowApr: number;
	lstApr: number;
	totalSupplied: number;
	totalDebt: number;
	canBeBorrowed: boolean;
	feeRate: number;
	interestRate: number;
	debtFloor: number;
	maxUtilization: number;
	reserve: number;
	totalCollateralShares: number;
	totalNominalDebt: number;
	minTargetUtilization: number;
	maxTargetUtilization: number;
	targetUtilization: number;
	minFullUtilizationRate: number;
	maxFullUtilizationRate: number;
	zeroUtilizationRate: number;
	rateHalfLife: number;
	targetRatePercent: number;
	pragmaKey: string;
	timeout: number;
	numberOfSources: number;
	aggregationMode: string;
	riskUrl: string;
	riskMdxUrl: string;
}
