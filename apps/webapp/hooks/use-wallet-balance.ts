// Hook to get real wallet balance for Vesu assets
import { useState, useEffect, useMemo } from 'react';
import { useWallet } from './use-wallet';
import { useProvider } from '@starknet-react/core';
import { Contract, RpcProvider } from 'starknet';
import { getVesuAssets } from '@/lib/vesu-real-data';

interface WalletBalance {
  symbol: string;
  balance: number;
  decimals: number;
  address: string;
}

interface UseWalletBalanceReturn {
  balances: WalletBalance[];
  isLoading: boolean;
  error: string | null;
  refreshBalances: () => Promise<void>;
}

export function useWalletBalance(): UseWalletBalanceReturn {
  const { address } = useWallet();
  const [balances, setBalances] = useState<WalletBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Try to use provider from Starknet context first, fallback to creating new one
  const contextProvider = useProvider();
  
  // MAINNET ONLY: Always use mainnet RPC
  // Use provider from context if available, otherwise create new one
  const provider = useMemo(() => {
    // If context provider is available and has a valid nodeUrl, use it
    if (contextProvider && (contextProvider as any).baseUrl) {
      console.log('🔧 Using provider from Starknet context');
      return contextProvider as RpcProvider;
    }
    
    // Otherwise, create a new provider
    const rpcUrl = process.env.NEXT_PUBLIC_STARKNET_RPC_URL || 
      'https://starknet-mainnet.public.blastapi.io/rpc/v0_7';
    
    console.log('🔧 Creating new RPC Provider with URL:', rpcUrl);
    
    return new RpcProvider({
      nodeUrl: rpcUrl
    });
  }, [contextProvider]);

  const getBalance = async (tokenAddress: string, decimals: number, symbol: string): Promise<number> => {
    if (!address) {
      console.log(`No address available for ${symbol}`);
      return 0;
    }

    try {
      console.log(`Fetching balance for ${symbol} (${tokenAddress}) for address ${address}`);
      
      // ERC20 balanceOf function
      const contract = new Contract([
        {
          name: 'balanceOf',
          type: 'function',
          inputs: [
            {
              name: 'account',
              type: 'felt'
            }
          ],
          outputs: [
            {
              name: 'balance',
              type: 'Uint256'
            }
          ],
          stateMutability: 'view'
        }
      ], tokenAddress, provider);

      // Add a timeout to prevent hanging
      const timeout = 15000; // 15 seconds
      const balancePromise = contract.balanceOf(address);
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error(`Balance fetch timeout after ${timeout}ms`)), timeout)
      );
      
      const result = await Promise.race([balancePromise, timeoutPromise]);
      const balanceWei = result.balance.low;
      const balance = Number(balanceWei) / Math.pow(10, decimals);
      
      console.log(`${symbol} balance: ${balance} (${balanceWei} wei, ${decimals} decimals)`);
      return balance;
    } catch (err: any) {
      // Silently handle errors - don't log to console.error to avoid Next.js error overlay
      // Only log in development mode
      if (process.env.NODE_ENV === 'development') {
        const errorMessage = err?.message || String(err) || 'Unknown error';
        console.warn(`⚠️ Failed to fetch balance for ${symbol}:`, errorMessage);
        
        // Only log detailed error in development if it's not a timeout
        if (!errorMessage.includes('timeout')) {
          console.debug('Error details:', {
            errorMessage: err?.message,
            errorType: err?.constructor?.name,
            errorCode: err?.code,
            providerUrl: (provider as any)?.channel?.nodeUrl || (provider as any)?.baseUrl,
            tokenAddress,
            userAddress: address
          });
        }
      }
      
      // Return 0 instead of throwing to prevent breaking the entire balance fetch
      return 0;
    }
  };

  const fetchBalances = async () => {
    if (!address) {
      setBalances([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('=== FETCHING BALANCES ===');
      console.log('Address:', address);
      console.log('Provider URL:', provider.channel.nodeUrl);
      
      // MAINNET ONLY: Always use mainnet addresses
      const testAssets = [
        {
          token: {
            address: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', // Mainnet ETH
            symbol: 'ETH',
            decimals: 18
          }
        },
        {
          token: {
            address: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d', // Mainnet STRK
            symbol: 'STRK',
            decimals: 18
          }
        }
      ];
      
      console.log('Using test assets for MAINNET:', testAssets);
      
      // MAINNET ONLY: Always get mainnet assets
      const vesuAssets = getVesuAssets(false);
      console.log('Vesu assets count:', vesuAssets.length);
      console.log('Vesu assets to check:', vesuAssets.map(a => `${a.token.symbol} (${a.token.address})`));
      
      if (vesuAssets.length === 0) {
        console.error('No Vesu assets found! Using test assets instead.');
        // Use test assets if Vesu assets are not available
        const testBalancePromises = testAssets.map(async (asset) => {
          console.log(`Starting test balance fetch for ${asset.token.symbol}...`);
          console.log(`🔍 Fetching balance for ${asset.token.symbol} at ${asset.token.address}`);
          const balance = await getBalance(asset.token.address, asset.token.decimals, asset.token.symbol);
          console.log(`✅ ${asset.token.symbol} balance result:`, balance);
          return {
            symbol: asset.token.symbol,
            balance,
            decimals: asset.token.decimals,
            address: asset.token.address,
          };
        });
        
        const testBalances = await Promise.all(testBalancePromises);
        console.log('Test balances:', testBalances);
        setBalances(testBalances);
        return;
      }
      
      const balancePromises = vesuAssets.map(async (asset) => {
        console.log(`Starting balance fetch for ${asset.token.symbol}...`);
        const balance = await getBalance(asset.token.address, asset.token.decimals, asset.token.symbol);
        console.log(`Completed balance fetch for ${asset.token.symbol}: ${balance}`);
        return {
          symbol: asset.token.symbol,
          balance,
          decimals: asset.token.decimals,
          address: asset.token.address,
        };
      });

      console.log('Waiting for all balance promises...');
      // Use Promise.allSettled to handle individual failures gracefully
      const balanceResults = await Promise.allSettled(balancePromises);
      const walletBalances = balanceResults
        .map((result, index) => {
          if (result.status === 'fulfilled') {
            return result.value;
          } else {
            // Silently handle failures - don't log to console.error
            // Only log in development mode
            if (process.env.NODE_ENV === 'development') {
              console.debug(`Balance fetch failed for asset ${index}:`, result.reason);
            }
            // Return a zero balance for failed fetches
            const asset = vesuAssets[index];
            return {
              symbol: asset?.token?.symbol || 'UNKNOWN',
              balance: 0,
              decimals: asset?.token?.decimals || 18,
              address: asset?.token?.address || '',
            };
          }
        })
        .filter(b => b !== null);
      
      console.log('=== FINAL BALANCES ===');
      console.log('Final balances:', walletBalances);
      setBalances(walletBalances);
    } catch (err) {
      // Only log errors in development to avoid Next.js error overlay
      if (process.env.NODE_ENV === 'development') {
        console.warn('=== ERROR FETCHING BALANCES ===');
        console.warn('Error details:', err);
      }
      // Set a user-friendly error message
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch balances';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, [address]);

  return {
    balances,
    isLoading,
    error,
    refreshBalances: fetchBalances,
  };
}
