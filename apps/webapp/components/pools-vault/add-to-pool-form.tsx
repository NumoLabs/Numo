"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, Shield, Zap, Loader2, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PoolData {
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
}

interface AddToPoolFormProps {
  poolData: PoolData
  onAddToPool: (amount: number) => void
  isLoading: boolean
}

export function AddToPoolForm({ poolData, onAddToPool, isLoading }: AddToPoolFormProps) {
  const [amount, setAmount] = useState("")
  const [walletBalance, setWalletBalance] = useState(2.5) // Mock balance in WBTC
  const { toast } = useToast()

  const handleAmountChange = (value: string) => {
    setAmount(value)
  }

  const handleMaxAmount = () => {
    setAmount(walletBalance.toString())
  }

  const handleAddToPool = () => {
    const numAmount = Number(amount)
    if (numAmount < poolData.minDeposit) {
      toast({
        title: "Amount Too Low",
        description: `Minimum deposit is ${poolData.minDeposit.toFixed(3)} ${poolData.token}`,
        variant: "destructive",
      })
      return
    }
    if (numAmount > poolData.maxDeposit) {
      toast({
        title: "Amount Too High",
        description: `Maximum deposit is ${poolData.maxDeposit.toFixed(2)} ${poolData.token}`,
        variant: "destructive",
      })
      return
    }
    if (numAmount > walletBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this deposit",
        variant: "destructive",
      })
      return
    }
    
    onAddToPool(numAmount)
  }

  const isValidAmount = amount && 
    Number(amount) >= poolData.minDeposit && 
    Number(amount) <= poolData.maxDeposit && 
    Number(amount) <= walletBalance

  const estimatedRewards = amount && !isNaN(Number(amount)) 
    ? (Number(amount) * poolData.apy) / 100 
    : 0

  return (
    <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-cyan-200/50 dark:border-cyan-800/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-green-500" />
          Add to Pool
        </CardTitle>
        <CardDescription>
          Deposit funds to start earning {poolData.apy}% APY
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="deposit-amount">Amount ({poolData.token})</Label>
          <div className="flex gap-2">
            <Input
              id="deposit-amount"
              type="number"
              placeholder={`${poolData.minDeposit}`}
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="text-lg"
            />
            <Button
              variant="outline"
              onClick={handleMaxAmount}
              className="shrink-0"
            >
              Max
            </Button>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Balance: {poolData.token === "BTC" ? walletBalance.toFixed(4) : walletBalance.toFixed(2)} {poolData.token}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              Min: {poolData.minDeposit.toFixed(3)} | Max: {poolData.maxDeposit.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Estimated Rewards */}
        {isValidAmount && (
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-lg border border-green-200/50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm mb-1">Estimated Annual Rewards</h4>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  {estimatedRewards.toFixed(2)} {poolData.token}
                </p>
              </div>
              <Badge variant="outline" className="bg-green-100 dark:bg-green-900/20">
                {poolData.apy}% APY
              </Badge>
            </div>
          </div>
        )}

        {/* Pool Summary */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Pool Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Pool Name</span>
              <span className="font-medium">{poolData.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Current APY</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {poolData.apy}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Risk Level</span>
              <Badge variant="outline" className="bg-orange-100 dark:bg-orange-900/20">
                {poolData.riskLevel}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Strategy</span>
              <span className="font-medium">{poolData.strategy}</span>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Benefits</h4>
          <div className="grid gap-2">
            <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/50 dark:to-orange-950/50 rounded-lg border border-yellow-200/50">
              <TrendingUp className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">High yield returns</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 rounded-lg border border-blue-200/50">
              <Shield className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Audited smart contracts</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-lg border border-green-200/50">
              <Zap className="h-4 w-4 text-green-500" />
              <span className="text-sm">Automated strategies</span>
            </div>
          </div>
        </div>

        {/* Fees */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Fees & Terms</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Deposit Fee</span>
              <span className="font-medium">0%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Withdrawal Fee</span>
              <span className="font-medium">0.1%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Performance Fee</span>
              <span className="font-medium">10%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Lock Period</span>
              <span className="font-medium">None</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleAddToPool}
          disabled={!isValidAmount || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Adding to Pool...
            </>
          ) : (
            <>
              <ArrowRight className="h-4 w-4 mr-2" />
              Add to Pool
            </>
          )}
        </Button>

        {/* Warning */}
        <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50 rounded-lg border border-orange-200/50">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-orange-500 mt-0.5" />
            <div className="text-xs">
              <p className="font-medium text-orange-800 dark:text-orange-200 mb-1">
                Important Notice
              </p>
              <p className="text-orange-700 dark:text-orange-300">
                DeFi investments carry risks. Only invest what you can afford to lose. 
                Past performance doesn't guarantee future returns.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 