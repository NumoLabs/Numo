"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { 
  TrendingUp, 
  BarChart3, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Zap,
  Shield,
  Activity
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useVesuRebalance, type RebalanceStrategy } from "@/hooks/use-vesu-rebalance"
import { useVesuPools } from "@/hooks/use-vesu-pools"
import { processVesuAsset } from "@/app/api/vesuApi"
import type { VesuPool, ProcessedAsset } from "@/types/VesuPools"

interface VesuRebalanceManagerProps {
  contractAddress: string
  onRebalanceComplete?: (txHash: string) => void
}

const REBALANCE_STRATEGIES: RebalanceStrategy[] = [
  {
    id: 'yield_optimization',
    name: 'Yield Optimization',
    description: 'Automatically rebalances to pools with highest yield',
    algorithm: 'yield_optimization',
    parameters: {
      minYieldImprovement: 0.5, // 0.5%
      maxSlippage: 1.0, // 1%
      rebalanceThreshold: 5.0, // 5%
      maxPoolWeight: 80 // 80%
    }
  },
  {
    id: 'weight_balancing',
    name: 'Weight Balancing',
    description: 'Maintains equal weights across all pools',
    algorithm: 'weight_balancing',
    parameters: {
      minYieldImprovement: 0.1,
      maxSlippage: 0.5,
      rebalanceThreshold: 2.0,
      maxPoolWeight: 50
    }
  },
  {
    id: 'risk_parity',
    name: 'Risk Parity',
    description: 'Balances risk across pools based on volatility',
    algorithm: 'risk_parity',
    parameters: {
      minYieldImprovement: 0.3,
      maxSlippage: 0.8,
      rebalanceThreshold: 3.0,
      maxPoolWeight: 60
    }
  },
  {
    id: 'momentum',
    name: 'Momentum Strategy',
    description: 'Follows recent performance trends',
    algorithm: 'momentum',
    parameters: {
      minYieldImprovement: 0.2,
      maxSlippage: 1.2,
      rebalanceThreshold: 4.0,
      maxPoolWeight: 70
    }
  }
]

