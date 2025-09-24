// Hook to get real wallet balance for Vesu assets
import { useState, useEffect } from 'react';
import { useWallet } from './use-wallet';
import { Contract, RpcProvider } from 'starknet';
import { getVesuAssets } from '@/lib/vesu-real-data';
import { isTestnet } from '@/lib/utils';

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

  const provider = new RpcProvider({
    nodeUrl: isTestnet() 
      ? 'https://starknet-sepolia.public.blastapi.io/rpc/v0_7'
      : 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7'
  });

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

      const result = await contract.balanceOf(address);
      const balanceWei = result.balance.low;
      const balance = Number(balanceWei) / Math.pow(10, decimals);
      
      console.log(`${symbol} balance: ${balance} (${balanceWei} wei, ${decimals} decimals)`);
      return balance;
    } catch (err) {
      console.error(`Error fetching balance for ${symbol} (${tokenAddress}):`, err);
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
      
      // Use correct addresses based on network
      const testAssets = isTestnet() ? [
        {
          token: {
            address: '0x7809bb63f557736e49ff0ae4a64bd8aa6ea60e3f77f26c520cb92c24e3700d3', // Sepolia ETH
            symbol: 'ETH',
            decimals: 18
          }
        },
        {
          token: {
            address: '0x772131070c7d56f78f3e46b27b70271d8ca81c7c52e3f62aa868fab4b679e43', // Sepolia STRK
            symbol: 'STRK',
            decimals: 18
          }
        }
      ] : [
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
      
      console.log('Using test assets for', isTestnet() ? 'SEPOLIA' : 'MAINNET', ':', testAssets);
      
      const vesuAssets = getVesuAssets(isTestnet());
      console.log('Vesu assets count:', vesuAssets.length);
      console.log('Vesu assets to check:', vesuAssets.map(a => `${a.token.symbol} (${a.token.address})`));
      
      if (vesuAssets.length === 0) {
        console.error('No Vesu assets found! Using test assets instead.');
        // Use test assets if Vesu assets are not available
        const testBalancePromises = testAssets.map(async (asset) => {
          console.log(`Starting test balance fetch for ${asset.token.symbol}...`);
          const balance = await getBalance(asset.token.address, asset.token.decimals, asset.token.symbol);
          console.log(`Completed test balance fetch for ${asset.token.symbol}: ${balance}`);
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
      const walletBalances = await Promise.all(balancePromises);
      console.log('=== FINAL BALANCES ===');
      console.log('Final balances:', walletBalances);
      setBalances(walletBalances);
    } catch (err) {
      console.error('=== ERROR FETCHING BALANCES ===');
      console.error('Error details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch balances');
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
