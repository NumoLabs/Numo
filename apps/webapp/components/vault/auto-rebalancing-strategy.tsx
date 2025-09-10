"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Settings, TrendingUp, BarChart3, Clock, AlertCircle, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import type { VaultRebalanceStrategy, VaultConfig } from "@/types/Vault"
import { vaultRebalanceStrategies } from "@/lib/vault-data"

interface AutoRebalancingStrategyProps {
  vaultId: string
  currentConfig?: VaultConfig
  onConfigUpdate: (config: VaultConfig) => void
}

export function AutoRebalancingStrategy({ 
  vaultId, 
  currentConfig, 
  onConfigUpdate 
}: AutoRebalancingStrategyProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<string>("risk-parity")
  const [config, setConfig] = useState<VaultConfig>(currentConfig || {
    id: 'btc-vault-config',
    name: 'BTC Vault Configuration',
    description: 'Default configuration for BTC vaults',
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

  const strategies = vaultRebalanceStrategies

  const handleStrategyChange = (strategyId: string) => {
    setSelectedStrategy(strategyId)
    const strategy = strategies.find(s => s.id === strategyId)
    if (strategy) {
      // Update config based on selected strategy
      setConfig(prev => ({
        ...prev,
        rebalanceThreshold: strategy.parameters.rebalanceThreshold || prev.rebalanceThreshold,
        maxPoolAllocation: strategy.parameters.maxAllocation || prev.maxPoolAllocation
      }))
    }
  }

  const handleConfigUpdate = (updates: Partial<VaultConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString()
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onConfigUpdate(config)
      toast({
        title: "Configuration Saved",
        description: "Vault rebalancing configuration has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getStrategyPerformance = (strategyId: string) => {
    const strategy = strategies.find(s => s.id === strategyId)
    return strategy?.performance || null
  }

  const performance = getStrategyPerformance(selectedStrategy)

  return (
    <div className="space-y-6">
      {/* Strategy Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Rebalancing Strategy
          </CardTitle>
          <CardDescription>
            Choose the algorithm that will determine how your vault rebalances
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {strategies.map((strategy) => (
              <Card
                key={strategy.id}
                className={`cursor-pointer transition-all ${
                  selectedStrategy === strategy.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => handleStrategyChange(strategy.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{strategy.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{strategy.description}</p>
                    </div>
                    {strategy.isActive && (
                      <Badge variant="default" className="bg-green-600">
                        Active
                      </Badge>
                    )}
                  </div>
                  
                  {strategy.performance && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600">Sharpe Ratio:</span>
                          <span className="font-medium ml-1">{strategy.performance.sharpeRatio.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Max Drawdown:</span>
                          <span className="font-medium ml-1 text-red-600">{strategy.performance.maxDrawdown.toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Volatility:</span>
                          <span className="font-medium ml-1">{strategy.performance.volatility.toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Returns:</span>
                          <span className="font-medium ml-1 text-green-600">{strategy.performance.returns.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration Settings
          </CardTitle>
          <CardDescription>
            Fine-tune your rebalancing parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
              <TabsTrigger value="pools">Pools</TabsTrigger>
              <TabsTrigger value="safety">Safety</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rebalancingMode">Rebalancing Mode</Label>
                  <Select
                    value={config.rebalancingMode}
                    onValueChange={(value: 'manual' | 'automatic' | 'hybrid') => 
                      handleConfigUpdate({ rebalancingMode: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="automatic">Automatic</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rebalanceFrequency">Rebalance Frequency</Label>
                  <Select
                    value={config.rebalanceFrequency}
                    onValueChange={(value: 'hourly' | 'daily' | 'weekly' | 'monthly') => 
                      handleConfigUpdate({ rebalanceFrequency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="emergencyStop"
                  checked={config.emergencyStop}
                  onCheckedChange={(checked: boolean) => handleConfigUpdate({ emergencyStop: checked })}
                />
                <Label htmlFor="emergencyStop">Emergency Stop</Label>
              </div>
            </TabsContent>

            <TabsContent value="thresholds" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Rebalance Threshold: {config.rebalanceThreshold}%</Label>
                  <Slider
                    value={[config.rebalanceThreshold]}
                    onValueChange={([value]) => handleConfigUpdate({ rebalanceThreshold: value })}
                    max={20}
                    min={1}
                    step={0.5}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-600">
                    Trigger rebalancing when APY changes by this percentage
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Max Slippage: {config.maxSlippage}%</Label>
                  <Slider
                    value={[config.maxSlippage]}
                    onValueChange={([value]) => handleConfigUpdate({ maxSlippage: value })}
                    max={5}
                    min={0.1}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-600">
                    Maximum acceptable slippage for rebalancing transactions
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Max Gas Cost: {config.maxGasCost} ETH</Label>
                  <Slider
                    value={[config.maxGasCost]}
                    onValueChange={([value]) => handleConfigUpdate({ maxGasCost: value })}
                    max={0.02}
                    min={0.001}
                    step={0.001}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-600">
                    Maximum gas cost for rebalancing transactions
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pools" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Min Pool Allocation: {config.minPoolAllocation}%</Label>
                  <Slider
                    value={[config.minPoolAllocation]}
                    onValueChange={([value]) => handleConfigUpdate({ minPoolAllocation: value })}
                    max={20}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max Pool Allocation: {config.maxPoolAllocation}%</Label>
                  <Slider
                    value={[config.maxPoolAllocation]}
                    onValueChange={([value]) => handleConfigUpdate({ maxPoolAllocation: value })}
                    max={100}
                    min={20}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Whitelisted Pools</Label>
                <Input
                  placeholder="Enter pool IDs separated by commas"
                  value={config.whitelistedPools.join(', ')}
                  onChange={(e) => handleConfigUpdate({ 
                    whitelistedPools: e.target.value.split(',').map(id => id.trim()).filter(Boolean)
                  })}
                />
                <p className="text-xs text-gray-600">
                  Only these pools will be used for rebalancing (leave empty to allow all)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Blacklisted Pools</Label>
                <Input
                  placeholder="Enter pool IDs separated by commas"
                  value={config.blacklistedPools.join(', ')}
                  onChange={(e) => handleConfigUpdate({ 
                    blacklistedPools: e.target.value.split(',').map(id => id.trim()).filter(Boolean)
                  })}
                />
                <p className="text-xs text-gray-600">
                  These pools will never be used for rebalancing
                </p>
              </div>
            </TabsContent>

            <TabsContent value="safety" className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Safety Settings</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        These settings help protect your funds from unexpected market conditions
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="emergencyStop"
                      checked={config.emergencyStop}
                      onCheckedChange={(checked: boolean) => handleConfigUpdate({ emergencyStop: checked })}
                    />
                    <Label htmlFor="emergencyStop">Emergency Stop</Label>
                  </div>
                  <p className="text-xs text-gray-600">
                    Immediately stop all rebalancing activities
                  </p>

                  <div className="space-y-2">
                    <Label>Maximum Daily Rebalances</Label>
                    <Input
                      type="number"
                      placeholder="5"
                      min="1"
                      max="20"
                    />
                    <p className="text-xs text-gray-600">
                      Limit the number of rebalances per day to prevent excessive trading
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Cooldown Period (hours)</Label>
                    <Input
                      type="number"
                      placeholder="6"
                      min="1"
                      max="24"
                    />
                    <p className="text-xs text-gray-600">
                      Minimum time between rebalancing events
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Performance Preview */}
      {performance && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Strategy Performance
            </CardTitle>
            <CardDescription>
              Expected performance metrics for the selected strategy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{performance.returns.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Expected Returns</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{performance.sharpeRatio.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Sharpe Ratio</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{performance.maxDrawdown.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Max Drawdown</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">{performance.volatility.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Volatility</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSaving ? "Saving..." : "Save Configuration"}
        </Button>
      </div>
    </div>
  )
}
