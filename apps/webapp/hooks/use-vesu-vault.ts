import { useState, useEffect, useCallback, useMemo } from 'react';
import { Account, CallData, Contract, RpcProvider, CairoCustomEnum } from 'starknet';
import { useWallet } from '@/hooks/use-wallet';
import { useAccount } from '@starknet-react/core';
import { VESU_REBALANCE_ABI } from '@/abis/VesuRebalance';
import { Feature } from '@/types/VesuVault';
import type { Action, Claim, Route, AvnuMultiRouteSwap, YieldInfo } from '@/types/VesuVault';
import { getVesuPools } from '@/app/api/vesuApi';
import type { VesuPool, ProcessedAsset } from '@/types/VesuPools';

// Contract address - Updated to V2 deployment
const VESU_VAULT_ADDRESS = '0x06852252Dc7884612bC61409C535c5EC1Dfa1F29c73264481D2ee81b8D5415a5';

// Known wBTC address on StarkNet Mainnet
export const WBTC_ADDRESS = '0x03Fe2b97C1Fd336E750087D68B9b867997Fd64a2661fF3ca5A7C771641e8e7AC';

// Pool management types
// Note: pool_id is now the pool address (ContractAddress)
// v_token is the vToken contract address (ERC4626)
export interface PoolProps {
  pool_id: string; // Pool address (ContractAddress) - this is the pool's contract address
  max_weight: number; // u32 in basis points (10000 = 100%)
  v_token: string; // vToken contract address (ContractAddress) - this is what's actually used for deposits/withdrawals
}

// Rebalance types - now imported from @/types/VesuVault
// Re-export for backward compatibility
export { Feature, type Action, type Claim, type Route, type AvnuMultiRouteSwap, type YieldInfo } from '@/types/VesuVault';

// Function to decode selector to function name
function decodeSelector(selector: string): string {
  const commonSelectors: { [key: string]: string } = {
    '0x2e4263afad30923c891518314c3c95dbe830a16874e8abc5777a9a20b54c76e': 'transferFrom',
    '0x41b033f4a31df8067c24d1e9b550a2ce75fd4a29e1147af9752174f0e6cb20': 'transferFrom',
    '0x1e888a1026b19c8c0b57c72d63ed1737106aa10034105b980ba117bd0c29fe1': 'allowance',
    '0x219209e083275171774dab1df80982e9df2096516f06319c5c6d71ae0a8480c': 'approve',
    '0x83afd953': 'balanceOf',
    '0x18160ddd': 'totalSupply',
    '0x313ce567': 'decimals',
    '0x06fdde03': 'name',
    '0x95d89b41': 'symbol'
  };
  return commonSelectors[selector] || `Unknown selector: ${selector}`;
}

// Helper function to convert decimal amount to wei
function parseAmountToWei(amount: string, decimals: number = 8): bigint {
  console.log('=== parseAmountToWei Debug ===');
  console.log('Input amount:', amount);
  console.log('Input decimals:', decimals);
  
  // Handle scientific notation and very small numbers
  const amountFloat = parseFloat(amount);
  console.log('Parsed float:', amountFloat);
  
  if (isNaN(amountFloat) || amountFloat < 0) {
    throw new Error('Invalid amount');
  }
  
  // For very small numbers, use a different approach
  if (amountFloat < 1) {
    console.log('Very small number detected, using precision-safe conversion');
    // Convert to string with enough precision
    const amountStr = amountFloat.toFixed(decimals);
    console.log('Amount string (fixed):', amountStr);
    
    const [integerPart, decimalPart = ''] = amountStr.split('.');
    console.log('Integer part:', integerPart);
    console.log('Decimal part:', decimalPart);
    
    // Remove trailing zeros and pad to required decimals
    const trimmedDecimal = decimalPart.replace(/0+$/, '');
    const paddedDecimal = trimmedDecimal.padEnd(decimals, '0').slice(0, decimals);
    console.log('Trimmed decimal:', trimmedDecimal);
    console.log('Padded decimal:', paddedDecimal);
    
    // Combine integer and decimal parts
    const fullAmountStr = integerPart + paddedDecimal;
    console.log('Full amount string:', fullAmountStr);
    
    // Convert to BigInt
    const result = BigInt(fullAmountStr);
    console.log('Final result:', result.toString());
    
    return result;
  }
  
  // Use string-based calculation to avoid floating point precision issues
  const amountStr = amountFloat.toString();
  console.log('Amount string:', amountStr);
  
  const [integerPart, decimalPart = ''] = amountStr.split('.');
  console.log('Integer part:', integerPart);
  console.log('Decimal part:', decimalPart);
  
  // Pad decimal part to required decimals
  const paddedDecimal = decimalPart.padEnd(decimals, '0').slice(0, decimals);
  console.log('Padded decimal:', paddedDecimal);
  
  // Combine integer and decimal parts
  const fullAmountStr = integerPart + paddedDecimal;
  console.log('Full amount string:', fullAmountStr);
  
  // Convert to BigInt
  const result = BigInt(fullAmountStr);
  console.log('Final result:', result.toString());
  
  // Validate that the result doesn't exceed StarkNet's 64-digit limit
  const hexStr = result.toString(16);
  if (hexStr.length > 64) {
    throw new Error('Amount too large for StarkNet');
  }
  
  return result;
}

// Helper function to format wei to decimal
function formatWeiToDecimal(wei: bigint, decimals: number = 8): string {
  console.log('=== formatWeiToDecimal Debug ===');
  console.log('Input wei:', wei.toString());
  console.log('Input decimals:', decimals);
  
  const divisor = BigInt(10 ** decimals);
  const quotient = wei / divisor;
  const remainder = wei % divisor;
  
  console.log('Divisor:', divisor.toString());
  console.log('Quotient:', quotient.toString());
  console.log('Remainder:', remainder.toString());
  
  if (remainder === BigInt(0)) {
    console.log('No remainder, returning:', quotient.toString());
    return quotient.toString();
  }
  
  const remainderStr = remainder.toString().padStart(decimals, '0');
  const trimmedRemainder = remainderStr.replace(/0+$/, '');
  
  console.log('Remainder string:', remainderStr);
  console.log('Trimmed remainder:', trimmedRemainder);
  
  if (trimmedRemainder === '') {
    console.log('Trimmed remainder is empty, returning:', quotient.toString());
    return quotient.toString();
  }
  
  const result = `${quotient}.${trimmedRemainder}`;
  console.log('Final result:', result);
  return result;
}

// Create provider outside component to avoid re-creation
const provider = new RpcProvider({
  nodeUrl: 'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_9/c0P2DVGVr0OOBtgc3tSqm',
});

