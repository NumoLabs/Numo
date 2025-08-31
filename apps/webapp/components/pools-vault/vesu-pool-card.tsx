"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Shield, Zap, DollarSign } from "lucide-react"

interface PoolData {
  name: string
  description: string
  apy: number
  tvl: number
  participants: number
  riskLevel: string
  minDeposit: number
  maxDeposit: number
  token: string
  strategy: string
  rewards: string[]
}

interface VesuPoolCardProps {
  poolData: PoolData
}

export function VesuPoolCard({ poolData }: VesuPoolCardProps) {
  return (
    <Card className="bg-gradient-to-br from-white/90 via-yellow-50/30 to-orange-50/30 dark:from-gray-900/90 dark:via-yellow-950/20 dark:to-orange-950/20 backdrop-blur-xl border-2 border-gradient-to-r from-bitcoin-gold/40 via-bitcoin-orange/40 to-yellow-400/40 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-bitcoin-gold/5 to-bitcoin-orange/5 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-bitcoin-orange">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 via-bitcoin-gold to-bitcoin-orange rounded-lg flex items-center justify-center shadow-lg">
                <Zap className="h-4 w-4 text-white" />
              </div>
              {poolData.name}
            </CardTitle>
            <CardDescription className="mt-2 text-muted-foreground">
              {poolData.description}
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-gradient-to-r from-yellow-400/20 to-bitcoin-gold/20 text-yellow-700 dark:text-yellow-300 border-2 border-gradient-to-r from-yellow-400/40 to-bitcoin-gold/40 shadow-md">
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 bg-gradient-to-br from-yellow-100/50 via-bitcoin-gold/30 to-yellow-200/50 dark:from-yellow-900/30 dark:via-bitcoin-gold/20 dark:to-yellow-800/20 rounded-lg border-2 border-gradient-to-r from-yellow-300/40 to-bitcoin-gold/40 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <span className="font-medium text-sm">APY</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {poolData.apy}%
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Current yield rate
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-100/50 via-bitcoin-orange/30 to-red-100/50 dark:from-orange-900/30 dark:via-bitcoin-orange/20 dark:to-red-800/20 rounded-lg border-2 border-gradient-to-r from-orange-300/40 to-bitcoin-orange/40 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <span className="font-medium text-sm">TVL</span>
            </div>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              ${(poolData.tvl / 1000000).toFixed(1)}M
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Total value locked
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-100/50 via-pink-100/30 to-purple-200/50 dark:from-purple-900/30 dark:via-pink-900/20 dark:to-purple-800/20 rounded-lg border-2 border-gradient-to-r from-purple-300/40 to-pink-300/40 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="font-medium text-sm">Participants</span>
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {poolData.participants.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Active users
            </p>
          </div>
        </div>

        {/* Pool Details */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-bitcoin-orange">Pool Details</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Strategy</span>
                <span className="font-medium">{poolData.strategy}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Token</span>
                <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400/20 to-bitcoin-gold/20 text-yellow-700 dark:text-yellow-300 border-2 border-gradient-to-r from-yellow-400/40 to-bitcoin-gold/40">{poolData.token}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Risk Level</span>
                <Badge variant="outline" className="bg-gradient-to-r from-orange-400/20 to-bitcoin-orange/20 text-orange-700 dark:text-orange-300 border-2 border-gradient-to-r from-orange-400/40 to-bitcoin-orange/40">
                  {poolData.riskLevel}
                </Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Min Deposit</span>
                <span className="font-medium">${poolData.minDeposit} {poolData.token}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Max Deposit</span>
                <span className="font-medium">${poolData.maxDeposit.toLocaleString()} {poolData.token}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Security</span>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm font-medium">Audited</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rewards */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-bitcoin-orange">Rewards & Benefits</h4>
          <div className="grid gap-2 md:grid-cols-3">
            {poolData.rewards.map((reward, index) => (
              <div
                key={index}
                className="p-3 bg-gradient-to-br from-yellow-100/50 via-bitcoin-gold/30 to-orange-100/50 dark:from-yellow-900/30 dark:via-bitcoin-gold/20 dark:to-orange-800/20 rounded-lg border-2 border-gradient-to-r from-yellow-300/40 to-bitcoin-gold/40 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-bitcoin-gold rounded-full shadow-sm" />
                  <span className="text-sm font-medium">{reward}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="p-4 bg-gradient-to-br from-gray-50 via-yellow-50/30 to-orange-50/30 dark:from-gray-800/50 dark:via-yellow-900/20 dark:to-orange-900/20 rounded-lg border-2 border-gradient-to-r from-gray-200/40 via-yellow-200/40 to-orange-200/40 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm text-bitcoin-orange">Performance History</h4>
            <Badge variant="outline" className="bg-gradient-to-r from-yellow-400/20 to-bitcoin-gold/20 text-yellow-700 dark:text-yellow-300 border-2 border-gradient-to-r from-yellow-400/40 to-bitcoin-gold/40">30 Days</Badge>
          </div>
          <div className="h-32 bg-gradient-to-br from-yellow-100/50 via-bitcoin-gold/30 to-orange-100/50 dark:from-yellow-900/20 dark:via-bitcoin-gold/10 dark:to-orange-900/10 rounded-lg flex items-center justify-center border border-gradient-to-r from-yellow-200/40 to-bitcoin-gold/40">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chart placeholder - APY trend over time
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 