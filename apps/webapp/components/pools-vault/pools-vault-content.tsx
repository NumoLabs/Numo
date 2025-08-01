"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, ArrowRight, Shield, Coins, Star, Target, Users } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { VesuPoolCard } from "@/components/pools-vault/vesu-pool-card"
import { PoolStats } from "@/components/pools-vault/pool-stats"
import { AddToPoolForm } from "@/components/pools-vault/add-to-pool-form"
import { PoolBenefits } from "@/components/pools-vault/pool-benefits"

interface PoolData {
  id: string
  name: string
  description: string
  apy: number
  tvl: number
  participants: number
  riskLevel: string
  minDeposit: number
  maxDeposit: number
  token: string
  strategy: string
  rewards: string[]
  status: "active" | "coming-soon" | "closed"
  featured?: boolean
  protocol: string
  tokens: string[]
}

export function PoolsVaultContent() {
  const [selectedPool, setSelectedPool] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("explore")
  const { toast } = useToast()

  const availablePools: PoolData[] = [
    {
      id: "vesu",
      name: "Vesu Bitcoin Pool",
      description: "High-yield Bitcoin liquidity pool with automated strategies",
      apy: 12.5,
      tvl: 2500000,
      participants: 1250,
      riskLevel: "Medium",
      minDeposit: 0.01,
      maxDeposit: 100,
      token: "WBTC",
      strategy: "Bitcoin Automated Market Making",
      rewards: ["VESU tokens", "Trading fees", "Bitcoin liquidity incentives"],
      status: "active",
      featured: true,
      protocol: "Vesu",
      tokens: ["WBTC", "BTC"],
    },
    {
      id: "defi-vault",
      name: "Bitcoin DeFi Vault",
      description: "Bitcoin yield farming strategies across multiple protocols",
      apy: 18.2,
      tvl: 1800000,
      participants: 890,
      riskLevel: "High",
      minDeposit: 0.05,
      maxDeposit: 50,
      token: "WBTC",
      strategy: "Multi-Protocol Bitcoin Yield Farming",
      rewards: ["Bitcoin DeFi tokens", "Protocol rewards", "Compound interest"],
      status: "active",
      protocol: "Bitcoin DeFi Protocol",
      tokens: ["WBTC", "BTC"],
    },
    {
      id: "stable-vault",
      name: "Bitcoin Stable Vault",
      description: "Low-risk Bitcoin yield strategies",
      apy: 8.7,
      tvl: 3200000,
      participants: 2100,
      riskLevel: "Low",
      minDeposit: 0.005,
      maxDeposit: 200,
      token: "WBTC",
      strategy: "Bitcoin Lending",
      rewards: ["Stable Bitcoin yields", "Low volatility", "Regular payouts"],
      status: "active",
      protocol: "Bitcoin Stable Protocol",
      tokens: ["WBTC", "BTC"],
    },
    {
      id: "innovation-vault",
      name: "Bitcoin Innovation Vault",
      description: "Early-stage Bitcoin DeFi protocol investments",
      apy: 25.4,
      tvl: 950000,
      participants: 450,
      riskLevel: "Very High",
      minDeposit: 0.1,
      maxDeposit: 25,
      token: "WBTC",
      strategy: "Early Bitcoin Protocol Investment",
      rewards: ["Early Bitcoin token access", "High potential returns", "Governance rights"],
      status: "coming-soon",
      protocol: "Bitcoin Innovation Labs",
      tokens: ["WBTC", "BTC"],
    },
    {
      id: "btc-vault",
      name: "Pure Bitcoin Vault",
      description: "Pure Bitcoin yield strategies",
      apy: 15.8,
      tvl: 1500000,
      participants: 750,
      riskLevel: "Medium-High",
      minDeposit: 0.02,
      maxDeposit: 75,
      token: "BTC",
      strategy: "Pure Bitcoin Yield Farming",
      rewards: ["BTC rewards", "Liquidity fees", "Staking rewards"],
      status: "active",
      protocol: "Bitcoin Protocol",
      tokens: ["BTC", "WBTC"],
    },
    {
      id: "defi-2-vault",
      name: "Bitcoin DeFi 2.0 Vault",
      description: "Next-generation Bitcoin DeFi strategies",
      apy: 22.1,
      tvl: 1200000,
      participants: 680,
      riskLevel: "High",
      minDeposit: 0.03,
      maxDeposit: 40,
      token: "WBTC",
      strategy: "Bitcoin DeFi 2.0 Protocols",
      rewards: ["Bitcoin protocol tokens", "Governance rights", "Innovation rewards"],
      status: "active",
      protocol: "Bitcoin DeFi 2.0",
      tokens: ["WBTC", "BTC"],
    },
  ]

  const selectedPoolData = availablePools.find(pool => pool.id === selectedPool)

  const filteredPools = availablePools.filter(pool => 
    pool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pool.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pool.tokens.some(token => token.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleAddToPool = async (amount: number) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000))
      
      toast({
        title: "Successfully Added to Pool",
        description: `${amount} WBTC has been added to the ${selectedPoolData?.name}`,
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to load pool data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case "low": return "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-800/30 dark:text-green-300"
      case "medium": return "bg-amber-100 text-amber-800 hover:bg-amber-100/80 dark:bg-amber-800/30 dark:text-amber-300"
      case "medium-high": return "bg-orange-100 text-orange-800 hover:bg-orange-100/80 dark:bg-orange-800/30 dark:text-orange-300"
      case "high": return "bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-800/30 dark:text-red-300"
      case "very high": return "bg-purple-100 text-purple-800 hover:bg-purple-100/80 dark:bg-purple-800/30 dark:text-purple-300"
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100/80 dark:bg-gray-800/30 dark:text-gray-300"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-800/30 dark:text-green-300"
      case "coming-soon": return "bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-800/30 dark:text-blue-300"
      case "closed": return "bg-gray-100 text-gray-800 hover:bg-gray-100/80 dark:bg-gray-800/30 dark:text-gray-300"
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100/80 dark:bg-gray-800/30 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      {!selectedPool ? (
        // Pool Selection View
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Pool Vaults
              </h1>
              <p className="text-muted-foreground mt-2">
                Explore curated vaults and liquidity pools with automated yield strategies
              </p>
            </div>
          </div>

          {/* Info Banner */}
                        <div className="rounded-lg border p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="font-medium text-blue-900 dark:text-blue-100">New to Pool Vaults?</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Explore different vault strategies and liquidity pools. Each vault has detailed information about 
                  risks, strategies, and potential returns. Start with lower-risk vaults if you&apos;re new to DeFi.
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
              <TabsTrigger value="explore">Explore Vaults</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
            </TabsList>

            <TabsContent value="explore" className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Input 
                    type="search" 
                    placeholder="Search vaults by name, protocol, or tokens..." 
                    className="pl-10 h-11"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="gap-2 h-11">
                  <Target className="h-4 w-4" />
                  Filters
                </Button>
              </div>

              {/* Vaults Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPools.map((pool) => (
                  <Card 
                    key={pool.id}
                    className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    onClick={() => setSelectedPool(pool.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                            <Coins className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {pool.name}
                              {pool.featured && <Star className="h-4 w-4 text-yellow-500" />}
                              {pool.status === "coming-soon" && <Target className="h-4 w-4 text-blue-500" />}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {pool.description}
                            </CardDescription>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-cyan-500 transition-colors" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {pool.apy}%
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">APY</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            ${(pool.tvl / 1000000).toFixed(1)}M
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">TVL</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{pool.protocol}</Badge>
                        <Badge className={getRiskColor(pool.riskLevel)}>
                          {pool.riskLevel}
                        </Badge>
                        <Badge className={getStatusColor(pool.status)}>
                          {pool.status === "active" ? "Active" : pool.status === "coming-soon" ? "Coming Soon" : "Closed"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {pool.tokens.map((token) => (
                          <Badge key={token} variant="outline" className="text-xs">
                            {token}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="featured" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {availablePools.filter(pool => pool.featured).map((pool) => (
                  <Card 
                    key={pool.id}
                    className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    onClick={() => setSelectedPool(pool.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                            <Star className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {pool.name}
                              <Star className="h-4 w-4 text-yellow-500" />
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {pool.description}
                            </CardDescription>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-cyan-500 transition-colors" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {pool.apy}%
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">APY</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            ${(pool.tvl / 1000000).toFixed(1)}M
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">TVL</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{pool.protocol}</Badge>
                        <Badge className={getRiskColor(pool.riskLevel)}>
                          {pool.riskLevel}
                        </Badge>
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 dark:bg-yellow-800/30 dark:text-yellow-300">
                          Featured
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {pool.tokens.map((token) => (
                          <Badge key={token} variant="outline" className="text-xs">
                            {token}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        // Pool Detail View
        <div className="space-y-6">
          {/* Back to Selection */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setSelectedPool(null)}
              className="gap-2"
            >
              ← Back to Vaults
            </Button>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
            <h2 className="text-xl font-semibold">{selectedPoolData?.name}</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Pool Information */}
            <div className="lg:col-span-2 space-y-6">
              <VesuPoolCard poolData={selectedPoolData!} />
              <PoolStats />
              <PoolBenefits />
            </div>

            {/* Right Column - Add to Pool */}
            <div className="space-y-6 sticky top-6">
              <AddToPoolForm
                poolData={selectedPoolData!}
                onAddToPool={handleAddToPool}
                isLoading={isLoading}
              />

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-lg border border-green-200/50">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Current APY</span>
                      </div>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        {selectedPoolData?.apy}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 rounded-lg border border-blue-200/50">
                      <div className="flex items-center gap-2">
                        <Coins className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Total Value</span>
                      </div>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        ${selectedPoolData?.tvl ? (selectedPoolData.tvl / 1000000).toFixed(1) : '0.0'}M
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 rounded-lg border border-purple-200/50">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-500" />
                        <span className="text-sm font-medium">Participants</span>
                      </div>
                      <span className="font-bold text-purple-600 dark:text-purple-400">
                        {selectedPoolData?.participants?.toLocaleString() || '0'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-orange-500" />
                    Risk Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Risk Level</span>
                      <Badge className={getRiskColor(selectedPoolData?.riskLevel || 'medium')}>
                        {selectedPoolData?.riskLevel || 'Medium'}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      <p>• Automated strategies may experience volatility</p>
                      <p>• Past performance doesn&apos;t guarantee future returns</p>
                      <p>• Consider your risk tolerance before investing</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 