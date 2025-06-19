import { PieChart, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { getStrategyDistribution } from "@/lib/dashboard-data"

export function StrategyDistribution() {
  const strategies = getStrategyDistribution()

  return (
    <Card className="lg:col-span-3 border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-purple-500" />
          Strategy Distribution
        </CardTitle>
        <CardDescription>Current allocation of your funds</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {strategies.map((strategy, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div className={`h-4 w-4 rounded-full bg-gradient-to-r ${strategy.color}`} />
                  <span className="font-medium">{strategy.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">{strategy.percentage}%</span>
                  <p className="text-xs text-muted-foreground">{strategy.amount}</p>
                </div>
              </div>
              <Progress value={strategy.percentage} className="h-3" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>APY: {strategy.apy}</span>
                <span>TVL: {strategy.tvl}</span>
              </div>
            </div>
          ))}

          <Separator />

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Current Rebalancing Reason</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  The Ekubo strategy is generating higher returns due to increased trading volume in the BTC/USDC pair.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
