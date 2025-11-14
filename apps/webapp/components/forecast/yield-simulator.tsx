"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calculator, TrendingUp, Loader2, AlertCircle } from "lucide-react"
import { calculateVaultForecast, compareVaultVsHodl } from "@/lib/vault-forecast-calculator"
import { useVaultForecastStats } from "@/hooks/use-vault-forecast-stats"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function YieldSimulator() {
  const [amount, setAmount] = useState<string>("1")
  const [days, setDays] = useState<string>("30")
  
  // Get real vault stats (read-only)
  const { apy, isLoading, error } = useVaultForecastStats()

  // Calculate forecast using real APY
  const forecast = useMemo(() => {
    const amountNum = Number.parseFloat(amount) || 0
    const daysNum = Number.parseInt(days) || 0

    // Only calculate if we have real APY data
    if (amountNum > 0 && daysNum > 0 && apy !== null && apy > 0) {
      const vaultForecast = calculateVaultForecast({
        initialAmount: amountNum,
        days: daysNum,
        apy: apy / 100, // Convert percentage to decimal
        compoundingFrequency: 'daily',
      })

      // Compare with HODL
      const comparison = compareVaultVsHodl(amountNum, daysNum, apy / 100)

      return {
        amount: amountNum,
        days: daysNum,
        vaultGain: vaultForecast.totalGain,
        hodlGain: 0, // HODL has no gain
        vaultFinalBalance: vaultForecast.finalBalance,
        hodlFinalBalance: amountNum,
        advantage: comparison.advantage,
        advantagePercentage: comparison.advantagePercentage,
      }
    }

    return null
  }, [amount, days, apy])

  const formatBTC = (value: number) => {
    return value.toFixed(6)
  }

  // Note: BTC price would ideally come from an oracle/API, but for now we'll show BTC only
  // to avoid hardcoded prices
  // const formatUSD = (btcAmount: number) => {
  //   // We don't have a real BTC price API, so we'll just show the BTC amount
  //   // In a production app, you'd fetch this from an oracle
  //   return `${btcAmount.toFixed(6)} BTC`
  // }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <Card className="bg-black border border-white shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-black/50 rounded-t-lg border-b border-white/20">
          <CardTitle className="flex items-center gap-2 text-white">
            <Calculator className="h-5 w-5 text-white" />
            Yield Simulator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Loading State */}
          {isLoading && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>Loading vault data...</AlertDescription>
            </Alert>
          )}

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load vault data. Please try again later.
              </AlertDescription>
            </Alert>
          )}

          {/* APY Display */}
          {apy !== null && !isLoading && (
            <div className="p-3 bg-white/10 rounded-lg border border-white/30">
              <div className="text-sm text-white/70">Current Vault APY</div>
              <div className="text-2xl font-bold text-bitcoin-gold">{apy.toFixed(2)}%</div>
              <div className="text-xs text-white/60 mt-1">
                Based on real-time pool yields from Vesu
              </div>
            </div>
          )}

          {!apy && !isLoading && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Unable to load vault APY. Please ensure you&apos;re connected and the vault has pools configured.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-white">Amount of BTC</Label>
            <Input
              id="amount"
              type="number"
              step="0.00000001"
              min="0"
              placeholder="0.1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg bg-black border-white text-white"
              disabled={isLoading || !apy}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="days" className="text-white">Number of Days</Label>
            <Input
              id="days"
              type="number"
              placeholder="30"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="text-lg bg-black border-white text-white"
              disabled={isLoading || !apy}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-sm">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setDays("7")} 
              className="text-xs border-white text-white hover:bg-white/20 hover:text-white"
              disabled={isLoading || !apy}
            >
              7 days
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setDays("30")} 
              className="text-xs border-white text-white hover:bg-white/20 hover:text-white"
              disabled={isLoading || !apy}
            >
              30 days
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setDays("90")} 
              className="text-xs border-white text-white hover:bg-white/20 hover:text-white"
              disabled={isLoading || !apy}
            >
              90 days
            </Button>
          </div>

          <div className="text-xs text-white/70 p-3 bg-white/10 rounded-lg border border-white/20">
            <strong className="text-white">Note:</strong> Forecasts are based on the current vault APY and assume daily compounding.
            Actual returns may vary based on market conditions and pool performance.
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card className="bg-black border border-white shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-black/50 rounded-t-lg border-b border-white/20">
          <CardTitle className="flex items-center gap-2 text-white">
            <TrendingUp className="h-5 w-5 text-white" />
            Forecast Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-white" />
              <p className="text-white/70">Loading vault data...</p>
            </div>
          ) : !apy ? (
            <div className="text-center py-12 text-white/70">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-white/50" />
              <p>Unable to load vault APY. Please ensure the vault is configured.</p>
            </div>
          ) : forecast ? (
            <div className="space-y-4">
              <div className="text-sm text-white/70 mb-4">
                Projections for {formatBTC(forecast.amount)} BTC over {forecast.days} days
                <br />
                <span className="text-xs">Based on current vault APY: {apy.toFixed(2)}%</span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg border border-white/30 shadow-md hover:shadow-lg transition-all duration-200">
                  <div>
                    <div className="font-semibold text-white">BTC Vault Strategy</div>
                    <div className="text-sm text-white/70">Final Balance</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-bitcoin-gold">{formatBTC(forecast.vaultFinalBalance)} BTC</div>
                    <div className="text-sm text-white/70">+{formatBTC(forecast.vaultGain)} gain</div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/20">
                  <div>
                    <div className="font-semibold text-white/80">HODL Strategy</div>
                    <div className="text-sm text-white/70">Final Balance</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-white/80">{formatBTC(forecast.hodlFinalBalance)} BTC</div>
                    <div className="text-sm text-white/70">+{formatBTC(forecast.hodlGain)} gain</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/30 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-bitcoin-gold" />
                  <span className="font-semibold text-white">Vault Advantage</span>
                </div>
                <div className="text-sm text-white/80">
                  BTC Vault outperforms HODL by{" "}
                  <span className="font-semibold text-bitcoin-gold">
                    +{formatBTC(forecast.advantage)} BTC
                  </span>{" "}
                  ({forecast.advantagePercentage.toFixed(2)}% additional return)
                </div>
              </div>

              <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/20">
                <div className="text-xs text-white/70">
                  <strong className="text-white">Disclaimer:</strong> These projections are estimates based on current APY and assume the APY remains constant.
                  Actual returns may vary. This is a read-only forecast and does not affect your vault.
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-white/70">
              <Calculator className="h-12 w-12 mx-auto mb-4 text-white/50" />
              <p>Enter amount and days to see forecast results</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
