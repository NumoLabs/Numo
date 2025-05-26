import Link from "next/link"
import { Filter, Info, Plus, Search, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/ui/header"
import { PoolCard } from "@/components/pools/pool-card"
import { VaultCard } from "@/components/pools/vault-card"
import { poolsData } from "@/lib/pools-data"

export default function PoolsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header variant="dashboard" />
      <main className="flex-1 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Pools and Custom Vaults</h1>
          </div>
          <Link href="/pools/create">
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              New Custom Vault
            </Button>
          </Link>
        </div>

        <div className="rounded-lg border p-4 bg-blue-50 dark:bg-blue-950/20 mb-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-medium">New to DeFi?</p>
              <p className="text-sm text-muted-foreground">
                Here you can explore different liquidity pools and create your own custom vaults. Each pool has detailed
                information about how it works, risks, and potential returns. The automatic vault remains the safest
                option for beginners.
              </p>
              <Link href="/learn/defi-basics">
                <Button variant="link" className="h-auto p-0 text-black dark:text-white">
                  Learn more about DeFi and liquidity pools →
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Tabs defaultValue="explore" className="space-y-4">
          <TabsList>
            <TabsTrigger value="explore">Explore Pools</TabsTrigger>
            <TabsTrigger value="custom">My Custom Vaults</TabsTrigger>
          </TabsList>

          <TabsContent value="explore" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search pools by name or token..." className="pl-8" />
              </div>
              <Button variant="outline" className="gap-1">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

          <TabsContent value="custom" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <VaultCard
                name="My Conservative Vault"
                description="Conservative strategy focused on lending"
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
              <Link href="/pools/create">
                <Card className="flex flex-col items-center justify-center p-6 h-full border-dashed cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground mb-4 text-center">Create a new custom vault</p>
                  <Button>New Vault</Button>
                </Card>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
