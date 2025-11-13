import { useQuery, useQueries } from '@tanstack/react-query';
import { useAccount } from '@starknet-react/core';
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
  const { totalAssets, isConnected } = useVesuVault();

  return useQuery({
    queryKey: vaultQueryKeys.totalAssets(),
    queryFn: async () => {
      return totalAssets;
    },
    enabled: isConnected && !!address,
    staleTime: 1 * 60 * 1000, // 1 minute
    initialData: null,
  });
}

