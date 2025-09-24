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

export interface VesuPool {
	id: string;
	name: string;
	address: string;
	assets: ProcessedAsset[];
}