'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useVesuVault, type PoolProps } from '@/hooks/use-vesu-vault';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { 
  ArrowLeft, 
  Briefcase, 
  Coins, 
  Loader2, 
  AlertCircle, 
  Info
} from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { getVesuPools } from '@/app/api/vesuApi';
import type { VesuPool, ProcessedAsset } from '@/types/VesuPools';
import { DepositWithdrawForm } from '@/components/vaults/deposit-withdraw-form';
import { RebalanceForm } from '@/components/vaults/rebalance-form';
import { VesuVaultPosition } from '@/components/vaults/position-card';

interface VaultDetailContentProps {
  vaultId: string;
}

type RiskProfile = 'Low' | 'Medium' | 'High';

// Calculate vault risk based on pools
function calculateVaultRisk(pools: PoolProps[], vesuPoolsData: VesuPool[] | null): RiskProfile {
  if (pools.length === 0) return 'Medium';

  let riskScore = 0;
  let lendingPoolsCount = 0;
  let dexPoolsCount = 0;

  pools.forEach((pool) => {
    // Get pool name from Vesu API data
    const poolName = vesuPoolsData 
      ? (vesuPoolsData.find(p => p.id.toLowerCase() === pool.pool_id.toLowerCase())?.name || '').toLowerCase()
      : pool.pool_id.toLowerCase();
    
    // Identify pool type
    if (poolName.includes('vesu') || poolName.includes('lending')) {
      lendingPoolsCount++;
      riskScore += 1; // Lending pools are lower risk
    } else if (poolName.includes('ekubo') || poolName.includes('dex') || poolName.includes('liquidity')) {
      dexPoolsCount++;
      riskScore += 3; // DEX/liquidity pools are higher risk
    } else {
      riskScore += 2; // Unknown pools = medium risk
    }
  });

  // Diversification factor (more pools = lower risk)
  if (pools.length >= 3) {
    riskScore -= 2; // Well diversified
  } else if (pools.length === 2) {
    riskScore -= 1; // Somewhat diversified
  }

  // If mostly lending pools, reduce risk
  const lendingRatio = lendingPoolsCount / pools.length;
  if (lendingRatio >= 0.7) {
    riskScore -= 2; // Mostly safe lending pools
  } else if (lendingRatio >= 0.5) {
    riskScore -= 1; // Balanced
  }

  // If mostly DEX pools, increase risk
  const dexRatio = dexPoolsCount / pools.length;
  if (dexRatio >= 0.7) {
    riskScore += 2; // Mostly risky DEX pools
  } else if (dexRatio >= 0.5) {
    riskScore += 1; // Balanced towards risk
  }

  // Normalize risk score to Low/Medium/High
  if (riskScore <= 2) {
    return 'Low';
  } else if (riskScore <= 5) {
    return 'Medium';
  } else {
    return 'High';
  }
}