export function useVesuVault() {
  const { account } = useAccount();
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [wbtcBalance, setWbtcBalance] = useState<bigint | null>(null);
  const [vaultData, setVaultData] = useState<{
    totalAssets: bigint;
    assetAddress: string;
    settings: any;
    allowedPools: any[];
  } | null>(null);

  const isConnected = !!address;

  // Create contract instance with minimal ABI to avoid Cairo version issues
  const contract = useMemo(() => {
    try {
      console.log('Creating contract instance with minimal ABI...');
      // Use minimal ABI to avoid Cairo version detection issues
      const minimalAbi = [
        {
          "type": "struct",
          "name": "numo_contracts::strategies::vesu_rebalance::interface::PoolProps",
          "members": [
            {
              "name": "pool_id",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "max_weight",
              "type": "core::integer::u32"
            },
            {
              "name": "v_token",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ]
        },
        {
          "type": "function",
          "name": "total_assets",
          "inputs": [],
          "outputs": [{"type": "core::integer::u256"}],
          "state_mutability": "view"
        },
        {
          "type": "function", 
          "name": "asset",
          "inputs": [],
          "outputs": [{"type": "core::starknet::contract_address::ContractAddress"}],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "deposit",
          "inputs": [
            {"name": "amount", "type": "core::integer::u256"},
            {"name": "receiver", "type": "core::starknet::contract_address::ContractAddress"}
          ],
          "outputs": [{"type": "core::integer::u256"}],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "preview_deposit",
          "inputs": [
            {"name": "amount", "type": "core::integer::u256"}
          ],
          "outputs": [{"type": "core::integer::u256"}],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "balanceOf",
          "inputs": [
            {"name": "account", "type": "core::starknet::contract_address::ContractAddress"}
          ],
          "outputs": [{"type": "core::integer::u256"}],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "convert_to_assets",
          "inputs": [
            {"name": "shares", "type": "core::integer::u256"}
          ],
          "outputs": [{"type": "core::integer::u256"}],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "get_allowed_pools",
          "inputs": [],
          "outputs": [
            {
              "type": "core::array::Array::<numo_contracts::strategies::vesu_rebalance::interface::PoolProps>"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "compute_yield",
          "inputs": [],
          "outputs": [
            {
              "type": "(core::integer::u256, core::integer::u256)"
            }
          ],
          "state_mutability": "view"
        }
      ];
      const contractInstance = new Contract(minimalAbi, VESU_VAULT_ADDRESS, provider);
      console.log('Contract instance created successfully with minimal ABI');
      return contractInstance;
    } catch (error) {
      console.error('Failed to create contract instance:', error);
      // Last resort: empty ABI
      return new Contract([], VESU_VAULT_ADDRESS, provider);
    }
  }, []);

  // Load vault data
  const loadVaultData = useCallback(async () => {
    if (!isConnected) return;

    try {
      setIsLoading(true);
      setError(null);

      // Get basic vault info - call each method individually to handle errors gracefully
      let totalAssets = BigInt(0);
      let assetAddressResult = WBTC_ADDRESS; // fallback to known wBTC address
      
      try {
        totalAssets = await contract.call('total_assets', [], { blockIdentifier: 'latest' }) as bigint;
        console.log('Total assets loaded:', totalAssets);
      } catch (err) {
        console.warn('total_assets not available, using default:', err);
      }
      
      try {
        const assetResult = await contract.call('asset', [], { blockIdentifier: 'latest' });
        assetAddressResult = typeof assetResult === 'string' ? assetResult : assetResult.toString();
        console.log('Asset address loaded:', assetAddressResult);
      } catch (err) {
        console.warn('asset not available, using wBTC address:', err);
      }

      // Skip optional methods that may not be implemented
      const settings = null;
      const allowedPools: any[] = [];
      
      console.log('Skipping optional methods (get_settings, get_allowed_pools) to avoid ENTRYPOINT_NOT_FOUND errors');

      const assetAddress = assetAddressResult;

      console.log('=== Contract Configuration Debug ===');
      console.log('Total assets:', totalAssets);
      console.log('Asset address:', assetAddress);
      console.log('Settings:', settings);
      console.log('Allowed pools:', allowedPools);

      setVaultData({
        totalAssets: totalAssets as bigint,
        assetAddress,
        settings,
        allowedPools: Array.isArray(allowedPools) ? allowedPools : [],
      });
    } catch (err) {
      console.error('Failed to load vault data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load vault data');
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, contract]);

  // Check wBTC balance
  const checkWbtcBalance = useCallback(async (userAddress?: string) => {
    const targetAddress = userAddress || address;
    if (!isConnected || !targetAddress) return;

    try {
      const wbtcContract = new Contract([
        {
          "type": "function",
          "name": "balanceOf",
          "inputs": [{"name": "account", "type": "core::starknet::contract_address::ContractAddress"}],
          "outputs": [{"type": "core::integer::u256"}],
          "state_mutability": "view"
        }
      ], WBTC_ADDRESS, provider);

      const balance = await wbtcContract.call('balanceOf', [targetAddress], { blockIdentifier: 'latest' });
      const formattedBalance = formatWeiToDecimal(balance as bigint, 8);
      
      console.log('wBTC Balance (raw):', balance);
      console.log('wBTC Balance (formatted):', formattedBalance, 'wBTC');
      
      setWbtcBalance(balance as bigint);
      return { balance: balance as bigint, formatted: formattedBalance };
    } catch (err) {
      console.error('Failed to check wBTC balance:', err);
      throw err;
    }
  }, [isConnected, address]);

  // Check user's vault shares balance
  const checkVaultShares = useCallback(async (userAddress?: string) => {
    const targetAddress = userAddress || address;
    if (!isConnected || !targetAddress || !contract) return;

    try {
      const shares = await contract.call('balanceOf', [targetAddress], { blockIdentifier: 'latest' });
      console.log('Vault Shares (raw):', shares);
      
      return shares as bigint;
    } catch (err) {
      console.error('Failed to check vault shares:', err);
      throw err;
    }
  }, [isConnected, address, contract]);

  // Get user's position value in assets
  const getUserPosition = useCallback(async (userAddress?: string) => {
    const targetAddress = userAddress || address;
    if (!isConnected || !targetAddress || !contract) return;

    try {
      console.log('=== getUserPosition Debug ===');
      console.log('Target address:', targetAddress);
      
      const shares = await contract.call('balanceOf', [targetAddress], { blockIdentifier: 'latest' });
      console.log('Raw shares:', shares);
      
      if (!shares || BigInt(shares.toString()) === BigInt(0)) {
        return {
          shares: BigInt(0),
          assets: BigInt(0),
          formatted: '0',
          usdValue: 0
        };
      }
      
      // Try convert_to_assets first
      let assets: bigint;
      try {
        const assetsResult = await contract.call('convert_to_assets', [shares], { blockIdentifier: 'latest' });
        assets = BigInt(assetsResult.toString());
        console.log('Raw assets from convert_to_assets:', assets);
      } catch (convertErr: any) {
        // If convert_to_assets fails, try preview_redeem
        console.log('convert_to_assets failed, trying preview_redeem...');
        try {
          const assetsResult = await contract.call('preview_redeem', [shares], { blockIdentifier: 'latest' });
          assets = BigInt(assetsResult.toString());
          console.log('Raw assets from preview_redeem:', assets);
        } catch (previewErr) {
          // If both fail, calculate manually using total_assets and total_supply
          console.log('Both convert_to_assets and preview_redeem failed, calculating manually...');
          const totalAssets = await contract.call('total_assets', [], { blockIdentifier: 'latest' });
          const totalSupply = await contract.call('total_supply', [], { blockIdentifier: 'latest' });
          
          const totalAssetsBigInt = BigInt(totalAssets.toString());
          const totalSupplyBigInt = BigInt(totalSupply.toString());
          const sharesBigInt = BigInt(shares.toString());
          
          // Calculate: user_assets = (user_shares * total_assets) / total_supply
          if (totalSupplyBigInt === BigInt(0)) {
            assets = BigInt(0);
          } else {
            assets = (sharesBigInt * totalAssetsBigInt) / totalSupplyBigInt;
          }
          console.log('Calculated assets manually:', assets);
        }
      }
      
      const formattedAssets = formatWeiToDecimal(assets, 8);
      console.log('Formatted assets:', formattedAssets);
      
      // Calculate USD value (assuming wBTC price around $100,000)
      const wbtcPriceUSD = 100000; // This should come from an oracle
      const assetsNumber = parseFloat(formattedAssets);
      const usdValue = assetsNumber * wbtcPriceUSD;
      
      console.log('wBTC price (USD):', wbtcPriceUSD);
      console.log('Assets number:', assetsNumber);
      console.log('USD value:', usdValue);
      
      console.log('User Shares:', shares);
      console.log('User Assets Value:', assets);
      console.log('User Position (formatted):', formattedAssets, 'wBTC');
      console.log('User Position (USD):', `$${usdValue.toFixed(2)}`);
      
      return {
        shares: BigInt(shares.toString()),
        assets: assets,
        formatted: formattedAssets,
        usdValue: usdValue
      };
    } catch (err) {
      console.error('Failed to get user position:', err);
      throw err;
    }
  }, [isConnected, address, contract]);

  // Preview deposit
  const previewDeposit = useCallback(async (amount: string) => {
    if (!isConnected || !vaultData) return;

    try {
      const amountInWei = parseAmountToWei(amount, 8);
      
      console.log('Amount in wei:', amountInWei.toString());
      console.log('Asset address:', vaultData.assetAddress);
      
      const result = await contract.call('preview_deposit', [amountInWei.toString()], { blockIdentifier: 'latest' });
      console.log('Preview deposit result:', result);
      
      return result as bigint;
    } catch (err) {
      console.error('Failed to preview deposit:', err);
      throw err;
    }
  }, [isConnected, vaultData, contract]);

  // Withdraw function
  const withdraw = useCallback(async (amount: string, receiver?: string) => {
    if (!isConnected || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      setIsPending(true);
      setIsSuccess(false);
      setError(null);

      const amountInWei = parseAmountToWei(amount, 8);
      console.log('=== Withdraw Debug ===');
      console.log('Original amount string:', amount);
      console.log('Amount in wei:', amountInWei.toString());
      console.log('Account address:', account.address);
      console.log('Receiver address:', receiver || account.address);

      // Check if amount is 0
      if (amountInWei === BigInt(0)) {
        throw new Error('Amount cannot be zero. Please enter a valid amount greater than 0.');
      }

      const receiverAddress = receiver || account.address;
      
      // Use account.execute with manually compiled calldata for u256
      // u256 is passed as [low, high] where both are felt252
      const calls = [{
        contractAddress: VESU_VAULT_ADDRESS,
        entrypoint: 'withdraw',
        calldata: [
          amountInWei.toString(),
          '0', // u256 high part (for amounts < 2^128, high part is 0)
          receiverAddress,
          account.address, // owner
        ]
      }];

      // Execute withdraw transaction
      console.log('Calling withdraw...');
      console.log('Withdraw calls:', JSON.stringify(calls, null, 2));
      
      let tx;
      try {
        tx = await account.execute(calls);
      } catch (executeError: any) {
        // Extract error message from various possible structures
        let errorMessage = 'Execute failed';
        let errorDetails = '';
        
        // Try to get error message
        if (executeError?.message) {
          errorMessage = executeError.message;
        }
        
        // Try to extract from nested error structure
        if (executeError?.error?.revert_error) {
          const revertError = executeError.error.revert_error;
          if (revertError.error?.error) {
            const nestedError = revertError.error.error;
            if (typeof nestedError === 'string') {
              errorDetails = nestedError;
            } else if (typeof nestedError === 'object') {
              errorDetails = JSON.stringify(nestedError);
            }
          }
        }
        
        // Try to get error from response
        if (executeError?.response?.data) {
          errorDetails = JSON.stringify(executeError.response.data);
        }
        
        // Convert error to string for comprehensive checking
        let errorStr = '';
        try {
          errorStr = (errorMessage + ' ' + errorDetails + ' ' + JSON.stringify(executeError)).toLowerCase();
        } catch {
          errorStr = (errorMessage + ' ' + errorDetails).toLowerCase();
        }
        
        // Check if user rejected/cancelled the transaction
        const isUserRejection = 
          errorStr.includes('user abort') ||
          errorStr.includes('user rejected') ||
          errorStr.includes('user cancelled') ||
          errorStr.includes('rejected by user') ||
          errorStr.includes('aborted by user') ||
          errorStr.includes('action rejected') ||
          executeError?.code === 4001 || // MetaMask user rejection code
          executeError?.code === 'ACTION_REJECTED';
        
        if (isUserRejection) {
          // User cancelled - don't treat as success
          setIsPending(false);
          setIsSuccess(false);
          setError('Transaction was cancelled by user');
          // Throw error so the calling code can catch it and not show success message
          throw new Error('Transaction was cancelled by user');
        }
        
        // Check for other common error patterns
        let detailedError = 'Transaction execution failed';
        if (errorStr.includes('insufficient funds') || errorStr.includes('balance')) {
          detailedError = 'Insufficient funds for transaction';
        } else if (errorStr.includes('revert') || errorStr.includes('revert')) {
          detailedError = 'Transaction reverted. Please check your balance and try again.';
        } else if (errorMessage) {
          detailedError = errorMessage;
        }
        
        setError(detailedError);
        throw new Error(detailedError);
      }
      
      console.log('Withdraw transaction:', tx.transaction_hash);
      
      // Wait for transaction confirmation
      try {
        await provider.waitForTransaction(tx.transaction_hash);
        console.log('Withdraw confirmed!');
      } catch (waitError: any) {
        console.error('Transaction wait failed:', waitError);
        // Transaction was sent but confirmation failed - still consider it successful if we have a hash
        if (tx?.transaction_hash) {
          console.warn('Transaction sent but confirmation timed out. Hash:', tx.transaction_hash);
        } else {
          throw new Error('Transaction failed to be confirmed');
        }
      }
      
      setIsSuccess(true);
      
      // Reload vault data and balance
      Promise.all([
        loadVaultData().catch(err => console.warn('Failed to reload vault data:', err)),
        checkWbtcBalance().catch(err => console.warn('Failed to reload balance:', err))
      ]).catch(err => console.warn('Failed to reload after withdraw:', err));
      
      return tx.transaction_hash;
    } catch (err: any) {
      console.error('Withdraw failed:', err);
      
      // Extract error message
      let errorMessage = 'Withdraw failed';
      
      if (err?.message) {
        errorMessage = err.message;
      } else if (err?.toString) {
        errorMessage = err.toString();
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsPending(false);
    }
  }, [isConnected, account, loadVaultData, checkWbtcBalance]);

  // Deposit function - simplified to avoid contract issues
  const deposit = useCallback(async (amount: string) => {
    if (!isConnected || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      setIsPending(true);
      setIsSuccess(false);
      setError(null);

      const amountInWei = parseAmountToWei(amount, 8);
      console.log('=== Deposit Debug ===');
      console.log('Original amount string:', amount);
      console.log('Parsed amount float:', parseFloat(amount));
      console.log('Amount in wei:', amountInWei.toString());
      console.log('Amount in wei (hex):', '0x' + amountInWei.toString(16));
      console.log('Account address:', account.address);

      // Check if amount is 0
      if (amountInWei === BigInt(0)) {
        throw new Error('Amount cannot be zero. Please enter a valid amount greater than 0.');
      }

      // Handle approval automatically - check allowance first
      console.log('Checking wBTC allowance...');
      const wbtcContract = new Contract([
        {
          "type": "function",
          "name": "approve",
          "inputs": [
            {"name": "spender", "type": "core::starknet::contract_address::ContractAddress"},
            {"name": "amount", "type": "core::integer::u256"}
          ],
          "outputs": [{"type": "core::bool"}],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "allowance",
          "inputs": [
            {"name": "owner", "type": "core::starknet::contract_address::ContractAddress"},
            {"name": "spender", "type": "core::starknet::contract_address::ContractAddress"}
          ],
          "outputs": [{"type": "core::integer::u256"}],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "balanceOf",
          "inputs": [
            {"name": "account", "type": "core::starknet::contract_address::ContractAddress"}
          ],
          "outputs": [{"type": "core::integer::u256"}],
          "state_mutability": "view"
        }
      ], WBTC_ADDRESS, provider);

      // Check current allowance
      const currentAllowance = await wbtcContract.call('allowance', [account.address, VESU_VAULT_ADDRESS], { blockIdentifier: 'latest' });
      console.log('Current allowance:', currentAllowance.toString());
      console.log('Required amount:', amountInWei.toString());

      // Check user's wBTC balance to ensure they have enough
      const balanceResult = await wbtcContract.call('balanceOf', [account.address], { blockIdentifier: 'latest' });
      const userBalance = BigInt(balanceResult.toString());
      console.log('User wBTC balance:', userBalance.toString());
      
      if (userBalance < amountInWei) {
        throw new Error(`Insufficient balance. You have ${formatWeiToDecimal(userBalance, 8)} wBTC but need ${formatWeiToDecimal(amountInWei, 8)} wBTC.`);
      }

      // Prepare calls array for multicall
      const calls: any[] = [];

      // Only add approve call if current allowance is less than required amount
      // Approve exactly the amount needed (no buffer) to avoid overflow issues
      // The buffer was causing issues with balance validation in the contract
      if (BigInt(currentAllowance.toString()) < amountInWei) {
        console.log('Approval needed, will be included in multicall...');
        console.log('Approving amount:', amountInWei.toString());
        calls.push({
          contractAddress: WBTC_ADDRESS,
          entrypoint: 'approve',
          calldata: [VESU_VAULT_ADDRESS, amountInWei.toString(), '0'] // u256: [low, high] - approve exact amount
        });
      } else {
        console.log('Sufficient allowance already exists, skipping approval');
      }

      // Add deposit call
      console.log('Preparing deposit call...');
      calls.push({
        contractAddress: VESU_VAULT_ADDRESS,
        entrypoint: 'deposit',
        calldata: [amountInWei.toString(), '0', account.address] // u256: [low, high], receiver
      });

      // Execute approve and deposit in a single multicall transaction
      console.log('Executing multicall (approve + deposit)...');
      let tx;
      try {
        tx = await account.execute(calls);
        console.log('Deposit transaction:', tx.transaction_hash);
      } catch (executeErr: any) {
        // Extract error message from various possible structures
        let errorMessage = 'Execute failed';
        let errorDetails = '';
        
        // Try to get error message
        if (executeErr?.message) {
          errorMessage = executeErr.message;
        }
        
        // Try to extract from nested error structure
        if (executeErr?.error?.revert_error) {
          const revertError = executeErr.error.revert_error;
          if (revertError.error?.error) {
            const nestedError = revertError.error.error;
            if (typeof nestedError === 'string') {
              errorDetails = nestedError;
            } else if (typeof nestedError === 'object') {
              errorDetails = JSON.stringify(nestedError);
            }
          }
        }
        
        // Try to get error from response
        if (executeErr?.response?.data) {
          errorDetails = JSON.stringify(executeErr.response.data);
        }
        
        // Convert error to string for comprehensive checking
        let errorStr = '';
        try {
          errorStr = (errorMessage + ' ' + errorDetails + ' ' + JSON.stringify(executeErr)).toLowerCase();
        } catch {
          errorStr = (errorMessage + ' ' + errorDetails).toLowerCase();
        }
        
        // Check if user rejected/cancelled the transaction
        const isUserRejection = 
          errorStr.includes('user abort') ||
          errorStr.includes('user rejected') ||
          errorStr.includes('user cancelled') ||
          errorStr.includes('rejected by user') ||
          errorStr.includes('aborted by user') ||
          errorStr.includes('action rejected') ||
          executeErr?.code === 4001 || // MetaMask user rejection code
          executeErr?.code === 'ACTION_REJECTED';
        
        if (isUserRejection) {
          // User cancelled - don't treat as success
          setIsPending(false);
          setIsSuccess(false);
          setError('Transaction was cancelled by user');
          // Throw error so the calling code can catch it and not show success message
          throw new Error('Transaction was cancelled by user');
        }
        
        // Check if it's a known error type
        const isEstimateFeeError = 
          errorStr.includes('estimatefee') ||
          errorStr.includes('estimate_fee') ||
          errorStr.includes('u256_sub overflow') ||
          errorStr.includes('entrypoint_not_found') ||
          errorStr.includes('execute failed');
        
        if (isEstimateFeeError) {
          // For estimateFee errors, throw a custom error that will be handled by outer catch
          // Use a special error class/message format that the outer catch can recognize
          // Don't log this error here as it will be handled gracefully by the outer catch
          const customError = new Error('EXECUTE_FAILED_ESTIMATE_FEE');
          (customError as any).isEstimateFeeError = true;
          (customError as any).originalError = executeErr;
          throw customError;
        }
        
        // For other errors, log them for debugging
        console.error('Multicall execute failed (non-estimateFee error):', executeErr);
        console.error('Error type:', typeof executeErr);
        console.error('Error message:', executeErr?.message);
        console.error('Error structure:', JSON.stringify(executeErr, null, 2));
        
        // For other errors, provide a more detailed message
        throw new Error(`Transaction execution failed: ${errorMessage}. ${errorDetails ? `Details: ${errorDetails}` : ''}`);
      }
      
      // Only proceed if we have a valid transaction hash
      if (!tx || !tx.transaction_hash) {
        setIsPending(false);
        setIsSuccess(false);
        setError('Transaction failed: No transaction hash received');
        return;
      }
      
      // Wait for transaction confirmation
      await provider.waitForTransaction(tx.transaction_hash);
      console.log('Deposit confirmed!');
      
      setIsSuccess(true);
      
      // Reload vault data and balance (don't await to avoid blocking)
      // Call in background to avoid any issues if it fails
      Promise.all([
        loadVaultData().catch(err => console.warn('Failed to reload vault data:', err)),
        checkWbtcBalance().catch(err => console.warn('Failed to reload balance:', err))
      ]).catch(err => console.warn('Failed to reload after deposit:', err));
      
      return tx.transaction_hash;
    } catch (err: any) {
      // Check if it's a custom error from inner catch with estimateFee flag
      // This check must be FIRST before any other processing
      if ((err as any)?.isEstimateFeeError === true) {
        // Silently handle estimateFee errors - don't log them as they're expected
        const errorMessage = 'Transaction failed during execution. This may be due to contract internal state during the first deposit. Please check your wallet balance and try again, or contact support if the issue persists.';
        setError(errorMessage);
        // Return early without throwing to prevent error propagation
        return;
      }
      
      // Only log non-estimateFee errors for debugging
      console.error('Deposit failed:', err);
      console.error('Error structure:', JSON.stringify(err, null, 2));
      
      // Check if it's an ENTRYPOINT_NOT_FOUND error during estimateFee
      // This might be a false positive - the contract may still work
      let errorMessage = 'Deposit failed';
      let isEstimateFeeError = false;
      
      // Check various error structures
      const errorStr = (err?.message || '').toLowerCase();
      const errorJson = JSON.stringify(err).toLowerCase();
      const fullErrorStr = (errorStr + ' ' + errorJson).toLowerCase();
      
      // Check if it's an estimateFee or execution error
      if (
        fullErrorStr.includes('estimatefee') ||
        fullErrorStr.includes('estimate_fee') ||
        fullErrorStr.includes('u256_sub overflow') ||
        fullErrorStr.includes('entrypoint_not_found') ||
        fullErrorStr.includes('execute failed') ||
        errorStr.includes('execute failed') ||
        errorJson.includes('execute failed')
      ) {
        isEstimateFeeError = true;
        errorMessage = 'Transaction failed during execution. This may be due to contract internal state during the first deposit. Please check your wallet balance and try again, or contact support if the issue persists.';
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      // Check for nested error structure
      if (err?.error?.revert_error?.error?.error) {
        const nestedError = err.error.revert_error.error.error;
        if (typeof nestedError === 'string') {
          if (nestedError.includes('ENTRYPOINT_NOT_FOUND') || 
              nestedError.includes('454e545259504f494e545f4e4f545f464f554e44')) {
            isEstimateFeeError = true;
            errorMessage = 'Deposit failed: Error during fee estimation. This may be a known issue with the contract during first deposit. The deposit may still succeed - please check your transaction history.';
          }
        }
      }
      
      setError(errorMessage);
      
      // For estimateFee errors, don't throw to avoid showing duplicate errors
      // The error is already set in the UI via setError
      if (isEstimateFeeError) {
        return;
      }
      
      // For other errors, throw to propagate to the component
      throw new Error(errorMessage);
    } finally {
      setIsPending(false);
    }
  }, [isConnected, account, loadVaultData, checkWbtcBalance]);

  // Helper function to create PoolProps from pool address and vToken address
  // This simplifies adding pools since we now work with addresses directly
  const createPoolProps = useCallback((poolAddress: string, vTokenAddress: string, maxWeight: number): PoolProps => {
    return {
      pool_id: poolAddress, // Pool address is now used as pool_id
      max_weight: maxWeight, // In basis points (10000 = 100%)
      v_token: vTokenAddress // vToken contract address (ERC4626)
    };
  }, []);

  // Get allowed pools
  const getAllowedPools = useCallback(async (): Promise<PoolProps[] | null> => {
    if (!isConnected || !contract) return null;

    try {
      console.log('=== Getting Allowed Pools ===');
      
      // Try to call get_allowed_pools
      const pools = await contract.call('get_allowed_pools', [], { blockIdentifier: 'latest' });
      console.log('Raw pools:', pools);
      
      // Parse the pools array
      // The return type is Array<PoolProps> where PoolProps is a struct
      // In Cairo, arrays are returned as arrays of structs
      if (Array.isArray(pools)) {
        const parsedPools: PoolProps[] = pools.map((pool: any) => {
          // Parse pool_id (ContractAddress)
          let poolId = '';
          if (pool.pool_id) {
            if (typeof pool.pool_id === 'bigint') {
              poolId = '0x' + pool.pool_id.toString(16).padStart(64, '0');
            } else if (typeof pool.pool_id === 'string') {
              poolId = pool.pool_id.startsWith('0x') ? pool.pool_id : '0x' + pool.pool_id;
            } else {
              poolId = pool.pool_id.toString();
            }
          }
          
          // Parse v_token (ContractAddress)
          let vToken = '';
          if (pool.v_token) {
            if (typeof pool.v_token === 'bigint') {
              vToken = '0x' + pool.v_token.toString(16).padStart(64, '0');
            } else if (typeof pool.v_token === 'string') {
              vToken = pool.v_token.startsWith('0x') ? pool.v_token : '0x' + pool.v_token;
            } else {
              vToken = pool.v_token.toString();
            }
          }
          
          // Parse max_weight (u32)
          const maxWeight = typeof pool.max_weight === 'bigint' 
            ? Number(pool.max_weight) 
            : typeof pool.max_weight === 'number'
            ? pool.max_weight
            : parseInt(pool.max_weight || '0', 10);
          
          return {
            pool_id: poolId,
            max_weight: maxWeight,
            v_token: vToken,
          };
        });
        
        console.log('Parsed pools:', parsedPools);
        return parsedPools;
      }
      
      return null;
    } catch (err) {
      console.error('Failed to get allowed pools:', err);
      // If the function doesn't exist or fails, return null
      return null;
    }
  }, [isConnected, contract]);

  // Set allowed pools (requires GOVERNOR role)
  const setAllowedPools = useCallback(async (pools: PoolProps[]) => {
    if (!isConnected || !account) {
      throw new Error('Wallet not connected');
    }

    if (!pools || pools.length === 0) {
      throw new Error('Pools array cannot be empty');
    }

    try {
      setIsPending(true);
      setIsSuccess(false);
      setError(null);

      console.log('=== Setting Allowed Pools ===');
      console.log('Pools to set:', pools);

      // Create contract instance
      let contractInstance: Contract;
      try {
        contractInstance = new Contract(VESU_REBALANCE_ABI, VESU_VAULT_ADDRESS, account);
      } catch (abiError: any) {
        console.warn('Full ABI failed, using minimal ABI:', abiError.message);
        // Use minimal ABI for set_allowed_pools
        contractInstance = new Contract([
          {
            "type": "function",
            "name": "set_allowed_pools",
            "inputs": [
              {
                "name": "pools",
                "type": "core::array::Array::<numo_contracts::strategies::vesu_rebalance::interface::PoolProps>"
              }
            ],
            "outputs": [],
            "state_mutability": "external"
          },
          {
            "type": "struct",
            "name": "numo_contracts::strategies::vesu_rebalance::interface::PoolProps",
            "members": [
              {
                "name": "pool_id",
                "type": "core::starknet::contract_address::ContractAddress"
              },
              {
                "name": "max_weight",
                "type": "core::integer::u32"
              },
              {
                "name": "v_token",
                "type": "core::starknet::contract_address::ContractAddress"
              }
            ]
          }
        ], VESU_VAULT_ADDRESS, account);
      }

      // Serialize pools array for Cairo
      // Array format: [length, pool1_struct, pool2_struct, ...]
      // Each pool struct: [pool_id (felt252), max_weight (u32), v_token (ContractAddress)]
      // Use CallData.compile to properly serialize the array
      const poolsArray = pools.map(pool => ({
        pool_id: pool.pool_id,
        max_weight: pool.max_weight,
        v_token: pool.v_token
      }));

      console.log('Pools array to serialize:', poolsArray);

      // Use contract.invoke which handles serialization automatically
      let tx;
      try {
        tx = await contractInstance.invoke('set_allowed_pools', [poolsArray]);
        console.log('Set allowed pools transaction:', tx.transaction_hash);
      } catch (invokeErr: any) {
        // Extract error message from various possible structures
        let errorMessage = 'Execute failed';
        let errorDetails = '';
        
        // Try to get error message
        if (invokeErr?.message) {
          errorMessage = invokeErr.message;
        }
        
        // Try to extract from nested error structure
        if (invokeErr?.error?.revert_error) {
          const revertError = invokeErr.error.revert_error;
          if (revertError.error?.error) {
            const nestedError = revertError.error.error;
            if (typeof nestedError === 'string') {
              errorDetails = nestedError;
            } else if (typeof nestedError === 'object') {
              errorDetails = JSON.stringify(nestedError);
            }
          }
        }
        
        // Try to get error from response
        if (invokeErr?.response?.data) {
          errorDetails = JSON.stringify(invokeErr.response.data);
        }
        
        // Convert error to string for comprehensive checking
        let errorStr = '';
        try {
          errorStr = (errorMessage + ' ' + errorDetails + ' ' + JSON.stringify(invokeErr)).toLowerCase();
        } catch {
          errorStr = (errorMessage + ' ' + errorDetails).toLowerCase();
        }
        
        // Check if it's a known error type
        const isEstimateFeeError = 
          errorStr.includes('estimatefee') ||
          errorStr.includes('estimate_fee') ||
          errorStr.includes('u256_sub overflow') ||
          errorStr.includes('entrypoint_not_found') ||
          errorStr.includes('execute failed');
        
        if (isEstimateFeeError) {
          // For estimateFee errors, throw a custom error that will be handled by outer catch
          const customError = new Error('EXECUTE_FAILED_ESTIMATE_FEE');
          (customError as any).isEstimateFeeError = true;
          (customError as any).originalError = invokeErr;
          throw customError;
        }
        
        // For other errors, provide a more detailed message
        throw new Error(`Transaction execution failed: ${errorMessage}. ${errorDetails ? `Details: ${errorDetails}` : ''}`);
      }

      await provider.waitForTransaction(tx.transaction_hash);
      console.log('Set allowed pools confirmed!');

      setIsSuccess(true);
      
      // Reload vault data to get updated pools
      await loadVaultData();
      
      return tx.transaction_hash;
    } catch (err: any) {
      // Check if it's a custom error from inner catch with estimateFee flag
      // This check must be FIRST before any other processing
      if ((err as any)?.isEstimateFeeError === true) {
        // Silently handle estimateFee errors - don't log them as they're expected
        const errorMessage = 'Transaction failed during execution. This may be due to contract internal state. Please try again, or contact support if the issue persists.';
        setError(errorMessage);
        // Return early without throwing to prevent error propagation
        return;
      }
      
      // Only log non-estimateFee errors for debugging
      console.error('Set allowed pools failed:', err);
      
      const errorMessage = err?.message || 'Failed to set allowed pools';
      setError(errorMessage);
      
      // Check if it's a permission error
      if (errorMessage.includes('GOVERNOR') || errorMessage.includes('permission') || errorMessage.includes('role')) {
        throw new Error('You do not have permission to set allowed pools. GOVERNOR role required.');
      }
      
      // For estimateFee errors, don't throw to avoid showing duplicate errors
      // The error is already set in the UI via setError
      const errorStr = (errorMessage + ' ' + JSON.stringify(err)).toLowerCase();
      const isEstimateFeeError = 
        errorStr.includes('estimatefee') ||
        errorStr.includes('estimate_fee') ||
        errorStr.includes('u256_sub overflow') ||
        errorStr.includes('entrypoint_not_found') ||
        errorStr.includes('execute failed');
      
      if (isEstimateFeeError) {
        return;
      }
      
      throw err;
    } finally {
      setIsPending(false);
    }
  }, [isConnected, account, loadVaultData]);

  // Compute yield (view function)
  const computeYield = useCallback(async (): Promise<YieldInfo | null> => {
    if (!isConnected || !contract) {
      console.warn('[computeYield] Not connected or contract not available');
      return null;
    }

    try {
      console.log('=== Computing Yield ===');
      
      // Create a timeout promise to avoid hanging requests
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout: compute_yield took too long')), 30000); // 30 second timeout
      });
      
      // Race between the actual call and the timeout
      const result = await Promise.race([
        contract.call('compute_yield', [], { blockIdentifier: 'latest' }),
        timeoutPromise
      ]) as any;
      
      console.log('Raw yield result:', result);

      // Parse result: (u256, u256) -> [yield, totalAmount]
      if (Array.isArray(result) && result.length >= 2) {
        const yieldVal = result[0].toString();
        const totalAmount = result[1].toString();
        return { yield: yieldVal, totalAmount };
      }

      return null;
    } catch (err: any) {
      // Handle network errors gracefully (Failed to fetch, network errors, etc.)
      const errorMessage = err?.message || String(err);
      const isNetworkError = 
        errorMessage.includes('Failed to fetch') || 
        errorMessage.includes('NetworkError') ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('Network request failed') ||
        errorMessage.includes('fetch') ||
        errorMessage.includes('NetworkErrorWhenFetching') ||
        errorMessage.includes('ECONNREFUSED') ||
        errorMessage.includes('ENOTFOUND');
      
      if (isNetworkError) {
        console.warn('[computeYield] Network error - RPC endpoint may be unavailable:', errorMessage);
        // Return null instead of throwing - this is a view function and not critical
        return null;
      }
      // Handle division by zero error (no pools or no funds)
      // The error structure from Starknet RPC can be:
      // - err.message (string)
      // - err.response?.data (object)
      // - err.error?.revert_error (object)
      // - err.error?.error?.error (string with hex encoding)
      
      let errorString = '';
      try {
        // Try to extract error message from various possible structures
        if (err?.message) {
          errorString += err.message + ' ';
        }
        if (err?.error?.revert_error?.error) {
          // Error is hex encoded, decode it
          const hexError = err.error.revert_error.error;
          if (typeof hexError === 'string' && hexError.startsWith('0x')) {
            try {
              // Remove 0x and convert hex to string
              const hexWithoutPrefix = hexError.slice(2);
              const bytes = Buffer.from(hexWithoutPrefix, 'hex');
              const decoded = bytes.toString('utf8').replace(/\0/g, '');
              errorString += decoded + ' ';
            } catch {
              errorString += hexError + ' ';
            }
          } else {
            errorString += hexError + ' ';
          }
        }
        // Also check nested error structure (err.error.revert_error.error.error)
        if (err?.error?.revert_error?.error?.error) {
          const nestedError = err.error.revert_error.error.error;
          if (typeof nestedError === 'string' && nestedError.startsWith('0x')) {
            try {
              const hexWithoutPrefix = nestedError.slice(2);
              const bytes = Buffer.from(hexWithoutPrefix, 'hex');
              const decoded = bytes.toString('utf8').replace(/\0/g, '');
              errorString += decoded + ' ';
            } catch {
              errorString += nestedError + ' ';
            }
          } else if (typeof nestedError === 'string') {
            errorString += nestedError + ' ';
          }
        }
        // Also try JSON stringify as fallback
        if (!errorString) {
          errorString = JSON.stringify(err);
        }
      } catch {
        // If we can't parse the error, just use the string representation
        errorString = err?.message || String(err);
      }
      
      // Check for division by zero error
      if (errorString.includes('Division by 0')) {
        console.warn('Cannot compute yield: No pools configured or no funds in pools');
        // Return zero yield instead of null to indicate the calculation was attempted
        return { yield: '0', totalAmount: '0' };
      }
      
      // Check for ENTRYPOINT_NOT_FOUND error (vToken doesn't have convert_to_assets)
      // Check in error string and also in nested error structure
      const isEntrypointNotFound = 
        errorString.includes('ENTRYPOINT_NOT_FOUND') || 
        errorString.includes('454e545259504f494e545f4e4f545f464f554e44') || // Hex encoding of "ENTRYPOINT_NOT_FOUND"
        (err?.error?.revert_error?.error?.error && 
         typeof err.error.revert_error.error.error === 'string' &&
         (err.error.revert_error.error.error.includes('ENTRYPOINT_NOT_FOUND') ||
          err.error.revert_error.error.error.includes('454e545259504f494e545f4e4f545f464f554e44')));
      
      if (isEntrypointNotFound) {
        console.warn('Cannot compute yield: vToken contract does not support convert_to_assets entrypoint');
        // Return zero yield as fallback
        return { yield: '0', totalAmount: '0' };
      }
      
      // Check if it's a pool configuration error BEFORE logging
      
      // Check for pool configuration errors in various error formats
      const isPoolConfigError = 
        (err?.message && err.message.includes('Input too long')) ||
        (err?.message && err.message.includes('too long for arguments')) ||
        (err?.error?.revert_error?.error?.error && 
         (err.error.revert_error.error.error.includes('Input too long') ||
          err.error.revert_error.error.error.includes('496e70757420746f6f206c6f6e67'))) ||
        (err?.response?.data?.error?.message && 
         err.response.data.error.message.includes('Input too long')) ||
        errorString.includes('Input too long') ||
        errorString.includes('too long for arguments') ||
        errorString.includes('496e70757420746f6f206c6f6e67'); // Hex encoding of "Input too long"
      
      if (isPoolConfigError) {
        // Silently handle pool configuration errors - don't log to console
        // This is expected when pools are not properly configured
        return null;
      }
      
      // Only log other unexpected errors
      console.error('Failed to compute yield:', err);
      return null;
    }
  }, [isConnected, contract]);

  // Rebalance function
  const rebalance = useCallback(async (actions: Action[]): Promise<string> => {
    if (!isConnected || !account) {
      throw new Error('Wallet not connected');
    }

    setIsPending(true);
    setError(null);
    setIsSuccess(false);

    try {
      console.log('=== Rebalancing ===');
      console.log('Actions:', actions);

      const contractInstance = new Contract(
        VESU_REBALANCE_ABI,
        VESU_VAULT_ADDRESS,
        account
      );

      // Serialize actions array
      // Each action: { pool_id (ContractAddress), feature (enum), token (ContractAddress), amount (u256) }
      // For enums in Starknet.js v6, we need to pass the enum as a number (variant index) or use account.execute with raw calldata
      const serializedActions = actions.map((action, index) => {
        console.log(`Action ${index}:`, {
          pool_id: action.pool_id,
          pool_id_type: typeof action.pool_id,
          pool_id_length: action.pool_id?.length,
          feature: action.feature,
          token: action.token,
          amount: action.amount,
        });
        
        // Validate pool_id
        if (!action.pool_id || action.pool_id === '0x1' || action.pool_id.length < 10) {
          throw new Error(`Invalid pool_id in action ${index}: ${action.pool_id}`);
        }
        
        // Convert amount string to BigInt for proper u256 serialization
        const amountBigInt = BigInt(action.amount);
        
        // For enum, use variant index: DEPOSIT = 0, WITHDRAW = 1
        // But actually, we need to pass it as the enum object structure
        // Try using account.execute with manually compiled calldata
        return {
          pool_id: action.pool_id, // ContractAddress - pool contract address
          feature: action.feature === Feature.DEPOSIT ? { DEPOSIT: {} } : { WITHDRAW: {} },
          token: action.token, // ContractAddress
          amount: amountBigInt, // u256 - BigInt for proper serialization
        };
      });

      console.log('Serialized actions:', serializedActions);

      // Use account.execute with manually compiled calldata to avoid enum serialization issues
      // Compile calldata manually: [array_length, ...action_structs]
      // Each action struct: [pool_id, feature_enum, token, amount_low, amount_high]
      // Enum: DEPOSIT = 0, WITHDRAW = 1 (as felt252)
      const calldata: string[] = [serializedActions.length.toString()];
      
      serializedActions.forEach(action => {
        calldata.push(action.pool_id); // pool_id (ContractAddress)
        // Enum variant: DEPOSIT = 0, WITHDRAW = 1
        // Check if feature object has DEPOSIT or WITHDRAW property
        const hasDeposit = 'DEPOSIT' in action.feature;
        const enumValue = hasDeposit ? '0' : '1';
        calldata.push(enumValue);
        calldata.push(action.token); // token (ContractAddress)
        // u256: [low, high]
        const amountLow = action.amount.toString();
        const amountHigh = '0';
        calldata.push(amountLow);
        calldata.push(amountHigh);
      });
      
      console.log('Manual calldata:', calldata);
      
      const tx = await account.execute({
        contractAddress: VESU_VAULT_ADDRESS,
        entrypoint: 'rebalance',
        calldata: calldata
      });
      console.log('Rebalance transaction:', tx.transaction_hash);

      await provider.waitForTransaction(tx.transaction_hash);
      console.log('Rebalance confirmed!');

      setIsSuccess(true);
      await loadVaultData();

      return tx.transaction_hash;
    } catch (err: any) {
      console.error('Rebalance failed:', err);
      const errorMessage = err?.message || 'Rebalance failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsPending(false);
    }
  }, [isConnected, account, loadVaultData]);

  // Rebalance weights function (requires RELAYER role)
  const rebalanceWeights = useCallback(async (actions: Action[]): Promise<string> => {
    if (!isConnected || !account) {
      throw new Error('Wallet not connected');
    }

    setIsPending(true);
    setError(null);
    setIsSuccess(false);

    try {
      console.log('=== Rebalancing Weights ===');
      console.log('Actions:', actions);

      const contractInstance = new Contract(
        VESU_REBALANCE_ABI,
        VESU_VAULT_ADDRESS,
        account
      );

      // Serialize actions array
      // Use account.execute with manually compiled calldata to avoid enum serialization issues
      const serializedActions = actions.map((action, index) => {
        // Validate pool_id
        if (!action.pool_id || action.pool_id === '0x1' || action.pool_id.length < 10) {
          throw new Error(`Invalid pool_id in action ${index}: ${action.pool_id}`);
        }
        
        // Convert amount string to BigInt for proper u256 serialization
        const amountBigInt = BigInt(action.amount);
        
        return {
          pool_id: action.pool_id,
          feature: action.feature === Feature.DEPOSIT ? { DEPOSIT: {} } : { WITHDRAW: {} },
          token: action.token,
          amount: amountBigInt,
        };
      });

      console.log('Serialized actions:', serializedActions);

      // Compile calldata manually: [array_length, ...action_structs]
      // Each action struct: [pool_id, feature_enum, token, amount_low, amount_high]
      // Enum: DEPOSIT = 0, WITHDRAW = 1 (as felt252)
      const calldata: string[] = [serializedActions.length.toString()];
      
      serializedActions.forEach(action => {
        calldata.push(action.pool_id); // pool_id (ContractAddress)
        // Enum variant: DEPOSIT = 0, WITHDRAW = 1
        const hasDeposit = 'DEPOSIT' in action.feature;
        const enumValue = hasDeposit ? '0' : '1';
        calldata.push(enumValue);
        calldata.push(action.token); // token (ContractAddress)
        // u256: [low, high]
        const amountLow = action.amount.toString();
        const amountHigh = '0';
        calldata.push(amountLow);
        calldata.push(amountHigh);
      });
      
      console.log('Manual calldata:', calldata);

      const tx = await account.execute({
        contractAddress: VESU_VAULT_ADDRESS,
        entrypoint: 'rebalance_weights',
        calldata: calldata
      });
      console.log('Rebalance weights transaction:', tx.transaction_hash);

      await provider.waitForTransaction(tx.transaction_hash);
      console.log('Rebalance weights confirmed!');

      setIsSuccess(true);
      await loadVaultData();

      return tx.transaction_hash;
    } catch (err: any) {
      console.error('Rebalance weights failed:', err);
      const errorMessage = err?.message || 'Rebalance weights failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsPending(false);
    }
  }, [isConnected, account, loadVaultData]);

  // Harvest function
  const harvest = useCallback(async (
    rewardsContract: string,
    claim: Claim,
    proof: string[],
    swapInfo: AvnuMultiRouteSwap
  ): Promise<string> => {
    if (!isConnected || !account) {
      throw new Error('Wallet not connected');
    }

    setIsPending(true);
    setError(null);
    setIsSuccess(false);

    try {
      console.log('=== Harvesting ===');
      console.log('Rewards contract:', rewardsContract);
      console.log('Claim:', claim);
      console.log('Proof:', proof);
      console.log('Swap info:', swapInfo);

      const contractInstance = new Contract(
        VESU_REBALANCE_ABI,
        VESU_VAULT_ADDRESS,
        account
      );

      // Serialize claim (ABI uses "claimee" not "recipient")
      const serializedClaim = {
        id: claim.id,
        claimee: claim.claimee,
        amount: claim.amount,
      };

      // Serialize routes
      const serializedRoutes = swapInfo.routes.map(route => ({
        token_from: route.token_from,
        token_to: route.token_to,
        exchange_address: route.exchange_address,
        percent: route.percent,
        additional_swap_params: route.additional_swap_params,
      }));

      // Serialize swap info
      const serializedSwapInfo = {
        token_from_address: swapInfo.token_from_address,
        token_from_amount: swapInfo.token_from_amount,
        token_to_address: swapInfo.token_to_address,
        token_to_amount: swapInfo.token_to_amount,
        token_to_min_amount: swapInfo.token_to_min_amount,
        beneficiary: swapInfo.beneficiary,
        integrator_fee_amount_bps: swapInfo.integrator_fee_amount_bps,
        integrator_fee_recipient: swapInfo.integrator_fee_recipient,
        routes: serializedRoutes,
      };

      console.log('Serialized claim:', serializedClaim);
      console.log('Serialized swap info:', serializedSwapInfo);

      const tx = await contractInstance.invoke('harvest', [
        rewardsContract,
        serializedClaim,
        proof,
        serializedSwapInfo,
      ]);
      console.log('Harvest transaction:', tx.transaction_hash);

      await provider.waitForTransaction(tx.transaction_hash);
      console.log('Harvest confirmed!');

      setIsSuccess(true);
      await loadVaultData();

      return tx.transaction_hash;
    } catch (err: any) {
      console.error('Harvest failed:', err);
      const errorMessage = err?.message || 'Harvest failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsPending(false);
    }
  }, [isConnected, account, loadVaultData]);

  // Emergency withdraw (all pools)
  const emergencyWithdraw = useCallback(async (): Promise<string> => {
    if (!isConnected || !account) {
      throw new Error('Wallet not connected');
    }

    setIsPending(true);
    setError(null);
    setIsSuccess(false);

    try {
      console.log('=== Emergency Withdraw (All Pools) ===');

      const contractInstance = new Contract(
        VESU_REBALANCE_ABI,
        VESU_VAULT_ADDRESS,
        account
      );

      const tx = await contractInstance.invoke('emergency_withdraw', []);
      console.log('Emergency withdraw transaction:', tx.transaction_hash);

      await provider.waitForTransaction(tx.transaction_hash);
      console.log('Emergency withdraw confirmed!');

      setIsSuccess(true);
      await loadVaultData();

      return tx.transaction_hash;
    } catch (err: any) {
      console.error('Emergency withdraw failed:', err);
      const errorMessage = err?.message || 'Emergency withdraw failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsPending(false);
    }
  }, [isConnected, account, loadVaultData]);

  // Emergency withdraw from specific pool
  const emergencyWithdrawPool = useCallback(async (poolIndex: number): Promise<string> => {
    if (!isConnected || !account) {
      throw new Error('Wallet not connected');
    }

    setIsPending(true);
    setError(null);
    setIsSuccess(false);

    try {
      console.log('=== Emergency Withdraw Pool ===');
      console.log('Pool index:', poolIndex);

      const contractInstance = new Contract(
        VESU_REBALANCE_ABI,
        VESU_VAULT_ADDRESS,
        account
      );

      const tx = await contractInstance.invoke('emergency_withdraw_pool', [poolIndex]);
      console.log('Emergency withdraw pool transaction:', tx.transaction_hash);

      await provider.waitForTransaction(tx.transaction_hash);
      console.log('Emergency withdraw pool confirmed!');

      setIsSuccess(true);
      await loadVaultData();

      return tx.transaction_hash;
    } catch (err: any) {
      console.error('Emergency withdraw pool failed:', err);
      const errorMessage = err?.message || 'Emergency withdraw pool failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsPending(false);
    }
  }, [isConnected, account, loadVaultData]);

  // Get balance in a specific pool by vToken address
  const getPoolBalance = useCallback(async (vTokenAddress: string): Promise<bigint> => {
    if (!isConnected || !contract) return BigInt(0);

    try {
      // Get vault contract address
      const vaultAddress = VESU_VAULT_ADDRESS;
      
      // Create ERC20 contract instance for the vToken (vToken is ERC4626 which implements ERC20)
      // ERC20 uses balance_of (snake_case) not balanceOf (camelCase)
      const vTokenAbi = [
        {
          "type": "function",
          "name": "balance_of",
          "inputs": [
            {"name": "account", "type": "core::starknet::contract_address::ContractAddress"}
          ],
          "outputs": [{"type": "core::integer::u256"}],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "convert_to_assets",
          "inputs": [
            {"name": "shares", "type": "core::integer::u256"}
          ],
          "outputs": [{"type": "core::integer::u256"}],
          "state_mutability": "view"
        }
      ];
      
      const vTokenContract = new Contract(vTokenAbi, vTokenAddress, provider);
      
      // Get vault's vToken balance (shares) - using balance_of (snake_case)
      const vTokenBalance = await vTokenContract.call('balance_of', [vaultAddress], { blockIdentifier: 'latest' });
      
      // Try to convert shares to assets using convert_to_assets
      try {
        const assets = await vTokenContract.call('convert_to_assets', [vTokenBalance], { blockIdentifier: 'latest' });
        return BigInt(assets.toString());
      } catch (convertErr) {
        // If convert_to_assets fails, try preview_redeem (ERC4626 alternative)
        console.log('convert_to_assets failed, trying preview_redeem...');
        try {
          const vTokenAbiWithPreview = [
            ...vTokenAbi,
            {
              "type": "function",
              "name": "preview_redeem",
              "inputs": [
                {"name": "shares", "type": "core::integer::u256"}
              ],
              "outputs": [{"type": "core::integer::u256"}],
              "state_mutability": "view"
            }
          ];
          const vTokenContractWithPreview = new Contract(vTokenAbiWithPreview, vTokenAddress, provider);
          const assets = await vTokenContractWithPreview.call('preview_redeem', [vTokenBalance], { blockIdentifier: 'latest' });
          return BigInt(assets.toString());
        } catch (previewErr) {
          // If both fail, return balance as-is (might already be in assets)
          console.warn('Both convert_to_assets and preview_redeem failed, returning balance as-is');
          return BigInt(vTokenBalance.toString());
        }
      }
    } catch (err) {
      console.error('Failed to get pool balance:', err);
      // If balance_of fails, try balanceOf (for ERC20 compatibility)
      try {
        const vTokenAbi = [
          {
            "type": "function",
            "name": "balanceOf",
            "inputs": [
              {"name": "account", "type": "core::starknet::contract_address::ContractAddress"}
            ],
            "outputs": [{"type": "core::integer::u256"}],
            "state_mutability": "view"
          },
          {
            "type": "function",
            "name": "preview_redeem",
            "inputs": [
              {"name": "shares", "type": "core::integer::u256"}
            ],
            "outputs": [{"type": "core::integer::u256"}],
            "state_mutability": "view"
          }
        ];
        
        const vaultAddress = VESU_VAULT_ADDRESS;
        const vTokenContract = new Contract(vTokenAbi, vTokenAddress, provider);
        const vTokenBalance = await vTokenContract.call('balanceOf', [vaultAddress], { blockIdentifier: 'latest' });
        
        // Try preview_redeem to convert shares to assets
        try {
          const assets = await vTokenContract.call('preview_redeem', [vTokenBalance], { blockIdentifier: 'latest' });
          return BigInt(assets.toString());
        } catch (previewErr) {
          // If preview_redeem also fails, return the balance as-is
          console.warn('preview_redeem failed, returning balance as-is');
          return BigInt(vTokenBalance.toString());
        }
      } catch (err2) {
        console.error('Failed to get pool balance with both methods:', err2);
        return BigInt(0);
      }
    }
  }, [isConnected, contract]);

  // Get yield/APY for a specific pool using Vesu API
  const getPoolYield = useCallback(async (poolAddress: string): Promise<number | null> => {
    console.log(`[getPoolYield] ===== FUNCTION CALLED =====`);
    console.log(`[getPoolYield] Starting for pool: ${poolAddress}`);
    console.log(`[getPoolYield] isConnected: ${isConnected}, contract: ${contract ? 'exists' : 'null'}`);
    
    if (!isConnected || !contract) {
      console.log(`[getPoolYield] Not connected or no contract, returning null`);
      return null;
    }
    
    console.log(`[getPoolYield] Proceeding with yield calculation...`);

    try {
      // First, try to get APY from Vesu API (more reliable)
      try {
        console.log(`[getPoolYield] Fetching Vesu pools from API...`);
        const pools = await getVesuPools();
        console.log(`[getPoolYield] Vesu pools fetched: ${pools.length} pools`);
        
        console.log(`[getPoolYield] Looking for pool: ${poolAddress}`);
        console.log(`[getPoolYield] Total pools from API: ${pools.length}`);
        console.log(`[getPoolYield] Pool addresses from API:`, pools.map((p: VesuPool) => ({ 
          name: p.name, 
          address: p.address || 'null',
          id: p.id 
        })));
        
        // Find the pool by ID (pool ID matches the pool contract address)
        // The API's extensionContractAddress is null, but the pool ID matches the contract address
        const poolAddressLower = poolAddress.toLowerCase();
        const pool = pools.find((p: VesuPool) => {
          // Try matching by pool ID first (most reliable)
          // The pool ID in the API is the same as the pool contract address
          if (p.id) {
            const poolIdLower = p.id.toLowerCase();
            const idMatch = poolIdLower === poolAddressLower;
            
            if (idMatch) {
              console.log(`[getPoolYield] Found pool match by ID: ${p.name} (ID: ${p.id})`);
              return true;
            }
          }
          
          // Fallback: try matching by address (extensionContractAddress) if available
          if (p.address) {
            const poolApiAddress = p.address.toLowerCase();
            const addressMatch = poolApiAddress === poolAddressLower;
            
            if (addressMatch) {
              console.log(`[getPoolYield] Found pool match by address: ${p.name} (address: ${poolApiAddress})`);
              return true;
            }
          }
          
          return false;
        });
        
        if (pool) {
          console.log(`[getPoolYield] Pool found: ${pool.name}, total assets: ${pool.assets.length}`);
          
          // Log all assets in the pool with their APYs for debugging
          const allAssetsInfo = pool.assets.map((a: ProcessedAsset) => ({
            symbol: a.symbol,
            address: a.address,
            lendingApy: a.apy,
            rewardsApy: a.defiSpringApy || 0,
            totalApy: a.apy + (a.defiSpringApy || 0)
          }));
          console.log(`[getPoolYield] All assets in pool ${pool.name}:`, allAssetsInfo);
          
          // Also log USDC specifically if it exists in this pool
          const usdcAsset = pool.assets.find((a: ProcessedAsset) => 
            a.symbol?.toUpperCase() === 'USDC' || a.symbol?.toUpperCase() === 'USDC.E'
          );
          if (usdcAsset) {
            const usdcTotalApy = usdcAsset.apy + (usdcAsset.defiSpringApy || 0);
            console.log(`[getPoolYield] 💰 USDC in pool ${pool.name}: Lending APY ${usdcAsset.apy}% + Rewards APY ${usdcAsset.defiSpringApy || 0}% = ${usdcTotalApy}%`);
            console.log(`[getPoolYield] USDC details:`, {
              symbol: usdcAsset.symbol,
              address: usdcAsset.address,
              lendingApy: usdcAsset.apy,
              rewardsApy: usdcAsset.defiSpringApy || 0,
              totalApy: usdcTotalApy,
              currentUtilization: usdcAsset.currentUtilization
            });
          }
          
          // Get the vault's asset address to find the specific asset in the pool
          const asset = await contract.call('asset', [], { blockIdentifier: 'latest' });
          const assetBigInt = BigInt(asset.toString());
          const assetAddressHex = `0x${assetBigInt.toString(16).padStart(64, '0')}`;
          const assetAddress = assetAddressHex.toLowerCase();
          const assetAddressFelt = assetBigInt.toString();
          console.log(`[getPoolYield] Looking for vault asset: ${assetAddress} (felt: ${assetAddressFelt}) in pool ${pool.name}`);
          console.log(`[getPoolYield] Known WBTC address: ${WBTC_ADDRESS.toLowerCase()}`);
          
          // Find the specific asset in the pool that matches our vault's asset
          // Try matching by address first, then by symbol as fallback
          let assetMatch = pool.assets.find((a: ProcessedAsset) => {
            if (!a.address) return false;
            
            const assetAddressLower = assetAddress.toLowerCase();
            const knownWbtcAddressLower = WBTC_ADDRESS.toLowerCase();
            let poolAssetAddressLower = a.address.toLowerCase();
            
            // Normalize addresses for comparison
            // Remove '0x' prefix and pad/trim for comparison
            const normalizeAddress = (addr: string): string => {
              if (!addr) return '';
              let normalized = addr.toLowerCase();
              if (normalized.startsWith('0x')) {
                normalized = normalized.slice(2);
              }
              // Pad to 64 chars (32 bytes in hex)
              normalized = normalized.padStart(64, '0');
              return normalized;
            };
            
            const normalizedVaultAsset = normalizeAddress(assetAddress);
            const normalizedKnownWbtc = normalizeAddress(knownWbtcAddressLower);
            const normalizedPoolAsset = normalizeAddress(poolAssetAddressLower);
            
            // Try direct match
            let match = normalizedPoolAsset === normalizedVaultAsset || 
                       normalizedPoolAsset === normalizedKnownWbtc ||
                       poolAssetAddressLower === assetAddressLower ||
                       poolAssetAddressLower === knownWbtcAddressLower;
            
            // If no direct match, try converting pool asset address from felt252 to hex
            if (!match && a.address && !a.address.startsWith('0x')) {
              try {
                const poolAssetFelt = BigInt(a.address);
                const poolAssetHex = `0x${poolAssetFelt.toString(16).padStart(64, '0')}`.toLowerCase();
                const normalizedPoolHex = normalizeAddress(poolAssetHex);
                match = normalizedPoolHex === normalizedVaultAsset || normalizedPoolHex === normalizedKnownWbtc;
                if (match) {
                  console.log(`[getPoolYield] Matched asset by converting felt252 to hex: ${a.symbol} (${a.address} -> ${poolAssetHex})`);
                }
              } catch (e) {
                // Ignore conversion errors
              }
            }
            
            // Also try the reverse: if pool asset is in hex, try comparing with felt252 format
            if (!match && a.address.startsWith('0x')) {
              try {
                const poolAssetFelt = BigInt(a.address);
                const poolAssetFeltStr = poolAssetFelt.toString();
                if (poolAssetFeltStr === assetAddressFelt || poolAssetFeltStr === WBTC_ADDRESS.replace('0x', '')) {
                  match = true;
                  console.log(`[getPoolYield] Matched asset by comparing felt252 strings: ${a.symbol}`);
                }
              } catch (e) {
                // Ignore conversion errors
              }
            }
            
            return match;
          });
          
          if (!assetMatch) {
            console.log(`[getPoolYield] No address match found, trying symbol match for WBTC...`);
            const wbtcSymbols = ['WBTC', 'wBTC', 'WBTC.E', 'wbtc', 'BTC'];
            assetMatch = pool.assets.find((a: ProcessedAsset) => {
              if (!a.symbol) return false;
              const symbolUpper = a.symbol.toUpperCase();
              return wbtcSymbols.some(wbtcSym => symbolUpper.includes(wbtcSym.toUpperCase()));
            });
            
            if (assetMatch) {
              console.log(`[getPoolYield] Found asset by symbol match: ${assetMatch.symbol} (address: ${assetMatch.address})`);
              console.log(`[getPoolYield] Vault asset address: ${assetAddress}, Pool asset address: ${assetMatch.address}`);
            }
          }
          
          // If we found the specific asset, use its APY
          if (assetMatch) {
            // defiSpringApy now includes both DeFi Spring and BTCFi rewards
            const totalApy = assetMatch.apy + (assetMatch.defiSpringApy || 0);
            console.log(`[getPoolYield] ✅ Found matching asset ${assetMatch.symbol} in pool ${pool.name}:`);
            console.log(`[getPoolYield]   - Lending APY: ${assetMatch.apy}%`);
            console.log(`[getPoolYield]   - Rewards APY: ${assetMatch.defiSpringApy || 0}%`);
            console.log(`[getPoolYield]   - Total APY: ${totalApy}%`);
            console.log(`[getPoolYield]   - Current Utilization: ${assetMatch.currentUtilization}%`);
            console.log(`[getPoolYield] Asset details:`, {
              symbol: assetMatch.symbol,
              address: assetMatch.address,
              lendingApy: assetMatch.apy,
              rewardsApy: assetMatch.defiSpringApy,
              totalApy,
              currentUtilization: assetMatch.currentUtilization
            });
            
            if (totalApy === 0 || (assetMatch.apy === 0 && assetMatch.defiSpringApy === 0)) {
              console.warn(`[getPoolYield] ⚠️ Asset ${assetMatch.symbol} has 0% APY in pool ${pool.name} (${poolAddress}).`);
              console.warn(`[getPoolYield]   - Lending APY: ${assetMatch.apy}%`);
              console.warn(`[getPoolYield]   - DeFi Spring APY: ${assetMatch.defiSpringApy || 0}%`);
              console.warn(`[getPoolYield]   - Current utilization: ${assetMatch.currentUtilization}%`);
              
              console.info(`[getPoolYield] 🔍 Searching for ${assetMatch.symbol} APY in other pools...`);
              
              const otherPoolsWithAsset = pools.filter((p: VesuPool) => {
                if (p.id === pool.id) return false; // Skip current pool
                return p.assets.some((a: ProcessedAsset) => {
                  if (!a.address || !assetMatch.address) return false;
                  // Match by address (most reliable) or symbol
                  const addressMatch = a.address.toLowerCase() === assetMatch.address.toLowerCase();
                  const symbolMatch = a.symbol?.toUpperCase() === assetMatch.symbol?.toUpperCase();
                  return addressMatch || symbolMatch;
                });
              });
              
              if (otherPoolsWithAsset.length > 0) {
                // Find the best APY for this specific asset across all pools
                let bestApy = 0;
                let bestPoolName = '';
                let bestLendingApy = 0;
                let bestDefiSpringApy = 0;
                let bestUtilization = 0;
                
                console.info(`[getPoolYield]   Found ${assetMatch.symbol} in ${otherPoolsWithAsset.length} other pool(s):`);
                
                otherPoolsWithAsset.forEach((p: VesuPool) => {
                  const matchingAsset = p.assets.find((a: ProcessedAsset) => {
                    if (!a.address || !assetMatch.address) return false;
                    const addressMatch = a.address.toLowerCase() === assetMatch.address.toLowerCase();
                    const symbolMatch = a.symbol?.toUpperCase() === assetMatch.symbol?.toUpperCase();
                    return addressMatch || symbolMatch;
                  });
                  
                  if (matchingAsset) {
                    const assetLendingApy = matchingAsset.apy;
                    const assetDefiSpringApy = matchingAsset.defiSpringApy || 0;
                    const assetTotalApy = assetLendingApy + assetDefiSpringApy;
                    
                    console.info(`[getPoolYield]     - Pool: ${p.name}`);
                    console.info(`[getPoolYield]       Lending APY: ${assetLendingApy}%`);
                    console.info(`[getPoolYield]       DeFi Spring APY: ${assetDefiSpringApy}%`);
                    console.info(`[getPoolYield]       Total APY: ${assetTotalApy}%`);
                    console.info(`[getPoolYield]       Utilization: ${matchingAsset.currentUtilization}%`);
                    
                    if (assetTotalApy > bestApy) {
                      bestApy = assetTotalApy;
                      bestPoolName = p.name;
                      bestLendingApy = assetLendingApy;
                      bestDefiSpringApy = assetDefiSpringApy;
                      bestUtilization = matchingAsset.currentUtilization;
                    }
                  }
                });
                
                if (bestApy > 0) {
                  console.info(`[getPoolYield] ✅ Using ${assetMatch.symbol} APY from other pool as reference:`);
                  console.info(`[getPoolYield]   - Best APY: ${bestApy.toFixed(4)}% (from pool: ${bestPoolName})`);
                  console.info(`[getPoolYield]   - Lending: ${bestLendingApy.toFixed(4)}%`);
                  console.info(`[getPoolYield]   - DeFi Spring: ${bestDefiSpringApy.toFixed(4)}%`);
                  console.info(`[getPoolYield]   - Utilization: ${bestUtilization}%`);
                  console.info(`[getPoolYield]   - Note: Pool ${pool.name} has 0% utilization, using reference APY from ${bestPoolName}`);
                  return bestApy;
                }
              } else {
                console.warn(`[getPoolYield] ⚠️ ${assetMatch.symbol} not found in any other pools.`);
              }
            
              console.warn(`[getPoolYield] ⚠️ Could not find ${assetMatch.symbol} APY in other pools.`);
              console.warn(`[getPoolYield] ⚠️ Returning 0% APY (asset has no utilization/APY in this pool or others).`);
              return 0;
            }
            
            // Return the actual APY for the asset (lending + DeFi Spring)
            return totalApy;
          } else {
            // If we didn't find the specific asset, log all available assets for debugging
            console.warn(`[getPoolYield] ❌ Asset ${assetAddress} not found in pool ${pool.name}.`);
            console.log(`[getPoolYield] Available assets in pool:`, pool.assets.map((a: ProcessedAsset) => ({
              symbol: a.symbol,
              address: a.address?.toLowerCase() || 'null',
              addressFelt: a.address && !a.address.startsWith('0x') ? a.address : 'N/A',
              apy: a.apy,
              defiSpringApy: a.defiSpringApy || 0,
              totalApy: a.apy + (a.defiSpringApy || 0)
            })));
            
            if (pool.assets.length === 1) {
              const singleAsset = pool.assets[0];
              const totalApy = singleAsset.apy + (singleAsset.defiSpringApy || 0);
              console.log(`[getPoolYield] Pool has only one asset (${singleAsset.symbol}), using its APY: ${totalApy}%`);
              return totalApy;
            }
            
            const wbtcAsset = pool.assets.find((a: ProcessedAsset) => {
              if (!a.symbol) return false;
              const symbolUpper = a.symbol.toUpperCase();
              return symbolUpper.includes('WBTC') || symbolUpper.includes('BTC');
            });
            
            if (wbtcAsset) {
              const totalApy = wbtcAsset.apy + (wbtcAsset.defiSpringApy || 0);
              console.log(`[getPoolYield] Using WBTC asset found by symbol (${wbtcAsset.symbol}): ${totalApy}% APY`);
              return totalApy;
            }
            
            console.warn(`[getPoolYield] ⚠️ Asset not found by address. Searching for WBTC/BTC assets in other pools...`);
            
            // Search for WBTC in other pools (by symbol, since address matching failed)
            const otherPoolsWithWbtc = pools.filter((p: VesuPool) => {
              if (p.id === pool.id) return false; // Skip current pool
              return p.assets.some((a: ProcessedAsset) => {
                if (!a.symbol) return false;
                const symbolUpper = a.symbol.toUpperCase();
                return symbolUpper.includes('WBTC') || symbolUpper.includes('BTC');
              });
            });
            
            if (otherPoolsWithWbtc.length > 0) {
              // Find the best APY for WBTC across all pools
              let bestApy = 0;
              let bestPoolName = '';
              let bestAssetSymbol = '';
              
              console.info(`[getPoolYield]   Found WBTC/BTC in ${otherPoolsWithWbtc.length} other pool(s):`);
              
              otherPoolsWithWbtc.forEach((p: VesuPool) => {
                const wbtcAsset = p.assets.find((a: ProcessedAsset) => {
                  if (!a.symbol) return false;
                  const symbolUpper = a.symbol.toUpperCase();
                  return symbolUpper.includes('WBTC') || symbolUpper.includes('BTC');
                });
                
                if (wbtcAsset) {
                  const assetLendingApy = wbtcAsset.apy;
                  const assetDefiSpringApy = wbtcAsset.defiSpringApy || 0;
                  const assetTotalApy = assetLendingApy + assetDefiSpringApy;
                  
                  console.info(`[getPoolYield]     - Pool: ${p.name}, Asset: ${wbtcAsset.symbol}`);
                  console.info(`[getPoolYield]       Lending APY: ${assetLendingApy}%`);
                  console.info(`[getPoolYield]       DeFi Spring APY: ${assetDefiSpringApy}%`);
                  console.info(`[getPoolYield]       Total APY: ${assetTotalApy}%`);
                  
                  if (assetTotalApy > bestApy) {
                    bestApy = assetTotalApy;
                    bestPoolName = p.name;
                    bestAssetSymbol = wbtcAsset.symbol;
                  }
                }
              });
              
              if (bestApy > 0) {
                console.info(`[getPoolYield] ✅ Using WBTC APY from other pool as reference:`);
                console.info(`[getPoolYield]   - Best APY: ${bestApy.toFixed(4)}% (${bestAssetSymbol} from pool: ${bestPoolName})`);
                console.info(`[getPoolYield]   - Note: Using reference APY since asset not found in current pool`);
                return bestApy;
              }
            }
            
            console.warn(`[getPoolYield] ⚠️ Could not determine APY for pool ${poolAddress}.`);
            console.warn(`[getPoolYield] ⚠️ Asset ${assetAddress} not found and no WBTC reference found in other pools.`);
            return null;
          }
        } else {
          console.warn(`[getPoolYield] Pool ${poolAddress} not found in Vesu API. Available pools:`, pools.map((p: VesuPool) => ({ 
            name: p.name, 
            address: p.address || 'null',
            id: p.id 
          })));
        }
      } catch (apiErr) {
        console.warn('Failed to get APY from Vesu API, falling back to contract calculation:', apiErr);
        // Fall through to contract-based calculation below
      }
      
      console.warn('⚠️ Using contract-based APY calculation (fallback). Consider using Vesu API instead.');
      console.log(`[getPoolYield] Starting contract-based calculation for pool: ${poolAddress}`);
      
      // Get asset address from vault contract
      console.log(`[getPoolYield] Getting asset address from vault contract...`);
      const asset = await contract.call('asset', [], { blockIdentifier: 'latest' });
      const assetAddress = asset.toString();
      console.log(`[getPoolYield] Asset address: ${assetAddress}`);
      
      // Pool contract ABI
      const poolAbi = [
        {
          "type": "function",
          "name": "utilization",
          "inputs": [
            {"name": "asset", "type": "core::starknet::contract_address::ContractAddress"}
          ],
          "outputs": [{"type": "core::integer::u256"}],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "asset_config",
          "inputs": [
            {"name": "asset", "type": "core::starknet::contract_address::ContractAddress"}
          ],
          "outputs": [
            {
              "type": "struct",
              "name": "AssetConfig",
              "members": [
                {"name": "total_collateral_shares", "type": "core::integer::u256"},
                {"name": "total_nominal_debt", "type": "core::integer::u256"},
                {"name": "reserve", "type": "core::integer::u256"},
                {"name": "max_utilization", "type": "core::integer::u256"},
                {"name": "floor", "type": "core::integer::u256"},
                {"name": "scale", "type": "core::integer::u256"},
                {"name": "is_legacy", "type": "core::bool"},
                {"name": "last_updated", "type": "core::integer::u64"},
                {"name": "last_rate_accumulator", "type": "core::integer::u256"},
                {"name": "last_full_utilization_rate", "type": "core::integer::u256"},
                {"name": "fee_rate", "type": "core::integer::u256"},
                {"name": "fee_shares", "type": "core::integer::u256"}
              ]
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "interest_rate",
          "inputs": [
            {"name": "asset", "type": "core::starknet::contract_address::ContractAddress"},
            {"name": "utilization", "type": "core::integer::u256"},
            {"name": "last_updated", "type": "core::integer::u64"},
            {"name": "last_full_utilization_rate", "type": "core::integer::u256"}
          ],
          "outputs": [{"type": "core::integer::u256"}],
          "state_mutability": "view"
        }
      ];
      
      console.log(`[getPoolYield] Creating pool contract instance for: ${poolAddress}`);
      const poolContract = new Contract(poolAbi, poolAddress, provider);
      
      // Get utilization
      console.log(`[getPoolYield] Calling utilization for asset: ${assetAddress}`);
      const utilization = await poolContract.call('utilization', [assetAddress], { blockIdentifier: 'latest' });
      console.log(`[getPoolYield] Utilization result: ${utilization.toString()}`);
      
      // Get asset config
      console.log(`[getPoolYield] Calling asset_config for asset: ${assetAddress}`);
      const assetConfigResult = await poolContract.call('asset_config', [assetAddress], { blockIdentifier: 'latest' });
      console.log(`[getPoolYield] Asset config result:`, assetConfigResult);
      
      // Parse asset_config struct (simplified version)
      let lastUpdated = '0';
      let lastFullUtilizationRate = '0';
      
      if (assetConfigResult && typeof assetConfigResult === 'object') {
        const obj = assetConfigResult as any;
        if ('AssetConfig' in obj && typeof obj.AssetConfig === 'object') {
          const cfg = obj.AssetConfig;
          lastUpdated = cfg.last_updated?.toString() || cfg[7]?.toString() || '0';
          lastFullUtilizationRate = cfg.last_full_utilization_rate?.toString() || cfg[9]?.toString() || '0';
        } else if ('last_updated' in obj) {
          lastUpdated = obj.last_updated?.toString() || '0';
          lastFullUtilizationRate = obj.last_full_utilization_rate?.toString() || '0';
        } else if (Array.isArray(obj)) {
          lastUpdated = obj[7]?.toString() || '0';
          lastFullUtilizationRate = obj[9]?.toString() || '0';
        }
      }
      
      // Get interest rate (yield)
      console.log(`[getPoolYield] Calling interest_rate with params:`, {
        asset: assetAddress,
        utilization: utilization.toString(),
        lastUpdated,
        lastFullUtilizationRate
      });
      const interestRate = await poolContract.call('interest_rate', [
        assetAddress,
        utilization,
        lastUpdated,
        lastFullUtilizationRate
      ], { blockIdentifier: 'latest' });
      console.log(`[getPoolYield] Interest rate result: ${interestRate.toString()}`);
      
      const interestRateBigInt = BigInt(interestRate.toString());
      const utilizationBigInt = BigInt(utilization.toString());
      
      // Log raw values for debugging
      console.log(`[getPoolYield] Contract calculation for pool ${poolAddress}:`, {
        utilization: utilization.toString(),
        lastUpdated,
        lastFullUtilizationRate,
        interestRate: interestRateBigInt.toString(),
      });
      
      // Calculate yield = interest_rate * utilization (matching contract implementation)
      // This matches the contract's _interest_rate_per_pool which returns (interest_rate * utilization)
      // interest_rate is a per-second rate in SCALE (10^27)
      // utilization is also in SCALE (10^27), where SCALE = 100%
      const SCALE = BigInt('1000000000000000000000000000'); // 10^27
      const SECONDS_PER_YEAR = BigInt('31536000'); // 365 * 24 * 60 * 60
      
      // interest_rate from the contract is the per-second rate at the current utilization
      // When utilization is 0, interest_rate may be very small or 0
      // The interest_rate value needs to be interpreted based on the contract's implementation
      // 
      // For Vesu V2, interest_rate is typically in a smaller scale (not full SCALE)
      // We need to check if the value is already in the correct format or needs scaling
      
      let apyPercentage: number;
      
      if (interestRateBigInt === BigInt('0')) {
        // No interest rate, return 0%
        apyPercentage = 0;
        console.log(`[getPoolYield] Interest rate is 0, returning 0% APY`);
      } else if (utilizationBigInt === BigInt('0')) {
        // When utilization is 0, the interest_rate may represent the rate at 0% utilization
        // or the rate at full utilization. We'll use it as-is and convert to APR
        // interest_rate might be in a different scale, so we need to check its magnitude
        
        // If interest_rate is very small (< 10^18), it might be in a different scale
        // For now, we'll assume it's in SCALE and convert accordingly
        // APR = (interest_rate / SCALE) * SECONDS_PER_YEAR * 100
        const numerator = interestRateBigInt * SECONDS_PER_YEAR * BigInt('100');
        apyPercentage = Number(numerator) / Number(SCALE);
        console.log(`[getPoolYield] Utilization is 0, calculating potential APY from interest_rate`);
      } else {
        // When utilization > 0, use interest_rate * utilization (matching contract)
        // Both are in SCALE, so the result is in SCALE^2, but we need to divide by SCALE
        const yieldValue = (interestRateBigInt * utilizationBigInt) / SCALE;
        const numerator = yieldValue * SECONDS_PER_YEAR * BigInt('100');
        apyPercentage = Number(numerator) / Number(SCALE);
      }
      
      console.log(`[getPoolYield] Calculation details:`, {
        interestRate: interestRateBigInt.toString(),
        utilization: utilizationBigInt.toString(),
        apyPercentage: apyPercentage.toFixed(4),
        note: utilizationBigInt === BigInt('0') ? 'Potential APY at 100% utilization' : 'Actual APY at current utilization'
      });
      
      console.log(`[getPoolYield] Pool ${poolAddress} APY from contract (fallback): ${apyPercentage.toFixed(4)}% (utilization: ${utilization.toString()}, interest_rate: ${interestRateBigInt.toString()})`);
      
      return apyPercentage;
    } catch (err) {
      console.error('Failed to get pool yield:', err);
      return null;
    }
  }, [isConnected, contract, provider]);

  useEffect(() => {
    if (isConnected) {
      loadVaultData();
    }
  }, [isConnected]);

  return {
    isConnected,
    isLoading,
    isPending,
    isSuccess,
    error,
    account,
    contractAddress: VESU_VAULT_ADDRESS,
    totalAssets: vaultData?.totalAssets || null,
    wbtcBalance,
    vaultData,
    checkWbtcBalance,
    checkVaultShares,
    getUserPosition,
    previewDeposit,
    deposit,
    withdraw,
    loadVaultData,
    getAllowedPools,
    setAllowedPools,
    createPoolProps,
    computeYield,
    rebalance,
    rebalanceWeights,
    harvest,
    emergencyWithdraw,
    emergencyWithdrawPool,
    getPoolBalance,
    getPoolYield,
  };
}
