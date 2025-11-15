import { useState, useCallback } from 'react';
import { Account, Contract, RpcProvider, CallData } from 'starknet';
import { useAccount } from '@starknet-react/core';
import { useWalletStatus } from './use-wallet';
import { useToast } from './use-toast';
import { LOCK_TO_EARN_BOND_ABI, LOCK_TO_EARN_BOND_ADDRESS } from '@/abis/LockToEarnBond';
import { getVesuPools } from '@/app/api/vesuApi';
import type { VesuPool, ProcessedAsset } from '@/types/VesuPools';

// ERC20 ABI for token approval and balance checking
const ERC20_ABI = [
  {
    "type": "function",
    "name": "approve",
    "inputs": [
      { "name": "spender", "type": "core::starknet::contract_address::ContractAddress" },
      { "name": "amount", "type": "core::integer::u256" }
    ],
    "outputs": [{ "type": "core::bool" }],
    "state_mutability": "external"
  },
  {
    "type": "function",
    "name": "allowance",
    "inputs": [
      { "name": "owner", "type": "core::starknet::contract_address::ContractAddress" },
      { "name": "spender", "type": "core::starknet::contract_address::ContractAddress" }
    ],
    "outputs": [{ "type": "core::integer::u256" }],
    "state_mutability": "view"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [
      { "name": "account", "type": "core::starknet::contract_address::ContractAddress" }
    ],
    "outputs": [
      { "name": "balance", "type": "core::integer::u256" }
    ],
    "state_mutability": "view"
  }
];

interface DepositWithLockParams {
  amount: string; // Amount in human readable format
  receiver: string; // Receiver address
  lockPeriodSeconds: number; // Lock period in seconds
  assetDecimals?: number; // Asset decimals (default 8 for WBTC)
}

interface WithdrawParams {
  assets: string; // Amount in human readable format
  receiver: string; // Receiver address
  owner: string; // Owner address
  assetDecimals?: number; // Asset decimals (default 8 for WBTC)
}

interface SetAllowedPoolsParams {
  pools: Array<{
    pool_id: string;
    max_weight: number; // In basis points (10000 = 100%)
    v_token: string;
  }>;
}

interface DepositResult {
  approvalTxHash?: string;
  depositTxHash?: string;
  success: boolean;
  error?: string;
}

interface WithdrawResult {
  txHash?: string;
  success: boolean;
  error?: string;
}

interface SetPoolsResult {
  txHash?: string;
  success: boolean;
  error?: string;
}

/**
 * Helper function to convert amount to wei (bigint)
 */
function parseAmountToWei(amount: string, decimals: number = 8): bigint {
  const amountFloat = parseFloat(amount);
  if (isNaN(amountFloat) || amountFloat < 0) {
    throw new Error('Invalid amount');
  }
  const multiplier = BigInt(10 ** decimals);
  return BigInt(Math.floor(amountFloat * Number(multiplier)));
}

/**
 * Helper function to convert u256 to human readable format
 */
function parseU256ToAmount(u256: { low: bigint; high: bigint } | string, decimals: number = 8): string {
  let low: bigint;
  let high: bigint;
  
  if (typeof u256 === 'string') {
    // If it's a string, it's already formatted, return as is
    return u256;
  } else {
    low = BigInt(u256.low);
    high = BigInt(u256.high);
  }
  
  const amountWei = (high << BigInt(128)) + low;
  const divisor = BigInt(10 ** decimals);
  const amount = Number(amountWei) / Number(divisor);
  return amount.toString();
}

