'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Lock, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface BondCardProps {
  id: string;
  name: string;
  description: string;
  totalAssets: bigint | null;
  isLoading?: boolean;
  onClick?: () => void;
}

export function BondCard({
  name,
  description,
  totalAssets,
  isLoading = false,
  onClick,
}: BondCardProps) {
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
      onClick={onClick}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      {/* Gradient glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-bitcoin-orange/0 via-bitcoin-orange/5 to-bitcoin-orange/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Bond Icon and Info */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1 px-2 md:px-4 relative z-10">
        <motion.div 
          className="flex-shrink-0"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <Image 
            src="/wbtc-icon.png" 
            alt="Bond" 
            width={30}
            height={30}
            className="md:w-[35px] md:h-[35px] object-contain"
          />
        </motion.div>
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-1.5 md:gap-2">
            <h3 className="text-xs md:text-sm font-semibold truncate group-hover:text-bitcoin-orange transition-colors duration-300">
              {name}
            </h3>
            <Lock className="h-3 w-3 text-bitcoin-orange flex-shrink-0" />
          </div>
          <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-1 md:truncate mt-0.5">
            {description}
          </p>
        </div>
      </div>

      {/* Assets */}
      <div className="flex flex-col items-center min-w-[80px] md:min-w-[100px] flex-shrink-0 relative z-10 px-2 md:px-4">
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
      <div className="flex items-center min-w-[70px] md:min-w-[100px] flex-shrink-0 px-2 md:px-4 relative z-10">
        <Button
          variant="default"
          size="sm"
          className="group-hover:bg-bitcoin-orange group-hover:shadow-md group-hover:shadow-bitcoin-orange/20 transition-all duration-300 text-xs md:text-sm px-2 md:px-3 h-7 md:h-9"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          <Clock className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
          <span className="hidden sm:inline">Manage</span>
        </Button>
      </div>
    </Card>
  );
}

