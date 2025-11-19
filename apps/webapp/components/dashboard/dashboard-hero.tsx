"use client"

import {
  Wallet,
  Bitcoin,
  TrendingUp,
  Star,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState, useMemo } from "react"
import { useWBTCBalance } from "@/hooks/use-wbtc-balance"
import { useVaultForecastStats } from "@/hooks/use-vault-forecast-stats"

export function DashboardHero() {
  const [showBalance, setShowBalance] = useState(true)
  const { balance, balanceUSD, isLoading: wbtcLoading } = useWBTCBalance()
  const { apy, userPosition, isLoading: vaultStatsLoading } = useVaultForecastStats()
  
  // Combined loading state - show loading if either is loading
  const isLoading = wbtcLoading || vaultStatsLoading

  // Format balance display
  const formatBalance = (value: number): string => {
    if (value === 0) return "0.00000000"
    if (value < 0.00000001) return value.toFixed(8)
    if (value < 0.01) return value.toFixed(8).replace(/\.?0+$/, '')
    return value.toFixed(8).replace(/\.?0+$/, '')
  }

  const formatUSD = (value: number): string => {
    if (value === 0) return "$0.00"
    if (value < 1) return `$${value.toFixed(4)}`
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const displayBalance = showBalance ? formatBalance(balance) : "••••••••"
  const displayUSD = showBalance ? formatUSD(balanceUSD) : "≈ $••••••••"

  const performance = useMemo(() => {
    if (!userPosition || !apy || userPosition.assets === BigInt(0)) {
      return null
    }

    // Get current balance in vault
    const currentBalance = Number(userPosition.assets) / 1e8

    const estimatedDaysActive = 30 // Estimate 30 days of activity
    const dailyAPY = apy / 365
    const estimatedGainPercent = dailyAPY * estimatedDaysActive

    const estimatedInitial = currentBalance / (1 + estimatedGainPercent / 100)
    const estimatedGainBTC = currentBalance - estimatedInitial
    const estimatedGainPercentActual = (estimatedGainBTC / estimatedInitial) * 100

    return {
      gainBTC: estimatedGainBTC,
      gainPercent: estimatedGainPercentActual,
    }
  }, [userPosition, apy])

  // Format performance display
  const formatPerformance = (value: number): string => {
    if (value === 0) return "0.00000000"
    const sign = value >= 0 ? "+" : ""
    if (Math.abs(value) < 0.00000001) return `${sign}0.00000000`
    if (Math.abs(value) < 0.01) return `${sign}${Math.abs(value).toFixed(8)}`
    return `${sign}${Math.abs(value).toFixed(8).replace(/\.?0+$/, '')}`
  }

  const formatPercent = (value: number): string => {
    if (value === 0) return "0.00%"
    const sign = value >= 0 ? "+" : ""
    return `${sign}${Math.abs(value).toFixed(2)}%`
  }

  const displayPerformanceBTC = performance
    ? (showBalance ? formatPerformance(performance.gainBTC) : "••••••••")
    : (showBalance ? "0.00000000" : "••••••••")
  const displayPerformancePercent = performance
    ? (showBalance ? formatPercent(performance.gainPercent) : "••••••")
    : (showBalance ? "0.00%" : "••••••")

  // Format APY display
  const displayAPY = apy
    ? (showBalance ? `${apy.toFixed(2)}%` : "•••••")
    : (showBalance ? "0.00%" : "•••••")

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#0f1114] p-8 md:p-12 text-white mb-8 shadow-2xl animate-border-gradient">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-full blur-3xl"></div>
      <div className="relative z-10">
        {/* Balance Toggle Button - Top Right Corner */}
        <div className="absolute -top-2 right-0 mb-4">
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="h-8 w-8 rounded-full bg-[#0f1114] hover:bg-gray-800 flex items-center justify-center transition-all duration-200 hover:scale-105 border-2 border-orange-500"
            title={showBalance ? "Hide balance" : "Show balance"}
          >
            {showBalance ? <Eye className="h-4 w-4 text-orange-500" /> : <EyeOff className="h-4 w-4 text-orange-500" />}
          </button>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-[#0f1114] border-2 border-orange-500 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Welcome back!</h1>
                <p className="text-gray-300">Your vault is automatically generating returns</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <Badge className="bg-[#0f1114] text-white border-2 border-orange-500 gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Active Vault
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0f1114] border-2 border-orange-500 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-300">Total Balance</p>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#0f1114] border-2 border-yellow-500 flex items-center justify-center">
                  <Bitcoin className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
            <p className="text-2xl font-bold">
              {isLoading ? '...' : `${displayBalance} wBTC`}
            </p>
            <p className="text-xs text-gray-400">
              {isLoading ? '...' : displayUSD}
            </p>
          </div>
          <div className="bg-[#0f1114] border-2 border-orange-500 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-300">Performance</p>
              <div className="h-8 w-8 rounded-full bg-[#0f1114] border-2 border-yellow-500 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold">
              {(isLoading || !performance) ? '...' : `${displayPerformanceBTC} wBTC`}
            </p>
            <p className="text-xs text-gray-400">
              {(isLoading || !performance) ? '...' : `${displayPerformancePercent} since start`}
            </p>
          </div>
          <div className="bg-[#0f1114] border-2 border-orange-500 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-300">Current APY</p>
              <div className="h-8 w-8 rounded-full bg-[#0f1114] border-2 border-yellow-500 flex items-center justify-center">
                <Star className="h-5 w-5 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold">
              {isLoading || !apy ? '...' : displayAPY}
            </p>
            <p className="text-xs text-gray-400">
              Average across all pools
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
