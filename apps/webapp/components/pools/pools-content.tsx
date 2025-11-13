"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Filter, Info, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PoolCard } from "@/components/pools/pool-card"
import { VaultCard } from "@/components/pools/vault-card"
import { getVesuV2Pools, getVesuPools } from "@/app/api/vesuApi"
import { calculateRiskLevel, formatApy } from "@/lib/vesu-config"

interface VesuPool {
  id: string
  name: string
  version?: string
  assets: Array<{
    symbol: string
    apy: number
    currentUtilization: number
    defiSpringApy?: number
  }>
}

export function PoolsContent() {
  const [vesuPools, setVesuPools] = useState<VesuPool[]>([])
  const [isLoadingPools, setIsLoadingPools] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setIsLoadingPools(true)
    setError(null)

    // Fetch both V1 and V2 pools from Vesu API
    Promise.allSettled([getVesuV2Pools(), getVesuPools()])
      .then(([v2Result, v1Result]) => {
        if (!mounted) return

        const v2Pools = v2Result.status === "fulfilled" ? v2Result.value : []
        const v1Pools = v1Result.status === "fulfilled" ? v1Result.value : []

        // Combine V1 and V2 pools
        const allPools = [
          ...(v2Pools as VesuPool[]).map((pool) => ({ ...pool, version: "v2" })),
          ...(v1Pools as VesuPool[]).map((pool) => ({ ...pool, version: "v1" })),
        ]

        setVesuPools(allPools)
        setIsLoadingPools(false)

        // Log errors but don't block UI
        if (v2Result.status === "rejected") {
          console.warn("Error fetching Vesu V2 pools:", v2Result.reason)
        }
        if (v1Result.status === "rejected") {
          console.warn("Error fetching Vesu V1 pools:", v1Result.reason)
        }

        // Show error only if all requests failed
        if (v2Result.status === "rejected" && v1Result.status === "rejected") {
          setError("Unable to fetch pools from Vesu API. Please try again later.")
        }
      })
      .catch((error) => {
        console.error("Error fetching Vesu pools:", error)
        if (mounted) {
          setVesuPools([])
          setIsLoadingPools(false)
          setError("Failed to fetch pools. Please try again later.")
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Pools
          </h1>
          <p className="text-muted-foreground mt-2">
            Explore available pools and add them to your vaults
          </p>
        </div>
        {/* Hidden: Custom vaults feature not yet available */}
        <Link href="/pools/create" className="hidden">
          <Button className="gap-2 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 hover:from-orange-400 hover:via-yellow-400 hover:to-orange-400 text-black px-4 py-2 rounded-lg font-bold transition-all duration-200 shadow-bitcoin hover:shadow-bitcoin-gold focus-visible:shadow-bitcoin-gold transform hover:-translate-y-1 hover:scale-105 focus-visible:-translate-y-1 focus-visible:scale-105">
            <Plus className="h-4 w-4" />
            New Custom Vault
          </Button>
        </Link>
      </div>

      {/* Info Banner */}
      <div className="rounded-lg border p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="font-medium text-yellow-900 dark:text-yellow-100">New to DeFi?</p>
            <p className="text-sm text-white">
              Here you can explore different liquidity pools and create your own custom vaults. Each pool has detailed
              information about how it works, risks, and potential returns. The automatic vault remains the safest
              option for beginners.
            </p>
            <Link href="/learn">
              <Button
                variant="link"
                className="h-auto p-0 text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200"
              >
                Learn more about DeFi and liquidity pools →
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="explore" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 lg:w-[200px]">
          <TabsTrigger 
            value="explore"
            className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:via-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100 transition-all duration-300 ease-in-out"
          >
            Pools
          </TabsTrigger>
          {/* Hidden: Custom vaults feature not yet available */}
          <TabsTrigger 
            value="custom"
            className="hidden gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:via-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100 transition-all duration-300 ease-in-out"
          >
            My Vaults
          </TabsTrigger>
        </TabsList>

        <TabsContent value="explore" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground -translate-y-1/2" />
              <Input type="search" placeholder="Search pools by name, token, or protocol..." className="pl-10 h-11" />
            </div>
            <Button variant="outline" className="gap-2 h-11">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Pools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {isLoadingPools ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                Loading pools from Vesu API...
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-8">
                <p className="text-destructive mb-4">{error}</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsLoadingPools(true)
                    setError(null)
                    // Trigger re-fetch
                    window.location.reload()
                  }}
                >
                  Retry
                </Button>
              </div>
            ) : vesuPools.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No pools available at the moment. Please try again later.
              </div>
            ) : (
              vesuPools.map((pool) => {
                // Calculate total APY (supply APY + DeFi Spring APY) for each asset
                const assetApys = pool.assets.map((asset) => {
                  const supplyApy = asset.apy || 0
                  const defiSpringApy = asset.defiSpringApy || 0
                  return supplyApy + defiSpringApy
                })

                // Get the highest total APY from all assets in the pool
                const maxApy = assetApys.length > 0 ? Math.max(...assetApys) : 0

                // Get the highest risk level from all assets
                const maxRisk =
                  pool.assets.length > 0
                    ? pool.assets.reduce(
                        (max, asset) => {
                          const assetRisk = calculateRiskLevel(asset.currentUtilization)
                          const riskOrder = { Low: 1, Medium: 2, High: 3, Critical: 4 }
                          return (
                            (riskOrder[assetRisk as keyof typeof riskOrder] || 0) >
                            (riskOrder[max as keyof typeof riskOrder] || 0)
                              ? assetRisk
                              : max
                          )
                        },
                        "Low" as string,
                      )
                    : "Low"

                // Get all unique token symbols from assets
                const tokens = pool.assets.map((asset) => asset.symbol)

                // Determine protocol name based on version
                const protocol = pool.version === "v2" ? "Vesu V2" : "Vesu"

                return (
              <PoolCard
                key={pool.id}
                name={pool.name}
                    description={`${protocol} ${pool.name} pool`}
                    apy={formatApy(maxApy)}
                    tvl="—"
                    protocol={protocol}
                    risk={maxRisk}
                    tokens={tokens}
                poolId={pool.id}
              />
                )
              })
            )}
          </div>
        </TabsContent>

        {/* Hidden: Custom vaults feature not yet available */}
        <TabsContent value="custom" className="hidden space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Custom Vaults - TODO: Fetch from user's vaults API */}
            {/* Currently empty - vaults should be fetched from user's account */}

            {/* Create New Vault Card */}
            <Link href="/pools/create">
              <Card className="flex flex-col items-center justify-center p-8 h-full border-2 border-dashed border-yellow-300 dark:border-yellow-700 cursor-pointer hover:border-yellow-400 dark:hover:border-yellow-600 hover:bg-gradient-to-br hover:from-yellow-50/50 hover:to-orange-50/50 dark:hover:from-yellow-950/20 dark:hover:to-orange-950/20 transition-all duration-200 group">
                <div className="rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/50 dark:to-orange-900/50 p-4 mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Plus className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                </div>
                <p className="text-lg font-medium text-yellow-900 dark:text-yellow-100 mb-2">Create New Vault</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 text-center mb-4">
                  Build a custom vault with your preferred pool allocation
                </p>
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black">
                  Get Started
                </Button>
              </Card>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PoolsContent
