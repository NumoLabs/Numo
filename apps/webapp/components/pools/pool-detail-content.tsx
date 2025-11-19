"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PoolDetailChart } from "@/components/pools/pool-detail-chart"
import { PoolDetails, PoolPerformance, PoolStatistics } from "@/components/pools/pool-details"
import { PoolRisks } from "@/components/pools/pool-risks"
import { AddToVaultActions } from "@/components/pools/vault-actions"
import { useVesuPoolsData } from "@/hooks/use-vault-queries"
import { fetchTopPools } from "@/app/api/ekuboApi"
import { useEffect, useState, useMemo } from "react"
import type { VesuPool } from "@/types/VesuPools"
import type { EkuboPoolsDisplay } from "@/types/EkuboPoolsDisplay"

interface Pool {
  id: string
  name: string
  description: string
  apy: string
  tvl: string
  protocol: string
  risk: string
  tokens: string[]
  url?: string
  details?: string
  risks?: string[]
  benefits?: string[]
  poolType: 'vesu' | 'ekubo'
  originalData: VesuPool | EkuboPoolsDisplay
}

export function PoolDetailContent() {
  const params = useParams()
  const [pool, setPool] = useState<Pool | null>(null)
  const [loading, setLoading] = useState(true)
  const [ekuboPools, setEkuboPools] = useState<EkuboPoolsDisplay[]>([])
  
  const { data: vesuPools, isLoading: isLoadingVesu } = useVesuPoolsData()

  // Fetch Ekubo pools
  useEffect(() => {
    const loadEkuboPools = async () => {
      try {
        const pools = await fetchTopPools()
        setEkuboPools(pools)
      } catch (error) {
        console.error('Error loading Ekubo pools:', error)
        setEkuboPools([])
      }
    }
    loadEkuboPools()
  }, [])

  // Combine pools and find the requested one
  const allPools = useMemo<Pool[]>(() => {
    const pools: Pool[] = []

    // Add Vesu pools
    if (Array.isArray(vesuPools)) {
      vesuPools.forEach((p: VesuPool) => {
        if (!p.assets || p.assets.length === 0) return

        const bestAsset = p.assets.reduce((best, current) => {
          const currentApy = (current.apy || 0) + (current.defiSpringApy || 0)
          const bestApy = (best.apy || 0) + (best.defiSpringApy || 0)
          return currentApy > bestApy ? current : best
        }, p.assets[0])

        const totalApy = ((bestAsset.apy || 0) + (bestAsset.defiSpringApy || 0)).toFixed(2)
        const tokens = p.assets.map(a => a.symbol).filter(Boolean)

        pools.push({
          id: `vesu-${p.id}`,
          name: p.name,
          description: `Lending pool on Vesu Finance with ${tokens.join(', ')} support`,
          apy: `${totalApy}%`,
          tvl: "N/A",
          protocol: "Vesu",
          risk: bestAsset.currentUtilization && bestAsset.currentUtilization > 80 ? "Medium" : "Low",
          tokens,
          url: "https://vesu.xyz",
          details: `Decentralized lending pool where you can lend your tokens and earn interest. Loans are backed by collateralized guarantees.`,
          risks: [
            "Smart contract risk of the Vesu platform",
            "Liquidity risk in case of high withdrawal demand",
            "Risk of interest rate changes",
          ],
          benefits: [
            "Stable returns through loan interest",
            "Lower volatility compared to liquidity pools",
            "Backed by collateralized guarantees",
          ],
          poolType: 'vesu',
          originalData: p
        })
      })
    }

    // Add Ekubo pools
    ekuboPools.forEach((p: EkuboPoolsDisplay) => {
      const token0Symbol = p.token0?.symbol || 'Unknown'
      const token1Symbol = p.token1?.symbol || 'Unknown'
      // Pool type doesn't have apy property, use N/A
      const apy = "N/A"
      const tvl = p.totalTvl ? `$${(p.totalTvl / 1e6).toFixed(1)}M` : "N/A"

      pools.push({
        id: `ekubo-${token0Symbol}-${token1Symbol}`,
        name: `Ekubo ${token0Symbol}/${token1Symbol}`,
        description: `${token0Symbol}/${token1Symbol} liquidity pool on Ekubo DEX`,
        apy,
        tvl,
        protocol: "Ekubo",
        risk: "Medium",
        tokens: [token0Symbol, token1Symbol],
        url: "https://ekubo.org",
        details: `This pool allows users to provide liquidity for the ${token0Symbol}/${token1Symbol} pair on Ekubo DEX. Liquidity providers earn trading fees generated when users swap between these tokens.`,
        risks: [
          "Impermanent loss risk if token prices change significantly",
          "Smart contract risk associated with the Ekubo platform",
          "Liquidity risk if trading volume decreases",
        ],
        benefits: [
          "Trading fees generated from swap activity",
          "Token exposure while maintaining diversification",
          "Potential participation in Ekubo incentive programs",
        ],
        poolType: 'ekubo',
        originalData: p
      })
    })

    return pools
  }, [vesuPools, ekuboPools])

  useEffect(() => {
    if (params.pool && !isLoadingVesu && ekuboPools.length >= 0) {
      const poolId = params.pool as string
      const foundPool = allPools.find(p => p.id === poolId || p.id.endsWith(poolId))
      setPool(foundPool || null)
      setLoading(false)
    }
  }, [params.pool, allPools, isLoadingVesu, ekuboPools])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading pool details...</p>
        </div>
      </div>
    )
  }

  if (!pool) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Pool not found</h1>
        <Link href="/pools">
          <Button>Back to Pools</Button>
        </Link>
      </div>
    )
  }

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300"
      case "medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-800/30 dark:text-amber-300"
      case "medium-high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-800/30 dark:text-orange-300"
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/pools">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Pools
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{pool.name}</h1>
                  <p className="text-muted-foreground text-base">{pool.description}</p>
                </div>
                <div className="flex gap-2">
                  {pool.url && (
                    <Link href={pool.url} target="_blank">
                      <Button variant="outline" size="sm" className="gap-1">
                        <ExternalLink className="h-4 w-4" />
                        Website
                      </Button>
                    </Link>
                  )}
                  <Link href={`/pools/add/${params.pool}`}>
                    <Button size="sm">Add to Vault</Button>
                  </Link>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary">{pool.protocol}</Badge>
                <Badge className={getRiskColor(pool.risk)}>{pool.risk}</Badge>
                {pool.tokens.map((token: string) => (
                  <Badge key={token} variant="outline">
                    {token}
                  </Badge>
                ))}
              </div>
            </CardHeader>
          </Card>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="risks">Risks</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <PoolDetails pool={pool} />
            </TabsContent>
            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold">Historical Performance</h2>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <PoolDetailChart />
                  </div>
                </CardContent>
              </Card>
              <PoolPerformance pool={pool} />
            </TabsContent>
            <TabsContent value="risks" className="space-y-4">
              <PoolRisks pool={pool} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <AddToVaultActions poolSlug={params.pool as string} />
          <PoolStatistics pool={pool} />

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Similar Pools</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/pools/ekubo-btc-eth" className="block">
                <div className="rounded-lg border p-3 hover:bg-accent transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Ekubo BTC/ETH</span>
                    <Badge variant="outline">5.2% APY</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">BTC/ETH liquidity pool on Ekubo DEX</p>
                </div>
              </Link>
              <Link href="/pools/ekubo-btc-usdt" className="block">
                <div className="rounded-lg border p-3 hover:bg-accent transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Ekubo BTC/USDT</span>
                    <Badge variant="outline">4.6% APY</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">BTC/USDT liquidity pool on Ekubo DEX</p>
                </div>
              </Link>
              <Link href="/pools/vesu-btc-lending" className="block">
                <div className="rounded-lg border p-3 hover:bg-accent transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Vesu BTC Lending</span>
                    <Badge variant="outline">5.8% APY</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">BTC lending on Vesu platform</p>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
