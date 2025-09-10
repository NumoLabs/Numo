"use client"

import type React from "react"
import { TrendingUp, Shield, AlertTriangle, ExternalLink, RefreshCw } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useVesuPools } from "@/hooks/use-vesu-pools"
import type { VesuPool, ProcessedAsset } from "@/types/VesuPools"
import { processVesuAsset } from "@/app/api/vesuApi"

export function VesuPoolsOverview() {
  const { pools, isLoading, error, refreshPools } = useVesuPools()

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
            <TrendingUp className="h-5 w-5" />
            Vesu Pools Overview
          </CardTitle>
          <CardDescription>Loading real-time pool data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-gray-200 rounded"></div>
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
            Error Loading Pools
          </CardTitle>
          <CardDescription className="text-red-600">
            Failed to load Vesu pools data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={refreshPools} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const wbtcPools = pools.filter(pool => 
    pool.assets.some(asset => asset.symbol === 'WBTC')
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Vesu Pools Overview
            </CardTitle>
            <CardDescription>
              Real-time data from Vesu protocol pools
            </CardDescription>
          </div>
          <Button onClick={refreshPools} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Pools</p>
            <p className="text-2xl font-bold text-gray-900">{pools.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">WBTC Pools</p>
            <p className="text-2xl font-bold text-blue-600">{wbtcPools.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Avg APY</p>
            <p className="text-2xl font-bold text-green-600">
              {wbtcPools.length > 0 
                ? (wbtcPools.reduce((sum, pool) => {
                    const wbtcAsset = pool.assets.find(asset => asset.symbol === 'WBTC')
                    if (!wbtcAsset) return sum
                    const processedAsset = processVesuAsset(wbtcAsset)
                    return sum + processedAsset.apy
                  }, 0) / wbtcPools.length).toFixed(2)
                : '0.00'
              }%
            </p>
          </div>
        </div>

        {/* WBTC Pools */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">WBTC Pools</h3>
          {wbtcPools.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No WBTC pools found</p>
            </div>
          ) : (
            wbtcPools.map((pool) => {
              const wbtcAsset = pool.assets.find(asset => asset.symbol === 'WBTC')
              if (!wbtcAsset) return null
              
              const processedAsset = processVesuAsset(wbtcAsset)
              const risk = getRiskLevel(processedAsset.currentUtilization)
              
              return (
                <div key={pool.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{pool.name}</h4>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          Vesu
                        </Badge>
                        <Badge className={getRiskColor(risk)}>
                          {getRiskIcon(risk)}
                          <span className="ml-1">{risk}</span>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>APY: <span className="font-medium text-green-600">{processedAsset.apy.toFixed(2)}%</span></span>
                        <span>Utilization: <span className="font-medium">{processedAsset.currentUtilization.toFixed(1)}%</span></span>
                        <span>DeFi Spring: <span className="font-medium text-blue-600">{processedAsset.defiSpringApy.toFixed(2)}%</span></span>
                        <span>Borrow APR: <span className="font-medium text-red-600">{processedAsset.borrowApr.toFixed(2)}%</span></span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://vesu.xyz/pool/${pool.id}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>

                  {/* Utilization Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Utilization</span>
                      <span className="font-medium">{processedAsset.currentUtilization.toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={processedAsset.currentUtilization} 
                      className="h-2"
                      max={100}
                    />
                  </div>

                  {/* Additional Stats */}
                  <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                    <div>
                      <span className="text-gray-600">Total Supplied:</span>
                      <span className="ml-2 font-medium">{processedAsset.totalSupplied.toFixed(2)} WBTC</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Debt:</span>
                      <span className="ml-2 font-medium">{processedAsset.totalDebt.toFixed(2)} WBTC</span>
                    </div>
                    <div>
                      <span className="text-gray-600">LST APR:</span>
                      <span className="ml-2 font-medium text-purple-600">{processedAsset.lstApr.toFixed(2)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Can Borrow:</span>
                      <span className="ml-2 font-medium">{processedAsset.canBeBorrowed ? 'Yes' : 'No'}</span>
                    </div>
                  </div>

                  {/* Pool Address */}
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">
                      Address: {pool.extensionContractAddress}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
