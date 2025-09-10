export interface VaultStrategy {
  id: string
  name: string
  description: string
  riskLevel: 'Low' | 'Medium' | 'High'
  apy: number
  totalValue: number
  createdAt: string
  lastRebalanced: string
  pools: VaultPoolAllocation[]
  performance: {
    '1d': number
    '7d': number
    '30d': number
  }
  tags: string[]
  verified: boolean
  featured: boolean
}

export interface VaultPoolAllocation {
  poolId: string
  poolName: string
  protocol: 'Vesu' | 'Ekubo'
  allocation: number // percentage
  apy: number
  tvl: number
  risk: 'Low' | 'Medium' | 'High'
  tokens: string[]
  address?: string
}

export interface VesuPoolSelection {
  poolId: string
  poolName: string
  protocol: 'Vesu'
  allocation: number
  apy: number
  tvl: number
  risk: 'Low' | 'Medium' | 'High'
  tokens: string[]
  address?: string
  selected: boolean
}

export interface VaultPosition {
  id: string
  vaultId: string
  userAddress: string
  amount: number
  shares: number
  entryPrice: number
  currentValue: number
  pnl: number
  pnlPercentage: number
  createdAt: string
  lastUpdated: string
}

export interface VaultRebalanceEvent {
  id: string
  vaultId: string
  timestamp: string
  trigger: 'manual' | 'automatic' | 'threshold' | 'scheduled'
  fromAllocation: VaultPoolAllocation[]
  toAllocation: VaultPoolAllocation[]
  gasCost: number
  slippage: number
  apyChange: number
}

export interface VaultMetrics {
  totalValue: number
  totalApy: number
  totalPools: number
  lastRebalance: string
  rebalanceCount: number
  averageGasCost: number
  totalFees: number
  performance: {
    '1d': number
    '7d': number
    '30d': number
    '90d': number
  }
}

export interface VaultConfig {
  id: string
  name: string
  description: string
  rebalancingMode: 'manual' | 'automatic' | 'hybrid'
  rebalanceThreshold: number // percentage change to trigger rebalance
  rebalanceFrequency: 'hourly' | 'daily' | 'weekly' | 'monthly'
  maxSlippage: number // percentage
  maxGasCost: number // in ETH
  minPoolAllocation: number // minimum percentage per pool
  maxPoolAllocation: number // maximum percentage per pool
  whitelistedPools: string[] // pool IDs that can be used
  blacklistedPools: string[] // pool IDs that cannot be used
  emergencyStop: boolean
  createdAt: string
  updatedAt: string
}

export interface VaultDeposit {
  id: string
  vaultId: string
  userAddress: string
  amount: number
  shares: number
  timestamp: string
  txHash: string
  status: 'pending' | 'confirmed' | 'failed'
}

export interface VaultWithdrawal {
  id: string
  vaultId: string
  userAddress: string
  shares: number
  amount: number
  timestamp: string
  txHash: string
  status: 'pending' | 'confirmed' | 'failed'
  fee: number
}

export interface VaultReward {
  id: string
  vaultId: string
  userAddress: string
  amount: number
  token: string
  timestamp: string
  source: 'lending' | 'liquidity' | 'staking' | 'rewards'
  apy: number
}

export interface VaultAnalytics {
  vaultId: string
  period: '1d' | '7d' | '30d' | '90d' | '1y'
  totalDeposits: number
  totalWithdrawals: number
  netDeposits: number
  totalRewards: number
  averageApy: number
  maxApy: number
  minApy: number
  volatility: number
  sharpeRatio: number
  maxDrawdown: number
  rebalanceCount: number
  averageRebalanceCost: number
  totalFees: number
  userCount: number
  activeUsers: number
}

export interface VaultAlert {
  id: string
  vaultId: string
  type: 'rebalance' | 'threshold' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: string
  read: boolean
  actionRequired: boolean
  actionUrl?: string
}

export interface VaultUser {
  address: string
  totalDeposits: number
  totalWithdrawals: number
  currentBalance: number
  totalPnl: number
  totalPnlPercentage: number
  vaults: string[]
  joinedAt: string
  lastActivity: string
  isActive: boolean
}

export interface VaultPoolPerformance {
  poolId: string
  poolName: string
  protocol: string
  apy: number
  apyChange24h: number
  tvl: number
  tvlChange24h: number
  volume24h: number
  volumeChange24h: number
  utilization: number
  riskScore: number
  lastUpdated: string
}

export interface VaultRebalanceStrategy {
  id: string
  name: string
  description: string
  algorithm: 'equal_weight' | 'risk_parity' | 'momentum' | 'mean_reversion' | 'custom'
  parameters: Record<string, any>
  performance: {
    sharpeRatio: number
    maxDrawdown: number
    volatility: number
    returns: number
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}
