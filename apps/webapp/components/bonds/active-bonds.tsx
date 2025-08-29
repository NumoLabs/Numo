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
            <Lock className="h-5 w-5 text-bitcoin-orange" />
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
          <Lock className="h-5 w-5 text-bitcoin-orange" />
          Active Bonds
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {bonds.map((bond) => {
            const totalDays = bond.bondType === "7 Days" ? 7 : bond.bondType === "30 Days" ? 30 : 90
            const remainingDays = bond.timeRemaining.days
            const progress = ((totalDays - remainingDays) / totalDays) * 100
            const is30DayBond = bond.bondType === "30 Days"

            return (
              <div
                key={bond.id}
                className={`p-4 rounded-lg border ${
                  is30DayBond 
                    ? "bg-black border-yellow-400/30" 
                    : "bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold ${is30DayBond ? 'text-white' : ''}`}>{bond.bondType} Bond</h3>
                      <Badge className={
                        is30DayBond 
                          ? "bg-yellow-400/20 text-white border-yellow-400/30"
                          : "bg-bitcoin-orange/20 text-bitcoin-orange border-bitcoin-orange/30"
                      }>
                        {bond.status === "active" ? "Active" : "Matured"}
                      </Badge>
                    </div>
                    <p className={`text-sm ${is30DayBond ? 'text-gray-300' : 'text-muted-foreground'}`}>Locked on {bond.lockedAt}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${is30DayBond ? 'text-white' : ''}`}>{bond.amount}</p>
                    <p className={`text-sm ${is30DayBond ? 'text-gray-300' : 'text-muted-foreground'}`}>{bond.amountUSD}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className={`text-center p-3 ${is30DayBond ? 'bg-yellow-400/10' : 'bg-white/50 dark:bg-gray-900/50'} rounded-lg`}>
                    <Clock className={`h-4 w-4 mx-auto mb-1 ${is30DayBond ? 'text-yellow-400' : 'text-bitcoin-orange'}`} />
                    <p className={`text-xs ${is30DayBond ? 'text-gray-300' : 'text-muted-foreground'}`}>Time Left</p>
                    <p className={`font-semibold ${is30DayBond ? 'text-white' : ''}`}>
                      {bond.timeRemaining.days}d {bond.timeRemaining.hours}h
                    </p>
                  </div>

                  <div className={`text-center p-3 ${is30DayBond ? 'bg-yellow-400/10' : 'bg-white/50 dark:bg-gray-900/50'} rounded-lg`}>
                    <TrendingUp className={`h-4 w-4 mx-auto mb-1 ${is30DayBond ? 'text-yellow-400' : 'text-bitcoin-gold'}`} />
                    <p className={`text-xs ${is30DayBond ? 'text-gray-300' : 'text-muted-foreground'}`}>APY</p>
                    <p className={`font-semibold ${is30DayBond ? 'text-yellow-400' : 'text-bitcoin-gold'}`}>{bond.currentAPY}</p>
                  </div>

                  <div className={`text-center p-3 ${is30DayBond ? 'bg-yellow-400/10' : 'bg-white/50 dark:bg-gray-900/50'} rounded-lg`}>
                    <TrendingUp className={`h-4 w-4 mx-auto mb-1 ${is30DayBond ? 'text-yellow-400' : 'text-orange-500'}`} />
                    <p className={`text-xs ${is30DayBond ? 'text-gray-300' : 'text-muted-foreground'}`}>Est. Yield</p>
                    <p className={`font-semibold ${is30DayBond ? 'text-white' : ''}`}>{bond.estimatedYield}</p>
                  </div>

                  <div className={`text-center p-3 ${is30DayBond ? 'bg-yellow-400/10' : 'bg-white/50 dark:bg-gray-900/50'} rounded-lg`}>
                    <Calendar className={`h-4 w-4 mx-auto mb-1 ${is30DayBond ? 'text-yellow-400' : 'text-bitcoin-orange'}`} />
                    <p className={`text-xs ${is30DayBond ? 'text-gray-300' : 'text-muted-foreground'}`}>Unlock Date</p>
                    <p className={`font-semibold ${is30DayBond ? 'text-white' : ''}`}>{bond.unlockDate}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={is30DayBond ? 'text-gray-300' : ''}>Lock Progress</span>
                    <span className={is30DayBond ? 'text-gray-300' : ''}>{progress.toFixed(1)}% complete</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {bond.status === "matured" && (
                  <div className="mt-4">
                    <Button className={`w-full ${is30DayBond ? 'bg-yellow-400 hover:bg-yellow-500 text-black' : 'bg-bitcoin-orange hover:bg-orange-600'}`}>
                      Claim Rewards
                    </Button>
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
