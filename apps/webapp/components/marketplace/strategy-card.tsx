"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, TrendingUp, Users, Verified, Star, Eye } from "lucide-react"
import type { Strategy } from "@/lib/marketplace-data"

interface StrategyCardProps {
  strategy: Strategy
  onFollow: (strategyId: string) => void
  isFollowing?: boolean
}

const riskColors = {
  Low: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-800 dark:text-green-300",
    icon: "text-green-500",
  },
  Medium: {
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-800 dark:text-yellow-300",
    icon: "text-yellow-500",
  },
  High: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-800 dark:text-red-300",
    icon: "text-red-500",
  },
}

const protocolColors = {
  Vesu: "bg-emerald-500",
  Ekubo: "bg-amber-500",
}

export function StrategyCard({ strategy, onFollow, isFollowing = false }: StrategyCardProps) {
  const riskStyle = riskColors[strategy.risk]

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-200 group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">{strategy.name}</CardTitle>
              {strategy.verified && <Verified className="h-4 w-4 text-blue-500" />}
              {strategy.featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{strategy.description}</p>
          </div>
          <Badge className={`${riskStyle.bg} ${riskStyle.text} gap-1`}>
            <Shield className={`h-3 w-3 ${riskStyle.icon}`} />
            {strategy.risk}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* APY and Performance */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{strategy.apy}</div>
            <div className="text-xs text-muted-foreground">Current APY</div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>30d</span>
              <span className="text-green-600 font-medium">{strategy.performance["30d"]}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>7d</span>
              <span className="text-green-600 font-medium">{strategy.performance["7d"]}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>1d</span>
              <span className="text-green-600 font-medium">{strategy.performance["1d"]}</span>
            </div>
          </div>
        </div>

        {/* Strategy Allocation */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Strategy Allocation</span>
          </div>
          {strategy.allocation.map((allocation, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>
                  {allocation.protocol} - {allocation.pool}
                </span>
                <span className="font-medium">{allocation.percentage}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${protocolColors[allocation.protocol as keyof typeof protocolColors]}`}
                  style={{ width: `${allocation.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">{strategy.tvl}</div>
              <div className="text-xs text-muted-foreground">TVL</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">{formatNumber(strategy.followers)}</div>
              <div className="text-xs text-muted-foreground">Followers</div>
            </div>
          </div>
        </div>

        {/* Creator */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Created by</div>
              <div className="text-sm font-medium">{strategy.creatorName || formatAddress(strategy.creator)}</div>
            </div>
            <div className="text-xs text-muted-foreground">{new Date(strategy.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 gap-1">
          <Eye className="h-4 w-4" />
          View Details
        </Button>
        <Button
          size="sm"
          className="flex-1"
          onClick={() => onFollow(strategy.id)}
          variant={isFollowing ? "secondary" : "default"}
        >
          {isFollowing ? "Following" : "Follow Strategy"}
        </Button>
      </CardFooter>
    </Card>
  )
}
