export interface DepositOption {
  id: string
  name: string
  description: string
  estimatedTime: string
  gasEstimate: string
  minAmount: string
  maxAmount: string
  fees: string
  available: boolean
  recommended?: boolean
}

export interface WalletBalance {
  btc: string
  btcUSD: string
  wbtc: string
  wbtcUSD: string
  eth: string
  ethUSD: string
}

export interface DepositEstimate {
  amount: string
  amountUSD: string
  fees: string
  feesUSD: string
  netAmount: string
  netAmountUSD: string
  estimatedTime: string
  gasEstimate: string
  projectedYield: {
    daily: string
    monthly: string
    yearly: string
  }
}

export interface VaultInfo {
  currentAPY: string
  totalTVL: string
  currentStrategy: string
  strategyDistribution: Array<{
    name: string
    allocation: number
    apy: string
  }>
  riskLevel: string
  minimumDeposit: string
}

export const walletBalance: WalletBalance = {
  btc: "2.45 BTC",
  btcUSD: "$154,125.00",
  wbtc: "0.85 WBTC",
  wbtcUSD: "$53,550.00",
  eth: "12.5 ETH",
  ethUSD: "$41,250.00",
}

export const vaultInfo: VaultInfo = {
  currentAPY: "5.8%",
  totalTVL: "$127.4M",
  currentStrategy: "Ekubo (70%) / Vesu (30%)",
  strategyDistribution: [
    { name: "Ekubo BTC/USDC", allocation: 70, apy: "4.8%" },
    { name: "Vesu BTC Lending", allocation: 30, apy: "5.8%" },
  ],
  riskLevel: "Low-Medium",
  minimumDeposit: "0.001 BTC",
}

export const depositOptions: DepositOption[] = [
  {
    id: "standard",
    name: "Standard Deposit",
    description: "Optimized deposit with quick confirmation",
    estimatedTime: "~5 minutes",
    gasEstimate: "~0.0002 ETH",
    minAmount: "0.001 BTC",
    maxAmount: "10 BTC",
    fees: "0%",
    available: true,
    recommended: true,
  },
  {
    id: "priority",
    name: "Priority Deposit",
    description: "High-priority deposit for immediate confirmation",
    estimatedTime: "~2 minutes",
    gasEstimate: "~0.0004 ETH",
    minAmount: "0.001 BTC",
    maxAmount: "10 BTC",
    fees: "0%",
    available: true,
  },
  {
    id: "scheduled",
    name: "Scheduled Deposit",
    description: "Schedule your deposit to optimize gas costs",
    estimatedTime: "1-24 hours",
    gasEstimate: "~0.0001 ETH",
    minAmount: "0.01 BTC",
    maxAmount: "10 BTC",
    fees: "0%",
    available: false,
  },
]

export const calculateDepositEstimate = (amount: string, option: DepositOption, btcPrice = 63000): DepositEstimate => {
  const amountNum = Number.parseFloat(amount) || 0
  const feeRate = Number.parseFloat(option.fees.replace("%", "")) / 100
  const feeAmount = amountNum * feeRate
  const netAmount = amountNum - feeAmount
  const currentAPY = 0.058 // 5.8%

  // Calculate projected yields
  const dailyYield = (netAmount * currentAPY) / 365
  const monthlyYield = (netAmount * currentAPY) / 12
  const yearlyYield = netAmount * currentAPY

  return {
    amount: `${amountNum.toFixed(6)} BTC`,
    amountUSD: `$${(amountNum * btcPrice).toLocaleString()}`,
    fees: `${feeAmount.toFixed(6)} BTC`,
    feesUSD: `$${(feeAmount * btcPrice).toFixed(2)}`,
    netAmount: `${netAmount.toFixed(6)} BTC`,
    netAmountUSD: `$${(netAmount * btcPrice).toLocaleString()}`,
    estimatedTime: option.estimatedTime,
    gasEstimate: option.gasEstimate,
    projectedYield: {
      daily: `${dailyYield.toFixed(6)} BTC`,
      monthly: `${monthlyYield.toFixed(6)} BTC`,
      yearly: `${yearlyYield.toFixed(6)} BTC`,
    },
  }
}

export const getDepositOptionById = (id: string): DepositOption | undefined => {
  return depositOptions.find((option) => option.id === id)
}
