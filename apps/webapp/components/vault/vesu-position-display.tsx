"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, Shield, AlertTriangle } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useVesuTransactions } from "@/hooks/use-vesu-transactions"
import type { VesuPool } from "@/types/VesuPools"

interface VesuPositionDisplayProps {
  pool: VesuPool
  userAddress: string
  onRefresh?: () => void
}

export function VesuPositionDisplay({ pool, userAddress, onRefresh }: VesuPositionDisplayProps) {
  const [position, setPosition] = useState<{
    healthFactor: number
    collateral: string
    debt: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { getPosition, isConnected } = useVesuTransactions()

  const loadPosition = async () => {
    if (!isConnected) return

    setIsLoading(true)
    setError(null)
    
    try {
      const pos = await getPosition(pool, userAddress)
      setPosition(pos)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load position')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPosition()
  }, [pool, userAddress, isConnected])

  const getHealthFactorColor = (hf: number) => {
    if (hf >= 15000) return 'text-green-600' // > 150%
    if (hf >= 10000) return 'text-yellow-600' // > 100%
    return 'text-red-600' // < 100%
  }

  const getHealthFactorIcon = (hf: number) => {
    if (hf >= 15000) return <Shield className="h-4 w-4 text-green-600" />
    if (hf >= 10000) return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    return <TrendingDown className="h-4 w-4 text-red-600" />
  }

  const getHealthFactorStatus = (hf: number) => {
    if (hf >= 15000) return 'Healthy'
    if (hf >= 10000) return 'Warning'
    return 'Critical'
  }

  const getHealthFactorBadgeColor = (hf: number) => {
    if (hf >= 15000) return 'bg-green-100 text-green-800 border-green-200'
    if (hf >= 10000) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Vesu Position
          </CardTitle>
          <CardDescription>
            Connect your wallet to view your position
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">Wallet not connected</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Vesu Position
          </CardTitle>
          <CardDescription>
            Loading your position in {pool.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Vesu Position
          </CardTitle>
          <CardDescription>
            Error loading position
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadPosition} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!position) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Vesu Position
          </CardTitle>
          <CardDescription>
            No position found in {pool.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You don't have a position in this pool</p>
            <p className="text-sm text-gray-400">
              Deposit funds to start earning yield
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Vesu Position
            </CardTitle>
            <CardDescription>
              Your position in {pool.name}
            </CardDescription>
          </div>
          <Button onClick={loadPosition} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Health Factor */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Health Factor</span>
              {getHealthFactorIcon(position.healthFactor)}
            </div>
            <Badge className={getHealthFactorBadgeColor(position.healthFactor)}>
              {getHealthFactorStatus(position.healthFactor)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${getHealthFactorColor(position.healthFactor)}`}>
              {(position.healthFactor / 100).toFixed(2)}%
            </span>
            <span className="text-sm text-gray-600">
              ({(position.healthFactor / 10000).toFixed(2)}x)
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {position.healthFactor >= 15000 
              ? "Your position is healthy and safe from liquidation"
              : position.healthFactor >= 10000
              ? "Your position is at risk. Consider adding collateral or repaying debt"
              : "Your position is at high risk of liquidation. Take immediate action"
            }
          </p>
        </div>

        {/* Collateral and Debt */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Collateral</p>
            <p className="text-lg font-semibold text-green-600">
              {parseFloat(position.collateral).toFixed(6)}
            </p>
            <p className="text-xs text-gray-500">
              {pool.assets[0]?.symbol || 'WBTC'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Debt</p>
            <p className="text-lg font-semibold text-red-600">
              {parseFloat(position.debt).toFixed(6)}
            </p>
            <p className="text-xs text-gray-500">
              {pool.assets[0]?.symbol || 'WBTC'}
            </p>
          </div>
        </div>

        {/* Pool Info */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Pool APY</span>
            <span className="font-medium text-green-600">
              {pool.assets[0]?.apy.toFixed(2) || '0.00'}%
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-600">Utilization</span>
            <span className="font-medium">
              {pool.assets[0]?.currentUtilization.toFixed(1) || '0.0'}%
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button variant="outline" size="sm" className="flex-1">
            Add Collateral
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Repay Debt
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