// Get risk badge styling
function getRiskBadgeStyle(risk: RiskProfile): string {
  switch (risk) {
    case 'Low':
      return 'bg-black/50 text-white border-white/20';
    case 'Medium':
      return 'bg-black/50 text-white border-white/20';
    case 'High':
      return 'bg-black/50 text-white border-white/20';
    default:
      return 'bg-black/50 text-white border-white/20';
  }
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
  const [poolBreakdowns, setPoolBreakdowns] = useState<Record<string, { lendingApr: number; rewardsApr: number } | null>>({});
  const [userPosition, setUserPosition] = useState<{
    assets: bigint;
    formatted: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const activeTabFromUrl = searchParams.get('action') || 'overview';
  const [activeTab, setActiveTab] = useState(activeTabFromUrl);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  
  // Tab configuration
  const tabs = useMemo(() => [
    { id: 'overview', label: 'Overview' },
    { id: 'deposit-withdraw', label: 'Deposit/Withdraw' },
    { id: 'rebalance', label: 'Rebalance' },
    { id: 'pools', label: 'Pools' },
  ] as const, []);

  // Sync activeTab with URL parameter
  useEffect(() => {
    const tabFromUrl = searchParams.get('action') || 'overview';
    // Validate that the tab from URL is valid
    if (tabs.some(tab => tab.id === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, tabs]);

  // Handle tab change: update both state and URL
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const currentUrl = new URL(window.location.href);
    if (tabId === 'overview') {
      currentUrl.searchParams.delete('action');
    } else {
      currentUrl.searchParams.set('action', tabId);
    }
    router.replace(currentUrl.pathname + currentUrl.search, { scroll: false });
  };

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

  useEffect(() => {
    if (!pools.length || !vesuPoolsData) {
      setPoolBreakdowns({});
      return;
    }

    const breakdowns: Record<string, { lendingApr: number; rewardsApr: number } | null> = {};

    for (const pool of pools) {
      const poolAddressLower = pool.pool_id.toLowerCase();
      
      const vesuPool = vesuPoolsData.find((p: VesuPool) => {
        if (p.id) {
          const poolIdLower = p.id.toLowerCase();
          if (poolIdLower === poolAddressLower) {
            return true;
          }
        }
        
        // Fallback: try matching by address (extensionContractAddress) if available
        if (p.address) {
          const poolApiAddress = p.address.toLowerCase();
          if (poolApiAddress === poolAddressLower) {
            return true;
          }
        }
        
        return false;
      });
      
      if (!vesuPool) {
        breakdowns[pool.pool_id] = null;
        continue;
      }

      // Find WBTC asset in the processed pool data
      const WBTC_ADDRESS = '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac';
      
      const assetAddress = WBTC_ADDRESS.toLowerCase();
      const assetAddressFelt = BigInt(WBTC_ADDRESS).toString();
      
      const normalizeAddress = (addr: string): string => {
        if (!addr) return '';
        let normalized = addr.toLowerCase();
        if (normalized.startsWith('0x')) {
          normalized = normalized.slice(2);
        }
        // Pad to 64 chars (32 bytes in hex)
        normalized = normalized.padStart(64, '0');
        return normalized;
      };
      
      const normalizedVaultAsset = normalizeAddress(assetAddress);
      const normalizedKnownWbtc = normalizeAddress(WBTC_ADDRESS.toLowerCase());
      
      let wbtcAsset = vesuPool.assets.find((asset: ProcessedAsset) => {
        if (!asset.address) return false;
        
        const assetAddressLower = assetAddress.toLowerCase();
        const knownWbtcAddressLower = WBTC_ADDRESS.toLowerCase();
        const poolAssetAddressLower = asset.address.toLowerCase();
        
        const normalizedPoolAsset = normalizeAddress(poolAssetAddressLower);
        
        // Try direct match
        let match = normalizedPoolAsset === normalizedVaultAsset || 
                   normalizedPoolAsset === normalizedKnownWbtc ||
                   poolAssetAddressLower === assetAddressLower ||
                   poolAssetAddressLower === knownWbtcAddressLower;
        
        // If no direct match, try converting pool asset address from felt252 to hex
        if (!match && asset.address && !asset.address.startsWith('0x')) {
          try {
            const poolAssetFelt = BigInt(asset.address);
            const poolAssetHex = `0x${poolAssetFelt.toString(16).padStart(64, '0')}`.toLowerCase();
            const normalizedPoolHex = normalizeAddress(poolAssetHex);
            match = normalizedPoolHex === normalizedVaultAsset || normalizedPoolHex === normalizedKnownWbtc;
          } catch {
            // Ignore
          }
        }
        
        // Also try the reverse: if pool asset is in hex, try comparing with felt252 format
        if (!match && asset.address.startsWith('0x')) {
          try {
            const poolAssetFelt = BigInt(asset.address);
            const poolAssetFeltStr = poolAssetFelt.toString();
            if (poolAssetFeltStr === assetAddressFelt || poolAssetFeltStr === WBTC_ADDRESS.replace('0x', '')) {
              match = true;
            }
          } catch {
            // Ignore
          }
        }
        
        return match;
      });
      
      if (!wbtcAsset) {
        // First, try to find exact WBTC match
        wbtcAsset = vesuPool.assets.find((asset: ProcessedAsset) => {
          if (!asset.symbol) return false;
          const symbolUpper = asset.symbol.toUpperCase();
          return symbolUpper === 'WBTC' || symbolUpper === 'WBTC.E';
        });
        
        if (!wbtcAsset) {
          wbtcAsset = vesuPool.assets.find((asset: ProcessedAsset) => {
            if (!asset.symbol) return false;
            const symbolUpper = asset.symbol.toUpperCase();
            return (symbolUpper.includes('WBTC') || symbolUpper === 'BTC') && 
                   !symbolUpper.includes('X') &&
                   !symbolUpper.includes('XWBTC');
          });
        }
      }

      if (wbtcAsset) {
        const lendingApr = wbtcAsset.apy || 0;
        const rewardsApr = wbtcAsset.defiSpringApy || 0;
        
        
        breakdowns[pool.pool_id] = {
          lendingApr,
          rewardsApr,
        };
      } else {
        breakdowns[pool.pool_id] = null;
      }
    }

    setPoolBreakdowns(breakdowns);
  }, [pools, vesuPoolsData]);

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
                {isLoading || isVaultLoading ? '...' : `${formatTotalAssets(totalAssets || vaultData?.totalAssets)} wBTC`}
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
          <Card className="relative overflow-hidden bg-gradient-to-r from-bitcoin-orange/10 to-bitcoin-orange/5 border-bitcoin-orange/30 hover:border-bitcoin-orange/50 hover:shadow-lg hover:shadow-bitcoin-orange/10 transition-all duration-300 group">
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-bitcoin-orange">Pools</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-bitcoin-orange">
                {isLoading ? '...' : pools.length}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          key="stats-user-position"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          whileHover={{ y: -2 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-r from-bitcoin-orange/10 to-bitcoin-orange/5 border-bitcoin-orange/30 hover:border-bitcoin-orange/50 hover:shadow-lg hover:shadow-bitcoin-orange/10 transition-all duration-300 group">
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-bitcoin-orange">Your Position</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-bitcoin-orange">
                {isLoading || isVaultLoading || !userPosition ? '...' : `${userPosition.formatted} wBTC`}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Pill Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="space-y-6"
      >
        {/* Pill Nav */}
        <div className="relative w-full overflow-x-auto">
          <div className="relative inline-flex items-center gap-1 p-1 sm:p-1.5 bg-muted/50 rounded-full border border-border/50 backdrop-blur-sm min-w-max sm:min-w-0">
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={`tab-button-${tab.id}`}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                onClick={() => handleTabChange(tab.id)}
                className={`
                    relative z-10 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-colors duration-200 whitespace-nowrap flex-shrink-0
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
                className="absolute top-1 sm:top-1.5 bottom-1 sm:bottom-1.5 bg-background border border-bitcoin-orange/30 rounded-full shadow-lg shadow-bitcoin-orange/10 z-0"
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
                  <CardHeader className="relative">
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-bitcoin-orange" />
                      Vault Information
                    </CardTitle>
                    {(() => {
                      const vaultRisk = calculateVaultRisk(pools, vesuPoolsData);
                      return (
                        <Badge 
                          className={cn(
                            "absolute top-4 right-4 text-[10px] sm:text-xs whitespace-nowrap flex-shrink-0", 
                            getRiskBadgeStyle(vaultRisk)
                          )}
                        >
                          {vaultRisk} Risk
                        </Badge>
                      );
                    })()}
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
                          className="p-3 md:p-4 border rounded-lg space-y-3 hover:border-bitcoin-orange/30 hover:shadow-sm transition-all duration-200"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <Badge 
                                key={`pool-badge-${pool.pool_id}`}
                                className="bg-bitcoin-orange/20 text-bitcoin-orange border-bitcoin-orange/30 text-xs"
                              >
                                Pool {index + 1}
                              </Badge>
                              <span className="font-semibold text-sm md:text-base truncate">{poolName}</span>
                            </div>
                            {apy != null && typeof apy === 'number' && !isNaN(apy) ? (
                              <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge 
                                      key={`apy-badge-${pool.pool_id}`}
                                      className={apy > 0 
                                        ? "bg-bitcoin-gold/20 text-bitcoin-gold border-bitcoin-gold/30 cursor-help hover:bg-bitcoin-gold/30 transition-colors"
                                        : "bg-gray-500/20 text-gray-400 border-gray-500/30 cursor-help"
                                      }
                                    >
                                      {formatApy(apy)} APY
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent side="left" className="max-w-xs p-3" onPointerDownOutside={(e) => e.preventDefault()}>
                                    {(() => {
                                      const breakdown = poolBreakdowns[pool.pool_id];
                                      if (breakdown) {
                                        return (
                                          <div className="space-y-3">
                                            <div className="font-semibold text-sm">APY Breakdown</div>
                                            <div className="space-y-2.5 text-xs">
                                              <div className="space-y-1">
                                                <div className="flex items-center justify-between gap-4">
                                                  <span className="text-muted-foreground font-medium">Lending APR</span>
                                                  <span className="font-semibold text-bitcoin-gold">
                                                    {breakdown.lendingApr > 0 ? `+ ${breakdown.lendingApr.toFixed(2)}%` : `${breakdown.lendingApr.toFixed(2)}%`}
                                                  </span>
                                                </div>
                                                <p className="text-muted-foreground text-[10px] leading-tight pl-1">
                                                  Yield from lending on Vesu minus pool fee.
                                                </p>
                                              </div>
                                              <div className="space-y-1">
                                                <div className="flex items-center justify-between gap-4">
                                                  <span className="text-muted-foreground font-medium">Rewards APR</span>
                                                  <span className="font-semibold text-bitcoin-orange">
                                                    {breakdown.rewardsApr > 0 ? `+ ${breakdown.rewardsApr.toFixed(2)}%` : `${breakdown.rewardsApr.toFixed(2)}%`}
                                                  </span>
                                                </div>
                                                <p className="text-muted-foreground text-[10px] leading-tight pl-1">
                                                  Yield from the BTCFi rewards program.
                                                </p>
                                              </div>
                                              <div className="border-t border-border/50 pt-2 mt-2">
                                                <div className="flex items-center justify-between gap-4">
                                                  <span className="text-muted-foreground font-semibold">Total APY</span>
                                                  <span className="font-bold text-foreground">
                                                    ≈ {formatApy(apy)}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="text-[10px] text-muted-foreground pt-2 border-t border-border/50 leading-tight">
                                              APR and its components are subject to change.
                                            </div>
                                          </div>
                                        );
                                      }
                                      return (
                                        <div className="text-xs">
                                          <div className="font-semibold mb-1">Total APY</div>
                                          <div className="text-muted-foreground">{formatApy(apy)}</div>
                                          <p className="text-[10px] text-muted-foreground mt-1">
                                            Loading breakdown...
                                          </p>
                                        </div>
                                      );
                                    })()}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
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
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm">
                            <div>
                              <p className="text-xs md:text-sm text-muted-foreground mb-1">Pool Address</p>
                              <p className="font-mono text-[10px] md:text-xs break-all">{pool.pool_id}</p>
                            </div>
                            <div>
                              <p className="text-xs md:text-sm text-muted-foreground mb-1">vToken Address</p>
                              <p className="font-mono text-[10px] md:text-xs break-all">{pool.v_token}</p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 border-t gap-2 sm:gap-0">
                            <div>
                              <p className="text-xs md:text-sm text-muted-foreground">Pool Balance</p>
                              <p className="text-sm md:text-base font-semibold">
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
                              <p className="text-xs md:text-sm text-muted-foreground">Max Weight</p>
                              <p className="text-sm md:text-base font-semibold">{(pool.max_weight / 100).toFixed(0)}%</p>
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

