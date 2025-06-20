import { Bitcoin, TrendingUp, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { VaultBalance } from "@/lib/withdraw-data"

interface VaultBalanceCardProps {
  balance: VaultBalance
}

export function VaultBalanceCard({ balance }: VaultBalanceCardProps) {
  return (
    <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500" />
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <Bitcoin className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Vault Balance</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Your available funds</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Balance */}
        <div className="text-center p-6 bg-white/70 dark:bg-gray-800/50 rounded-2xl border border-white/50 dark:border-gray-700/50 backdrop-blur-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Available Balance</p>
          <p className="text-4xl font-bold text-blue-900 dark:text-blue-100 mb-1">{balance.totalBalance}</p>
          <p className="text-xl text-blue-700 dark:text-blue-300">{balance.totalBalanceUSD}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Accumulated Yield */}
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border border-green-200/50 dark:border-green-800/50 shadow-sm">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <p className="text-xs font-medium text-green-700 dark:text-green-300">Returns</p>
            </div>
            <p className="text-lg font-bold text-green-900 dark:text-green-100">{balance.accumulatedYield}</p>
            <p className="text-sm text-green-700 dark:text-green-300">{balance.accumulatedYieldUSD}</p>
          </div>

          {/* Time in Vault */}
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 rounded-xl border border-purple-200/50 dark:border-purple-800/50 shadow-sm">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <p className="text-xs font-medium text-purple-700 dark:text-purple-300">Time</p>
            </div>
            <p className="text-lg font-bold text-purple-900 dark:text-purple-100">{balance.timeInVault}</p>
            <p className="text-sm text-purple-700 dark:text-purple-300">in vault</p>
          </div>
        </div>

        <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-lg">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Initial deposit</span>
            <span className="font-semibold text-gray-900 dark:text-white">{balance.initialDeposit}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-lg">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Current APY</span>
            <span className="font-semibold text-green-600 dark:text-green-400">{balance.currentAPY}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-lg">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total gain</span>
            <span className="font-semibold text-green-600 dark:text-green-400">{balance.accumulatedYield}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
