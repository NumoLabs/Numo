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
        "flex flex-row items-center justify-between min-h-[80px] md:h-20 p-3 md:p-0",
        "border border-border/50 hover:border-bitcoin-orange/30"
      )}
      onClick={() => router.push(`/vaults/${id}`)}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      {/* Gradient glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-bitcoin-orange/0 via-bitcoin-orange/5 to-bitcoin-orange/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Vault Icon */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1 px-2 md:px-4 relative z-10">
        <motion.div 
          className="flex-shrink-0"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <Image 
            src="/wbtc-icon.png" 
            alt="Vault" 
            width={30}
            height={30}
            className="md:w-[35px] md:h-[35px] object-contain"
          />
        </motion.div>
        <div className="flex flex-col min-w-0 flex-1">
          <p className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">Vault</p>
          <h3 className="text-xs md:text-sm font-semibold truncate group-hover:text-bitcoin-orange transition-colors duration-300">
            {name}
          </h3>
        </div>
      </div>

      {/* Assets */}
      <div className="flex flex-col items-center min-w-[50px] md:min-w-[70px] flex-shrink-0 relative z-10 px-1 md:px-0">
        <p className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">Assets</p>
        <div className="flex items-center gap-1 md:gap-1.5 group-hover:gap-2 transition-all">
          <Coins className="h-3 w-3 md:h-3.5 md:w-3.5 text-muted-foreground group-hover:text-bitcoin-gold transition-colors" />
          <span className="text-[10px] md:text-xs font-medium">wBTC</span>
        </div>
      </div>

      {/* Pools Count */}
      <div className="flex flex-col items-center min-w-[50px] md:min-w-[70px] flex-shrink-0 relative z-10 px-1 md:px-0">
        <p className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">Pools</p>
        <span className="text-xs md:text-sm font-semibold group-hover:scale-110 transition-transform inline-block">{pools.length}</span>
      </div>

      {/* APY */}
      <div className="flex flex-col items-center min-w-[60px] md:min-w-[90px] flex-shrink-0 relative z-10 px-1 md:px-0">
        <p className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">APY</p>
        <div className="flex items-center gap-0.5 md:gap-1">
          {isLoading ? (
            <span className="inline-block w-10 md:w-12 h-3 md:h-4 bg-muted rounded animate-pulse" />
          ) : (
            <>
              <span className="text-xs md:text-sm font-semibold text-bitcoin-gold group-hover:text-bitcoin-orange transition-colors">
                {formatApy(avgApy > 0 ? avgApy : null)}
              </span>
              <TrendingUp className="h-2.5 w-2.5 md:h-3 md:w-3 text-bitcoin-gold opacity-70 group-hover:opacity-100 group-hover:translate-y-[-2px] transition-all" />
            </>
          )}
        </div>
      </div>

      {/* TVL */}
      <div className="hidden sm:flex flex-col items-center min-w-[80px] md:min-w-[110px] flex-shrink-0 relative z-10">
        <p className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">TVL</p>
        {isLoading || totalAssets === null || totalAssets === undefined ? (
          <span className="inline-block w-12 md:w-16 h-3 md:h-4 bg-muted rounded animate-pulse" />
        ) : (
          <span className="text-xs md:text-sm font-semibold text-bitcoin-orange group-hover:scale-105 transition-transform inline-block text-center break-words max-w-[80px] md:max-w-none">
            {formatTotalAssets(totalAssets)} wBTC
          </span>
        )}
      </div>

      {/* View Button */}
      <div className="flex items-center min-w-[60px] md:min-w-[80px] flex-shrink-0 px-2 md:px-4 relative z-10 md:mr-8">
        <Button
          variant="default"
          size="sm"
          className="group-hover:bg-bitcoin-orange group-hover:shadow-md group-hover:shadow-bitcoin-orange/20 transition-all duration-300 text-xs md:text-sm px-2 md:px-3 h-7 md:h-9"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/vaults/${id}`);
          }}
        >
          <span className="hidden sm:inline">View</span>
          <span className="sm:hidden">→</span>
        </Button>
      </div>
    </Card>
  );
}

