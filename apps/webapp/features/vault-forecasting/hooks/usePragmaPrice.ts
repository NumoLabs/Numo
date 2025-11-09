// Pragma price hook - real price data only
import { useQuery } from '@tanstack/react-query';
import { PragmaService } from '../services/pragmaService';
import type { PragmaPrice } from '../types';

export function usePragmaPrice(feedAddress?: string) {
  const enabled = Boolean(
    process.env.NEXT_PUBLIC_FORECASTING_ENABLED === 'true' &&
    feedAddress &&
    process.env.NEXT_PUBLIC_STARKNET_RPC_URL
  );

  return useQuery({
    queryKey: ['pragma-price', feedAddress],
    queryFn: async (): Promise<PragmaPrice> => {
      if (!feedAddress || !process.env.NEXT_PUBLIC_STARKNET_RPC_URL) {
        throw new Error('Feed address or RPC URL not configured');
      }

      const pragmaService = new PragmaService(
        feedAddress,
        process.env.NEXT_PUBLIC_STARKNET_RPC_URL
      );

      return await pragmaService.getLatestPrice();
    },
    enabled,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 15000, // Consider data stale after 15 seconds
    retry: 1, // Only retry once to avoid too many failed requests
  });
}
