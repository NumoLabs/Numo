import { getVesuPools, getVesuMarkets } from './vesuApi'
import { getVesuMarketsByToken } from './vesuMarketsApi'
import type { VaultStrategy } from '@/types/Vault'
import type { VesuPool } from '@/types/VesuPools'
import type { ProcessedMarket } from '@/types/VesuMarkets'

// Generate real vault strategies based on Vesu pools and markets
export async function getRealVesuVaults(): Promise<VaultStrategy[]> {
  console.log('🚀 getRealVesuVaults called')
  
  try {
    console.log('📡 Fetching pools and markets...')
    const [pools, markets] = await Promise.all([
      getVesuPools(),
      getVesuMarketsByToken('WBTC')
    ])

    console.log('📊 Pools received:', pools.length)
    console.log('📈 Markets received:', markets.length)

    const vaults: VaultStrategy[] = []

    // Create vaults based on pools with WBTC
    const wbtcPools = pools.filter(pool => 
      pool.assets.some(asset => asset.symbol === 'WBTC')
    )

    console.log('🔍 All pools:', pools.length)
    console.log('🔍 WBTC pools found:', wbtcPools.length)
    console.log('🔍 WBTC pool details:', wbtcPools.map(p => ({ id: p.id, name: p.name, assets: p.assets.map(a => a.symbol) })))

    console.log('🔍 WBTC pools found:', wbtcPools.length)

    // If no WBTC pools found, return empty array instead of demo data
    if (wbtcPools.length === 0) {
      console.log('No WBTC pools found in Vesu API')
      return []
    }

    wbtcPools.forEach((pool, index) => {
      const wbtcAsset = pool.assets.find(asset => asset.symbol === 'WBTC')
      if (!wbtcAsset) return

      // Calculate real APY from stats
      const supplyApy = (Number(wbtcAsset.stats.supplyApy.value) / 10 ** wbtcAsset.stats.supplyApy.decimals) * 100
      const defiSpringApy = (Number(wbtcAsset.stats.defiSpringSupplyApr.value) / 10 ** wbtcAsset.stats.defiSpringSupplyApr.decimals) * 100
      const totalApy = supplyApy + defiSpringApy

      // Calculate real TVL
      const totalSupplied = Number(wbtcAsset.stats.totalSupplied.value) / 10 ** wbtcAsset.stats.totalSupplied.decimals
      const totalDebt = Number(wbtcAsset.stats.totalDebt.value) / 10 ** wbtcAsset.stats.totalDebt.decimals
      const tvl = totalSupplied + totalDebt

      // Calculate utilization
      const utilization = (Number(wbtcAsset.stats.currentUtilization.value) / 10 ** wbtcAsset.stats.currentUtilization.decimals) * 100

      // Determine risk level based on utilization
      let riskLevel: 'Low' | 'Medium' | 'High' = 'Low'
      if (utilization > 80) riskLevel = 'High'
      else if (utilization > 60) riskLevel = 'Medium'

      // Determine strategy type based on APY and risk
      let strategyType = 'Conservative'
      let description = 'Conservative WBTC lending strategy with stable returns'
      
      if (totalApy > 15) {
        strategyType = 'Aggressive'
        description = 'High-yield WBTC strategy with advanced DeFi protocols'
      } else if (totalApy > 10) {
        strategyType = 'Balanced'
        description = 'Balanced WBTC strategy optimizing yield and risk'
      }

      const vault: VaultStrategy = {
        id: `vesu-${pool.id}-${index}`,
        name: `Vesu ${strategyType} Vault`,
        description: `${description} on ${pool.name}`,
        riskLevel,
        apy: Number(totalApy.toFixed(2)),
        totalValue: Number(tvl.toFixed(2)),
        createdAt: new Date().toISOString().split('T')[0],
        lastRebalanced: new Date().toISOString(),
        pools: [
          {
            poolId: pool.id,
            poolName: pool.name,
            protocol: 'Vesu',
            allocation: 100,
            apy: Number(totalApy.toFixed(2)),
            tvl: Number(tvl.toFixed(2)),
            risk: riskLevel,
            tokens: ['WBTC'],
            address: pool.extensionContractAddress
          }
        ],
        performance: {
          '1d': Number((Math.random() * 2 - 1).toFixed(2)), // Mock performance data
          '7d': Number((Math.random() * 5 - 2.5).toFixed(2)),
          '30d': Number((Math.random() * 15 - 5).toFixed(2))
        },
        tags: [strategyType, 'Vesu', 'WBTC', 'Lending'],
        verified: pool.isVerified,
        featured: index === 0, // First vault is featured
        creator: {
          name: 'Vesu Protocol',
          address: pool.owner,
          verified: true
        },
        fees: {
          management: 0.5, // 0.5% management fee
          performance: 10   // 10% performance fee
        },
        minDeposit: 0.001, // Minimum 0.001 WBTC
        maxDeposit: 1000,   // Maximum 1000 WBTC
        totalDeposits: Number(tvl.toFixed(2)),
        totalWithdrawals: 0,
        activeUsers: Math.floor(Math.random() * 100) + 10, // Mock user count
        lastActivity: new Date().toISOString(),
        status: 'active' as const,
        apyHistory: {
          '1d': Number((totalApy + (Math.random() * 2 - 1)).toFixed(2)),
          '7d': Number((totalApy + (Math.random() * 3 - 1.5)).toFixed(2)),
          '30d': Number((totalApy + (Math.random() * 5 - 2.5)).toFixed(2))
        },
        riskMetrics: {
          volatility: utilization > 80 ? 'High' : utilization > 60 ? 'Medium' : 'Low',
          maxDrawdown: utilization > 80 ? 15 : utilization > 60 ? 10 : 5,
          sharpeRatio: utilization > 80 ? 1.2 : utilization > 60 ? 1.5 : 2.0
        }
      }

      vaults.push(vault)
    })

    // Sort by APY descending
    return vaults.sort((a, b) => b.apy - a.apy)

  } catch (error) {
    console.error('❌ Failed to generate real Vesu vaults:', error)
    // Return empty array if API fails instead of demo data
    return []
  }
}

// Get vault by ID with real data
export async function getRealVesuVault(vaultId: string): Promise<VaultStrategy | null> {
  const vaults = await getRealVesuVaults()
  return vaults.find(vault => vault.id === vaultId) || null
}

// Get recommended vault based on user preferences
export async function getRecommendedVesuVault(
  riskTolerance: 'Low' | 'Medium' | 'High' = 'Medium'
): Promise<VaultStrategy | null> {
  const vaults = await getRealVesuVaults()
  
  if (vaults.length === 0) return null

  // Filter by risk tolerance
  const filteredVaults = vaults.filter(vault => vault.riskLevel === riskTolerance)
  
  if (filteredVaults.length === 0) {
    // If no vaults match risk tolerance, return the best overall
    return vaults[0]
  }

  // Return the best APY vault for the risk tolerance
  return filteredVaults[0]
}
