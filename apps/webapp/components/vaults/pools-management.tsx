'use client';

import { useState, useEffect, useCallback } from 'react';
import { useVesuVault, type PoolProps } from '@/hooks/use-vesu-vault';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Trash2, AlertCircle, RefreshCw, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getVesuPools } from '@/app/api/vesuApi';
import type { VesuPool } from '@/types/VesuPools';

export function PoolsManagement() {
  const { toast } = useToast();
  const { 
    getAllowedPools, 
    setAllowedPools, 
    createPoolProps, 
    isPending, 
    isConnected, 
    error,
    getPoolYield,
    getPoolBalance,
    vaultData
  } = useVesuVault();

  const [currentPools, setCurrentPools] = useState<PoolProps[] | null>(null);
  const [isLoadingPools, setIsLoadingPools] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [poolYields, setPoolYields] = useState<Record<string, number | null>>({});
  const [isLoadingYields, setIsLoadingYields] = useState(false);
  const [poolBalances, setPoolBalances] = useState<Record<string, bigint>>({});
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [vesuPoolsData, setVesuPoolsData] = useState<VesuPool[] | null>(null);
  const [vTokenMismatches, setVTokenMismatches] = useState<Record<string, string>>({}); // pool_id -> correct_vToken

  // Form state for adding new pool
  const [poolAddress, setPoolAddress] = useState<string>('');
  const [vTokenAddress, setVTokenAddress] = useState<string>('');
  const [maxWeight, setMaxWeight] = useState<string>('');

  // Load Vesu pools data from API to get vToken addresses
  const loadVesuPoolsData = useCallback(async (poolsToCheck?: PoolProps[]) => {
    try {
      const pools = await getVesuPools();
      setVesuPoolsData(pools);
      console.log('[pools-management] Vesu pools data loaded:', pools);
      
      // Check for vToken mismatches
      const poolsToValidate = poolsToCheck || currentPools;
      if (poolsToValidate && pools) {
        const mismatches: Record<string, string> = {};
        poolsToValidate.forEach(pool => {
          const vesuPool = pools.find((vp: VesuPool) => vp.id.toLowerCase() === pool.pool_id.toLowerCase());
          if (vesuPool) {
            // Find wBTC asset in the pool
            const wbtcAsset = vesuPool.assets.find((asset: { address: string; vTokenAddress: string }) => 
              asset.address.toLowerCase() === '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac'
            );
            if (wbtcAsset) {
              console.log(`[pools-management] Pool ${pool.pool_id} (${vesuPool.name}):`, {
                configured_vToken: pool.v_token,
                api_vToken: wbtcAsset.vTokenAddress,
                match: wbtcAsset.vTokenAddress.toLowerCase() === pool.v_token.toLowerCase()
              });
              
              if (wbtcAsset.vTokenAddress.toLowerCase() !== pool.v_token.toLowerCase()) {
                mismatches[pool.pool_id] = wbtcAsset.vTokenAddress;
                console.warn(`[pools-management] ⚠️ vToken mismatch for pool ${pool.pool_id}:`, {
                  current: pool.v_token,
                  correct: wbtcAsset.vTokenAddress,
                  poolName: vesuPool.name
                });
              }
            } else {
              console.warn(`[pools-management] No wBTC asset found in pool ${pool.pool_id} (${vesuPool.name})`);
            }
          } else {
            console.warn(`[pools-management] Pool ${pool.pool_id} not found in Vesu API`);
          }
        });
        setVTokenMismatches(mismatches);
      }
    } catch (err) {
      console.error('[pools-management] Failed to load Vesu pools data:', err);
    }
  }, [currentPools]);

  // Load balances for all pools
  const loadPoolBalances = useCallback(async (pools: PoolProps[]) => {
    if (!pools || pools.length === 0) {
      console.log('No pools to load balances for');
      return;
    }
    
    console.log('[pools-management] ===== loadPoolBalances called =====');
    setIsLoadingBalances(true);
    const balances: Record<string, bigint> = {};
    
    try {
      await Promise.all(
        pools.map(async (pool) => {
          try {
            const balance = await getPoolBalance(pool.pool_id);
            if (balance !== null && balance !== undefined) {
              balances[pool.pool_id] = balance;
            }
          } catch (err) {
            console.error(`Failed to load balance for pool ${pool.pool_id}:`, err);
          }
        })
      );
      
      setPoolBalances(balances);
      console.log('[pools-management] Pool balances loaded:', balances);
    } catch (err) {
      console.error('Failed to load pool balances:', err);
    } finally {
      setIsLoadingBalances(false);
    }
  }, [getPoolBalance]);

  // Load yields for all pools
  const loadPoolYields = useCallback(async (pools: PoolProps[]) => {
    if (!pools || pools.length === 0) {
      console.log('No pools to load yields for');
      return;
    }
    
    // Normalize pool addresses to lowercase for consistent key matching
    const normalizeAddress = (addr: string) => addr.toLowerCase();
    
    console.log('[pools-management] ===== loadPoolYields called =====');
    console.log('[pools-management] getPoolYield type:', typeof getPoolYield);
    console.log('[pools-management] getPoolYield value:', getPoolYield);
    
    if (!getPoolYield) {
      console.error('[pools-management] getPoolYield is undefined or null!');
      return;
    }
    
    console.log('Loading yields for pools:', pools.map((p, i) => `Pool ${i + 1}: ${p.pool_id}`));
    setIsLoadingYields(true);
    const yields: Record<string, number | null> = {};
    
    try {
      // Load yields in parallel for all pools
      const yieldPromises = pools.map(async (pool, index) => {
        try {
          const normalizedPoolId = normalizeAddress(pool.pool_id);
          console.log(`[pools-management] Loading yield for pool ${index + 1} (${normalizedPoolId})...`);
          console.log(`[pools-management] Calling getPoolYield with:`, {
            pool_id: pool.pool_id,
            normalizedPoolId,
            getPoolYield: typeof getPoolYield,
            isFunction: typeof getPoolYield === 'function'
          });
          
          if (typeof getPoolYield !== 'function') {
            console.error(`[pools-management] getPoolYield is not a function! Type: ${typeof getPoolYield}`);
            yields[normalizedPoolId] = null;
            return;
          }
          
          console.log(`[pools-management] About to call getPoolYield(${pool.pool_id})...`);
          const yieldValue = await getPoolYield(pool.pool_id);
          console.log(`[pools-management] Yield for pool ${index + 1} (${normalizedPoolId}):`, yieldValue);
          yields[normalizedPoolId] = yieldValue;
        } catch (err) {
          const normalizedPoolId = normalizeAddress(pool.pool_id);
          console.error(`[pools-management] Failed to load yield for pool ${index + 1} (${normalizedPoolId}):`, err);
          yields[normalizedPoolId] = null;
        }
      });
      
      await Promise.all(yieldPromises);
      console.log('All yields loaded:', yields);
      setPoolYields(yields);
    } catch (err) {
      console.error('Failed to load pool yields:', err);
    } finally {
      setIsLoadingYields(false);
    }
  }, [getPoolYield]);

  // Load current pools from contract
  const loadCurrentPools = useCallback(async () => {
    if (!isConnected) return;
    
    setIsLoadingPools(true);
    try {
      const pools = await getAllowedPools();
      if (pools) {
        setCurrentPools(pools);
        console.log('[pools-management] Current pools loaded:', pools);
        
        // Load Vesu pools data to check vToken mismatches
        await loadVesuPoolsData(pools);
        
        // Load yields and balances for all pools
        if (pools && pools.length > 0) {
          console.log('[pools-management] About to call loadPoolYields with', pools.length, 'pools');
          await Promise.all([
            loadPoolYields(pools),
            loadPoolBalances(pools)
          ]);
        } else {
          console.log('[pools-management] No pools to load yields for');
        }
      }
    } catch (err) {
      console.error('Failed to load pools:', err);
      toast({
        title: 'Error',
        description: 'Failed to load current pools',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingPools(false);
    }
  }, [isConnected, getAllowedPools, loadVesuPoolsData, loadPoolYields, loadPoolBalances, toast]);

  // Load pools on mount and when connected
  useEffect(() => {
    if (isConnected) {
      loadCurrentPools();
      loadVesuPoolsData();
    }
  }, [isConnected, loadCurrentPools, loadVesuPoolsData]);

  useEffect(() => {
    if (isConnected && currentPools && currentPools.length > 0 && vaultData) {
      // Reload balances when vault data changes (indicates a rebalance or deposit happened)
      console.log('[pools-management] Vault data changed, reloading pool balances...');
      loadPoolBalances(currentPools);
    }
  }, [isConnected, currentPools, vaultData, loadPoolBalances]); // Reload when total assets change

  // Handle add pool
  const handleAddPool = async () => {
    if (!poolAddress || !vTokenAddress || !maxWeight) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    // Validate addresses format (Starknet addresses are hex with 0x prefix)
    // Addresses can vary in length but should be valid hex
    const isValidAddress = (addr: string): boolean => {
      if (!addr.startsWith('0x')) return false;
      const hexPart = addr.slice(2);
      if (hexPart.length === 0 || hexPart.length > 64) return false;
      // Check if it's valid hex (0-9, a-f, A-F)
      return /^[0-9a-fA-F]+$/.test(hexPart);
    };

    if (!isValidAddress(poolAddress)) {
      toast({
        title: 'Error',
        description: 'Invalid pool address format. Must start with 0x and contain valid hexadecimal characters.',
        variant: 'destructive',
      });
      return;
    }

    if (!isValidAddress(vTokenAddress)) {
      toast({
        title: 'Error',
        description: 'Invalid vToken address format. Must start with 0x and contain valid hexadecimal characters.',
        variant: 'destructive',
      });
      return;
    }

    const maxWeightNum = parseInt(maxWeight);
    if (isNaN(maxWeightNum) || maxWeightNum <= 0 || maxWeightNum > 10000) {
      toast({
        title: 'Error',
        description: 'Max weight must be between 1 and 10000 (basis points)',
        variant: 'destructive',
      });
      return;
    }

    // Always fetch fresh pools from contract to check for duplicates
    // Don't rely on local state which might be outdated
    console.log('[Add Pool] Fetching fresh pools from contract to check for duplicates...');
    let freshPools: PoolProps[] | null = null;
    try {
      freshPools = await getAllowedPools();
      console.log('[Add Pool] Fresh pools from contract:', freshPools);
    } catch (err) {
      console.error('[Add Pool] Failed to fetch pools from contract:', err);
      toast({
        title: 'Error',
        description: 'Failed to verify pools from contract. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    // Check if pool already exists (by pool_id or v_token)
    // Normalize addresses for comparison (case-insensitive)
    const normalizedPoolAddress = poolAddress.toLowerCase().trim();
    const normalizedVTokenAddress = vTokenAddress.toLowerCase().trim();
    
    console.log('[Add Pool] Checking for duplicates with:', {
      poolAddress: normalizedPoolAddress,
      vTokenAddress: normalizedVTokenAddress,
      freshPoolsCount: freshPools?.length || 0
    });
    
    const poolExists = freshPools?.some(p => {
      const normalizedExistingPoolId = p.pool_id.toLowerCase().trim();
      const normalizedExistingVToken = p.v_token.toLowerCase().trim();
      
      const poolIdMatch = normalizedExistingPoolId === normalizedPoolAddress;
      const vTokenMatch = normalizedExistingVToken === normalizedVTokenAddress;
      
      console.log('[Add Pool] Comparing with existing pool:', {
        existingPoolId: normalizedExistingPoolId,
        existingVToken: normalizedExistingVToken,
        poolIdMatch,
        vTokenMatch,
        match: poolIdMatch || vTokenMatch
      });
      
      return poolIdMatch || vTokenMatch;
    });
    
    if (poolExists) {
      const existingPool = freshPools?.find(p => {
        const normalizedExistingPoolId = p.pool_id.toLowerCase().trim();
        const normalizedExistingVToken = p.v_token.toLowerCase().trim();
        return normalizedExistingPoolId === normalizedPoolAddress || 
               normalizedExistingVToken === normalizedVTokenAddress;
      });
      
      console.log('[Add Pool] Pool already exists in contract:', existingPool);
      
      toast({
        title: 'Error',
        description: existingPool 
          ? `This pool is already added (Pool ID: ${existingPool.pool_id.slice(0, 10)}...${existingPool.pool_id.slice(-8)})`
          : 'This pool is already added',
        variant: 'destructive',
      });
      return;
    }
    
    console.log('[Add Pool] Pool does not exist in contract, proceeding to add...');

    setIsAdding(true);
    try {
      // Create new pool
      const newPool = createPoolProps(
        poolAddress,      // pool address (pool_id)
        vTokenAddress,    // vToken address
        maxWeightNum      // max weight
      );

      // Add to current pools
      const updatedPools = [
        ...(currentPools || []),
        newPool
      ];

      // Call contract to update pools
      await setAllowedPools(updatedPools);

      toast({
        title: 'Success',
        description: 'Pool added successfully',
      });

      // Reset form
      setPoolAddress('');
      setVTokenAddress('');
      setMaxWeight('');

      // Reload pools
      await loadCurrentPools();
    } catch (err: unknown) {
      console.error('Failed to add pool:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to add pool';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsAdding(false);
    }
  };

  // Handle update pool vToken (for pools with mismatch)
  const handleUpdatePoolVToken = async (poolId: string, newVToken: string) => {
    if (!currentPools) return;

    const updatedPools = currentPools.map(p => 
      p.pool_id.toLowerCase() === poolId.toLowerCase()
        ? { ...p, v_token: newVToken }
        : p
    );

    setIsAdding(true);
    try {
      await setAllowedPools(updatedPools);
      toast({
        title: 'Success',
        description: 'Pool vToken updated successfully',
      });
      await loadCurrentPools();
    } catch (err: unknown) {
      console.error('Failed to update pool vToken:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update pool vToken';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsAdding(false);
    }
  };

  // Handle remove pool (requires updating all pools)
  const handleRemovePool = async (vTokenAddress: string) => {
    if (!currentPools) return;

    const poolToRemove = currentPools.find(p => p.v_token === vTokenAddress);
    if (poolToRemove) {
      const normalizedPoolId = poolToRemove.pool_id.toLowerCase();
      const balance = poolBalances[normalizedPoolId];
      if (balance && balance > 0) {
        toast({
          title: 'Error',
          description: `Cannot remove pool with balance. Current balance: ${(Number(balance) / 1e8).toFixed(8)} wBTC. Please withdraw funds first or update the vToken instead.`,
          variant: 'destructive',
        });
        return;
      }
    }
    
    const updatedPools = currentPools.filter(p => p.v_token !== vTokenAddress);
    
    if (updatedPools.length === 0) {
      toast({
        title: 'Error',
        description: 'Cannot remove all pools. At least one pool is required.',
        variant: 'destructive',
      });
      return;
    }

    setIsAdding(true);
    try {
      await setAllowedPools(updatedPools);
      toast({
        title: 'Success',
        description: 'Pool removed successfully',
      });
      await loadCurrentPools();
    } catch (err: unknown) {
      console.error('Failed to remove pool:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove pool';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsAdding(false);
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pool Management</CardTitle>
          <CardDescription>
            Connect your wallet to manage pools
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Pools */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Pools</CardTitle>
              <CardDescription>
                Pools currently configured in the vault
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadCurrentPools}
              disabled={isLoadingPools || isPending}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingPools ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingPools ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading pools...</span>
            </div>
          ) : currentPools && currentPools.length > 0 ? (
            <div className="space-y-3">
              {currentPools.map((pool, index) => {
                // Normalize pool address to lowercase for consistent key matching
                const normalizedPoolId = pool.pool_id.toLowerCase();
                const yieldValue = poolYields[normalizedPoolId];
                
                console.log(`[Pool ${index + 1}] pool_id: ${pool.pool_id}`);
                console.log(`[Pool ${index + 1}] normalized: ${normalizedPoolId}`);
                console.log(`[Pool ${index + 1}] yieldValue:`, yieldValue);
                console.log(`[Pool ${index + 1}] all yields:`, poolYields);
                
                return (
                <div
                  key={`${pool.v_token}-${index}`}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">
                        Pool {index + 1}
                      </Badge>
                      <Badge variant="outline">
                        Max: {(pool.max_weight / 100).toFixed(2)}%
                      </Badge>
                      {(() => {
                        console.log(`[Render Pool ${index + 1}] Checking yield for ${normalizedPoolId}:`, yieldValue);
                        
                        if (yieldValue !== undefined && yieldValue !== null) {
                          return (
                            <Badge variant="default" className="bg-green-600">
                              APY: {yieldValue.toFixed(2)}%
                            </Badge>
                          );
                        }
                        
                        if (yieldValue === undefined && isLoadingYields) {
                          return (
                            <Badge variant="outline" className="text-muted-foreground">
                              Loading APY...
                            </Badge>
                          );
                        }
                        
                        // Show error state if yield is null (failed to load)
                        if (yieldValue === null) {
                          return (
                            <Badge variant="outline" className="text-red-500">
                              APY: N/A
                            </Badge>
                          );
                        }
                        
                        return null;
                      })()}
                      {(() => {
                        const balance = poolBalances[normalizedPoolId];
                        if (balance !== undefined) {
                          const balanceFormatted = (Number(balance) / 1e8).toFixed(8);
                          return (
                            <Badge variant="secondary" className="bg-blue-600">
                              Balance: {balanceFormatted} wBTC
                            </Badge>
                          );
                        }
                        if (isLoadingBalances) {
                          return (
                            <Badge variant="outline" className="text-muted-foreground">
                              Loading balance...
                            </Badge>
                          );
                        }
                        return null;
                      })()}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-2">
                        <strong>Pool Address:</strong>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {pool.pool_id.slice(0, 10)}...{pool.pool_id.slice(-8)}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2"
                          onClick={() => {
                            navigator.clipboard.writeText(pool.pool_id);
                            toast({
                              title: 'Copied',
                              description: 'Pool address copied to clipboard',
                            });
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                      {vTokenMismatches[pool.pool_id] && (
                        <Alert className="mt-2 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
                          <Info className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                            <div className="space-y-2">
                              <strong>⚠️ vToken mismatch detected!</strong>
                              <div className="text-sm space-y-2">
                                <div>
                                  <p className="font-medium">Configured vToken (incorrect):</p>
                                  <code className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded block w-fit">{pool.v_token.slice(0, 10)}...{pool.v_token.slice(-8)}</code>
                                </div>
                                <div>
                                  <p className="font-medium">Correct vToken from Vesu API:</p>
                                  <div className="flex items-center gap-2">
                                    <code className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded">{vTokenMismatches[pool.pool_id].slice(0, 10)}...{vTokenMismatches[pool.pool_id].slice(-8)}</code>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-6 px-2 text-xs"
                                      onClick={() => {
                                        navigator.clipboard.writeText(vTokenMismatches[pool.pool_id]);
                                        toast({
                                          title: 'Copied',
                                          description: 'Correct vToken address copied to clipboard. Use this address when updating the pool.',
                                        });
                                      }}
                                    >
                                      Copy Correct vToken
                                    </Button>
                                  </div>
                                </div>
                                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                                  To fix: Click &quot;Update vToken&quot; below to update this pool with the correct vToken address.
                                </p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-2 text-xs"
                                  onClick={() => handleUpdatePoolVToken(pool.pool_id, vTokenMismatches[pool.pool_id])}
                                  disabled={isPending || isAdding}
                                >
                                  {isPending || isAdding ? (
                                    <>
                                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                      Updating...
                                    </>
                                  ) : (
                                    'Update vToken'
                                  )}
                                </Button>
                              </div>
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}
                      {(() => {
                        // Show info about correct vToken from API even if there's no mismatch
                        if (vesuPoolsData) {
                          const vesuPool = vesuPoolsData.find((vp: VesuPool) => vp.id.toLowerCase() === pool.pool_id.toLowerCase());
                          if (vesuPool) {
                            const wbtcAsset = vesuPool.assets.find((asset: { address: string; vTokenAddress: string }) => 
                              asset.address.toLowerCase() === '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac'
                            );
                            if (wbtcAsset) {
                              return (
                                <div className="text-xs text-muted-foreground mt-1">
                                  <p>Vesu API vToken: <code className="bg-muted px-1 rounded">{wbtcAsset.vTokenAddress.slice(0, 10)}...{wbtcAsset.vTokenAddress.slice(-8)}</code></p>
                                  {wbtcAsset.vTokenAddress.toLowerCase() === pool.v_token.toLowerCase() && (
                                    <p className="text-green-600 dark:text-green-400">✓ vToken matches Vesu API</p>
                                  )}
                                </div>
                              );
                            }
                          }
                        }
                        return null;
                      })()}
                      <div className="flex items-center gap-2">
                        <strong>vToken Address:</strong>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {pool.v_token.slice(0, 10)}...{pool.v_token.slice(-8)}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2"
                          onClick={() => {
                            navigator.clipboard.writeText(pool.v_token);
                            toast({
                              title: 'Copied',
                              description: 'vToken address copied to clipboard',
                            });
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemovePool(pool.v_token)}
                    disabled={isPending || isAdding}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
              })}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No pools configured. Add a pool below to get started.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Pool */}
      <Card>
        <CardHeader>
          <CardTitle>Add Pool</CardTitle>
          <CardDescription>
            Add a new pool from Vesu to the vault
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Pool Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Pool Address (pool_id)</label>
              <Input
                type="text"
                placeholder="0x..."
                value={poolAddress}
                onChange={(e) => setPoolAddress(e.target.value)}
                disabled={isPending || isAdding}
              />
              <p className="text-xs text-muted-foreground">
                The contract address of the Vesu pool
              </p>
            </div>

            {/* vToken Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium">vToken Address</label>
              <Input
                type="text"
                placeholder="0x..."
                value={vTokenAddress}
                onChange={(e) => setVTokenAddress(e.target.value)}
                disabled={isPending || isAdding}
              />
              <p className="text-xs text-muted-foreground">
                The ERC4626 vToken contract address for this pool asset
              </p>
            </div>

            {/* Max Weight */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Weight (basis points)</label>
              <Input
                type="number"
                placeholder="5000 (50%)"
                value={maxWeight}
                onChange={(e) => setMaxWeight(e.target.value)}
                min="1"
                max="10000"
                disabled={isPending || isAdding}
              />
              <p className="text-xs text-muted-foreground">
                Max weight in basis points (10000 = 100%). This limits how much of the vault can be allocated to this pool.
              </p>
            </div>

            {/* Add Button */}
            <Button
              onClick={handleAddPool}
              disabled={!poolAddress || !vTokenAddress || !maxWeight || isPending || isAdding}
              className="w-full"
            >
              {isAdding ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding Pool...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Pool
                </>
              )}
            </Button>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Info Alert */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Note:</strong> Adding pools requires the GOVERNOR role. If you don&apos;t have this role, the transaction will fail.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

