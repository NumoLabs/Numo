/**
 * Pure forecasting calculation module
 * 
 * This module provides read-only forecasting calculations based on real vault APY.
 * It does NOT modify any on-chain state or interact with contracts.
 * All calculations are pure functions (no side effects).
 * 
 * SAFETY: This module is 100% frontend-only and does not touch the vault contract.
 */

export interface ForecastInput {
  // Initial deposit amount (in BTC/WBTC)
  initialAmount: number;
  
  // Time horizon in days
  days: number;
  
  // Annual Percentage Yield (as decimal, e.g., 0.078 for 7.8%)
  apy: number;
  
  // Compounding frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  compoundingFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface ForecastResult {
  // Initial amount
  initialAmount: number;
  
  // Final projected balance
  finalBalance: number;
  
  // Total gain (finalBalance - initialAmount)
  totalGain: number;
  
  // Time series data points for charts
  timeSeries: Array<{
    day: number;
    balance: number;
    gain: number;
  }>;
  
  // Summary metrics
  summary: {
    totalGain: number;
    totalGainPercentage: number;
    dailyGain: number;
    monthlyGain: number;
    yearlyGain: number;
  };
}

/**
 * Calculate compound interest
 * 
 * Formula: A = P * (1 + r/n)^(n*t)
 * Where:
 * - P = principal (initial amount)
 * - r = annual interest rate (APY as decimal)
 * - n = number of compounding periods per year
 * - t = time in years
 * 
 * @param principal - Initial amount
 * @param apy - Annual Percentage Yield (as decimal)
 * @param days - Time period in days
 * @param compoundingFrequency - How often interest compounds
 * @returns Final balance after compounding
 */
function calculateCompoundInterest(
  principal: number,
  apy: number,
  days: number,
  compoundingFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'daily'
): number {
  const years = days / 365;
  
  // Determine compounding periods per year
  let periodsPerYear: number;
  switch (compoundingFrequency) {
    case 'daily':
      periodsPerYear = 365;
      break;
    case 'weekly':
      periodsPerYear = 52;
      break;
    case 'monthly':
      periodsPerYear = 12;
      break;
    case 'yearly':
      periodsPerYear = 1;
      break;
    default:
      periodsPerYear = 365;
  }
  
  const ratePerPeriod = apy / periodsPerYear;
  const totalPeriods = periodsPerYear * years;
  
  // A = P * (1 + r/n)^(n*t)
  return principal * Math.pow(1 + ratePerPeriod, totalPeriods);
}

/**
 * Generate time series data for forecasting chart
 * 
 * @param initialAmount - Starting amount
 * @param apy - Annual Percentage Yield (as decimal)
 * @param days - Total days to forecast
 * @param compoundingFrequency - Compounding frequency
 * @param dataPoints - Number of data points to generate (default: one per day)
 * @returns Array of time series data points
 */
function generateTimeSeries(
  initialAmount: number,
  apy: number,
  days: number,
  compoundingFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'daily',
  dataPoints?: number
): Array<{ day: number; balance: number; gain: number }> {
  const points: Array<{ day: number; balance: number; gain: number }> = [];
  
  // Default to one point per day, but limit to reasonable number for performance
  const step = dataPoints ? Math.max(1, Math.floor(days / dataPoints)) : 1;
  const maxPoints = 365; // Limit to 365 points max for performance
  
  for (let day = 0; day <= days; day += step) {
    if (points.length >= maxPoints) break;
    
    const balance = calculateCompoundInterest(initialAmount, apy, day, compoundingFrequency);
    const gain = balance - initialAmount;
    
    points.push({ day, balance, gain });
  }
  
  // Always include the final day
  if (points[points.length - 1]?.day !== days) {
    const finalBalance = calculateCompoundInterest(initialAmount, apy, days, compoundingFrequency);
    const finalGain = finalBalance - initialAmount;
    points.push({ day: days, balance: finalBalance, gain: finalGain });
  }
  
  return points;
}

/**
 * Calculate forecast based on real vault APY
 * 
 * This is a PURE function that only performs calculations.
 * It does NOT read from or write to any contracts.
 * 
 * @param input - Forecast input parameters
 * @returns Forecast result with projections
 */
export function calculateVaultForecast(input: ForecastInput): ForecastResult {
  const {
    initialAmount,
    days,
    apy,
    compoundingFrequency = 'daily',
  } = input;

  // Validate inputs
  if (initialAmount <= 0 || days <= 0 || apy < 0 || isNaN(apy)) {
    return {
      initialAmount,
      finalBalance: initialAmount,
      totalGain: 0,
      timeSeries: [],
      summary: {
        totalGain: 0,
        totalGainPercentage: 0,
        dailyGain: 0,
        monthlyGain: 0,
        yearlyGain: 0,
      },
    };
  }

  // Calculate final balance using compound interest
  const finalBalance = calculateCompoundInterest(initialAmount, apy, days, compoundingFrequency);
  const totalGain = finalBalance - initialAmount;

  // Generate time series for chart
  const timeSeries = generateTimeSeries(initialAmount, apy, days, compoundingFrequency);

  // Calculate summary metrics
  const totalGainPercentage = (totalGain / initialAmount) * 100;
  const dailyGain = calculateCompoundInterest(initialAmount, apy, 1, compoundingFrequency) - initialAmount;
  const monthlyGain = calculateCompoundInterest(initialAmount, apy, 30, compoundingFrequency) - initialAmount;
  const yearlyGain = calculateCompoundInterest(initialAmount, apy, 365, compoundingFrequency) - initialAmount;

  return {
    initialAmount,
    finalBalance,
    totalGain,
    timeSeries,
    summary: {
      totalGain,
      totalGainPercentage,
      dailyGain,
      monthlyGain,
      yearlyGain,
    },
  };
}

/**
 * Compare vault strategy vs HODL strategy
 * 
 * HODL = no yield, balance stays constant
 * Vault = compound interest based on APY
 * 
 * @param initialAmount - Starting amount
 * @param days - Time period in days
 * @param vaultApy - Vault APY (as decimal)
 * @returns Comparison result
 */
export function compareVaultVsHodl(
  initialAmount: number,
  days: number,
  vaultApy: number
): {
  vault: ForecastResult;
  hodl: {
    initialAmount: number;
    finalBalance: number;
    totalGain: number;
    timeSeries: Array<{ day: number; balance: number; gain: number }>;
  };
  advantage: number;
  advantagePercentage: number;
} {
  const vaultForecast = calculateVaultForecast({
    initialAmount,
    days,
    apy: vaultApy,
    compoundingFrequency: 'daily',
  });

  // HODL: balance stays constant, no gain
  const hodlTimeSeries = Array.from({ length: Math.min(days + 1, 365) }, (_, i) => {
    const day = Math.floor((i * days) / (Math.min(days, 365) - 1));
    return {
      day,
      balance: initialAmount,
      gain: 0,
    };
  });

  const hodl = {
    initialAmount,
    finalBalance: initialAmount,
    totalGain: 0,
    timeSeries: hodlTimeSeries,
  };

  const advantage = vaultForecast.totalGain - hodl.totalGain;
  const advantagePercentage = (advantage / initialAmount) * 100;

  return {
    vault: vaultForecast,
    hodl,
    advantage,
    advantagePercentage,
  };
}

