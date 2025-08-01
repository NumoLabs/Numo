"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, Users, Clock, ArrowUpRight } from "lucide-react"

export function PoolStats() {
  const stats = {
    tvl: 1250000,
    apy: 18.5,
    participants: 1250,
    volume24h: 450000,
    apyChange: 2.3,
    tvlChange: 5.7,
    dailyVolume: 125000,
    weeklyVolume: 875000,
    monthlyVolume: 3500000,
    avgDeposit: 2000,
    totalRewards: 125000,
    activeStrategies: 3,
    participantsChange: 15,
  }

  return (
    <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-cyan-200/50 dark:border-cyan-800/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          Pool Statistics
        </CardTitle>
        <CardDescription>
          Detailed metrics and performance data for the Vesu pool
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Volume Metrics */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Volume Metrics</h4>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 rounded-lg border border-blue-200/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Daily Volume</span>
                <span className="text-sm font-medium">Daily Volume</span>
              </div>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                ${(stats.dailyVolume / 1000).toFixed(0)}K
              </p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600 dark:text-green-400">
                  +{stats.apyChange}% from yesterday
                </span>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 rounded-lg border border-purple-200/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Weekly Volume</span>
                <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900/20">
                  +{stats.tvlChange}%
                </Badge>
              </div>
              <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                ${(stats.weeklyVolume / 1000).toFixed(0)}K
              </p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600 dark:text-green-400">
                  +{stats.tvlChange}% from last week
                </span>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-lg border border-green-200/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Monthly Volume</span>
                <Badge variant="outline" className="bg-green-100 dark:bg-green-900/20">
                  +{stats.participantsChange}%
                </Badge>
              </div>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                ${(stats.monthlyVolume / 1000000).toFixed(1)}M
              </p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600 dark:text-green-400">
                  +{stats.participantsChange}% from last month
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Performance Metrics</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Average Deposit</span>
                </div>
                <span className="font-medium">${stats.avgDeposit.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Total Rewards</span>
                </div>
                <span className="font-medium">${stats.totalRewards.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Active Strategies</span>
                </div>
                <span className="font-medium">{stats.activeStrategies}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">Avg. Hold Time</span>
                </div>
                <span className="font-medium">45 days</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Success Rate</span>
                </div>
                <span className="font-medium">98.5%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Fee Revenue</span>
                </div>
                <span className="font-medium">${(stats.totalRewards * 0.1).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Recent Activity</h4>
          <div className="space-y-2">
            {[
              { user: "0x1234...5678", action: "Deposited", amount: "5,000 USDC", time: "2 min ago" },
              { user: "0x8765...4321", action: "Withdrew", amount: "2,500 USDC", time: "15 min ago" },
              { user: "0x9876...5432", action: "Deposited", amount: "10,000 USDC", time: "1 hour ago" },
              { user: "0x5432...9876", action: "Claimed rewards", amount: "150 VESU", time: "3 hours ago" },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div>
                    <p className="text-sm font-medium">{activity.user}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {activity.action} {activity.amount}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Indicators */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Growth Indicators</h4>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-lg border border-green-200/50">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpRight className="h-4 w-4 text-green-500" />
                <span className="font-medium text-sm">APY Growth</span>
              </div>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                +{stats.apyChange}%
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                This week
              </p>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 rounded-lg border border-blue-200/50">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpRight className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-sm">TVL Growth</span>
              </div>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                +{stats.tvlChange}%
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                This month
              </p>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 rounded-lg border border-purple-200/50">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpRight className="h-4 w-4 text-purple-500" />
                <span className="font-medium text-sm">User Growth</span>
              </div>
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                +{stats.participantsChange}%
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                This week
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 