export interface WithdrawOption {
  id: string
  name: string
  description: string
  estimatedTime: string
  gasEstimate: string
  minAmount: string
  maxAmount: string
  fees: string
  available: boolean
}

export interface VaultBalance {
  totalBalance: string
  totalBalanceUSD: string
  accumulatedYield: string
  accumulatedYieldUSD: string
  timeInVault: string
  initialDeposit: string
  currentAPY: string
}

export interface WithdrawEstimate {
  amount: string
  amountUSD: string
  fees: string
  feesUSD: string
  netAmount: string
  netAmountUSD: string
  estimatedTime: string
  gasEstimate: string
}

export const vaultBalance: VaultBalance = {
  totalBalance: "1.245 BTC",
  totalBalanceUSD: "$78,435.67",
  accumulatedYield: "+0.078 BTC",
  accumulatedYieldUSD: "+$4,875.32",
  timeInVault: "32 days",
  initialDeposit: "1.167 BTC",
  currentAPY: "5.8%",
}

export const withdrawOptions: WithdrawOption[] = [
  {
    id: "instant",
    name: "Instant Withdrawal",
    description: "Immediate withdrawal with additional fee",
    estimatedTime: "~2 minutes",
    gasEstimate: "~0.0003 ETH",
    minAmount: "0.001 BTC",
    maxAmount: "1.245 BTC",
    fees: "0.5%",
    available: true,
  },
  {
    id: "standard",
    name: "Standard Withdrawal",
    description: "Optimized withdrawal with lower fee",
    estimatedTime: "~10 minutes",
    gasEstimate: "~0.0002 ETH",
    minAmount: "0.001 BTC",
    maxAmount: "1.245 BTC",
    fees: "0.1%",
    available: true,
  },
  {
    id: "scheduled",
    name: "Scheduled Withdrawal",
    description: "Schedule your withdrawal to optimize costs",
    estimatedTime: "1-24 hours",
    gasEstimate: "~0.0001 ETH",
    minAmount: "0.01 BTC",
    maxAmount: "1.245 BTC",
    fees: "0.05%",
    available: false,
  },
]

export const calculateWithdrawEstimate = (
  amount: string,
  option: WithdrawOption,
  btcPrice = 63000,
): WithdrawEstimate => {
  const amountNum = Number.parseFloat(amount) || 0
  const feeRate = Number.parseFloat(option.fees) / 100
  const feeAmount = amountNum * feeRate
  const netAmount = amountNum - feeAmount

  return {
    amount: `${amountNum.toFixed(6)} BTC`,
    amountUSD: `$${(amountNum * btcPrice).toLocaleString()}`,
    fees: `${feeAmount.toFixed(6)} BTC`,
    feesUSD: `$${(feeAmount * btcPrice).toFixed(2)}`,
    netAmount: `${netAmount.toFixed(6)} BTC`,
    netAmountUSD: `$${(netAmount * btcPrice).toLocaleString()}`,
    estimatedTime: option.estimatedTime,
    gasEstimate: option.gasEstimate,
  }
}

export const getWithdrawOptionById = (id: string): WithdrawOption | undefined => {
  return withdrawOptions.find((option) => option.id === id)
}
