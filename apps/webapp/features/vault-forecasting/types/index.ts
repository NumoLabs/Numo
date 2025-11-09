// Vault Forecasting Types
export interface PricePoint {
  timestamp: number;
  price: number;
}

export interface VaultSnapshot {
  tvl: number;
  pricePerShare: number;
  updatedAt: number;
  assetAddress?: string;
  decimals?: number;
  weights?: Array<{
    pool: string;
    weight: number;
  }>;
  fees?: {
    managementFee: number;
    performanceFee: number;
  };
  lastRebalance?: number;
}

export interface ForecastParams {
  horizonDays: number;
  window?: number; // for moving average
  alpha?: number; // for EMA
}

export interface ForecastResult {
  model: 'movingAverage' | 'ema' | 'volAdjusted';
  horizonDays: number;
  forecast: PricePoint[];
  confidenceBand: {
    lower: number[];
    upper: number[];
  };
  metrics: {
    expectedReturn: number;
    volatility: number;
    sharpeRatio: number;
  };
}

export interface PragmaPrice {
  price: number;
  updatedAt: number;
  decimals: number;
  feed: string;
}

export interface VaultReadResult {
  totalAssets?: bigint;
  totalAssetsUsd?: bigint;
  asset?: string;
  underlying?: string;
  decimals?: number;
  pricePerShare?: bigint;
  lastRebalance?: bigint;
  rebalanceInterval?: bigint;
  positions?: Array<{
    pool: string;
    weight: bigint;
  }>;
  managementFee?: bigint;
  performanceFee?: bigint;
}

export type ForecastModel = 'movingAverage' | 'ema' | 'volAdjusted';
