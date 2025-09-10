"use client"

import type React from "react"
import { Shield, AlertTriangle, TrendingUp, ExternalLink } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import type { VaultStrategy } from "@/types/Vault"

interface VaultPoolAllocationsProps {
  strategy: VaultStrategy
}

export function VaultPoolAllocations({ strategy }: VaultPoolAllocationsProps) {
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

  const getProtocolColor = (protocol: string) => {
    switch (protocol) {
      case 'Vesu': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Ekubo': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const totalValue = strategy.pools.reduce((sum, pool) => sum + pool.tvl, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pool Allocations</CardTitle>
        <CardDescription>
          Current distribution of funds across different pools
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Pools</p>
            <p className="text-2xl font-bold text-gray-900">{strategy.pools.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Value</p>
            <p className="text-2xl font-bold text-gray-900">{totalValue.toFixed(2)} BTC</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Weighted APY</p>
            <p className="text-2xl font-bold text-green-600">{strategy.apy}%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Last Rebalance</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(strategy.lastRebalanced).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Pool Details */}
        <div className="space-y-4">
          {strategy.pools.map((pool, index) => (
            <div key={pool.poolId} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{pool.poolName}</h4>
                    <Badge className={getProtocolColor(pool.protocol)}>
                      {pool.protocol}
                    </Badge>
                    <Badge className={getRiskColor(pool.risk)}>
                      {getRiskIcon(pool.risk)}
                      <span className="ml-1">{pool.risk}</span>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>APY: <span className="font-medium text-green-600">{pool.apy}%</span></span>
                    <span>TVL: <span className="font-medium">{pool.tvl.toFixed(2)} BTC</span></span>
                    <span>Allocation: <span className="font-medium">{pool.allocation}%</span></span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>

              {/* Allocation Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Allocation</span>
                  <span className="font-medium">{pool.allocation}%</span>
                </div>
                <Progress value={pool.allocation} className="h-2" />
              </div>

              {/* Tokens */}
              <div className="mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Tokens:</span>
                  <div className="flex gap-1">
                    {pool.tokens.map((token) => (
                      <Badge key={token} variant="outline" className="text-xs">
                        {token}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pool Address */}
              {pool.address && (
                <div className="mt-2">
                  <span className="text-xs text-gray-500">
                    Address: {pool.address}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Rebalancing Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Auto Rebalancing</h4>
              <p className="text-sm text-blue-700 mt-1">
                This vault automatically rebalances based on market conditions and APY changes. 
                Last rebalancing occurred on {new Date(strategy.lastRebalanced).toLocaleDateString()}.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
