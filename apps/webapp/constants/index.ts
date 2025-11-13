// constants.ts
import { RpcProvider, constants } from 'starknet';

// MAINNET ONLY: Always returns mainnet addresses
export const getAddresses = (chainId: string | undefined) => ({
	EKUBO_CORE:
		'0x00000005dd3D2F4429AF886cD1a3b08289DBcEa99A294197E9eB43b0e0325b4b',
	EKUBO_POSITIONS:
		'0x02e0af29598b407c8716b17f6d2795eca1b471413fa03fb145a5e33722184067', // Mainnet
	USDC:
		chainId === 'SN_SEPOLIA'
			? '0x053b40A647CEDfca6cA84f542A0fe36736031905A9639a7f19A3C1e66bFd5080'
			: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
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
	chainId === 'SN_SEPOLIA'
		? constants.NetworkName.SN_SEPOLIA
		: constants.NetworkName.SN_MAIN;
