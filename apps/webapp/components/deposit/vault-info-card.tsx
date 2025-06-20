import { TrendingUp, Shield, Target, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import type { VaultInfo } from "@/lib/deposit-data"

interface VaultInfoCardProps {
  vaultInfo: VaultInfo
}

export function VaultInfoCard({ vaultInfo }: VaultInfoCardProps) {
  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "low-medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "medium":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  const getPoolColor = (poolName: string) => {
    if (poolName.includes("Vesu")) return "bg-emerald-500"
    if (poolName.includes("Ekubo")) return "bg-amber-500"
    return "bg-gray-500"
  }

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
            <Target className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
            Vault Information
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <p className="text-xs text-gray-600 dark:text-gray-400">Current APY</p>
            </div>
            <p className="text-2xl font-bold text-green-600">{vaultInfo.currentAPY}</p>
          </div>

          <div className="text-center p-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Shield className="h-4 w-4 text-blue-600" />
              <p className="text-xs text-gray-600 dark:text-gray-400">Total TVL</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">{vaultInfo.totalTVL}</p>
          </div>
        </div>

        <Separator />

        {/* Strategy Information */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">Current Strategy</h4>
            <Badge className={getRiskColor(vaultInfo.riskLevel)}>{vaultInfo.riskLevel}</Badge>
          </div>

          <div className="space-y-3">
            {vaultInfo.strategyDistribution.map((strategy) => (
              <div key={strategy.name} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getPoolColor(strategy.name)} shadow-sm`} />
                    <span className="font-medium text-gray-900 dark:text-gray-100">{strategy.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {strategy.apy}
                    </Badge>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{strategy.allocation}%</span>
                </div>
                <Progress value={strategy.allocation} className="h-2" />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Additional Info */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Minimum Deposit</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{vaultInfo.minimumDeposit}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Management Fee</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">0.5% annual</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Rebalancing</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">Automatic</span>
          </div>
        </div>

        <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg border border-blue-200 dark:border-blue-700 shadow-sm">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">How it works</p>
              <p className="text-xs text-blue-800 dark:text-blue-200">
                Your deposit will be automatically distributed according to the current strategy. The vault
                automatically rebalances to maximize returns.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
