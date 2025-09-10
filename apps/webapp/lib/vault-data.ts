import type { 
  VaultStrategy, 
  VaultPosition, 
  VaultRebalanceEvent, 
  VaultMetrics, 
  VaultConfig,
  VaultDeposit,
  VaultWithdrawal,
  VaultReward,
  VaultAnalytics,
  VaultAlert,
  VaultUser,
  VaultPoolPerformance,
  VaultRebalanceStrategy
} from '@/types/Vault'
import { vesuConfig, getAssetBySymbol } from './vesu-config'
import { Pool, createPoolFromConfig } from './vesu-pool'

// DEPRECATED: Use getRealVesuVaults() from vesuVaultsApi.ts instead
// This is kept for backward compatibility only
export const vaultStrategies: VaultStrategy[] = []

// Mock data for vault positions (these will be replaced with real data from Vesu)
export const vaultPositions: VaultPosition[] = [
  {
    id: 'pos-1',
    vaultId: 'wbtc-conservative-vault',
    userAddress: '0x1234567890abcdef1234567890abcdef12345678',
    amount: 1.5,
    entryPrice: 45000,
    currentValue: 67500,
    pnl: 22500,
    pnlPercentage: 50.0,
    entryTime: '2024-01-15T10:30:00Z',
    lastUpdated: '2024-01-20T10:30:00Z',
    status: 'active' as const,
    fees: {
      management: 0.5,
      performance: 10
    }
  }
]

// Mock data for rebalance events
export const vaultRebalanceEvents: VaultRebalanceEvent[] = [
  {
    id: 'rebalance-1',
    vaultId: 'wbtc-conservative-vault',
    timestamp: '2024-01-20T10:30:00Z',
    type: 'automatic' as const,
    description: 'Rebalanced to optimize yield based on market conditions',
    changes: [
      {
        poolId: 'genesis-pool',
        action: 'increase',
        amount: 0.1,
        reason: 'Higher APY detected'
      }
    ],
    gasCost: 0.0015,
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
  }
]

// Mock data for vault configuration
export const vaultConfig: VaultConfig = {
  id: 'config-1',
  name: 'Default WBTC Vault Configuration',
  description: 'Standard configuration for WBTC vaults',
  whitelistedPools: ['genesis-pool'],
  maxPools: 5,
  rebalanceThreshold: 5.0,
  maxSlippage: 1.0,
  minDeposit: 0.001,
  maxDeposit: 1000,
  managementFee: 0.5,
  performanceFee: 10,
  emergencyPause: false,
  createdAt: '2024-01-15T00:00:00Z',
  updatedAt: '2024-01-20T10:30:00Z'
}

// Mock data for vault pool performance
export const vaultPoolPerformance: VaultPoolPerformance[] = [
  {
    poolId: 'genesis-pool',
    poolName: 'Vesu Genesis Pool - WBTC Lending',
    apy: 5.2,
    tvl: 127.8,
    utilization: 75.5,
    performance: {
      '1d': 0.12,
      '7d': 0.89,
      '30d': 4.23
    },
    risk: 'Low',
    lastUpdated: '2024-01-20T10:30:00Z'
  }
]

// Helper functions for Vesu integration
export function getVesuAssetInfo(symbol: string) {
  return getAssetBySymbol(symbol)
}

export function getVesuPoolConfig(poolId: string) {
  return vesuConfig.pools[poolId]
}

export function getAvailableVesuAssets() {
  return vesuConfig.env.map(asset => ({
    symbol: asset.symbol,
    name: asset.name,
    decimals: asset.decimals,
    address: asset.address
  }))
}

// Create a Vesu pool instance
export function createVesuPool(poolId: string): Pool | null {
  const poolConfig = vesuConfig.pools[poolId]
  if (!poolConfig) return null
  
  return createPoolFromConfig(poolId, poolConfig)
}

// Get all Vesu pool configurations
export function getAllVesuPoolConfigs() {
  return Object.entries(vesuConfig.pools).map(([id, config]) => ({
    id,
    ...config
  }))
}

// Get pool asset parameters
export function getPoolAssetParams(poolId: string) {
  const pool = vesuConfig.pools[poolId]
  return pool?.params.asset_params || []
}

// Get pool LTV parameters
export function getPoolLTVParams(poolId: string) {
  const pool = vesuConfig.pools[poolId]
  return pool?.params.ltv_params || []
}

// Get pool interest rate configurations
export function getPoolInterestRateConfigs(poolId: string) {
  const pool = vesuConfig.pools[poolId]
  return pool?.params.interest_rate_configs || []
}

// Get pool liquidation parameters
export function getPoolLiquidationParams(poolId: string) {
  const pool = vesuConfig.pools[poolId]
  return pool?.params.liquidation_params || []
}

// Get pool debt caps parameters
export function getPoolDebtCapsParams(poolId: string) {
  const pool = vesuConfig.pools[poolId]
  return pool?.params.debt_caps_params || []
}

// Get pool shutdown parameters
export function getPoolShutdownParams(poolId: string) {
  const pool = vesuConfig.pools[poolId]
  return pool?.params.shutdown_params || null
}

// Get pool fee parameters
export function getPoolFeeParams(poolId: string) {
  const pool = vesuConfig.pools[poolId]
  return pool?.params.fee_params || null
}

// DEPRECATED: Use getRealVesuVault() from vesuVaultsApi.ts instead
export function getVaultStrategy(vaultId: string): VaultStrategy | undefined {
  console.warn('getVaultStrategy is deprecated. Use getRealVesuVault from vesuVaultsApi.ts instead')
  return undefined
}

// DEPRECATED: Use getRealVesuVaults() from vesuVaultsApi.ts instead
export function getRecommendedVaultStrategy(): VaultStrategy | undefined {
  console.warn('getRecommendedVaultStrategy is deprecated. Use getRecommendedVesuVault from vesuVaultsApi.ts instead')
  return undefined
}

// Mock functions for backward compatibility
export function getUserVaultPositions(userAddress: string): VaultPosition[] {
  return vaultPositions.filter(pos => pos.userAddress === userAddress)
}

export function getVaultPerformanceMetrics(vaultId: string): VaultMetrics {
  return {
    totalValue: 0,
    totalApy: 0,
    totalPools: 0,
    lastRebalance: '',
    rebalanceCount: 0,
    averageGasCost: 0,
    totalFees: 0,
    performance: {
      '1d': 0,
      '7d': 0,
      '30d': 0,
      '90d': 0
    }
  }
}