import { useState, useEffect, useCallback, useRef } from 'react';
import { useWalletStatus } from './use-wallet';
import { RpcProvider } from 'starknet';

interface Transaction {
  hash: string;
  from: string;
  to: string | null;
  blockNumber: number | null;
  timestamp: number | null;
  status: 'PENDING' | 'ACCEPTED_ON_L2' | 'ACCEPTED_ON_L1' | 'REJECTED';
  type: string;
  value?: string;
}

interface UseWalletTransactionsReturn {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Alchemy API key and RPC URL
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const ALCHEMY_RPC_URL = ALCHEMY_API_KEY
  ? `https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_9/${ALCHEMY_API_KEY}`
  : 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7';

/**
 * Hook to get wallet transactions using Alchemy RPC for Starknet
 */
export function useWalletTransactions(limit: number = 50): UseWalletTransactionsReturn {
  const { address, isConnected } = useWalletStatus();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const timeoutTriggeredRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const fetchTransactions = useCallback(async () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (!isConnected || !address) {
      console.log('[useWalletTransactions] No wallet connected or address');
      setTransactions([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    console.log('[useWalletTransactions] Starting fetch for address:', address);
    setIsLoading(true);
    setError(null);
    timeoutTriggeredRef.current = false;

    // Set timeout to prevent infinite loading (10 seconds - shorter for faster feedback)
    timeoutRef.current = setTimeout(() => {
      console.warn('[useWalletTransactions] Request timeout after 10s');
      timeoutTriggeredRef.current = true;
      if (isMountedRef.current) {
        setError('Request timeout - transactions may take time to load');
        setIsLoading(false);
        setTransactions([]);
      }
      timeoutRef.current = null;
    }, 10000);

    try {
      console.log('[useWalletTransactions] Creating provider...');
      const provider = new RpcProvider({ nodeUrl: ALCHEMY_RPC_URL });
      
      console.log('[useWalletTransactions] Getting latest block number...');
      // Get latest block number with timeout
      const latestBlock = await Promise.race([
        provider.getBlockNumber(),
        new Promise<number>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout getting block number')), 5000)
        )
      ]);
      
      console.log('[useWalletTransactions] Latest block:', latestBlock);
      
      // Start with a very small range - check last 10 blocks only
      // This is much faster for initial load and reduces timeout issues
      const blockRange = Math.min(10, limit * 2);
      const startBlock = Math.max(0, latestBlock - blockRange);
      
      console.log(`[useWalletTransactions] Fetching transactions from blocks ${startBlock} to ${latestBlock}`);
      
      const allTransactions: Transaction[] = [];
      const walletLower = address.toLowerCase();
      
      // Limit to checking only 10 blocks max for speed
      let blocksChecked = 0;
      const maxBlocksToCheck = 10;
      
      for (let blockNum = latestBlock; blockNum >= startBlock && allTransactions.length < limit && blocksChecked < maxBlocksToCheck; blockNum--) {
        // Stop early if timeout was triggered or component unmounted
        if (timeoutTriggeredRef.current || !isMountedRef.current) {
          console.log('[useWalletTransactions] Stopping early:', { timeoutTriggered: timeoutTriggeredRef.current, isMounted: isMountedRef.current });
          break;
        }

        blocksChecked++;
        
        try {
          // Add shorter timeout for each block fetch (2 seconds)
          const block = await Promise.race([
            provider.getBlockWithTxs(blockNum),
            new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error(`Timeout fetching block ${blockNum}`)), 2000)
            )
          ]);
          
          // Check again after fetch
          if (timeoutTriggeredRef.current || !isMountedRef.current) {
            break;
          }
          
          // Filter transactions by wallet address (sender)
          const relevantTxs = block.transactions.filter(tx => {
            if ('sender_address' in tx && tx.sender_address) {
              const senderLower = tx.sender_address.toLowerCase();
              return senderLower === walletLower;
            }
            return false;
          });

          if (relevantTxs.length > 0) {
            console.log(`[useWalletTransactions] Found ${relevantTxs.length} transactions in block ${blockNum}`);
            
            // Format transactions without fetching receipts (faster)
            const formattedTxs = relevantTxs
              .map((tx) => {
                const txHash = tx.transaction_hash || '';
                if (!txHash) return null;
                
                return {
                  hash: txHash,
                  from: ('sender_address' in tx ? tx.sender_address : '') || address,
                  to: ('contract_address' in tx ? tx.contract_address : '') || null,
                  blockNumber: blockNum,
                  timestamp: block.timestamp || null,
                  status: 'ACCEPTED_ON_L2' as Transaction['status'],
                  type: ('type' in tx ? tx.type : 'INVOKE') || 'INVOKE',
                } as Transaction;
              })
              .filter((tx): tx is Transaction => tx !== null);
            
            allTransactions.push(...formattedTxs);
            
            // Stop if we have enough transactions
            if (allTransactions.length >= limit) {
              break;
            }
          }
        } catch (blockError) {
          // Continue to next block if this one fails or times out
          console.warn(`[useWalletTransactions] Failed to fetch block ${blockNum}:`, blockError);
          // Don't break, continue to next block
          continue;
        }
      }

      // Sort by block number (newest first) and limit results
      const sortedTransactions = allTransactions
        .sort((a, b) => {
          if (!a.blockNumber || !b.blockNumber) return 0;
          return b.blockNumber - a.blockNumber;
        })
        .slice(0, limit);

      console.log(`[useWalletTransactions] Completed: Found ${sortedTransactions.length} transactions after checking ${blocksChecked} blocks`);
      
      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Only update state if timeout wasn't triggered
      if (!timeoutTriggeredRef.current && isMountedRef.current) {
        setTransactions(sortedTransactions);
        setIsLoading(false);
        console.log('[useWalletTransactions] State updated successfully');
      } else {
        console.log('[useWalletTransactions] Skipping state update - timeout triggered or unmounted');
      }
    } catch (err) {
      console.error('[useWalletTransactions] Error:', err);
      
      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Only update state if timeout wasn't triggered
      if (!timeoutTriggeredRef.current && isMountedRef.current) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transactions';
        setError(errorMessage);
        setTransactions([]);
        setIsLoading(false);
      } else {
        console.log('[useWalletTransactions] Skipping error state update - timeout triggered or unmounted');
      }
    }
  }, [isConnected, address, limit]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    isLoading,
    error,
    refetch: fetchTransactions,
  };
}

