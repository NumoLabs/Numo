"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calculator, TrendingUp } from "lucide-react"
import { calculateForecast, type ForecastData } from "@/lib/forecast-data"

export default function YieldSimulator() {
  const [amount, setAmount] = useState<string>("1")
  const [days, setDays] = useState<string>("30")
  const [forecast, setForecast] = useState<ForecastData | null>(null)

  const handleCalculate = () => {
    const amountNum = Number.parseFloat(amount) || 0
    const daysNum = Number.parseInt(days) || 0

    if (amountNum > 0 && daysNum > 0) {
      const result = calculateForecast(amountNum, daysNum)
      setForecast(result)
    }
  }

  const formatBTC = (value: number) => {
    return value.toFixed(6)
  }

  const formatUSD = (btcAmount: number) => {
    const btcPrice = 45000 // Mock BTC price
    return (btcAmount * btcPrice).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <Card className="bg-white dark:bg-gray-900 border-2 border-bitcoin-gold shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-bitcoin-gold/10 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-bitcoin-orange">
            <Calculator className="h-5 w-5 text-bitcoin-gold" />
            Yield Simulator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount of BTC (or WBTC)</Label>
            <Input
              id="amount"
              type="number"
              step="0.001"
              placeholder="1.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="days">Number of Days</Label>
            <Input
              id="days"
              type="number"
              placeholder="30"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="text-lg"
            />
          </div>

          <Button
            onClick={handleCalculate}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            Calculate Forecast
          </Button>

          <div className="grid grid-cols-3 gap-2 text-sm">
            <Button variant="outline" size="sm" onClick={() => setDays("7")} className="text-xs border-bitcoin-gold text-white hover:bg-bitcoin-gold/20 hover:text-white">
              7 days
            </Button>
            <Button variant="outline" size="sm" onClick={() => setDays("30")} className="text-xs border-bitcoin-gold text-white hover:bg-bitcoin-gold/20 hover:text-white">
              30 days
            </Button>
            <Button variant="outline" size="sm" onClick={() => setDays("90")} className="text-xs border-bitcoin-gold text-white hover:bg-bitcoin-gold/20 hover:text-white">
              90 days
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card className="bg-white dark:bg-gray-900 border-2 border-bitcoin-gold shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-bitcoin-gold/10 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-bitcoin-orange">
            <TrendingUp className="h-5 w-5 text-bitcoin-gold" />
            Forecast Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          {forecast ? (
            <div className="space-y-4">
              <div className="text-sm text-white mb-4">
                Projections for {formatBTC(forecast.amount)} BTC over {forecast.days} days
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-yellow-100/50 dark:bg-yellow-900/20 rounded-lg border-2 border-bitcoin-gold shadow-md hover:shadow-lg transition-all duration-200">
                  <div>
                    <div className="font-semibold text-bitcoin-orange">BTC Vault Strategy</div>
                    <div className="text-sm text-white">Estimated Gain</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-bitcoin-orange">+{formatBTC(forecast.vaultGain)} BTC</div>
                    <div className="text-sm text-white">{formatUSD(forecast.vaultGain)}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <div className="font-semibold text-gray-700">HODL Strategy</div>
                    <div className="text-sm text-white">Estimated Gain</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-700">+{formatBTC(forecast.hodlGain)} BTC</div>
                    <div className="text-sm text-white">{formatUSD(forecast.hodlGain)}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-green-100/50 dark:bg-green-900/20 rounded-lg border-2 border-green-400 shadow-md hover:shadow-lg transition-all duration-200">
                  <div>
                    <div className="font-semibold text-green-700">Vesu Only</div>
                    <div className="text-sm text-white">Estimated Gain</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-green-700">+{formatBTC(forecast.vesuGain)} BTC</div>
                    <div className="text-sm text-white">{formatUSD(forecast.vesuGain)}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-orange-100/50 dark:bg-orange-900/20 rounded-lg border-2 border-bitcoin-orange shadow-md hover:shadow-lg transition-all duration-200">
                  <div>
                    <div className="font-semibold text-bitcoin-orange">Ekubo Only</div>
                    <div className="text-sm text-white">Estimated Gain</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-bitcoin-orange">+{formatBTC(forecast.ekuboGain)} BTC</div>
                    <div className="text-sm text-white">{formatUSD(forecast.ekuboGain)}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-100/50 dark:bg-yellow-900/20 rounded-lg border-2 border-bitcoin-gold shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-bitcoin-gold" />
                  <span className="font-semibold text-bitcoin-orange">Vault Advantage</span>
                </div>
                <div className="text-sm text-white">
                  BTC Vault outperforms HODL by{" "}
                  <span className="font-semibold text-bitcoin-orange">
                    +{formatBTC(forecast.vaultGain - forecast.hodlGain)} BTC
                  </span>{" "}
                  ({formatUSD(forecast.vaultGain - forecast.hodlGain)})
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Enter amount and days to see forecast results</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
