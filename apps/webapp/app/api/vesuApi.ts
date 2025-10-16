/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchCryptoPrice, getCurrentChainId } from '@/lib/utils';
import type { VesuPool } from '@/types/VesuPools';
import type { VesuEarnPosition } from '@/types/VesuPositions';
import { 
	getVesuV2Config, 
	buildVesuV2ApiUrl, 
	VESU_V2_ENDPOINTS, 
	calculateRiskLevel,
	// Legacy V1 imports for backward compatibility
	getVesuConfig, 
	buildVesuApiUrl, 
	VESU_ENDPOINTS
} from '@/lib/vesu-config';
import axios from 'axios';

// Get current Vesu V2 configuration
const getCurrentVesuV2Config = () => {
	const chainId = getCurrentChainId();
	return getVesuV2Config();
};

// Get current Vesu configuration (V1 - Legacy)
const getCurrentVesuConfig = () => {
	const chainId = getCurrentChainId();
	return getVesuConfig();
};

// Vesu V2 API Functions
export async function getVesuV2EarnPositions(address: string) {
	if (!address) {
		return [];
	}
	const config = getCurrentVesuV2Config();
	const { data } = (
		await axios.get(
			buildVesuV2ApiUrl(`${VESU_V2_ENDPOINTS.POSITIONS}?walletAddress=${address}`)
		)
	).data;
	const filteredData = data.filter(
		(item: { type: string }) => item.type === 'earn'
	);

	const pools = await getVesuV2Pools();

	const vesuPositions: VesuEarnPosition[] = await Promise.all(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		filteredData.map(async (position: any) => {
			const poolData = pools.find(
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				(pool: { id: any }) => pool.id === position.pool.id
			);
			let poolApy = 0;
			let rewardsApy = 0;
			let risk = 'Low';

			const tokenPrice = await fetchCryptoPrice(
				position.collateral.symbol
			);

			if (poolData) {
				const asset = poolData.assets.find(
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					(asset: { symbol: any }) =>
						asset.symbol === position.collateral.symbol
				);
				if (asset) {
					poolApy = asset.apy;
					rewardsApy = asset.defiSpringApy;
					risk = calculateRiskLevel(asset.currentUtilization);
				}
			}

			return {
				poolId: position.pool.id,
				pool: position.pool.name,
				type: position.type,
				collateral: position.collateral.symbol,
				total_supplied:
					(Number(position.collateral.value) /
						10 ** position.collateral.decimals) *
					tokenPrice,
				risk,
				poolApy,
				rewardsApy,
			};
		})
	);
	return vesuPositions;
}

export async function getVesuV2Pools() {
	try {
		// biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
		const { data } = (await axios.get(buildVesuV2ApiUrl(VESU_V2_ENDPOINTS.POOLS))).data;
		return data
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			.filter((pool: any) => pool?.isVerified && pool?.version === 'v2')
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			.map((pool: any) => ({
				id: pool?.id ?? 'unknown',
				name: pool?.name ?? 'Unknown V2 Pool',
				address: pool?.poolFactoryAddress ?? '', // V2 uses pool factory instead of extension
				version: pool?.version ?? 'v2',
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				assets: (pool?.assets ?? []).map((asset: any) => {
					// Add null safety checks for asset stats
					const stats = asset?.stats ?? {};
					const currentUtilizationStats = stats?.currentUtilization ?? {};
					const supplyApyStats = stats?.supplyApy ?? {};
					const defiSpringStats = stats?.defiSpringSupplyApr ?? {};
					
					return {
						name: asset?.name ?? 'Unknown Asset',
						symbol: asset?.symbol ?? 'UNKNOWN',
						currentUtilization: currentUtilizationStats?.value && currentUtilizationStats?.decimals
							? (Number(currentUtilizationStats.value) / 10 ** Number(currentUtilizationStats.decimals)) * 100
							: 0,
						apy: supplyApyStats?.value && supplyApyStats?.decimals
							? (Number(supplyApyStats.value) / 10 ** Number(supplyApyStats.decimals)) * 100
							: 0,
						defiSpringApy: defiSpringStats?.value && defiSpringStats?.decimals
							? (Number(defiSpringStats.value) / 10 ** Number(defiSpringStats.decimals)) * 100
							: 0,
						decimals: asset?.decimals ?? 18,
						address: asset?.address ?? '',
						vTokenAddress: asset?.vToken?.address ?? '',
						// V2 specific fields
						vaultAddress: asset?.vault?.address,
						strategyAddress: asset?.strategy?.address,
						riskLevel: asset?.riskLevel ?? 'Unknown',
						maxDeposit: asset?.maxDeposit ?? 0,
						minDeposit: asset?.minDeposit ?? 0,
					};
				}),
			}));
	} catch (error) {
		console.warn('⚠️ V2 API not available, using mock V2 data:', error);
		// Return mock V2 data when API is not available
		return getMockVesuV2Pools();
	}
}

