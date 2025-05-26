export interface Strategy {
  id: string
  name: string
  description: string
  creator: string
  creatorName?: string
  apy: string
  risk: "Low" | "Medium" | "High"
  tvl: string
  followers: number
  allocation: Array<{
    protocol: string
    percentage: number
    pool: string
  }>
  performance: {
    "1d": string
    "7d": string
    "30d": string
  }
  tags: string[]
  verified: boolean
  featured: boolean
  createdAt: string
}

export const marketplaceStrategies: Strategy[] = [
  {
    id: "safe-btc-conservative",
    name: "Safe BTC Conservative",
    description: "Ultra-conservative strategy focused on lending with minimal risk exposure",
    creator: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    creatorName: "BTCMaxi.stark",
    apy: "5.2%",
    risk: "Low",
    tvl: "127.8 BTC",
    followers: 1247,
    allocation: [
      { protocol: "Vesu", percentage: 80, pool: "BTC Lending" },
      { protocol: "Vesu", percentage: 20, pool: "BTC Vault" },
    ],
    performance: {
      "1d": "+0.12%",
      "7d": "+0.89%",
      "30d": "+4.23%",
    },
    tags: ["Conservative", "Lending", "Stable"],
    verified: true,
    featured: true,
    createdAt: "2024-01-15",
  },
  {
    id: "aggro-rebalancer",
    name: "Aggro Rebalancer",
    description: "Dynamic rebalancing between lending and liquidity pools for maximum yield",
    creator: "0x8f3CF7ad23Cd3CaDbD9735AFf958023239c6A063",
    creatorName: "YieldHunter",
    apy: "8.7%",
    risk: "High",
    tvl: "89.3 BTC",
    followers: 892,
    allocation: [
      { protocol: "Ekubo", percentage: 45, pool: "BTC/USDC LP" },
      { protocol: "Ekubo", percentage: 25, pool: "BTC/ETH LP" },
      { protocol: "Vesu", percentage: 30, pool: "BTC Lending" },
    ],
    performance: {
      "1d": "+0.34%",
      "7d": "+2.15%",
      "30d": "+8.92%",
    },
    tags: ["Aggressive", "Rebalancing", "High Yield"],
    verified: true,
    featured: true,
    createdAt: "2024-01-20",
  },
  {
    id: "yield-maxx",
    name: "Yield Maxx",
    description: "Maximum yield strategy utilizing all available DeFi protocols",
    creator: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    creatorName: "DefiAlpha",
    apy: "12.4%",
    risk: "High",
    tvl: "45.7 BTC",
    followers: 634,
    allocation: [
      { protocol: "Ekubo", percentage: 40, pool: "BTC/USDC LP" },
      { protocol: "Ekubo", percentage: 30, pool: "BTC/ETH LP" },
      { protocol: "Vesu", percentage: 20, pool: "BTC Lending" },
      { protocol: "Vesu", percentage: 10, pool: "BTC Vault" },
    ],
    performance: {
      "1d": "+0.67%",
      "7d": "+3.42%",
      "30d": "+12.18%",
    },
    tags: ["Maximum Yield", "Multi-Protocol", "Advanced"],
    verified: false,
    featured: false,
    createdAt: "2024-02-01",
  },
  {
    id: "balanced-growth",
    name: "Balanced Growth",
    description: "Moderate risk strategy balancing growth and stability",
    creator: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    creatorName: "BalancedTrader",
    apy: "6.8%",
    risk: "Medium",
    tvl: "156.2 BTC",
    followers: 1089,
    allocation: [
      { protocol: "Vesu", percentage: 60, pool: "BTC Lending" },
      { protocol: "Ekubo", percentage: 25, pool: "BTC/USDC LP" },
      { protocol: "Ekubo", percentage: 15, pool: "BTC/ETH LP" },
    ],
    performance: {
      "1d": "+0.18%",
      "7d": "+1.24%",
      "30d": "+5.67%",
    },
    tags: ["Balanced", "Growth", "Moderate Risk"],
    verified: true,
    featured: false,
    createdAt: "2024-01-25",
  },
  {
    id: "liquidity-focused",
    name: "Liquidity Focused",
    description: "Concentrated liquidity provision across major BTC pairs",
    creator: "0xA0b86a33E6441E13C7d3fF4A4C2C8a2e4C8e4C8e",
    creatorName: "LPMaster",
    apy: "9.3%",
    risk: "Medium",
    tvl: "73.4 BTC",
    followers: 567,
    allocation: [
      { protocol: "Ekubo", percentage: 50, pool: "BTC/USDC LP" },
      { protocol: "Ekubo", percentage: 35, pool: "BTC/ETH LP" },
      { protocol: "Vesu", percentage: 15, pool: "BTC Lending" },
    ],
    performance: {
      "1d": "+0.28%",
      "7d": "+1.89%",
      "30d": "+7.45%",
    },
    tags: ["Liquidity", "LP Focused", "Pairs Trading"],
    verified: true,
    featured: false,
    createdAt: "2024-02-05",
  },
]

export function getStrategyById(id: string): Strategy | undefined {
  return marketplaceStrategies.find((strategy) => strategy.id === id)
}

export function getStrategiesByRisk(risk: Strategy["risk"]): Strategy[] {
  return marketplaceStrategies.filter((strategy) => strategy.risk === risk)
}

export function getFeaturedStrategies(): Strategy[] {
  return marketplaceStrategies.filter((strategy) => strategy.featured)
}

export function getVerifiedStrategies(): Strategy[] {
  return marketplaceStrategies.filter((strategy) => strategy.verified)
}

export function sortStrategiesByAPY(strategies: Strategy[], ascending = false): Strategy[] {
  return [...strategies].sort((a, b) => {
    const apyA = Number.parseFloat(a.apy.replace("%", ""))
    const apyB = Number.parseFloat(b.apy.replace("%", ""))
    return ascending ? apyA - apyB : apyB - apyA
  })
}

export function sortStrategiesByTVL(strategies: Strategy[], ascending = false): Strategy[] {
  return [...strategies].sort((a, b) => {
    const tvlA = Number.parseFloat(a.tvl.replace(" BTC", ""))
    const tvlB = Number.parseFloat(b.tvl.replace(" BTC", ""))
    return ascending ? tvlA - tvlB : tvlB - tvlA
  })
}

export function sortStrategiesByFollowers(strategies: Strategy[], ascending = false): Strategy[] {
  return [...strategies].sort((a, b) => {
    return ascending ? a.followers - b.followers : b.followers - a.followers
  })
}
