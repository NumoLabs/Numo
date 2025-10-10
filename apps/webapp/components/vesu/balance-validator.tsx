"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  Wallet,
  Shield,
  Coins
} from 'lucide-react';
import { useAccount } from '@starknet-react/core';
import { RpcProvider } from 'starknet';
import { isTestnet } from '@/lib/utils';

interface BalanceValidatorProps {
  assetAddress: string;
  vTokenAddress: string;
  amount: number;
  decimals: number;
  onValidationComplete: (isValid: boolean, details: ValidationDetails) => void;
}

interface ValidationDetails {
  userBalance: string;
  requiredAmount: string;
  currentAllowance: string;
  needsApproval: boolean;
  isValid: boolean;
  error?: string;
}

export function BalanceValidator({ 
  assetAddress, 
  vTokenAddress, 
  amount, 
  decimals, 
  onValidationComplete 
}: BalanceValidatorProps) {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const [validationDetails, setValidationDetails] = useState<ValidationDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address || !assetAddress || !vTokenAddress || amount <= 0) {
      setIsLoading(false);
      return;
    }

    validateBalance();
  }, [address, assetAddress, vTokenAddress, amount, decimals]);

  const validateBalance = async () => {
    if (!address) return;

    setIsLoading(true);
    setError(null);

    try {
      const provider = new RpcProvider({ 
        nodeUrl: isTestnet() 
          ? 'https://starknet-sepolia.public.blastapi.io/rpc/v0_7'
          : 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7'
      });

      // Convert amount to wei
      const amountInWei = (amount * Math.pow(10, decimals)).toString();
      
      // Check user's token balance
      const balanceResult = await provider.callContract({
        contractAddress: assetAddress,
        entrypoint: 'balanceOf',
        calldata: [address]
      });
      
      const userBalance = balanceResult.result[0];
      
      // Check current allowance
      const allowanceResult = await provider.callContract({
        contractAddress: assetAddress,
        entrypoint: 'allowance',
        calldata: [address, vTokenAddress]
      });
      
      const currentAllowance = allowanceResult.result[0];
      const needsApproval = BigInt(currentAllowance) < BigInt(amountInWei);
      const isValid = BigInt(userBalance) >= BigInt(amountInWei);

      const details: ValidationDetails = {
        userBalance,
        requiredAmount: amountInWei,
        currentAllowance,
        needsApproval,
        isValid
      };

      setValidationDetails(details);
      onValidationComplete(isValid, details);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Validation failed';
      setError(errorMessage);
      
      const details: ValidationDetails = {
        userBalance: '0',
        requiredAmount: '0',
        currentAllowance: '0',
        needsApproval: true,
        isValid: false,
        error: errorMessage
      };
      
      setValidationDetails(details);
      onValidationComplete(false, details);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (amount: string, decimals: number) => {
    const num = BigInt(amount);
    const divisor = BigInt(Math.pow(10, decimals));
    const whole = num / divisor;
    const remainder = num % divisor;
    
    if (remainder === BigInt(0)) {
      return whole.toString();
    }
    
    const remainderStr = remainder.toString().padStart(decimals, '0');
    const trimmed = remainderStr.replace(/0+$/, '');
    
    if (trimmed === '') {
      return whole.toString();
    }
    
    return `${whole}.${trimmed}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <div>
              <h3 className="font-medium">Validating Balance</h3>
              <p className="text-sm text-muted-foreground">
                Checking your token balance and allowance...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Validation Error:</strong> {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!validationDetails) {
    return null;
  }

  const { userBalance, requiredAmount, currentAllowance, needsApproval, isValid } = validationDetails;

  return (
    <div className="space-y-4">
      {/* Balance Status */}
      <Card className={isValid ? "border-green-200 dark:border-green-800" : "border-red-200 dark:border-red-800"}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            {isValid ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            Balance Validation
          </CardTitle>
          <CardDescription>
            {isValid ? "Your balance is sufficient for this transaction" : "Insufficient balance for this transaction"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Balance Details */}
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Your Balance</span>
              </div>
              <Badge variant="outline" className="font-mono">
                {formatAmount(userBalance, decimals)}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Required Amount</span>
              </div>
              <Badge variant="outline" className="font-mono">
                {formatAmount(requiredAmount, decimals)}
              </Badge>
            </div>
          </div>

          {/* Allowance Status */}
          <div className="border-t pt-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Allowance Status</span>
              </div>
              <Badge variant={needsApproval ? "destructive" : "default"}>
                {needsApproval ? "Needs Approval" : "Sufficient"}
              </Badge>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Current allowance: {formatAmount(currentAllowance, decimals)}
            </div>
          </div>

          {/* Action Required */}
          {!isValid && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You don't have enough tokens to complete this transaction. 
                Please add more tokens to your wallet or reduce the amount.
              </AlertDescription>
            </Alert>
          )}

          {isValid && needsApproval && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your balance is sufficient, but you'll need to approve the vToken contract 
                to spend your tokens before depositing.
              </AlertDescription>
            </Alert>
          )}

          {isValid && !needsApproval && (
            <Alert className="border-green-200 dark:border-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Everything looks good! You have sufficient balance and allowance to proceed.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={validateBalance}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Refresh Validation
        </Button>
      </div>
    </div>
  );
}
