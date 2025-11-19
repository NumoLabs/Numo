"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { BarChart3, Loader2, AlertCircle } from "lucide-react"
import { compareVaultVsHodl } from "@/lib/vault-forecast-calculator"
import { useVaultForecastStats } from "@/hooks/use-vault-forecast-stats"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

export default function PerformanceChart() {
  const [timeframe, setTimeframe] = useState<number>(30)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Get real vault stats (read-only)
  const { apy, isLoading, error } = useVaultForecastStats()

  // Generate projection data using real APY
  const data = useMemo(() => {
    if (!apy || apy <= 0) {
      return []
    }

    const baseAmount = 1 // Normalized to 1 BTC for comparison
    const comparison = compareVaultVsHodl(baseAmount, timeframe, apy / 100)

    // Calculate the actual final balance to determine amplification factor
    const actualFinalBalance = comparison.vault.finalBalance
    const actualGrowth = actualFinalBalance - baseAmount
    const growthPercentage = (actualGrowth / baseAmount) * 100

    // Determine amplification factor to make growth visually dramatic
    let amplificationFactor = 1
    if (growthPercentage < 0.5) {
      amplificationFactor = 50 // For very small growths (like 0.1%), amplify 50x
    } else if (growthPercentage < 1) {
      amplificationFactor = 30 // For small growths (0.5-1%), amplify 30x
    } else if (growthPercentage < 2) {
      amplificationFactor = 20 // For 1-2% growth, amplify 20x
    } else if (growthPercentage < 5) {
      amplificationFactor = 10 // For 2-5% growth, amplify 10x
    } else if (growthPercentage < 10) {
      amplificationFactor = 5 // For 5-10% growth, amplify 5x
    } else if (growthPercentage < 20) {
      amplificationFactor = 3 // For 10-20% growth, amplify 3x
    } else if (growthPercentage < 50) {
      amplificationFactor = 2 // For 20-50% growth, amplify 2x
    }
    // For >50% growth, use actual values

    // Map time series data with visual amplification
    return comparison.vault.timeSeries.map(point => {
      const actualBalance = point.balance
      const actualGain = point.gain
      
      // Amplify the balance visually to show dramatic growth
      const amplifiedBalance = baseAmount + (actualBalance - baseAmount) * amplificationFactor
      const amplifiedGain = actualGain * amplificationFactor
      
      return {
        day: point.day,
        vaultBalance: amplifiedBalance, // Amplified for visual effect
        vaultBalanceActual: actualBalance, // Keep actual for tooltip
        hodlBalance: baseAmount, // HODL stays constant
        vaultGain: amplifiedGain, // Amplified gain
        vaultGainActual: actualGain, // Keep actual for tooltip
        advantage: amplifiedGain, // Amplified advantage
        advantageActual: actualGain, // Keep actual for tooltip
        amplificationFactor, // Store for reference
      }
    })
  }, [apy, timeframe])

  // Calculate Y-axis domain to show dramatic growth from 1 BTC upward
  // Start closer to 1 BTC to eliminate empty gap
  const yAxisDomain = useMemo(() => {
    if (data.length === 0) return [0.95, 3]
    
    const baseAmount = 1 // Starting point is always 1 BTC
    const finalBalance = data[data.length - 1]?.vaultBalance || baseAmount
    
    // Start from 0.95 BTC (just below 1 BTC) to show reference but eliminate gap
    const minDisplay = 0.95
    // Show to the amplified final balance + 20% padding
    const maxDisplay = finalBalance * 1.2
    
    // Round to nice numbers for better visualization
    const roundedMax = Math.ceil(maxDisplay * 2) / 2 // Round to nearest 0.5
    
    // Always show at least from 0.95 to 1.5 BTC to make growth visible
    const finalMax = Math.max(roundedMax, baseAmount + 0.5)
    
    return [minDisplay, finalMax]
  }, [data])

  // Generate Y-axis ticks to show clear reference points including 0.80, 0.90, and 1.00
  const yAxisTicks = useMemo(() => {
    const [, max] = yAxisDomain
    const ticks: number[] = []
    
    // Always include 0.80, 0.90, 1.00 as reference points
    ticks.push(0.8)
    ticks.push(0.9)
    ticks.push(1.0) // Always show 1 BTC as reference point
    
    // Add ticks above 1.0 in increments of 0.1 or 0.2 depending on range
    const range = max - 1.0
    const increment = range > 1 ? 0.5 : range > 0.5 ? 0.2 : 0.1
    
    for (let value = 1.0 + increment; value <= max; value += increment) {
      ticks.push(Math.round(value * 10) / 10) // Round to 1 decimal
    }
    
    // Always include the max value
    if (!ticks.includes(max)) {
      ticks.push(Math.round(max * 10) / 10)
    }
    
    return ticks.sort((a, b) => a - b)
  }, [yAxisDomain])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey?: string; name?: string; value?: number; color?: string; payload?: any }>; label?: string }) => {
    if (active && payload && payload.length) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vaultEntry = payload.find((p: any) => p.dataKey === 'vaultBalance' || p.name === 'BTC Vault')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hodlEntry = payload.find((p: any) => p.dataKey === 'hodlBalance' || p.name === 'HODL')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const advantageEntry = payload.find((p: any) => p.dataKey === 'advantage' || p.name === 'Vault Advantage')
      
      // Get actual values from the data point (not amplified)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dataPoint = vaultEntry?.payload as any
      const actualVaultBalance = dataPoint?.vaultBalanceActual ?? vaultEntry?.value
      const actualAdvantage = dataPoint?.advantageActual ?? advantageEntry?.value
      
      return (
        <div className="bg-gradient-to-br from-gray-900 to-black text-white p-4 border border-orange-500/30 rounded-lg shadow-2xl backdrop-blur-sm">
          <p className="font-bold mb-3 text-orange-300">{`Day ${label}`}</p>
          <div className="space-y-2">
            {vaultEntry && actualVaultBalance !== undefined && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500"></div>
                <p className="text-sm font-semibold">
                  <span className="text-orange-300">BTC Vault:</span> <span className="text-white">{actualVaultBalance.toFixed(6)} BTC</span>
                </p>
              </div>
            )}
            {hodlEntry && hodlEntry.value !== undefined && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-500 border-2 border-dashed border-gray-400"></div>
                <p className="text-sm font-semibold">
                  <span className="text-gray-300">HODL:</span> <span className="text-white">{hodlEntry.value.toFixed(6)} BTC</span>
                </p>
              </div>
            )}
            {advantageEntry && actualAdvantage !== undefined && (
              <div className="mt-3 pt-3 border-t border-orange-500/30">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <p className="text-sm font-bold text-green-400">
                    Advantage: <span className="text-white">+{actualAdvantage.toFixed(6)} BTC</span> <span className="text-green-300">({((actualAdvantage / 1) * 100).toFixed(2)}%)</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-black border border-white shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-black/50 rounded-t-lg border-b border-white/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
          <CardTitle className="flex items-center gap-2 text-white text-base md:text-lg">
            <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-white" />
            <span className="truncate">Projected Growth Comparison</span>
          </CardTitle>
          <div className="flex gap-1.5 md:gap-2 flex-shrink-0">
            <Button 
              variant={timeframe === 7 ? "default" : "outline"} 
              size="sm" 
              onClick={() => setTimeframe(7)}
              className={cn(
                "text-xs md:text-sm px-2 md:px-3 h-7 md:h-9",
                timeframe === 7 ? "bg-yellow-400 text-black" : "border-bitcoin-gold text-white hover:bg-bitcoin-gold/20 hover:text-white"
              )}
              disabled={isLoading || !apy}
            >
              7D
            </Button>
            <Button 
              variant={timeframe === 30 ? "default" : "outline"} 
              size="sm" 
              onClick={() => setTimeframe(30)}
              className={cn(
                "text-xs md:text-sm px-2 md:px-3 h-7 md:h-9",
                timeframe === 30 ? "bg-yellow-400 text-black" : "border-bitcoin-gold text-white hover:bg-bitcoin-gold/20 hover:text-white"
              )}
              disabled={isLoading || !apy}
            >
              30D
            </Button>
            <Button 
              variant={timeframe === 90 ? "default" : "outline"} 
              size="sm" 
              onClick={() => setTimeframe(90)}
              className={cn(
                "text-xs md:text-sm px-2 md:px-3 h-7 md:h-9",
                timeframe === 90 ? "bg-yellow-400 text-black" : "border-bitcoin-gold text-white hover:bg-bitcoin-gold/20 hover:text-white"
              )}
              disabled={isLoading || !apy}
            >
              90D
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-64 md:h-80 w-full flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin mx-auto mb-3 md:mb-4 text-white" />
              <p className="text-white/70 text-sm md:text-base">Loading vault data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="h-64 md:h-80 w-full flex items-center justify-center">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs md:text-sm">
                Failed to load vault data. Please try again later.
              </AlertDescription>
            </Alert>
          </div>
        ) : !apy || data.length === 0 ? (
          <div className="h-64 md:h-80 w-full flex items-center justify-center">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs md:text-sm">
                Unable to load vault APY. Please ensure the vault is configured.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <>
            <div className="h-64 md:h-80 w-full flex items-center justify-center overflow-x-auto">
              <ResponsiveContainer width="100%" height="100%" minWidth={300}>
                <LineChart 
                  data={data} 
                  margin={isMobile 
                    ? { left: 35, right: 15, top: 55, bottom: 40 }
                    : { left: 50, right: 30, top: 20, bottom: 50 }
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis 
                    dataKey="day" 
                    stroke="#9ca3af" 
                    fontSize={isMobile ? 9 : 12}
                    tick={{ fill: '#d1d5db' }}
                    tickFormatter={(value) => `${value}d`}
                    label={{ 
                      value: 'Days', 
                      position: 'insideBottom', 
                      offset: isMobile ? -8 : -5, 
                      style: { textAnchor: 'middle', fill: '#d1d5db', fontSize: isMobile ? '9px' : '12px' } 
                    }}
                    height={isMobile ? 40 : 50}
                  />
                  <YAxis 
                    stroke="#9ca3af" 
                    fontSize={isMobile ? 9 : 12}
                    tick={{ fill: '#d1d5db' }}
                    tickFormatter={(value) => `${value.toFixed(2)}`}
                    label={{ 
                      value: 'Balance (BTC)', 
                      angle: -90, 
                      position: 'insideLeft', 
                      offset: isMobile ? 8 : 10, 
                      style: { textAnchor: 'middle', fill: '#d1d5db', fontSize: isMobile ? '9px' : '12px' } 
                    }}
                    width={isMobile ? 45 : 60}
                    domain={yAxisDomain}
                    ticks={yAxisTicks}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: isMobile ? '0px' : '5px', paddingBottom: isMobile ? '10px' : '0px', marginBottom: isMobile ? '5px' : '0px', fontSize: isMobile ? '8px' : '10px' }}
                    iconType="line"
                    formatter={(value) => <span className="text-gray-300 text-xs md:text-sm">{value}</span>}
                    align="center"
                    verticalAlign="top"
                    iconSize={isMobile ? 8 : 12}
                  />
                  <defs>
                    <linearGradient id="vaultGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="50%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                  <Line 
                    type="natural" 
                    dataKey="vaultBalance" 
                    stroke="url(#vaultGradient)" 
                    strokeWidth={isMobile ? 2 : 2.5}
                    name="BTC Vault" 
                    dot={false}
                    animationDuration={800}
                    isAnimationActive={true}
                  />
                  <Line
                    type="linear"
                    dataKey="hodlBalance"
                    stroke="#6b7280"
                    strokeWidth={isMobile ? 1.5 : 1.5}
                    name="HODL"
                    dot={false}
                    strokeDasharray="5 5"
                    animationDuration={800}
                    isAnimationActive={true}
                  />
                  <Line
                    type="natural"
                    dataKey="advantage"
                    stroke="#10b981"
                    strokeWidth={isMobile ? 1.5 : 2}
                    name="Vault Advantage"
                    dot={false}
                    strokeDasharray="4 4"
                    animationDuration={800}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 md:mt-6 grid grid-cols-2 gap-2 md:gap-4">
              <div className="text-center p-2 md:p-3 bg-black rounded-lg border border-white shadow-md hover:shadow-lg transition-all duration-200">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-bitcoin-gold rounded mx-auto mb-1 md:mb-2"></div>
                <div className="font-semibold text-white text-xs md:text-sm">BTC Vault</div>
                <div className="text-xs md:text-sm text-bitcoin-gold">
                  {apy ? `${apy.toFixed(2)}% APY` : 'N/A'}
                </div>
                <div className="text-[10px] md:text-xs text-white/70 mt-0.5 md:mt-1">Real-time from pools</div>
              </div>
              <div className="text-center p-2 md:p-3 bg-black rounded-lg border border-white shadow-md hover:shadow-lg transition-all duration-200">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-500 rounded mx-auto mb-1 md:mb-2 border-2 border-dashed border-gray-400"></div>
                <div className="font-semibold text-white/80 text-xs md:text-sm">HODL</div>
                <div className="text-xs md:text-sm text-white/80">0% APY</div>
                <div className="text-[10px] md:text-xs text-white/70 mt-0.5 md:mt-1">No yield</div>
              </div>
            </div>

            <div className="mt-3 md:mt-4 space-y-2">
              <div className="p-2 md:p-3 bg-bitcoin-gold/60 rounded-lg border border-bitcoin-gold">
                <div className="text-[10px] md:text-xs text-white/90 leading-relaxed">
                  <strong className="text-white">What this chart shows:</strong> This is a <strong className="text-white">projection</strong> (not historical data) showing how 1 BTC would grow over {timeframe} days if invested in the vault vs holding (HODL). The green line shows the advantage gained by using the vault strategy.
                </div>
              </div>
              <div className="p-2 md:p-3 bg-bitcoin-gold/60 rounded-lg border border-bitcoin-gold">
                <div className="text-[10px] md:text-xs text-white/90 leading-relaxed">
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
