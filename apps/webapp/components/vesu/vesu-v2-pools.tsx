"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Coins, 
  Zap,
  Activity,
  AlertTriangle,
  Info
} from 'lucide-react'; 
import { useToast } from '@/hooks/use-toast';
import { getVesuV2Pools, getVesuV2Vaults, getVesuV2Strategies } from '@/app/api/vesuApi';
import type { VesuV2Pool } from '@/types/VesuPools';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface VesuV2PoolsProps {
  onPoolSelect?: (pool: VesuV2Pool) => void;
  showTestnetBanner?: boolean;
}

export function VesuV2Pools({ onPoolSelect, showTestnetBanner = false }: VesuV2PoolsProps) {
  const [pools, setPools] = useState<VesuV2Pool[]>([]);
  const [vaults, setVaults] = useState<unknown[]>([]);
  const [strategies, setStrategies] = useState<unknown[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchVesuV2Data = async () => {
      try {
        setIsLoading(true);
        setIsUsingMockData(false);

        console.log('🚀 Fetching Vesu V2 data...');
        
        // Fetch V2 pools, vaults, and strategies in parallel
        // Use Promise.allSettled to handle partial failures gracefully
        const [poolsResult, vaultsResult, strategiesResult] = await Promise.allSettled([
          getVesuV2Pools(),
          getVesuV2Vaults(),
          getVesuV2Strategies()
        ]);

        // Extract data from results, handling both fulfilled and rejected promises
        const poolsData = poolsResult.status === 'fulfilled' ? poolsResult.value : [];
        const vaultsData = vaultsResult.status === 'fulfilled' ? vaultsResult.value : [];
        const strategiesData = strategiesResult.status === 'fulfilled' ? strategiesResult.value : [];

        // Check if we're using mock data (all APIs failed or returned empty)
        const allFailed = 
          poolsResult.status === 'rejected' && 
          vaultsResult.status === 'rejected' && 
          strategiesResult.status === 'rejected';

        // If we have data but all requests failed, we're likely using mock data
        if (allFailed || (poolsData.length > 0 && poolsResult.status === 'rejected')) {
          setIsUsingMockData(true);
        }

        console.log('📊 Vesu V2 Data loaded:', {
          pools: poolsData.length,
          vaults: vaultsData.length,
          strategies: strategiesData.length,
          isMock: allFailed
        });

        setPools(poolsData);
        setVaults(vaultsData);
        setStrategies(strategiesData);

        // Only show toast if we have real data
        if (!allFailed && poolsData.length > 0) {
          toast({
            title: "Vesu V2 Data Loaded",
            description: `Loaded ${poolsData.length} V2 pools, ${vaultsData.length} vaults, and ${strategiesData.length} strategies`,
          });
        } else if (allFailed) {
          toast({
            title: "V2 API Not Available",
            description: "Using demonstration data. Real V2 API will be available soon.",
            variant: "default",
          });
        }

      } catch (err) {
        console.error('❌ Error fetching Vesu V2 data:', err);
        setIsUsingMockData(true);
        
        toast({
          title: "V2 API Not Available",
          description: "Using demonstration data. Real V2 API will be available soon.",
          variant: "default",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVesuV2Data();
  }, [toast]);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 'bg-green-500 text-white dark:bg-green-600 dark:text-white border-green-600';
      case 'medium': return 'bg-yellow-500 text-white dark:bg-yellow-600 dark:text-white border-yellow-600';
      case 'high': return 'bg-red-500 text-white dark:bg-red-600 dark:text-white border-red-600';
      case 'critical': return 'bg-red-600 text-white dark:bg-red-700 dark:text-white border-red-700';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {showTestnetBanner && (
          <div className="rounded-lg border p-4 bg-gradient-to-r from-yellow-100/10 to-orange-100/10 dark:from-yellow-900/5 dark:to-orange-900/5 border-yellow-300/30 dark:border-yellow-700/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="font-medium text-yellow-600 dark:text-yellow-400">Vesu V2 Testnet</p>
                <p className="text-sm text-foreground">
                  This interface shows Vesu V2 pools and strategies. V2 introduces new features like vaults, 
                  advanced strategies, and improved risk management.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showTestnetBanner && (
        <div className="rounded-lg border p-4 bg-gradient-to-r from-yellow-100/10 to-orange-100/10 dark:from-yellow-900/5 dark:to-orange-900/5 border-yellow-300/30 dark:border-yellow-700/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-medium text-yellow-600 dark:text-yellow-400">Vesu V2</p>
              <p className="text-sm text-foreground">
                This interface shows Vesu V2 pools and strategies. V2 introduces new features like vaults, 
                advanced strategies, and improved risk management.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Show warning if using mock data */}
      {isUsingMockData && pools.length > 0 && (
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <h3 className="font-medium text-yellow-600">V2 API Not Available</h3>
                <p className="text-sm text-muted-foreground">
                  The Vesu V2 API is not yet available. Showing demonstration data for preview purposes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* V2 Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Coins className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">V2 Pools</p>
                <p className="text-2xl font-bold">{pools.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">V2 Vaults</p>
                <p className="text-2xl font-bold">{vaults.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Zap className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">V2 Strategies</p>
                <p className="text-2xl font-bold">{strategies.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* V2 Pools Grid */}
      {pools.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pools.map((pool) => (
            <Card key={pool.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{pool.name}</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Info className="h-4 w-4" />
                          <span className="sr-only">Information</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Click on &quot;View Details&quot; to get more information about this pool, including risks, strategies
                          and historical performance.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <CardDescription>
                  {pool.assets.map(a => a.symbol).join('/')} liquidity pool on Vesu with automatic rebalancing
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">APY</p>
                    <p className="text-lg font-semibold">
                      {pool.assets.length > 0 
                        ? `${(pool.assets.reduce((sum, asset) => sum + asset.apy, 0) / pool.assets.length).toFixed(2)}%`
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">TVL</p>
                    <p className="text-lg font-semibold">
                      {pool.totalValueLocked 
                        ? pool.totalValueLocked >= 1000000
                          ? `$${(pool.totalValueLocked / 1000000).toFixed(1)}M`
                          : `$${pool.totalValueLocked.toLocaleString()}`
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Vesu</Badge>
                  {pool.assets[0]?.riskLevel && (
                    <Badge className={getRiskColor(pool.assets[0].riskLevel)}>
                      {pool.assets[0].riskLevel}
                    </Badge>
                  )}
                  {pool.assets.slice(0, 2).map((asset, index) => (
                    <Badge key={index} variant="outline">
                      {asset.symbol}
                    </Badge>
                  ))}
                  {pool.assets.length > 2 && (
                    <Badge variant="outline">
                      +{pool.assets.length - 2}
                    </Badge>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button 
                  onClick={() => onPoolSelect?.(pool)}
                  variant="outline"
                  size="sm"
                  disabled={isUsingMockData}
                >
                  View Details
                </Button>
                <Button 
                  onClick={() => onPoolSelect?.(pool)}
                  size="sm"
                  disabled={isUsingMockData}
                >
                  Add to Vault
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="font-medium">No V2 Pools Available</h3>
                <p className="text-sm text-muted-foreground">
                  Vesu V2 pools are not yet available. The V2 API endpoint is not implemented yet.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
