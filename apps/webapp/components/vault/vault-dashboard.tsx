"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, DollarSign, BarChart3, AlertCircle, Clock, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VaultCard } from "./vault-card"
import { VaultActions } from "./vault-actions"
import { VaultPerformanceChart } from "./vault-performance-chart"
import { VaultPoolAllocations } from "./vault-pool-allocations"
import { VaultRebalanceHistory } from "./vault-rebalance-history"
import { VaultAlerts } from "./vault-alerts"
import { VesuPositionDisplay } from "./vesu-position-display"
import { VesuRebalanceManager } from "./vesu-rebalance-manager"
import { VesuPoolsOverview } from "./vesu-pools-overview"
import { VesuMarketsOverview } from "./vesu-markets-overview"
import type { VaultStrategy, VaultPosition, VaultMetrics } from "@/types/Vault"
import { getVaultStrategy, getUserVaultPositions, getVaultPerformanceMetrics } from "@/lib/vault-data"
import { useVesuPools } from "@/hooks/use-vesu-pools"
import { useVesuVaults } from "@/hooks/use-vesu-vaults"

interface VaultDashboardProps {
  vaultId: string
  userAddress?: string
}

export function VaultDashboard({ vaultId, userAddress }: VaultDashboardProps) {
  const [strategy, setStrategy] = useState<VaultStrategy | undefined>()
  const [position, setPosition] = useState<VaultPosition | undefined>()
  const [metrics, setMetrics] = useState<VaultMetrics | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const { pools: vesuPools, isLoading: poolsLoading, error: poolsError } = useVesuPools()
  const { vaults: realVaults, getVaultById } = useVesuVaults()

  useEffect(() => {
    const loadVaultData = async () => {
      setIsLoading(true)
      try {
        // Load real vault data only
        const vaultStrategy = await getVaultById(vaultId)
        
        if (!vaultStrategy) {
          console.error('Vault not found:', vaultId)
          setIsLoading(false)
          return
        }
        
        setStrategy(vaultStrategy)

        // Load user position if address provided
        if (userAddress) {
          const userPositions = getUserVaultPositions(userAddress)
          const userPosition = userPositions.find(p => p.vaultId === vaultId)
          setPosition(userPosition)
        }

        // Load metrics (mock for now)
        setMetrics({
          totalValue: vaultStrategy?.totalValue || 0,
          totalApy: vaultStrategy?.apy || 0,
          totalPools: vaultStrategy?.pools.length || 0,
          lastRebalance: vaultStrategy?.lastRebalanced || '',
          rebalanceCount: 12,
          averageGasCost: 0.0015,
          totalFees: 0.018,
          performance: {
            '1d': vaultStrategy?.performance['1d'] || 0,
            '7d': vaultStrategy?.performance['7d'] || 0,
            '30d': vaultStrategy?.performance['30d'] || 0,
            '90d': 19.8
          }
        })
      } catch (error) {
        console.error('Failed to load vault data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadVaultData()
  }, [vaultId, userAddress])

  const handleDeposit = async (amount: number) => {
    // TODO: Implement deposit logic
    console.log('Depositing:', amount)
  }

  const handleWithdraw = async (amount: number) => {
    // TODO: Implement withdrawal logic
    console.log('Withdrawing:', amount)
  }

  const handleRebalance = async () => {
    // TODO: Implement rebalance logic
    console.log('Rebalancing vault')
  }

  const handleConfigure = () => {
    // TODO: Implement configuration logic
    console.log('Opening configuration')
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-6">
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!strategy) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Vault Not Found</h3>
        <p className="text-gray-600">The requested vault could not be found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{strategy.name}</h1>
          <p className="text-gray-600 mt-1">{strategy.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`${
            strategy.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
            strategy.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {strategy.riskLevel} Risk
          </Badge>
          {strategy.verified && (
            <Badge variant="secondary">Verified</Badge>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {strategy.totalValue.toLocaleString()} WBTC
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">APY</p>
                <p className="text-2xl font-bold text-green-600">
                  {strategy.apy}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Performance (30d)</p>
                <p className="text-2xl font-bold text-green-600">
                  +{strategy.performance['30d']}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pools</p>
                <p className="text-2xl font-bold text-gray-900">
                  {strategy.pools.length}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts and Details */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="allocations">Allocations</TabsTrigger>
              <TabsTrigger value="markets">Markets</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="rebalance">Rebalance</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-4">
              <VaultPerformanceChart vaultId={vaultId} />
            </TabsContent>

            <TabsContent value="allocations" className="space-y-4">
              <VaultPoolAllocations strategy={strategy} />
              
              {/* Vesu Pools Overview */}
              <VesuPoolsOverview />
              
              {/* Vesu Positions */}
              {poolsLoading ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ) : poolsError ? (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-red-600 mb-2">Error loading Vesu pools</p>
                      <p className="text-sm text-red-500">{poolsError}</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                vesuPools
                  .filter(pool => pool.assets.some(asset => asset.symbol === 'WBTC'))
                  .map((pool) => {
                    const wbtcAsset = pool.assets.find(asset => asset.symbol === 'WBTC')
                    if (!wbtcAsset) return null
                    
                    return (
                      <VesuPositionDisplay
                        key={pool.id}
                        pool={{
                          id: pool.id,
                          name: pool.name,
                          extensionContractAddress: pool.extensionContractAddress,
                          owner: pool.owner,
                          isVerified: pool.isVerified,
                          shutdownMode: pool.shutdownMode,
                          assets: [wbtcAsset],
                          pairs: []
                        }}
                        userAddress={userAddress || ''}
                      />
                    )
                  })
              )}
            </TabsContent>

            <TabsContent value="markets" className="space-y-4">
              <VesuMarketsOverview />
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <VaultRebalanceHistory vaultId={vaultId} />
            </TabsContent>

            <TabsContent value="rebalance" className="space-y-4">
              <VesuRebalanceManager 
                contractAddress="0x1234567890abcdef1234567890abcdef12345678" // Replace with actual contract address
                onRebalanceComplete={(txHash) => {
                  console.log('Rebalance completed:', txHash)
                  // Refresh data or show notification
                }}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Actions and Alerts */}
        <div className="space-y-6">
          <VaultActions
            strategy={strategy}
            position={position}
            onDeposit={handleDeposit}
            onWithdraw={handleWithdraw}
            onRebalance={handleRebalance}
            onConfigure={handleConfigure}
          />

          <VaultAlerts vaultId={vaultId} />
        </div>
      </div>
    </div>
  )
}
