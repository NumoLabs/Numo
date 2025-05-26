import { Bitcoin, Download, Upload, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { HistoryStats } from "@/lib/history-data"

interface StatsOverviewProps {
  stats: HistoryStats
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300">Total Deposited</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.totalDeposited.amount}</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">{stats.totalDeposited.count} deposits</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <Upload className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 border-red-200 dark:border-red-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-300">Total Withdrawn</p>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.totalWithdrawn.amount}</p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">{stats.totalWithdrawn.count} withdrawal</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <Download className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Rebalances</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalRebalances.count}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Last {stats.totalRebalances.lastRebalance}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Bitcoin className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Returns</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.totalYield.amount}</p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                {stats.totalYield.percentage} since start
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
