'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Shield, TrendingUp, Target, ArrowRight } from 'lucide-react';

// Strategy and Risk Profile Types
export type RiskProfile = 'Low' | 'Medium' | 'High';

export interface RebalanceStrategy {
  id: string;
  name: string;
  description: string;
  riskProfile: RiskProfile;
  recommendedAllocation: {
    fromPoolType: string;
    toPoolType: string;
    description: string;
  };
}

// Predefined rebalance strategies
export const rebalanceStrategies: RebalanceStrategy[] = [
  {
    id: 'conservative',
    name: 'Conservative',
    description: 'Prioritize stability and capital preservation. Move funds from higher-risk pools to lower-risk lending pools.',
    riskProfile: 'Low',
    recommendedAllocation: {
      fromPoolType: 'Liquidity Pools (DEX)',
      toPoolType: 'Lending Pools',
      description: 'Shift from volatile DEX pools to stable lending pools',
    },
  },
  {
    id: 'balanced',
    name: 'Balanced',
    description: 'Maintain a balanced portfolio between growth and stability. Optimize allocation across different pool types.',
    riskProfile: 'Medium',
    recommendedAllocation: {
      fromPoolType: 'Any Pool',
      toPoolType: 'Diversified Mix',
      description: 'Rebalance to achieve optimal risk-return balance',
    },
  },
  {
    id: 'aggressive',
    name: 'Aggressive',
    description: 'Maximize returns by moving funds to higher-yield opportunities. Accept higher risk for potential gains.',
    riskProfile: 'High',
    recommendedAllocation: {
      fromPoolType: 'Low-Yield Pools',
      toPoolType: 'High-Yield Pools',
      description: 'Shift from conservative positions to higher-yield opportunities',
    },
  },
];

// Helper function to get risk profile color
const getRiskProfileColor = (risk: RiskProfile): string => {
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
};

// Helper function to get risk profile icon
const getRiskProfileIcon = (risk: RiskProfile) => {
  switch (risk) {
    case 'Low':
      return Shield;
    case 'Medium':
      return Target;
    case 'High':
      return TrendingUp;
    default:
      return Shield;
  }
};

export function StrategySelector() {
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');

  const strategy = rebalanceStrategies.find((s) => s.id === selectedStrategy);
  const riskProfile = strategy?.riskProfile;

  // Fix viewport width to prevent text cutting
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      [data-radix-select-viewport] {
        min-width: 500px !important;
        width: auto !important;
        overflow: visible !important;
      }
      [data-radix-select-content] {
        overflow: visible !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="w-full">
      <Card className="relative bg-black border border-white shadow-lg hover:shadow-xl transition-all duration-300 group w-full">
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
        
        <CardHeader className="bg-black/50 rounded-t-lg border-b border-white/20 pb-4 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-3">
                <Target className="h-5 w-5 text-bitcoin-gold flex-shrink-0" />
                <span className="whitespace-nowrap">Rebalance Strategy</span>
              </CardTitle>
              <CardDescription className="text-white/70 mt-2 break-words">
                Select a rebalancing strategy to guide your pool allocation decisions
              </CardDescription>
            </div>
            <div className="flex-shrink-0 self-start">
              {riskProfile ? (
                <Badge className={`${getRiskProfileColor(riskProfile)} whitespace-nowrap`}>
                  {(() => {
                    const RiskIcon = getRiskProfileIcon(riskProfile);
                    return (
                      <div className="flex items-center gap-1.5">
                        <RiskIcon className="h-3 w-3 flex-shrink-0" />
                        <span>{riskProfile} Risk</span>
                      </div>
                    );
                  })()}
                </Badge>
              ) : (
                <div className="h-6 min-w-[80px]" aria-hidden="true" />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10 space-y-4 pt-6 pb-12">
        <Select
          onValueChange={setSelectedStrategy}
          value={selectedStrategy}
        >
          <SelectTrigger className="bg-black border-white/30 text-white h-14 hover:border-bitcoin-orange/50 focus:border-bitcoin-orange/50 transition-colors text-base font-medium w-full">
            <SelectValue placeholder="Select a rebalancing strategy (optional)" />
          </SelectTrigger>
          <SelectContent 
            className="bg-black border-white/30 backdrop-blur-xl min-w-[500px] max-w-[90vw] !text-white [&_*]:text-white"
          >
            {rebalanceStrategies.map((strategyOption) => {
              const RiskIcon = getRiskProfileIcon(strategyOption.riskProfile);
              return (
                <SelectItem
                  key={strategyOption.id}
                  value={strategyOption.id}
                  className="!text-white !bg-black py-3 px-4 !pl-4 !pr-4 hover:!bg-white/10 !focus:bg-white/10 !focus:text-white !data-[highlighted]:bg-white/10 !data-[highlighted]:text-white [&>span:first-child]:hidden [&_*]:!text-white"
                  textValue={strategyOption.name}
                >
                  <div className="flex items-center gap-2 w-full text-white">
                    <span className="font-semibold text-white">{strategyOption.name}</span>
                    <Badge className={`${getRiskProfileColor(strategyOption.riskProfile)} text-xs whitespace-nowrap pointer-events-none`}>
                      <div className="flex items-center gap-1">
                        <RiskIcon className="h-3 w-3" />
                        <span>{strategyOption.riskProfile}</span>
                      </div>
                    </Badge>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        
        {strategy && (
          <div className="mt-8 mb-6 px-6 pt-6 pb-12 rounded-lg bg-white/10 border border-white/30 shadow-md hover:shadow-lg transition-all duration-200 w-full">
            <div className="flex items-start gap-4 w-full">
              <div className="p-2.5 rounded-lg bg-bitcoin-orange/20 border border-bitcoin-orange/30 flex-shrink-0 self-start mt-0.5">
                <Target className="h-4 w-4 text-bitcoin-gold" />
              </div>
              <div className="flex-1 space-y-3 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-bitcoin-gold whitespace-nowrap">{strategy.name} Strategy</span>
                  <Badge className={`${getRiskProfileColor(strategy.riskProfile)} flex-shrink-0 whitespace-nowrap`}>
                    {(() => {
                      const RiskIcon = getRiskProfileIcon(strategy.riskProfile);
                      return (
                        <div className="flex items-center gap-1">
                          <RiskIcon className="h-3 w-3 flex-shrink-0" />
                          <span>{strategy.riskProfile} Risk</span>
                        </div>
                      );
                    })()}
                  </Badge>
                </div>
                <p className="text-sm text-white/80 leading-relaxed break-words w-full">{strategy.description}</p>
                <div className="pt-3 border-t border-white/20 space-y-2 pb-2">
                  <p className="text-xs font-medium text-bitcoin-gold mb-2">Recommended Allocation:</p>
                  <div className="flex items-start gap-2 text-xs text-white/70 flex-wrap">
                    <span className="font-medium whitespace-nowrap flex-shrink-0">From:</span>
                    <span className="break-words flex-1 min-w-0">{strategy.recommendedAllocation.fromPoolType}</span>
                    <ArrowRight className="h-3 w-3 mx-1 text-bitcoin-gold flex-shrink-0 mt-0.5" />
                    <span className="font-medium whitespace-nowrap flex-shrink-0">To:</span>
                    <span className="break-words flex-1 min-w-0">{strategy.recommendedAllocation.toPoolType}</span>
                  </div>
                  <p className="text-xs text-bitcoin-gold/80 break-words w-full pt-1">
                    <span className="font-medium">Recommended:</span> {strategy.recommendedAllocation.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        </CardContent>
      </Card>
    </div>
  );
}

