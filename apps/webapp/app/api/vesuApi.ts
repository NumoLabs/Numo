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
		
		// Process API response
		
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
				// Vesu API may have both supplyApr (APR) and supplyApy (APY)
				// We should use supplyApr if available
				// Otherwise fall back to supplyApy
				const supplyAprValue = asset.stats?.supplyApr?.value || asset.stats?.supplyApy?.value || '0';
				const supplyAprDecimals = asset.stats?.supplyApr?.decimals ?? asset.stats?.supplyApy?.decimals ?? 18;
				// const supplyApyValue = asset.stats?.supplyApy?.value || '0';
				// const supplyApyDecimals = asset.stats?.supplyApy?.decimals ?? 18;
				const defiSpringAprValue = asset.stats?.defiSpringSupplyApr?.value || '0';
				const defiSpringAprDecimals = asset.stats?.defiSpringSupplyApr?.decimals ?? 18;
				
				// Check for additional reward fields (BTCFi rewards, etc.)
				// The API might have other reward fields that we're not reading
				const allStatsFields = asset.stats ? Object.keys(asset.stats) : [];
				
				// Look for BTCFi rewards or other reward fields
				// Common field names: btcFiSupplyApr, btcfiRewardsApr, btcfiRewards, rewardsApr, totalRewardsApr, etc.
				// Note: btcFiSupplyApr has uppercase 'F' in the API
				const btcfiRewardsApr = asset.stats?.btcFiSupplyApr || asset.stats?.btcfiRewardsApr || asset.stats?.btcfiRewards || asset.stats?.rewardsApr;
				const btcfiRewardsAprValue = btcfiRewardsApr?.value || '0';
				const btcfiRewardsAprDecimals = btcfiRewardsApr?.decimals ?? 18;
				
				// Calculate APR/APY - the API returns values in wei format (with decimals)
				// Convert from wei to percentage
				// Prefer APR if available (matches Vesu website), otherwise use APY
				const apr = (Number(supplyAprValue) / 10 ** supplyAprDecimals) * 100;
				// const apyFromField = supplyApyValue && supplyApyValue !== supplyAprValue 
				// 	? (Number(supplyApyValue) / 10 ** supplyApyDecimals) * 100 
				// 	: null;
				
				const apy = apr;
				
				const defiSpringApy = (Number(defiSpringAprValue) / 10 ** defiSpringAprDecimals) * 100;
				const btcfiRewardsApy = btcfiRewardsAprValue ? (Number(btcfiRewardsAprValue) / 10 ** btcfiRewardsAprDecimals) * 100 : 0;
				
				
				// Calculate total rewards APY (DeFi Spring + BTCFi rewards)
				// According to Vesu website, BTCFi rewards are separate from DeFi Spring rewards
				// Priority: Use btcFiSupplyApr (2% rewards APR) if available, otherwise use defiSpringSupplyApr
				// Both are rewards APR, not borrow APR
				let totalRewardsApy = 0;
				
				if (btcfiRewardsApy > 0) {
					totalRewardsApy = btcfiRewardsApy;
				} else if (defiSpringApy > 0) {
					// Fallback to DeFi Spring rewards if BTCFi rewards are not available
					totalRewardsApy = defiSpringApy;
				}
				
				// If defiSpringApy is 0, search for other reward fields (btcFiSupplyApr, lstApr, etc.)
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
					// Priority order for reward fields: btcFiSupplyApr > defiSpringSupplyApr > lstApr > other rewards
					const rewardFieldPriority = ['btcfisupplyapr', 'defispringsupplyapr', 'lstapr'];
					const excludedFields = ['supplyapy', 'borrowapr', 'totalsupplied', 'totaldebt', 'currentutilization'];
					
					for (const field of allStatsFields) {
						if (totalRewardsApy > 0) break; // Stop if we already found rewards
						
						const fieldValue = asset.stats?.[field];
						// Check if this field has a value property (like supplyApy.value)
						if (fieldValue && typeof fieldValue === 'object' && 'value' in fieldValue) {
							const fieldVal = fieldValue.value;
							const fieldDecimals = fieldValue.decimals ?? 18;
							const fieldApy = (Number(fieldVal) / 10 ** fieldDecimals) * 100;
							
							// Skip excluded fields
							if (fieldApy <= 0 || excludedFields.includes(field.toLowerCase())) {
								continue;
							}
							
							
							// Check if this is a reward field (explicitly rewards-related, not borrow/lending)
							const fieldLower = field.toLowerCase();
							const isRewardField = 
								fieldLower === 'btcfisupplyapr' ||
								fieldLower === 'defispringsupplyapr' ||
								fieldLower === 'lstapr' ||
								(fieldLower.includes('reward') && !fieldLower.includes('borrow')) || 
								(fieldLower.includes('btcfi') && !fieldLower.includes('borrow'));
							
							if (isRewardField && !fieldLower.includes('borrow')) {
								const priority = rewardFieldPriority.indexOf(fieldLower);
								if (totalRewardsApy === 0 || (priority >= 0 && (rewardFieldPriority.indexOf(asset.stats?.[field]?.name || '') === -1 || rewardFieldPriority.indexOf(asset.stats?.[field]?.name || '') > priority))) {
								totalRewardsApy = fieldApy;
								}
							}
						}
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