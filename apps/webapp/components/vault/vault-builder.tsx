"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft, Save, Play, Settings, BarChart3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { VesuPoolSelector } from "./vesu-pool-selector"
import { AutoRebalancingStrategy } from "./auto-rebalancing-strategy"
import type { VaultStrategy, VaultConfig, VesuPoolSelection } from "@/types/Vault"

interface VaultBuilderProps {
  onBack: () => void
  onSave: (vault: VaultStrategy) => void
  existingVault?: VaultStrategy
}

export function VaultBuilder({ onBack, onSave, existingVault }: VaultBuilderProps) {
  const [vaultName, setVaultName] = useState(existingVault?.name || "")
  const [vaultDescription, setVaultDescription] = useState(existingVault?.description || "")
  const [selectedPools, setSelectedPools] = useState<VesuPoolSelection[]>(
    existingVault?.pools.map(pool => ({
      poolId: pool.poolId,
      poolName: pool.poolName,
      protocol: pool.protocol as 'Vesu',
      allocation: pool.allocation,
      apy: pool.apy,
      tvl: pool.tvl,
      risk: pool.risk,
      tokens: pool.tokens,
      address: pool.address,
      selected: true
    })) || []
  )
  const [vaultConfig, setVaultConfig] = useState<VaultConfig>({
    id: existingVault?.id || 'new-vault-config',
    name: existingVault?.name || 'New Vault Configuration',
    description: existingVault?.description || 'Custom vault configuration',
    rebalancingMode: 'automatic',
    rebalanceThreshold: 5.0,
    rebalanceFrequency: 'daily',
    maxSlippage: 1.0,
    maxGasCost: 0.005,
    minPoolAllocation: 5.0,
    maxPoolAllocation: 80.0,
    whitelistedPools: [],
    blacklistedPools: [],
    emergencyStop: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const calculateVaultApy = () => {
    if (selectedPools.length === 0) return 0
    return selectedPools.reduce((total, pool) => {
      return total + (pool.apy * pool.allocation / 100)
    }, 0)
  }

  const calculateVaultRisk = (): 'Low' | 'Medium' | 'High' => {
    if (selectedPools.length === 0) return 'Low'
    
    const riskScores = selectedPools.map(pool => {
      switch (pool.risk) {
        case 'Low': return 1
        case 'Medium': return 2
        case 'High': return 3
        default: return 1
      }
    })
    
    const weightedRisk = selectedPools.reduce((total, pool, index) => {
      return total + (riskScores[index] * pool.allocation / 100)
    }, 0)
    
    if (weightedRisk <= 1.5) return 'Low'
    if (weightedRisk <= 2.5) return 'Medium'
    return 'High'
  }

  const handlePoolsChange = (pools: VesuPoolSelection[]) => {
    setSelectedPools(pools)
  }

  const handleConfigUpdate = (config: VaultConfig) => {
    setVaultConfig(config)
  }

  const handleSave = async () => {
    if (!vaultName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a vault name",
        variant: "destructive"
      })
      return
    }

    if (selectedPools.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one pool",
        variant: "destructive"
      })
      return
    }

    const totalAllocation = selectedPools.reduce((sum, pool) => sum + pool.allocation, 0)
    if (Math.abs(totalAllocation - 100) > 0.1) {
      toast({
        title: "Validation Error",
        description: "Total allocation must equal 100%",
        variant: "destructive"
      })
      return
    }

    setIsSaving(true)
    try {
      const vault: VaultStrategy = {
        id: existingVault?.id || `vault-${Date.now()}`,
        name: vaultName,
        description: vaultDescription,
        riskLevel: calculateVaultRisk(),
        apy: calculateVaultApy(),
        totalValue: 0, // Will be set when users deposit
        createdAt: existingVault?.createdAt || new Date().toISOString(),
        lastRebalanced: new Date().toISOString(),
        pools: selectedPools.map(pool => ({
          poolId: pool.poolId,
          poolName: pool.poolName,
          protocol: pool.protocol,
          allocation: pool.allocation,
          apy: pool.apy,
          tvl: pool.tvl,
          risk: pool.risk,
          tokens: pool.tokens,
          address: pool.address
        })),
        performance: {
          '1d': 0,
          '7d': 0,
          '30d': 0
        },
        tags: ['Custom', 'Vesu', 'Auto-Rebalancing'],
        verified: false,
        featured: false
      }

      await onSave(vault)
      toast({
        title: "Vault Saved",
        description: "Your vault has been created successfully",
      })
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save vault. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const totalAllocation = selectedPools.reduce((sum, pool) => sum + pool.allocation, 0)
  const vaultApy = calculateVaultApy()
  const vaultRisk = calculateVaultRisk()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {existingVault ? 'Edit Vault' : 'Create New Vault'}
            </h1>
            <p className="text-gray-600">
              Build a custom WBTC vault with Vesu pools and auto-rebalancing
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Vault'}
          </Button>
        </div>
      </div>

      {/* Vault Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Vault Preview
          </CardTitle>
          <CardDescription>
            Overview of your vault configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{vaultName || 'Unnamed Vault'}</p>
              <p className="text-sm text-gray-600">Vault Name</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{vaultApy.toFixed(2)}%</p>
              <p className="text-sm text-gray-600">Expected APY</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{selectedPools.length}</p>
              <p className="text-sm text-gray-600">Selected Pools</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                <Badge className={
                  vaultRisk === 'Low' ? 'bg-green-100 text-green-800' :
                  vaultRisk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }>
                  {vaultRisk}
                </Badge>
              </p>
              <p className="text-sm text-gray-600">Risk Level</p>
            </div>
          </div>
          
          {totalAllocation !== 100 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                ⚠️ Total allocation is {totalAllocation.toFixed(1)}%. Must equal 100%.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Configuration */}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="pools">Pools</TabsTrigger>
          <TabsTrigger value="strategy">Strategy</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Configure the basic details of your vault
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vaultName">Vault Name</Label>
                <Input
                  id="vaultName"
                  placeholder="Enter vault name"
                  value={vaultName}
                  onChange={(e) => setVaultName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vaultDescription">Description</Label>
                <Textarea
                  id="vaultDescription"
                  placeholder="Describe your vault strategy"
                  value={vaultDescription}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setVaultDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Risk Level</Label>
                  <Select value={vaultRisk} disabled>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low Risk</SelectItem>
                      <SelectItem value="Medium">Medium Risk</SelectItem>
                      <SelectItem value="High">High Risk</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-600">
                    Automatically calculated based on pool selection
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Expected APY</Label>
                  <Input
                    value={`${vaultApy.toFixed(2)}%`}
                    disabled
                  />
                  <p className="text-xs text-gray-600">
                    Calculated based on pool allocations
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pools" className="space-y-4">
          <VesuPoolSelector
            selectedPools={selectedPools}
            onPoolsChange={handlePoolsChange}
            maxPools={5}
          />
        </TabsContent>

        <TabsContent value="strategy" className="space-y-4">
          <AutoRebalancingStrategy
            vaultId={existingVault?.id || 'new-vault'}
            currentConfig={vaultConfig}
            onConfigUpdate={handleConfigUpdate}
          />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Fine-tune advanced vault parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Minimum Deposit (WBTC)</Label>
                  <Input
                    type="number"
                    placeholder="0.001"
                    step="0.00000001"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Maximum Deposit (WBTC)</Label>
                  <Input
                    type="number"
                    placeholder="100"
                    step="0.00000001"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Withdrawal Fee (%)</Label>
                  <Input
                    type="number"
                    placeholder="0.1"
                    step="0.01"
                    min="0"
                    max="5"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Management Fee (%)</Label>
                  <Input
                    type="number"
                    placeholder="0.5"
                    step="0.01"
                    min="0"
                    max="2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <Input
                  placeholder="Enter tags separated by commas"
                  value="Custom, Vesu, Auto-Rebalancing"
                  disabled
                />
                <p className="text-xs text-gray-600">
                  Tags help users discover your vault
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
