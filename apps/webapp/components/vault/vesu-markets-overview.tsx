"use client"

import type React from "react"
import { TrendingUp, Shield, AlertTriangle, ExternalLink, RefreshCw, BarChart3, DollarSign } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useVesuMarkets } from "@/hooks/use-vesu-markets"
import type { ProcessedMarket } from "@/types/VesuMarkets"

export function VesuMarketsOverview() {
  const { processedMarkets, isLoading, error, refreshMarkets, bestMarket } = useVesuMarkets('WBTC')

  const getRiskLevel = (utilization: number): 'Low' | 'Medium' | 'High' => {
    if (utilization > 80) return 'High'
    if (utilization > 60) return 'Medium'
    return 'Low'
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'Low': return <Shield className="h-4 w-4 text-green-600" />
      case 'Medium': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'High': return <TrendingUp className="h-4 w-4 text-red-600" />
      default: return <Shield className="h-4 w-4 text-gray-600" />
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800 border-green-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'High': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Vesu Markets Overview
          </CardTitle>
          <CardDescription>Loading real-time market data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            Error Loading Markets
          </CardTitle>
          <CardDescription className="text-red-600">
            Failed to load Vesu markets data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={refreshMarkets} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalApy = processedMarkets.reduce((sum, market) => sum + market.supplyApy + market.defiSpringApy, 0)
  const avgApy = processedMarkets.length > 0 ? totalApy / processedMarkets.length : 0
  const totalSupplied = processedMarkets.reduce((sum, market) => sum + market.totalSupplied, 0)
  const totalDebt = processedMarkets.reduce((sum, market) => sum + market.totalDebt, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Vesu Markets Overview
            </CardTitle>
            <CardDescription>
              Real-time data from Vesu protocol markets
            </CardDescription>
          </div>
          <Button onClick={refreshMarkets} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Markets</p>
            <p className="text-2xl font-bold text-gray-900">{processedMarkets.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Avg APY</p>
            <p className="text-2xl font-bold text-green-600">{avgApy.toFixed(2)}%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Supplied</p>
            <p className="text-2xl font-bold text-blue-600">{totalSupplied.toFixed(2)} WBTC</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Debt</p>
            <p className="text-2xl font-bold text-red-600">{totalDebt.toFixed(2)} WBTC</p>
          </div>
        </div>

        {/* Best Market Highlight */}
        {bestMarket && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <TrendingUp className="h-5 w-5" />
                Best WBTC Market
              </CardTitle>
              <CardDescription className="text-green-700">
                Highest APY market for WBTC
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Pool</p>
                  <p className="font-semibold text-green-800">{bestMarket.poolName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total APY</p>
                  <p className="text-xl font-bold text-green-600">
                    {(bestMarket.supplyApy + bestMarket.defiSpringApy).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Utilization</p>
                  <p className="font-semibold text-gray-900">{bestMarket.currentUtilization.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Markets List */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Markets</TabsTrigger>
            <TabsTrigger value="high-apy">High APY</TabsTrigger>
            <TabsTrigger value="low-risk">Low Risk</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {processedMarkets.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No WBTC markets found</p>
              </div>
            ) : (
              processedMarkets.map((market) => {
                const risk = getRiskLevel(market.currentUtilization)
                const totalApy = market.supplyApy + market.defiSpringApy
                
                return (
                  <div key={`${market.poolId}-${market.address}`} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{market.name}</h4>
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            {market.poolName}
                          </Badge>
                          <Badge className={getRiskColor(risk)}>
                            {getRiskIcon(risk)}
                            <span className="ml-1">{risk}</span>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>APY: <span className="font-medium text-green-600">{totalApy.toFixed(2)}%</span></span>
                          <span>Utilization: <span className="font-medium">{market.currentUtilization.toFixed(1)}%</span></span>
                          <span>DeFi Spring: <span className="font-medium text-blue-600">{market.defiSpringApy.toFixed(2)}%</span></span>
                          <span>Borrow APR: <span className="font-medium text-red-600">{market.borrowApr.toFixed(2)}%</span></span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://vesu.xyz/pool/${market.poolId}`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>

                    {/* Utilization Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Utilization</span>
                        <span className="font-medium">{market.currentUtilization.toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={market.currentUtilization} 
                        className="h-2"
                        max={100}
                      />
                    </div>

                    {/* Market Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                      <div>
                        <span className="text-gray-600">Supplied:</span>
                        <span className="ml-2 font-medium">{market.totalSupplied.toFixed(2)} WBTC</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Debt:</span>
                        <span className="ml-2 font-medium">{market.totalDebt.toFixed(2)} WBTC</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Fee Rate:</span>
                        <span className="ml-2 font-medium">{market.feeRate.toFixed(4)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Max Util:</span>
                        <span className="ml-2 font-medium">{market.maxUtilization.toFixed(1)}%</span>
                      </div>
                    </div>

                    {/* Interest Rate Config */}
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Interest Rate Configuration</h5>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600">Target Util:</span>
                          <span className="ml-1 font-medium">{market.targetUtilization.toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Min Rate:</span>
                          <span className="ml-1 font-medium">{market.minFullUtilizationRate.toFixed(2)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Max Rate:</span>
                          <span className="ml-1 font-medium">{market.maxFullUtilizationRate.toFixed(2)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Zero Rate:</span>
                          <span className="ml-1 font-medium">{market.zeroUtilizationRate.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Market Addresses */}
                    <div className="mt-2 text-xs text-gray-500">
                      <div>Market: {market.address}</div>
                      <div>V-Token: {market.vTokenAddress}</div>
                    </div>
                  </div>
                )
              })
            )}
          </TabsContent>

          <TabsContent value="high-apy" className="space-y-4">
            {processedMarkets
              .sort((a, b) => (b.supplyApy + b.defiSpringApy) - (a.supplyApy + a.defiSpringApy))
              .slice(0, 5)
              .map((market) => {
                const risk = getRiskLevel(market.currentUtilization)
                const totalApy = market.supplyApy + market.defiSpringApy
                
                return (
                  <div key={`${market.poolId}-${market.address}`} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{market.name}</h4>
                        <p className="text-sm text-gray-600">{market.poolName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">{totalApy.toFixed(2)}%</p>
                        <Badge className={getRiskColor(risk)}>
                          {getRiskIcon(risk)}
                          <span className="ml-1">{risk}</span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                )
              })}
          </TabsContent>

          <TabsContent value="low-risk" className="space-y-4">
            {processedMarkets
              .filter(market => market.currentUtilization < 60)
              .sort((a, b) => a.currentUtilization - b.currentUtilization)
              .map((market) => {
                const risk = getRiskLevel(market.currentUtilization)
                const totalApy = market.supplyApy + market.defiSpringApy
                
                return (
                  <div key={`${market.poolId}-${market.address}`} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{market.name}</h4>
                        <p className="text-sm text-gray-600">{market.poolName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{market.currentUtilization.toFixed(1)}% util</p>
                        <p className="text-sm font-medium text-green-600">{totalApy.toFixed(2)}% APY</p>
                      </div>
                    </div>
                  </div>
                )
              })}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
