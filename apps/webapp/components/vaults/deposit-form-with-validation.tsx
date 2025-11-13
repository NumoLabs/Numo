'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useAccount } from '@starknet-react/core';
import { useVesuVault } from '@/hooks/use-vesu-vault';
import { vaultQueryKeys } from '@/hooks/use-vault-queries';
import { depositFormSchema, type DepositFormValues } from '@/lib/schemas/vault-schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export function VesuVaultDepositForm() {
  const queryClient = useQueryClient();
  const { address } = useAccount();
  const { deposit, totalAssets, wbtcBalance, isPending, isSuccess, error, contractAddress, isConnected } = useVesuVault();

  const form = useForm<DepositFormValues>({
    resolver: zodResolver(depositFormSchema),
    defaultValues: {
      amount: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: DepositFormValues) => {
    if (!isConnected) {
      form.setError('root', {
        message: 'Please connect your wallet first',
      });
      return;
    }

    try {
      await deposit(data.amount);
      
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: vaultQueryKeys.all });
      if (address) {
        queryClient.invalidateQueries({ queryKey: vaultQueryKeys.userPosition(address) });
      }
      
      // Reset form after successful deposit
      form.reset();
    } catch (err) {
      console.error('Deposit failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Deposit failed. Please try again.';
      form.setError('root', {
        message: errorMessage,
      });
    }
  };

  const formatTotalAssets = (assets: bigint | null | undefined) => {
    if (!assets) return '0.00';
    return (Number(assets) / 1e8).toFixed(4);
  };

  const formatWbtcBalance = (balance: bigint | null | undefined) => {
    if (!balance) return '0.00';
    return (Number(balance) / 1e8).toFixed(8);
  };

  // Set max amount from balance
  const setMaxAmount = () => {
    if (wbtcBalance) {
      const maxAmount = formatWbtcBalance(wbtcBalance);
      form.setValue('amount', maxAmount, { shouldValidate: true });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Deposit to Vesu Vault</CardTitle>
        <CardDescription>
          Deposit wBTC to earn yield through Vesu V2
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contract Info */}
        <div className="text-sm text-muted-foreground space-y-1">
          <p><strong>Contract:</strong> {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}</p>
          <p><strong>Total Assets:</strong> {formatTotalAssets(totalAssets)} wBTC</p>
          <p><strong>Your wBTC Balance:</strong> {formatWbtcBalance(wbtcBalance)} wBTC</p>
          <p><strong>Wallet:</strong> {isConnected ? 'Connected' : 'Not connected'}</p>
        </div>

        {/* Wallet Connection Alert */}
        {!isConnected && (
          <Alert className="border-orange-500/50 bg-orange-500/10">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <AlertDescription className="text-orange-200">
              Please connect your StarkNet wallet using the button above to make a deposit.
            </AlertDescription>
          </Alert>
        )}

        {/* Deposit Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (wBTC)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        step="0.000001"
                        min="0"
                        placeholder="0.001"
                        className="w-full pr-16"
                        {...field}
                      />
                      {wbtcBalance && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs"
                          onClick={setMaxAmount}
                        >
                          MAX
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Minimum deposit: 0.000001 wBTC
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={!isConnected || isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Depositing...
                </>
              ) : (
                'Deposit wBTC'
              )}
            </Button>
          </form>
        </Form>

        {/* Status Messages */}
        {isSuccess && (
          <Alert className="border-green-500/50 bg-green-500/10">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-200">
              Deposit successful! Your wBTC has been deposited to the Vesu Vault.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Deposit failed: {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Instructions */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Make sure you have wBTC in your wallet</p>
          <p>• Approval and deposit will be executed in a single transaction</p>
          <p>• The vault will automatically manage your position in Vesu V2</p>
          <p>• You&apos;ll receive vault tokens representing your share</p>
        </div>
      </CardContent>
    </Card>
  );
}

