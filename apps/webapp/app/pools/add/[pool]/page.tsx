"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Plus, TrendingUp, Info } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sidebar } from "@/components/dashboard/layout/sidebar"
import { TopNavigation } from "@/components/dashboard/layout/top-navigation"
import { Footer } from "@/components/ui/footer"

// Mock data - in a real application this would come from an API
const poolsData = {
  "ekubo-btc-usdc": {
    name: "Ekubo BTC/USDC",
    protocol: "Ekubo",
    apy: "4.8%",
    tvl: "$2.4M",
    risk: "Medium",
    tokens: ["BTC", "USDC"],
    description: "BTC/USDC liquidity pool on Ekubo DEX with automatic rebalancing",
  },
  "vesu-btc-lending": {
    name: "Vesu BTC Lending",
    protocol: "Vesu",
    apy: "5.8%",
    tvl: "$3.7M",
    risk: "Low",
    tokens: ["BTC"],
    description: "BTC lending pool on Vesu Finance with collateralized guarantees",
  },
  "ekubo-btc-eth": {
    name: "Ekubo BTC/ETH",
    protocol: "Ekubo",
    apy: "5.2%",
    tvl: "$1.8M",
    risk: "Medium",
    tokens: ["BTC", "ETH"],
    description: "BTC/ETH liquidity pool on Ekubo DEX for trading between major cryptocurrencies",
  },
  "vesu-btc-vault": {
    name: "Vesu BTC Vault",
    protocol: "Vesu",
    apy: "4.5%",
    tvl: "$5.2M",
    risk: "Low",
    tokens: ["BTC"],
    description: "Automated BTC vault on Vesu Finance with optimized strategies",
  },
  "ekubo-btc-usdt": {
    name: "Ekubo BTC/USDT",
    protocol: "Ekubo",
    apy: "4.6%",
    tvl: "$1.2M",
    risk: "Medium-High",
    tokens: ["BTC", "USDT"],
    description: "BTC/USDT liquidity pool on Ekubo DEX with high volatility",
  },
  "ekubo-btc-dai": {
    name: "Ekubo BTC/DAI",
    protocol: "Ekubo",
    apy: "4.3%",
    tvl: "$0.9M",
    risk: "Medium",
    tokens: ["BTC", "DAI"],
    description: "BTC/DAI liquidity pool on Ekubo DEX with decentralized stablecoin",
  },
}

const vaultsData = [
  {
    id: "conservative",
    name: "Conservative Vault",
    description: "Conservative strategy with low risk",
    currentValue: "0.845 BTC",
    apy: "6.8%",
    risk: "Low",
  },
  {
    id: "balanced",
    name: "Balanced Vault",
    description: "Balanced risk-return strategy",
    currentValue: "1.245 BTC",
    apy: "9.2%",
    risk: "Medium",
  },
  {
    id: "aggressive",
    name: "Aggressive Vault",
    description: "Aggressive strategy for maximum returns",
    currentValue: "0.567 BTC",
    apy: "15.4%",
    risk: "High",
  },
]

export default function AddPoolToVaultPage() {
  const params = useParams()
  const router = useRouter()
  const poolSlug = params.pool as string
  const [selectedVault, setSelectedVault] = useState("")
  const [amount, setAmount] = useState("")
  const [allocation, setAllocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const poolData = poolsData[poolSlug as keyof typeof poolsData]

  if (!poolData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <Sidebar sidebarOpen={false} setSidebarOpen={() => {}} />
        <div className="lg:pl-72">
          <TopNavigation setSidebarOpen={() => {}} />
          <main className="py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold mb-4">Pool not found</h1>
                <Link href="/pools">
                  <Button>Back to Pools</Button>
                </Link>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    )
  }

  const handleAddToVault = async () => {
    if (!selectedVault || !amount) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)

    // Redirect to vault after adding
    router.push(`/pools/vault/${selectedVault}`)
  }

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300"
      case "medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-800/30 dark:text-amber-300"
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Sidebar sidebarOpen={false} setSidebarOpen={() => {}} />

      {/* Main content */}
      <div className="lg:pl-72">
        <TopNavigation setSidebarOpen={() => {}} />

        {/* Page content */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-center gap-4">
                <Link href="/pools">
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold">Add Pool to Vault</h1>
                  <p className="text-muted-foreground">Configure the pool allocation in your vault</p>
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                {/* Pool Information */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Pool Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold">{poolData.name}</h3>
                        <p className="text-muted-foreground">{poolData.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-muted-foreground">APY</Label>
                          <p className="text-lg font-semibold text-green-600">{poolData.apy}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">TVL</Label>
                          <p className="text-lg font-semibold">{poolData.tvl}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{poolData.protocol}</Badge>
                        <Badge className={getRiskColor(poolData.risk)}>{poolData.risk}</Badge>
                        {poolData.tokens.map((token) => (
                          <Badge key={token} variant="outline">
                            {token}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      When adding this pool to your vault, it will automatically execute according to the configured
                      strategy. You can modify the allocation at any time.
                    </AlertDescription>
                  </Alert>
                </div>

                {/* Configuration Form */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Configuration
                      </CardTitle>
                      <CardDescription>Select the vault and configure the allocation</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Vault Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="vault">Select Vault</Label>
                        <Select value={selectedVault} onValueChange={setSelectedVault}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a vault" />
                          </SelectTrigger>
                          <SelectContent>
                            {vaultsData.map((vault) => (
                              <SelectItem key={vault.id} value={vault.id}>
                                <div className="flex items-center justify-between w-full">
                                  <div>
                                    <p className="font-medium">{vault.name}</p>
                                    <p className="text-sm text-muted-foreground">{vault.description}</p>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Amount Input */}
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount to Allocate</Label>
                        <div className="relative">
                          <Input
                            id="amount"
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="pr-16"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            BTC
                          </div>
                        </div>
                      </div>

                      {/* Allocation Percentage */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="allocation">Allocation Percentage</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Percentage of the vault that will be allocated to this pool</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="relative">
                          <Input
                            id="allocation"
                            type="number"
                            placeholder="0"
                            value={allocation}
                            onChange={(e) => setAllocation(e.target.value)}
                            min="0"
                            max="100"
                            className="pr-8"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            %
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Selected Vault Info */}
                      {selectedVault && (
                        <div className="space-y-3">
                          <Label>Selected Vault</Label>
                          {(() => {
                            const vault = vaultsData.find((v) => v.id === selectedVault)
                            return vault ? (
                              <div className="p-4 border rounded-lg bg-muted/50">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium">{vault.name}</h4>
                                  <Badge className={getRiskColor(vault.risk)}>{vault.risk}</Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Current Value:</span>
                                    <p className="font-medium">{vault.currentValue}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">APY:</span>
                                    <p className="font-medium text-green-600">{vault.apy}</p>
                                  </div>
                                </div>
                              </div>
                            ) : null
                          })()}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4">
                        <Link href="/pools" className="flex-1">
                          <Button variant="outline" className="w-full">
                            Cancel
                          </Button>
                        </Link>
                        <Button
                          onClick={handleAddToVault}
                          disabled={!selectedVault || !amount || isLoading}
                          className="flex-1"
                        >
                          {isLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-2" />
                              Add to Vault
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
