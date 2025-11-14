'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useAccount } from '@starknet-react/core';
import { useVesuVault } from '@/hooks/use-vesu-vault';
import { vaultQueryKeys } from '@/hooks/use-vault-queries';
import { 
  depositFormSchema, 
  withdrawFormSchema,
  type DepositFormValues,
  type WithdrawFormValues
} from '@/lib/schemas/vault-schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2, CheckCircle, AlertCircle, ArrowDownCircle, ArrowUpCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function DepositWithdrawForm() {
  const queryClient = useQueryClient();
  const { address } = useAccount();
  const { toast } = useToast();
  const { 
    deposit, 
    withdraw,
    wbtcBalance, 
    getUserPosition,
    isPending, 
    isSuccess, 
    error, 
    isConnected 
  } = useVesuVault();

  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [userPosition, setUserPosition] = useState<{
    assets: bigint;
    formatted: string;
  } | null>(null);

  const depositForm = useForm<DepositFormValues>({
    resolver: zodResolver(depositFormSchema),
    defaultValues: {
      amount: '',
    },
    mode: 'onChange',
  });

  const withdrawForm = useForm<WithdrawFormValues>({
    resolver: zodResolver(withdrawFormSchema),
    defaultValues: {
      amount: '',
    },
    mode: 'onChange',
  });

  // Load user position when component mounts or user changes
  useEffect(() => {
    const loadUserPosition = async () => {
      if (isConnected && address) {
        try {
          const position = await getUserPosition();
          if (position) {
            setUserPosition({
              assets: position.assets,
              formatted: position.formatted,
            });
          } else {
            setUserPosition(null);
          }
        } catch (err) {
          console.warn('Failed to load user position:', err);
          setUserPosition(null);
        }
      } else {
        setUserPosition(null);
      }
    };

    loadUserPosition();
  }, [isConnected, address, getUserPosition]);

  const onDepositSubmit = async (data: DepositFormValues) => {
    if (!isConnected) {
      depositForm.setError('root', {
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
      
      // Reload user position
      const position = await getUserPosition();
      if (position) {
        setUserPosition({
          assets: position.assets,
          formatted: position.formatted,
        });
      }
      
      // Reset form after successful deposit
      depositForm.reset();
      
      // Show success toast
      toast({
        title: 'Deposit successful',
        description: `Successfully deposited ${data.amount} wBTC`,
        variant: 'default',
      });
    } catch (err) {
      console.error('Deposit failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Deposit failed. Please try again.';
      
      // Set form error
      depositForm.setError('root', {
        message: errorMessage,
      });
      
      // Show error toast
      toast({
        title: 'Deposit failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const onWithdrawSubmit = async (data: WithdrawFormValues) => {
    if (!isConnected) {
      withdrawForm.setError('root', {
        message: 'Please connect your wallet first',
      });
      return;
    }

    // Check if user has sufficient balance
    if (userPosition) {
      const withdrawAmount = parseFloat(data.amount);
      const userBalance = parseFloat(userPosition.formatted);
      
      if (withdrawAmount > userBalance) {
        withdrawForm.setError('amount', {
          message: `Insufficient balance. You have ${userPosition.formatted} wBTC.`,
        });
        return;
      }
    }

    try {
      const txHash = await withdraw(data.amount);
      
      // Only proceed with success handling if we got a transaction hash
      // This ensures we don't show success if the transaction was cancelled
      if (!txHash) {
        return;
      }
      
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: vaultQueryKeys.all });
      if (address) {
        queryClient.invalidateQueries({ queryKey: vaultQueryKeys.userPosition(address) });
      }
      
      // Reload user position
      const position = await getUserPosition();
      if (position) {
        setUserPosition({
          assets: position.assets,
          formatted: position.formatted,
        });
      }
      
      // Reset form after successful withdraw
      withdrawForm.reset();
      
      // Show success toast only if we have a transaction hash
      toast({
        title: 'Withdraw successful',
        description: `Successfully withdrew ${data.amount} wBTC`,
        variant: 'default',
      });
    } catch (err) {
      console.error('Withdraw failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Withdraw failed. Please try again.';
      
      // Set form error
      withdrawForm.setError('root', {
        message: errorMessage,
      });
      
      // Show error toast
      toast({
        title: 'Withdraw failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };


  const formatWbtcBalance = (balance: bigint | null | undefined) => {
    if (!balance) return '0.00';
    return (Number(balance) / 1e8).toFixed(8);
  };

  // Set max amount from balance
  const setMaxDepositAmount = () => {
    if (wbtcBalance) {
      const maxAmount = formatWbtcBalance(wbtcBalance);
      depositForm.setValue('amount', maxAmount, { shouldValidate: true });
    }
  };

  const setMaxWithdrawAmount = () => {
    if (userPosition) {
      withdrawForm.setValue('amount', userPosition.formatted, { shouldValidate: true });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Glassmorphism background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-bitcoin-orange/5 via-transparent to-bitcoin-gold/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
      
      <CardHeader className="relative z-10 border-b border-white/10">
        <CardTitle className="text-white flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
            <ArrowUpCircle className="h-4 w-4 text-bitcoin-gold" />
          </div>
          Deposit & Withdraw
        </CardTitle>
        <CardDescription className="text-gray-400">
          Deposit wBTC to earn yield or withdraw your position from the vault
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
        {/* Wallet Connection Alert */}
        {!isConnected && (
          <Alert className="bg-orange-500/10 backdrop-blur-xl border-orange-500/30">
            <AlertCircle className="h-4 w-4 text-orange-400" />
            <AlertDescription className="text-orange-200">
              Please connect your StarkNet wallet to deposit or withdraw.
            </AlertDescription>
          </Alert>
        )}

        {/* Tabs - Glassmorphism */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'deposit' | 'withdraw')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-1 mt-2">
            <TabsTrigger 
              value="deposit" 
              className="flex items-center gap-2 data-[state=active]:bg-white/10 data-[state=active]:backdrop-blur-sm data-[state=active]:text-bitcoin-gold data-[state=active]:border data-[state=active]:border-white/20"
            >
              <ArrowUpCircle className="h-4 w-4" />
              Deposit
            </TabsTrigger>
            <TabsTrigger 
              value="withdraw" 
              className="flex items-center gap-2 data-[state=active]:bg-white/10 data-[state=active]:backdrop-blur-sm data-[state=active]:text-bitcoin-gold data-[state=active]:border data-[state=active]:border-white/20"
            >
              <ArrowDownCircle className="h-4 w-4" />
              Withdraw
            </TabsTrigger>
          </TabsList>

          {/* Deposit Tab */}
          <TabsContent value="deposit" className="space-y-4">
            <Form {...depositForm}>
              <form onSubmit={depositForm.handleSubmit(onDepositSubmit)} className="space-y-4">
                {/* Available Balance Display */}
                {wbtcBalance && (
                  <div className="p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Available Balance:</span>
                      <span className="text-sm font-semibold text-bitcoin-gold">{formatWbtcBalance(wbtcBalance)} wBTC</span>
                    </div>
                  </div>
                )}
                
                <FormField
                  control={depositForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Amount (wBTC)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            step="0.000001"
                            min="0"
                            placeholder="0.001"
                            className="w-full pr-16 bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-500 focus:border-bitcoin-orange/50 focus:ring-2 focus:ring-bitcoin-orange/20"
                            {...field}
                          />
                          {wbtcBalance && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-3 text-xs bg-white/10 hover:bg-white/20 border border-white/20 rounded"
                              onClick={setMaxDepositAmount}
                            >
                              MAX
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription className="text-gray-500">
                        Minimum deposit: 0.000001 wBTC
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {depositForm.formState.errors.root && (
                  <Alert className="bg-red-500/10 backdrop-blur-xl border-red-500/30">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-200">
                      {depositForm.formState.errors.root.message}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-bitcoin-orange/80 to-bitcoin-gold/80 hover:from-bitcoin-orange hover:to-bitcoin-gold text-white border border-bitcoin-orange/30 backdrop-blur-sm shadow-lg"
                  disabled={!isConnected || isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Depositing...
                    </>
                  ) : (
                    <>
                      <ArrowUpCircle className="mr-2 h-4 w-4" />
                      Deposit wBTC
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>

          {/* Withdraw Tab */}
          <TabsContent value="withdraw" className="space-y-4">
            {/* Contract Info - Glassmorphism - Only shown in Withdraw tab */}
            <div className="text-sm text-gray-300 space-y-2 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg">
              {userPosition && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Your Vault Position:</span>
                  <span className="font-semibold text-bitcoin-orange">{userPosition.formatted} wBTC</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-gray-400">Wallet:</span>
                <span className={`font-semibold ${isConnected ? 'text-green-400' : 'text-gray-500'}`}>
                  {isConnected ? 'Connected' : 'Not connected'}
                </span>
              </div>
            </div>

            {!userPosition || Number(userPosition.formatted) === 0 ? (
              <Alert className="bg-white/5 backdrop-blur-xl border-white/10">
                <Info className="h-4 w-4 text-bitcoin-orange" />
                <AlertDescription className="text-gray-300">
                  You don&apos;t have any position in this vault. Make a deposit first to start earning yield.
                </AlertDescription>
              </Alert>
            ) : (
              <Form {...withdrawForm}>
                <form onSubmit={withdrawForm.handleSubmit(onWithdrawSubmit)} className="space-y-4">
                  {/* Available Balance Display */}
                  
                  <FormField
                    control={withdrawForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Amount (wBTC)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              step="0.000001"
                              min="0"
                              max={userPosition.formatted}
                              placeholder="0.001"
                              className="w-full pr-16 bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-500 focus:border-bitcoin-orange/50 focus:ring-2 focus:ring-bitcoin-orange/20"
                              {...field}
                            />
                            {userPosition && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-3 text-xs bg-white/10 hover:bg-white/20 border border-white/20 rounded"
                                onClick={setMaxWithdrawAmount}
                              >
                                MAX
                              </Button>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription className="text-gray-500">
                          Available: {userPosition.formatted} wBTC | Minimum: 0.000001 wBTC
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {withdrawForm.formState.errors.root && (
                    <Alert className="bg-red-500/10 backdrop-blur-xl border-red-500/30">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <AlertDescription className="text-red-200">
                        {withdrawForm.formState.errors.root.message}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-500/80 to-orange-500/80 hover:from-red-500 hover:to-orange-500 text-white border border-red-500/30 backdrop-blur-sm shadow-lg"
                    disabled={!isConnected || isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Withdrawing...
                      </>
                    ) : (
                      <>
                        <ArrowDownCircle className="mr-2 h-4 w-4" />
                        Withdraw wBTC
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </TabsContent>
        </Tabs>

        {/* Status Messages */}
        {isSuccess && !error && !isPending && (
          <Alert className="bg-green-500/10 backdrop-blur-xl border-green-500/30">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-200">
              {activeTab === 'deposit' 
                ? 'Deposit successful! Your wBTC has been deposited to the Vesu Vault.'
                : 'Withdraw successful! Your wBTC has been withdrawn from the Vesu Vault.'}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="bg-red-500/10 backdrop-blur-xl border-red-500/30">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">
              {activeTab === 'deposit' ? 'Deposit' : 'Withdraw'} failed: {error}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

