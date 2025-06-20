import Link from "next/link"
import { Filter, Info, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PoolCard } from "@/components/pools/pool-card"
import { VaultCard } from "@/components/pools/vault-card"
import { poolsData } from "@/lib/pools-data"

export function PoolsContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Custom Pools
          </h1>
          <p className="text-muted-foreground mt-2">
            Explore liquidity pools and create custom vaults tailored to your strategy
          </p>
        </div>
        <Link href="/pools/create">
          <Button className="gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
            <Plus className="h-4 w-4" />
            New Custom Vault
          </Button>
        </Link>
      </div>

      {/* Info Banner */}
      <div className="rounded-lg border p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="font-medium text-blue-900 dark:text-blue-100">New to DeFi?</p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Here you can explore different liquidity pools and create your own custom vaults. Each pool has detailed
              information about how it works, risks, and potential returns. The automatic vault remains the safest
              option for beginners.
            </p>
            <Link href="/learn">
              <Button
                variant="link"
                className="h-auto p-0 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
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
          <TabsTrigger value="explore">Explore Pools</TabsTrigger>
          <TabsTrigger value="custom">My Custom Vaults</TabsTrigger>
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
              <Card className="flex flex-col items-center justify-center p-8 h-full border-2 border-dashed border-gray-300 dark:border-gray-700 cursor-pointer hover:border-cyan-400 dark:hover:border-cyan-600 hover:bg-gradient-to-br hover:from-cyan-50/50 hover:to-blue-50/50 dark:hover:from-cyan-950/20 dark:hover:to-blue-950/20 transition-all duration-200 group">
                <div className="rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/50 dark:to-blue-900/50 p-4 mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Plus className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
                </div>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Create New Vault</p>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Build a custom vault with your preferred pool allocation
                </p>
                <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
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
