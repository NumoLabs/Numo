import { useState, useCallback } from 'react';
import { useAccount } from '@starknet-react/core';
import { RpcProvider } from 'starknet';
import { useToast } from '@/hooks/use-toast';
import { getVesuConfig } from '@/lib/vesu-config';
import { parseVesuAmount } from '@/lib/utils';
import { vesuTransactionFlow } from '@/lib/vesu-real-implementation';

export function useVesuTransactions() {
  const { address, account } = useAccount();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');

  const vesuConfig = getVesuConfig();

  const depositToVesu = useCallback(async (
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
    setCurrentStep('Preparing transaction...');

    try {
      // MAINNET ONLY: Always use mainnet RPC
      const provider = new RpcProvider({ 
        nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7'
      });

      // Step 1: Approve token spending
      setCurrentStep('Approving token spending...');
      toast({
        title: "Step 1: Approve Token",
        description: "Please approve the token spending in your wallet",
      });

      // Use real Vesu transaction flow
      setCurrentStep('Starting Vesu deposit transaction...');
      
      const result = await vesuTransactionFlow.deposit(
        poolId,
        assetAddress,
        amount,
        decimals,
        address,
        account,
        provider,
        vTokenAddress
      );
      
      setCurrentStep('Transaction completed successfully!');
      
      toast({
        title: "Deposit Successful!",
        description: `Successfully deposited to Vesu pool. Transaction: ${result.depositTx.slice(0, 10)}...`,
      });
      
      return {
        success: true,
        transactionHash: result.depositTx,
        approvalHash: result.approvalTx
      };

    } catch (error: any) {
      console.error('Vesu deposit error:', error);
      
      // Extract meaningful error message
      let errorMessage = "An error occurred during the transaction";
      
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
        title: "Transaction Failed",
        description: errorMessage,
        variant: "destructive",
      });

      setCurrentStep('Transaction failed');
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
      setCurrentStep('');
    }
  }, [account, address, vesuConfig, toast]);

  const withdrawFromVesu = useCallback(async (
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
    setCurrentStep('Preparing withdrawal...');

    try {
      // MAINNET ONLY: Always use mainnet RPC
      const provider = new RpcProvider({ 
        nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7'
      });

      // For withdrawal, we use negative collateral_delta
      setCurrentStep('Withdrawing from Vesu pool...');
      toast({
        title: "Withdrawing from Pool",
        description: "Please confirm the withdrawal transaction in your wallet",
      });

      // Use real Vesu withdrawal flow
      setCurrentStep('Starting Vesu withdrawal transaction...');
      
      const result = await vesuTransactionFlow.withdraw(
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
        throw new Error('Withdrawal transaction failed');
      }

      toast({
        title: "Withdrawal Successful!",
        description: `Successfully withdrew from Vesu pool. Transaction: ${result.withdrawalTx.slice(0, 10)}...`,
      });

      setCurrentStep('Withdrawal completed successfully!');
      
      return {
        success: true,
        transactionHash: result.withdrawalTx
      };

    } catch (error: any) {
      console.error('Vesu withdrawal error:', error);
      
      // Extract meaningful error message
      let errorMessage = "An error occurred during the withdrawal";
      
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
        title: "Withdrawal Failed",
        description: errorMessage,
        variant: "destructive",
      });

      setCurrentStep('Withdrawal failed');
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
      setCurrentStep('');
    }
  }, [account, address, vesuConfig, toast]);

  const getVTokenBalance = useCallback(async (vTokenAddress: string) => {
    if (!address) {
      console.warn('⚠️ No wallet address available for vToken balance check');
      return { shares: "0", assets: "0" };
    }

    if (!vTokenAddress) {
      console.error('❌ No vToken address provided for balance check');
      return { shares: "0", assets: "0" };
    }

    try {
      // MAINNET ONLY: Always use mainnet RPC
      const provider = new RpcProvider({ 
        nodeUrl: process.env.NEXT_PUBLIC_STARKNET_RPC_URL || 
          'https://starknet-mainnet.public.blastapi.io/rpc/v0_7'
      });

      return await vesuTransactionFlow.getVTokenBalance(vTokenAddress, address, provider);
    } catch (error) {
      console.error('❌ Error getting vToken balance:', error);
      console.error('❌ Error details:', {
        vTokenAddress,
        address,
        error: (error as any)?.message || error
      });
      return { shares: "0", assets: "0" };
    }
  }, [address]);

  return {
    depositToVesu,
    withdrawFromVesu,
    getVTokenBalance,
    isLoading,
    currentStep,
    isConnected: !!address && !!account
  };
}
