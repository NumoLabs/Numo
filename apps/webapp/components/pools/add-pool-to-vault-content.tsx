"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Plus, TrendingUp, Info, Loader2 } from "lucide-react"
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
import { useVesuPoolsData } from "@/hooks/use-vault-queries"
import { fetchTopPools } from "@/app/api/ekuboApi"
import type { VesuPool } from "@/types/VesuPools"
import type { EkuboPoolsDisplay } from "@/types/EkuboPoolsDisplay"

interface PoolData {
  id: string
  name: string
  protocol: string
  apy: string
  tvl: string
  risk: string
  tokens: string[]
  description: string
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

export function AddPoolToVaultContent() {
  const params = useParams()
  const router = useRouter()
  const poolSlug = params.pool as string
  const [selectedVault, setSelectedVault] = useState("")
  const [amount, setAmount] = useState("")
  const [allocation, setAllocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [ekuboPools, setEkuboPools] = useState<EkuboPoolsDisplay[]>([])
  const [loadingPools, setLoadingPools] = useState(true)
  
  const { data: vesuPools, isLoading: isLoadingVesu } = useVesuPoolsData()

  // Fetch Ekubo pools
  useEffect(() => {
    const loadEkuboPools = async () => {
      try {
        setLoadingPools(true)
        const pools = await fetchTopPools()
        setEkuboPools(pools)
      } catch (error) {
        console.error('Error loading Ekubo pools:', error)
        setEkuboPools([])
      } finally {
        setLoadingPools(false)
      }
    }
    loadEkuboPools()
  }, [])

  // Combine and transform pools data
  const allPools = useMemo<PoolData[]>(() => {
    const pools: PoolData[] = []

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
          tokens
        })
      })
    }

    // Add Ekubo pools
    ekuboPools.forEach((p: EkuboPoolsDisplay) => {
      const token0Symbol = p.token0?.symbol || 'Unknown'
      const token1Symbol = p.token1?.symbol || 'Unknown'
      const apy = p.pool?.apy ? `${(p.pool.apy * 100).toFixed(2)}%` : "N/A"
      const tvl = p.totalTvl ? `$${(p.totalTvl / 1e6).toFixed(1)}M` : "N/A"

      pools.push({
        id: `ekubo-${p.pool?.key_hash || `${token0Symbol}-${token1Symbol}`}`,
        name: `Ekubo ${token0Symbol}/${token1Symbol}`,
        description: `${token0Symbol}/${token1Symbol} liquidity pool on Ekubo DEX`,
        apy,
        tvl,
        protocol: "Ekubo",
        risk: "Medium",
        tokens: [token0Symbol, token1Symbol]
      })
    })

    return pools
  }, [vesuPools, ekuboPools])

  // Find the requested pool
  const poolData = useMemo(() => {
    return allPools.find(p => p.id === poolSlug || p.id.endsWith(poolSlug))
  }, [allPools, poolSlug])

  if (loadingPools || isLoadingVesu) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading pool data...</p>
        </div>
      </div>
    )
  }

  if (!poolData) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Pool not found</h1>
        <Link href="/pools">
          <Button>Back to Pools</Button>
        </Link>
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
              When adding this pool to your vault, it will automatically execute according to the configured strategy.
              You can modify the allocation at any time.
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
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">BTC</div>
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
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</div>
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
                <Button onClick={handleAddToVault} disabled={!selectedVault || !amount || isLoading} className="flex-1">
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
  )
}

// Exportación por defecto
export default AddPoolToVaultContent