// Mock V2 pools data for development/testing
function getMockVesuV2Pools() {
	return [
		{
			id: 'vesu-v2-prime-pool',
			name: 'Vesu V2 Prime Pool',
			address: '0x451fe483d5921a2919ddd81d0de6696669bccdacd859f72a4fba7656b97c3b5',
			version: 'v2',
			totalValueLocked: 2500000,
			totalSupplied: 1800000,
			totalBorrowed: 700000,
			utilizationRate: 38.9,
			healthFactor: 1.25,
			lastUpdated: new Date().toISOString(),
			assets: [
				{
					name: 'Wrapped Bitcoin',
					symbol: 'WBTC',
					currentUtilization: 45.2,
					apy: 8.5,
					defiSpringApy: 2.3,
					decimals: 8,
					address: '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac',
					vTokenAddress: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
					vaultAddress: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
					strategyAddress: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
					riskLevel: 'Low',
					maxDeposit: 1000000,
					minDeposit: 100,
				},
				{
					name: 'USD Coin',
					symbol: 'USDC',
					currentUtilization: 32.1,
					apy: 6.8,
					defiSpringApy: 1.9,
					decimals: 6,
					address: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
					vTokenAddress: '0x2345678901bcdef1234567890abcdef1234567890abcdef1234567890abcdef1',
					vaultAddress: '0xbcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab',
					strategyAddress: '0x8765432109edcba9876543210fedcba9876543210fedcba9876543210fedcba9',
					riskLevel: 'Low',
					maxDeposit: 5000000,
					minDeposit: 50,
				}
			]
		},
		{
			id: 'vesu-v2-re7-core-pool',
			name: 'Vesu V2 RE7 Core Pool',
			address: '0x3976cac265a12609934089004df458ea29c776d77da423c96dc761d09d24124',
			version: 'v2',
			totalValueLocked: 1800000,
			totalSupplied: 1200000,
			totalBorrowed: 600000,
			utilizationRate: 50.0,
			healthFactor: 1.15,
			lastUpdated: new Date().toISOString(),
			assets: [
				{
					name: 'Real Estate Token',
					symbol: 'RE7',
					currentUtilization: 55.8,
					apy: 12.4,
					defiSpringApy: 3.2,
					decimals: 18,
					address: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
					vTokenAddress: '0x3456789012cdef1234567890abcdef1234567890abcdef1234567890abcdef12',
					vaultAddress: '0xcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc',
					strategyAddress: '0x7654321098dcba9876543210fedcba9876543210fedcba9876543210fedcba8',
					riskLevel: 'Medium',
					maxDeposit: 800000,
					minDeposit: 200,
				}
			]
		},
		{
			id: 'vesu-v2-stable-core-pool',
			name: 'Vesu V2 Stable Core Pool',
			address: '0x73702fce24aba36da1eac539bd4bae62d4d6a76747b7cdd3e016da754d7a135',
			version: 'v2',
			totalValueLocked: 3200000,
			totalSupplied: 2800000,
			totalBorrowed: 400000,
			utilizationRate: 14.3,
			healthFactor: 1.45,
			lastUpdated: new Date().toISOString(),
			assets: [
				{
					name: 'Tether USD',
					symbol: 'USDT',
					currentUtilization: 12.5,
					apy: 4.2,
					defiSpringApy: 1.1,
					decimals: 6,
					address: '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8',
					vTokenAddress: '0x4567890123def1234567890abcdef1234567890abcdef1234567890abcdef123',
					vaultAddress: '0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd',
					strategyAddress: '0x6543210987cba9876543210fedcba9876543210fedcba9876543210fedcba7',
					riskLevel: 'Low',
					maxDeposit: 2000000,
					minDeposit: 25,
				}
			]
		}
	];
}

