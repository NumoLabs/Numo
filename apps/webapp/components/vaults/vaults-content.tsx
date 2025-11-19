'use client';

import { useState, useMemo } from 'react';
import { useAccount } from '@starknet-react/core';
import { useWallet } from '@/hooks/use-wallet';
import { motion } from 'framer-motion';
import { VaultCard, type VaultPool } from './vault-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Briefcase, Search, Loader2, AlertCircle, Wallet, TrendingUp, Zap, Sparkles } from 'lucide-react';
import {
  useVaultPools,
  useVesuPoolsData,
  usePoolYields,
  usePoolBalances,
  useVaultTotalAssets,
} from '@/hooks/use-vault-queries';

export function VaultsContent() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isConnecting } = useWallet();
  const [selectedConnector, setSelectedConnector] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleConnect = async (connectorId: string) => {
    setSelectedConnector(connectorId);
    try {
      const connector = connectors.find(c => c.id === connectorId);
      if (connector) {
        await connect({ connector });
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setSelectedConnector(null);
    }
  };

  const formatAddress = (addr: string | undefined) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // React Query hooks
  const { data: pools, isLoading: isLoadingPools } = useVaultPools();
  const { data: vesuPoolsData } = useVesuPoolsData();
  const yieldQueries = usePoolYields(pools ?? null);
  const balanceQueries = usePoolBalances(pools ?? null);
  const { data: totalAssets, isLoading: isLoadingTotalAssets } = useVaultTotalAssets();

  // Transform query results into usable data
  const poolYields = useMemo(() => {
    const yields: Record<string, number | null> = {};
    yieldQueries.forEach((query) => {
      if (query.data) {
        yields[query.data.poolId] = query.data.yield;
      }
    });
    return yields;
  }, [yieldQueries]);

  const poolBalances = useMemo(() => {
    const balances: Record<string, bigint> = {};
    balanceQueries.forEach((query) => {
      if (query.data) {
        balances[query.data.poolId] = query.data.balance;
      }
    });
    return balances;
  }, [balanceQueries]);

  // Create pool map from Vesu API
  const poolMap = useMemo(() => {
    const map = new Map<string, string>();
    if (vesuPoolsData) {
      vesuPoolsData.forEach((pool: { id: string; name: string }) => {
        map.set(pool.id.toLowerCase(), pool.name);
      });
    }
    return map;
  }, [vesuPoolsData]);

  // Create vaults data
  const vaults = useMemo(() => {
    if (!pools || pools.length === 0) return [];

    const vaultPools: VaultPool[] = pools.map((pool) => {
      const poolName = poolMap.get(pool.pool_id.toLowerCase()) || `Pool ${pool.pool_id.slice(0, 8)}...`;
      return {
        poolId: pool.pool_id,
        poolName,
        apy: poolYields[pool.pool_id] ?? null,
        balance: poolBalances[pool.pool_id],
      };
    });

    return [
      {
        id: 'numo-vault',
        name: 'Numo Vault',
        totalAssets: totalAssets ?? null,
        pools: vaultPools,
        isLoading: isLoadingPools || yieldQueries.some((q) => q.isLoading) || balanceQueries.some((q) => q.isLoading),
      },
    ];
  }, [pools, poolMap, poolYields, poolBalances, totalAssets, isLoadingPools, yieldQueries, balanceQueries]);

  const isLoading = isLoadingPools || yieldQueries.some((q) => q.isLoading) || balanceQueries.some((q) => q.isLoading) || isLoadingTotalAssets;

  // Filter vaults based on search term
  const filteredVaults = useMemo(() => {
    if (!searchTerm) return vaults;
    const term = searchTerm.toLowerCase();
    return vaults.filter((vault) =>
      vault.name.toLowerCase().includes(term) ||
      vault.pools.some((pool) => pool.poolName.toLowerCase().includes(term))
    );
  }, [vaults, searchTerm]);

  // Calculate total TVL across all vaults
  const totalTVL = useMemo(() => {
    if (vaults.length === 0) return 0;
    
    console.log('[VaultsContent] Calculating totalTVL', { 
      vaultsCount: vaults.length, 
      vaults: vaults.map(v => ({ 
        id: v.id, 
        name: v.name,
        totalAssets: v.totalAssets,
        totalAssetsFormatted: v.totalAssets ? (Number(v.totalAssets) / 1e8).toFixed(8) : 'null'
      }))
    });
    
    const result = vaults.reduce((sum, vault) => {
      // Handle null, undefined, or BigInt(0) values
      if (vault.totalAssets === null || vault.totalAssets === undefined) {
        console.log(`[VaultsContent] Skipping vault ${vault.id} - totalAssets is null/undefined`);
        return sum;
      }
      
      try {
        // Convert bigint to number (wBTC has 8 decimals)
        const vaultTVL = Number(vault.totalAssets) / 1e8;
        
        // Validate the conversion
        if (isNaN(vaultTVL) || vaultTVL < 0) {
          console.warn(`[VaultsContent] Invalid TVL for vault ${vault.id}:`, vault.totalAssets, vaultTVL);
          return sum;
        }
        
        console.log(`[VaultsContent] Adding vault ${vault.id} TVL:`, vaultTVL, 'wBTC');
        return sum + vaultTVL;
      } catch (error) {
        console.error(`[VaultsContent] Error calculating TVL for vault ${vault.id}:`, error, vault.totalAssets);
        return sum;
      }
    }, 0);
    
    console.log('[VaultsContent] Total TVL calculated:', result, 'wBTC');
    return result;
  }, [vaults]);

  // Calculate average APY across all vaults
  const avgApy = useMemo(() => {
    const allApys = vaults.flatMap((vault) =>
      vault.pools.map((pool) => pool.apy).filter((apy) => apy !== null) as number[]
    );
    if (allApys.length === 0) return 0;
    return allApys.reduce((sum, apy) => sum + apy, 0) / allApys.length;
  }, [vaults]);

  if (!isConnected) {
    return (
      <div className="relative space-y-8 min-h-screen">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-bitcoin-orange/20 via-bitcoin-orange/10 to-transparent rounded-full blur-3xl"
            animate={{ 
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-bitcoin-gold/20 via-bitcoin-gold/10 to-transparent rounded-full blur-3xl"
            animate={{ 
              x: [0, -40, 0],
              y: [0, 40, 0],
              scale: [1, 0.9, 1],
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            <div className="absolute -left-4 -top-4 w-32 h-32 bg-bitcoin-orange/10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-3 -mt-6">
                <h1 className="text-4xl md:text-3x1 font-bold tracking-tight">
                  Vaults
                </h1>
              </div>
              <p className="text-gray-400 mt-2 text-lg ml-2">
                Connect your wallet to explore and interact with yield farming vaults
              </p>
            </div>
          </div>
        </motion.div>

        {/* Wallet Connection Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
        <Card className="relative overflow-hidden border-2 border-bitcoin-orange/40 bg-gradient-to-br from-bitcoin-orange/10 via-bitcoin-gold/5 to-gray-900/50 backdrop-blur-md shadow-xl shadow-bitcoin-orange/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-bitcoin-orange/20 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-bitcoin-gold/15 rounded-full blur-2xl -ml-24 -mb-24" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-bitcoin-orange text-xl">
              Connect StarkNet Wallet
            </CardTitle>
            <CardDescription className="text-gray-300 mt-2">
              Connect your StarkNet wallet to view and interact with vaults
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 relative z-10">
            <Alert className="border-2 border-bitcoin-orange/40 bg-gradient-to-r from-bitcoin-orange/15 to-bitcoin-orange/10 backdrop-blur-sm">
              <AlertCircle className="h-5 w-5 text-bitcoin-orange" />
              <AlertDescription className="text-bitcoin-orange font-medium">
                Please connect your StarkNet wallet to view available vaults
              </AlertDescription>
            </Alert>

            {/* Wallet Options */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-gray-300 uppercase tracking-wider">Available Wallets</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {connectors.map((connector) => (
                  <Button
                    key={connector.id}
                    onClick={() => handleConnect(connector.id)}
                    disabled={isConnecting || selectedConnector === connector.id}
                    className="w-full justify-start h-14 bg-gradient-to-r from-bitcoin-orange/15 to-bitcoin-gold/10 hover:from-bitcoin-orange/25 hover:to-bitcoin-gold/15 border-2 border-bitcoin-orange/30 hover:border-bitcoin-orange/50 text-bitcoin-orange font-medium rounded-xl transition-all duration-300 shadow-lg shadow-bitcoin-orange/10 hover:shadow-xl hover:shadow-bitcoin-orange/20 disabled:opacity-50"
                    variant="outline"
                  >
                    {selectedConnector === connector.id ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Wallet className="mr-2 h-5 w-5" />
                        {connector.name}
                      </>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="text-xs text-gray-400 space-y-2 pt-4 border-t border-gray-700/50">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-bitcoin-orange" />
                <p>Supported wallets: Argent, Braavos</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-bitcoin-gold" />
                <p>Make sure you&apos;re on StarkNet Mainnet</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-bitcoin-orange" />
                <p>You&apos;ll need wBTC to make deposits</p>
              </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen space-y-8 -mt-12">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-bitcoin-orange/20 via-bitcoin-orange/10 to-transparent rounded-full blur-3xl"
          animate={{ 
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-bitcoin-gold/20 via-bitcoin-gold/10 to-transparent rounded-full blur-3xl"
          animate={{ 
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-br from-orange-500/15 via-yellow-500/10 to-transparent rounded-full blur-3xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Header */}
      <motion.div 
        className="relative flex flex-col md:flex-row md:items-center md:justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col mb-4 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mt-8">
            Vaults
          </h1>
          <p className="text-sm text-muted-foreground mt-4">
            Explore yield farming vaults and optimize your returns
          </p>
        </div>
        {/* Connected Wallet Info */}
        {isConnected && address && (
          <motion.div 
            className="relative flex items-center gap-2 px-2 md:px-3 py-2 rounded-lg border border-green-500/30 bg-green-500/10 backdrop-blur-sm hover:border-green-500/50 hover:shadow-md hover:shadow-green-500/20 transition-all duration-300 group overflow-visible md:overflow-hidden flex-shrink-0 min-w-fit w-fit md:w-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Pulsing glow effect */}
            <motion.div 
              className="absolute inset-0 bg-green-500/20 rounded-lg"
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <div className="w-2 h-2 rounded-full bg-green-500 relative z-10 shadow-lg shadow-green-500/50 flex-shrink-0" />
            <span className="text-xs font-medium text-green-400 font-mono relative z-10 whitespace-nowrap">
              {formatAddress(address)}
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ y: -2 }}
        >
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Total Vaults
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vaults.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active vaults</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ y: -2 }}
        >
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Total TVL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading || vaults.length === 0 ? (
                  <span className="inline-block w-24 h-6 bg-muted rounded animate-pulse" />
                ) : (
                  (() => {
                    // Handle zero or very small values
                    if (totalTVL === 0) {
                      return '0.0000 wBTC';
                    }
                    
                    // Show more decimal places for very small values
                    if (totalTVL > 0 && totalTVL < 0.0001) {
                      return `${totalTVL.toFixed(8)} wBTC`;
                    }
                    
                    // Format with 4 decimal places for normal values
                    return `${totalTVL.toFixed(4)} wBTC`;
                  })()
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total value locked {vaults.length > 1 ? `across ${vaults.length} vaults` : ''}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          whileHover={{ y: -2 }}
        >
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Average APY
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <span className="inline-block w-16 h-6 bg-muted rounded animate-pulse" />
                ) : (
                  `${avgApy.toFixed(2)}%`
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Average yield</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Alert className="relative overflow-hidden border border-bitcoin-gold/20 bg-bitcoin-gold/5 hover:border-bitcoin-gold/30 hover:shadow-md transition-all duration-300 group">
          {/* Gradient border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-bitcoin-gold/0 via-bitcoin-gold/20 to-bitcoin-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Sparkles className="h-4 w-4 text-bitcoin-gold relative z-10" />
          <AlertDescription className="text-sm relative z-10">
            <strong className="text-bitcoin-gold font-semibold">New to Vaults?</strong>{' '}
            Deposit your wBTC into the vault and manually rebalance your funds across multiple pools.
          </AlertDescription>
        </Alert>
      </motion.div>

      {/* Search */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground -translate-y-1/2 group-hover:text-bitcoin-orange transition-colors z-10" />
          <Input
            type="search"
            placeholder="Search vaults by name or pool..."
            className="pl-9 h-10 transition-all duration-300 focus:border-bitcoin-orange/50 focus:ring-2 focus:ring-bitcoin-orange/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Glow effect on focus */}
          <div className="absolute inset-0 rounded-md bg-gradient-to-r from-bitcoin-orange/0 via-bitcoin-orange/10 to-bitcoin-orange/0 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-300 -z-10" />
        </div>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredVaults.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm">
              {searchTerm ? 'No vaults found matching your search' : 'No vaults available'}
            </p>
          </CardContent>
        </Card>
      )}

      {!isLoading && filteredVaults.length > 0 && (
        <div className="space-y-3">
          {filteredVaults.map((vault, index) => (
            <motion.div
              key={vault.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
            >
              <VaultCard
                id={vault.id}
                name={vault.name}
                totalAssets={vault.totalAssets}
                pools={vault.pools}
                isLoading={vault.isLoading}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