export function useLockToEarnBond() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address, isConnected } = useWalletStatus();
  const { account } = useAccount();
  const { toast } = useToast();

  // Get the contract asset address
  const getAssetAddress = useCallback(async (): Promise<string> => {
    try {
      // Use same RPC as useVesuVault (Alchemy v0_9) for consistency
      const provider = new RpcProvider({ 
        nodeUrl: 'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_9/c0P2DVGVr0OOBtgc3tSqm'
      });

      // Use contract.call with blockIdentifier instead
      const contract = new Contract(LOCK_TO_EARN_BOND_ABI, LOCK_TO_EARN_BOND_ADDRESS, provider);
      const result = await contract.call('asset', [], { blockIdentifier: 'latest' });

      // contract.call returns BigInt for addresses, convert to hex string
      if (typeof result === 'bigint') {
        // Convert BigInt to hex string with 0x prefix, pad to 66 chars (64 hex + 0x)
        return `0x${result.toString(16).padStart(64, '0')}`;
      } else if (typeof result === 'string') {
        return result;
      } else {
        // Fallback: try to convert to string and then to hex
        const bigIntValue = BigInt(result.toString());
        return `0x${bigIntValue.toString(16).padStart(64, '0')}`;
      }
    } catch (err) {
      console.error('Error getting asset address:', err);
      throw err;
    }
  }, []);

  /**
   * Deposit with custom lock period
   */
  const depositWithCustomLock = useCallback(async (
    params: DepositWithLockParams
  ): Promise<DepositResult> => {
    if (!isConnected || !address || !account) {
      const errorMsg = 'Wallet not connected or account not available';
      setError(errorMsg);
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to deposit",
        variant: "destructive",
      });
      return { success: false, error: errorMsg };
    }

    setIsLoading(true);
    setError(null);

    try {
      const provider = new RpcProvider({ 
        nodeUrl: 'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_9/c0P2DVGVr0OOBtgc3tSqm'
      });

      // Get asset address from contract
      const assetAddress = await getAssetAddress();
      console.log('Asset address:', assetAddress);

      // Convert amount to wei
      const decimals = params.assetDecimals ?? 8;
      const amountInWei = parseAmountToWei(params.amount, decimals);
      console.log('Amount in wei:', amountInWei.toString());

      // Check if amount is 0
      if (amountInWei === BigInt(0)) {
        throw new Error('Amount cannot be zero. Please enter a valid amount greater than 0.');
      }

      // Step 1: Check balance and allowance
      const tokenContract = new Contract(ERC20_ABI, assetAddress, provider);
      tokenContract.connect(account);

      // Check user balance
      const balanceResult = await tokenContract.call('balanceOf', [account.address], { blockIdentifier: 'latest' });
      console.log('Balance result raw:', balanceResult);
      console.log('Balance result type:', typeof balanceResult);
      console.log('Balance result keys:', balanceResult && typeof balanceResult === 'object' ? Object.keys(balanceResult) : 'N/A');
      
      let userBalance = BigInt(0);
      if (balanceResult) {
        if (typeof balanceResult === 'object' && 'low' in balanceResult) {
          const balanceU256 = balanceResult as { low: bigint | string; high: bigint | string };
          const low = typeof balanceU256.low === 'string' ? BigInt(balanceU256.low) : balanceU256.low;
          const high = typeof balanceU256.high === 'string' ? BigInt(balanceU256.high || '0') : (balanceU256.high || BigInt(0));
          userBalance = (high << BigInt(128)) + low;
          console.log('Parsed u256 balance - low:', low.toString(), 'high:', high.toString(), 'combined:', userBalance.toString());
        } else if (typeof balanceResult === 'string') {
          userBalance = BigInt(balanceResult);
          console.log('Parsed string balance:', userBalance.toString());
        } else if (typeof balanceResult === 'number') {
          userBalance = BigInt(balanceResult);
          console.log('Parsed number balance:', userBalance.toString());
        } else if (typeof balanceResult === 'bigint') {
          userBalance = balanceResult;
          console.log('Parsed bigint balance:', userBalance.toString());
        } else if (typeof balanceResult === 'object' && 'balance' in balanceResult) {
          // Handle {balance: bigint} format
          const balanceObj = balanceResult as { balance: bigint | string | number };
          if (typeof balanceObj.balance === 'bigint') {
            userBalance = balanceObj.balance;
          } else if (typeof balanceObj.balance === 'string') {
            userBalance = BigInt(balanceObj.balance);
          } else if (typeof balanceObj.balance === 'number') {
            userBalance = BigInt(balanceObj.balance);
          }
          console.log('Parsed balance from object.balance:', userBalance.toString());
        } else {
          console.warn('Unknown balance result format:', balanceResult);
        }
      }
      
      // Convert to human-readable format for error messages
      const userBalanceReadable = parseU256ToAmount({ low: userBalance, high: BigInt(0) }, decimals);
      const amountToDepositReadable = params.amount;
      
      console.log('User balance (wei):', userBalance.toString());
      console.log('User balance (readable):', userBalanceReadable);
      console.log('Amount to deposit (wei):', amountInWei.toString());
      console.log('Amount to deposit (readable):', amountToDepositReadable);
      
      if (userBalance < amountInWei) {
        throw new Error(
          `Insufficient balance. You have ${userBalanceReadable} WBTC (${userBalance.toString()} wei) but need ${amountToDepositReadable} WBTC (${amountInWei.toString()} wei)`
        );
      }

      // Check current allowance
      const currentAllowanceResult = await tokenContract.call('allowance', [account.address, LOCK_TO_EARN_BOND_ADDRESS], { blockIdentifier: 'latest' });
      
      // Parse allowance result (u256 format: { low: u128, high: u128 })
      let currentAllowance = BigInt(0);
      if (currentAllowanceResult) {
        if (typeof currentAllowanceResult === 'object' && 'low' in currentAllowanceResult) {
          const allowanceU256 = currentAllowanceResult as { low: bigint | string; high: bigint | string };
          const low = typeof allowanceU256.low === 'string' ? BigInt(allowanceU256.low) : allowanceU256.low;
          const high = typeof allowanceU256.high === 'string' ? BigInt(allowanceU256.high || '0') : (allowanceU256.high || BigInt(0));
          currentAllowance = (high << BigInt(128)) + low;
        } else if (typeof currentAllowanceResult === 'string') {
          currentAllowance = BigInt(currentAllowanceResult);
        }
      }
      
      console.log('Current allowance:', currentAllowance.toString());
      console.log('Required amount:', amountInWei.toString());

      // Prepare calls array for multicall
      const calls: any[] = [];

      // Only add approve call if current allowance is less than required amount
      if (currentAllowance < amountInWei) {
        console.log('Approval needed, will be included in multicall...');
        // Format u256 as [low, high] strings for calldata (same format as use-vesu-vault)
        const amountLow = amountInWei.toString();
        const amountHigh = '0';
        calls.push({
          contractAddress: assetAddress,
          entrypoint: 'approve',
          calldata: [LOCK_TO_EARN_BOND_ADDRESS, amountLow, amountHigh]
        });
      } else {
        console.log('Sufficient allowance already exists, skipping approval');
      }

      // Step 2: Add deposit with lock call
      console.log('Adding deposit_with_custom_lock call...');
      
      // Normalize receiver address (ensure it's a valid hex string)
      let receiverAddress = String(params.receiver).trim();
      if (!receiverAddress.startsWith('0x')) {
        receiverAddress = '0x' + receiverAddress;
      }
      // Ensure it's a valid address format (at least 10 chars: 0x + 8 hex digits)
      if (receiverAddress.length < 10) {
        throw new Error(`Invalid receiver address format: ${params.receiver}`);
      }
      
      // Validate lock period is a valid number
      const lockPeriodSeconds = Number(params.lockPeriodSeconds);
      if (isNaN(lockPeriodSeconds) || lockPeriodSeconds <= 0) {
        throw new Error(`Invalid lock period: ${params.lockPeriodSeconds}`);
      }
      
      console.log('Lock period details:', {
        lockPeriodSeconds: lockPeriodSeconds,
        lockPeriodDays: lockPeriodSeconds / 86400,
        lockPeriodSecondsString: lockPeriodSeconds.toString(),
        receiverAddress: receiverAddress
      });
      
      // Format u256 as [low, high] strings for calldata
      const depositAmountLow = amountInWei.toString();
      const depositAmountHigh = '0';
      
      const depositCalldata = [
        depositAmountLow,
        depositAmountHigh,
        receiverAddress,
        lockPeriodSeconds.toString()
      ];
      
      console.log('Deposit calldata:', depositCalldata);
      
      calls.push({
        contractAddress: LOCK_TO_EARN_BOND_ADDRESS,
        entrypoint: 'deposit_with_custom_lock',
        calldata: depositCalldata
      });

      // Execute approve and deposit in a single multicall transaction
      console.log('Executing multicall...');
      console.log('Calls to execute:', JSON.stringify(calls, (key, value) => 
        typeof value === 'bigint' ? value.toString() : value
      , 2));
      console.log('Account address:', account.address);
      console.log('Contract address:', LOCK_TO_EARN_BOND_ADDRESS);
      console.log('Asset address:', assetAddress);
      
      let approvalTxHash: string | undefined;
      let depositTxHash: string;

      // Validate calls before execution
      console.log('Validating calls before execution...');
      calls.forEach((call, index) => {
        console.log(`Call ${index}:`, {
          contractAddress: call.contractAddress,
          entrypoint: call.entrypoint,
          calldataLength: call.calldata?.length,
          calldata: call.calldata,
          contractAddressValid: call.contractAddress && call.contractAddress.startsWith('0x') && call.contractAddress.length >= 10,
          entrypointValid: call.entrypoint && typeof call.entrypoint === 'string' && call.entrypoint.length > 0,
          calldataValid: Array.isArray(call.calldata) && call.calldata.length > 0
        });
        
        if (!call.contractAddress || !call.contractAddress.startsWith('0x') || call.contractAddress.length < 10) {
          throw new Error(`Invalid contract address in call ${index}: ${call.contractAddress}`);
        }
        if (!call.entrypoint || typeof call.entrypoint !== 'string') {
          throw new Error(`Invalid entrypoint in call ${index}: ${call.entrypoint}`);
        }
        if (!Array.isArray(call.calldata)) {
          throw new Error(`Invalid calldata in call ${index}: must be an array`);
        }
      });

      try {
        console.log('Executing transaction...');
        console.log('Account type:', account?.constructor?.name);
        console.log('Account has execute method:', typeof account?.execute === 'function');
        console.log('Number of calls:', calls.length);
        
        if (calls.length === 2) {
          // Both approve and deposit
          console.log('Executing multicall with approve + deposit...');
          const result = await account.execute(calls);
          depositTxHash = result.transaction_hash;
          approvalTxHash = result.transaction_hash; // Same transaction for multicall
        } else {
          // Only deposit (allowance already sufficient)
          console.log('Executing deposit only (allowance sufficient)...');
          const result = await account.execute(calls);
          depositTxHash = result.transaction_hash;
        }

        console.log('Deposit transaction:', depositTxHash);
      } catch (executeError: any) {
        // Extract error message
        let errorMessage = 'Transaction execution failed';
        let errorDetails = '';
        
        if (executeError instanceof Error) {
          errorMessage = executeError.message || 'Execute failed';
        } else if (executeError && typeof executeError === 'object') {
          const errorObj = executeError as any;
          if (errorObj.message) {
            errorMessage = errorObj.message;
          } else if (errorObj.error?.message) {
            errorMessage = errorObj.error.message;
          } else if (errorObj.details) {
            errorMessage = errorObj.details;
          } else if (errorObj.reason) {
            errorMessage = errorObj.reason;
          } else if (errorObj.data) {
            errorMessage = `Transaction failed: ${JSON.stringify(errorObj.data)}`;
          }
        }
        
        // Try to extract from nested error structure
        const errorObj = executeError as any;
        if (errorObj?.error?.revert_error) {
          const revertError = errorObj.error.revert_error;
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
        if (errorObj?.response?.data) {
          errorDetails = JSON.stringify(errorObj.response.data);
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
          errorStr.includes('transaction rejected') ||
          errorStr.includes('request rejected') ||
          errorStr.includes('execute failed') ||
          errorMessage === 'Execute failed' ||
          errorMessage?.toLowerCase() === 'execute failed' ||
          errorObj?.code === 4001 ||
          errorObj?.code === 'ACTION_REJECTED' ||
          errorObj?.code === 'USER_REJECTED';
        
        if (isUserRejection) {
          // User cancelled/rejected - this is expected behavior, don't treat as an error
          toast({
            title: "Transaction Cancelled",
            description: "The transaction was cancelled. No changes were made.",
            variant: "default",
          });
          return { success: false, error: 'Transaction cancelled by user' };
        }
        
        // Check for specific Starknet error patterns
        if (errorMessage?.toLowerCase().includes('insufficient')) {
          errorMessage = 'Insufficient balance or allowance. Please check your wallet balance and ensure you have approved the contract.';
        } else if (errorMessage?.toLowerCase().includes('network') || errorMessage?.toLowerCase().includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (errorMessage?.toLowerCase().includes('simulation failed') || errorMessage?.toLowerCase().includes('simulate')) {
          errorMessage = 'Transaction simulation failed. Please check your inputs and try again.';
        } else if (errorMessage === 'Execute failed') {
          // If it's just "Execute failed" without other context, it might be a wallet rejection
          // But we already handled that above, so this is a fallback
          errorMessage = 'Transaction failed. Please check your inputs and try again.';
        }
        
        throw new Error(errorMessage);
      }

      // Wait for transaction
      await provider.waitForTransaction(depositTxHash, {
        retryInterval: 2000
      });

      console.log('Deposit confirmed!');

      toast({
        title: "Deposit Successful!",
        description: `Successfully deposited ${params.amount} tokens with ${params.lockPeriodSeconds} seconds lock period`,
      });

      return {
        approvalTxHash,
        depositTxHash,
        success: true
      };

    } catch (err) {
      console.error('Deposit error:', err);
      console.error('Error details:', {
        error: err,
        type: typeof err,
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined
      });
      
      let errorMsg = 'Unknown error occurred';
      if (err instanceof Error) {
        errorMsg = err.message;
      } else if (err && typeof err === 'object') {
        const errorObj = err as any;
        errorMsg = errorObj.message || errorObj.error?.message || errorObj.details || String(err);
      } else {
        errorMsg = String(err);
      }
      
      setError(errorMsg);
      
      toast({
        title: "Deposit Failed",
        description: errorMsg || 'An unexpected error occurred. Please try again.',
        variant: "destructive",
      });

      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, account, toast, getAssetAddress]);

  /**
   * Deposit with existing lock period (uses the lock period from user's existing position)
   */
  const depositLocked = useCallback(async (
    params: Omit<DepositWithLockParams, 'lockPeriodSeconds'>
  ): Promise<DepositResult> => {
    if (!isConnected || !address || !account) {
      const errorMsg = 'Wallet not connected or account not available';
      setError(errorMsg);
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to deposit",
        variant: "destructive",
      });
      return { success: false, error: errorMsg };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use same RPC as useVesuVault (Alchemy v0_9) for consistency
      const provider = new RpcProvider({ 
        nodeUrl: 'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_9/c0P2DVGVr0OOBtgc3tSqm'
      });

      // Get asset address from contract
      const assetAddress = await getAssetAddress();
      console.log('Asset address:', assetAddress);

      // Convert amount to wei
      const decimals = params.assetDecimals ?? 8;
      const amountInWei = parseAmountToWei(params.amount, decimals);
      console.log('Amount in wei:', amountInWei.toString());

      // Check if amount is 0
      if (amountInWei === BigInt(0)) {
        throw new Error('Amount cannot be zero. Please enter a valid amount greater than 0.');
      }

      // Step 1: Check allowance and approve if needed
      const tokenContract = new Contract(ERC20_ABI, assetAddress, provider);
      tokenContract.connect(account);

      // Check current allowance
      const currentAllowanceResult = await tokenContract.call('allowance', [account.address, LOCK_TO_EARN_BOND_ADDRESS], { blockIdentifier: 'latest' });
      
      // Parse allowance result (u256 format: { low: u128, high: u128 })
      let currentAllowance = BigInt(0);
      if (currentAllowanceResult) {
        if (typeof currentAllowanceResult === 'object' && 'low' in currentAllowanceResult) {
          const allowanceU256 = currentAllowanceResult as { low: bigint | string; high: bigint | string };
          const low = typeof allowanceU256.low === 'string' ? BigInt(allowanceU256.low) : allowanceU256.low;
          const high = typeof allowanceU256.high === 'string' ? BigInt(allowanceU256.high || '0') : (allowanceU256.high || BigInt(0));
          currentAllowance = (high << BigInt(128)) + low;
        } else if (typeof currentAllowanceResult === 'string') {
          currentAllowance = BigInt(currentAllowanceResult);
        }
      }
      
      console.log('Current allowance:', currentAllowance.toString());
      console.log('Required amount:', amountInWei.toString());

      // Prepare calls array for multicall
      const calls: any[] = [];

      // Only add approve call if current allowance is less than required amount
      if (currentAllowance < amountInWei) {
        console.log('Approval needed, will be included in multicall...');
        calls.push({
          contractAddress: assetAddress,
          entrypoint: 'approve',
          calldata: CallData.compile([
            LOCK_TO_EARN_BOND_ADDRESS,
            { low: amountInWei, high: BigInt(0) }
          ])
        });
      } else {
        console.log('Sufficient allowance already exists, skipping approval');
      }

      // Step 2: Add deposit_locked call (uses existing lock period)
      console.log('Adding deposit_locked call (using existing lock period)...');
      calls.push({
        contractAddress: LOCK_TO_EARN_BOND_ADDRESS,
        entrypoint: 'deposit_locked',
        calldata: CallData.compile([
          { low: amountInWei, high: BigInt(0) },
          params.receiver
        ])
      });

      // Execute approve and deposit in a single multicall transaction
      console.log('Executing multicall...');
      let approvalTxHash: string | undefined;
      let depositTxHash: string;

      try {
        if (calls.length === 2) {
          // Both approve and deposit
          const result = await account.execute(calls);
          approvalTxHash = result.transaction_hash;
          depositTxHash = result.transaction_hash;
          console.log('Multicall transaction (approve + deposit_locked):', result.transaction_hash);
        } else {
          // Only deposit (approval already exists)
          const result = await account.execute(calls[0]);
          depositTxHash = result.transaction_hash;
          console.log('Deposit_locked transaction:', result.transaction_hash);
        }
      } catch (executeError: any) {
        // Detect if user rejected the transaction
        let errorMessage = 'Execute failed';
        let errorDetails = '';
        
        if (executeError instanceof Error) {
          errorMessage = executeError.message || 'Execute failed';
        } else if (executeError && typeof executeError === 'object') {
          const errorObj = executeError as any;
          if (errorObj.message) {
            errorMessage = errorObj.message;
          } else if (errorObj.error?.message) {
            errorMessage = errorObj.error.message;
          }
        }
        
        // Convert error to string for comprehensive checking
        let errorStr = '';
        try {
          errorStr = (errorMessage + ' ' + errorDetails + ' ' + JSON.stringify(executeError)).toLowerCase();
        } catch {
          errorStr = (errorMessage + ' ' + errorDetails).toLowerCase();
        }
        
        // Check if user rejected/cancelled the transaction
        const errorObj = executeError as any;
        const isUserRejection = 
          errorStr.includes('user abort') ||
          errorStr.includes('user rejected') ||
          errorStr.includes('user cancelled') ||
          errorStr.includes('rejected by user') ||
          errorStr.includes('aborted by user') ||
          errorStr.includes('action rejected') ||
          errorStr.includes('transaction rejected') ||
          errorStr.includes('request rejected') ||
          errorMessage === 'Execute failed' ||
          errorObj?.code === 4001 ||
          errorObj?.code === 'ACTION_REJECTED' ||
          errorObj?.code === 'USER_REJECTED';
        
        if (isUserRejection) {
          // User cancelled/rejected - this is expected behavior
          console.log('User rejected the transaction');
          toast({
            title: "Transaction Cancelled",
            description: "The transaction was cancelled. No changes were made.",
            variant: "default",
          });
          return { success: false, error: 'Transaction cancelled by user' };
        }
        
        // Re-throw for other errors
        throw executeError;
      }

      // Wait for transaction to be accepted
      await provider.waitForTransaction(depositTxHash, {
        retryInterval: 2000
      });

      toast({
        title: "Deposit Successful!",
        description: `Successfully deposited ${params.amount} tokens with existing lock period`,
      });

      return {
        approvalTxHash,
        depositTxHash,
        success: true
      };

    } catch (err) {
      let errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
      
      // Don't override user rejection message (already handled above)
      if (errorMsg !== 'Transaction cancelled by user') {
        // Check for specific error patterns
        if (errorMsg.toLowerCase().includes('insufficient')) {
          errorMsg = 'Insufficient balance or allowance. Please check your wallet balance and ensure you have approved the contract.';
        } else if (errorMsg.toLowerCase().includes('network') || errorMsg.toLowerCase().includes('fetch')) {
          errorMsg = 'Network error. Please check your connection and try again.';
        }
      }
      
      setError(errorMsg);
      
      toast({
        title: "Deposit Failed",
        description: errorMsg,
        variant: "destructive",
      });

      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, account, toast, getAssetAddress]);

  /**
   * Withdraw funds (only if lock period has passed)
   */
  const withdraw = useCallback(async (
    params: WithdrawParams
  ): Promise<WithdrawResult> => {
    if (!isConnected || !address || !account) {
      const errorMsg = 'Wallet not connected or account not available';
      setError(errorMsg);
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to withdraw",
        variant: "destructive",
      });
      return { success: false, error: errorMsg };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use same RPC as useVesuVault (Alchemy v0_9) for consistency
      const provider = new RpcProvider({ 
        nodeUrl: 'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_9/c0P2DVGVr0OOBtgc3tSqm'
      });

      // Check if user can withdraw using contract.call
      const contract = new Contract(LOCK_TO_EARN_BOND_ABI, LOCK_TO_EARN_BOND_ADDRESS, provider);
      const canWithdrawResponse = await contract.call('can_withdraw', [params.owner], { blockIdentifier: 'latest' });

      // contract.call returns the value directly
      // Parse boolean result (can be True/False enum or boolean)
      let canWithdraw = false;
      const resultAny = canWithdrawResponse as any;
      
      if (resultAny === true || resultAny === 'True') {
        canWithdraw = true;
      } else if (typeof resultAny === 'object' && resultAny !== null) {
        if ('variant' in resultAny) {
          canWithdraw = resultAny.variant === 'True';
        } else if (resultAny === true) {
          canWithdraw = true;
        }
      }

      if (!canWithdraw) {
        throw new Error('Funds are still locked. You cannot withdraw until the lock period expires.');
      }

      // Convert amount to wei
      const decimals = params.assetDecimals ?? 8;
      const amountInWei = parseAmountToWei(params.assets, decimals);

      console.log('Withdrawing funds...');
      const withdrawResult = await account.execute({
        contractAddress: LOCK_TO_EARN_BOND_ADDRESS,
        entrypoint: 'withdraw',
        calldata: CallData.compile([
          { low: amountInWei, high: BigInt(0) },
          params.receiver,
          params.owner
        ])
      });

      console.log('Withdraw transaction:', withdrawResult.transaction_hash);

      // Wait for withdrawal
      await provider.waitForTransaction(withdrawResult.transaction_hash, {
        retryInterval: 2000
      });

      toast({
        title: "Withdrawal Successful!",
        description: `Successfully withdrew ${params.assets} tokens`,
      });

      return {
        txHash: withdrawResult.transaction_hash,
        success: true
      };

    } catch (err) {
      console.error('Withdraw error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMsg);
      
      toast({
        title: "Withdrawal Failed",
        description: errorMsg,
        variant: "destructive",
      });

      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, account, toast]);

  /**
   * Emergency withdraw from all pools (admin only)
   */
  const emergencyWithdraw = useCallback(async (
    usersToBurn?: string[] // Optional: array of user addresses whose shares should be burned
  ): Promise<WithdrawResult> => {
    if (!isConnected || !address || !account) {
      const errorMsg = 'Wallet not connected or account not available';
      setError(errorMsg);
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet",
        variant: "destructive",
      });
      return { success: false, error: errorMsg };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use same RPC as useVesuVault (Alchemy v0_9) for consistency
      const provider = new RpcProvider({ 
        nodeUrl: 'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_9/c0P2DVGVr0OOBtgc3tSqm'
      });

      console.log('Emergency withdraw from all pools...');
      if (usersToBurn && usersToBurn.length > 0) {
        console.log('Will burn shares for users:', usersToBurn);
      }

      // Use contract.invoke with users array
      const contractInstance = new Contract(LOCK_TO_EARN_BOND_ABI, LOCK_TO_EARN_BOND_ADDRESS, account);
      
      // Convert user addresses to bigint array, or pass empty array if not provided
      const usersArray = usersToBurn && usersToBurn.length > 0 
        ? usersToBurn.map(user => BigInt(user))
        : [];

      const withdrawResult = await contractInstance.invoke('emergency_withdraw', [usersArray]);

      console.log('Emergency withdraw transaction:', withdrawResult.transaction_hash);

      // Wait for transaction
      await provider.waitForTransaction(withdrawResult.transaction_hash, {
        retryInterval: 2000
      });

      toast({
        title: "Emergency Withdraw Successful!",
        description: `Successfully withdrew all funds from all pools`,
      });

      return {
        txHash: withdrawResult.transaction_hash,
        success: true
      };

    } catch (err) {
      console.error('Emergency withdraw error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMsg);
      
      toast({
        title: "Emergency Withdraw Failed",
        description: errorMsg,
        variant: "destructive",
      });

      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, account, toast]);

  /**
   * Emergency withdraw for a specific user: withdraws their assets from pools and burns their shares (admin only)
   */
  const emergencyWithdrawUser = useCallback(async (userAddress: string): Promise<WithdrawResult> => {
    if (!isConnected || !address || !account) {
      const errorMsg = 'Wallet not connected or account not available';
      setError(errorMsg);
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet",
        variant: "destructive",
      });
      return { success: false, error: errorMsg };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use same RPC as useVesuVault (Alchemy v0_9) for consistency
      const provider = new RpcProvider({ 
        nodeUrl: 'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_9/c0P2DVGVr0OOBtgc3tSqm'
      });

      console.log('Emergency withdraw for user:', userAddress);

      // Use contract.invoke to call emergency_withdraw_user
      const contractInstance = new Contract(LOCK_TO_EARN_BOND_ABI, LOCK_TO_EARN_BOND_ADDRESS, account);
      const withdrawResult = await contractInstance.invoke('emergency_withdraw_user', [userAddress]);

      console.log('Emergency withdraw user transaction:', withdrawResult.transaction_hash);

      // Wait for transaction
      await provider.waitForTransaction(withdrawResult.transaction_hash, {
        retryInterval: 2000
      });

      toast({
        title: "Emergency Withdraw User Successful!",
        description: `Successfully withdrew assets and burned shares for user ${userAddress.slice(0, 10)}...`,
      });

      return {
        txHash: withdrawResult.transaction_hash,
        success: true
      };

    } catch (err) {
      console.error('Emergency withdraw user error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMsg);
      
      toast({
        title: "Emergency Withdraw User Failed",
        description: errorMsg,
        variant: "destructive",
      });

      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, account, toast]);

  /**
   * Emergency burn shares for a specific user (admin only)
   */
  const emergencyBurnShares = useCallback(async (
    userAddress: string,
    shares?: string // Optional: amount of shares to burn. If 0 or not provided, burns all user's shares
  ): Promise<WithdrawResult> => {
    if (!isConnected || !address || !account) {
      const errorMsg = 'Wallet not connected or account not available';
      setError(errorMsg);
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet",
        variant: "destructive",
      });
      return { success: false, error: errorMsg };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use same RPC as useVesuVault (Alchemy v0_9) for consistency
      const provider = new RpcProvider({ 
        nodeUrl: 'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_9/c0P2DVGVr0OOBtgc3tSqm'
      });

      console.log('Emergency burn shares for user:', userAddress, shares ? `amount: ${shares}` : 'all shares');

      // Use contract.invoke to call emergency_burn_shares
      const contractInstance = new Contract(LOCK_TO_EARN_BOND_ABI, LOCK_TO_EARN_BOND_ADDRESS, account);
      
      // Convert shares to u256 format if provided, otherwise pass 0 (which means burn all)
      let sharesToBurn: any = { low: BigInt(0), high: BigInt(0) };
      if (shares && parseFloat(shares) > 0) {
        // Convert shares string to u256 (assuming shares don't have decimals, they're just a number)
        const sharesBigInt = BigInt(Math.floor(parseFloat(shares)));
        sharesToBurn = {
          low: sharesBigInt & ((BigInt(1) << BigInt(128)) - BigInt(1)),
          high: sharesBigInt >> BigInt(128)
        };
      }

      const burnResult = await contractInstance.invoke('emergency_burn_shares', [
        userAddress,
        sharesToBurn
      ]);

      console.log('Emergency burn shares transaction:', burnResult.transaction_hash);

      // Wait for transaction
      await provider.waitForTransaction(burnResult.transaction_hash, {
        retryInterval: 2000
      });

      toast({
        title: "Burn Shares Successful!",
        description: `Successfully burned ${shares || 'all'} shares for user ${userAddress.slice(0, 10)}...`,
      });

      return {
        txHash: burnResult.transaction_hash,
        success: true
      };

    } catch (err) {
      console.error('Emergency burn shares error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMsg);
      
      toast({
        title: "Burn Shares Failed",
        description: errorMsg,
        variant: "destructive",
      });

      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, account, toast]);

  /**
   * Emergency withdraw from specific pool (admin only)
   */
  const emergencyWithdrawPool = useCallback(async (poolIndex: number): Promise<WithdrawResult> => {
    if (!isConnected || !address || !account) {
      const errorMsg = 'Wallet not connected or account not available';
      setError(errorMsg);
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet",
        variant: "destructive",
      });
      return { success: false, error: errorMsg };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use same RPC as useVesuVault (Alchemy v0_9) for consistency
      const provider = new RpcProvider({ 
        nodeUrl: 'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_9/c0P2DVGVr0OOBtgc3tSqm'
      });

      console.log('Emergency withdraw from pool index:', poolIndex);

      // Use contract.invoke for proper parameter serialization
      const contractInstance = new Contract(LOCK_TO_EARN_BOND_ABI, LOCK_TO_EARN_BOND_ADDRESS, account);
      const withdrawResult = await contractInstance.invoke('emergency_withdraw_pool', [poolIndex]);

      console.log('Emergency withdraw pool transaction:', withdrawResult.transaction_hash);

      // Wait for transaction
      await provider.waitForTransaction(withdrawResult.transaction_hash, {
        retryInterval: 2000
      });

      toast({
        title: "Emergency Withdraw Successful!",
        description: `Successfully withdrew funds from pool ${poolIndex}`,
      });

      return {
        txHash: withdrawResult.transaction_hash,
        success: true
      };

    } catch (err) {
      console.error('Emergency withdraw pool error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMsg);
      
      toast({
        title: "Emergency Withdraw Failed",
        description: errorMsg,
        variant: "destructive",
      });

      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, account, toast]);

  /**
   * Emergency transfer asset from contract to receiver (emergency actor only)
   * Transfers assets (WBTC) from the contract to a receiver address after emergency withdraw.
   */
  const emergencyTransferAsset = useCallback(async (
    receiver: string,
    amount?: string // Optional: if not provided, transfers all balance
  ): Promise<WithdrawResult> => {
    if (!isConnected || !address || !account) {
      const errorMsg = 'Wallet not connected or account not available';
      setError(errorMsg);
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet",
        variant: "destructive",
      });
      return { success: false, error: errorMsg };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use same RPC as useVesuVault (Alchemy v0_9) for consistency
      const provider = new RpcProvider({ 
        nodeUrl: 'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_9/c0P2DVGVr0OOBtgc3tSqm'
      });

      // Get asset address
      const assetAddress = await getAssetAddress();
      console.log('Asset address:', assetAddress);

      // Get contract balance
      const assetContract = new Contract(ERC20_ABI, assetAddress, provider);
      const balanceResult = await assetContract.call('balanceOf', [LOCK_TO_EARN_BOND_ADDRESS], { blockIdentifier: 'latest' });
      
      console.log('Raw balance result in emergencyTransferAsset:', balanceResult);
      console.log('Balance result type:', typeof balanceResult);
      
      // Parse balance - same logic as getContractAssetBalance
      let contractBalance = BigInt(0);
      if (balanceResult) {
        // Check if it's already a bigint
        if (typeof balanceResult === 'bigint') {
          contractBalance = balanceResult;
          console.log('Balance is bigint:', contractBalance.toString());
        }
        // Check if it's an object with balance property (like { balance: bigint } or { balance: { low, high } })
        else if (typeof balanceResult === 'object' && 'balance' in balanceResult) {
          const balanceObj = (balanceResult as any).balance;
          // If balance is a bigint directly
          if (typeof balanceObj === 'bigint') {
            contractBalance = balanceObj;
            console.log('Balance from balance property (bigint):', contractBalance.toString());
          }
          // If balance is an object with low/high
          else if (balanceObj && typeof balanceObj === 'object' && 'low' in balanceObj) {
            const low = typeof balanceObj.low === 'string' ? BigInt(balanceObj.low) : BigInt(balanceObj.low || 0);
            const high = typeof balanceObj.high === 'string' ? BigInt(balanceObj.high || '0') : BigInt(balanceObj.high || 0);
            contractBalance = (high << BigInt(128)) + low;
            console.log('Balance from balance.low/high:', contractBalance.toString());
          }
          // If balance is a number or string
          else if (typeof balanceObj === 'number' || typeof balanceObj === 'string') {
            contractBalance = BigInt(balanceObj);
            console.log('Balance from balance property (number/string):', contractBalance.toString());
          }
        }
        // Check if it's an object with low/high directly
        else if (typeof balanceResult === 'object' && 'low' in balanceResult) {
          const balanceU256 = balanceResult as { low: bigint | string; high: bigint | string };
          const low = typeof balanceU256.low === 'string' ? BigInt(balanceU256.low) : balanceU256.low;
          const high = typeof balanceU256.high === 'string' ? BigInt(balanceU256.high || '0') : (balanceU256.high || BigInt(0));
          contractBalance = (high << BigInt(128)) + low;
          console.log('Balance from low/high:', contractBalance.toString());
        }
        // Check if it's a string
        else if (typeof balanceResult === 'string') {
          contractBalance = BigInt(balanceResult);
          console.log('Balance is string:', contractBalance.toString());
        }
        // Check if it's an object with remaining property
        else if (typeof balanceResult === 'object' && 'remaining' in balanceResult) {
          const remaining = (balanceResult as any).remaining;
          if (remaining && typeof remaining === 'object' && 'low' in remaining) {
            const low = typeof remaining.low === 'string' ? BigInt(remaining.low) : BigInt(remaining.low || 0);
            const high = typeof remaining.high === 'string' ? BigInt(remaining.high || '0') : BigInt(remaining.high || 0);
            contractBalance = (high << BigInt(128)) + low;
            console.log('Balance from remaining.low/high:', contractBalance.toString());
          }
        }
      }

      console.log('Final contract balance (wei) in emergencyTransferAsset:', contractBalance.toString());

      if (contractBalance === BigInt(0)) {
        throw new Error('Contract has no balance to transfer');
      }

      // Determine amount to transfer
      let amountToTransfer = contractBalance;
      if (amount) {
        const decimals = 8; // WBTC has 8 decimals
        amountToTransfer = parseAmountToWei(amount, decimals);
        if (amountToTransfer > contractBalance) {
          throw new Error(`Requested amount (${amount}) exceeds contract balance`);
        }
      }

      console.log('Emergency transferring', amountToTransfer.toString(), 'from contract to', receiver);

      // Use contract.invoke to call emergency_transfer_asset
      const contractInstance = new Contract(LOCK_TO_EARN_BOND_ABI, LOCK_TO_EARN_BOND_ADDRESS, account);
      
      // Convert amount to u256 format [low, high]
      const amountLow = amountToTransfer & ((BigInt(1) << BigInt(128)) - BigInt(1));
      const amountHigh = amountToTransfer >> BigInt(128);

      const transferResult = await contractInstance.invoke('emergency_transfer_asset', [
        receiver,
        { low: amountLow, high: amountHigh }
      ]);

      console.log('Emergency transfer transaction:', transferResult.transaction_hash);

      // Wait for transaction
      await provider.waitForTransaction(transferResult.transaction_hash, {
        retryInterval: 2000
      });

      toast({
        title: "Transfer Successful!",
        description: `Successfully transferred ${amount ? amount : 'all'} WBTC from contract to ${receiver.slice(0, 10)}...`,
      });

      return {
        txHash: transferResult.transaction_hash,
        success: true
      };

    } catch (err) {
      console.error('Emergency transfer asset error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMsg);
      
      toast({
        title: "Transfer Failed",
        description: errorMsg,
        variant: "destructive",
      });

      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, account, toast, getAssetAddress]);

  /**
   * Transfer asset balance from contract to receiver (admin only)
   * After emergency_withdraw, the funds are in the contract. This function transfers them out.
   * @deprecated Use emergencyTransferAsset instead
   */
  const transferAssetFromContract = useCallback(async (
    receiver: string,
    amount?: string // Optional: if not provided, transfers all balance
  ): Promise<WithdrawResult> => {
    if (!isConnected || !address || !account) {
      const errorMsg = 'Wallet not connected or account not available';
      setError(errorMsg);
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet",
        variant: "destructive",
      });
      return { success: false, error: errorMsg };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use same RPC as useVesuVault (Alchemy v0_9) for consistency
      const provider = new RpcProvider({ 
        nodeUrl: 'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_9/c0P2DVGVr0OOBtgc3tSqm'
      });

      // Get asset address
      const assetAddress = await getAssetAddress();
      console.log('Asset address:', assetAddress);

      // Get contract balance
      const assetContract = new Contract(ERC20_ABI, assetAddress, provider);
      const balanceResult = await assetContract.call('balanceOf', [LOCK_TO_EARN_BOND_ADDRESS], { blockIdentifier: 'latest' });
      
      console.log('Raw balance result in transferAssetFromContract:', balanceResult);
      console.log('Balance result type:', typeof balanceResult);
      
      // Parse balance - same logic as getContractAssetBalance
      let contractBalance = BigInt(0);
      if (balanceResult) {
        // Check if it's already a bigint
        if (typeof balanceResult === 'bigint') {
          contractBalance = balanceResult;
          console.log('Balance is bigint:', contractBalance.toString());
        }
        // Check if it's an object with balance property (like { balance: bigint } or { balance: { low, high } })
        else if (typeof balanceResult === 'object' && 'balance' in balanceResult) {
          const balanceObj = (balanceResult as any).balance;
          // If balance is a bigint directly
          if (typeof balanceObj === 'bigint') {
            contractBalance = balanceObj;
            console.log('Balance from balance property (bigint):', contractBalance.toString());
          }
          // If balance is an object with low/high
          else if (balanceObj && typeof balanceObj === 'object' && 'low' in balanceObj) {
            const low = typeof balanceObj.low === 'string' ? BigInt(balanceObj.low) : BigInt(balanceObj.low || 0);
            const high = typeof balanceObj.high === 'string' ? BigInt(balanceObj.high || '0') : BigInt(balanceObj.high || 0);
            contractBalance = (high << BigInt(128)) + low;
            console.log('Balance from balance.low/high:', contractBalance.toString());
          }
          // If balance is a number or string
          else if (typeof balanceObj === 'number' || typeof balanceObj === 'string') {
            contractBalance = BigInt(balanceObj);
            console.log('Balance from balance property (number/string):', contractBalance.toString());
          }
        }
        // Check if it's an object with low/high directly
        else if (typeof balanceResult === 'object' && 'low' in balanceResult) {
          const balanceU256 = balanceResult as { low: bigint | string; high: bigint | string };
          const low = typeof balanceU256.low === 'string' ? BigInt(balanceU256.low) : balanceU256.low;
          const high = typeof balanceU256.high === 'string' ? BigInt(balanceU256.high || '0') : (balanceU256.high || BigInt(0));
          contractBalance = (high << BigInt(128)) + low;
          console.log('Balance from low/high:', contractBalance.toString());
        }
        // Check if it's a string
        else if (typeof balanceResult === 'string') {
          contractBalance = BigInt(balanceResult);
          console.log('Balance is string:', contractBalance.toString());
        }
        // Check if it's an object with remaining property
        else if (typeof balanceResult === 'object' && 'remaining' in balanceResult) {
          const remaining = (balanceResult as any).remaining;
          if (remaining && typeof remaining === 'object' && 'low' in remaining) {
            const low = typeof remaining.low === 'string' ? BigInt(remaining.low) : BigInt(remaining.low || 0);
            const high = typeof remaining.high === 'string' ? BigInt(remaining.high || '0') : BigInt(remaining.high || 0);
            contractBalance = (high << BigInt(128)) + low;
            console.log('Balance from remaining.low/high:', contractBalance.toString());
          }
        }
      }

      console.log('Final contract balance (wei) in transferAssetFromContract:', contractBalance.toString());

      if (contractBalance === BigInt(0)) {
        throw new Error('Contract has no balance to transfer');
      }

      // Determine amount to transfer
      let amountToTransfer = contractBalance;
      if (amount) {
        const decimals = 8; // WBTC has 8 decimals
        amountToTransfer = parseAmountToWei(amount, decimals);
        if (amountToTransfer > contractBalance) {
          throw new Error(`Requested amount (${amount}) exceeds contract balance`);
        }
      }

      console.log('Transferring', amountToTransfer.toString(), 'from contract to', receiver);
      
      // Check if contract gave us allowance to transfer on its behalf
      const assetContractForCall = new Contract(ERC20_ABI, assetAddress, account);
      const allowanceResult = await assetContractForCall.call('allowance', [LOCK_TO_EARN_BOND_ADDRESS, account.address], { blockIdentifier: 'latest' });
      
      let allowance = BigInt(0);
      if (allowanceResult) {
        if (typeof allowanceResult === 'object' && 'low' in allowanceResult) {
          const allowanceU256 = allowanceResult as { low: bigint | string; high: bigint | string };
          const low = typeof allowanceU256.low === 'string' ? BigInt(allowanceU256.low) : allowanceU256.low;
          const high = typeof allowanceU256.high === 'string' ? BigInt(allowanceU256.high || '0') : (allowanceU256.high || BigInt(0));
          allowance = (high << BigInt(128)) + low;
        } else if (typeof allowanceResult === 'bigint') {
          allowance = allowanceResult;
        } else if (typeof allowanceResult === 'string') {
          allowance = BigInt(allowanceResult);
        }
      }

      console.log('Contract allowance to us:', allowance.toString());

      // If we have allowance, use transferFrom
      if (allowance >= amountToTransfer) {
        console.log('Using transferFrom with allowance');
        assetContractForCall.connect(account);
        const transferResult = await account.execute({
          contractAddress: assetAddress,
          entrypoint: 'transferFrom',
          calldata: CallData.compile([
            LOCK_TO_EARN_BOND_ADDRESS, // from: contract address
            receiver, // to: receiver
            { low: amountToTransfer, high: BigInt(0) } // amount: u256
          ])
        });

        await provider.waitForTransaction(transferResult.transaction_hash, {
          retryInterval: 2000
        });

        toast({
          title: "Transfer Successful!",
          description: `Successfully transferred ${amount ? amount : 'all'} WBTC from contract to ${receiver}`,
        });

        return {
          txHash: transferResult.transaction_hash,
          success: true
        };
      } else {
        // No allowance - the contract needs to have a function to transfer assets out
        throw new Error(`Contract has not given allowance to transfer. Balance in contract: ${contractBalance.toString()}. The contract needs a function to transfer assets out after emergency withdraw, or it needs to approve an address first.`);
      }

    } catch (err) {
      console.error('Transfer asset from contract error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMsg);
      
      toast({
        title: "Transfer Failed",
        description: errorMsg,
        variant: "destructive",
      });

      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, account, toast, getAssetAddress]);

  /**
   * Get total assets from the contract (total value locked)
   */
  const getTotalAssets = useCallback(async (): Promise<bigint | null> => {
    try {
      // Use same RPC as useVesuVault (Alchemy v0_9) for consistency
      const provider = new RpcProvider({ 
        nodeUrl: 'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_9/c0P2DVGVr0OOBtgc3tSqm'
      });

      const contract = new Contract(LOCK_TO_EARN_BOND_ABI, LOCK_TO_EARN_BOND_ADDRESS, provider);
      const result = await contract.call('total_assets', [], { blockIdentifier: 'latest' });
      
      // Parse result - can be u256, bigint, or array
      if (typeof result === 'bigint') {
        return result;
      } else if (result && typeof result === 'object') {
        if ('low' in result && 'high' in result) {
          const low = BigInt(result.low || 0);
          const high = BigInt(result.high || 0);
          return low + (high << BigInt(128));
        } else if (Array.isArray(result) && result.length >= 2) {
          const low = BigInt(result[0] || 0);
          const high = BigInt(result[1] || 0);
          return low + (high << BigInt(128));
        }
      }
      
      return null;
    } catch (err) {
      console.error('Error getting total assets:', err);
      return null;
    }
  }, []);

  /**
   * Get contract asset balance (balance of WBTC in the contract)
   */
  const getContractAssetBalance = useCallback(async (): Promise<string> => {
    try {
      // Use same RPC as useVesuVault (Alchemy v0_9) for consistency
      const provider = new RpcProvider({ 
        nodeUrl: 'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_9/c0P2DVGVr0OOBtgc3tSqm'
      });

      // Get asset address
      const assetAddress = await getAssetAddress();
      console.log('Getting contract balance for asset:', assetAddress);
      console.log('Contract address:', LOCK_TO_EARN_BOND_ADDRESS);
      
      // Get contract balance
      const assetContract = new Contract(ERC20_ABI, assetAddress, provider);
      const balanceResult = await assetContract.call('balanceOf', [LOCK_TO_EARN_BOND_ADDRESS], { blockIdentifier: 'latest' });
      
      console.log('Raw balance result:', balanceResult);
      console.log('Balance result type:', typeof balanceResult);
      
      // Parse balance - try different formats
      let contractBalance = BigInt(0);
      if (balanceResult) {
        // Check if it's already a bigint
        if (typeof balanceResult === 'bigint') {
          contractBalance = balanceResult;
          console.log('Balance is bigint:', contractBalance.toString());
        }
        // Check if it's an object with balance property (like { balance: bigint } or { balance: { low, high } })
        else if (typeof balanceResult === 'object' && 'balance' in balanceResult) {
          const balanceObj = (balanceResult as any).balance;
          // If balance is a bigint directly
          if (typeof balanceObj === 'bigint') {
            contractBalance = balanceObj;
            console.log('Balance from balance property (bigint):', contractBalance.toString());
          }
          // If balance is an object with low/high
          else if (balanceObj && typeof balanceObj === 'object' && 'low' in balanceObj) {
            const low = typeof balanceObj.low === 'string' ? BigInt(balanceObj.low) : BigInt(balanceObj.low || 0);
            const high = typeof balanceObj.high === 'string' ? BigInt(balanceObj.high || '0') : BigInt(balanceObj.high || 0);
            contractBalance = (high << BigInt(128)) + low;
            console.log('Balance from balance.low/high:', contractBalance.toString());
          }
          // If balance is a number or string
          else if (typeof balanceObj === 'number' || typeof balanceObj === 'string') {
            contractBalance = BigInt(balanceObj);
            console.log('Balance from balance property (number/string):', contractBalance.toString());
          }
        }
        // Check if it's an object with low/high directly
        else if (typeof balanceResult === 'object' && 'low' in balanceResult) {
          const balanceU256 = balanceResult as { low: bigint | string; high: bigint | string };
          const low = typeof balanceU256.low === 'string' ? BigInt(balanceU256.low) : balanceU256.low;
          const high = typeof balanceU256.high === 'string' ? BigInt(balanceU256.high || '0') : (balanceU256.high || BigInt(0));
          contractBalance = (high << BigInt(128)) + low;
          console.log('Balance from low/high:', contractBalance.toString());
        }
        // Check if it's a string
        else if (typeof balanceResult === 'string') {
          contractBalance = BigInt(balanceResult);
          console.log('Balance is string:', contractBalance.toString());
        }
        // Check if it's an object with remaining property
        else if (typeof balanceResult === 'object' && 'remaining' in balanceResult) {
          const remaining = (balanceResult as any).remaining;
          if (remaining && typeof remaining === 'object' && 'low' in remaining) {
            const low = typeof remaining.low === 'string' ? BigInt(remaining.low) : BigInt(remaining.low || 0);
            const high = typeof remaining.high === 'string' ? BigInt(remaining.high || '0') : BigInt(remaining.high || 0);
            contractBalance = (high << BigInt(128)) + low;
            console.log('Balance from remaining.low/high:', contractBalance.toString());
          }
        }
        else {
          console.warn('Unknown balance result format:', balanceResult);
          // Try to convert to string and parse
          try {
            const balanceStr = JSON.stringify(balanceResult);
            console.log('Balance result as JSON:', balanceStr);
          } catch (e) {
            console.error('Error stringifying balance:', e);
          }
        }
      }

      console.log('Final contract balance (wei):', contractBalance.toString());

      // Convert to human readable format
      const decimals = 8; // WBTC has 8 decimals
      const formattedBalance = parseU256ToAmount({ low: contractBalance, high: BigInt(0) }, decimals);
      console.log('Formatted balance:', formattedBalance, 'WBTC');

      return formattedBalance;

    } catch (err) {
      console.error('Error getting contract asset balance:', err);
      return '0';
    }
  }, [getAssetAddress]);

  /**
   * Get user's actual shares balance (current balance, not locked_shares)
   */
  const getUserSharesBalance = useCallback(async (userAddress: string): Promise<string> => {
    try {
      // Use same RPC as useVesuVault (Alchemy v0_9) for consistency
      const provider = new RpcProvider({ 
        nodeUrl: 'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_9/c0P2DVGVr0OOBtgc3tSqm'
      });

      console.log('Getting user shares balance for:', userAddress);

      // Use contract's balanceOf function (ERC20)
      const contract = new Contract(LOCK_TO_EARN_BOND_ABI, LOCK_TO_EARN_BOND_ADDRESS, provider);
      const balanceResult = await contract.call('balanceOf', [userAddress], { blockIdentifier: 'latest' });
      
      console.log('Raw balanceOf result:', balanceResult);
      
      // Parse balance - same logic as other balance calls
      let sharesBalance = BigInt(0);
      if (balanceResult) {
        // Check if it's already a bigint
        if (typeof balanceResult === 'bigint') {
          sharesBalance = balanceResult;
          console.log('Balance is bigint:', sharesBalance.toString());
        }
        // Check if it's an object with balance property
        else if (typeof balanceResult === 'object' && 'balance' in balanceResult) {
          const balanceObj = (balanceResult as any).balance;
          if (typeof balanceObj === 'bigint') {
            sharesBalance = balanceObj;
            console.log('Balance from balance property (bigint):', sharesBalance.toString());
          }
          else if (balanceObj && typeof balanceObj === 'object' && 'low' in balanceObj) {
            const low = typeof balanceObj.low === 'string' ? BigInt(balanceObj.low) : BigInt(balanceObj.low || 0);
            const high = typeof balanceObj.high === 'string' ? BigInt(balanceObj.high || '0') : BigInt(balanceObj.high || 0);
            sharesBalance = (high << BigInt(128)) + low;
            console.log('Balance from balance.low/high:', sharesBalance.toString());
          }
        }
        // Check if it's an object with low/high directly
        else if (typeof balanceResult === 'object' && 'low' in balanceResult) {
          const balanceU256 = balanceResult as { low: bigint | string; high: bigint | string };
          const low = typeof balanceU256.low === 'string' ? BigInt(balanceU256.low) : balanceU256.low;
          const high = typeof balanceU256.high === 'string' ? BigInt(balanceU256.high || '0') : (balanceU256.high || BigInt(0));
          sharesBalance = (high << BigInt(128)) + low;
          console.log('Balance from low/high:', sharesBalance.toString());
        }
        else if (typeof balanceResult === 'string') {
          sharesBalance = BigInt(balanceResult);
          console.log('Balance is string:', sharesBalance.toString());
        }
      }

      // Convert to human readable format (shares don't have decimals, but we can show them)
      // For shares, we can format as a large number or use decimals for readability
      const formattedBalance = parseU256ToAmount({ low: sharesBalance, high: BigInt(0) }, 18);
      console.log('Formatted shares balance:', formattedBalance);

      return formattedBalance;

    } catch (err) {
      console.error('Error getting user shares balance:', err);
      return '0';
    }
  }, []);

  /**
   * Get allowed pools from contract
   */
  const getAllowedPools = useCallback(async (): Promise<Array<{
    pool_id: string;
    max_weight: number;
    v_token: string;
  }> | null> => {
    try {
      // Use same RPC as useVesuVault (Alchemy v0_9) for consistency
      const provider = new RpcProvider({ 
        nodeUrl: 'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_9/c0P2DVGVr0OOBtgc3tSqm'
      });

      const contract = new Contract(LOCK_TO_EARN_BOND_ABI, LOCK_TO_EARN_BOND_ADDRESS, provider);
      const result = await contract.call('get_allowed_pools', [], { blockIdentifier: 'latest' });

      console.log('Raw pools result:', result);
      console.log('Result type:', typeof result);
      console.log('Is array?', Array.isArray(result));
      console.log('Result length:', Array.isArray(result) ? result.length : 'N/A');
      if (result && typeof result === 'object') {
        console.log('Result keys:', Object.keys(result));
      }

      // Handle different response formats
      let poolsArray: any[] = [];
      
      if (Array.isArray(result)) {
        poolsArray = result;
      } else if (result && typeof result === 'object') {
        // Check if result has a length property (Cairo arrays sometimes have this)
        if ('length' in result && Array.isArray((result as any).length)) {
          poolsArray = (result as any).length;
        } else if ('result' in result && Array.isArray((result as any).result)) {
          poolsArray = (result as any).result;
        } else {
          // Try to extract array from object
          const entries = Object.entries(result);
          if (entries.length > 0) {
            // Check if it's an array-like object with numeric keys
            const numericKeys = entries.filter(([key]) => /^\d+$/.test(key));
            if (numericKeys.length > 0) {
              poolsArray = numericKeys.map(([, value]) => value);
            }
          }
        }
      }

      console.log('Extracted pools array:', poolsArray);
      console.log('Pools array length:', poolsArray.length);

      // Parse the pools array
      if (Array.isArray(poolsArray) && poolsArray.length > 0) {
        const parsedPools = poolsArray.map((pool: any, index: number) => {
          console.log(`Parsing pool ${index}:`, pool);
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
          
          const parsed = {
            pool_id: poolId,
            max_weight: maxWeight,
            v_token: vToken,
          };
          console.log(`Parsed pool ${index}:`, parsed);
          return parsed;
        });
        
        console.log('All parsed pools:', parsedPools);
        console.log('Total pools count:', parsedPools.length);
        return parsedPools;
      }
      
      console.warn('No pools found or invalid format');
      return [];
    } catch (err) {
      console.error('Failed to get allowed pools:', err);
      return null;
    }
  }, []);

  /**
   * Set allowed pools (only for governor)
   */
  const setAllowedPools = useCallback(async (
    params: SetAllowedPoolsParams
  ): Promise<SetPoolsResult> => {
    if (!isConnected || !address || !account) {
      const errorMsg = 'Wallet not connected or account not available';
      setError(errorMsg);
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet",
        variant: "destructive",
      });
      return { success: false, error: errorMsg };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use same RPC as useVesuVault (Alchemy v0_9) for consistency
      const provider = new RpcProvider({ 
        nodeUrl: 'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_9/c0P2DVGVr0OOBtgc3tSqm'
      });

      console.log('Received params.pools:', params.pools);
      console.log('Number of pools to set:', params.pools.length);

      // Build pools array for calldata
      // Ensure all fields are properly formatted
      const poolsArray = params.pools.map((pool, index) => {
        console.log(`Processing pool ${index}:`, pool);
        
        // Validate required fields
        if (!pool.pool_id || !pool.v_token) {
          throw new Error(`Pool ${index} is missing required fields (pool_id or v_token)`);
        }

        // Validate and format pool_id - must be a valid contract address
        let poolId = String(pool.pool_id).trim();
        if (!poolId.startsWith('0x')) {
          poolId = '0x' + poolId;
        }
        // Remove 0x prefix and pad to 66 characters (64 hex + 0x)
        if (poolId.length !== 66) {
          // Pad with zeros if needed
          const hexPart = poolId.replace('0x', '');
          poolId = '0x' + hexPart.padStart(64, '0');
        }
        
        // Ensure max_weight is a number (u32) - should be 0-10000 for basis points
        let maxWeight: number;
        const maxWeightValue = pool.max_weight as any;
        if (typeof maxWeightValue === 'string') {
          maxWeight = parseInt(maxWeightValue.trim(), 10);
        } else if (typeof maxWeightValue === 'number') {
          maxWeight = maxWeightValue;
        } else if (typeof maxWeightValue === 'bigint') {
          maxWeight = Number(maxWeightValue);
        } else {
          throw new Error(`Invalid max_weight type for pool ${poolId}: ${typeof maxWeightValue}`);
        }
        
        // Validate max_weight range
        if (isNaN(maxWeight) || maxWeight < 0 || maxWeight > 10000) {
          throw new Error(`Invalid max_weight for pool ${poolId}: must be between 0 and 10000 (basis points), got ${maxWeight}`);
        }
        
        // Validate and format v_token - must be a valid contract address
        let vToken = String(pool.v_token).trim();
        if (!vToken.startsWith('0x')) {
          vToken = '0x' + vToken;
        }
        // Remove 0x prefix and pad to 66 characters (64 hex + 0x)
        if (vToken.length !== 66) {
          // Pad with zeros if needed
          const hexPart = vToken.replace('0x', '');
          vToken = '0x' + hexPart.padStart(64, '0');
        }
        
        const formattedPool = {
          pool_id: poolId,
          max_weight: maxWeight,
          v_token: vToken
        };
        console.log(`Formatted pool ${index}:`, formattedPool);
        return formattedPool;
      });
      
      console.log('Final pools array to send:', poolsArray);
      console.log('Final pools count:', poolsArray.length);

      console.log('Setting allowed pools...');
      console.log('Pools array:', JSON.stringify(poolsArray, null, 2));
      
      // Use contract.invoke which handles serialization automatically
      const contractInstance = new Contract(LOCK_TO_EARN_BOND_ABI, LOCK_TO_EARN_BOND_ADDRESS, account);
      const setPoolsResult = await contractInstance.invoke('set_allowed_pools', [poolsArray]);

      console.log('Set pools transaction:', setPoolsResult.transaction_hash);

      // Wait for transaction
      await provider.waitForTransaction(setPoolsResult.transaction_hash, {
        retryInterval: 2000
      });

      toast({
        title: "Pools Updated!",
        description: `Successfully updated allowed pools`,
      });

      return {
        txHash: setPoolsResult.transaction_hash,
        success: true
      };

    } catch (err) {
      console.error('Set pools error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMsg);
      
      toast({
        title: "Update Failed",
        description: errorMsg,
        variant: "destructive",
      });

      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, account, toast]);

  /**
   * Get lock info for a user
   */
  const getLockInfo = useCallback(async (userAddress: string): Promise<{
    lockUntil: number;
    lockedShares: string;
  } | null> => {
    try {
      if (!userAddress) {
        console.error('Invalid user address provided to getLockInfo');
        return null;
      }

      // Validate address format (should start with 0x and be valid hex)
      if (!userAddress.startsWith('0x') || userAddress.length < 3) {
        console.error('Invalid address format:', userAddress);
        return null;
      }

      // Use same RPC as useVesuVault (Alchemy v0_9) for consistency
      const provider = new RpcProvider({ 
        nodeUrl: 'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_9/c0P2DVGVr0OOBtgc3tSqm'
      });

      console.log('Calling get_lock_info with:', {
        contractAddress: LOCK_TO_EARN_BOND_ADDRESS,
        userAddress,
        entrypoint: 'get_lock_info'
      });

      // Use provider.callContract directly as it's more reliable
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('get_lock_info timeout after 30s')), 30000)
      );

      const contract = new Contract(LOCK_TO_EARN_BOND_ABI, LOCK_TO_EARN_BOND_ADDRESS, provider);
      const callPromise = contract.call('get_lock_info', [userAddress], { blockIdentifier: 'latest' });

      const result = await Promise.race([callPromise, timeoutPromise]);

      console.log('Raw get_lock_info result:', result);
      console.log('Result type:', typeof result);
      console.log('Is array?', Array.isArray(result));
      if (result && typeof result === 'object') {
        console.log('Result keys:', Object.keys(result));
      }

      // contract.call returns the tuple directly
      // result is a tuple: (u64, u256)
      // Cairo tuples can be returned in different formats:
      // 1. Array: [u64, { low: u128, high: u128 }]
      // 2. Object with numeric keys: { 0: u64, 1: { low: u128, high: u128 } }
      // 3. Direct tuple object
      let lockUntil = 0;
      let lockedShares = '0';

      let lockUntilValue: any = null;
      let sharesU256: any = null;

      // Handle different tuple formats
      if (Array.isArray(result) && result.length >= 2) {
        lockUntilValue = result[0];
        sharesU256 = result[1];
      } else if (result && typeof result === 'object') {
        // Try object format with numeric keys
        const resultAny = result as any;
        if ('0' in resultAny && '1' in resultAny) {
          lockUntilValue = resultAny[0];
          sharesU256 = resultAny[1];
        } else if ('lockUntil' in resultAny || 'lockedShares' in resultAny) {
          // Named tuple format (unlikely but possible)
          lockUntilValue = resultAny.lockUntil || resultAny.lock_until || resultAny[0];
          sharesU256 = resultAny.lockedShares || resultAny.locked_shares || resultAny[1];
        } else {
          // Try to get first two properties
          const entries = Object.entries(result);
          if (entries.length >= 2) {
            lockUntilValue = entries[0][1];
            sharesU256 = entries[1][1];
          }
        }
      }

      console.log('Parsed lockUntilValue:', lockUntilValue, typeof lockUntilValue);
      console.log('Parsed sharesU256:', sharesU256, typeof sharesU256);

      // Parse lockUntil (u64)
      if (lockUntilValue !== null && lockUntilValue !== undefined) {
        lockUntil = typeof lockUntilValue === 'bigint' 
          ? Number(lockUntilValue) 
          : typeof lockUntilValue === 'number'
          ? lockUntilValue
          : Number(lockUntilValue || 0);
      }
      
      // Parse lockedShares (u256)
      if (sharesU256 !== null && sharesU256 !== undefined) {
        if (typeof sharesU256 === 'object') {
          if ('low' in sharesU256 && 'high' in sharesU256) {
            lockedShares = parseU256ToAmount(sharesU256 as { low: bigint; high: bigint });
          } else if (Array.isArray(sharesU256) && sharesU256.length >= 2) {
            // Sometimes u256 is returned as [low, high]
            lockedShares = parseU256ToAmount({ 
              low: BigInt(sharesU256[0] || 0), 
              high: BigInt(sharesU256[1] || 0) 
            });
          } else {
            const sharesU256Any = sharesU256 as any;
            if ('0' in sharesU256Any && '1' in sharesU256Any) {
              // Object with numeric keys: { 0: low, 1: high }
              lockedShares = parseU256ToAmount({ 
                low: BigInt(sharesU256Any[0] || 0), 
                high: BigInt(sharesU256Any[1] || 0) 
              });
            }
          }
        } else if (typeof sharesU256 === 'bigint') {
          // If it's already a bigint, convert it
          const divisor = BigInt(10 ** 8);
          lockedShares = (Number(sharesU256) / Number(divisor)).toString();
        } else if (typeof sharesU256 === 'string') {
          lockedShares = sharesU256;
        }
      }

      console.log('get_lock_info parsed:', { lockUntil, lockedShares });

      return {
        lockUntil,
        lockedShares
      };
    } catch (err) {
      console.error('Error getting lock info:', err);
      // If it's a network error, log more details
      if (err instanceof Error) {
        console.error('Error details:', {
          message: err.message,
          name: err.name,
          stack: err.stack
        });
      }
      // Return null instead of throwing to prevent UI crashes
      return null;
    }
  }, []);

  /**
   * Check if user can withdraw
   */
  const canWithdraw = useCallback(async (userAddress: string): Promise<boolean> => {
    try {
      if (!userAddress) {
        console.error('Invalid user address provided to canWithdraw');
        return false;
      }

      // Use same RPC as useVesuVault (Alchemy v0_9) for consistency
      const provider = new RpcProvider({ 
        nodeUrl: 'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_9/c0P2DVGVr0OOBtgc3tSqm'
      });

      // Use contract.call with blockIdentifier
      const contract = new Contract(LOCK_TO_EARN_BOND_ABI, LOCK_TO_EARN_BOND_ADDRESS, provider);
      const result = await contract.call('can_withdraw', [userAddress], { blockIdentifier: 'latest' });
      
      // contract.call returns the value directly
      // result is a boolean enum: True or False
      const resultAny = result as any;
      if (resultAny === true || resultAny === 'True' || resultAny === 1) {
        return true;
      } else if (typeof resultAny === 'object' && resultAny !== null) {
        if ('variant' in resultAny) {
          return resultAny.variant === 'True';
        }
        // Sometimes enum is returned as { type: 'True' } or similar
        if (resultAny.type === 'True' || (Array.isArray(resultAny) && resultAny[0] === 'True')) {
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error('Error checking if can withdraw:', err);
      return false;
    }
  }, []);

  /**
   * Get max withdraw amount for a user
   */
  const getMaxWithdraw = useCallback(async (ownerAddress: string): Promise<string> => {
    try {
      if (!ownerAddress) {
        console.error('Invalid owner address provided to getMaxWithdraw');
        return '0';
      }

      // Use same RPC as useVesuVault (Alchemy v0_9) for consistency
      const provider = new RpcProvider({ 
        nodeUrl: 'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_9/c0P2DVGVr0OOBtgc3tSqm'
      });

      // Use contract.call with blockIdentifier
      const contract = new Contract(LOCK_TO_EARN_BOND_ABI, LOCK_TO_EARN_BOND_ADDRESS, provider);
      const result = await contract.call('max_withdraw', [ownerAddress], { blockIdentifier: 'latest' });
      
      // contract.call returns the value directly
      // result is u256: { low: u128, high: u128 } or [low, high]
      if (result && typeof result === 'object') {
        if ('low' in result && 'high' in result) {
          return parseU256ToAmount(result as { low: bigint; high: bigint }, 8);
        } else if (Array.isArray(result) && result.length >= 2) {
          return parseU256ToAmount({ 
            low: BigInt(result[0] || 0), 
            high: BigInt(result[1] || 0) 
          }, 8);
        }
      }
      return '0';
    } catch (err) {
      console.error('Error getting max withdraw:', err);
      return '0';
    }
  }, []);

  /**
   * Get minimum lock period in seconds
   */
  const getMinLockPeriod = useCallback(async (): Promise<number | null> => {
    try {
      const provider = new RpcProvider({ 
        nodeUrl: 'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_9/c0P2DVGVr0OOBtgc3tSqm'
      });

      const contract = new Contract(LOCK_TO_EARN_BOND_ABI, LOCK_TO_EARN_BOND_ADDRESS, provider);
      const result = await contract.call('get_min_lock_period', [], { blockIdentifier: 'latest' });
      
      if (result !== null && result !== undefined) {
        const period = typeof result === 'bigint' ? Number(result) : Number(result);
        return period;
      }
      return null;
    } catch (err) {
      console.error('Error getting min lock period:', err);
      return null;
    }
  }, []);

  /**
   * Get maximum lock period in seconds
   */
  const getMaxLockPeriod = useCallback(async (): Promise<number | null> => {
    try {
      const provider = new RpcProvider({ 
        nodeUrl: 'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_9/c0P2DVGVr0OOBtgc3tSqm'
      });

      const contract = new Contract(LOCK_TO_EARN_BOND_ABI, LOCK_TO_EARN_BOND_ADDRESS, provider);
      const result = await contract.call('get_max_lock_period', [], { blockIdentifier: 'latest' });
      
      if (result !== null && result !== undefined) {
        const period = typeof result === 'bigint' ? Number(result) : Number(result);
        return period;
      }
      return null;
    } catch (err) {
      console.error('Error getting max lock period:', err);
      return null;
    }
  }, []);

  /**
   * Get yield/APY for a specific pool using Vesu API
   */
  const getPoolYield = useCallback(async (poolAddress: string): Promise<number | null> => {
    try {
      const pools = await getVesuPools();
      const poolAddressLower = poolAddress.toLowerCase();
      
      // Find the pool by ID (pool ID matches the pool contract address)
      const pool = pools.find((p: VesuPool) => {
        if (p.id) {
          const poolIdLower = p.id.toLowerCase();
          return poolIdLower === poolAddressLower;
        }
        if (p.address) {
          const poolApiAddress = p.address.toLowerCase();
          return poolApiAddress === poolAddressLower;
        }
        return false;
      });
      
      if (!pool) {
        console.warn(`[getPoolYield] Pool not found: ${poolAddress}`);
        return null;
      }
      
      // Get the bond's asset address
      const provider = new RpcProvider({ 
        nodeUrl: 'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_9/c0P2DVGVr0OOBtgc3tSqm'
      });
      const contract = new Contract(LOCK_TO_EARN_BOND_ABI, LOCK_TO_EARN_BOND_ADDRESS, provider);
      const asset = await contract.call('asset', [], { blockIdentifier: 'latest' });
      const assetBigInt = BigInt(asset.toString());
      const assetAddressHex = `0x${assetBigInt.toString(16).padStart(64, '0')}`;
      const assetAddress = assetAddressHex.toLowerCase();
      
      // Find the specific asset in the pool that matches the bond's asset (WBTC)
      const wbtcSymbols = ['WBTC', 'wBTC', 'WBTC.E', 'wbtc', 'BTC'];
      const normalizeAddress = (addr: string): string => {
        if (!addr) return '';
        let normalized = addr.toLowerCase();
        if (normalized.startsWith('0x')) {
          normalized = normalized.slice(2);
        }
        normalized = normalized.padStart(64, '0');
        return normalized;
      };
      
      const normalizedVaultAsset = normalizeAddress(assetAddress);
      let assetMatch = pool.assets.find((a: ProcessedAsset) => {
        if (!a.address) return false;
        const poolAssetAddressLower = a.address.toLowerCase();
        const normalizedPoolAsset = normalizeAddress(poolAssetAddressLower);
        return normalizedPoolAsset === normalizedVaultAsset || 
               poolAssetAddressLower === assetAddress;
      });
      
      if (!assetMatch) {
        assetMatch = pool.assets.find((a: ProcessedAsset) => {
          if (!a.symbol) return false;
          return wbtcSymbols.includes(a.symbol.toUpperCase());
        });
      }
      
      if (!assetMatch) {
        console.warn(`[getPoolYield] Asset not found in pool ${pool.name}`);
        return null;
      }
      
      // Calculate total APY (lending + rewards)
      const lendingApy = assetMatch.apy || 0;
      const rewardsApy = assetMatch.defiSpringApy || 0;
      const totalApy = lendingApy + rewardsApy;
      
      console.log(`[getPoolYield] Pool ${pool.name}, Asset ${assetMatch.symbol}: ${totalApy}% (Lending: ${lendingApy}%, Rewards: ${rewardsApy}%)`);
      return totalApy;
    } catch (err) {
      console.error(`[getPoolYield] Error getting yield for pool ${poolAddress}:`, err);
      return null;
    }
  }, []);

  /**
   * Get average/max APY from all pools
   */
  const getAveragePoolApy = useCallback(async (): Promise<number | null> => {
    try {
      const pools = await getAllowedPools();
      if (!pools || pools.length === 0) {
        return null;
      }
      
      const yields = await Promise.all(
        pools.map(pool => getPoolYield(pool.pool_id))
      );
      
      const validYields = yields.filter((y): y is number => 
        typeof y === 'number' && y !== null && !isNaN(y) && y > 0
      );
      
      if (validYields.length === 0) {
        return null;
      }
      
      // Calculate average APY
      const sum = validYields.reduce((acc, apy) => acc + apy, 0);
      const average = sum / validYields.length;
      
      console.log(`[getAveragePoolApy] Pools: ${pools.length}, Valid yields: ${validYields.length}, Average APY: ${average}%`);
      return average;
    } catch (err) {
      console.error('Error getting average pool APY:', err);
      return null;
    }
  }, [getAllowedPools, getPoolYield]);

  return {
    depositWithCustomLock,
    depositLocked,
    withdraw,
    emergencyWithdraw,
    emergencyWithdrawPool,
    emergencyWithdrawUser,
    emergencyBurnShares,
    emergencyTransferAsset,
    transferAssetFromContract,
    getContractAssetBalance,
    getTotalAssets,
    getMinLockPeriod,
    getMaxLockPeriod,
    getPoolYield,
    getAveragePoolApy,
    getAllowedPools,
    setAllowedPools,
    getLockInfo,
    canWithdraw,
    getMaxWithdraw,
    getAssetAddress,
    getUserSharesBalance,
    isLoading,
    error
  };
}