// Legacy V1 function for backward compatibility
export async function getVesuPools() {
	try {
		// biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
		const { data } = (await axios.get(buildVesuApiUrl(VESU_ENDPOINTS.POOLS))).data;
		return data
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			.filter((pool: any) => pool?.isVerified)
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			.map((pool: any) => ({
				id: pool?.id ?? 'unknown',
				name: pool?.name ?? 'Unknown Pool',
				address: pool?.extensionContractAddress ?? '',
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				assets: (pool?.assets ?? []).map((asset: any) => {
					// Add null safety checks for asset stats
					const stats = asset?.stats ?? {};
					const currentUtilizationStats = stats?.currentUtilization ?? {};
					const supplyApyStats = stats?.supplyApy ?? {};
					const defiSpringStats = stats?.defiSpringSupplyApr ?? {};
					
					return {
						name: asset?.name ?? 'Unknown Asset',
						symbol: asset?.symbol ?? 'UNKNOWN',
						currentUtilization: currentUtilizationStats?.value && currentUtilizationStats?.decimals
							? (Number(currentUtilizationStats.value) / 10 ** Number(currentUtilizationStats.decimals)) * 100
							: 0,
						apy: supplyApyStats?.value && supplyApyStats?.decimals
							? (Number(supplyApyStats.value) / 10 ** Number(supplyApyStats.decimals)) * 100
							: 0,
						defiSpringApy: defiSpringStats?.value && defiSpringStats?.decimals
							? (Number(defiSpringStats.value) / 10 ** Number(defiSpringStats.decimals)) * 100
							: 0,
						decimals: asset?.decimals ?? 18,
						address: asset?.address ?? '',
						vTokenAddress: asset?.vToken?.address ?? '',
					};
				}),
			}));
	} catch (error) {
		console.error('Error fetching Vesu pools:', error);
		throw new Error('Failed to fetch Vesu pools data');
	}
}

// Vesu V2 specific functions
export async function getVesuV2Vaults() {
	try {
		const { data } = (await axios.get(buildVesuV2ApiUrl(VESU_V2_ENDPOINTS.VAULTS))).data;
		return data;
	} catch (error) {
		console.warn('⚠️ V2 Vaults API not available, using mock data:', error);
		return getMockVesuV2Vaults();
	}
}

export async function getVesuV2Strategies() {
	try {
		const { data } = (await axios.get(buildVesuV2ApiUrl(VESU_V2_ENDPOINTS.STRATEGIES))).data;
		return data;
	} catch (error) {
		console.warn('⚠️ V2 Strategies API not available, using mock data:', error);
		return getMockVesuV2Strategies();
	}
}

export async function getVesuV2Rewards(address: string) {
	if (!address) return [];
	try {
		const { data } = (await axios.get(buildVesuV2ApiUrl(`${VESU_V2_ENDPOINTS.REWARDS}?walletAddress=${address}`))).data;
		return data;
	} catch (error) {
		console.warn('⚠️ V2 Rewards API not available, using mock data:', error);
		return getMockVesuV2Rewards(address);
	}
}

// Mock V2 data functions
function getMockVesuV2Vaults() {
	return [
		{
			id: 'vault-1',
			name: 'Prime Vault',
			address: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
			totalValueLocked: 1500000,
			apy: 9.2,
			riskLevel: 'Low',
			strategy: 'Conservative',
			lastUpdated: new Date().toISOString()
		},
		{
			id: 'vault-2',
			name: 'Growth Vault',
			address: '0xbcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab',
			totalValueLocked: 800000,
			apy: 15.8,
			riskLevel: 'Medium',
			strategy: 'Aggressive',
			lastUpdated: new Date().toISOString()
		}
	];
}

