// Vesu V2 Transactions Hook
import { useState, useCallback } from 'react';
import { useAccount } from '@starknet-react/core';
import { RpcProvider } from 'starknet';
import { useToast } from '@/hooks/use-toast';
import { getVesuV2Config } from '@/lib/vesu-config';
import { parseVesuAmount } from '@/lib/utils';
import { vesuV2TransactionFlow } from '@/lib/vesu-real-implementation';

export function useVesuV2Transactions() {
  const { address, account } = useAccount();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');

  const vesuV2Config = getVesuV2Config();

  const depositToVesuV2 = useCallback(async (
    poolId: string,
    assetAddress: string,
    amount: number,
    decimals: number,
    vTokenAddress: string
  ) => {
    if (!account || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to continue",
        variant: "destructive",
      });
      return { success: false, error: "Wallet not connected" };
    }

    // Validate account before proceeding
    console.log('🔍 Pre-deposit validation:', {
      hasAccount: !!account,
      hasAddress: !!address,
      accountType: account?.constructor?.name,
      hasExecute: typeof account?.execute === 'function',
      accountMethods: account ? Object.keys(account).slice(0, 10) : []
    });

    if (typeof account?.execute !== 'function') {
      const errorMsg = 'Account does not have execute method. Please reconnect your wallet.';
      console.error('❌', errorMsg, { account });
      toast({
        title: "Wallet Error",
        description: errorMsg,
        variant: "destructive",
      });
      return { success: false, error: errorMsg };
    }

    setIsLoading(true);
    setCurrentStep('Preparing V2 transaction...');

    try {
      // MAINNET ONLY: Always use mainnet RPC
      const provider = new RpcProvider({ 
        nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7'
      });

      // Step 1: Approve token spending
      setCurrentStep('Approving token spending for V2...');
      toast({
        title: "Step 1: Approve Token (V2)",
        description: "Please approve the token spending in your wallet",
      });

      // Use Vesu V2 transaction flow
      setCurrentStep('Starting Vesu V2 deposit transaction...');
      
      console.log('🚀 Calling vesuV2TransactionFlow.deposit with:', {
        poolId,
        assetAddress,
        amount,
        decimals,
        address,
        hasAccount: !!account,
        accountAddress: account?.address,
        accountProvider: account?.provider ? 'has provider' : 'no provider',
        vTokenAddress
      });
      
      // Verify account is ready before calling deposit
      if (!account) {
        throw new Error('Account is null or undefined');
      }
      
      if (typeof account.execute !== 'function') {
        throw new Error(`Account.execute is not a function. Account type: ${account.constructor?.name}`);
      }
      
      const result = await vesuV2TransactionFlow.deposit(
        poolId,
        assetAddress,
        amount,
        decimals,
        address,
        account,
        provider,
        vTokenAddress
      );
      
      setCurrentStep('V2 Transaction completed successfully!');
      
      toast({
        title: "V2 Deposit Successful!",
        description: `Successfully deposited to Vesu V2 pool. Transaction: ${result.depositTx.slice(0, 10)}...`,
      });
      
      return {
        success: true,
        transactionHash: result.depositTx,
        approvalHash: result.approvalTx
      };

    } catch (error: any) {
      console.error('❌ Vesu V2 deposit error:', error);
      console.error('❌ Error details:', {
        errorMessage: error?.message,
        errorType: error?.constructor?.name,
        errorStack: error?.stack,
        errorCode: error?.code,
        errorName: error?.name,
        hasAccount: !!account,
        hasAddress: !!address,
        poolId,
        assetAddress,
        amount
      });
      
      // Extract meaningful error message
      let errorMessage = "An error occurred during the V2 transaction";
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.reason) {
        errorMessage = error.reason;
      } else if (error?.details) {
        errorMessage = error.details;
      }
      
      // Check if it's a wallet connection issue
      if (errorMessage.includes('not connected') || errorMessage.includes('Account is not available')) {
        errorMessage = "Please connect your wallet to continue";
      }
      
      toast({
        title: "V2 Transaction Failed",
        description: errorMessage,
        variant: "destructive",
      });

      setCurrentStep('V2 Transaction failed');
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
      setCurrentStep('');
    }
  }, [account, address, vesuV2Config, toast]);

  const withdrawFromVesuV2 = useCallback(async (
    poolId: string,
    assetAddress: string,
    amount: number,
    decimals: number,
    vTokenAddress: string
  ) => {
    if (!account || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to continue",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setCurrentStep('Preparing V2 withdrawal...');

    try {
      // MAINNET ONLY: Always use mainnet RPC
      const provider = new RpcProvider({ 
        nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7'
      });

      // For withdrawal, we use negative collateral_delta
      setCurrentStep('Withdrawing from Vesu V2 pool...');
      toast({
        title: "Withdrawing from V2 Pool",
        description: "Please confirm the withdrawal transaction in your wallet",
      });

      // Use Vesu V2 withdrawal flow
      setCurrentStep('Starting Vesu V2 withdrawal transaction...');
      
      const result = await vesuV2TransactionFlow.withdraw(
        poolId,
        assetAddress,
        amount,
        decimals,
        address,
        account,
        provider,
        vTokenAddress
      );

      if (!result.withdrawalTx) {
        throw new Error('V2 Withdrawal transaction failed');
      }

      toast({
        title: "V2 Withdrawal Successful!",
        description: `Successfully withdrew from Vesu V2 pool. Transaction: ${result.withdrawalTx.slice(0, 10)}...`,
      });

      setCurrentStep('V2 Withdrawal completed successfully!');
      
      return {
        success: true,
        transactionHash: result.withdrawalTx
      };

    } catch (error: any) {
      console.error('Vesu V2 withdrawal error:', error);
      
      // Extract meaningful error message
      let errorMessage = "An error occurred during the V2 withdrawal";
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.reason) {
        errorMessage = error.reason;
      } else if (error?.details) {
        errorMessage = error.details;
      }
      
      toast({
        title: "V2 Withdrawal Failed",
        description: errorMessage,
        variant: "destructive",
      });

      setCurrentStep('V2 Withdrawal failed');
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
      setCurrentStep('');
    }
  }, [account, address, vesuV2Config, toast]);

  const getVTokenV2Balance = useCallback(async (vTokenAddress: string) => {
    if (!address) {
      console.warn('⚠️ No wallet address available for V2 vToken balance check');
      return { shares: "0", assets: "0" };
    }

    if (!vTokenAddress) {
      console.error('❌ No vToken address provided for V2 balance check');
      return { shares: "0", assets: "0" };
    }

    try {
      // MAINNET ONLY: Always use mainnet RPC
      const provider = new RpcProvider({ 
        nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7'
      });

      return await vesuV2TransactionFlow.getVTokenBalance(vTokenAddress, address, provider);
    } catch (error) {
      console.error('❌ Error getting V2 vToken balance:', error);
      console.error('❌ Error details:', {
        vTokenAddress,
        address,
        error: (error as any)?.message || error
      });
      return { shares: "0", assets: "0" };
    }
  }, [address]);

  return {
    depositToVesuV2,
    withdrawFromVesuV2,
    getVTokenV2Balance,
    isLoading,
    currentStep,
    isConnected: !!address && !!account
  };
}
