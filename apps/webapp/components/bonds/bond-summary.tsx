import { Lock, Calendar, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import type { BondEstimate, BondOption } from "@/lib/bonds-data"

interface BondSummaryProps {
  estimate: BondEstimate
  option: BondOption
}

export function BondSummary({ estimate, option }: BondSummaryProps) {
  const getOptionBadge = () => {
    const colorMap = {
      blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      green: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      purple: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    }

    return <Badge className={colorMap[option.color as keyof typeof colorMap]}>{option.duration} Lock</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Bond Summary</CardTitle>
          {getOptionBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Lock Details */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Amount to lock</span>
            <div className="text-right">
              <span className="font-medium">{estimate.amount}</span>
              <p className="text-xs text-muted-foreground">{estimate.amountUSD}</p>
            </div>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Lock duration</span>
            <span className="font-medium">{estimate.duration}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Base APY</span>
            <span className="font-medium">{estimate.baseAPY}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Boost</span>
            <span className="font-medium text-green-600">{estimate.boost}</span>
          </div>

          <Separator />

          <div className="flex justify-between">
            <span className="font-medium">Boosted APY</span>
            <span className="text-lg font-bold text-green-600">{estimate.boostedAPY}</span>
          </div>
        </div>

        <Separator />

        {/* Yield Projection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="font-medium">Projected Returns</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Estimated yield</span>
            <div className="text-right">
              <span className="font-medium text-green-600">{estimate.estimatedYield}</span>
              <p className="text-xs text-muted-foreground">{estimate.estimatedYieldUSD}</p>
            </div>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Total at maturity</span>
            <div className="text-right">
              <span className="text-lg font-bold">{estimate.totalAtMaturity}</span>
              <p className="text-sm text-muted-foreground">{estimate.totalAtMaturityUSD}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Timeline */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Unlock date</span>
            </div>
            <span className="font-medium">{estimate.unlockDate}</span>
          </div>
        </div>

        <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <Lock className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Lock Terms</p>
              <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Funds are locked for the entire duration</li>
                <li>• No early withdrawal available</li>
                <li>• Rewards are automatically compounded</li>
                <li>• Unlock is automatic at maturity</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
