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
    <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-cyan-200/50 dark:border-cyan-800/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              {poolData.name}
            </CardTitle>
            <CardDescription className="mt-2">
              {poolData.description}
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-green-100 dark:bg-green-900/20">
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-lg border border-green-200/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="font-medium text-sm">APY</span>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {poolData.apy}%
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Current yield rate
            </p>
          </div>
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 rounded-lg border border-blue-200/50">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-blue-500" />
              <span className="font-medium text-sm">TVL</span>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${(poolData.tvl / 1000000).toFixed(1)}M
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Total value locked
            </p>
          </div>
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 rounded-lg border border-purple-200/50">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-purple-500" />
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
          <h4 className="font-medium text-sm">Pool Details</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Strategy</span>
                <span className="font-medium">{poolData.strategy}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Token</span>
                <Badge variant="secondary">{poolData.token}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Risk Level</span>
                <Badge variant="outline" className="bg-orange-100 dark:bg-orange-900/20">
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
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Audited</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rewards */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Rewards & Benefits</h4>
          <div className="grid gap-2 md:grid-cols-3">
            {poolData.rewards.map((reward, index) => (
              <div
                key={index}
                className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/50 dark:to-orange-950/50 rounded-lg border border-yellow-200/50"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span className="text-sm font-medium">{reward}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-lg border border-gray-200/50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm">Performance History</h4>
            <Badge variant="outline">30 Days</Badge>
          </div>
          <div className="h-32 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
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