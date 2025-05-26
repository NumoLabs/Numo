"use client"

import type React from "react"

import Link from "next/link"
import { ArrowLeft, Info, Trash } from "lucide-react"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Header } from "@/components/ui/header"
import { PoolSelector } from "@/components/pools/pool-selector"
import { useToast } from "@/hooks/use-toast"

const initialPools = [
  { id: "1", name: "Vesu BTC Lending", allocation: 50, apy: 5.8 },
  { id: "2", name: "Ekubo BTC/USDC", allocation: 30, apy: 4.8 },
  { id: "3", name: "Ekubo BTC/ETH", allocation: 20, apy: 5.2 },
]

const recommendedStrategies = [
  {
    name: "Estrategia Conservadora",
    description: "70% Vesu BTC Lending, 30% Vesu BTC Vault",
    pools: [
      { id: "1", name: "Vesu BTC Lending", allocation: 70, apy: 5.8 },
      { id: "4", name: "Vesu BTC Vault", allocation: 30, apy: 6.0 },
    ],
  },
  {
    name: "Estrategia Balanceada",
    description: "50% Vesu BTC Lending, 30% Ekubo BTC/USDC, 20% Ekubo BTC/ETH",
    pools: [
      { id: "1", name: "Vesu BTC Lending", allocation: 50, apy: 5.8 },
      { id: "2", name: "Ekubo BTC/USDC", allocation: 30, apy: 4.8 },
      { id: "3", name: "Ekubo BTC/ETH", allocation: 20, apy: 5.2 },
    ],
  },
  {
    name: "Estrategia Agresiva",
    description: "30% Vesu BTC Lending, 40% Ekubo BTC/ETH, 30% Ekubo BTC/USDT",
    pools: [
      { id: "1", name: "Vesu BTC Lending", allocation: 30, apy: 5.8 },
      { id: "3", name: "Ekubo BTC/ETH", allocation: 40, apy: 5.2 },
      { id: "5", name: "Ekubo BTC/USDT", allocation: 30, apy: 5.0 },
    ],
  },
]

