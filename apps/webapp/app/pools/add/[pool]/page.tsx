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

// Mock data - en una aplicación real esto vendría de una API
const poolsData = {
  "ekubo-btc-usdc": {
    name: "Ekubo BTC/USDC",
    protocol: "Ekubo",
    apy: "4.8%",
    tvl: "$2.4M",
    risk: "Medio",
    tokens: ["BTC", "USDC"],
    description: "Pool de liquidez BTC/USDC en Ekubo DEX con rebalanceo automático",
  },
  "vesu-btc-lending": {
    name: "Vesu BTC Lending",
    protocol: "Vesu",
    apy: "5.8%",
    tvl: "$3.7M",
    risk: "Bajo",
    tokens: ["BTC"],
    description: "Pool de préstamos de BTC en Vesu Finance con garantías colateralizadas",
  },
  "ekubo-btc-eth": {
    name: "Ekubo BTC/ETH",
    protocol: "Ekubo",
    apy: "5.2%",
    tvl: "$1.8M",
    risk: "Medio",
    tokens: ["BTC", "ETH"],
    description: "Pool de liquidez BTC/ETH en Ekubo DEX para trading entre criptomonedas principales",
  },
  "vesu-btc-vault": {
    name: "Vesu BTC Vault",
    protocol: "Vesu",
    apy: "4.5%",
    tvl: "$5.2M",
    risk: "Bajo",
    tokens: ["BTC"],
    description: "Vault automatizada de BTC en Vesu Finance con estrategias optimizadas",
  },
  "ekubo-btc-usdt": {
    name: "Ekubo BTC/USDT",
    protocol: "Ekubo",
    apy: "4.6%",
    tvl: "$1.2M",
    risk: "Medio-Alto",
    tokens: ["BTC", "USDT"],
    description: "Pool de liquidez BTC/USDT en Ekubo DEX con alta volatilidad",
  },
  "ekubo-btc-dai": {
    name: "Ekubo BTC/DAI",
    protocol: "Ekubo",
    apy: "4.3%",
    tvl: "$0.9M",
    risk: "Medio",
    tokens: ["BTC", "DAI"],
    description: "Pool de liquidez BTC/DAI en Ekubo DEX con stablecoin descentralizada",
  },
}

const vaultsData = [
  {
    id: "conservative",
    name: "Conservative Vault",
    description: "Estrategia conservadora con bajo riesgo",
    currentValue: "0.845 BTC",
    apy: "6.8%",
    risk: "Bajo",
  },
  {
    id: "balanced",
    name: "Balanced Vault",
    description: "Estrategia equilibrada riesgo-rendimiento",
    currentValue: "1.245 BTC",
    apy: "9.2%",
    risk: "Medio",
  },
  {
    id: "aggressive",
    name: "Aggressive Vault",
    description: "Estrategia agresiva para máximo rendimiento",
    currentValue: "0.567 BTC",
    apy: "15.4%",
    risk: "Alto",
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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Pool no encontrado</h1>
          <Link href="/pools">
            <Button>Volver a Pools</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToVault = async () => {
    if (!selectedVault || !amount) return

    setIsLoading(true)

    // Simular llamada a API
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)

    // Redirigir al vault después de añadir
    router.push(`/pools/vault/${selectedVault}`)
  }

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "bajo":
        return "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300"
      case "medio":
        return "bg-amber-100 text-amber-800 dark:bg-amber-800/30 dark:text-amber-300"
      case "alto":
        return "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/pools">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Añadir Pool a Vault</h1>
          <p className="text-muted-foreground">Configura la asignación del pool en tu vault</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Pool Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Información del Pool
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
              Al añadir este pool a tu vault, se ejecutará automáticamente según la estrategia configurada. Puedes
              modificar la asignación en cualquier momento.
            </AlertDescription>
          </Alert>
        </div>

        {/* Configuration Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Configuración
              </CardTitle>
              <CardDescription>Selecciona el vault y configura la asignación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Vault Selection */}
              <div className="space-y-2">
                <Label htmlFor="vault">Seleccionar Vault</Label>
                <Select value={selectedVault} onValueChange={setSelectedVault}>
                  <SelectTrigger>
                    <SelectValue placeholder="Elige un vault" />
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
                <Label htmlFor="amount">Cantidad a Asignar</Label>
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
                  <Label htmlFor="allocation">Porcentaje de Asignación</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Porcentaje del vault que se asignará a este pool</p>
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
                  <Label>Vault Seleccionado</Label>
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
                            <span className="text-muted-foreground">Valor Actual:</span>
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
                    Cancelar
                  </Button>
                </Link>
                <Button onClick={handleAddToVault} disabled={!selectedVault || !amount || isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Añadiendo...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Añadir a Vault
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
