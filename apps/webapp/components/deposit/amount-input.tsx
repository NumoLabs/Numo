"use client"

import { Bitcoin, Coins } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { WalletBalance } from "@/lib/deposit-data"

interface AmountInputProps {
  amount: string
  onAmountChange: (amount: string) => void
  selectedToken: "btc" | "wbtc"
  onTokenChange: (token: "btc" | "wbtc") => void
  walletBalance: WalletBalance
}

export function AmountInput({ amount, onAmountChange, selectedToken, onTokenChange, walletBalance }: AmountInputProps) {
  const quickAmounts = [
    { label: "25%", value: 0.25 },
    { label: "50%", value: 0.5 },
    { label: "75%", value: 0.75 },
    { label: "100%", value: 1.0 },
  ]

  const getMaxAmount = () => {
    return selectedToken === "btc"
      ? Number.parseFloat(walletBalance.btc.replace(" BTC", ""))
      : Number.parseFloat(walletBalance.wbtc.replace(" WBTC", ""))
  }

  const getMaxAmountString = () => {
    return selectedToken === "btc" ? walletBalance.btc : walletBalance.wbtc
  }

  const getTokenIcon = () => {
    return selectedToken === "btc" ? (
      <Bitcoin className="h-4 w-4 text-orange-500" />
    ) : (
      <Coins className="h-4 w-4 text-blue-500" />
    )
  }

  const getTokenSymbol = () => {
    return selectedToken === "btc" ? "BTC" : "WBTC"
  }

  const handleQuickAmount = (percentage: number) => {
    const maxAmount = getMaxAmount()
    const quickAmount = (maxAmount * percentage).toFixed(6)
    onAmountChange(quickAmount)
  }

  const handleMaxClick = () => {
    const maxAmount = getMaxAmount()
    onAmountChange(maxAmount.toString())
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Cantidad a Depositar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Token Selection */}
        <div className="space-y-2">
          <Label>Seleccionar Token</Label>
          <Tabs value={selectedToken} onValueChange={(value) => onTokenChange(value as "btc" | "wbtc")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="btc" className="gap-2">
                <Bitcoin className="h-4 w-4 text-orange-500" />
                BTC
              </TabsTrigger>
              <TabsTrigger value="wbtc" className="gap-2">
                <Coins className="h-4 w-4 text-blue-500" />
                WBTC
              </TabsTrigger>
            </TabsList>
            <TabsContent value="btc" className="mt-3">
              <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  <strong>Bitcoin nativo</strong> - Se convertirá automáticamente a WBTC para operar en la vault
                </p>
              </div>
            </TabsContent>
            <TabsContent value="wbtc" className="mt-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Wrapped Bitcoin</strong> - Listo para usar directamente en protocolos DeFi
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount">Cantidad</Label>
          <div className="relative">
            <Input
              id="amount"
              placeholder="0.0"
              type="number"
              step="0.000001"
              min="0"
              max={getMaxAmount()}
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              className="pr-20"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {getTokenIcon()}
              <span className="ml-1 text-sm font-medium">{getTokenSymbol()}</span>
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Balance disponible: {getMaxAmountString()}</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={handleMaxClick}>
              Usar máximo
            </Button>
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="space-y-2">
          <Label>Cantidades Rápidas</Label>
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

        <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-xs text-green-700 dark:text-green-300">
            💡 <strong>Consejo:</strong> Los depósitos no tienen comisiones de entrada. Solo pagas el gas de la
            transacción. Tus fondos comenzarán a generar rendimientos inmediatamente.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
