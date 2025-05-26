import Link from "next/link"
import { ArrowLeft, Bitcoin, Info, TrendingUp, Shield, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Header } from "@/components/ui/header"

interface VaultData {
  name: string
  description: string
  apy: string
  totalValue: string
  riskLevel: string
  pools: Array<{
    name: string
    allocation: number
    apy: string
  }>
}

// Mock vault data
const getVaultData = (vaultSlug: string): VaultData => {
  const vaults: Record<string, VaultData> = {
    "btc-conservative": {
      name: "BTC Conservative",
      description: "Conservative strategy with low risk and stable returns",
      apy: "5.8%",
      totalValue: "$2.4M",
      riskLevel: "Low",
      pools: [
        { name: "Ekubo DEX", allocation: 70, apy: "6.2%" },
        { name: "Vesu Lending", allocation: 30, apy: "4.8%" },
      ],
    },
    "btc-aggressive": {
      name: "BTC Aggressive",
      description: "Aggressive strategy with higher risk and potential for high returns",
      apy: "12.4%",
      totalValue: "$1.8M",
      riskLevel: "High",
      pools: [
        { name: "Ekubo DEX", allocation: 40, apy: "6.2%" },
        { name: "Vesu Lending", allocation: 35, apy: "4.8%" },
        { name: "Yield Farming", allocation: 25, apy: "18.5%" },
      ],
    },
    "btc-balanced": {
      name: "BTC Balanced",
      description: "Balanced strategy between risk and return",
      apy: "8.7%",
      totalValue: "$3.1M",
      riskLevel: "Medium",
      pools: [
        { name: "Ekubo DEX", allocation: 50, apy: "6.2%" },
        { name: "Vesu Lending", allocation: 35, apy: "4.8%" },
        { name: "Staking Pool", allocation: 15, apy: "12.1%" },
      ],
    },
  }

  return vaults[vaultSlug] || vaults["btc-conservative"]
}

type Props = {
  params: Promise<{ vault: string }>
}

export default async function VaultDepositPage({
  params,
}: Props) {
  const resolvedParams = await params
  const vaultData = getVaultData(resolvedParams.vault)

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  const getPoolColor = (poolName: string) => {
    if (poolName.includes("Vesu")) return "bg-emerald-500"
    if (poolName.includes("Ekubo")) return "bg-amber-500"
    if (poolName.includes("Yield")) return "bg-purple-500"
    if (poolName.includes("Staking")) return "bg-blue-500"
    return "bg-gray-500"
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header variant="dashboard" />
      <main className="flex-1 p-4 md:p-8 pt-6">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center mb-6">
            <Link href="/pools">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Pools
              </Button>
            </Link>
          </div>

          <div className="space-y-6">
            {/* Vault Information */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{vaultData.name}</CardTitle>
                    <CardDescription className="mt-2">{vaultData.description}</CardDescription>
                  </div>
                  <Badge className={getRiskColor(vaultData.riskLevel)}>{vaultData.riskLevel} Risk</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Average APY</p>
                    <p className="text-xl font-bold text-green-600">{vaultData.apy}</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg">
                    <Shield className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Total TVL</p>
                    <p className="text-xl font-bold text-blue-600">{vaultData.totalValue}</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-lg col-span-2 md:col-span-1">
                    <Zap className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Active Pools</p>
                    <p className="text-xl font-bold text-purple-600">{vaultData.pools.length}</p>
                  </div>
                </div>

                {/* Pool Allocation */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Pool Allocation</h4>
                  {vaultData.pools.map((pool) => (
                    <div key={pool.name} className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getPoolColor(pool.name)}`} />
                          <span className="font-medium">{pool.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {pool.apy}
                          </Badge>
                        </div>
                        <span className="font-semibold">{pool.allocation}%</span>
                      </div>
                      <Progress value={pool.allocation} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Deposit Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Deposit to {vaultData.name}</CardTitle>
                <CardDescription>
                  Deposit BTC into this vault to start generating returns automatically.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount to deposit</Label>
                  <div className="relative">
                    <Input id="amount" placeholder="0.0" type="number" step="0.001" min="0" className="pr-16" />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <Bitcoin className="h-4 w-4 text-amber-500" />
                      <span className="ml-1 text-sm font-medium">BTC</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Available balance: 2.45 BTC</span>
                    <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                      Use maximum
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Deposit Information</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Your funds will be automatically distributed according to the vault&apos;s strategy</li>
                        <li>• Returns are automatically reinvested</li>
                        <li>• You can withdraw your funds at any time</li>
                        <li>• No entry fees, only transaction gas</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estimated APY</span>
                    <span className="font-medium text-green-600">{vaultData.apy}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estimated monthly returns</span>
                    <span className="font-medium">~0.048 BTC</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estimated gas</span>
                    <span className="font-medium">~0.0001 ETH</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Management fee</span>
                    <span className="font-medium">0.5% annually</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                <Button className="w-full" size="lg">
                  Deposit to {vaultData.name}
                </Button>
                <div className="flex gap-2 w-full">
                  <Link href="/pools" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </Link>
                  <Link href={`/pools/vault/${resolvedParams.vault}`} className="flex-1">
                    <Button variant="ghost" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
