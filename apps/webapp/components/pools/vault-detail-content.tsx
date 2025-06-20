"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowLeft, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PoolDetailChart } from "@/components/pools/pool-detail-chart"

export function VaultDetailContent() {
  const pathname = usePathname()
  const vaultSlug = pathname.split("/").pop() || ""

  // Example data for a custom vault
  const vaultData = {
    name: "My Balanced Vault",
    description: "Balanced strategy between lending and liquidity pools",
    apy: "5.4%",
    totalValue: "0.32 BTC",
    createdAt: "2 weeks ago",
    lastRebalanced: "3 days ago",
    pools: [
      { name: "Vesu BTC Lending", allocation: 50, apy: "5.8%" },
      { name: "Ekubo BTC/USDC", allocation: 30, apy: "4.8%" },
      { name: "Ekubo BTC/ETH", allocation: 20, apy: "5.2%" },
    ],
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
                  <CardTitle className="text-2xl">{vaultData.name}</CardTitle>
                  <CardDescription className="text-base">{vaultData.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Link href={`/pools/edit/${vaultSlug}`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/deposit?vault=${vaultSlug}`}>
                    <Button size="sm">Deposit</Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="pools">Pools</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Vault Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    This custom vault combines different strategies to achieve a balance between performance and risk.
                    The current distribution is optimized to maintain BTC exposure while generating returns from
                    different sources.
                  </p>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="font-medium">{vaultData.createdAt}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Last Rebalanced</p>
                      <p className="font-medium">{vaultData.lastRebalanced}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total Value</p>
                      <p className="font-medium">{vaultData.totalValue}</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Current Distribution</h4>
                    <div className="space-y-4">
                      {vaultData.pools.map((pool, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{pool.name}</span>
                            <span>{pool.allocation}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                pool.name.includes("Vesu") ? "bg-emerald-500" : "bg-amber-500"
                              }`}
                              style={{ width: `${pool.allocation}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Historical Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <PoolDetailChart />
                  </div>
                </CardContent>
              </Card>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Current APY</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{vaultData.apy}</div>
                    <p className="text-xs text-muted-foreground mt-1">+0.1% in the last 7 days</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{vaultData.totalValue}</div>
                    <p className="text-xs text-muted-foreground mt-1">+0.015 BTC in the last 30 days</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Cumulative Return</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0.023 BTC</div>
                    <p className="text-xs text-muted-foreground mt-1">Since creation</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="pools" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pools in this Vault</CardTitle>
                  <CardDescription>Details of the pools that make up this custom vault.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {vaultData.pools.map((pool, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{pool.name}</h4>
                        <Badge variant="outline">{pool.apy} APY</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Allocation</span>
                          <span>{pool.allocation}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              pool.name.includes("Vesu") ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                            style={{ width: `${pool.allocation}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Link href={`/pools/${pool.name.toLowerCase().replace(/\//g, "-").replace(/\s+/g, "-")}`}>
                          <Button variant="outline" size="sm">
                            View Pool Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href={`/deposit?vault=${vaultSlug}`}>
                <Button className="w-full">Deposit</Button>
              </Link>
              <Link href={`/withdraw?vault=${vaultSlug}`}>
                <Button variant="outline" className="w-full">
                  Withdraw
                </Button>
              </Link>
              <Link href={`/pools/edit/${vaultSlug}`}>
                <Button variant="outline" className="w-full">
                  Edit Vault
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">APY</span>
                  <span className="font-medium">{vaultData.apy}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Value</span>
                  <span className="font-medium">{vaultData.totalValue}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Pools</span>
                  <span className="font-medium">{vaultData.pools.length}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="font-medium">{vaultData.createdAt}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Rebalanced</span>
                  <span className="font-medium">{vaultData.lastRebalanced}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Similar Vaults</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/pools/vault/my-conservative-vault" className="block">
                <div className="rounded-lg border p-3 hover:bg-accent transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">My Conservative Vault</span>
                    <Badge variant="outline">5.1% APY</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Conservative strategy focused on lending</p>
                </div>
              </Link>
              <Link href="/pools/vault/aggressive-vault" className="block">
                <div className="rounded-lg border p-3 hover:bg-accent transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Aggressive Vault</span>
                    <Badge variant="outline">5.7% APY</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">High-yield strategy with higher risk</p>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
