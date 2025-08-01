"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, RefreshCw, TrendingUp, Zap, AlertCircle, Bitcoin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BitcoinSwapProps {
  onSwapSubmit: (amount: string) => void
  currentAmount: string
  bitcoinWallet: string
  starknetWallet: string
}

export function BitcoinSwap({ onSwapSubmit, currentAmount, bitcoinWallet, starknetWallet }: BitcoinSwapProps) {
  const [amount, setAmount] = useState(currentAmount)
  const [isLoading, setIsLoading] = useState(false)
  const [swapRate, setSwapRate] = useState(1.0)
  const [gasEstimate, setGasEstimate] = useState(0.005)
  const { toast } = useToast()

  const handleAmountChange = (value: string) => {
    setAmount(value)
    // Simulate rate calculation
    if (value && !isNaN(Number(value))) {
      setSwapRate(1.0 + Math.random() * 0.02) // Small variation
    }
  }

  const handleRefreshRate = async () => {
    setIsLoading(true)
    try {
      // Simulate API call to get fresh rate
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSwapRate(1.0 + Math.random() * 0.02)
      toast({
        title: "Rate Updated",
        description: "Latest exchange rate has been fetched",
      })
    } catch (error) {
      toast({
        title: "Rate Update Failed",
        description: "Could not fetch latest rate",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwap = () => {
    if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
      onSwapSubmit(amount)
      toast({
        title: "Bridge Initiated",
        description: `Bridging ${amount} BTC to WBTC`,
      })
    } else {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to bridge",
        variant: "destructive",
      })
    }
  }

  const estimatedWBTC = amount && !isNaN(Number(amount)) ? Number(amount) * swapRate : 0
  const isValidAmount = amount && !isNaN(Number(amount)) && Number(amount) > 0

  return (
    <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-orange-200/50 dark:border-orange-800/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          Bridge Bitcoin to WBTC
        </CardTitle>
        <CardDescription>
          Bridge your Bitcoin to WBTC using LayerSwap
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Wallet Information */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/50 dark:to-orange-950/50 rounded-lg border border-yellow-200/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Bitcoin className="h-4 w-4 text-yellow-500" />
                <span className="font-medium text-sm">Source</span>
              </div>
              <Badge variant="secondary">Bitcoin</Badge>
            </div>
            <div className="max-w-full overflow-hidden">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-mono break-all word-break-all leading-relaxed">
                {bitcoinWallet || "No wallet connected"}
              </p>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/50 dark:to-yellow-950/50 rounded-lg border border-orange-200/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-orange-500" />
                <span className="font-medium text-sm">Destination</span>
              </div>
              <Badge variant="outline" className="bg-orange-100 dark:bg-orange-900/20">
                StarkNet
              </Badge>
            </div>
            <div className="max-w-full overflow-hidden">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-mono break-all word-break-all leading-relaxed">
                {starknetWallet || "No wallet configured"}
              </p>
            </div>
          </div>
        </div>

        {/* Bridge Interface */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="swap-amount">Amount to Bridge (BTC)</Label>
            <Input
              id="swap-amount"
              type="number"
              placeholder="0.1"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="text-lg"
            />
          </div>

          {/* Exchange Rate */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Exchange Rate:</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                1 BTC = {swapRate.toFixed(4)} WBTC
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefreshRate}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>

          {/* Estimated Output */}
          {isValidAmount && (
            <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/50 dark:to-yellow-950/50 rounded-lg border border-orange-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm mb-1">Estimated Output</h4>
                  <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    {estimatedWBTC.toFixed(4)} WBTC
                  </p>
                </div>
                <Badge variant="outline" className="bg-orange-100 dark:bg-orange-900/20">
                  WBTC
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Bridge Details */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Bridge Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Protocol</span>
              <span className="font-medium">LayerSwap</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Source Network</span>
              <span className="font-medium">Bitcoin</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Destination Network</span>
              <span className="font-medium">StarkNet</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Bridge Fee</span>
              <span className="font-medium">0.1%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Estimated Time</span>
              <span className="font-medium">~10 minutes</span>
            </div>
          </div>
        </div>

        {/* Swap Benefits */}
        <div className="grid gap-3 md:grid-cols-2">
          <div className="p-3 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/50 dark:to-yellow-950/50 rounded-lg border border-orange-200/50">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-orange-500" />
              <span className="font-medium text-sm">Fast Bridge</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Optimized LayerSwap routing
            </p>
          </div>
          <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/50 dark:to-orange-950/50 rounded-lg border border-yellow-200/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-yellow-500" />
              <span className="font-medium text-sm">Secure Bridge</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Trusted LayerSwap protocol
            </p>
          </div>
        </div>

        {/* Warning */}
        <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/50 dark:to-orange-950/50 rounded-lg border border-yellow-200/50">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                Important Notice
              </p>
              <p className="text-yellow-700 dark:text-yellow-300 text-xs">
                This bridge will convert your Bitcoin to WBTC using LayerSwap and send it to StarkNet. 
                Ensure you have sufficient funds and that your StarkNet wallet is correct.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleSwap}
          disabled={!isValidAmount}
          className="w-full"
          size="lg"
        >
          <ArrowRight className="h-4 w-4 mr-2" />
          Execute Bridge
        </Button>
      </CardContent>
    </Card>
  )
} 