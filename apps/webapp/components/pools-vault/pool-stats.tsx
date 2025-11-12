"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, DollarSign, Users, Clock, ArrowUpRight } from 'lucide-react'

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
    <Card className="bg-gradient-to-br from-white/90 via-yellow-50/30 to-orange-50/30 dark:from-gray-900/90 dark:via-yellow-950/20 dark:to-orange-950/20 backdrop-blur-xl border-2 border-gradient-to-r from-bitcoin-gold/40 via-bitcoin-orange/40 to-yellow-400/40 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-bitcoin-gold/5 to-bitcoin-orange/5 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-bitcoin-orange">
          <TrendingUp className="h-5 w-5 text-bitcoin-gold" />
          Pool Statistics
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Detailed metrics and performance data for the Vesu pool
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Volume Metrics */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-bitcoin-orange">Volume Metrics</h4>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-gradient-to-br from-orange-100/50 via-bitcoin-orange/30 to-red-100/50 dark:from-orange-900/30 dark:via-bitcoin-orange/20 dark:to-red-800/20 rounded-lg border-2 border-gradient-to-r from-orange-300/40 to-bitcoin-orange/40 shadow-md hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Daily Volume</span>
                <span className="text-sm font-medium">Daily Volume</span>
              </div>
              <p className="text-xl font-bold text-bitcoin-orange">
                ${(stats.dailyVolume / 1000).toFixed(0)}K
              </p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3 text-yellow-500" />
                <span className="text-xs text-yellow-600 dark:text-yellow-400">
                  +{stats.apyChange}% from yesterday
                </span>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-100/50 via-pink-100/30 to-purple-200/50 dark:from-purple-900/30 dark:via-pink-900/20 dark:to-purple-800/20 rounded-lg border-2 border-gradient-to-r from-purple-300/40 to-pink-300/40 shadow-md hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Weekly Volume</span>
                <Badge variant="outline" className="bg-gradient-to-r from-purple-400/20 to-pink-400/20 text-purple-700 dark:text-purple-300 border-2 border-gradient-to-r from-purple-400/40 to-pink-400/40">
                  +{stats.tvlChange}%
                </Badge>
              </div>
              <p className="text-xl font-bold text-purple-600">
                ${(stats.weeklyVolume / 1000).toFixed(0)}K
              </p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3 text-yellow-500" />
                <span className="text-xs text-yellow-600 dark:text-yellow-400">
                  +{stats.tvlChange}% from last week
                </span>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-yellow-100/50 via-bitcoin-gold/30 to-yellow-200/50 dark:from-yellow-900/30 dark:via-bitcoin-gold/20 dark:to-yellow-800/20 rounded-lg border-2 border-gradient-to-r from-yellow-300/40 to-bitcoin-gold/40 shadow-md hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Monthly Volume</span>
                <Badge variant="outline" className="bg-gradient-to-r from-yellow-400/20 to-bitcoin-gold/20 text-yellow-700 dark:text-yellow-300 border-2 border-gradient-to-r from-yellow-400/40 to-bitcoin-gold/40">
                  +{stats.participantsChange}%
                </Badge>
              </div>
              <p className="text-xl font-bold text-yellow-600">
                ${(stats.monthlyVolume / 1000000).toFixed(1)}M
              </p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3 text-yellow-500" />
                <span className="text-xs text-yellow-600 dark:text-yellow-400">
                  +{stats.participantsChange}% from last month
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-bitcoin-orange">Performance Metrics</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-100/30 via-bitcoin-orange/20 to-orange-200/30 dark:from-orange-900/20 dark:via-bitcoin-orange/10 dark:to-orange-800/10 rounded-lg border border-orange-200/30 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm">Average Deposit</span>
                </div>
                <span className="font-medium">${stats.avgDeposit.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-100/30 via-bitcoin-gold/20 to-yellow-200/30 dark:from-yellow-900/20 dark:via-bitcoin-gold/10 dark:to-yellow-800/10 rounded-lg border border-yellow-200/30 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm">Total Rewards</span>
                </div>
                <span className="font-medium">${stats.totalRewards.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-100/30 via-pink-100/20 to-purple-200/30 dark:from-purple-900/20 dark:via-pink-900/10 dark:to-purple-800/10 rounded-lg border border-purple-200/30 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm">Active Strategies</span>
                </div>
                <span className="font-medium">{stats.activeStrategies}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-100/30 via-bitcoin-orange/20 to-orange-200/30 dark:from-orange-900/20 dark:via-bitcoin-orange/10 dark:to-orange-800/10 rounded-lg border border-orange-200/30 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm">Avg. Hold Time</span>
                </div>
                <span className="font-medium">45 days</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-100/30 via-bitcoin-gold/20 to-yellow-200/30 dark:from-yellow-900/20 dark:via-bitcoin-gold/10 dark:to-yellow-800/10 rounded-lg border border-yellow-200/30 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm">Success Rate</span>
                </div>
                <span className="font-medium">98.5%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-100/30 via-bitcoin-orange/20 to-orange-200/30 dark:from-orange-900/20 dark:via-bitcoin-orange/10 dark:to-orange-800/10 rounded-lg border border-orange-200/30 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm">Fee Revenue</span>
                </div>
                <span className="font-medium">${(stats.totalRewards * 0.1).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-bitcoin-orange">Recent Activity</h4>
          <div className="space-y-2">
            {[
              { user: "0x1234...5678", action: "Deposited", amount: "5,000 USDC", time: "2 min ago" },
              { user: "0x8765...4321", action: "Withdrew", amount: "2,500 USDC", time: "15 min ago" },
              { user: "0x9876...5432", action: "Deposited", amount: "10,000 USDC", time: "1 hour ago" },
              { user: "0x5432...9876", action: "Claimed rewards", amount: "150 VESU", time: "3 hours ago" },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-100/30 via-bitcoin-gold/20 to-yellow-200/30 dark:from-yellow-900/20 dark:via-bitcoin-gold/10 dark:to-yellow-800/10 rounded-lg border border-yellow-200/30 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-bitcoin-gold rounded-full shadow-sm" />
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
          <h4 className="font-medium text-sm text-bitcoin-orange">Growth Indicators</h4>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-gradient-to-br from-yellow-100/50 via-bitcoin-gold/30 to-yellow-200/50 dark:from-yellow-900/30 dark:via-bitcoin-gold/20 dark:to-yellow-800/20 rounded-lg border-2 border-gradient-to-r from-yellow-300/40 to-bitcoin-gold/40 shadow-md hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpRight className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <span className="font-medium text-sm">APY Growth</span>
              </div>
              <p className="text-lg font-bold text-yellow-600">
                +{stats.apyChange}%
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                This week
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-100/50 via-bitcoin-orange/30 to-red-100/50 dark:from-orange-900/30 dark:via-bitcoin-orange/20 dark:to-red-800/20 rounded-lg border-2 border-gradient-to-r from-orange-300/40 to-bitcoin-orange/40 shadow-md hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpRight className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <span className="font-medium text-sm">TVL Growth</span>
              </div>
              <p className="text-lg font-bold text-orange-600">
                +{stats.tvlChange}%
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                This month
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-100/50 via-pink-100/30 to-purple-200/50 dark:from-purple-900/30 dark:via-pink-900/20 dark:to-purple-800/20 rounded-lg border-2 border-gradient-to-r from-purple-300/40 to-pink-300/40 shadow-md hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpRight className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="font-medium text-sm">User Growth</span>
              </div>
              <p className="text-lg font-bold text-purple-600">
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