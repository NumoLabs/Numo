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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Amount to Withdraw</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
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
              className="pr-16"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Bitcoin className="h-4 w-4 text-amber-500" />
              <span className="ml-1 text-sm font-medium">BTC</span>
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Available balance: {maxAmount}</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={onMaxClick}>
              Use max
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Quick Amounts</Label>
          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map((quick) => (
              <Button
                key={quick.label}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAmount(quick.value)}
                className="text-xs"
              >
                {quick.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <p className="text-xs text-amber-700 dark:text-amber-300">
            💡 <strong>Tip:</strong> Consider leaving a small amount in the vault to continue generating returns. You can withdraw the rest when needed.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
