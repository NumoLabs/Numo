import { Info, Clock, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import type { WithdrawEstimate, WithdrawOption } from "@/lib/withdraw-data"

interface WithdrawSummaryProps {
  estimate: WithdrawEstimate
  option: WithdrawOption
}

export function WithdrawSummary({ estimate, option }: WithdrawSummaryProps) {
  const getOptionBadge = () => {
    switch (option.id) {
      case "instant":
        return (
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-md">Instant</Badge>
        )
      case "standard":
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 shadow-md">Standard</Badge>
        )
      case "scheduled":
        return (
          <Badge className="bg-gradient-to-r from-purple-500 to-violet-500 text-white border-0 shadow-md">
            Scheduled
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <Card className="border-0 shadow-xl bg-white dark:bg-gray-800/50 backdrop-blur-sm sticky top-4">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500" />
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Withdrawal Summary</CardTitle>
          {getOptionBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Amount Summary */}
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Amount to withdraw</span>
            <div className="text-right">
              <span className="font-bold text-gray-900 dark:text-white">{estimate.amount}</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">{estimate.amountUSD}</p>
            </div>
          </div>

          <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
            <span className="text-sm font-medium text-red-600 dark:text-red-400">Fee ({option.fees})</span>
            <div className="text-right">
              <span className="font-bold text-red-600 dark:text-red-400">-{estimate.fees}</span>
              <p className="text-xs text-red-500 dark:text-red-400">-{estimate.feesUSD}</p>
            </div>
          </div>

          <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />

          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border border-green-200 dark:border-green-800">
            <span className="font-semibold text-green-700 dark:text-green-300">Net amount</span>
            <div className="text-right">
              <span className="text-xl font-bold text-green-600 dark:text-green-400">{estimate.netAmount}</span>
              <p className="text-sm text-green-600 dark:text-green-400">{estimate.netAmountUSD}</p>
            </div>
          </div>
        </div>

        <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />

        {/* Transaction Details */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Estimated time</span>
            </div>
            <span className="font-semibold text-blue-900 dark:text-blue-100">{estimate.estimatedTime}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Estimated gas</span>
            </div>
            <span className="font-semibold text-purple-900 dark:text-purple-100">{estimate.gasEstimate}</span>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Info className="h-4 w-4 text-white" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Important information</p>
              <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1 leading-relaxed">
                <li>• Funds will be automatically withdrawn from active strategies</li>
                <li>• Time may vary depending on network conditions</li>
                <li>• Fees include divestment costs and gas</li>
                <li>• You will receive a confirmation once the withdrawal is completed</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