export default function CreateVaultPage() {
  const [vaultName, setVaultName] = useState("")
  const [vaultDescription, setVaultDescription] = useState("")
  const [pools, setPools] = useState(initialPools)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; allocation?: string }>({})
  const { toast } = useToast()

  const totalAllocation = pools.reduce((sum, pool) => sum + pool.allocation, 0)
  const estimatedAPY = pools.reduce((sum, pool) => sum + (pool.apy * pool.allocation) / 100, 0)

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // Validate total allocation on pool changes
    if (totalAllocation !== 100) {
      setErrors((prev) => ({ ...prev, allocation: "Total allocation must be 100%" }))
    } else {
      setErrors((prev) => {
        const { allocation, ...rest } = prev
        console.log(allocation);
        return rest
      })
    }
  }, [pools, totalAllocation])

  const handleVaultNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVaultName(e.target.value)
    setErrors((prev) => ({ ...prev, name: e.target.value ? undefined : "Vault name is required" }))
  }

  const handleVaultDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVaultDescription(e.target.value)
  }

  const handleAllocationChange = (id: string, allocation: number) => {
    setPools((prevPools) => {
      const otherPools = prevPools.filter((pool) => pool.id !== id)
      const totalOtherAllocation = otherPools.reduce((sum, pool) => sum + pool.allocation, 0)
      const remainingAllocation = 100 - allocation

      if (otherPools.length === 0) {
        return prevPools.map((pool) => (pool.id === id ? { ...pool, allocation } : pool))
      }

      const adjustedPools = otherPools.map((pool) => {
        const newAllocation =
          totalOtherAllocation === 0
            ? remainingAllocation / otherPools.length
            : (pool.allocation / totalOtherAllocation) * remainingAllocation
        return { ...pool, allocation: Math.max(0, Math.min(100, newAllocation)) }
      })

      const updatedPool = prevPools.find((pool) => pool.id === id)

      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      return [...adjustedPools, { ...updatedPool!, allocation }].sort((a, b) => {
        const indexA = prevPools.findIndex((p) => p.id === a.id)
        const indexB = prevPools.findIndex((p) => p.id === b.id)
        return indexA - indexB
      })
    })
  }

  const handleRemovePool = (id: string) => {
    setPools((prevPools) => {
      const poolToRemove = prevPools.find((pool) => pool.id === id)
      if (!poolToRemove) return prevPools

      const remainingPools = prevPools.filter((pool) => pool.id !== id)
      if (remainingPools.length === 0) {
        setPools([])
        return []
      }

      const totalAllocation = remainingPools.reduce((sum, pool) => sum + pool.allocation, 0)

      const adjustedPools = remainingPools.map((pool) => {
        const newAllocation = (pool.allocation / totalAllocation) * 100
        return { ...pool, allocation: newAllocation }
      })

      setPools(adjustedPools)
      return adjustedPools
    })
  }

  const handleAddPool = (newPool: { id: string; name: string; apy: number }) => {
    setPools((prevPools) => {
      if (prevPools.find((pool) => pool.id === newPool.id)) {
        toast({
          title: "Error",
          description: "Pool already exists",
          variant: "destructive",
        })
        return prevPools
      }

      const remainingAllocation = 100 - prevPools.reduce((sum, pool) => sum + pool.allocation, 0)
      const newPoolAllocation = Math.min(remainingAllocation, 100)

      const updatedPools = [...prevPools, { ...newPool, allocation: newPoolAllocation }]
      return updatedPools
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { name?: string; allocation?: string } = {}
    if (!vaultName) {
      newErrors.name = "Vault name is required"
    }
    if (totalAllocation !== 100) {
      newErrors.allocation = "Total allocation must be 100%"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: "Vault created successfully",
      })
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to create vault",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const applyRecommendedStrategy = (strategy: {
    name: string
    description: string
    pools: { id: string; name: string; allocation: number; apy: number }[]
  }) => {
    setPools(strategy.pools)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header variant="dashboard" />
      <main className="flex-1 p-4 md:p-8 pt-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Link href="/pools">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Volver a Pools
              </Button>
            </Link>
            <h1 className="text-2xl font-bold ml-2">Crear Vault Personalizada</h1>
          </div>

          <div className="rounded-lg border p-4 bg-amber-50 dark:bg-amber-950/20 mb-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="font-medium">Crea tu propia estrategia</p>
                <p className="text-sm text-muted-foreground">
                  Las vaults personalizadas te permiten distribuir tus fondos entre diferentes pools según tus
                  preferencias. Puedes elegir pools con diferentes niveles de riesgo y rendimiento para crear una
                  estrategia que se adapte a tus objetivos.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Información Básica</CardTitle>
                    <CardDescription>Define el nombre y la descripción de tu vault personalizada.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="vault-name">Nombre de la Vault</Label>
                      <Input
                        id="vault-name"
                        placeholder="Ej: Mi Estrategia BTC"
                        value={vaultName}
                        onChange={handleVaultNameChange}
                      />
                      {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vault-description">Descripción (opcional)</Label>
                      <Input
                        id="vault-description"
                        placeholder="Ej: Estrategia balanceada para rendimiento a largo plazo"
                        value={vaultDescription}
                        onChange={handleVaultDescriptionChange}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Selección de Pools</CardTitle>
                    <CardDescription>
                      Selecciona los pools que quieres incluir en tu vault y asigna porcentajes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      {pools.map((pool) => (
                        <div className="rounded-lg border p-4 space-y-4" key={pool.id}>
                          <div className="flex justify-between items-center">
                            <div className="font-medium">{pool.name}</div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleRemovePool(pool.id)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Eliminar</span>
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Asignación: {pool.allocation.toFixed(0)}%</span>
                              <span>APY: {pool.apy}%</span>
                            </div>
                            <Slider
                              defaultValue={[pool.allocation]}
                              max={100}
                              step={1}
                              onValueChange={(value: number[]) => handleAllocationChange(pool.id, value[0])}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center">
                      <PoolSelector onAddPool={handleAddPool} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Resumen</CardTitle>
                    <CardDescription>Resumen de tu vault personalizada.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">APY Estimado</div>
                      <div className="text-2xl font-bold">{estimatedAPY.toFixed(2)}%</div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Distribución</div>
                      <div className="space-y-2">
                        {pools.map((pool) => (
                          <div key={pool.id} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{pool.name}</span>
                              <span>{pool.allocation.toFixed(0)}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-emerald-500"
                                style={{ width: `${pool.allocation}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-2">
                    <Button className="w-full" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Creando..." : "Crear Vault"}
                    </Button>
                    <Button variant="outline" className="w-full" type="button">
                      Cancelar
                    </Button>
                    {errors.allocation && <p className="text-sm text-red-500">{errors.allocation}</p>}
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recomendaciones</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recommendedStrategies.map((strategy) => (
                      <div key={strategy.name} className="space-y-2">
                        <p className="text-sm font-medium">{strategy.name}</p>
                        <p className="text-xs text-muted-foreground">{strategy.description}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => applyRecommendedStrategy(strategy)}
                        >
                          Aplicar
                        </Button>
                        <Separator />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
