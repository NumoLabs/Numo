"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Wallet, TrendingUp, Shield, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PoolDetailChart } from "@/components/pools/pool-detail-chart"

export function VaultDepositContent() {
  const params = useParams()
  const vaultSlug = Array.isArray(params?.vault) ? params.vault[0] : (params?.vault as string | undefined)

  // Example data for the vault based on slug
  const vaultData = {
    name: vaultSlug === "btc-conservative" ? "BTC Conservative Vault" : "My Balanced Vault",
    description:
      vaultSlug === "btc-conservative"
        ? "Conservative strategy focused on BTC lending with lower risk"
        : "Balanced strategy between lending and liquidity pools",
    apy: vaultSlug === "btc-conservative" ? "4.8%" : "5.4%",
    totalValue: "0.32 BTC",
    minDeposit: "0.001 BTC",
    createdAt: "2 weeks ago",
    lastRebalanced: "3 days ago",
    pools:
      vaultSlug === "btc-conservative"
        ? [
            { name: "Vesu BTC Lending", allocation: 80, apy: "4.9%" },
            { name: "Ekubo BTC/USDC", allocation: 20, apy: "4.5%" },
          ]
        : [
            { name: "Vesu BTC Lending", allocation: 50, apy: "5.8%" },
            { name: "Ekubo BTC/USDC", allocation: 30, apy: "4.8%" },
            { name: "Ekubo BTC/ETH", allocation: 20, apy: "5.2%" },
          ],
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Link href="/pools">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Pools
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Vault Info Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{vaultData.name}</CardTitle>
                  <CardDescription className="text-base mt-1">{vaultData.description}</CardDescription>
                </div>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {vaultData.apy} APY
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Deposit Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Deposit Amount
              </CardTitle>
              <CardDescription>Enter the amount you want to deposit into this vault</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (BTC)</Label>
                  <Input id="amount" type="number" placeholder="0.00" step="0.001" min={vaultData.minDeposit} />
                  <p className="text-sm text-muted-foreground">Minimum deposit: {vaultData.minDeposit}</p>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <Button variant="outline" size="sm">
                    25%
                  </Button>
                  <Button variant="outline" size="sm">
                    50%
                  </Button>
                  <Button variant="outline" size="sm">
                    75%
                  </Button>
                  <Button variant="outline" size="sm">
                    Max
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Deposit Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deposit Amount</span>
                    <span>0.00 BTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated APY</span>
                    <span className="text-green-600">{vaultData.apy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network Fee</span>
                    <span>~0.0001 BTC</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total Required</span>
                    <span>0.0001 BTC</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1">Confirm Deposit</Button>
                <Link href="/pools">
                  <Button variant="outline">Cancel</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Vault Details Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="pools">Pool Allocation</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Vault Strategy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {vaultSlug === "btc-conservative"
                      ? "This conservative vault focuses primarily on BTC lending through Vesu protocol, with a small allocation to liquidity pools for diversification. Designed for users seeking steady returns with lower risk exposure."
                      : "This balanced vault combines different strategies to achieve optimal risk-adjusted returns. The allocation is dynamically managed to maintain BTC exposure while generating yields from multiple sources."}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <div className="font-medium">{vaultData.apy}</div>
                      <div className="text-xs text-muted-foreground">Current APY</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <Shield className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <div className="font-medium">{vaultSlug === "btc-conservative" ? "Low" : "Medium"}</div>
                      <div className="text-xs text-muted-foreground">Risk Level</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <Wallet className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <div className="font-medium">{vaultData.totalValue}</div>
                      <div className="text-xs text-muted-foreground">Total Value</div>
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
            </TabsContent>

            <TabsContent value="pools" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pool Allocation</CardTitle>
                  <CardDescription>
                    Your deposit will be distributed across these pools according to the current allocation strategy.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {vaultData.pools.map((pool, index) => (
                    <div key={index} className="space-y-3 p-4 rounded-lg border">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{pool.name}</h4>
                        <div className="flex gap-2">
                          <Badge variant="outline">{pool.apy} APY</Badge>
                          <Badge variant="secondary">{pool.allocation}%</Badge>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            pool.name.includes("Vesu") ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                          style={{ width: `${pool.allocation}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Wallet Balance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Available BTC</span>
                  <span className="font-medium">0.15 BTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">USD Value</span>
                  <span className="font-medium">$6,750</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vault Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Vault Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Current APY</span>
                  <span className="font-medium text-green-600">{vaultData.apy}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Value Locked</span>
                  <span className="font-medium">{vaultData.totalValue}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Active Pools</span>
                  <span className="font-medium">{vaultData.pools.length}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Min. Deposit</span>
                  <span className="font-medium">{vaultData.minDeposit}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Rebalanced</span>
                  <span className="font-medium">{vaultData.lastRebalanced}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Important Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>• Deposits are subject to network confirmation times</p>
              <p>• APY rates are variable and may change</p>
              <p>• Minimum deposit: {vaultData.minDeposit}</p>
              <p>• Funds can be withdrawn at any time</p>
              <p>• Network fees apply to all transactions</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
