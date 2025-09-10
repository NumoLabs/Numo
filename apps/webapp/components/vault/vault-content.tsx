"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Filter, Plus, TrendingUp, Shield, AlertTriangle, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VaultCard } from "./vault-card"
import { VaultDashboard } from "./vault-dashboard"
import type { VaultStrategy } from "@/types/Vault"
import { useVesuVaults } from "@/hooks/use-vesu-vaults"

interface VaultContentProps {
  selectedVaultId?: string
  userAddress?: string
  onVaultSelect?: (vaultId: string) => void
}

export function VaultContent({ selectedVaultId, userAddress, onVaultSelect }: VaultContentProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRisk, setSelectedRisk] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("apy")
  const { vaults: realVaults, isLoading, error, refreshVaults } = useVesuVaults()
  const [filteredStrategies, setFilteredStrategies] = useState<VaultStrategy[]>([])

  useEffect(() => {
    if (isLoading || !realVaults.length) {
      setFilteredStrategies([])
      return
    }

    let filtered = realVaults

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(strategy =>
        strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        strategy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        strategy.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by risk level
    if (selectedRisk !== "all") {
      filtered = filtered.filter(strategy => strategy.riskLevel === selectedRisk)
    }

    // Sort strategies
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "apy":
          return b.apy - a.apy
        case "tvl":
          return b.totalValue - a.totalValue
        case "risk":
          const riskOrder = { Low: 1, Medium: 2, High: 3 }
          return riskOrder[a.riskLevel] - riskOrder[b.riskLevel]
        case "performance":
          return b.performance['30d'] - a.performance['30d']
        default:
          return 0
      }
    })

    setFilteredStrategies(filtered)
  }, [searchTerm, selectedRisk, sortBy, realVaults, isLoading])

  const handleVaultSelect = (vaultId: string) => {
    onVaultSelect?.(vaultId)
  }

  const handleDeposit = (vaultId: string) => {
    // TODO: Implement deposit logic
    console.log('Depositing to vault:', vaultId)
  }

  const handleWithdraw = (vaultId: string) => {
    // TODO: Implement withdrawal logic
    console.log('Withdrawing from vault:', vaultId)
  }

  const handleViewDetails = (vaultId: string) => {
    handleVaultSelect(vaultId)
  }

  const handleFollow = (vaultId: string) => {
    // TODO: Implement follow logic
    console.log('Following vault:', vaultId)
  }

  // If a specific vault is selected, show the dashboard
  if (selectedVaultId) {
    return (
      <VaultDashboard
        vaultId={selectedVaultId}
        userAddress={userAddress}
      />
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">WBTC Vaults</h1>
            <p className="text-gray-600 mt-1">
              🔄 Loading real-time vault data from Vesu protocol...
            </p>
            <div className="mt-2 text-sm text-blue-600">
              ✅ Connected to Vesu API • 📊 Fetching live pool data • 🚀 Generating vault strategies
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border-2 border-dashed border-blue-200">
                <div className="p-6">
                  <div className="h-4 bg-blue-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-blue-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-blue-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-blue-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">WBTC Vaults</h1>
            <p className="text-gray-600 mt-1">
              Error loading vault data
            </p>
          </div>
          <Button onClick={refreshVaults} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={refreshVaults} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">WBTC Vaults</h1>
          <p className="text-gray-600 mt-1">
            Discover and invest in automated WBTC yield strategies
          </p>
          <div className="mt-2 flex items-center space-x-4 text-sm">
            <div className="flex items-center text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Live Data from Vesu Protocol
            </div>
            <div className="flex items-center text-blue-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Real-time APY & TVL
            </div>
            <div className="flex items-center text-purple-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              {filteredStrategies.length} Active Vaults
            </div>
            <div className="flex items-center text-orange-600">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
              Debug: {isLoading ? 'Loading...' : error ? 'Error' : 'Ready'}
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={refreshVaults}
            className="text-sm"
          >
            🔄 Refresh Data
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => window.open('/vault/create', '_blank')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Vault
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search vaults, strategies, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Risk Filter */}
            <div className="flex gap-2">
              <Button
                variant={selectedRisk === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRisk("all")}
              >
                All
              </Button>
              <Button
                variant={selectedRisk === "Low" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRisk("Low")}
                className="text-green-700 border-green-200 hover:bg-green-50"
              >
                <Shield className="h-3 w-3 mr-1" />
                Low
              </Button>
              <Button
                variant={selectedRisk === "Medium" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRisk("Medium")}
                className="text-yellow-700 border-yellow-200 hover:bg-yellow-50"
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                Medium
              </Button>
              <Button
                variant={selectedRisk === "High" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRisk("High")}
                className="text-red-700 border-red-200 hover:bg-red-50"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                High
              </Button>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="apy">APY</option>
                <option value="tvl">Total Value</option>
                <option value="risk">Risk Level</option>
                <option value="performance">Performance</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vaults Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStrategies.map((strategy) => (
          <VaultCard
            key={strategy.id}
            strategy={strategy}
            onDeposit={handleDeposit}
            onWithdraw={handleWithdraw}
            onViewDetails={handleViewDetails}
            onFollow={handleFollow}
          />
        ))}
      </div>

      {/* No Results */}
      {filteredStrategies.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Vaults Found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedRisk("all")
                setSortBy("apy")
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{filteredStrategies.length}</p>
              <p className="text-sm text-gray-600">Total Vaults</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {filteredStrategies.length > 0 
                  ? (filteredStrategies.reduce((sum, s) => sum + s.apy, 0) / filteredStrategies.length).toFixed(2)
                  : '0.00'
                }%
              </p>
              <p className="text-sm text-gray-600">Average APY</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {filteredStrategies.reduce((sum, s) => sum + s.totalValue, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total TVL (WBTC)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {filteredStrategies.filter(s => s.verified).length}
              </p>
              <p className="text-sm text-gray-600">Verified Vaults</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
