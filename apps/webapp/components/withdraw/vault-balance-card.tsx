import { Bitcoin, TrendingUp, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { VaultBalance } from "@/lib/withdraw-data"

interface VaultBalanceCardProps {
  balance: VaultBalance
}

export function VaultBalanceCard({ balance }: VaultBalanceCardProps) {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
            <Bitcoin className="h-5 w-5 text-white" />
          </div>
          Balance de la Vault
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Balance */}
        <div className="text-center p-4 bg-white/50 dark:bg-gray-900/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Balance Total Disponible</p>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{balance.totalBalance}</p>
          <p className="text-lg text-blue-700 dark:text-blue-300">{balance.totalBalanceUSD}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Accumulated Yield */}
          <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <p className="text-xs text-green-700 dark:text-green-300">Rendimiento</p>
            </div>
            <p className="text-lg font-bold text-green-900 dark:text-green-100">{balance.accumulatedYield}</p>
            <p className="text-sm text-green-700 dark:text-green-300">{balance.accumulatedYieldUSD}</p>
          </div>

          {/* Time in Vault */}
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="h-4 w-4 text-purple-600" />
              <p className="text-xs text-purple-700 dark:text-purple-300">Tiempo</p>
            </div>
            <p className="text-lg font-bold text-purple-900 dark:text-purple-100">{balance.timeInVault}</p>
            <p className="text-sm text-purple-700 dark:text-purple-300">en la vault</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Depósito inicial</span>
            <span className="font-medium">{balance.initialDeposit}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">APY actual</span>
            <span className="font-medium text-green-600">{balance.currentAPY}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Ganancia total</span>
            <span className="font-medium text-green-600">{balance.accumulatedYield}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
