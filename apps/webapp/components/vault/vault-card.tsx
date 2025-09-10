"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, TrendingUp, Shield, AlertTriangle, Star, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import type { VaultStrategy } from "@/types/Vault"

interface VaultCardProps {
  strategy: VaultStrategy
  onDeposit?: (strategyId: string) => void
  onWithdraw?: (strategyId: string) => void
  onViewDetails?: (strategyId: string) => void
  onFollow?: (strategyId: string) => void
  showActions?: boolean
}

export function VaultCard({ 
  strategy, 
  onDeposit, 
  onWithdraw, 
  onViewDetails, 
  onFollow,
  showActions = true 
}: VaultCardProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const { toast } = useToast()

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    onFollow?.(strategy.id)
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: `You ${isFollowing ? 'unfollowed' : 'are now following'} ${strategy.name}`,
    })
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800 border-green-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'High': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'Low': return <Shield className="h-3 w-3" />
      case 'Medium': return <AlertTriangle className="h-3 w-3" />
      case 'High': return <TrendingUp className="h-3 w-3" />
      default: return <Shield className="h-3 w-3" />
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-0 bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold text-gray-900">
                {strategy.name}
              </CardTitle>
              {strategy.verified && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                  <Star className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
              {strategy.featured && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
                  Featured
                </Badge>
              )}
            </div>
            <CardDescription className="text-sm text-gray-600 leading-relaxed">
              {strategy.description}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails?.(strategy.id)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleFollow}>
                {isFollowing ? 'Unfollow' : 'Follow'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open(`/vault/${strategy.id}`, '_blank')}>
                Open in New Tab
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">APY</span>
              <Badge className={getRiskColor(strategy.riskLevel)}>
                {getRiskIcon(strategy.riskLevel)}
                <span className="ml-1">{strategy.riskLevel}</span>
              </Badge>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {strategy.apy}%
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-sm font-medium text-gray-600">Total Value</span>
            <p className="text-2xl font-bold text-gray-900">
              {strategy.totalValue.toLocaleString()} BTC
            </p>
          </div>
        </div>

        {/* Performance */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Performance</span>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-green-600 font-medium">
                +{strategy.performance['1d']}% 1d
              </span>
              <span className="text-green-600 font-medium">
                +{strategy.performance['7d']}% 7d
              </span>
              <span className="text-green-600 font-medium">
                +{strategy.performance['30d']}% 30d
              </span>
            </div>
          </div>
        </div>

        {/* Pool Allocations */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Pool Allocation</span>
            <span className="text-xs text-gray-500">
              Last rebalanced: {new Date(strategy.lastRebalanced).toLocaleDateString()}
            </span>
          </div>
          <div className="space-y-2">
            {strategy.pools.map((pool, index) => (
              <div key={pool.poolId} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{pool.poolName}</span>
                    <Badge variant="outline" className="text-xs">
                      {pool.protocol}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">{pool.apy}% APY</span>
                    <span className="font-medium text-gray-900">{pool.allocation}%</span>
                  </div>
                </div>
                <Progress value={pool.allocation} className="h-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {strategy.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="pt-4 border-t bg-gray-50/50">
          <div className="flex w-full gap-2">
            <Button 
              onClick={() => onDeposit?.(strategy.id)}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Deposit
            </Button>
            <Button 
              onClick={() => onWithdraw?.(strategy.id)}
              variant="outline"
              className="flex-1"
            >
              Withdraw
            </Button>
            <Button 
              onClick={() => onViewDetails?.(strategy.id)}
              variant="outline"
              size="sm"
              className="px-3"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
