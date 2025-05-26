export interface BondOption {
  id: string
  duration: string
  durationDays: number
  boost: string
  boostPercentage: number
  baseAPY: number
  boostedAPY: number
  icon: string
  color: string
  description: string
  minAmount: string
  maxAmount: string
  available: boolean
  popular?: boolean
}

export interface ActiveBond {
  id: string
  bondType: string
  amount: string
  amountUSD: string
  lockedAt: string
  unlockDate: string
  timeRemaining: {
    days: number
    hours: number
    minutes: number
  }
  estimatedYield: string
  estimatedYieldUSD: string
  currentAPY: string
  status: "active" | "matured" | "unlocking"
}

export interface BondEstimate {
  amount: string
  amountUSD: string
  duration: string
  baseAPY: string
  boost: string
  boostedAPY: string
  estimatedYield: string
  estimatedYieldUSD: string
  totalAtMaturity: string
  totalAtMaturityUSD: string
  unlockDate: string
}

export const bondOptions: BondOption[] = [
  {
    id: "7-day",
    duration: "7 Days",
    durationDays: 7,
    boost: "+1%",
    boostPercentage: 1,
    baseAPY: 5.8,
    boostedAPY: 6.8,
    icon: "Clock",
    color: "blue",
    description: "Short-term lock with modest boost",
    minAmount: "0.001 WBTC",
    maxAmount: "10 WBTC",
    available: true,
  },
  {
    id: "30-day",
    duration: "30 Days",
    durationDays: 30,
    boost: "+4%",
    boostPercentage: 4,
    baseAPY: 5.8,
    boostedAPY: 9.8,
    icon: "Calendar",
    color: "green",
    description: "Balanced lock period with good rewards",
    minAmount: "0.001 WBTC",
    maxAmount: "10 WBTC",
    available: true,
    popular: true,
  },
  {
    id: "90-day",
    duration: "90 Days",
    durationDays: 90,
    boost: "+10%",
    boostPercentage: 10,
    baseAPY: 5.8,
    boostedAPY: 15.8,
    icon: "CalendarDays",
    color: "purple",
    description: "Maximum lock for highest rewards",
    minAmount: "0.001 WBTC",
    maxAmount: "10 WBTC",
    available: true,
  },
]

export const activeBonds: ActiveBond[] = [
  {
    id: "bond-001",
    bondType: "30 Days",
    amount: "0.5 WBTC",
    amountUSD: "$31,500",
    lockedAt: "2025-01-10",
    unlockDate: "2025-02-09",
    timeRemaining: {
      days: 18,
      hours: 14,
      minutes: 32,
    },
    estimatedYield: "0.0041 WBTC",
    estimatedYieldUSD: "$258.30",
    currentAPY: "9.8%",
    status: "active",
  },
]

export const calculateBondEstimate = (amount: string, option: BondOption, btcPrice = 63000): BondEstimate => {
  const amountNum = Number.parseFloat(amount) || 0
  const annualYield = (amountNum * option.boostedAPY) / 100
  const periodYield = (annualYield * option.durationDays) / 365
  const totalAtMaturity = amountNum + periodYield

  const unlockDate = new Date()
  unlockDate.setDate(unlockDate.getDate() + option.durationDays)

  return {
    amount: `${amountNum.toFixed(6)} WBTC`,
    amountUSD: `$${(amountNum * btcPrice).toLocaleString()}`,
    duration: option.duration,
    baseAPY: `${option.baseAPY}%`,
    boost: option.boost,
    boostedAPY: `${option.boostedAPY}%`,
    estimatedYield: `${periodYield.toFixed(6)} WBTC`,
    estimatedYieldUSD: `$${(periodYield * btcPrice).toFixed(2)}`,
    totalAtMaturity: `${totalAtMaturity.toFixed(6)} WBTC`,
    totalAtMaturityUSD: `$${(totalAtMaturity * btcPrice).toLocaleString()}`,
    unlockDate: unlockDate.toLocaleDateString(),
  }
}

export const getBondOptionById = (id: string): BondOption | undefined => {
  return bondOptions.find((option) => option.id === id)
}

export const getActiveBonds = (): ActiveBond[] => {
  return activeBonds
}
