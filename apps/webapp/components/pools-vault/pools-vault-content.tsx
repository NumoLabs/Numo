"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useVesuPoolsData } from "@/hooks/use-vault-queries"
import { ArrowLeft, ArrowRight, Copy, ExternalLink, Loader2, RefreshCcw, Search, TrendingUp } from "lucide-react"
import Link from "next/link"
import type { ProcessedAsset, VesuPool } from "@/types/VesuPools"
import { VesuAddToPoolForm } from "@/components/vesu/vesu-add-to-pool-form"

// Mapeo de direcciones conocidas de Vesu V2 pools
const VESU_V2_POOL_ADDRESSES = new Set([
  "0x451fe483d5921a2919ddd81d0de6696669bccdacd859f72a4fba7656b97c3b5", // Prime
  "0x3976cac265a12609934089004df458ea29c776d77da423c96dc761d09d24124", // Re7 USDC Core
  "0x2eef0c13b10b487ea5916b54c0a7f98ec43fb3048f60fdeedaf5b08f6f88aaf", // Re7 USDC Prime
  "0x5c03e7e0ccfe79c634782388eb1e6ed4e8e2a013ab0fcc055140805e46261bd", // Re7 USDC Frontier
  "0x3a8416bf20d036df5b1cf3447630a2e1cb04685f6b0c3a70ed7fb1473548ecf", // Re7 xBTC
  "0x73702fce24aba36da1eac539bd4bae62d4d6a76747b7cdd3e016da754d7a135", // Re7 USDC Stable Core
].map(addr => addr.toLowerCase()))

// Nombres conocidos de pools V2 (para filtrar por nombre si la dirección no coincide)
const VESU_V2_POOL_NAMES = new Set([
  "prime",
  "genesis",
  "re7",
  "usdc",
  "xbtc",
  "stable",
  "core",
  "frontier",
].map(name => name.toLowerCase()))

type VesuV2Asset = ProcessedAsset & { totalApy: number }

type VesuV2Pool = Omit<VesuPool, "assets"> & {
  displayName: string
  assets: VesuV2Asset[]
}

function formatPercentage(value: number | undefined) {
  if (!value || Number.isNaN(value)) {
    return "0.00%"
  }
  return `${value.toFixed(2)}%`
}

function formatUtilization(value: number | undefined) {
  if (value === undefined || Number.isNaN(value)) {
    return "—"
  }
  return `${value.toFixed(2)}%`
}

function shortAddress(address: string | undefined) {
  if (!address) {
    return "—"
  }
  const normalized = address.toLowerCase()
  return `${normalized.slice(0, 6)}...${normalized.slice(-6)}`
}

interface CopyButtonProps {
  value: string
  "aria-label": string
}

function CopyButton({ value, "aria-label": ariaLabel }: CopyButtonProps) {
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(value)
        toast({ title: "Dirección copiada", description: shortAddress(value) })
      }
    } catch (error) {
      console.error("Error copying to clipboard", error)
      toast({ title: "No se pudo copiar", variant: "destructive" })
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleCopy} aria-label={ariaLabel}>
      <Copy className="h-4 w-4" />
    </Button>
  )
}

