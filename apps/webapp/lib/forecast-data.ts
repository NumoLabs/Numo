export interface ForecastData {
  amount: number
  days: number
  vaultGain: number
  hodlGain: number
  vesuGain: number
  ekuboGain: number
}

export interface HistoricalDataPoint {
  day: number
  vault: number
  hodl: number
  vesu: number
  ekubo: number
}

export const calculateForecast = (amount: number, days: number): ForecastData => {
  // Mock calculation based on different APYs
  const vaultAPY = 0.078 // 7.8% APY
  const vesuAPY = 0.052 // 5.2% APY
  const ekuboAPY = 0.089 // 8.9% APY

  const dailyVaultRate = vaultAPY / 365
  const dailyVesuRate = vesuAPY / 365
  const dailyEkuboRate = ekuboAPY / 365

  const vaultGain = amount * (Math.pow(1 + dailyVaultRate, days) - 1)
  const vesuGain = amount * (Math.pow(1 + dailyVesuRate, days) - 1)
  const ekuboGain = amount * (Math.pow(1 + dailyEkuboRate, days) - 1)
  const hodlGain = 0

  return {
    amount,
    days,
    vaultGain,
    hodlGain,
    vesuGain,
    ekuboGain,
  }
}

export const generateHistoricalData = (days: number): HistoricalDataPoint[] => {
  const data: HistoricalDataPoint[] = []
  const baseAmount = 1 // Normalized to 1 BTC

  // Different growth rates with some volatility
  const vaultAPY = 0.078
  const vesuAPY = 0.052
  const ekuboAPY = 0.089

  for (let day = 0; day <= days; day++) {
    // Add some realistic volatility
    const volatility = 0.02
    const vaultVolatility = (Math.random() - 0.5) * volatility
    const vesuVolatility = (Math.random() - 0.5) * volatility * 0.5
    const ekuboVolatility = (Math.random() - 0.5) * volatility * 1.2

    const vaultValue = baseAmount * Math.pow(1 + vaultAPY / 365 + vaultVolatility, day)
    const vesuValue = baseAmount * Math.pow(1 + vesuAPY / 365 + vesuVolatility, day)
    const ekuboValue = baseAmount * Math.pow(1 + ekuboAPY / 365 + ekuboVolatility, day)
    const hodlValue = baseAmount // Stays constant

    data.push({
      day,
      vault: vaultValue,
      hodl: hodlValue,
      vesu: vesuValue,
      ekubo: ekuboValue,
    })
  }

  return data
}

export const mockInsights = [
  {
    title: "Best Performing Period",
    value: "Last 30 days",
    change: "+12.4%",
    positive: true,
    description: "Your vault strategy outperformed HODL by 12.4% this month",
  },
  {
    title: "Average Daily Yield",
    value: "0.021%",
    change: "+0.003%",
    positive: true,
    description: "Daily compound interest from your vault positions",
  },
  {
    title: "Risk-Adjusted Return",
    value: "1.34",
    change: "Sharpe Ratio",
    positive: true,
    description: "Strong risk-adjusted performance compared to alternatives",
  },
  {
    title: "Optimal Rebalancing",
    value: "Every 7 days",
    change: "Recommended",
    positive: true,
    description: "Based on your strategy and market conditions",
  },
]

export const protocolComparison = [
  {
    protocol: "BTC Vault",
    apy: "7.8%",
    risk: "Medium",
    tvl: "492.4 BTC",
    color: "from-purple-500 to-blue-500",
  },
  {
    protocol: "Vesu Only",
    apy: "5.2%",
    risk: "Low",
    tvl: "1,247 BTC",
    color: "from-green-500 to-emerald-500",
  },
  {
    protocol: "Ekubo Only",
    apy: "8.9%",
    risk: "High",
    tvl: "834 BTC",
    color: "from-amber-500 to-orange-500",
  },
  {
    protocol: "HODL",
    apy: "0%",
    risk: "None",
    tvl: "∞",
    color: "from-gray-400 to-gray-500",
  },
]
