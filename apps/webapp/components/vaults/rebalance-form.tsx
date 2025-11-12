'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useVesuVault, type PoolProps, WBTC_ADDRESS } from '@/hooks/use-vesu-vault';
import { type Action, Feature } from '@/types/VesuVault';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { AlertCircle, Loader2, ArrowRight, TrendingUp, ArrowDownUp, Coins, Sparkles, Zap, ArrowRightCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getVesuPools } from '@/app/api/vesuApi';
import type { VesuPool } from '@/types/VesuPools';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

// Schema for rebalance form
const rebalanceFormSchema = z.object({
  fromPool: z.string().min(1, 'Please select a source pool'),
  toPool: z.string().min(1, 'Please select a destination pool'),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      },
      {
        message: 'Amount must be greater than 0',
      }
    )
    .refine(
      (val) => {
        const num = parseFloat(val);
        return num >= 0.000001; // Minimum amount
      },
      {
        message: 'Minimum amount is 0.000001 wBTC',
      }
    ),
}).refine((data) => data.fromPool !== data.toPool, {
  message: 'Source and destination pools must be different',
  path: ['toPool'],
});

type RebalanceFormValues = z.infer<typeof rebalanceFormSchema>;

export function RebalanceForm() {
  const { 
    rebalance, 
    getAllowedPools, 
    isPending, 
    isConnected, 
    error,
    getPoolBalance,
    vaultData
  } = useVesuVault();
  const { toast } = useToast();
  
  const [pools, setPools] = useState<PoolProps[]>([]);
  const [isLoadingPools, setIsLoadingPools] = useState(false);
  const [poolBalances, setPoolBalances] = useState<Record<string, bigint>>({});
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [vesuPoolsData, setVesuPoolsData] = useState<VesuPool[] | null>(null);

  const form = useForm<RebalanceFormValues>({
    resolver: zodResolver(rebalanceFormSchema),
    defaultValues: {
      fromPool: '',
      toPool: '',
      amount: '',
    },
    mode: 'onChange',
  });

  const loadPoolBalances = useCallback(async (poolsToLoad: PoolProps[]) => {
    if (!poolsToLoad || poolsToLoad.length === 0) {
      console.log('[Rebalance] No pools to load balances for');
      return;
    }
    
    console.log('[Rebalance] ===== loadPoolBalances called =====');
    setIsLoadingBalances(true);
    const balances: Record<string, bigint> = {};
    
    try {
      // Load balances in parallel for all pools
      const balancePromises = poolsToLoad.map(async (pool) => {
        try {
          const normalizedPoolId = pool.pool_id.toLowerCase();
          console.log(`[Rebalance] Loading balance for pool ${normalizedPoolId}...`);
          
          const balance = await getPoolBalance(pool.v_token);
          balances[normalizedPoolId] = balance;
          
          console.log(`[Rebalance] Balance loaded for pool ${normalizedPoolId}:`, balance.toString());
        } catch (err) {
          console.error(`[Rebalance] Failed to load balance for pool ${pool.pool_id}:`, err);
          balances[pool.pool_id.toLowerCase()] = BigInt(0);
        }
      });
      
      await Promise.all(balancePromises);
      setPoolBalances(balances);
      console.log('[Rebalance] All balances loaded:', balances);
    } catch (err) {
      console.error('[Rebalance] Error loading pool balances:', err);
    } finally {
      setIsLoadingBalances(false);
    }
  }, [getPoolBalance]);

  // Load pools and balances on mount and when connected
  useEffect(() => {
    const loadPools = async () => {
      if (!isConnected) {
        setPools([]);
        setPoolBalances({});
        return;
      }
      
      setIsLoadingPools(true);
      try {
        // Load pools first
        const poolsData = await getAllowedPools();
        console.log('[Rebalance] Pools data loaded:', poolsData);
        
        if (poolsData && poolsData.length > 0) {
          setPools(poolsData);
          
          // Set default values
          if (poolsData.length >= 2) {
            form.setValue('fromPool', poolsData[0].pool_id);
            form.setValue('toPool', poolsData[1].pool_id);
          } else if (poolsData.length === 1) {
            form.setValue('fromPool', poolsData[0].pool_id);
          }
          
          await loadPoolBalances(poolsData);

          // Load Vesu pools data for names
          try {
            const vesuPools = await getVesuPools();
            setVesuPoolsData(vesuPools);
          } catch (err) {
            console.warn('[Rebalance] Failed to load Vesu pools data:', err);
          }
        } else {
          setPools([]);
          setPoolBalances({});
        }
      } catch (err) {
        console.error('[Rebalance] Failed to load pools:', err);
        toast({
          title: 'Error',
          description: 'Failed to load pools',
          variant: 'destructive',
        });
        setPools([]);
        setPoolBalances({});
      } finally {
        setIsLoadingPools(false);
      }
    };

    loadPools();
  }, [isConnected, getAllowedPools, getPoolBalance, form, toast, loadPoolBalances]);

  useEffect(() => {
    if (isConnected && pools && pools.length > 0 && vaultData) {
      console.log('[Rebalance] Vault data changed, reloading pool balances...');
      loadPoolBalances(pools);
    }
  }, [vaultData?.totalAssets?.toString(), isConnected, pools, getPoolBalance, loadPoolBalances]);

  // Get pool name from Vesu API
  const getPoolName = (poolId: string): string => {
    if (!vesuPoolsData) return `Pool ${poolId.slice(0, 8)}...`;
    const pool = vesuPoolsData.find((p) => p.id.toLowerCase() === poolId.toLowerCase());
    return pool?.name || `Pool ${poolId.slice(0, 8)}...`;
  };

  // Format balance (for display with 4 decimals)
  const formatBalance = (balance: bigint | undefined): string => {
    if (!balance) return '0.00';
    return (Number(balance) / 1e8).toFixed(4);
  };

  // Format balance with full precision (8 decimals for input)
  const formatBalanceFull = (balance: bigint | undefined): string => {
    if (!balance) return '0.00000000';
    return (Number(balance) / 1e8).toFixed(8);
  };

  // Set max amount from source pool balance
  const setMaxAmount = () => {
    const fromPoolValue = form.watch('fromPool');
    if (fromPoolValue) {
      // Normalize pool_id to lowercase for consistent key matching
      const normalizedPoolId = fromPoolValue.toLowerCase();
      const balance = poolBalances[normalizedPoolId];
      if (balance && balance > BigInt(0)) {
        // Use full precision (8 decimals) for the amount input
        const maxAmount = formatBalanceFull(balance);
        form.setValue('amount', maxAmount, { shouldValidate: true });
      }
    }
  };

  // Watch form values (hooks must be called before any conditional returns)
  const fromPool = form.watch('fromPool');
  const toPool = form.watch('toPool');
  const amount = form.watch('amount');
  const fromPoolBalance = fromPool ? poolBalances[fromPool.toLowerCase()] : undefined;
  const toPoolBalance = toPool ? poolBalances[toPool.toLowerCase()] : undefined;
  

  const onSubmit = async (data: RebalanceFormValues) => {
    if (!isConnected) {
      form.setError('root', {
        message: 'Please connect your wallet first',
      });
      return;
    }

    // Validate source pool has enough balance
    const normalizedFromPoolId = data.fromPool.toLowerCase();
    const fromPoolBalance = poolBalances[normalizedFromPoolId];
    if (!fromPoolBalance) {
      form.setError('fromPool', {
        message: 'Source pool not found',
      });
      return;
    }

    const amountFloat = parseFloat(data.amount);
    const amountStr = amountFloat.toFixed(8);
    const [integerPart, decimalPart = ''] = amountStr.split('.');
    const paddedDecimal = decimalPart.padEnd(8, '0').slice(0, 8);
    const fullAmountStr = integerPart + paddedDecimal;
    const amountInWei = BigInt(fullAmountStr);

    if (fromPoolBalance < amountInWei) {
      const availableAmount = formatBalance(fromPoolBalance);
      form.setError('amount', {
        message: `Insufficient balance. Available: ${availableAmount} wBTC`,
      });
      return;
    }

    try {
      // Create two actions: WITHDRAW from source, DEPOSIT to destination
      const serializedActions: Action[] = [
        {
          pool_id: data.fromPool,
          feature: Feature.WITHDRAW,
          token: WBTC_ADDRESS,
          amount: amountInWei.toString(),
        },
        {
          pool_id: data.toPool,
          feature: Feature.DEPOSIT,
          token: WBTC_ADDRESS,
          amount: amountInWei.toString(),
        },
      ];

      console.log('Rebalancing:', {
        from: getPoolName(data.fromPool),
        to: getPoolName(data.toPool),
        amount: data.amount,
        actions: serializedActions,
      });

      const txHash = await rebalance(serializedActions);

      toast({
        title: 'Success',
        description: `Rebalance transaction submitted: ${txHash.slice(0, 10)}...`,
      });

      // Reload pool balances after successful rebalance
      if (pools && pools.length > 0) {
        const balances: Record<string, bigint> = {};
        for (const pool of pools) {
          try {
            const balance = await getPoolBalance(pool.v_token);
            balances[pool.pool_id] = balance;
          } catch (err) {
            console.error(`Failed to reload balance for pool ${pool.pool_id}:`, err);
          }
        }
        setPoolBalances(balances);
      }

      // Reset form
      form.reset();
      // Reset to default values if pools are available
      if (pools.length >= 2) {
        form.setValue('fromPool', pools[0].pool_id);
        form.setValue('toPool', pools[1].pool_id);
      }
    } catch (err: any) {
      console.error('Rebalance failed:', err);
      const errorMessage = err?.message || 'Rebalance failed. Please try again.';
      form.setError('root', {
        message: errorMessage,
      });
    }
  };

  // Calculate preview values
  const amountFloat = amount ? parseFloat(amount) : 0;
  const isValidAmount = !isNaN(amountFloat) && amountFloat > 0 && fromPoolBalance && 
    (BigInt(Math.floor(amountFloat * 1e8)) <= fromPoolBalance);
  const previewFromBalance = fromPoolBalance && amountFloat > 0 
    ? formatBalance(fromPoolBalance - BigInt(Math.floor(amountFloat * 1e8)))
    : formatBalance(fromPoolBalance);
  const previewToBalance = toPoolBalance && amountFloat > 0
    ? formatBalance(toPoolBalance + BigInt(Math.floor(amountFloat * 1e8)))
    : formatBalance(toPoolBalance);

  if (!isConnected) {
    return (
      <Card className="border-2 border-gray-700/50 bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <ArrowDownUp className="h-5 w-5 text-bitcoin-orange" />
            Rebalance Vault
          </CardTitle>
          <CardDescription className="text-gray-400">
            Connect your wallet to rebalance the vault
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {isLoadingPools ? (
        <Card className="border-2 border-gray-700/50 bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm">
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-bitcoin-orange" />
              <span className="text-gray-400">Loading pools...</span>
            </div>
          </CardContent>
        </Card>
      ) : pools.length === 0 ? (
        <Alert className="border-orange-500/50 bg-orange-500/10">
          <AlertCircle className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-orange-200">
            No pools available. Please add pools first.
          </AlertDescription>
        </Alert>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Pool Selection Section */}
            <div className="relative">
              <div className="grid gap-6 lg:grid-cols-2 items-start">
                {/* Source Pool Card */}
                <FormField
                  control={form.control}
                  name="fromPool"
                  render={({ field }) => (
                    <FormItem>
                      <Card className="border-2 border-red-500/40 bg-gradient-to-br from-red-500/15 via-red-900/8 to-red-500/15 backdrop-blur-md hover:border-red-500/60 hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 relative overflow-hidden group">
                        {/* Animated glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <CardHeader className="pb-3 relative z-10">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-bold text-red-400 flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-red-500/20 border border-red-500/30">
                                <ArrowRight className="h-4 w-4 rotate-180" />
                              </div>
                              Source Pool
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4 relative z-10">
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isLoadingPools || isPending}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-gray-900/70 border-gray-700/70 text-white h-14 hover:border-red-500/50 focus:border-red-500/50 transition-colors text-base font-medium">
                                <SelectValue placeholder="Select source pool" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-900/95 border-gray-700 backdrop-blur-xl">
                              {pools.map((pool) => {
                                const poolName = getPoolName(pool.pool_id);
                                return (
                                  <SelectItem 
                                    key={pool.pool_id} 
                                    value={pool.pool_id}
                                    className="hover:bg-gray-800/80 text-white py-3"
                                  >
                                    <div className="flex items-center justify-between w-full gap-4">
                                      <div className="flex flex-col items-start">
                                        <span className="font-semibold text-left">{poolName}</span>
                                        <span className="text-xs text-gray-400 text-left">Pool ID: {pool.pool_id.slice(0, 8)}...</span>
                                      </div>
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          {field.value && (() => {
                            const normalizedPoolId = field.value.toLowerCase();
                            const balance = poolBalances[normalizedPoolId];
                            console.log(`[Rebalance] Source Pool Balance Lookup:`, {
                              fieldValue: field.value,
                              normalizedPoolId,
                              balance: balance?.toString(),
                              allBalances: Object.keys(poolBalances)
                            });
                            return (
                              <div className="space-y-2 pt-2 border-t">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm text-muted-foreground">Available Balance</p>
                                  <p className="font-semibold text-lg text-red-400">
                                    {balance !== undefined 
                                      ? `${(Number(balance) / 1e8).toFixed(8)} wBTC` 
                                      : isLoadingBalances 
                                        ? 'Loading...' 
                                        : '0.00000000 wBTC'}
                                  </p>
                                </div>
                                {isValidAmount && fromPoolBalance && (
                                  <div className="flex items-center justify-between text-sm pt-1 border-t border-red-500/20">
                                    <p className="text-muted-foreground">After transfer:</p>
                                    <p className="font-semibold text-red-300">{previewFromBalance} wBTC</p>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                          <FormMessage />
                        </CardContent>
                      </Card>
                    </FormItem>
                  )}
                />

                {/* Animated Arrow Connector */}
                <div className="hidden lg:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="p-4 rounded-full bg-gradient-to-br from-bitcoin-orange/30 to-bitcoin-gold/30 border-2 border-bitcoin-orange/40 shadow-xl backdrop-blur-md">
                    <ArrowRightCircle className="h-8 w-8 text-bitcoin-orange animate-pulse" />
                  </div>
                </div>

                {/* Destination Pool Card */}
                <FormField
                  control={form.control}
                  name="toPool"
                  render={({ field }) => (
                    <FormItem>
                      <Card className="border-2 border-green-500/40 bg-gradient-to-br from-green-500/15 via-green-900/8 to-green-500/15 backdrop-blur-md hover:border-green-500/60 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300 relative overflow-hidden group">
                        {/* Animated glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <CardHeader className="pb-3 relative z-10">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-bold text-green-400 flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-green-500/20 border border-green-500/30">
                                <ArrowRight className="h-4 w-4" />
                              </div>
                              Destination Pool
                            </CardTitle>

                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4 relative z-10">
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isLoadingPools || isPending}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-gray-900/70 border-gray-700/70 text-white h-14 hover:border-green-500/50 focus:border-green-500/50 transition-colors text-base font-medium">
                                <SelectValue placeholder="Select destination pool" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-900/95 border-gray-700 backdrop-blur-xl">
                              {pools.map((pool) => {
                                const poolName = getPoolName(pool.pool_id);
                                return (
                                  <SelectItem 
                                    key={pool.pool_id} 
                                    value={pool.pool_id}
                                    className="hover:bg-gray-800/80 text-white py-3"
                                  >
                                    <div className="flex items-center justify-between w-full gap-4">
                                      <div className="flex flex-col items-start">
                                        <span className="font-semibold text-left">{poolName}</span>
                                        <span className="text-xs text-gray-400 text-left">Pool ID: {pool.pool_id.slice(0, 8)}...</span>
                                      </div>
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          {field.value && (() => {
                            const normalizedPoolId = field.value.toLowerCase();
                            const balance = poolBalances[normalizedPoolId];
                            console.log(`[Rebalance] Destination Pool Balance Lookup:`, {
                              fieldValue: field.value,
                              normalizedPoolId,
                              balance: balance?.toString(),
                              allBalances: Object.keys(poolBalances)
                            });
                            return (
                              <div className="space-y-2 pt-2 border-t">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm text-muted-foreground">Current Balance</p>
                                  <p className="font-semibold text-lg text-green-400">
                                    {balance !== undefined 
                                      ? `${(Number(balance) / 1e8).toFixed(8)} wBTC` 
                                      : isLoadingBalances 
                                        ? 'Loading...' 
                                        : '0.00000000 wBTC'}
                                  </p>
                                </div>
                                {isValidAmount && toPoolBalance && (
                                  <div className="flex items-center justify-between text-sm pt-1 border-t border-green-500/20">
                                    <p className="text-muted-foreground">After transfer:</p>
                                    <p className="font-semibold text-green-300">{previewToBalance} wBTC</p>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                          <FormMessage />
                        </CardContent>
                      </Card>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Amount Section */}
            <Card className="relative overflow-hidden bg-gradient-to-r from-bitcoin-orange/10 to-bitcoin-orange/5 border-bitcoin-orange/30 hover:border-bitcoin-orange/50 hover:shadow-lg hover:shadow-bitcoin-orange/10 transition-all duration-300 group">
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-bitcoin-orange flex items-center gap-3">
                    <Coins className="h-5 w-5 text-bitcoin-orange" />
                    Transfer Amount
                  </CardTitle>
                  {isValidAmount && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-500">Valid</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative mt-5">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-3 z-10 pointer-events-none">
                            <Image src="/wbtc-icon.png" alt="wBTC" width={28} height={28} className="rounded-full" />
                            <span className="text-foreground font-semibold text-base">wBTC</span>
                          </div>
                          <Input
                            type="number"
                            step="0.000001"
                            min="0"
                            placeholder="0.00000000"
                            className="w-full pl-28 pr-20 h-14 bg-background border border-border text-foreground text-xl font-semibold focus:border-bitcoin-orange/50 focus:ring-2 focus:ring-bitcoin-orange/20 transition-all"
                            {...field}
                            disabled={!fromPoolBalance || isLoadingBalances}
                          />
                          {fromPoolBalance && fromPoolBalance > BigInt(0) && !isLoadingBalances && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 px-4 text-sm font-semibold bg-bitcoin-orange/10 hover:bg-bitcoin-orange/20 text-bitcoin-orange border border-bitcoin-orange/30 rounded-md transition-all"
                              onClick={setMaxAmount}
                            >
                              MAX
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <FormDescription className="text-muted-foreground text-xs">
                            <span className="font-semibold">Min:</span> 0.000001 wBTC
                          </FormDescription>
                          {fromPoolBalance && (
                            <FormDescription className="text-muted-foreground text-xs">
                              <span className="font-semibold">Max:</span> {formatBalanceFull(fromPoolBalance)} wBTC
                            </FormDescription>
                          )}
                        </div>
                        {amountFloat > 0 && fromPoolBalance && (
                          <div className="text-xs">
                            <span className="text-muted-foreground">Percentage: </span>
                            <span className="font-bold text-bitcoin-orange">
                              {((amountFloat / (Number(fromPoolBalance) / 1e8)) * 100).toFixed(2)}%
                            </span>
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Transaction Preview */}
            {fromPool && toPool && isValidAmount && (
              <Card className="relative overflow-hidden bg-gradient-to-r from-bitcoin-orange/10 to-bitcoin-orange/5 border-bitcoin-orange/30 hover:border-bitcoin-orange/50 hover:shadow-lg hover:shadow-bitcoin-orange/10 transition-all duration-300 group">
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <CardHeader className="pb-3 relative z-10">
                  <CardTitle className="text-sm font-bold text-bitcoin-orange flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-bitcoin-orange" />
                    Transaction Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-bitcoin-orange/5 border border-bitcoin-orange/20">
                      <span className="text-sm text-bitcoin-orange/80">From</span>
                      <span className="text-sm font-semibold text-bitcoin-orange">{getPoolName(fromPool)}</span>
                    </div>
                    <div className="flex items-center justify-center py-2">
                      <ArrowDownUp className="h-5 w-5 text-bitcoin-orange" />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-bitcoin-orange/5 border border-bitcoin-orange/20">
                      <span className="text-sm text-bitcoin-orange/80">To</span>
                      <span className="text-sm font-semibold text-bitcoin-orange">{getPoolName(toPool)}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-bitcoin-orange/10 border border-bitcoin-orange/30">
                      <span className="text-sm font-semibold text-bitcoin-orange/80">Amount</span>
                      <span className="text-xl font-bold text-bitcoin-orange">{amountFloat.toFixed(8)} wBTC</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Error Display */}
            {form.formState.errors.root && (
              <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-200">
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-16 bg-gradient-to-r from-bitcoin-orange via-bitcoin-gold to-bitcoin-orange hover:from-bitcoin-orange/95 hover:via-bitcoin-gold/95 hover:to-bitcoin-orange/95 text-white font-bold text-xl shadow-2xl shadow-bitcoin-orange/40 hover:shadow-2xl hover:shadow-bitcoin-orange/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              disabled={isLoadingPools || isPending || !form.formState.isValid}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isPending ? (
                  <>
                    <Loader2 className="h-7 w-7 animate-spin" />
                    <span>Processing Rebalance...</span>
                  </>
                ) : (
                  <>
                    <div className="p-1.5 rounded-lg bg-white/20">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <span>Execute Rebalance</span>
                  </>
                )}
              </div>
            </Button>
          </form>
        </Form>
      )}

    </div>
  );
}

