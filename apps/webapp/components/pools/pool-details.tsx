import { TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Pool } from "@/lib/pools-data"

interface PoolDetailsProps {
  pool: Pool
}

export function PoolDetails({ pool }: PoolDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pool Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{pool.details}</p>
        <Separator />
        {pool.benefits && (
          <>
            <div>
              <h4 className="font-medium mb-2">Benefits</h4>
              <ul className="list-disc pl-5 space-y-1">
                {pool.benefits.map((benefit, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <li key={index} className="text-sm">
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            <Separator />
          </>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Protocol</p>
            <p className="font-medium">{pool.protocol}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Tokens</p>
            <p className="font-medium">{pool.tokens.join(" / ")}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Type</p>
            <p className="font-medium">AMM Liquidity Pool</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function PoolPerformance({ pool }: PoolDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Current APY</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-2xl font-bold">{pool.apy}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">+0.2% in the last 7 days</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">TVL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pool.tvl}</div>
          <p className="text-xs text-muted-foreground mt-1">+5.3% in the last 30 days</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Volume (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$342K</div>
          <p className="text-xs text-muted-foreground mt-1">-2.1% vs previous day</p>
        </CardContent>
      </Card>
    </div>
  )
}

export function PoolStatistics({ pool }: PoolDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">APY</span>
            <span className="font-medium">{pool.apy}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Total Value</span>
            <span className="font-medium">{pool.tvl}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Volume (24h)</span>
            <span className="font-medium">$342K</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Fee</span>
            <span className="font-medium">0.3%</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Created</span>
            <span className="font-medium">6 months ago</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
