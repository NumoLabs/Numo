'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { TrendingUp, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface VaultPool {
  poolId: string;
  poolName: string;
  apy: number | null;
  balance?: bigint;
}

export interface VaultCardProps {
  id: string;
  name: string;
  totalAssets: bigint | null;
  pools: VaultPool[];
  isLoading?: boolean;
}

export function VaultCard({
  id,
  name,
  totalAssets,
  pools,
  isLoading = false,
}: VaultCardProps) {
  const router = useRouter();

  // Safe APY formatter
  const formatApy = (apy: number | null | undefined): string => {
    if (apy == null || typeof apy !== 'number' || isNaN(apy)) {
      return 'N/A';
    }
    return `${apy.toFixed(2)}%`;
  };

  // Calculate average APY from all pools
  const avgApy = (() => {
    const validApys = pools
      .map((pool) => pool.apy)
      .filter((apy): apy is number => typeof apy === 'number' && apy != null && !isNaN(apy));
    if (validApys.length === 0) return 0;
    return validApys.reduce((sum, apy) => sum + apy, 0) / validApys.length;
  })();

  // Format total assets
  const formatTotalAssets = (assets: bigint | null | undefined): string => {
    // Handle null, undefined, or zero values
    if (assets === null || assets === undefined || assets === BigInt(0)) {
      return '0.0000';
    }
    
    try {
      // wBTC has 8 decimals
      const decimalValue = Number(assets) / 1e8;
      
      // Handle very small values with more precision
      if (decimalValue > 0 && decimalValue < 0.0001) {
        return decimalValue.toFixed(8);
      }
      
      // Format with 4 decimal places for normal values
      return decimalValue.toFixed(4);
    } catch (error) {
      console.error('Error formatting total assets:', error, assets);
      return '0.0000';
    }
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 group cursor-pointer",
        "hover:shadow-lg hover:shadow-bitcoin-orange/10 hover:border-bitcoin-orange/40",
        "flex flex-col md:flex-row items-stretch md:items-center justify-between",
        "h-auto md:h-20 p-3 md:p-0",
        "border border-border/50 hover:border-bitcoin-orange/30"
      )}
      onClick={() => router.push(`/vaults/${id}`)}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      {/* Gradient glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-bitcoin-orange/0 via-bitcoin-orange/5 to-bitcoin-orange/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Mobile Layout */}
      <div className="flex flex-row items-center justify-between md:hidden relative z-10 mb-2">
        {/* Vault Icon */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Image 
              src="/wbtc-icon.png" 
              alt="Vault" 
              width={28} 
              height={28}
              className="object-contain"
            />
          </motion.div>
          <div className="flex flex-col min-w-0">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Vault</p>
            <h3 className="text-xs font-semibold truncate group-hover:text-bitcoin-orange transition-colors duration-300">
              {name}
            </h3>
          </div>
        </div>

        {/* View Button - Mobile */}
        <Button
          variant="default"
          size="sm"
          className="text-xs px-3 py-1.5 h-auto group-hover:bg-bitcoin-orange group-hover:shadow-md group-hover:shadow-bitcoin-orange/20 transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/vaults/${id}`);
          }}
        >
          View
        </Button>
      </div>

      {/* Stats Grid - Mobile */}
      <div className="grid grid-cols-4 gap-2 md:hidden relative z-10">
        <div className="flex flex-col items-center">
          <Coins className="h-3 w-3 text-muted-foreground group-hover:text-bitcoin-gold transition-colors mb-1" />
          <p className="text-[10px] font-medium text-muted-foreground uppercase">Asset</p>
          <span className="text-xs font-semibold">wBTC</span>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-[10px] font-medium text-muted-foreground uppercase mb-1">Pools</p>
          <span className="text-xs font-semibold">{pools.length}</span>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-[10px] font-medium text-muted-foreground uppercase mb-1">APY</p>
          {isLoading ? (
            <span className="inline-block w-8 h-3 bg-muted rounded animate-pulse" />
          ) : (
            <span className="text-xs font-semibold text-bitcoin-gold">
              {formatApy(avgApy > 0 ? avgApy : null)}
            </span>
          )}
        </div>
        <div className="flex flex-col items-center">
          <p className="text-[10px] font-medium text-muted-foreground uppercase mb-1">TVL</p>
          {isLoading || totalAssets === null || totalAssets === undefined ? (
            <span className="inline-block w-10 h-3 bg-muted rounded animate-pulse" />
          ) : (
            <span className="text-xs font-semibold text-bitcoin-orange text-center leading-tight">
              {formatTotalAssets(totalAssets)}
            </span>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      {/* Vault Icon */}
      <div className="hidden md:flex items-center gap-3 min-w-0 flex-shrink-0 px-4 relative z-10">
        <motion.div 
          className="mr-2"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <Image 
            src="/wbtc-icon.png" 
            alt="Vault" 
            width={35} 
            height={35}
            className="object-contain"
          />
        </motion.div>
        <div className="flex flex-col min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">Vault</p>
          <h3 className="text-sm font-semibold truncate group-hover:text-bitcoin-orange transition-colors duration-300">
            {name}
          </h3>
        </div>
      </div>

      {/* Assets */}
      <div className="hidden md:flex flex-col items-center min-w-[70px] flex-shrink-0 relative z-10">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">Assets</p>
        <div className="flex items-center gap-1.5 group-hover:gap-2 transition-all">
          <Coins className="h-3.5 w-3.5 text-muted-foreground group-hover:text-bitcoin-gold transition-colors" />
          <span className="text-xs font-medium">wBTC</span>
        </div>
      </div>

      {/* Pools Count */}
      <div className="hidden md:flex flex-col items-center min-w-[70px] flex-shrink-0 relative z-10">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">Pools</p>
        <span className="text-sm font-semibold group-hover:scale-110 transition-transform inline-block">{pools.length}</span>
      </div>

      {/* APY */}
      <div className="hidden md:flex flex-col items-center min-w-[90px] flex-shrink-0 relative z-10">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">APY</p>
        <div className="flex items-center gap-1">
          {isLoading ? (
            <span className="inline-block w-12 h-4 bg-muted rounded animate-pulse" />
          ) : (
            <>
              <span className="text-sm font-semibold text-bitcoin-gold group-hover:text-bitcoin-orange transition-colors">
                {formatApy(avgApy > 0 ? avgApy : null)}
              </span>
              <TrendingUp className="h-3 w-3 text-bitcoin-gold opacity-70 group-hover:opacity-100 group-hover:translate-y-[-2px] transition-all" />
            </>
          )}
        </div>
      </div>

      {/* TVL */}
      <div className="hidden md:flex flex-col items-center min-w-[110px] flex-shrink-0 relative z-10">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">TVL</p>
        {isLoading || totalAssets === null || totalAssets === undefined ? (
          <span className="inline-block w-16 h-4 bg-muted rounded animate-pulse" />
        ) : (
          <span className="text-sm font-semibold text-bitcoin-orange group-hover:scale-105 transition-transform inline-block">
            {formatTotalAssets(totalAssets)} wBTC
          </span>
        )}
      </div>

      {/* View Button */}
      <div className="hidden md:flex items-center min-w-[80px] flex-shrink-0 px-4 relative z-10 mr-8">
        <Button
          variant="default"
          size="sm"
          className="group-hover:bg-bitcoin-orange group-hover:shadow-md group-hover:shadow-bitcoin-orange/20 transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/vaults/${id}`);
          }}
        >
          View
        </Button>
      </div>
    </Card>
  );
}