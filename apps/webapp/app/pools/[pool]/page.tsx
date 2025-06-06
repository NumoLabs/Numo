import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/ui/header"
import { PoolDetailChart } from "@/components/pools/pool-detail-chart"
import { PoolDetails, PoolPerformance, PoolStatistics } from "@/components/pools/pool-details"
import { PoolRisks } from "@/components/pools/pool-risks"
import { AddToVaultActions } from "@/components/pools/vault-actions"
import { getPoolBySlug } from "@/lib/pools-data"

type Props = {
  params: Promise<{ pool: string }>
}

export default async function PoolDetailPage({
  params,
}: Props) {
  const resolvedParams = await params
  const pool = await getPoolBySlug(resolvedParams.pool)

  if (!pool) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Pool not found</h1>
          <Link href="/pools">
            <Button>Back to Pools</Button>
          </Link>
        </div>
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
    <div className="flex min-h-screen flex-col">
      <Header variant="dashboard" />
      <main className="flex-1 p-4 md:p-8 pt-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
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
                      <Link href={`/pools/add/${resolvedParams.pool}`}>
                        <Button size="sm">Add to Vault</Button>
                      </Link>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">{pool.protocol}</Badge>
                    <Badge className={getRiskColor(pool.risk)}>{pool.risk}</Badge>
                    {pool.tokens.map((token) => (
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
              <AddToVaultActions poolSlug={resolvedParams.pool} />
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
      </main>
    </div>
  )
}
