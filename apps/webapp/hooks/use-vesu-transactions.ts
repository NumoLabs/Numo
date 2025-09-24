import { useState, useCallback } from 'react';
import { useAccount } from '@starknet-react/core';
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

  // For now, we'll use a simplified approach without contract instances
  // In a real implementation, you would use proper contract instances

  const depositToVesu = useCallback(async (
    poolId: string,
    assetAddress: string,
    amount: number,
    decimals: number
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
      // Convert amount to proper format
      const amountInWei = parseVesuAmount(amount, decimals);
      
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
        address
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
      
      toast({
        title: "Transaction Failed",
        description: error.message || "An error occurred during the transaction",
        variant: "destructive",
      });

      setCurrentStep('Transaction failed');
      
      return {
        success: false,
        error: error.message || "Transaction failed"
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
    decimals: number
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
      // Convert amount to proper format
      const amountInWei = parseVesuAmount(amount, decimals);
      
      // For withdrawal, we use negative collateral_delta
      setCurrentStep('Withdrawing from Vesu pool...');
      toast({
        title: "Withdrawing from Pool",
        description: "Please confirm the withdrawal transaction in your wallet",
      });

      // Find asset index
      const assetIndex = 0; // This should be determined dynamically

      const withdrawCall = {
        contractAddress: vesuConfig.singletonAddress,
        entrypoint: "modify_position",
        calldata: [
          poolId, // pool_id
          assetIndex, // asset_index
          amountInWei, // collateral_delta (negative for withdrawal)
          0, // collateral_delta high part
          0, // debt_delta (0 for withdrawal)
          0  // debt_delta high part
        ]
      };

      // Use real Vesu withdrawal flow
      setCurrentStep('Starting Vesu withdrawal transaction...');
      
      const result = await vesuTransactionFlow.withdraw(
        poolId,
        assetAddress,
        amount,
        decimals,
        address
      );
      
      const withdrawResult = {
        transaction_hash: result.withdrawalTx
      };

      if (!withdrawResult.transaction_hash) {
        throw new Error('Withdrawal transaction failed');
      }

      toast({
        title: "Withdrawal Successful!",
        description: `Successfully withdrew from Vesu pool. Transaction: ${withdrawResult.transaction_hash.slice(0, 10)}...`,
      });

      setCurrentStep('Withdrawal completed successfully!');
      
      return {
        success: true,
        transactionHash: withdrawResult.transaction_hash
      };

    } catch (error: any) {
      console.error('Vesu withdrawal error:', error);
      
      toast({
        title: "Withdrawal Failed",
        description: error.message || "An error occurred during the withdrawal",
        variant: "destructive",
      });

      setCurrentStep('Withdrawal failed');
      
      return {
        success: false,
        error: error.message || "Withdrawal failed"
      };
    } finally {
      setIsLoading(false);
      setCurrentStep('');
    }
  }, [account, address, vesuConfig, toast]);

  return {
    depositToVesu,
    withdrawFromVesu,
    isLoading,
    currentStep,
    isConnected: !!address && !!account
  };
}
