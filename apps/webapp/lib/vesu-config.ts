// Vesu V2 Configuration
import { isTestnet } from './utils';

export interface VesuV2Config {
	apiUrl: string;
	poolFactory: string;
	oracle: string;
	multiply: string;
	liquidate: string;
	defiSpringDistributor: string;
	btcfiDistributor: string;
	network: 'testnet' | 'mainnet';
}

// Vesu V2 Testnet Configuration (Sepolia)
export const VESU_V2_TESTNET_CONFIG: VesuV2Config = {
	apiUrl: 'https://api.vesu.xyz/v2',
	poolFactory: '0x0000000000000000000000000000000000000000000000000000000000000000', // TBD - Sepolia V2 Pool Factory
	oracle: '0x0000000000000000000000000000000000000000000000000000000000000000', // TBD - Sepolia V2 Oracle
	multiply: '0x0000000000000000000000000000000000000000000000000000000000000000', // TBD - Sepolia V2 Multiply
	liquidate: '0x0000000000000000000000000000000000000000000000000000000000000000', // TBD - Sepolia V2 Liquidate
	defiSpringDistributor: '0x0000000000000000000000000000000000000000000000000000000000000000', // TBD - Sepolia V2 DeFi Spring
	btcfiDistributor: '0x0000000000000000000000000000000000000000000000000000000000000000', // TBD - Sepolia V2 BTCFi
	network: 'testnet',
};

// Vesu V2 Mainnet Configuration
export const VESU_V2_MAINNET_CONFIG: VesuV2Config = {
	apiUrl: 'https://api.vesu.xyz/v2',
	poolFactory: '0x3760f903a37948f97302736f89ce30290e45f441559325026842b7a6fb388c0',
	oracle: '0xfe4bfb1b353ba51eb34dff963017f94af5a5cf8bdf3dfc191c504657f3c05',
	multiply: '0x7964760e90baa28841ec94714151e03fbc13321797e68a874e88f27c9d58513',
	liquidate: '0x6b895ba904fb8f02ed0d74e343161de48e611e9e771be4cc2c997501dbfb418',
	defiSpringDistributor: '0x387f3eb1d98632fbe3440a9f1385aec9d87b6172491d3dd81f1c35a7c61048f',
	btcfiDistributor: '0x47ba31cdfc2db9bd20ab8a5b2788f877964482a8548a6e366ce56228ea22fa8',
	network: 'mainnet',
};

// Legacy V1 config for backward compatibility
export interface VesuConfig {
	apiUrl: string;
	singletonAddress: string;
	extensionAddress: string;
	wbtcAddress: string;
	genesisPoolId: string;
	network: 'testnet' | 'mainnet';
}

export const VESU_TESTNET_CONFIG: VesuConfig = {
	apiUrl: 'https://api.vesu.xyz',
	singletonAddress: '0x2110b3cde727cd34407e257e1070857a06010cf02a14b1ee181612fb1b61c30',
	extensionAddress: '0x274669f178d303cdd92638ab2aee6d5cb75d72baf79606a02b749552fc17759',
	wbtcAddress: '0x63d32a3fa6074e72e7a1e06fe78c46a0c8473217773e19f11d8c8cbfc4ff8ca',
	genesisPoolId: '566154675190438152544449762131613456939576463701265245209877893089848934391',
	network: 'testnet',
};

export const VESU_MAINNET_CONFIG: VesuConfig = {
	apiUrl: 'https://api.vesu.xyz',
	singletonAddress: '0x2545b2e5d519fc230e9cd781046d3a64e092114f07e44771e0d719d148725ef',
	extensionAddress: '0x7cf3881eb4a58e76b41a792fa151510e7057037d80eda334682bd3e73389ec0',
	wbtcAddress: '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac',
	genesisPoolId: '2198503327643286920898110335698706244522220458610657370981979460625005526824',
	network: 'mainnet',
};

// Get current Vesu V2 configuration based on network
// MAINNET ONLY: Always returns mainnet configuration
export function getVesuV2Config(): VesuV2Config {
	return VESU_V2_MAINNET_CONFIG;
}

// Get Vesu V2 configuration by chain ID
// MAINNET ONLY: Always returns mainnet configuration
export function getVesuV2ConfigByChainId(chainId: string): VesuV2Config {
	return VESU_V2_MAINNET_CONFIG;
}

// Get current Vesu configuration based on network (V1 - Legacy)
// MAINNET ONLY: Always returns mainnet configuration
export function getVesuConfig(): VesuConfig {
	return VESU_MAINNET_CONFIG;
}

// Get Vesu configuration by chain ID (V1 - Legacy)
// MAINNET ONLY: Always returns mainnet configuration
export function getVesuConfigByChainId(chainId: string): VesuConfig {
	return VESU_MAINNET_CONFIG;
}

