import { TrendingUp, Clock, DollarSign, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import type { DepositEstimate, DepositOption } from "@/lib/deposit-data"

interface DepositSummaryProps {
  estimate: DepositEstimate
  option: DepositOption
  selectedToken: "btc" | "wbtc"
}

export function DepositSummary({ estimate, option, selectedToken }: DepositSummaryProps) {
  const getOptionBadge = () => {
    switch (option.id) {
      case "priority":
        return <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md">Priority</Badge>
      case "standard":
        return <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md">Standard</Badge>
      case "scheduled":
        return <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md">Scheduled</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getTokenBadge = () => {
    return selectedToken === "btc" ? (
      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md">BTC</Badge>
    ) : (
      <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md">WBTC</Badge>
    )
  }

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Deposit Summary</CardTitle>
          <div className="flex gap-2">
            {getTokenBadge()}
            {getOptionBadge()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Amount Summary */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Amount to deposit</span>
            <div className="text-right">
              <span className="font-medium text-gray-900 dark:text-gray-100">{estimate.amount}</span>
              <p className="text-xs text-gray-600 dark:text-gray-400">{estimate.amountUSD}</p>
            </div>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Deposit fee</span>
            <div className="text-right">
              <span className="font-medium text-green-600">{estimate.fees || "Free"}</span>
              <p className="text-xs text-gray-600 dark:text-gray-400">{estimate.feesUSD || "$0.00"}</p>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between">
            <span className="font-medium text-gray-900 dark:text-gray-100">Net amount in vault</span>
            <div className="text-right">
              <span className="text-lg font-bold text-green-600">{estimate.netAmount}</span>
              <p className="text-sm text-gray-600 dark:text-gray-400">{estimate.netAmountUSD}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Transaction Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Estimated time</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-gray-100">{estimate.estimatedTime}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Estimated gas</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-gray-100">{estimate.gasEstimate}</span>
          </div>
        </div>

        <Separator />

        {/* Projected Yields */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="font-medium text-gray-900 dark:text-gray-100">Projected Returns (5.8% APY)</span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded border border-green-200 dark:border-green-800 shadow-sm">
              <p className="text-xs text-gray-600 dark:text-gray-400">Daily</p>
              <p className="text-sm font-semibold text-green-600">{estimate.projectedYield.daily}</p>
            </div>
            <div className="p-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded border border-green-200 dark:border-green-800 shadow-sm">
              <p className="text-xs text-gray-600 dark:text-gray-400">Monthly</p>
              <p className="text-sm font-semibold text-green-600">{estimate.projectedYield.monthly}</p>
            </div>
            <div className="p-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded border border-green-200 dark:border-green-800 shadow-sm">
              <p className="text-xs text-gray-600 dark:text-gray-400">Annual</p>
              <p className="text-sm font-semibold text-green-600">{estimate.projectedYield.yearly}</p>
            </div>
          </div>
        </div>

        <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800 shadow-sm">
          <div className="flex items-start gap-2">
            <Target className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">After deposit</p>
              <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Your funds will be automatically distributed according to the current strategy</li>
                <li>• You will start generating returns immediately</li>
                <li>• You can withdraw at any time without penalties</li>
                <li>• The vault will automatically rebalance to optimize APY</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
