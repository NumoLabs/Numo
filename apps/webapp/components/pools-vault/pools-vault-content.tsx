"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, ArrowRight, Shield, Coins, Star, Target, Users } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { VesuPoolCard } from "@/components/pools-vault/vesu-pool-card"
import { AddToPoolForm } from "@/components/pools-vault/add-to-pool-form"
import { VesuPoolsTestnet, VesuPoolDetailCard, VesuAddToPoolForm } from "@/components/vesu"
import { useVesuConfig } from "@/hooks/use-vesu"
import { useVesuTransactions } from "@/hooks/use-vesu-transactions"

interface PoolData {
  id: string
  name: string
  description: string
  apy: number
  tvl: number
  participants: number
  riskLevel: string
  minDeposit: number
  maxDeposit: number
  token: string
  strategy: string
  rewards: string[]
  status: "active" | "coming-soon" | "closed"
  featured?: boolean
  protocol: string
  tokens: string[]
}

export function PoolsVaultContent() {
  const [selectedPool, setSelectedPool] = useState<string | null>(null)
  const [selectedVesuPool, setSelectedVesuPool] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("vesu-testnet")
  const { toast } = useToast()
  const { isTestnetMode } = useVesuConfig()
  const { depositToVesu, isLoading: isTransactionLoading, currentStep } = useVesuTransactions()

  // Function to check if selected pool is a Vesu pool
  const isVesuPool = selectedVesuPool !== null

  // Only real pools from Vesu API - no simulated pools
  const availablePools: PoolData[] = []

  const selectedPoolData = availablePools.find(pool => pool.id === selectedPool)

  const filteredPools = availablePools.filter(pool => 
    pool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pool.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pool.tokens.some(token => token.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleAddToPool = async (amount: number) => {
    setIsLoading(true)
    try {
      // Simulate API call for non-Vesu pools
      await new Promise((resolve) => setTimeout(resolve, 3000))
      
      toast({
        title: "Successfully Added to Pool",
        description: `${amount} WBTC has been added to the ${selectedPoolData?.name}`,
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to load pool data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVesuAddToPool = async (amount: number, assetAddress: string) => {
    if (!selectedVesuPool) {
      toast({
        title: "No Pool Selected",
        description: "Please select a Vesu pool first",
        variant: "destructive",
      })
      return
    }

    // Find the selected asset to get its decimals
    const selectedAsset = selectedVesuPool.assets.find((asset: any) => asset.address === assetAddress)
    if (!selectedAsset) {
      toast({
        title: "Asset Not Found",
        description: "Selected asset not found in pool",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await depositToVesu(
        selectedVesuPool.id,
        assetAddress,
        amount,
        selectedAsset.decimals
      )

      if (result?.success) {
        toast({
          title: "Deposit Successful!",
          description: `Successfully deposited ${amount} ${selectedAsset.symbol} to ${selectedVesuPool.name}`,
        })
      }
    } catch (error: any) {
      toast({
        title: "Deposit Failed",
        description: error.message || "Failed to deposit to Vesu pool",
        variant: "destructive",
      })
    }
  }


  return (
    <div className="space-y-6">
      {!selectedPool ? (
        // Pool Selection View
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-bitcoin-orange to-bitcoin-gold bg-clip-text text-transparent">
                Pool Vaults
              </h1>
              <p className="text-muted-foreground mt-2">
                Explore curated vaults and liquidity pools with automated yield strategies
              </p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="rounded-lg border p-4 bg-gradient-to-r from-blue-100/10 to-purple-100/10 dark:from-blue-900/5 dark:to-purple-900/5 border-blue-300/30 dark:border-blue-700/20">
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="font-medium text-blue-600 dark:text-blue-400">Real Vesu Pool Data Only</p>
                <p className="text-sm text-foreground">
                  This interface shows only real data from Vesu Protocol. All APY, utilization rates, and pool statistics 
                  are fetched directly from the official Vesu API. No simulated or mock data is displayed.
                </p>
              </div>
            </div>
          </div>

          {/* Tabs - Only Real Vesu Pools */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-1 lg:w-[300px]">
              <TabsTrigger 
                value="vesu-testnet"
                className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100 transition-all duration-300 ease-in-out"
              >
                Vesu Pools (Real Data Only)
              </TabsTrigger>
            </TabsList>


            <TabsContent value="vesu-testnet" className="space-y-6">
              <VesuPoolsTestnet 
                onPoolSelect={(pool) => {
                  setSelectedVesuPool(pool);
                  setSelectedPool(pool.id);
                  toast({
                    title: "Vesu Pool Selected",
                    description: `You have selected ${pool.name} for testing.`,
                  });
                }}
                showTestnetBanner={true}
              />
            </TabsContent>
          </Tabs>
        </>
      ) : (
        // Pool Detail View
        <div className="space-y-6">
          {/* Back to Selection */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedPool(null);
                setSelectedVesuPool(null);
              }}
              className="gap-2"
            >
              ← Back to Vaults
            </Button>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
            <h2 className="text-xl font-semibold">
              {isVesuPool ? selectedVesuPool?.name : selectedPoolData?.name}
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Pool Information */}
            <div className="lg:col-span-2 space-y-6">
              {isVesuPool ? (
                <VesuPoolDetailCard pool={selectedVesuPool} />
              ) : (
                <VesuPoolCard poolData={selectedPoolData!} />
              )}
            </div>

            {/* Right Column - Add to Pool */}
            <div className="space-y-6 sticky top-6">
              {/* Transaction Progress */}
              {isTransactionLoading && currentStep && (
                <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <div>
                        <p className="font-medium text-blue-800 dark:text-blue-200">Transaction in Progress</p>
                        <p className="text-sm text-blue-600 dark:text-blue-300">{currentStep}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {isVesuPool ? (
                <VesuAddToPoolForm
                  pool={selectedVesuPool}
                  onAddToPool={handleVesuAddToPool}
                  isLoading={isTransactionLoading}
                />
              ) : (
                <AddToPoolForm
                  poolData={selectedPoolData!}
                  onAddToPool={handleAddToPool}
                  isLoading={isLoading}
                />
              )}


            </div>
          </div>
        </div>
      )}
    </div>
  )
} 