// Vesu V2 API endpoints
export const VESU_V2_ENDPOINTS = {
	POOLS: '/v2/pools',
	POSITIONS: '/v2/positions',
	TOKENS: '/v2/tokens',
	ASSETS: '/v2/assets',
	STATS: '/v2/stats',
	VAULTS: '/v2/vaults',
	STRATEGIES: '/v2/strategies',
	REWARDS: '/v2/rewards',
} as const;

// Vesu V1 API endpoints (Legacy)
export const VESU_ENDPOINTS = {
	POOLS: '/pools',
	POSITIONS: '/positions',
	TOKENS: '/tokens',
	ASSETS: '/assets',
	STATS: '/stats',
} as const;

// Vesu V2 Core Contracts (Starknet Mainnet)
// Source: https://docs.vesu.xyz/developers/contract-addresses
export const VESU_V2_CONTRACTS = {
	POOL_FACTORY:
		'0x3760f903a37948f97302736f89ce30290e45f441559325026842b7a6fb388c0',
	ORACLE:
		'0xfe4bfb1b353ba51eb34dff963017f94af5a5cf8bdf3dfc191c504657f3c05',
	MULTIPLY:
		'0x7964760e90baa28841ec94714151e03fbc13321797e68a874e88f27c9d58513',
	LIQUIDATE:
		'0x6b895ba904fb8f02ed0d74e343161de48e611e9e771be4cc2c997501dbfb418',
	DEFI_SPRING_DISTRIBUTOR:
		'0x387f3eb1d98632fbe3440a9f1385aec9d87b6172491d3dd81f1c35a7c61048f',
	BTCFI_DISTRIBUTOR:
		'0x47ba31cdfc2db9bd20ab8a5b2788f877964482a8548a6e366ce56228ea22fa8',
} as const;

// Vesu V2 Pools (Starknet Mainnet)
// Source: https://docs.vesu.xyz/developers/contract-addresses
export const VESU_V2_POOLS = {
	PRIME:
		'0x451fe483d5921a2919ddd81d0de6696669bccdacd859f72a4fba7656b97c3b5',
	RE7_USDC_CORE:
		'0x3976cac265a12609934089004df458ea29c776d77da423c96dc761d09d24124',
	RE7_USDC_PRIME:
		'0x2eef0c13b10b487ea5916b54c0a7f98ec43fb3048f60fdeedaf5b08f6f88aaf',
	RE7_USDC_FRONTIER:
		'0x5c03e7e0ccfe79c634782388eb1e6ed4e8e2a013ab0fcc055140805e46261bd',
	RE7_XBTC:
		'0x3a8416bf20d036df5b1cf3447630a2e1cb04685f6b0c3a70ed7fb1473548ecf',
	RE7_USDC_STABLE_CORE:
		'0x73702fce24aba36da1eac539bd4bae62d4d6a76747b7cdd3e016da754d7a135',
} as const;

// Helper function to build Vesu V2 API URL
export function buildVesuV2ApiUrl(endpoint: string, chainId?: string): string {
	const config = chainId ? getVesuV2ConfigByChainId(chainId) : getVesuV2Config();
	return `${config.apiUrl}${endpoint}`;
}

// Helper function to build Vesu API URL (V1 - Legacy)
export function buildVesuApiUrl(endpoint: string, chainId?: string): string {
	const config = chainId ? getVesuConfigByChainId(chainId) : getVesuConfig();
	return `${config.apiUrl}${endpoint}`;
}

// Vesu pool types and status
export const VESU_POOL_STATUS = {
	ACTIVE: 'active',
	PAUSED: 'paused',
	DEPRECATED: 'deprecated',
} as const;

export const VESU_POOL_TYPES = {
	LENDING: 'lending',
	BORROWING: 'borrowing',
	LIQUIDITY: 'liquidity',
} as const;

// Risk levels for Vesu pools
export const VESU_RISK_LEVELS = {
	LOW: 'Low',
	MEDIUM: 'Medium',
	HIGH: 'High',
	CRITICAL: 'Critical',
} as const;

// Calculate risk level based on utilization
export function calculateRiskLevel(utilization: number): string {
	// Handle edge cases: null, undefined, NaN, or negative values
	if (utilization == null || isNaN(utilization) || utilization < 0) {
		return VESU_RISK_LEVELS.LOW;
	}
	
	if (utilization >= 90) return VESU_RISK_LEVELS.CRITICAL;
	if (utilization >= 80) return VESU_RISK_LEVELS.HIGH;
	if (utilization >= 50) return VESU_RISK_LEVELS.MEDIUM;
	return VESU_RISK_LEVELS.LOW;
}

// Format APY for display
export function formatApy(apy: number): string {
	// Handle edge cases: null, undefined, NaN
	if (apy == null || isNaN(apy)) {
		return '0.00%';
	}
	return `${apy.toFixed(2)}%`;
}

// Format utilization for display
export function formatUtilization(utilization: number): string {
	// Handle edge cases: null, undefined, NaN
	if (utilization == null || isNaN(utilization)) {
		return '0.0%';
	}
	return `${utilization.toFixed(1)}%`;
}
