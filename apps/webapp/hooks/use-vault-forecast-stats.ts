/**
 * Read-only hook for vault statistics used in forecasting
 * 
 * This hook ONLY reads data from the vault contract and does NOT modify any state.
 * All functions are view-only and safe for forecasting calculations.
 */

import { useMemo } from 'react';
import { useVesuVault } from './use-vesu-vault';
import { useUserVaultPosition, useVaultPools, usePoolYields } from './use-vault-queries';
import { useAccount } from '@starknet-react/core';

export interface VaultForecastStats {
  // Current vault APY (annual percentage yield) - read from pools
  apy: number | null;
  
  // Total assets in the vault (in wei, 8 decimals for WBTC)
  totalAssets: bigint | null;
  
  // Formatted total assets (human-readable)
  totalAssetsFormatted: string;
  
  // User's position in the vault (if connected)
  userPosition: {
    assets: bigint;
    formatted: string;
  } | null;
  
  // Average APY across all pools (weighted or simple average)
  averagePoolApy: number | null;
  
  // Loading state
  isLoading: boolean;
  
  // Error state
  error: string | null;
}

/**
 * Read-only hook to get vault statistics for forecasting
 * 
 * SAFETY: This hook only reads data and never modifies vault state.
 * All contract calls are view functions (read-only).
 * 
 * The APY is calculated from the actual pool yields read from the Vesu API,
 * which provides real-time APY data for each asset in each pool.
 */
export function useVaultForecastStats(): VaultForecastStats {
  const { address } = useAccount();
  const {
    totalAssets,
    isConnected,
    isLoading: vaultLoading,
  } = useVesuVault();

  const { data: userPositionData, isLoading: positionLoading } = useUserVaultPosition();
  const { data: pools, isLoading: poolsLoading } = useVaultPools();
  const poolYieldsQueries = usePoolYields(pools || null);

  // Calculate average APY from pools (read-only)
  const averagePoolApy = useMemo(() => {
    if (!poolYieldsQueries || poolYieldsQueries.length === 0) {
      return null;
    }

    const yields = poolYieldsQueries
      .map(query => query.data?.yield)
      .filter((apyValue): apyValue is number => 
        typeof apyValue === 'number' && apyValue !== null && !isNaN(apyValue) && apyValue > 0
      );

    if (yields.length === 0) {
      return null;
    }

    // Calculate simple average of pool APYs
    // Note: In a real implementation, this could be weighted by pool balances
    const sum = yields.reduce((acc, apy) => acc + apy, 0);
    return sum / yields.length;
  }, [poolYieldsQueries]);

  // Format total assets
  const totalAssetsFormatted = useMemo(() => {
    if (!totalAssets || totalAssets === BigInt(0)) {
      return '0.00000000';
    }
    // WBTC has 8 decimals
    return (Number(totalAssets) / 1e8).toFixed(8);
  }, [totalAssets]);

  // Get user position
  const userPosition = useMemo(() => {
    if (!isConnected || !address || !userPositionData) {
      return null;
    }
    
    return {
      assets: userPositionData.assets,
      formatted: userPositionData.formatted,
    };
  }, [isConnected, address, userPositionData]);

  const isLoading = vaultLoading || positionLoading || poolsLoading || 
    poolYieldsQueries.some(query => query.isLoading);

  return {
    apy: averagePoolApy, // Use average pool APY as vault APY
    totalAssets,
    totalAssetsFormatted,
    userPosition,
    averagePoolApy,
    isLoading,
    error: null,
  };
}

