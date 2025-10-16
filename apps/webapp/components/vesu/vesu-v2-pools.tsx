"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  ArrowRight, 
  Shield, 
  Coins, 
  Star, 
  Target, 
  Users,
  Zap,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getVesuV2Pools, getVesuV2Vaults, getVesuV2Strategies } from '@/app/api/vesuApi';
import type { VesuV2Pool } from '@/types/VesuPools';
import { formatApy, calculateRiskLevel } from '@/lib/vesu-config';

interface VesuV2PoolsProps {
  onPoolSelect?: (pool: VesuV2Pool) => void;
  showTestnetBanner?: boolean;
}

export function VesuV2Pools({ onPoolSelect, showTestnetBanner = false }: VesuV2PoolsProps) {
  const [pools, setPools] = useState<VesuV2Pool[]>([]);
  const [vaults, setVaults] = useState<any[]>([]);
  const [strategies, setStrategies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchVesuV2Data = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('🚀 Fetching Vesu V2 data...');
        
        // Fetch V2 pools, vaults, and strategies in parallel
        const [poolsData, vaultsData, strategiesData] = await Promise.all([
          getVesuV2Pools(),
          getVesuV2Vaults(),
          getVesuV2Strategies()
        ]);

        console.log('📊 Vesu V2 Pools:', poolsData);
        console.log('🏦 Vesu V2 Vaults:', vaultsData);
        console.log('📈 Vesu V2 Strategies:', strategiesData);

        setPools(poolsData);
        setVaults(vaultsData);
        setStrategies(strategiesData);

        toast({
          title: "Vesu V2 Data Loaded",
          description: `Loaded ${poolsData.length} V2 pools, ${vaultsData.length} vaults, and ${strategiesData.length} strategies`,
        });

      } catch (err) {
        console.error('❌ Error fetching Vesu V2 data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load Vesu V2 data');
        
        toast({
          title: "V2 API Not Available",
          description: "Using mock V2 data for demonstration. Real V2 API will be available soon.",
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

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <h3 className="font-medium text-yellow-600">V2 API Not Available</h3>
                <p className="text-sm text-muted-foreground">
                  The Vesu V2 API is not yet available. Using mock data for demonstration purposes.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Real V2 data will be available when the API is deployed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Show mock data anyway */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pools.map((pool) => (
            <Card key={pool.id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-green-300 dark:hover:border-green-700">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg group-hover:text-green-600 transition-colors">
                      {pool.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        V2 (Mock)
                      </Badge>
                      <span className="text-xs">Pool Factory</span>
                    </CardDescription>
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <Activity className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Pool Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Assets</p>
                    <p className="text-lg font-bold">{pool.assets.length}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">TVL</p>
                    <p className="text-lg font-bold">
                      {pool.totalValueLocked ? `$${pool.totalValueLocked.toLocaleString()}` : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Assets Preview */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Supported Assets</p>
                  <div className="flex flex-wrap gap-1">
                    {pool.assets.slice(0, 3).map((asset, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {asset.symbol}
                      </Badge>
                    ))}
                    {pool.assets.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{pool.assets.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Risk Level */}
                {pool.assets[0]?.riskLevel && (
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <Badge className={getRiskColor(pool.assets[0].riskLevel)}>
                      {pool.assets[0].riskLevel} Risk
                    </Badge>
                  </div>
                )}

                {/* Action Button */}
                <Button 
                  onClick={() => onPoolSelect?.(pool)}
                  className="w-full group-hover:bg-green-600 group-hover:text-white transition-colors"
                  variant="outline"
                >
                  <span>Select V2 Pool (Mock)</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
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
              <p className="font-medium text-yellow-600 dark:text-yellow-400">Vesu V2 Testnet</p>
              <p className="text-sm text-foreground">
                This interface shows Vesu V2 pools and strategies. V2 introduces new features like vaults, 
                advanced strategies, and improved risk management.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* V2 Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Coins className="h-5 w-5 text-blue-600" />
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pools.map((pool) => (
          <Card key={pool.id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-300 dark:hover:border-blue-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                    {pool.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      V2
                    </Badge>
                    <span className="text-xs">Pool Factory</span>
                  </CardDescription>
                </div>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Activity className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Pool Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assets</p>
                  <p className="text-lg font-bold">{pool.assets.length}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">TVL</p>
                  <p className="text-lg font-bold">
                    {pool.totalValueLocked ? `$${pool.totalValueLocked.toLocaleString()}` : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Assets Preview */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Supported Assets</p>
                <div className="flex flex-wrap gap-1">
                  {pool.assets.slice(0, 3).map((asset, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {asset.symbol}
                    </Badge>
                  ))}
                  {pool.assets.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{pool.assets.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Risk Level */}
              {pool.assets[0]?.riskLevel && (
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <Badge className={getRiskColor(pool.assets[0].riskLevel)}>
                    {pool.assets[0].riskLevel} Risk
                  </Badge>
                </div>
              )}

              {/* Action Button */}
              <Button 
                onClick={() => onPoolSelect?.(pool)}
                className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors"
                variant="outline"
              >
                <span>Select V2 Pool</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {pools.length === 0 && !isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="font-medium">No V2 Pools Available</h3>
                <p className="text-sm text-muted-foreground">
                  Vesu V2 pools are not yet available or there was an issue loading them.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