export function PoolsVaultContent() {
  const [selectedPoolAddress, setSelectedPoolAddress] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  // const { toast } = useToast()

  const { data, isLoading, isError, refetch } = useVesuPoolsData()

  const vesuPools = useMemo<VesuV2Pool[]>(() => {
    if (!Array.isArray(data)) {
      console.log('[PoolsVaultContent] No data or data is not an array:', data)
      return []
    }

    console.log('[PoolsVaultContent] Total pools from API:', data.length)
    console.log('[PoolsVaultContent] Sample pools:', data.slice(0, 3).map(p => ({
      id: p.id,
      name: p.name,
      address: p.address,
      assetsCount: p.assets?.length || 0
    })))

    // Mostrar todos los pools de Vesu que tengan activos disponibles
    // Priorizar pools V2 conocidos, pero mostrar todos para que el usuario pueda elegir
    const filtered = data.filter((pool): pool is VesuPool => {
      if (!pool || typeof pool !== 'object') {
        return false
      }

      // Solo incluir pools que tengan al menos un activo
      if (!Array.isArray(pool.assets) || pool.assets.length === 0) {
        return false
      }

      // Priorizar pools V2 conocidos por dirección
      if (typeof pool.address === "string") {
        const lowerAddress = pool.address.toLowerCase()
        if (VESU_V2_POOL_ADDRESSES.has(lowerAddress)) {
          return true
        }
      }

      // Incluir pools V2 por nombre (Prime, Genesis, Re7, etc.)
      if (typeof pool.name === "string") {
        const lowerName = pool.name.toLowerCase()
        const keywords = Array.from(VESU_V2_POOL_NAMES)
        if (keywords.some(keyword => lowerName.includes(keyword))) {
          return true
        }
        // Incluir pools que parezcan ser V2
        if (lowerName.includes('v2') || lowerName.includes('prime') || lowerName.includes('genesis')) {
          return true
        }
      }

      // Por ahora, mostrar todos los pools con activos para que el usuario pueda verlos
      // El usuario puede filtrar después si necesita
      return true
    })

    console.log('[PoolsVaultContent] Filtered V2 pools:', filtered.length)
    console.log('[PoolsVaultContent] Filtered pool names:', filtered.map(p => p.name))

    return filtered
      .map((pool) => {
        const processedAssets: VesuV2Asset[] = (pool.assets || [])
          .map((asset) => {
            const baseApy = Number.isFinite(asset.apy) ? asset.apy : 0
            const rewardApy = Number.isFinite(asset.defiSpringApy) ? asset.defiSpringApy : 0
            const totalApy = Number.parseFloat((baseApy + rewardApy).toFixed(6))

            const enrichedAsset: VesuV2Asset = {
              ...asset,
              totalApy,
            }

            return enrichedAsset
          })
          .sort((a, b) => (b.totalApy ?? 0) - (a.totalApy ?? 0))

        // Verificar si el pool tiene WBTC
        const hasWBTC = processedAssets.some(asset => 
          asset.symbol?.toUpperCase().includes('WBTC') || 
          asset.symbol?.toUpperCase() === 'WBTC'
        )

        // Determinar si es un pool V2 basado en la dirección o nombre
        const isV2Pool = typeof pool.address === "string" && 
          (VESU_V2_POOL_ADDRESSES.has(pool.address.toLowerCase()) ||
           (typeof pool.name === "string" && 
            Array.from(VESU_V2_POOL_NAMES).some(keyword => 
              pool.name.toLowerCase().includes(keyword)
            )))

        const processedPool: VesuV2Pool = {
          ...pool,
          displayName: pool.name, // Usar el nombre directamente de la API
          assets: processedAssets,
          version: isV2Pool ? 'v2' : undefined, // Marcar pools V2 para el formulario
        } as VesuV2Pool & { version?: string }

        return { pool: processedPool, hasWBTC }
      })
      .sort((a, b) => {
        // Priorizar pools con WBTC
        if (a.hasWBTC && !b.hasWBTC) return -1
        if (!a.hasWBTC && b.hasWBTC) return 1
        // Luego ordenar por APY total
        return (b.pool.assets[0]?.totalApy ?? 0) - (a.pool.assets[0]?.totalApy ?? 0)
      })
      .map(item => item.pool)
  }, [data])

  const filteredPools = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) {
      return vesuPools
    }

    return vesuPools.filter((pool) => {
      const matchesPool =
        pool.displayName.toLowerCase().includes(term) ||
        pool.address.toLowerCase().includes(term) ||
        pool.id.toLowerCase().includes(term)

      const matchesAssets = pool.assets.some((asset) =>
        asset.symbol?.toLowerCase().includes(term) ||
        asset.address?.toLowerCase().includes(term) ||
        asset.vTokenAddress?.toLowerCase().includes(term),
      )

      return matchesPool || matchesAssets
    })
  }, [searchTerm, vesuPools])

  const selectedPool = useMemo(() => {
    if (!selectedPoolAddress) {
      return undefined
    }

    return vesuPools.find((pool) => pool.address.toLowerCase() === selectedPoolAddress.toLowerCase())
  }, [selectedPoolAddress, vesuPools])

  const renderLoadingState = () => (
    <div className="flex h-48 w-full items-center justify-center rounded-lg border border-dashed border-border/60">
      <div className="flex items-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Obteniendo pools de Vesu…</span>
      </div>
    </div>
  )

  const renderErrorState = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-destructive">No se pudo cargar la información</CardTitle>
        <CardDescription>
          Hubo un problema al consultar los datos en tiempo real de Vesu. Intenta refrescar la vista.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" onClick={() => refetch()} className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          Reintentar
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-bitcoin-orange to-bitcoin-gold bg-clip-text text-transparent">
          Vesu V2 Pools
        </h1>
        <p className="text-muted-foreground">
          Datos en vivo de los pools verificados de Vesu V2 en Starknet Mainnet. Los rendimientos se calculan directamente a partir de la API pública de Vesu.
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por nombre de pool, token o dirección"
            className="pl-10"
            aria-label="Buscar pools de Vesu"
          />
        </div>
        <Button variant="outline" className="gap-2" onClick={() => refetch()}>
          <RefreshCcw className="h-4 w-4" />
          Actualizar datos
        </Button>
      </div>

      {isLoading && vesuPools.length === 0 ? renderLoadingState() : null}
      {isError ? renderErrorState() : null}

      {!selectedPool ? (
        <div className="space-y-6">
          {!isLoading && filteredPools.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No se encontraron pools</CardTitle>
                <CardDescription>
                  Ajusta el término de búsqueda o refresca los datos para ver los pools disponibles.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : null}

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredPools.map((pool) => {
              const topAsset = pool.assets[0]
              const hasWBTC = pool.assets.some(asset => 
                asset.symbol?.toUpperCase().includes('WBTC') || 
                asset.symbol?.toUpperCase() === 'WBTC'
              )
              const wbtcAsset = pool.assets.find(asset => 
                asset.symbol?.toUpperCase().includes('WBTC') || 
                asset.symbol?.toUpperCase() === 'WBTC'
              )

              return (
                <Card
                  key={`pool-${pool.id}-${pool.address}`}
                  className={`group border transition-all duration-300 hover:shadow-lg ${
                    hasWBTC 
                      ? 'border-bitcoin-gold/40 bg-gradient-to-br from-bitcoin-gold/10 via-black/20 to-bitcoin-orange/5 hover:border-bitcoin-gold/60' 
                      : 'border-bitcoin-orange/20 bg-gradient-to-br from-black/40 via-black/20 to-bitcoin-orange/5 hover:border-bitcoin-orange/60'
                  }`}
                >
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg text-bitcoin-orange">{pool.displayName}</CardTitle>
                          {hasWBTC && (
                            <Badge className="bg-bitcoin-gold/30 text-bitcoin-gold border-bitcoin-gold/50 text-xs">
                              WBTC
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="font-mono text-xs">{shortAddress(pool.address)}</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-bitcoin-gold/20 text-bitcoin-gold">
                        {pool.assets.length} assets
                      </Badge>
                    </div>
                    {hasWBTC && wbtcAsset ? (
                      <div className="rounded-lg border-2 border-bitcoin-gold/40 bg-gradient-to-r from-bitcoin-gold/20 to-bitcoin-orange/10 p-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="flex items-center gap-2 font-semibold text-bitcoin-gold">
                            <TrendingUp className="h-4 w-4" />
                            WBTC APY Total
                          </span>
                          <span className="font-bold text-lg text-bitcoin-gold">
                            {formatPercentage(wbtcAsset.totalApy)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="block text-muted-foreground/80">Supply APY</span>
                            <span className="font-medium text-foreground">{formatPercentage(wbtcAsset.apy)}</span>
                          </div>
                          <div>
                            <span className="block text-muted-foreground/80">Recompensas</span>
                            <span className="font-medium text-foreground">{formatPercentage(wbtcAsset.defiSpringApy)}</span>
                          </div>
                          <div>
                            <span className="block text-muted-foreground/80">Utilización</span>
                            <span className="font-medium text-foreground">{formatUtilization(wbtcAsset.currentUtilization)}</span>
                          </div>
                        </div>
                      </div>
                    ) : topAsset ? (
                      <div className="rounded-lg border border-bitcoin-gold/30 bg-gradient-to-r from-bitcoin-gold/10 to-bitcoin-orange/10 p-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-muted-foreground">
                            <TrendingUp className="h-4 w-4 text-bitcoin-gold" />
                            Rendimiento total ({topAsset.symbol})
                          </span>
                          <span className="font-semibold text-bitcoin-gold">
                            {formatPercentage(topAsset.totalApy)}
                          </span>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                          <div>
                            <span className="block text-muted-foreground/80">Supply APY</span>
                            <span className="font-medium text-foreground">{formatPercentage(topAsset.apy)}</span>
                          </div>
                          <div>
                            <span className="block text-muted-foreground/80">Recompensas</span>
                            <span className="font-medium text-foreground">{formatPercentage(topAsset.defiSpringApy)}</span>
                          </div>
                          <div>
                            <span className="block text-muted-foreground/80">Utilización</span>
                            <span className="font-medium text-foreground">{formatUtilization(topAsset.currentUtilization)}</span>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {pool.assets.map((asset) => {
                        const isWBTC = asset.symbol?.toUpperCase().includes('WBTC') || asset.symbol?.toUpperCase() === 'WBTC'
                        return (
                          <Badge 
                            key={`${pool.address}-${asset.symbol}`} 
                            variant={isWBTC ? "default" : "secondary"} 
                            className={isWBTC 
                              ? "bg-bitcoin-gold/30 text-bitcoin-gold border-bitcoin-gold/50 text-xs uppercase tracking-wide font-semibold" 
                              : "bg-black/40 text-xs uppercase tracking-wide"
                            }
                          >
                            {asset.symbol}
                            {isWBTC && " ⭐"}
                          </Badge>
                        )
                      })}
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-sm"
                      onClick={() => setSelectedPoolAddress(pool.address)}
                    >
                      Ver detalles
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ) : null}

      {selectedPool ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="gap-2" onClick={() => setSelectedPoolAddress(null)}>
              <ArrowLeft className="h-4 w-4" />
              Volver a todos los pools
            </Button>
            <Badge variant="outline" className="bg-bitcoin-gold/10 text-bitcoin-gold">
              {selectedPool.displayName}
            </Badge>
            <Badge variant="outline" className="bg-bitcoin-orange/10 text-bitcoin-orange">
              {shortAddress(selectedPool.address)}
            </Badge>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2 border border-bitcoin-orange/30">
              <CardHeader>
                <CardTitle className="text-bitcoin-orange">Activos y rendimientos</CardTitle>
                <CardDescription>
                  APY compuesto (supply + recompensas) calculado en base a los datos públicos de Vesu.
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="pb-3 pr-4">Activo</th>
                      <th className="pb-3 pr-4">Supply APY</th>
                      <th className="pb-3 pr-4">Recompensas</th>
                      <th className="pb-3 pr-4">APY total</th>
                      <th className="pb-3 pr-4">Utilización</th>
                      <th className="pb-3 pr-4">Dirección</th>
                      <th className="pb-3 pr-4">vToken</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {selectedPool.assets.map((asset) => (
                      <tr key={`${selectedPool.address}-${asset.symbol}`} className="align-top">
                        <td className="py-3 pr-4">
                          <div className="flex flex-col">
                            <span className="font-medium">{asset.name || asset.symbol}</span>
                            <span className="text-xs text-muted-foreground">{asset.symbol}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 font-mono text-sm">{formatPercentage(asset.apy)}</td>
                        <td className="py-3 pr-4 font-mono text-sm">{formatPercentage(asset.defiSpringApy)}</td>
                        <td className="py-3 pr-4 font-mono text-sm text-bitcoin-gold">{formatPercentage(asset.totalApy)}</td>
                        <td className="py-3 pr-4 font-mono text-sm">{formatUtilization(asset.currentUtilization)}</td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-xs">{shortAddress(asset.address)}</span>
                            {asset.address ? (
                              <>
                                <CopyButton value={asset.address} aria-label={`Copiar dirección del activo ${asset.symbol}`} />
                                <Button variant="ghost" size="icon" asChild aria-label={`Ver ${asset.symbol} en Starkscan`}>
                                  <Link href={`https://starkscan.co/contract/${asset.address}`} target="_blank" rel="noreferrer">
                                    <ExternalLink className="h-4 w-4" />
                                  </Link>
                                </Button>
                              </>
                            ) : null}
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-xs">{shortAddress(asset.vTokenAddress)}</span>
                            {asset.vTokenAddress ? (
                              <CopyButton value={asset.vTokenAddress} aria-label={`Copiar vToken de ${asset.symbol}`} />
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <VesuAddToPoolForm
                pool={selectedPool}
                onAddToPool={(amount, assetAddress) => {
                  console.log('Deposit initiated:', { amount, assetAddress, pool: selectedPool.displayName })
                  // El formulario maneja el depósito internamente
                }}
                isLoading={false}
              />

              <Card className="border border-bitcoin-orange/30">
                <CardHeader>
                  <CardTitle>Información del pool</CardTitle>
                  <CardDescription>Detalles técnicos del pool seleccionado.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Pool ID</span>
                    <span className="font-mono text-xs">{selectedPool.id}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">Dirección</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs">{shortAddress(selectedPool.address)}</span>
                      <CopyButton value={selectedPool.address} aria-label="Copiar dirección del pool" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground">Activos disponibles</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedPool.assets.map((asset) => (
                        <Badge key={`${selectedPool.address}-${asset.symbol}-badge`} variant="secondary" className="bg-black/40 text-xs uppercase">
                          {asset.symbol}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground">Mejor APY total</span>
                    <div className="rounded-lg border border-bitcoin-gold/30 bg-gradient-to-r from-bitcoin-gold/10 to-bitcoin-orange/10 p-3">
                      {selectedPool.assets[0] ? (
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">{selectedPool.assets[0].symbol}</span>
                          <span className="font-mono text-sm text-bitcoin-gold">{formatPercentage(selectedPool.assets[0].totalApy)}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Sin datos de rendimiento</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-bitcoin-gold/30">
                <CardHeader>
                  <CardTitle>Recursos externos</CardTitle>
                  <CardDescription>Consulta la información oficial del contrato en el explorador.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <Button variant="outline" className="w-full justify-between" asChild>
                    <Link href={`https://starkscan.co/contract/${selectedPool.address}`} target="_blank" rel="noreferrer">
                      Ver pool en Starkscan
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link href="https://vesu.xyz" target="_blank" rel="noreferrer">
                      Abrir Vesu App
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
} 