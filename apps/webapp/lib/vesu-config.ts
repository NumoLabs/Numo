// Vesu Configuration for Testnet Integration
import { getCurrentChainId, isTestnet } from './utils';

export interface VesuConfig {
	apiUrl: string;
	singletonAddress: string;
	extensionAddress: string;
	wbtcAddress: string;
	genesisPoolId: string;
	network: 'testnet' | 'mainnet';
}

// Vesu Testnet Configuration (Real addresses from vesu-v1)
export const VESU_TESTNET_CONFIG: VesuConfig = {
	apiUrl: 'https://api.vesu.xyz', // Using mainnet API for now
	singletonAddress: '0x2110b3cde727cd34407e257e1070857a06010cf02a14b1ee181612fb1b61c30', // Sepolia Singleton V2
	extensionAddress: '0x274669f178d303cdd92638ab2aee6d5cb75d72baf79606a02b749552fc17759', // Sepolia Extension PO V2
	wbtcAddress: '0x63d32a3fa6074e72e7a1e06fe78c46a0c8473217773e19f11d8c8cbfc4ff8ca', // Sepolia WBTC
	genesisPoolId: '566154675190438152544449762131613456939576463701265245209877893089848934391', // Sepolia Genesis Pool
	network: 'testnet',
};

// Vesu Mainnet Configuration (Real addresses from vesu-v1)
export const VESU_MAINNET_CONFIG: VesuConfig = {
	apiUrl: 'https://api.vesu.xyz',
	singletonAddress: '0x2545b2e5d519fc230e9cd781046d3a64e092114f07e44771e0d719d148725ef', // Mainnet Singleton V2
	extensionAddress: '0x7cf3881eb4a58e76b41a792fa151510e7057037d80eda334682bd3e73389ec0', // Mainnet Extension PO V2
	wbtcAddress: '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac', // Mainnet WBTC - FROM DEPLOYMENT
	genesisPoolId: '2198503327643286920898110335698706244522220458610657370981979460625005526824', // Mainnet Genesis Pool - CORRECTED
	network: 'mainnet',
};

// Get current Vesu configuration based on network
export function getVesuConfig(): VesuConfig {
	return isTestnet() ? VESU_TESTNET_CONFIG : VESU_MAINNET_CONFIG;
}

// Get Vesu configuration by chain ID
export function getVesuConfigByChainId(chainId: string): VesuConfig {
	return chainId === 'SN_SEPOLIA' ? VESU_TESTNET_CONFIG : VESU_MAINNET_CONFIG;
}

// Vesu API endpoints
export const VESU_ENDPOINTS = {
	POOLS: '/pools',
	POSITIONS: '/positions',
	TOKENS: '/tokens',
	ASSETS: '/assets',
	STATS: '/stats',
} as const;

// Helper function to build Vesu API URL
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
	if (utilization >= 90) return VESU_RISK_LEVELS.CRITICAL;
	if (utilization >= 80) return VESU_RISK_LEVELS.HIGH;
	if (utilization >= 50) return VESU_RISK_LEVELS.MEDIUM;
	return VESU_RISK_LEVELS.LOW;
}

// Format APY for display
export function formatApy(apy: number): string {
	return `${apy.toFixed(2)}%`;
}

// Format utilization for display
export function formatUtilization(utilization: number): string {
	return `${utilization.toFixed(1)}%`;
}
