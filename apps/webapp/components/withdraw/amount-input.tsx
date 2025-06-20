"use client"

import { Bitcoin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AmountInputProps {
  amount: string
  onAmountChange: (amount: string) => void
  maxAmount: string
  onMaxClick: () => void
}

export function AmountInput({ amount, onAmountChange, maxAmount, onMaxClick }: AmountInputProps) {
  const quickAmounts = [
    { label: "25%", value: 0.25 },
    { label: "50%", value: 0.5 },
    { label: "75%", value: 0.75 },
    { label: "100%", value: 1.0 },
  ]

  const handleQuickAmount = (percentage: number) => {
    const maxAmountNum = Number.parseFloat(maxAmount.replace(" BTC", ""))
    const quickAmount = (maxAmountNum * percentage).toFixed(6)
    onAmountChange(quickAmount)
  }

  return (
    <Card className="border-0 shadow-xl bg-white dark:bg-gray-800/50 backdrop-blur-sm">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500" />
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
            <Bitcoin className="h-5 w-5 text-white" />
          </div>
          Amount to Withdraw
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="amount" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Amount
          </Label>
          <div className="relative">
            <Input
              id="amount"
              placeholder="0.0"
              type="number"
              step="0.000001"
              min="0"
              max={Number.parseFloat(maxAmount.replace(" BTC", ""))}
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              className="pr-20 h-14 text-lg font-semibold border-2 focus:border-amber-500 transition-all duration-300"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full">
                <Bitcoin className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">BTC</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Available balance: {maxAmount}</span>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-amber-600 hover:text-amber-700 font-semibold transition-colors duration-300"
              onClick={onMaxClick}
            >
              Use max
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Quick Amounts</Label>
          <div className="grid grid-cols-4 gap-3">
            {quickAmounts.map((quick) => (
              <Button
                key={quick.label}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAmount(quick.value)}
                className="h-12 font-semibold border-2 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-all duration-300 hover:scale-105"
              >
                {quick.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-xl border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
            💡 <strong>Tip:</strong> Consider leaving a small amount in the vault to continue generating returns. You
            can withdraw the rest when needed.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
