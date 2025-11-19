import { useState, useEffect } from 'react';
import { useWalletStatus } from './use-wallet';

interface WBTCBalance {
  balance: number;
  balanceUSD: number;
  btcPriceUSD: number;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to fetch wBTC balance for the connected wallet
 * Uses the API route to get balance from Starknet
 */
export function useWBTCBalance(): WBTCBalance {
  const { isConnected, address } = useWalletStatus();
  const [balance, setBalance] = useState<number>(0);
  const [balanceUSD, setBalanceUSD] = useState<number>(0);
  const [btcPriceUSD, setBtcPriceUSD] = useState<number>(0);
  // Start with loading true if connected (to show loading on initial page load)
  const [isLoading, setIsLoading] = useState(() => isConnected && !!address);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!isConnected || !address) {
        setBalance(0);
        setBalanceUSD(0);
        setBtcPriceUSD(0);
        setIsLoading(false);
        setError(null);
        return;
      }

      // Set loading to true when fetching balance
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/wallet/wbtc-balance', {
          headers: {
            'Content-Type': 'application/json',
            'x-wallet-address': address,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to fetch wBTC balance');
        }

        const data = await response.json();
        setBalance(data.balance || 0);
        setBalanceUSD(data.balanceUSD || 0);
        setBtcPriceUSD(data.btcPriceUSD || 0);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch wBTC balance';
        setError(errorMessage);
        // Set to 0 on error
        setBalance(0);
        setBalanceUSD(0);
        setBtcPriceUSD(0);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch once when component mounts or wallet changes
    fetchBalance();
  }, [isConnected, address]);

  return {
    balance,
    balanceUSD,
    btcPriceUSD,
    isLoading,
    error,
  };
}

