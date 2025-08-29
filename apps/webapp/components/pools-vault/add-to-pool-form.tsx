"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, TrendingUp, ArrowRight, Loader2, Shield } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

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
  const [amount, setAmount] = useState('')
  const [walletBalance] = useState(2.5) // Mock balance in WBTC
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
    <Card className="bg-gradient-to-br from-white/90 via-yellow-50/30 to-orange-50/30 dark:from-gray-900/90 dark:via-yellow-950/20 dark:to-orange-950/20 backdrop-blur-xl border-2 border-gradient-to-r from-bitcoin-gold/40 via-bitcoin-orange/40 to-yellow-400/40 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-bitcoin-gold/5 to-bitcoin-orange/5 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-bitcoin-orange">
          <CheckCircle className="h-5 w-5 text-bitcoin-gold" />
          Add to Pool
        </CardTitle>
        <CardDescription className="text-muted-foreground">
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
          <div className="p-4 bg-gradient-to-br from-yellow-100/50 via-bitcoin-gold/30 to-yellow-200/50 dark:from-yellow-900/30 dark:via-bitcoin-gold/20 dark:to-yellow-800/20 rounded-lg border-2 border-gradient-to-r from-yellow-300/40 to-bitcoin-gold/40 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm mb-1">Estimated Annual Rewards</h4>
                <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                  {estimatedRewards.toFixed(2)} {poolData.token}
                </p>
              </div>
              <Badge variant="outline" className="bg-gradient-to-r from-yellow-400/20 to-bitcoin-gold/20 text-yellow-700 dark:text-yellow-300 border-2 border-gradient-to-r from-yellow-400/40 to-bitcoin-gold/40">
                {poolData.apy}% APY
              </Badge>
            </div>
          </div>
        )}

        {/* Pool Summary */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-bitcoin-orange">Pool Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Pool Name</span>
              <span className="font-medium">{poolData.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Current APY</span>
              <span className="font-medium text-yellow-600 dark:text-yellow-400">
                {poolData.apy}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Risk Level</span>
              <Badge variant="outline" className="bg-gradient-to-r from-orange-400/20 to-bitcoin-orange/20 text-orange-700 dark:text-orange-300 border-2 border-gradient-to-r from-orange-400/40 to-bitcoin-orange/40">
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
          <h4 className="font-medium text-sm text-bitcoin-orange">Benefits</h4>
          <div className="grid gap-2">
            <div className="flex items-center gap-2 p-2 bg-gradient-to-br from-yellow-100/30 via-bitcoin-gold/20 to-orange-100/30 dark:from-yellow-900/20 dark:via-bitcoin-gold/10 dark:to-orange-800/10 rounded-lg border-2 border-gradient-to-r from-yellow-200/40 via-bitcoin-gold/40 to-orange-200/40 shadow-md hover:shadow-lg transition-all duration-200">
              <TrendingUp className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm">High yield returns</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gradient-to-br from-orange-100/30 via-bitcoin-orange/20 to-red-100/30 dark:from-orange-900/20 dark:via-bitcoin-orange/10 dark:to-red-800/10 rounded-lg border-2 border-gradient-to-r from-orange-200/40 via-bitcoin-orange/40 to-red-200/40 shadow-md hover:shadow-lg transition-all duration-200">
              <Shield className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <span className="text-sm">Audited smart contracts</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gradient-to-br from-yellow-100/30 via-bitcoin-gold/20 to-yellow-200/30 dark:from-yellow-900/20 dark:via-bitcoin-gold/10 dark:to-yellow-800/10 rounded-lg border-2 border-gradient-to-r from-yellow-200/40 to-bitcoin-gold/40 shadow-md hover:shadow-lg transition-all duration-200">
              <CheckCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm">Automated strategies</span>
            </div>
          </div>
        </div>

        {/* Fees */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-bitcoin-orange">Fees & Terms</h4>
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
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
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
        <div className="p-3 bg-gradient-to-br from-yellow-100/30 via-bitcoin-gold/20 to-orange-100/30 dark:from-yellow-900/20 dark:via-bitcoin-gold/10 dark:to-orange-800/10 rounded-lg border-2 border-gradient-to-r from-yellow-200/40 via-bitcoin-gold/40 to-orange-200/40 shadow-md">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div className="text-xs">
              <p className="font-medium text-yellow-700 dark:text-yellow-300 mb-1">
                Important Notice
              </p>
              <p className="text-orange-700 dark:text-orange-300">
                DeFi investments carry risks. Only invest what you can afford to lose. 
                Past performance doesn&apos;t guarantee future returns.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 