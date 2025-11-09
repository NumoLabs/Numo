// Pure mathematical forecasting models - no mock data
import type { PricePoint, ForecastParams, ForecastResult } from '../types';
import { stdev, calculateReturns, calculateVolatility } from './math';

export function movingAverageForecast(
  series: PricePoint[],
  params: ForecastParams
): ForecastResult | null {
  const { horizonDays, window = 7 } = params;
  
  if (series.length < window) {
    return null; // Insufficient data
  }
  
  // Calculate moving average
  const prices = series.map(p => p.price);
  const recentPrices = prices.slice(-window);
  const movingAvg = recentPrices.reduce((sum, price) => sum + price, 0) / window;
  
  // Calculate volatility for confidence bands
  const returns = calculateReturns(prices);
  const volatility = calculateVolatility(returns);
  
  // Simple trend projection (last price vs moving average)
  const lastPrice = prices[prices.length - 1];
  const trend = (lastPrice - movingAvg) / movingAvg;
  
  // Project forward
  const expectedValue = lastPrice * (1 + trend * (horizonDays / 30)); // Monthly trend scaling
  
  // Confidence bands (±1σ) - return as arrays for compatibility
  const lowerValue = expectedValue * (1 - volatility);
  const upperValue = expectedValue * (1 + volatility);
  const confidenceBand = {
    lower: [lowerValue],
    upper: [upperValue]
  };
  
  // Generate forecast points
  const forecast: PricePoint[] = [];
  const lastTimestamp = series[series.length - 1]?.timestamp || Date.now();
  for (let day = 1; day <= horizonDays; day++) {
    const timestamp = lastTimestamp + (day * 24 * 60 * 60 * 1000);
    const projectedPrice = lastPrice * (1 + trend * (day / 30));
    forecast.push({
      timestamp,
      price: projectedPrice
    });
  }
  
  return {
    model: 'movingAverage',
    horizonDays,
    forecast,
    confidenceBand,
    metrics: {
      expectedReturn: trend * (horizonDays / 30),
      volatility,
      sharpeRatio: (trend * (horizonDays / 30)) / volatility || 0
    }
  };
}

export function emaForecast(
  series: PricePoint[],
  params: ForecastParams
): ForecastResult | null {
  const { horizonDays, alpha = 0.1 } = params;
  
  if (series.length < 2) {
    return null; // Insufficient data
  }
  
  const prices = series.map(p => p.price);
  
  // Calculate EMA
  let ema = prices[0];
  for (let i = 1; i < prices.length; i++) {
    ema = alpha * prices[i] + (1 - alpha) * ema;
  }
  
  // Calculate volatility
  const returns = calculateReturns(prices);
  const volatility = calculateVolatility(returns);
  
  // Project forward using EMA trend
  const lastPrice = prices[prices.length - 1];
  const trend = (lastPrice - ema) / ema;
  
  const expectedValue = lastPrice * (1 + trend * (horizonDays / 30));
  
  // Confidence bands (±1σ) - return as arrays for compatibility
  const lowerValue = expectedValue * (1 - volatility);
  const upperValue = expectedValue * (1 + volatility);
  const confidenceBand = {
    lower: [lowerValue],
    upper: [upperValue]
  };
  
  // Generate forecast points
  const forecast: PricePoint[] = [];
  const lastTimestamp = series[series.length - 1]?.timestamp || Date.now();
  for (let day = 1; day <= horizonDays; day++) {
    const timestamp = lastTimestamp + (day * 24 * 60 * 60 * 1000);
    const projectedPrice = lastPrice * (1 + trend * (day / 30));
    forecast.push({
      timestamp,
      price: projectedPrice
    });
  }
  
  return {
    model: 'ema',
    horizonDays,
    forecast,
    confidenceBand,
    metrics: {
      expectedReturn: trend * (horizonDays / 30),
      volatility,
      sharpeRatio: (trend * (horizonDays / 30)) / volatility || 0
    }
  };
}

export function volAdjustedProjection(
  series: PricePoint[],
  params: ForecastParams
): ForecastResult | null {
  const { horizonDays } = params;
  
  if (series.length < 10) {
    return null; // Need sufficient data for volatility calculation
  }
  
  const prices = series.map(p => p.price);
  const returns = calculateReturns(prices);
  const volatility = calculateVolatility(returns);
  
  // Calculate mean return
  const meanReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  
  // Project using mean return adjusted by volatility
  const lastPrice = prices[prices.length - 1];
  const adjustedReturn = meanReturn * (1 - volatility); // Conservative adjustment
  
  const expectedValue = lastPrice * Math.pow(1 + adjustedReturn, horizonDays);
  
  // Confidence bands based on volatility - return as arrays for compatibility
  const volMultiplier = Math.sqrt(horizonDays / 365);
  const lowerValue = expectedValue * (1 - volatility * volMultiplier);
  const upperValue = expectedValue * (1 + volatility * volMultiplier);
  const confidenceBand = {
    lower: [lowerValue],
    upper: [upperValue]
  };
  
  // Generate forecast points
  const forecast: PricePoint[] = [];
  const lastTimestamp = series[series.length - 1]?.timestamp || Date.now();
  for (let day = 1; day <= horizonDays; day++) {
    const timestamp = lastTimestamp + (day * 24 * 60 * 60 * 1000);
    const projectedPrice = lastPrice * Math.pow(1 + adjustedReturn, day);
    forecast.push({
      timestamp,
      price: projectedPrice
    });
  }
  
  // Calculate expected return for metrics
  const expectedReturn = adjustedReturn * horizonDays;
  
  return {
    model: 'volAdjusted',
    horizonDays,
    forecast,
    confidenceBand,
    metrics: {
      expectedReturn,
      volatility,
      sharpeRatio: expectedReturn / volatility || 0
    }
  };
}

export function portfolioApyProjection(
  vaultSnapshot: { pricePerShare: number; updatedAt: number },
  historicalSnapshots: Array<{ pricePerShare: number; updatedAt: number }>
): number | null {
  if (historicalSnapshots.length < 2) {
    return null; // Insufficient data
  }
  
  // Calculate APY from price per share changes
  const sortedSnapshots = historicalSnapshots.sort((a, b) => a.updatedAt - b.updatedAt);
  const firstSnapshot = sortedSnapshots[0];
  const lastSnapshot = sortedSnapshots[sortedSnapshots.length - 1];
  
  const timeDiffMs = lastSnapshot.updatedAt - firstSnapshot.updatedAt;
  const timeDiffYears = timeDiffMs / (365 * 24 * 60 * 60 * 1000);
  
  if (timeDiffYears <= 0) {
    return null;
  }
  
  const priceChange = (lastSnapshot.pricePerShare - firstSnapshot.pricePerShare) / firstSnapshot.pricePerShare;
  const apy = Math.pow(1 + priceChange, 1 / timeDiffYears) - 1;
  
  return apy * 100; // Return as percentage
}
