"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { BarChart3, Loader2, AlertCircle } from "lucide-react"
import { compareVaultVsHodl } from "@/lib/vault-forecast-calculator"
import { useVaultForecastStats } from "@/hooks/use-vault-forecast-stats"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PerformanceChart() {
  const [timeframe, setTimeframe] = useState<number>(30)
  
  // Get real vault stats (read-only)
  const { apy, isLoading, error } = useVaultForecastStats()

  // Generate projection data using real APY
  const data = useMemo(() => {
    if (!apy || apy <= 0) {
      return []
    }

    const baseAmount = 1 // Normalized to 1 BTC for comparison
    const comparison = compareVaultVsHodl(baseAmount, timeframe, apy / 100)

    // Generate data points showing projected growth and advantage
    return comparison.vault.timeSeries.map(point => ({
      day: point.day,
      vaultBalance: point.balance,
      hodlBalance: baseAmount, // HODL stays constant
      vaultGain: point.gain, // Gain from vault strategy
      advantage: point.gain, // Advantage over HODL (same as gain since HODL has 0 gain)
    }))
  }, [apy, timeframe])

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey?: string; name?: string; value?: number; color?: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vaultEntry = payload.find((p: any) => p.dataKey === 'vaultBalance' || p.name === 'BTC Vault')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hodlEntry = payload.find((p: any) => p.dataKey === 'hodlBalance' || p.name === 'HODL')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const advantageEntry = payload.find((p: any) => p.dataKey === 'advantage' || p.name === 'Vault Advantage')
      
      return (
        <div className="bg-black text-white p-4 border border-gray-600 rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{`Day ${label}`}</p>
          {vaultEntry && vaultEntry.value !== undefined && (
            <p style={{ color: vaultEntry.color }} className="text-sm mb-1">
              {`BTC Vault: ${vaultEntry.value.toFixed(6)} BTC`}
            </p>
          )}
          {hodlEntry && hodlEntry.value !== undefined && (
            <p style={{ color: hodlEntry.color }} className="text-sm mb-1">
              {`HODL: ${hodlEntry.value.toFixed(6)} BTC`}
            </p>
          )}
          {advantageEntry && advantageEntry.value !== undefined && (
            <p style={{ color: advantageEntry.color }} className="text-sm font-semibold mt-2 pt-2 border-t border-gray-600">
              {`Advantage: +${advantageEntry.value.toFixed(6)} BTC (${((advantageEntry.value / 1) * 100).toFixed(2)}%)`}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-black border border-white shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-black/50 rounded-t-lg border-b border-white/20">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <BarChart3 className="h-5 w-5 text-white" />
            Projected Growth Comparison
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant={timeframe === 7 ? "default" : "outline"} 
              size="sm" 
              onClick={() => setTimeframe(7)}
              className={timeframe === 7 ? "bg-yellow-400 text-black" : "border-bitcoin-gold text-white hover:bg-bitcoin-gold/20 hover:text-white"}
              disabled={isLoading || !apy}
            >
              7D
            </Button>
            <Button 
              variant={timeframe === 30 ? "default" : "outline"} 
              size="sm" 
              onClick={() => setTimeframe(30)}
              className={timeframe === 30 ? "bg-yellow-400 text-black" : "border-bitcoin-gold text-white hover:bg-bitcoin-gold/20 hover:text-white"}
              disabled={isLoading || !apy}
            >
              30D
            </Button>
            <Button 
              variant={timeframe === 90 ? "default" : "outline"} 
              size="sm" 
              onClick={() => setTimeframe(90)}
              className={timeframe === 90 ? "bg-yellow-400 text-black" : "border-bitcoin-gold text-white hover:bg-bitcoin-gold/20 hover:text-white"}
              disabled={isLoading || !apy}
            >
              90D
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-80 w-full flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-white" />
              <p className="text-white/70">Loading vault data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="h-80 w-full flex items-center justify-center">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load vault data. Please try again later.
              </AlertDescription>
            </Alert>
          </div>
        ) : !apy || data.length === 0 ? (
          <div className="h-80 w-full flex items-center justify-center">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Unable to load vault APY. Please ensure the vault is configured.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ left: 60, right: 20, top: 10, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#666" 
                    fontSize={12} 
                    tickFormatter={(value) => `${value}d`}
                    label={{ value: 'Days', position: 'outside', offset: 10, style: { textAnchor: 'middle' } }}
                    height={60}
                  />
                  <YAxis 
                    stroke="#666" 
                    fontSize={12} 
                    tickFormatter={(value) => `${value.toFixed(4)}`}
                    label={{ value: 'Balance (BTC)', angle: -90, position: 'left', offset: -10, style: { textAnchor: 'middle' } }}
                    width={80}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="vaultBalance" 
                    stroke="#f59e0b" 
                    strokeWidth={3} 
                    name="BTC Vault" 
                    dot={false}
                    animationDuration={300}
                  />
                  <Line
                    type="monotone"
                    dataKey="hodlBalance"
                    stroke="#6b7280"
                    strokeWidth={2}
                    name="HODL"
                    dot={false}
                    strokeDasharray="5 5"
                    animationDuration={300}
                  />
                  <Line
                    type="monotone"
                    dataKey="advantage"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Vault Advantage"
                    dot={false}
                    strokeDasharray="3 3"
                    animationDuration={300}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-black rounded-lg border border-white shadow-md hover:shadow-lg transition-all duration-200">
                <div className="w-4 h-4 bg-bitcoin-gold rounded mx-auto mb-2"></div>
                <div className="font-semibold text-white">BTC Vault</div>
                <div className="text-sm text-bitcoin-gold">
                  {apy ? `${apy.toFixed(2)}% APY` : 'N/A'}
                </div>
                <div className="text-xs text-white/70 mt-1">Real-time from pools</div>
              </div>
              <div className="text-center p-3 bg-black rounded-lg border border-white shadow-md hover:shadow-lg transition-all duration-200">
                <div className="w-4 h-4 bg-gray-500 rounded mx-auto mb-2 border-2 border-dashed border-gray-400"></div>
                <div className="font-semibold text-white/80">HODL</div>
                <div className="text-sm text-white/80">0% APY</div>
                <div className="text-xs text-white/70 mt-1">No yield</div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="p-3 bg-bitcoin-gold/60 rounded-lg border border-bitcoin-gold">
                <div className="text-xs text-white/90">
                  <strong className="text-white">What this chart shows:</strong> This is a <strong className="text-white">projection</strong> (not historical data) showing how 1 BTC would grow over {timeframe} days if invested in the vault vs holding (HODL). The green line shows the advantage gained by using the vault strategy.
                </div>
              </div>
              <div className="p-3 bg-bitcoin-gold/60 rounded-lg border border-bitcoin-gold">
                <div className="text-xs text-white/90">
                  <strong className="text-white">Note:</strong> Projections assume the current APY ({apy.toFixed(2)}%) remains constant and daily compounding. Actual returns may vary. This is a read-only forecast and does not affect your vault.
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
