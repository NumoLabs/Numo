// Pragma historical price hook - real historical data only
import { useQuery } from '@tanstack/react-query';
import { PragmaService } from '../services/pragmaService';
import type { PricePoint } from '../types';

interface UsePragmaHistoryParams {
  feedAddress?: string;
  fromTimestamp: number;
  toTimestamp: number;
  intervalSec?: number;
}

export function usePragmaHistory({
  feedAddress,
  fromTimestamp,
  toTimestamp,
  intervalSec = 3600
}: UsePragmaHistoryParams) {
  const enabled = Boolean(
    process.env.NEXT_PUBLIC_FORECASTING_ENABLED === 'true' &&
    feedAddress &&
    process.env.NEXT_PUBLIC_STARKNET_RPC_URL &&
    fromTimestamp < toTimestamp
  );

  return useQuery({
    queryKey: ['pragma-history', feedAddress, fromTimestamp, toTimestamp, intervalSec],
    queryFn: async (): Promise<PricePoint[]> => {
      if (!feedAddress || !process.env.NEXT_PUBLIC_STARKNET_RPC_URL) {
        throw new Error('Feed address or RPC URL not configured');
      }

      const pragmaService = new PragmaService(
        feedAddress,
        process.env.NEXT_PUBLIC_STARKNET_RPC_URL
      );

      const prices = await pragmaService.getHistoricalPrices(
        fromTimestamp,
        toTimestamp,
        intervalSec
      );

      if (prices.length === 0) {
        throw new Error('No historical price data available for the specified time range');
      }

      return prices;
    },
    enabled,
    refetchInterval: 300000, // Refetch every 5 minutes for historical data
    staleTime: 300000, // Consider data stale after 5 minutes
    retry: 1, // Only retry once to avoid too many failed requests
  });
}
