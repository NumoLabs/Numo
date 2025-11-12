/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchCryptoPrice } from '@/lib/utils';
import type { VesuPool } from '@/types/VesuPools';
import type { VesuEarnPosition } from '@/types/VesuPositions';
import axios from 'axios';

export async function getEarnPositions(address: string) {
	if (!address) {
		return [];
	}
	const { data } = (
		await axios.get(
			`https://api.vesu.xyz/positions?walletAddress=${address}`
		)
	).data;
	const filteredData = data.filter(
		(item: { type: string }) => item.type === 'earn'
	);

	const pools = await getVesuPools();

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
					if (asset.currentUtilization > 80) {
						risk = 'High';
					} else if (asset.currentUtilization > 50) {
						risk = 'Medium';
					}
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

export async function getVesuPools() {
	try {
		const response = await axios.get(`https://api.vesu.xyz/pools`, {
			timeout: 10000,
			headers: {
				'Accept': 'application/json',
			},
		});
		
		// Handle different response structures
		const data = response.data?.data || response.data || [];
		
		// Log raw API response for debugging (first pool's first asset)
		if (data.length > 0 && data[0]?.assets?.length > 0) {
			const firstAsset = data[0].assets[0];
			console.log('[getVesuPools] Raw API response sample (first asset):', {
				symbol: firstAsset.symbol,
				address: firstAsset.address,
				stats: firstAsset.stats,
				supplyApyRaw: firstAsset.stats?.supplyApy,
				defiSpringSupplyAprRaw: firstAsset.stats?.defiSpringSupplyApr,
				// Log all fields in stats to see what's available
				allStatsFields: Object.keys(firstAsset.stats || {}),
				// Log all asset fields to see if there are reward fields at asset level
				allAssetFields: Object.keys(firstAsset || {}),
			});
		}
		
	return data
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			.filter((pool: any) => pool.isVerified !== false)
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		.map((pool: any) => ({
			id: pool.id,
			name: pool.name,
			address: pool.extensionContractAddress,
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				assets: (pool.assets || []).map((asset: any) => {
				// Extract raw values for debugging
				const supplyApyValue = asset.stats?.supplyApy?.value || '0';
				const supplyApyDecimals = asset.stats?.supplyApy?.decimals ?? 18;
				const defiSpringAprValue = asset.stats?.defiSpringSupplyApr?.value || '0';
				const defiSpringAprDecimals = asset.stats?.defiSpringSupplyApr?.decimals ?? 18;
				
				// Check for additional reward fields (BTCFi rewards, etc.)
				// The API might have other reward fields that we're not reading
				const allStatsFields = asset.stats ? Object.keys(asset.stats) : [];
				const allAssetFields = Object.keys(asset || {});
				
				// Look for BTCFi rewards or other reward fields
				// Common field names: btcfiRewards, rewardsApr, totalRewardsApr, etc.
				const btcfiRewardsApr = asset.stats?.btcfiRewardsApr || asset.stats?.btcfiRewards || asset.stats?.rewardsApr;
				const btcfiRewardsAprValue = btcfiRewardsApr?.value || '0';
				const btcfiRewardsAprDecimals = btcfiRewardsApr?.decimals ?? 18;
				
				// Calculate APY - the API returns values in wei format (with decimals)
				// Convert from wei to percentage
				const apy = (Number(supplyApyValue) / 10 ** supplyApyDecimals) * 100;
				const defiSpringApy = (Number(defiSpringAprValue) / 10 ** defiSpringAprDecimals) * 100;
				const btcfiRewardsApy = btcfiRewardsAprValue ? (Number(btcfiRewardsAprValue) / 10 ** btcfiRewardsAprDecimals) * 100 : 0;
				
				// Log WBTC assets specifically for debugging with full stats structure
				if (asset.symbol?.toUpperCase().includes('WBTC') || asset.symbol?.toUpperCase().includes('BTC')) {
					console.log(`[getVesuPools] Processing ${asset.symbol} in pool ${pool.name}:`, {
						symbol: asset.symbol,
						address: asset.address,
						supplyApyValue,
						supplyApyDecimals,
						calculatedApy: apy,
						defiSpringAprValue,
						defiSpringAprDecimals,
						calculatedDefiSpringApy: defiSpringApy,
						btcfiRewardsAprValue: btcfiRewardsAprValue || 'not found',
						calculatedBtcfiRewardsApy: btcfiRewardsApy,
						totalApy: apy + defiSpringApy + btcfiRewardsApy,
						// Log all available fields to help identify where rewards are stored
						allStatsFields,
						allAssetFields: allAssetFields.filter(f => !['stats', 'name', 'symbol', 'address', 'decimals', 'vToken'].includes(f)),
						fullStats: asset.stats, // Log full stats object to see all available fields
					});
				}
				
				// Calculate total rewards APY (DeFi Spring + BTCFi rewards)
				// If defiSpringApy is 0 but there are BTCFi rewards, use BTCFi rewards
				// According to Vesu website, BTCFi rewards are separate from DeFi Spring rewards
				let totalRewardsApy = defiSpringApy;
				
				// If we found BTCFi rewards, add them to the total rewards
				if (btcfiRewardsApy > 0) {
					totalRewardsApy += btcfiRewardsApy;
					console.log(`[getVesuPools] Found BTCFi rewards for ${asset.symbol} in pool ${pool.name}: ${btcfiRewardsApy.toFixed(4)}%`);
				}
				
				// If defiSpringApy is 0, search more thoroughly for reward fields
				// The API might store BTCFi rewards under a different field name
				if (totalRewardsApy === 0) {
					// Try to find any reward-related field in stats
					const rewardFields = allStatsFields.filter((field: string) => 
						field.toLowerCase().includes('reward') || 
						field.toLowerCase().includes('apr') || 
						field.toLowerCase().includes('apy') ||
						field.toLowerCase().includes('btcfi') ||
						field.toLowerCase().includes('btc')
					);
					
					// Also check all fields that might contain numeric reward values
					allStatsFields.forEach((field: string) => {
						const fieldValue = asset.stats?.[field];
						// Check if this field has a value property (like supplyApy.value)
						if (fieldValue && typeof fieldValue === 'object' && 'value' in fieldValue) {
							const fieldVal = fieldValue.value;
							const fieldDecimals = fieldValue.decimals ?? 18;
							const fieldApy = (Number(fieldVal) / 10 ** fieldDecimals) * 100;
							
							// If this field has a non-zero APY value, it might be a reward field
							if (fieldApy > 0 && field !== 'supplyApy' && field !== 'currentUtilization') {
								console.log(`[getVesuPools] 🔍 Found potential reward field for ${asset.symbol} in pool ${pool.name}:`);
								console.log(`[getVesuPools]   - Field: ${field}`);
								console.log(`[getVesuPools]   - Value: ${fieldVal}`);
								console.log(`[getVesuPools]   - Decimals: ${fieldDecimals}`);
								console.log(`[getVesuPools]   - Calculated APY: ${fieldApy.toFixed(4)}%`);
								
								// If this looks like a rewards field and we don't have rewards yet, use it
								if (field.toLowerCase().includes('reward') || 
								    field.toLowerCase().includes('btcfi') ||
								    (fieldApy > 0.1 && field.toLowerCase().includes('apr'))) {
									console.log(`[getVesuPools] ✅ Using ${field} as rewards APY: ${fieldApy.toFixed(4)}%`);
									totalRewardsApy = fieldApy;
								}
							}
						}
					});
					
					if (rewardFields.length > 0 && totalRewardsApy === 0) {
						console.log(`[getVesuPools] Found reward-related fields for ${asset.symbol} in pool ${pool.name}:`, rewardFields);
						// Log the values of these fields
						rewardFields.forEach((field: string) => {
							const fieldValue = asset.stats?.[field];
							console.log(`[getVesuPools]   - ${field}:`, fieldValue);
						});
					}
				}
				
				return {
					name: asset.name,
					symbol: asset.symbol,
					currentUtilization:
						(Number(asset.stats?.currentUtilization?.value || 0) /
							10 ** Number(asset.stats?.currentUtilization?.decimals || 18)) *
					100,
					apy,
					defiSpringApy: totalRewardsApy, // This now includes BTCFi rewards if found
					decimals: asset.decimals || 18,
					address: asset.address,
					vTokenAddress: asset.vToken?.address || asset.vTokenAddress,
				};
			}),
		}));
	} catch (error) {
		console.error('Error fetching Vesu pools:', error);
		// Return empty array on error to prevent crashes
		return [];
	}
}

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

export async function getVesuTokens() {
	// biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
	const { data } = (await axios.get(`https://api.vesu.xyz/tokens`)).data;

	return data;
}