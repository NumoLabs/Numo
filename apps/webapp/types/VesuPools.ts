interface AssetStats {
	currentUtilization: {
		value: string;
		decimals: number;
	};
	supplyApy: {
		value: string;
		decimals: number;
	};
	defiSpringSupplyApr?: {
		value?: string;
		decimals?: number;
	};
}

export interface VesuAsset {
	name: string;
	symbol: string;
	stats: AssetStats;
	decimals: number;
}

export interface ProcessedAsset {
	name: string;
	symbol: string;
	currentUtilization: number;
	apy: number;
	defiSpringApy: number;
	decimals: number;
	address: string;
	vTokenAddress: string;
	// Real configuration data from Vesu
	floor?: number;
	maxUtilization?: number;
	targetUtilization?: number;
	feeRate?: number;
	zeroUtilizationRate?: string;
	initialFullUtilizationRate?: string;
}

// Vesu V2 specific asset interface
export interface VesuV2Asset extends ProcessedAsset {
	// V2 specific fields
	vaultAddress?: string;
	strategyAddress?: string;
	riskLevel?: string;
	maxDeposit?: number;
	minDeposit?: number;
	version?: string;
}

export interface VesuPool {
	id: string;
	name: string;
	address: string;
	assets: ProcessedAsset[];
}

// Vesu V2 specific pool interface
export interface VesuV2Pool extends VesuPool {
	version: string;
	poolFactoryAddress: string;
	assets: VesuV2Asset[];
	// V2 specific fields
	totalValueLocked?: number;
	totalSupplied?: number;
	totalBorrowed?: number;
	utilizationRate?: number;
	healthFactor?: number;
	lastUpdated?: string;
}