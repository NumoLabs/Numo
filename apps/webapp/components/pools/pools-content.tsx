import Link from "next/link"
import { useEffect, useState } from "react"
import { Filter, Info, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PoolCard } from "@/components/pools/pool-card"
import { VaultCard } from "@/components/pools/vault-card"
import { poolsData } from "@/lib/pools-data"
import { getVesuPools } from "@/app/api/vesuApi"
import { calculateRiskLevel } from "@/lib/vesu-config"

export function PoolsContent() {
  const [vesuPools, setVesuPools] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    getVesuPools()
      .then((data) => {
        if (mounted) setVesuPools(data)
      })
      .catch(() => {
        if (mounted) setVesuPools([])
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
        <Link href="/pools/create">
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
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger 
            value="explore"
            className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:via-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100 transition-all duration-300 ease-in-out"
          >
            Pools
          </TabsTrigger>
          <TabsTrigger 
            value="custom"
            className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:via-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100 transition-all duration-300 ease-in-out"
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
            {poolsData.map((pool) => (
              <PoolCard
                key={pool.id}
                name={pool.name}
                description={pool.description}
                apy={pool.apy}
                tvl={pool.tvl}
                protocol={pool.protocol}
                risk={pool.risk}
                tokens={pool.tokens}
                poolId={pool.id}
              />
            ))}

            {/* Vesu V2 Pools (hardcoded from docs) */}
            {[
              {
                id: "0x451fe483d5921a2919ddd81d0de6696669bccdacd859f72a4fba7656b97c3b5",
                name: "Prime",
                description: "Vesu V2 Prime pool",
                apy: "5.2%",
                tvl: "—",
                protocol: "Vesu V2",
                risk: "Low",
                tokens: ["USDC", "ETH", "WBTC"],
              },
              {
                id: "0x3976cac265a12609934089004df458ea29c776d77da423c96dc761d09d24124",
                name: "Re7 USDC Core",
                description: "Vesu V2 Re7 USDC Core pool",
                apy: "4.8%",
                tvl: "—",
                protocol: "Vesu V2",
                risk: "Low",
                tokens: ["USDC"],
              },
              {
                id: "0x2eef0c13b10b487ea5916b54c0a7f98ec43fb3048f60fdeedaf5b08f6f88aaf",
                name: "Re7 USDC Prime",
                description: "Vesu V2 Re7 USDC Prime pool",
                apy: "5.1%",
                tvl: "—",
                protocol: "Vesu V2",
                risk: "Low",
                tokens: ["USDC"],
              },
              {
                id: "0x5c03e7e0ccfe79c634782388eb1e6ed4e8e2a013ab0fcc055140805e46261bd",
                name: "Re7 USDC Frontier",
                description: "Vesu V2 Re7 USDC Frontier pool",
                apy: "5.5%",
                tvl: "—",
                protocol: "Vesu V2",
                risk: "Medium",
                tokens: ["USDC"],
              },
              {
                id: "0x3a8416bf20d036df5b1cf3447630a2e1cb04685f6b0c3a70ed7fb1473548ecf",
                name: "Re7 xBTC",
                description: "Vesu V2 Re7 xBTC pool",
                apy: "6.2%",
                tvl: "—",
                protocol: "Vesu V2",
                risk: "Medium",
                tokens: ["xBTC"],
              },
              {
                id: "0x73702fce24aba36da1eac539bd4bae62d4d6a76747b7cdd3e016da754d7a135",
                name: "Re7 USDC Stable Core",
                description: "Vesu V2 Re7 USDC Stable Core pool",
                apy: "4.5%",
                tvl: "—",
                protocol: "Vesu V2",
                risk: "Low",
                tokens: ["USDC"],
              },
            ].map((pool) => (
              <PoolCard
                key={pool.id}
                name={pool.name}
                description={pool.description}
                apy={pool.apy}
                tvl={pool.tvl}
                protocol={pool.protocol}
                risk={pool.risk}
                tokens={pool.tokens}
                poolId={pool.id}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Existing Custom Vaults */}
            <VaultCard
              name="My Conservative Vault"
              description="Conservative strategy focused on lending protocols"
              apy="5.1%"
              totalValue="0.45 BTC"
              pools={[
                { name: "Vesu BTC Lending", allocation: 70 },
                { name: "Vesu BTC Vault", allocation: 30 },
              ]}
              vaultId="btc-conservative"
            />
            <VaultCard
              name="My Balanced Vault"
              description="Balanced strategy between lending and liquidity pools"
              apy="5.4%"
              totalValue="0.32 BTC"
              pools={[
                { name: "Vesu BTC Lending", allocation: 50 },
                { name: "Ekubo BTC/USDC", allocation: 30 },
                { name: "Ekubo BTC/ETH", allocation: 20 },
              ]}
              vaultId="btc-balanced"
            />

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
