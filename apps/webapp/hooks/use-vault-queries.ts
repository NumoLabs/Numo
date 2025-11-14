import { useQuery, useQueries, useQueryClient } from '@tanstack/react-query';
import { useAccount } from '@starknet-react/core';
import { useEffect } from 'react';
import { useVesuVault, type PoolProps } from './use-vesu-vault';
import { getVesuPools } from '@/app/api/vesuApi';

// Query keys
export const vaultQueryKeys = {
  all: ['vaults'] as const,
  pools: () => [...vaultQueryKeys.all, 'pools'] as const,
  poolYields: (poolIds: string[]) => [...vaultQueryKeys.pools(), 'yields', poolIds] as const,
  poolBalances: (pools: PoolProps[]) => [...vaultQueryKeys.pools(), 'balances', pools] as const,
  userPosition: (address?: string) => [...vaultQueryKeys.all, 'position', address] as const,
  vesuPools: () => [...vaultQueryKeys.all, 'vesu-pools'] as const,
  totalAssets: () => [...vaultQueryKeys.all, 'total-assets'] as const,
};

// Hook to get Vesu pools data from API
export function useVesuPoolsData() {
  return useQuery({
    queryKey: vaultQueryKeys.vesuPools(),
    queryFn: async () => {
      const pools = await getVesuPools();
      return pools;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to get allowed pools from vault
export function useVaultPools() {
  const { address } = useAccount();
  const { getAllowedPools, isConnected } = useVesuVault();

  return useQuery({
    queryKey: vaultQueryKeys.pools(),
    queryFn: async () => {
      if (!isConnected) return null;
      const pools = await getAllowedPools();
      return pools;
    },
    enabled: isConnected && !!address,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook to get pool yields
export function usePoolYields(pools: PoolProps[] | null) {
  const { address } = useAccount();
  const { getPoolYield, isConnected } = useVesuVault();

  return useQueries({
    queries: (pools || []).map((pool) => ({
      queryKey: [...vaultQueryKeys.poolYields([pool.pool_id]), pool.pool_id],
      queryFn: async () => {
        try {
          const yieldValue = await getPoolYield(pool.pool_id);
          return { poolId: pool.pool_id, yield: yieldValue };
        } catch (err) {
          console.warn(`Failed to get yield for pool ${pool.pool_id}:`, err);
          return { poolId: pool.pool_id, yield: null };
        }
      },
      enabled: isConnected && !!address && !!pools && pools.length > 0,
      staleTime: 2 * 60 * 1000, // 2 minutes
    })),
  });
}

// Hook to get pool balances
export function usePoolBalances(pools: PoolProps[] | null) {
  const { address } = useAccount();
  const { getPoolBalance, isConnected } = useVesuVault();

  return useQueries({
    queries: (pools || []).map((pool) => ({
      queryKey: [...vaultQueryKeys.poolBalances([pool]), pool.pool_id, pool.v_token],
      queryFn: async () => {
        try {
          const balance = await getPoolBalance(pool.v_token);
          return { poolId: pool.pool_id, balance };
        } catch (err) {
          console.warn(`Failed to get balance for pool ${pool.pool_id}:`, err);
          return { poolId: pool.pool_id, balance: BigInt(0) };
        }
      },
      enabled: isConnected && !!address && !!pools && pools.length > 0,
      staleTime: 2 * 60 * 1000, // 2 minutes
    })),
  });
}

// Hook to get user position
export function useUserVaultPosition() {
  const { address } = useAccount();
  const { getUserPosition, isConnected } = useVesuVault();

  return useQuery({
    queryKey: vaultQueryKeys.userPosition(address),
    queryFn: async () => {
      if (!isConnected || !address) return null;
      const position = await getUserPosition();
      return position;
    },
    enabled: isConnected && !!address,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Hook to get total assets
export function useVaultTotalAssets() {
  const { address } = useAccount();
  const { contract, isConnected, vaultData } = useVesuVault();
  const queryClient = useQueryClient();

  // Update query data when vaultData changes
  useEffect(() => {
    if (vaultData?.totalAssets !== undefined && vaultData?.totalAssets !== null) {
      console.log('[useVaultTotalAssets] Updating query data with vaultData:', vaultData.totalAssets);
      queryClient.setQueryData(vaultQueryKeys.totalAssets(), vaultData.totalAssets);
    }
  }, [vaultData?.totalAssets, queryClient]);

  // Use vaultData.totalAssets directly from useVesuVault instead of making another contract call
  // This avoids duplicate calls and timing issues
  return useQuery({
    queryKey: vaultQueryKeys.totalAssets(),
    queryFn: async () => {
      // Return the totalAssets from vaultData if available
      // This is already loaded by loadVaultData() in useVesuVault
      // Check for null/undefined explicitly since BigInt(0) is truthy
      if (vaultData?.totalAssets !== undefined && vaultData?.totalAssets !== null) {
        console.log('[useVaultTotalAssets] Using totalAssets from vaultData:', vaultData.totalAssets);
        return vaultData.totalAssets;
      }

      // Fallback: call contract directly if vaultData is not available yet
      if (!isConnected || !contract) {
        console.warn('[useVaultTotalAssets] Missing requirements:', { isConnected, hasContract: !!contract, address });
        return null;
      }
      try {
        console.log('[useVaultTotalAssets] Calling contract.total_assets directly...');
        const totalAssets = await contract.call('total_assets', [], { blockIdentifier: 'latest' }) as bigint;
        console.log('[useVaultTotalAssets] Total assets received:', totalAssets);
        console.log('[useVaultTotalAssets] Total assets (formatted):', Number(totalAssets) / 1e8, 'wBTC');
        return totalAssets;
      } catch (err) {
        console.error('[useVaultTotalAssets] Failed to get total assets:', err);
        return null;
      }
    },
    enabled: isConnected && !!address,
    staleTime: 1 * 60 * 1000, // 1 minute
    initialData: vaultData?.totalAssets !== undefined && vaultData?.totalAssets !== null 
      ? vaultData.totalAssets 
      : null,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}

