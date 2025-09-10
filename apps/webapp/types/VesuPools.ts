interface VesuValue {
	value: string;
	decimals: number;
}

interface VesuVToken {
	address: string;
	name: string;
	symbol: string;
	decimals: number;
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

interface VesuOracleConfig {
	pragmaKey: string;
	timeout: number;
	numberOfSources: number;
	startTimeOffset: number;
	timeWindow: number;
	aggregationMode: "median" | "mean";
}

interface VesuAssetStats {
	canBeBorrowed: boolean;
	totalSupplied: VesuValue;
	totalDebt: VesuValue;
	currentUtilization: VesuValue;
	supplyApy: VesuValue;
	defiSpringSupplyApr: VesuValue;
	borrowApr: VesuValue;
	lstApr: VesuValue;
}

interface VesuRisk {
	url: string;
	mdxUrl: string;
}

export interface VesuAsset {
	address: string;
	name: string;
	symbol: string;
	decimals: number;
	vToken: VesuVToken;
	listedBlockNumber: number;
	config: VesuAssetConfig;
	oracleConfig: VesuOracleConfig;
	interestRate: VesuValue;
	stats: VesuAssetStats;
	risk: VesuRisk;
}

export interface VesuPair {
	// Add pair structure when available
}

export interface VesuPool {
	id: string;
	name: string;
	extensionContractAddress: string;
	owner: string;
	isVerified: boolean;
	shutdownMode: "none" | "partial" | "full";
	assets: VesuAsset[];
	pairs: VesuPair[];
}

// Processed asset for UI display
export interface ProcessedAsset {
	name: string;
	symbol: string;
	currentUtilization: number;
	apy: number;
	defiSpringApy: number;
	borrowApr: number;
	lstApr: number;
	decimals: number;
	address: string;
	vTokenAddress: string;
	totalSupplied: number;
	totalDebt: number;
	canBeBorrowed: boolean;
}