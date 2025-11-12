'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useVesuVault, type PoolProps } from '@/hooks/use-vesu-vault';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Briefcase, 
  Coins, 
  Loader2, 
  AlertCircle, 
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getVesuPools } from '@/app/api/vesuApi';
import type { VesuPool } from '@/types/VesuPools';
import { DepositWithdrawForm } from '@/components/vaults/deposit-withdraw-form';
import { RebalanceForm } from '@/components/vaults/rebalance-form';
import { VesuVaultPosition } from '@/components/vaults/position-card';

interface VaultDetailContentProps {
  vaultId: string;
}

export function VaultDetailContent({ vaultId }: VaultDetailContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const {
    getAllowedPools,
    getPoolYield,
    getPoolBalance,
    totalAssets,
    getUserPosition,
    isConnected,
    account,
    isLoading: isVaultLoading,
    vaultData,
  } = useVesuVault();

  const [pools, setPools] = useState<PoolProps[]>([]);
  const [poolYields, setPoolYields] = useState<Record<string, number | null>>({});
  const [poolBalances, setPoolBalances] = useState<Record<string, bigint>>({});
  const [vesuPoolsData, setVesuPoolsData] = useState<VesuPool[] | null>(null);
  const [userPosition, setUserPosition] = useState<{
    assets: bigint;
    formatted: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get('action') || 'overview');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  
  // Tab configuration
  const tabs = useMemo(() => [
    { id: 'overview', label: 'Overview' },
    { id: 'deposit-withdraw', label: 'Deposit/Withdraw' },
    { id: 'rebalance', label: 'Rebalance' },
    { id: 'pools', label: 'Pools' },
  ] as const, []);

  // Update indicator position when active tab changes
  useEffect(() => {
    const updateIndicator = () => {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        const activeIndex = tabs.findIndex(t => t.id === activeTab);
        const activeButton = tabRefs.current[activeIndex];
        const container = activeButton?.parentElement;
        
        if (activeButton && container) {
          const containerRect = container.getBoundingClientRect();
          const buttonRect = activeButton.getBoundingClientRect();
          
          setIndicatorStyle({
            left: buttonRect.left - containerRect.left,
            width: buttonRect.width,
          });
        }
      });
    };

    // Small delay to ensure buttons are rendered
    const timeoutId = setTimeout(updateIndicator, 0);

    // Update on window resize
    window.addEventListener('resize', updateIndicator);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [activeTab, tabs]);

  // Load vault data
  useEffect(() => {
    const loadData = async () => {
      if (!isConnected) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Load pools
        const allowedPools = await getAllowedPools();
        const poolsToProcess = allowedPools || [];
        setPools(poolsToProcess);

        // Load Vesu pools data for names
        const vesuPools = await getVesuPools();
        setVesuPoolsData(vesuPools);

        // Load pool yields and balances
        const yields: Record<string, number | null> = {};
        const balances: Record<string, bigint> = {};

        for (const pool of poolsToProcess) {
          try {
            const yieldValue = await getPoolYield(pool.pool_id);
            yields[pool.pool_id] = yieldValue;
          } catch (err) {
            console.warn(`Failed to get yield for pool ${pool.pool_id}:`, err);
            yields[pool.pool_id] = null;
          }

          try {
            const balance = await getPoolBalance(pool.v_token);
            balances[pool.pool_id] = balance;
          } catch (err) {
            console.warn(`Failed to get balance for pool ${pool.pool_id}:`, err);
            balances[pool.pool_id] = BigInt(0);
          }
        }

        setPoolYields(yields);
        setPoolBalances(balances);

        // Load user position
        try {
          const position = await getUserPosition();
          if (position) {
            setUserPosition({
              assets: position.assets,
              formatted: position.formatted,
            });
          }
        } catch (err) {
          console.warn('Failed to get user position:', err);
        }
      } catch (err) {
        console.error('Failed to load vault data:', err);
        toast({
          title: 'Error',
          description: 'Failed to load vault data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isConnected, account, vaultId, getAllowedPools, getPoolYield, getPoolBalance, getUserPosition, toast, vaultData?.totalAssets]);

  // Get pool name from Vesu API
  const getPoolName = (poolId: string): string => {
    if (!vesuPoolsData) return `Pool ${poolId.slice(0, 8)}...`;
    const pool = vesuPoolsData.find((p) => p.id.toLowerCase() === poolId.toLowerCase());
    return pool?.name || `Pool ${poolId.slice(0, 8)}...`;
  };

  // Format total assets with full precision
  const formatTotalAssets = (assets: bigint | null | undefined) => {
    if (!assets || assets === null || assets === undefined) return '0.00000000';
    return (Number(assets) / 1e8).toFixed(8);
  };
  
  // Calculate total from pool balances as backup/verification

  // Safe APY formatter
  const formatApy = (apy: number | null | undefined): string => {
    if (apy == null || typeof apy !== 'number' || isNaN(apy)) {
      return 'N/A';
    }
    // Always show 2 decimal places, even for 0%
    return `${Math.max(0, apy).toFixed(2)}%`;
  };

  // Calculate average APY
  const avgApy = useMemo(() => {
    if (pools.length === 0) return 0;
    const validApys = pools
      .map((pool) => poolYields[pool.pool_id])
      .filter((apy): apy is number => typeof apy === 'number' && apy != null);
    if (validApys.length === 0) return 0;
    return validApys.reduce((sum, apy) => sum + apy, 0) / validApys.length;
  }, [pools, poolYields]);

  // Supported vault IDs
  const supportedVaultIds = ['vesu-rebalance', 'numo-vault'];
  
  if (!supportedVaultIds.includes(vaultId)) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Vault &quot;{vaultId}&quot; not found. Supported vaults: {supportedVaultIds.join(', ')}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 -mt-2">
      {/* Header */}
      <motion.div 
        className="flex items-center gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/vaults')}
          className="gap-2 hover:bg-bitcoin-orange/10 hover:text-bitcoin-orange transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Vaults
        </Button>
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
        <div className="mt-8">
          <p className="text-muted-foreground -mt-8">
            Manual yield farming vault across multiple Vesu pools
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          key="stats-total-assets"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ y: -2 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-r from-bitcoin-gold/10 to-bitcoin-gold/5 border-bitcoin-gold/30 hover:border-bitcoin-gold/50 hover:shadow-lg hover:shadow-bitcoin-gold/10 transition-all duration-300 group">
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-bitcoin-gold">Total Assets</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-bitcoin-gold">
                {isLoading || isVaultLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                ) : (
                  `${formatTotalAssets(totalAssets || vaultData?.totalAssets)} wBTC`
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          key="stats-average-apy"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ y: -2 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-r from-bitcoin-orange/10 to-bitcoin-orange/5 border-bitcoin-orange/30 hover:border-bitcoin-orange/50 hover:shadow-lg hover:shadow-bitcoin-orange/10 transition-all duration-300 group">
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-bitcoin-orange">Average APY</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-bitcoin-orange">
                {isLoading ? '...' : `${avgApy.toFixed(2)}%`}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          key="stats-pools-count"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          whileHover={{ y: -2 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-r from-green-500/10 to-green-500/5 border-green-500/30 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 group">
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-green-500">Pools</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-green-500">
                {isLoading ? '...' : pools.length}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {userPosition && (
          <motion.div
            key="stats-user-position"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            whileHover={{ y: -2 }}
          >
            <Card className="relative overflow-hidden bg-gradient-to-r from-blue-500/10 to-blue-500/5 border-blue-500/30 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group">
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-blue-500">Your Position</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-2xl font-bold text-blue-500">
                  {userPosition.formatted} wBTC
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Pill Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="space-y-6"
      >
        {/* Pill Nav */}
        <div className="relative inline-flex items-center gap-1 p-1.5 bg-muted/50 rounded-full border border-border/50 backdrop-blur-sm">
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={`tab-button-${tab.id}`}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative z-10 px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 whitespace-nowrap
                  ${isActive 
                    ? 'text-bitcoin-orange' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                {tab.label}
              </button>
            );
          })}
          {/* Active indicator pill */}
          {indicatorStyle.width > 0 && (
            <motion.div
              className="absolute top-1.5 bottom-1.5 bg-background border border-bitcoin-orange/30 rounded-full shadow-lg shadow-bitcoin-orange/10 z-0"
              initial={false}
              animate={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
            />
          )}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          <AnimatePresence mode="wait" initial={false}>
            {activeTab === 'overview' && (
              <motion.div
                key="overview-tab-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Vault Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <Card className="hover:shadow-md transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-bitcoin-orange" />
                      Vault Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Description</p>
                      <p className="text-sm">
                        The Numo Rebalance Vault allows you to manually rebalance your wBTC across multiple Vesu pools.
                        You have full control over which pools receive your deposits and when to rebalance. Deposit your wBTC
                        into the vault and then use the rebalance function to allocate funds to your preferred pools based on
                        their APY and your investment strategy.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Features</p>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>Manual rebalancing across multiple pools</li>
                        <li>Full control over pool allocation</li>
                        <li>ERC4626 standard compliance</li>
                        <li>Real-time yield tracking and pool performance</li>
                        <li>Choose pools based on APY and your strategy</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* User Position */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                <VesuVaultPosition />
              </motion.div>
            </div>
              </motion.div>
            )}

            {activeTab === 'deposit-withdraw' && (
              <motion.div
                key="deposit-withdraw-tab-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <DepositWithdrawForm />
              </motion.div>
            )}

            {activeTab === 'rebalance' && (
              <motion.div
                key="rebalance-tab-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <RebalanceForm />
              </motion.div>
            )}

            {activeTab === 'pools' && (
              <motion.div
                key="pools-tab-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
              <Card className="hover:shadow-md transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Coins className="h-5 w-5 text-bitcoin-orange" />
                      Configured Pools
                    </CardTitle>
                    <CardDescription>
                      Pools currently configured in the vault
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : pools.length === 0 ? (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>No pools configured in this vault.</AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    {pools.map((pool, index) => {
                      const poolName = getPoolName(pool.pool_id);
                      const apy = poolYields[pool.pool_id];
                      const balance = poolBalances[pool.pool_id];

                      return (
                        <motion.div
                          key={pool.pool_id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                          className="p-4 border rounded-lg space-y-3 hover:border-bitcoin-orange/30 hover:shadow-sm transition-all duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge 
                                key={`pool-badge-${pool.pool_id}`}
                                className="bg-bitcoin-orange/20 text-bitcoin-orange border-bitcoin-orange/30"
                              >
                                Pool {index + 1}
                              </Badge>
                              <span className="font-semibold">{poolName}</span>
                            </div>
                            {apy != null && typeof apy === 'number' && !isNaN(apy) ? (
                              <Badge 
                                key={`apy-badge-${pool.pool_id}`}
                                className={apy > 0 
                                  ? "bg-bitcoin-gold/20 text-bitcoin-gold border-bitcoin-gold/30"
                                  : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                                }
                              >
                                {formatApy(apy)} APY
                              </Badge>
                            ) : (
                              <Badge 
                                key={`apy-badge-${pool.pool_id}`}
                                className="bg-gray-500/20 text-gray-400 border-gray-500/30"
                                variant="outline"
                              >
                                {formatApy(null)} APY
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Pool Address</p>
                              <p className="font-mono text-xs break-all">{pool.pool_id}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">vToken Address</p>
                              <p className="font-mono text-xs break-all">{pool.v_token}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t">
                            <div>
                              <p className="text-sm text-muted-foreground">Pool Balance</p>
                              <p className="font-semibold">
                                {isLoading ? (
                                  <span className="text-muted-foreground">Loading...</span>
                                ) : balance ? (
                                  `${(Number(balance) / 1e8).toFixed(8)} wBTC`
                                ) : (
                                  '0.00000000 wBTC'
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Max Weight</p>
                              <p className="font-semibold">{(pool.max_weight / 100).toFixed(0)}%</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
              </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

