"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Check, ExternalLink, TrendingUp, Shield, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import type { VesuPool } from "@/types/VesuPools"
import { getVesuPools } from "@/app/api/vesuApi"

interface VesuPoolSelectorProps {
  selectedPools: VesuPoolSelection[]
  onPoolsChange: (pools: VesuPoolSelection[]) => void
  maxPools?: number
}

interface VesuPoolSelection {
  poolId: string
  poolName: string
  protocol: 'Vesu'
  allocation: number
  apy: number
  tvl: number
  risk: 'Low' | 'Medium' | 'High'
  tokens: string[]
  address?: string
  selected: boolean
}

export function VesuPoolSelector({ 
  selectedPools, 
  onPoolsChange, 
  maxPools = 5 
}: VesuPoolSelectorProps) {
  const [vesuPools, setVesuPools] = useState<VesuPool[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredPools, setFilteredPools] = useState<VesuPool[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const loadVesuPools = async () => {
      setIsLoading(true)
      try {
        const pools = await getVesuPools()
        setVesuPools(pools)
        setFilteredPools(pools)
      } catch (error) {
        console.error('Failed to load Vesu pools:', error)
        toast({
          title: "Error",
          description: "Failed to load Vesu pools. Please try again.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadVesuPools()
  }, [])

  useEffect(() => {
    let filtered = vesuPools

    if (searchTerm) {
      filtered = filtered.filter(pool =>
        pool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pool.assets.some(asset => 
          asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    setFilteredPools(filtered)
  }, [searchTerm, vesuPools])

  const handlePoolToggle = (pool: VesuPool) => {
    const isSelected = selectedPools.some(p => p.poolId === pool.id)
    
    if (isSelected) {
      // Remove pool
      onPoolsChange(selectedPools.filter(p => p.poolId !== pool.id))
    } else {
      // Add pool (check max limit)
      if (selectedPools.length >= maxPools) {
        toast({
          title: "Maximum Pools Reached",
          description: `You can select up to ${maxPools} pools maximum.`,
          variant: "destructive"
        })
        return
      }

      const newPool: VesuPoolSelection = {
        poolId: pool.id,
        poolName: pool.name,
        protocol: 'Vesu',
        allocation: 0, // Will be set by user
        apy: pool.assets.reduce((sum, asset) => sum + asset.apy, 0) / pool.assets.length,
        tvl: 0, // Mock value
        risk: 'Medium', // Default risk
        tokens: pool.assets.map(asset => asset.symbol),
        address: pool.address,
        selected: true
      }

      onPoolsChange([...selectedPools, newPool])
    }
  }

  const handleAllocationChange = (poolId: string, allocation: number) => {
    onPoolsChange(selectedPools.map(pool => 
      pool.poolId === poolId ? { ...pool, allocation } : pool
    ))
  }

  const getRiskLevel = (pool: VesuPool): 'Low' | 'Medium' | 'High' => {
    // Simple risk assessment based on utilization and APY
    const avgUtilization = pool.assets.reduce((sum, asset) => sum + asset.currentUtilization, 0) / pool.assets.length
    const avgApy = pool.assets.reduce((sum, asset) => sum + asset.apy, 0) / pool.assets.length
    
    if (avgUtilization > 80 || avgApy > 15) return 'High'
    if (avgUtilization > 60 || avgApy > 10) return 'Medium'
    return 'Low'
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'Low': return <Shield className="h-4 w-4 text-green-600" />
      case 'Medium': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'High': return <TrendingUp className="h-4 w-4 text-red-600" />
      default: return <Shield className="h-4 w-4 text-gray-600" />
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800 border-green-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'High': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vesu Pools</CardTitle>
          <CardDescription>Loading available pools...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="search">Search Pools</Label>
              <Input
                id="search"
                placeholder="Search by pool name or token..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{filteredPools.length} pools available</span>
              <span>{selectedPools.length}/{maxPools} selected</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Pools */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Available Vesu Pools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPools.map((pool) => {
            const isSelected = selectedPools.some(p => p.poolId === pool.id)
            const risk = getRiskLevel(pool)
            const avgApy = pool.assets.reduce((sum, asset) => sum + asset.apy, 0) / pool.assets.length
            const avgUtilization = pool.assets.reduce((sum, asset) => sum + asset.currentUtilization, 0) / pool.assets.length

            return (
              <Card 
                key={pool.id} 
                className={`cursor-pointer transition-all ${
                  isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                }`}
                onClick={() => handlePoolToggle(pool)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{pool.name}</h4>
                        <Badge className={getRiskColor(risk)}>
                          {getRiskIcon(risk)}
                          <span className="ml-1">{risk}</span>
                        </Badge>
                        {isSelected && (
                          <Badge variant="default" className="bg-blue-600">
                            <Check className="h-3 w-3 mr-1" />
                            Selected
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {pool.assets.length} asset{pool.assets.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(`https://vesu.xyz/pool/${pool.id}`, '_blank')
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Pool Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-600">Avg APY</p>
                      <p className="text-sm font-semibold text-green-600">
                        {avgApy.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Utilization</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {avgUtilization.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Assets */}
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600">Assets:</p>
                    <div className="flex flex-wrap gap-1">
                      {pool.assets.map((asset) => (
                        <Badge key={asset.symbol} variant="outline" className="text-xs">
                          {asset.symbol}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Selected Pools Allocation */}
      {selectedPools.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Pools Allocation</CardTitle>
            <CardDescription>
              Set the allocation percentage for each selected pool
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedPools.map((pool) => (
              <div key={pool.poolId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{pool.poolName}</span>
                    <Badge variant="outline" className="text-xs">
                      {pool.apy.toFixed(2)}% APY
                    </Badge>
                  </div>
                  <span className="text-sm font-medium">{pool.allocation}%</span>
                </div>
                <Slider
                  value={[pool.allocation]}
                  onValueChange={([value]) => handleAllocationChange(pool.poolId, value)}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            ))}
            
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Allocation:</span>
                <span className={`font-medium ${
                  selectedPools.reduce((sum, pool) => sum + pool.allocation, 0) === 100 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {selectedPools.reduce((sum, pool) => sum + pool.allocation, 0)}%
                </span>
              </div>
              {selectedPools.reduce((sum, pool) => sum + pool.allocation, 0) !== 100 && (
                <p className="text-xs text-red-600 mt-1">
                  Total allocation must equal 100%
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
