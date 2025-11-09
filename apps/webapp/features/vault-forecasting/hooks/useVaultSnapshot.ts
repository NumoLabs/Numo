// Vault snapshot hook - reads real vault data
import { useQuery } from '@tanstack/react-query';
import { VaultReadService } from '../services/vaultReadService';
import type { VaultSnapshot } from '../types';
import { scaleByDecimals } from '../lib/math';

export function useVaultSnapshot(vaultAddress?: string) {
  const enabled = Boolean(
    process.env.NEXT_PUBLIC_FORECASTING_ENABLED === 'true' &&
    vaultAddress &&
    process.env.NEXT_PUBLIC_STARKNET_RPC_URL
  );

  return useQuery({
    queryKey: ['vault-snapshot', vaultAddress],
    queryFn: async (): Promise<VaultSnapshot> => {
      if (!vaultAddress || !process.env.NEXT_PUBLIC_STARKNET_RPC_URL) {
        throw new Error('Vault address or RPC URL not configured');
      }

      const vaultService = new VaultReadService(
        vaultAddress,
        process.env.NEXT_PUBLIC_STARKNET_RPC_URL
      );

      const result = await vaultService.getSnapshot();

      // Convert to VaultSnapshot format
      const snapshot: VaultSnapshot = {
        tvl: 0,
        pricePerShare: 0,
        updatedAt: Date.now(),
      };

      // Set TVL from available data
      if (result.totalAssetsUsd) {
        snapshot.tvl = scaleByDecimals(result.totalAssetsUsd, 6); // Assuming USD has 6 decimals
      } else if (result.totalAssets) {
        snapshot.tvl = scaleByDecimals(result.totalAssets, result.decimals || 18);
      }

      // Set price per share
      if (result.pricePerShare) {
        snapshot.pricePerShare = scaleByDecimals(result.pricePerShare, result.decimals || 18);
      }

      // Set asset address
      if (result.asset) {
        snapshot.assetAddress = result.asset;
      } else if (result.underlying) {
        snapshot.assetAddress = result.underlying;
      }

      // Set decimals
      if (result.decimals) {
        snapshot.decimals = result.decimals;
      }

      // Set weights if available
      if (result.positions) {
        snapshot.weights = result.positions.map(pos => ({
          pool: pos.pool,
          weight: scaleByDecimals(pos.weight, 18) // Assuming weights have 18 decimals
        }));
      }

      // Set fees if available
      if (result.managementFee || result.performanceFee) {
        snapshot.fees = {
          managementFee: result.managementFee ? scaleByDecimals(result.managementFee, 18) : 0,
          performanceFee: result.performanceFee ? scaleByDecimals(result.performanceFee, 18) : 0,
        };
      }

      // Set last rebalance if available
      if (result.lastRebalance) {
        snapshot.lastRebalance = Number(result.lastRebalance) * 1000; // Convert to milliseconds
      }

      return snapshot;
    },
    enabled,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 15000, // Consider data stale after 15 seconds
  });
}
