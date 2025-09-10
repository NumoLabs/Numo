"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface VaultPerformanceChartProps {
  vaultId: string
}

interface PerformanceData {
  date: string
  value: number
  apy: number
  pnl: number
}

export function VaultPerformanceChart({ vaultId }: VaultPerformanceChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'1d' | '7d' | '30d' | '90d'>('30d')
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPerformanceData = async () => {
      setIsLoading(true)
      try {
        // Mock data - in real implementation, fetch from API
        const mockData: PerformanceData[] = generateMockPerformanceData(selectedPeriod)
        setPerformanceData(mockData)
      } catch (error) {
        console.error('Failed to load performance data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPerformanceData()
  }, [vaultId, selectedPeriod])

  const generateMockPerformanceData = (period: string): PerformanceData[] => {
    const data: PerformanceData[] = []
    const now = new Date()
    const days = period === '1d' ? 1 : period === '7d' ? 7 : period === '30d' ? 30 : 90
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      
      // Generate realistic performance data with some volatility
      const baseValue = 10000
      const volatility = 0.02
      const trend = 0.001 // Slight upward trend
      const randomFactor = (Math.random() - 0.5) * volatility
      const value = baseValue * (1 + trend * (days - i) + randomFactor)
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(value),
        apy: 5.2 + (Math.random() - 0.5) * 2,
        pnl: value - baseValue
      })
    }
    
    return data
  }

  const getPerformanceChange = () => {
    if (performanceData.length < 2) return { change: 0, isPositive: true }
    
    const first = performanceData[0].value
    const last = performanceData[performanceData.length - 1].value
    const change = ((last - first) / first) * 100
    
    return {
      change: Math.abs(change),
      isPositive: change >= 0
    }
  }

  const getMaxValue = () => {
    return Math.max(...performanceData.map(d => d.value))
  }

  const getMinValue = () => {
    return Math.min(...performanceData.map(d => d.value))
  }

  const performanceChange = getPerformanceChange()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Chart</CardTitle>
          <CardDescription>Loading performance data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
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
              <BarChart3 className="h-5 w-5" />
              Performance Chart
            </CardTitle>
            <CardDescription>
              Vault performance over time
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={performanceChange.isPositive ? "default" : "destructive"}>
              {performanceChange.isPositive ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {performanceChange.change.toFixed(2)}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Period Selector */}
        <div className="flex gap-2">
          {(['1d', '7d', '30d', '90d'] as const).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period.toUpperCase()}
            </Button>
          ))}
        </div>

        {/* Chart */}
        <div className="h-64 w-full">
          <div className="h-full flex items-end justify-between gap-1">
            {performanceData.map((data, index) => {
              const maxValue = getMaxValue()
              const minValue = getMinValue()
              const range = maxValue - minValue
              const height = range > 0 ? ((data.value - minValue) / range) * 100 : 50
              
              return (
                <div
                  key={data.date}
                  className="flex-1 bg-blue-500 rounded-t opacity-80 hover:opacity-100 transition-opacity"
                  style={{ height: `${height}%` }}
                  title={`${data.date}: $${data.value.toLocaleString()}`}
                />
              )
            })}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-gray-600">Current Value</p>
            <p className="text-lg font-semibold">
              ${performanceData[performanceData.length - 1]?.value.toLocaleString() || '0'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Current APY</p>
            <p className="text-lg font-semibold text-green-600">
              {performanceData[performanceData.length - 1]?.apy.toFixed(2) || '0'}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total P&L</p>
            <p className={`text-lg font-semibold ${
              performanceChange.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {performanceChange.isPositive ? '+' : ''}${performanceChange.change.toFixed(2)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Max Drawdown</p>
            <p className="text-lg font-semibold text-red-600">
              -{Math.max(...performanceData.map(d => Math.abs(d.pnl))).toFixed(2)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
