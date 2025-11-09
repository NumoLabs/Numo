// Mathematical utilities for vault forecasting
export function scaleByDecimals(value: bigint, decimals: number): number {
  return Number(value) / Math.pow(10, decimals);
}

export function safeDiv(a: number, b: number): number {
  if (b === 0) return 0;
  return a / b;
}

export function stdev(series: number[]): number {
  if (series.length < 2) return 0;
  
  const mean = series.reduce((sum, val) => sum + val, 0) / series.length;
  const variance = series.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (series.length - 1);
  
  return Math.sqrt(variance);
}

export function annualize(rate: number, periodsPerYear: number): number {
  return Math.pow(1 + rate, periodsPerYear) - 1;
}

export function calculateVolatility(returns: number[]): number {
  if (returns.length < 2) return 0;
  return stdev(returns);
}

export function calculateReturns(prices: number[]): number[] {
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    const returnRate = (prices[i] - prices[i - 1]) / prices[i - 1];
    returns.push(returnRate);
  }
  return returns;
}
