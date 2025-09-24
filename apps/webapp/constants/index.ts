// constants.ts
import { RpcProvider, constants } from 'starknet';

export const getAddresses = (chainId: string | undefined) => ({
	EKUBO_CORE:
		'0x00000005dd3D2F4429AF886cD1a3b08289DBcEa99A294197E9eB43b0e0325b4b',
	EKUBO_POSITIONS:
		chainId === 'SN_SEPOLIA'
			? '0x06a2aee84bb0ed5dded4384ddd0e40e9c1372b818668375ab8e3ec08807417e5'
			: '0x02e0af29598b407c8716b17f6d2795eca1b471413fa03fb145a5e33722184067',
	USDC:
		chainId === 'SN_SEPOLIA'
			? '0x053b40A647CEDfca6cA84f542A0fe36736031905A9639a7f19A3C1e66bFd5080'
			: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
	// Vesu Contract Addresses (Real addresses from vesu-v1)
	VESU_SINGLETON:
		chainId === 'SN_SEPOLIA'
			? '0x2110b3cde727cd34407e257e1070857a06010cf02a14b1ee181612fb1b61c30' // Sepolia Singleton V2
			: '0x2545b2e5d519fc230e9cd781046d3a64e092114f07e44771e0d719d148725ef', // Mainnet Singleton V2
	VESU_EXTENSION:
		chainId === 'SN_SEPOLIA'
			? '0x274669f178d303cdd92638ab2aee6d5cb75d72baf79606a02b749552fc17759' // Sepolia Extension PO V2
			: '0x7cf3881eb4a58e76b41a792fa151510e7057037d80eda334682bd3e73389ec0', // Mainnet Extension PO V2
	WBTC:
		chainId === 'SN_SEPOLIA'
			? '0x63d32a3fa6074e72e7a1e06fe78c46a0c8473217773e19f11d8c8cbfc4ff8ca' // Sepolia WBTC
			: '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac', // Mainnet WBTC
});

export const getBraavosChainId = (chainId: string) =>
	chainId === constants.NetworkName.SN_MAIN
		? '0x534e5f4d41494e'
		: '0x534e5f5345504f4c4941';

export const getBaseUrl = (chainId: string) =>
	chainId === 'SN_SEPOLIA'
		? 'https://sepolia-api.ekubo.org'
		: 'https://mainnet-api.ekubo.org';

export const ARGENT_SESSION_SERVICE_BASE_URL =
	process.env.NEXT_PUBLIC_ARGENT_SESSION_SERVICE_BASE_URL ||
	'https://cloud.argent-api.com/v1';

export const ARGENT_WEBWALLET_URL =
	process.env.NEXT_PUBLIC_ARGENT_WEBWALLET_URL || 'https://web.argent.xyz';

export const getNodeUrl = (chainId?: string) =>
	chainId === 'SN_SEPOLIA'
		? process.env.NEXT_PUBLIC_SEPOLIA_RPC
		: process.env.NEXT_PUBLIC_MAINNET_RPC;

export const getProvider = (nodeUrl: string | undefined) =>
	new RpcProvider({ nodeUrl });

export const getChainId = (chainId?: string) =>
	chainId === 'SN_SEPOLIA'
		? constants.NetworkName.SN_SEPOLIA
		: constants.NetworkName.SN_MAIN;

// Vesu API Configuration
export const getVesuApiUrl = (chainId?: string) =>
	chainId === 'SN_SEPOLIA'
		? 'https://api-testnet.vesu.xyz' // Vesu testnet API
		: 'https://api.vesu.xyz'; // Vesu mainnet API

// Vesu Pool Configuration (Real pool IDs from vesu-v1)
export const getVesuPoolConfig = (chainId?: string) => ({
	apiUrl: getVesuApiUrl(chainId),
	genesisPoolId: chainId === 'SN_SEPOLIA'
		? '566154675190438152544449762131613456939576463701265245209877893089848934391' // Sepolia Genesis Pool
		: '2198503327643286920898110335698706244522220458610657370981979460625005526824', // Mainnet Genesis Pool - CORRECTED
	network: chainId === 'SN_SEPOLIA' ? 'testnet' : 'mainnet',
});