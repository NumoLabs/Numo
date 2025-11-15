'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { TrendingUp, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

type RiskProfile = 'Low' | 'Medium' | 'High';

// Calculate vault risk based on pools
function calculateVaultRisk(pools: VaultPool[]): RiskProfile {
  if (pools.length === 0) return 'Medium';

  let riskScore = 0;
  let lendingPoolsCount = 0;
  let dexPoolsCount = 0;

  pools.forEach((pool) => {
    const poolName = pool.poolName.toLowerCase();
    
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

    // APY factor (higher APY can indicate higher risk)
    if (pool.apy !== null && typeof pool.apy === 'number' && !isNaN(pool.apy)) {
      if (pool.apy > 15) {
        riskScore += 2; // Very high APY = higher risk
      } else if (pool.apy > 10) {
        riskScore += 1; // High APY = moderate risk
      }
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

export function VaultCard({
  id,
  name,
  totalAssets,
  pools,
  isLoading = false,
}: VaultCardProps) {
  const router = useRouter();
  
  // Calculate vault risk
  const vaultRisk = calculateVaultRisk(pools);

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
        "flex flex-col sm:flex-row items-start sm:items-center justify-between",
        "h-auto sm:h-20 p-3 sm:p-0",
        "border border-border/50 hover:border-bitcoin-orange/30"
      )}
      onClick={() => router.push(`/vaults/${id}`)}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      {/* Gradient glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-bitcoin-orange/0 via-bitcoin-orange/5 to-bitcoin-orange/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Vault Icon and Name - Full width on mobile */}
      <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-shrink-0 px-0 sm:px-4 relative z-10 w-full sm:w-auto mb-3 sm:mb-0">
        <motion.div 
          className="flex-shrink-0"
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
        <div className="flex flex-col min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">Vault</p>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-xs sm:text-sm font-semibold group-hover:text-bitcoin-orange transition-colors duration-300 break-words">
            {name}
          </h3>
            <Badge className={cn("text-[10px] sm:text-xs whitespace-nowrap flex-shrink-0", getRiskBadgeStyle(vaultRisk))}>
              {vaultRisk} Risk
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Grid - Mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-none sm:flex gap-3 sm:gap-0 w-full sm:w-auto mb-3 sm:mb-0 relative z-10">
      {/* Assets */}
        <div className="flex flex-col items-start sm:items-center min-w-0 sm:min-w-[70px] flex-shrink-0">
          <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">Assets</p>
        <div className="flex items-center gap-1.5 group-hover:gap-2 transition-all">
            <Coins className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-muted-foreground group-hover:text-bitcoin-gold transition-colors" />
            <span className="text-[10px] sm:text-xs font-medium">wBTC</span>
        </div>
      </div>

      {/* Pools Count */}
        <div className="flex flex-col items-start sm:items-center min-w-0 sm:min-w-[70px] flex-shrink-0">
          <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">Pools</p>
          <span className="text-xs sm:text-sm font-semibold group-hover:scale-110 transition-transform inline-block">{pools.length}</span>
      </div>

      {/* APY */}
        <div className="flex flex-col items-start sm:items-center min-w-0 sm:min-w-[90px] flex-shrink-0">
          <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">APY</p>
        <div className="flex items-center gap-1">
          {isLoading ? (
              <span className="inline-block w-10 sm:w-12 h-3 sm:h-4 bg-muted rounded animate-pulse" />
          ) : (
            <>
                <span className="text-xs sm:text-sm font-semibold text-bitcoin-gold group-hover:text-bitcoin-orange transition-colors break-words">
                {formatApy(avgApy > 0 ? avgApy : null)}
              </span>
                <TrendingUp className="h-2.5 sm:h-3 w-2.5 sm:w-3 text-bitcoin-gold opacity-70 group-hover:opacity-100 group-hover:translate-y-[-2px] transition-all flex-shrink-0" />
            </>
          )}
        </div>
      </div>

      {/* TVL */}
        <div className="flex flex-col items-start sm:items-center min-w-0 sm:min-w-[110px] flex-shrink-0">
          <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">TVL</p>
        {isLoading || totalAssets === null || totalAssets === undefined ? (
            <span className="inline-block w-12 sm:w-16 h-3 sm:h-4 bg-muted rounded animate-pulse" />
        ) : (
            <span className="text-xs sm:text-sm font-semibold text-bitcoin-orange group-hover:scale-105 transition-transform inline-block break-words">
            {formatTotalAssets(totalAssets)} wBTC
          </span>
        )}
        </div>
      </div>

      {/* View Button */}
      <div className="flex items-center w-full sm:w-auto sm:min-w-[80px] flex-shrink-0 px-0 sm:px-4 relative z-10">
        <Button
          variant="default"
          size="sm"
          className="w-full sm:w-auto group-hover:bg-bitcoin-orange group-hover:shadow-md group-hover:shadow-bitcoin-orange/20 transition-all duration-300 text-xs sm:text-sm"
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
