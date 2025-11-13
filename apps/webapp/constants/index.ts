// constants.ts
import { RpcProvider, constants } from 'starknet';

// MAINNET ONLY: Always returns mainnet addresses
export const getAddresses = (chainId: string | undefined) => ({
	EKUBO_CORE:
		'0x00000005dd3D2F4429AF886cD1a3b08289DBcEa99A294197E9eB43b0e0325b4b',
	EKUBO_POSITIONS:
		'0x02e0af29598b407c8716b17f6d2795eca1b471413fa03fb145a5e33722184067', // Mainnet
	USDC:
		'0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8', // Mainnet
	// Vesu Contract Addresses (Real addresses from vesu-v1)
	VESU_SINGLETON:
		'0x2545b2e5d519fc230e9cd781046d3a64e092114f07e44771e0d719d148725ef', // Mainnet Singleton V2
	VESU_EXTENSION:
		'0x7cf3881eb4a58e76b41a792fa151510e7057037d80eda334682bd3e73389ec0', // Mainnet Extension PO V2
	WBTC:
		'0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac', // Mainnet WBTC
});

// MAINNET ONLY: Always returns mainnet chain ID
export const getBraavosChainId = (chainId: string) =>
	'0x534e5f4d41494e'; // Always mainnet

// MAINNET ONLY: Always returns mainnet API URL
export const getBaseUrl = (chainId: string) =>
	'https://mainnet-api.ekubo.org';

export const ARGENT_SESSION_SERVICE_BASE_URL =
	process.env.NEXT_PUBLIC_ARGENT_SESSION_SERVICE_BASE_URL ||
	'https://cloud.argent-api.com/v1';

export const ARGENT_WEBWALLET_URL =
	process.env.NEXT_PUBLIC_ARGENT_WEBWALLET_URL || 'https://web.argent.xyz';

// MAINNET ONLY: Always returns mainnet RPC URL
export const getNodeUrl = (chainId?: string) =>
	process.env.NEXT_PUBLIC_MAINNET_RPC || 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7';

export const getProvider = (nodeUrl: string | undefined) =>
	new RpcProvider({ nodeUrl });

// MAINNET ONLY: Always returns mainnet chain ID
export const getChainId = (chainId?: string) =>
	constants.NetworkName.SN_MAIN;

// Vesu API Configuration
// MAINNET ONLY: Always returns mainnet API URL
export const getVesuApiUrl = (chainId?: string) =>
	'https://api.vesu.xyz'; // Vesu mainnet API

// Vesu Pool Configuration (Real pool IDs from vesu-v1)
// MAINNET ONLY: Always returns mainnet configuration
export const getVesuPoolConfig = (chainId?: string) => ({
	apiUrl: getVesuApiUrl(chainId),
	genesisPoolId: '2198503327643286920898110335698706244522220458610657370981979460625005526824', // Mainnet Genesis Pool
	network: 'mainnet',
});