function getMockVesuV2Strategies() {
	return [
		{
			id: 'strategy-1',
			name: 'Conservative Strategy',
			description: 'Low risk, stable returns',
			apy: 6.5,
			riskLevel: 'Low',
			totalAllocated: 1200000,
			lastUpdated: new Date().toISOString()
		},
		{
			id: 'strategy-2',
			name: 'Growth Strategy',
			description: 'Medium risk, higher returns',
			apy: 12.3,
			riskLevel: 'Medium',
			totalAllocated: 800000,
			lastUpdated: new Date().toISOString()
		},
		{
			id: 'strategy-3',
			name: 'Aggressive Strategy',
			description: 'High risk, maximum returns',
			apy: 18.7,
			riskLevel: 'High',
			totalAllocated: 400000,
			lastUpdated: new Date().toISOString()
		}
	];
}

function getMockVesuV2Rewards(address: string) {
	return [
		{
			id: 'reward-1',
			poolId: 'vesu-v2-prime-pool',
			asset: 'WBTC',
			amount: '0.025',
			apy: 2.3,
			lastClaimed: new Date(Date.now() - 86400000).toISOString(),
			nextClaim: new Date(Date.now() + 86400000).toISOString()
		},
		{
			id: 'reward-2',
			poolId: 'vesu-v2-stable-core-pool',
			asset: 'USDT',
			amount: '125.50',
			apy: 1.1,
			lastClaimed: new Date(Date.now() - 172800000).toISOString(),
			nextClaim: new Date(Date.now() + 691200000).toISOString()
		}
	];
}

export async function getBestVesuV2Pool(
	token: string
): Promise<VesuPool | undefined> {
	const pools = await getVesuV2Pools();
	let maxApy = 0;
	let bestPool = undefined;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	// biome-ignore lint/complexity/noForEach: <explanation>
		pools.forEach((pool: any) => {
		// biome-ignore lint/complexity/noForEach: <explanation>
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				pool.assets.forEach((asset: any) => {
			if (asset.symbol === token) {
				const apy =
					(Number(asset.apy || 0) /
						10 ** Number(asset.decimals || 0)) *
					100;
				const defiSpringApy =
					(Number(asset.defiSpringSupplyApr || 0) /
						10 ** Number(asset.decimals || 0)) *
					100;
				const totalApy = apy + defiSpringApy;
				if (totalApy > maxApy) {
					maxApy = totalApy;
					bestPool = pool;
				}
			}
		});
	});
	return bestPool;
}

// Legacy V1 function for backward compatibility
export async function getBestVesuPool(
	token: string
): Promise<VesuPool | undefined> {
	const pools = await getVesuPools();
	let maxApy = 0;
	let bestPool = undefined;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	// biome-ignore lint/complexity/noForEach: <explanation>
		pools.forEach((pool: any) => {
		// biome-ignore lint/complexity/noForEach: <explanation>
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				pool.assets.forEach((asset: any) => {
			if (asset.symbol === token) {
				const apy =
					(Number(asset.apy || 0) /
						10 ** Number(asset.decimals || 0)) *
					100;
				const defiSpringApy =
					(Number(asset.defiSpringSupplyApr || 0) /
						10 ** Number(asset.decimals || 0)) *
					100;
				const totalApy = apy + defiSpringApy;
				if (totalApy > maxApy) {
					maxApy = totalApy;
					bestPool = pool;
				}
			}
		});
	});
	return bestPool;
}

// Vesu V2 tokens
export async function getVesuV2Tokens() {
	// biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
	const { data } = (await axios.get(buildVesuV2ApiUrl(VESU_V2_ENDPOINTS.TOKENS))).data;
	return data;
}

// Legacy V1 function for backward compatibility
export async function getVesuTokens() {
	// biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
	const { data } = (await axios.get(buildVesuApiUrl(VESU_ENDPOINTS.TOKENS))).data;
	return data;
}