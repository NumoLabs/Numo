"use client"

import type React from "react"
import { useState } from "react"
import { ArrowUpDown, Settings, BarChart3, History, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useVesuTransactions } from "@/hooks/use-vesu-transactions"
import { WBTC_CONFIG, formatWBTCValue, validateWBTCDeposit, validateWBTCWithdrawal } from "@/lib/wbtc-config"
import type { VaultStrategy, VaultPosition } from "@/types/Vault"

interface VaultActionsProps {
  strategy: VaultStrategy
  position?: VaultPosition
  onDeposit: (amount: number) => void
  onWithdraw: (amount: number) => void
  onRebalance: () => void
  onConfigure: () => void
}

export function VaultActions({ 
  strategy, 
  position, 
  onDeposit, 
  onWithdraw, 
  onRebalance, 
  onConfigure 
}: VaultActionsProps) {
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [isRebalancing, setIsRebalancing] = useState(false)
  const { toast } = useToast()
  const { 
    deposit: vesuDeposit, 
    withdraw: vesuWithdraw, 
    isDepositing, 
    isWithdrawing, 
    isConnected,
    error: transactionError 
  } = useVesuTransactions()

  const handleDeposit = async () => {
    const validation = validateWBTCDeposit(depositAmount)
    if (!validation.isValid) {
      toast({
        title: "Invalid Amount",
        description: validation.error || "Please enter a valid deposit amount",
        variant: "destructive"
      })
      return
    }

    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to deposit funds",
        variant: "destructive"
      })
      return
    }

    try {
      // Find the first Vesu pool in the strategy
      const vesuPool = strategy.pools.find(pool => pool.protocol === 'Vesu')
      if (!vesuPool) {
        throw new Error('No Vesu pool found in this strategy')
      }

      // Create a mock VesuPool object for the transaction
      const mockVesuPool = {
        id: vesuPool.poolId,
        name: vesuPool.poolName,
        address: vesuPool.address || '',
        assets: [{
          name: vesuPool.tokens[0] || 'USDC',
          symbol: vesuPool.tokens[0] || 'USDC',
          currentUtilization: 0,
          apy: vesuPool.apy,
          defiSpringApy: 0,
          decimals: 6,
          address: vesuPool.address || '',
          vTokenAddress: vesuPool.address || ''
        }]
      }

      await vesuDeposit(mockVesuPool, depositAmount, vesuPool.tokens[0] || 'WBTC')
      setDepositAmount("")
      onDeposit(parseFloat(depositAmount))
    } catch (error) {
      console.error('Deposit error:', error)
    }
  }

  const handleWithdraw = async () => {
    const validation = validateWBTCWithdrawal(withdrawAmount, position?.amount || 0)
    if (!validation.isValid) {
      toast({
        title: "Invalid Amount",
        description: validation.error || "Please enter a valid withdrawal amount",
        variant: "destructive"
      })
      return
    }

    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to withdraw funds",
        variant: "destructive"
      })
      return
    }

    try {
      // Find the first Vesu pool in the strategy
      const vesuPool = strategy.pools.find(pool => pool.protocol === 'Vesu')
      if (!vesuPool) {
        throw new Error('No Vesu pool found in this strategy')
      }

      // Create a mock VesuPool object for the transaction
      const mockVesuPool = {
        id: vesuPool.poolId,
        name: vesuPool.poolName,
        address: vesuPool.address || '',
        assets: [{
          name: vesuPool.tokens[0] || 'USDC',
          symbol: vesuPool.tokens[0] || 'USDC',
          currentUtilization: 0,
          apy: vesuPool.apy,
          defiSpringApy: 0,
          decimals: 6,
          address: vesuPool.address || '',
          vTokenAddress: vesuPool.address || ''
        }]
      }

      await vesuWithdraw(mockVesuPool, withdrawAmount, vesuPool.tokens[0] || 'WBTC')
      setWithdrawAmount("")
      onWithdraw(parseFloat(withdrawAmount))
    } catch (error) {
      console.error('Withdrawal error:', error)
    }
  }

  const handleRebalance = async () => {
    setIsRebalancing(true)
    try {
      await onRebalance()
      toast({
        title: "Rebalancing Initiated",
        description: "Vault rebalancing has been started. This may take a few minutes.",
      })
    } catch (error) {
      toast({
        title: "Rebalancing Failed",
        description: "Failed to initiate rebalancing. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsRebalancing(false)
    }
  }

  const maxWithdraw = position?.amount || 0

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Vault Actions
        </CardTitle>
        <CardDescription>
          Manage your position in {strategy.name}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Connection Status */}
        {!isConnected && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-yellow-800">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Wallet Not Connected</span>
            </div>
            <p className="text-xs text-yellow-700 mt-1">
              Please connect your wallet to interact with the vault
            </p>
          </div>
        )}

        {/* Transaction Error */}
        {transactionError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-red-800">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Transaction Error</span>
            </div>
            <p className="text-xs text-red-700 mt-1">{transactionError}</p>
          </div>
        )}

        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            <TabsTrigger value="manage">Manage</TabsTrigger>
          </TabsList>

          <TabsContent value="deposit" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Deposit Amount (WBTC)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.00000001"
                    min="0"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setDepositAmount(WBTC_CONFIG.VAULT.MIN_DEPOSIT.toString())}
                >
                  Max
                </Button>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-blue-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Estimated APY: {strategy.apy}%</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Based on current pool allocations and market conditions
                </p>
              </div>

              <Button 
                onClick={handleDeposit}
                disabled={isDepositing || !depositAmount || !isConnected}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isDepositing ? "Depositing..." : "Deposit WBTC"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="withdraw" className="space-y-4">
            <div className="space-y-4">
              {position ? (
                <>
                  <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Withdrawal Amount (WBTC)
                </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.00000001"
                        min="0"
                        max={maxWithdraw}
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setWithdrawAmount(maxWithdraw.toString())}
                      >
                        Max
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Available: {formatWBTCValue(maxWithdraw, false)} WBTC
                    </p>
                  </div>

                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-yellow-800">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-medium">Withdrawal Info</span>
                    </div>
                    <p className="text-xs text-yellow-600 mt-1">
                      Withdrawals may take a few minutes to process depending on pool liquidity
                    </p>
                  </div>

                  <Button 
                    onClick={handleWithdraw}
                    disabled={isWithdrawing || !withdrawAmount || !isConnected}
                    variant="outline"
                    className="w-full"
                  >
                    {isWithdrawing ? "Withdrawing..." : "Withdraw WBTC"}
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No position found</p>
                  <p className="text-sm text-gray-400">
                    You need to deposit first to withdraw funds
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="manage" className="space-y-4">
            <div className="space-y-4">
              {/* Rebalancing */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Auto Rebalancing</h4>
                    <p className="text-sm text-gray-600">
                      Manually trigger vault rebalancing
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {strategy.riskLevel} Risk
                  </Badge>
                </div>
                
                <Button 
                  onClick={handleRebalance}
                  disabled={isRebalancing}
                  variant="outline"
                  className="w-full"
                >
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  {isRebalancing ? "Rebalancing..." : "Trigger Rebalance"}
                </Button>
              </div>

              {/* Configuration */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Vault Configuration</h4>
                    <p className="text-sm text-gray-600">
                      Adjust rebalancing settings and parameters
                    </p>
                  </div>
                </div>
                
                <Button 
                  onClick={onConfigure}
                  variant="outline"
                  className="w-full"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Vault
                </Button>
              </div>

              {/* Performance History */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Performance History</h4>
                    <p className="text-sm text-gray-600">
                      View detailed performance metrics
                    </p>
                  </div>
                </div>
                
                <Button 
                  onClick={() => window.open(`/vault/${strategy.id}/history`, '_blank')}
                  variant="outline"
                  className="w-full"
                >
                  <History className="h-4 w-4 mr-2" />
                  View History
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
