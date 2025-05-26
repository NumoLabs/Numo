import { Lock, Clock, TrendingUp, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import type { ActiveBond } from "@/lib/bonds-data"

interface ActiveBondsProps {
  bonds: ActiveBond[]
}

export function ActiveBonds({ bonds }: ActiveBondsProps) {
  if (bonds.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-blue-500" />
            Active Bonds
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No active bonds</p>
            <p className="text-sm text-muted-foreground">Lock your WBTC to start earning boosted rewards</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-blue-500" />
          Active Bonds
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {bonds.map((bond) => {
            const totalDays = bond.bondType === "7 Days" ? 7 : bond.bondType === "30 Days" ? 30 : 90
            const remainingDays = bond.timeRemaining.days
            const progress = ((totalDays - remainingDays) / totalDays) * 100

            return (
              <div
                key={bond.id}
                className="p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{bond.bondType} Bond</h3>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {bond.status === "active" ? "Active" : "Matured"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Locked on {bond.lockedAt}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{bond.amount}</p>
                    <p className="text-sm text-muted-foreground">{bond.amountUSD}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                    <Clock className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Time Left</p>
                    <p className="font-semibold">
                      {bond.timeRemaining.days}d {bond.timeRemaining.hours}h
                    </p>
                  </div>

                  <div className="text-center p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-green-500 mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">APY</p>
                    <p className="font-semibold text-green-600">{bond.currentAPY}</p>
                  </div>

                  <div className="text-center p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-purple-500 mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Est. Yield</p>
                    <p className="font-semibold">{bond.estimatedYield}</p>
                  </div>

                  <div className="text-center p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                    <Calendar className="h-4 w-4 text-orange-500 mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Unlock Date</p>
                    <p className="font-semibold">{bond.unlockDate}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Lock Progress</span>
                    <span>{progress.toFixed(1)}% complete</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {bond.status === "matured" && (
                  <div className="mt-4">
                    <Button className="w-full">Claim Rewards</Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