export function VesuRebalanceManager({ contractAddress, onRebalanceComplete }: VesuRebalanceManagerProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<string>('yield_optimization')
  const [autoRebalance, setAutoRebalance] = useState(false)
  const [rebalanceThreshold, setRebalanceThreshold] = useState(5.0)
  const [isMonitoring, setIsMonitoring] = useState(false)
  
  const {
    isRebalancing,
    isComputingYield,
    currentYield,
    allowedPools,
    settings,
    error,
    transactionHash,
    lastRebalance,
    rebalance,
    executeStrategy,
    computeYield,
    emergencyWithdraw,
    isConnected
  } = useVesuRebalance(contractAddress)

  const {
    pools: vesuPools,
    isLoading: isLoadingPools,
    error: poolsError,
    bestPool
  } = useVesuPools()

  const selectedStrategyConfig = REBALANCE_STRATEGIES.find(s => s.id === selectedStrategy)

  // Process Vesu pools data for display
  const processedPools = vesuPools
    .map((pool: VesuPool) => {
      const wbtcAsset = pool.assets.find(asset => asset.symbol === 'WBTC')
      if (!wbtcAsset) return null

      const processedAsset = processVesuAsset(wbtcAsset)
      const totalApy = processedAsset.apy + processedAsset.defiSpringApy
      const tvl = processedAsset.totalSupplied

      return {
        poolId: pool.id,
        poolName: pool.name,
        protocol: 'Vesu',
        allocation: 100, // This would come from the vault's actual allocation
        apy: totalApy,
        tvl: tvl,
        risk: processedAsset.currentUtilization > 80 ? 'High' : 
              processedAsset.currentUtilization > 50 ? 'Medium' : 'Low',
        tokens: pool.assets.map(asset => asset.symbol),
        address: pool.extensionContractAddress,
        processedAsset
      }
    })
    .filter((pool): pool is NonNullable<typeof pool> => pool !== null)

  // Auto rebalancing monitoring
  useEffect(() => {
    if (!autoRebalance || !isConnected) return

    const interval = setInterval(async () => {
      try {
        const yieldInfo = await computeYield()
        if (yieldInfo && currentYield) {
          const yieldChange = Number(yieldInfo.yield) - Number(currentYield.yield)
          const yieldChangePercent = (yieldChange / Number(currentYield.yield)) * 100

          if (Math.abs(yieldChangePercent) >= rebalanceThreshold) {
            await executeStrategy(selectedStrategyConfig!)
          }
        }
      } catch (error) {
        console.error('Auto rebalancing error:', error)
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [autoRebalance, rebalanceThreshold, selectedStrategyConfig, isConnected, computeYield, executeStrategy, currentYield])

  const handleManualRebalance = async () => {
    if (!selectedStrategyConfig) return

    try {
      const txHash = await executeStrategy(selectedStrategyConfig)
      onRebalanceComplete?.(txHash)
    } catch (error) {
      console.error('Manual rebalancing failed:', error)
    }
  }

  const handleEmergencyWithdraw = async () => {
    if (!confirm('Are you sure you want to perform emergency withdrawal? This will withdraw all funds from pools.')) {
      return
    }

    try {
      await emergencyWithdraw()
    } catch (error) {
      console.error('Emergency withdraw failed:', error)
    }
  }

  const getYieldChangeColor = (yieldChange: number) => {
    if (yieldChange > 0) return 'text-green-600'
    if (yieldChange < -1) return 'text-red-600'
    return 'text-yellow-600'
  }

  const getYieldChangeIcon = (yieldChange: number) => {
    if (yieldChange > 0) return <TrendingUp className="h-4 w-4" />
    if (yieldChange < -1) return <AlertTriangle className="h-4 w-4" />
    return <Activity className="h-4 w-4" />
  }

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Auto Rebalancing
          </CardTitle>
          <CardDescription>
            Connect your wallet to manage auto rebalancing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Wallet not connected</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Rebalancing Status
          </CardTitle>
          <CardDescription>
            Current yield and pool allocation status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Yield Information */}
          {currentYield && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Current Yield</p>
                <p className="text-2xl font-bold text-green-600">
                  {(Number(currentYield.yield) / 1e18 * 100).toFixed(4)}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Assets</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(Number(currentYield.totalAmount) / 1e18).toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Pools</p>
                <p className="text-2xl font-bold text-blue-600">
                  {allowedPools.length}
                </p>
              </div>
            </div>
          )}

          {/* Pool Weights */}
          {allowedPools.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Pool Allocations</h4>
              {allowedPools.map((pool, index) => (
                <div key={pool.poolId} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Pool {index + 1}</span>
                    <span className="text-gray-600">{pool.maxWeight / 100}%</span>
                  </div>
                  <Progress value={pool.maxWeight / 100} className="h-2" />
                </div>
              ))}
            </div>
          )}

          {/* Real Pool Data */}
          {isLoadingPools ? (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Available Pools</h4>
              <div className="text-center py-4">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Loading pool data...</p>
              </div>
            </div>
          ) : poolsError ? (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Available Pools</h4>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-red-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Error loading pools</span>
                </div>
                <p className="text-xs text-red-700 mt-1">{poolsError}</p>
              </div>
            </div>
          ) : processedPools.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Available Pools</h4>
              <div className="space-y-2">
                {processedPools.map((pool, index) => (
                  <div key={pool.poolId} className="p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h5 className="font-medium text-sm">{pool.poolName}</h5>
                        <p className="text-xs text-gray-600">{pool.protocol}</p>
                      </div>
                      <Badge variant={pool.risk === 'High' ? 'destructive' : pool.risk === 'Medium' ? 'default' : 'secondary'}>
                        {pool.risk}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-600">APY:</span>
                        <span className="ml-1 font-medium text-green-600">{pool.apy.toFixed(2)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">TVL:</span>
                        <span className="ml-1 font-medium">{pool.tvl.toFixed(2)} WBTC</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Tokens:</span>
                        <span className="ml-1 font-medium">{pool.tokens.join(', ')}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Address:</span>
                        <span className="ml-1 font-mono text-xs">{pool.address.slice(0, 8)}...</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Last Rebalance */}
          {lastRebalance && (
            <div className="text-sm text-gray-600">
              Last rebalanced: {new Date(lastRebalance).toLocaleString()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rebalancing Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Rebalancing Controls
          </CardTitle>
          <CardDescription>
            Configure and execute rebalancing strategies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="strategy" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="strategy">Strategy</TabsTrigger>
              <TabsTrigger value="auto">Auto Mode</TabsTrigger>
              <TabsTrigger value="emergency">Emergency</TabsTrigger>
            </TabsList>

            <TabsContent value="strategy" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Rebalancing Strategy</Label>
                  <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {REBALANCE_STRATEGIES.map((strategy) => (
                        <SelectItem key={strategy.id} value={strategy.id}>
                          <div>
                            <div className="font-medium">{strategy.name}</div>
                            <div className="text-sm text-gray-600">{strategy.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedStrategyConfig && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Strategy Parameters</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Min Yield Improvement:</span>
                        <span className="ml-2 font-medium">{selectedStrategyConfig.parameters.minYieldImprovement}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Max Slippage:</span>
                        <span className="ml-2 font-medium">{selectedStrategyConfig.parameters.maxSlippage}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Rebalance Threshold:</span>
                        <span className="ml-2 font-medium">{selectedStrategyConfig.parameters.rebalanceThreshold}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Max Pool Weight:</span>
                        <span className="ml-2 font-medium">{selectedStrategyConfig.parameters.maxPoolWeight}%</span>
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleManualRebalance}
                  disabled={isRebalancing || !selectedStrategyConfig}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isRebalancing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Rebalancing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Execute Rebalancing
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="auto" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-rebalance"
                    checked={autoRebalance}
                    onCheckedChange={setAutoRebalance}
                  />
                  <Label htmlFor="auto-rebalance">Enable Auto Rebalancing</Label>
                </div>

                <div className="space-y-2">
                  <Label>Rebalance Threshold (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="20"
                    value={rebalanceThreshold}
                    onChange={(e) => setRebalanceThreshold(parseFloat(e.target.value))}
                  />
                  <p className="text-xs text-gray-600">
                    Trigger rebalancing when yield changes by this percentage
                  </p>
                </div>

                {autoRebalance && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-green-800">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium">Auto Rebalancing Active</span>
                    </div>
                    <p className="text-xs text-green-700 mt-1">
                      Monitoring yield changes every 30 seconds
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="emergency" className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-red-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">Emergency Controls</span>
                  </div>
                  <p className="text-xs text-red-700 mt-1">
                    Use these controls only in emergency situations
                  </p>
                </div>

                <Button 
                  onClick={handleEmergencyWithdraw}
                  disabled={isRebalancing}
                  variant="destructive"
                  className="w-full"
                >
                  {isRebalancing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Withdrawing...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Emergency Withdraw All
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Transaction Hash */}
      {transactionHash && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Transaction Successful</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              TX: {transactionHash}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
