"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Target, Zap, Shield, BarChart, Loader2, AlertCircle } from "lucide-react"
import { useVaultForecastStats } from "@/hooks/use-vault-forecast-stats"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { calculateVaultForecast } from "@/lib/vault-forecast-calculator"

export default function InsightsDashboard() {
  const { apy, totalAssets, totalAssetsFormatted, userPosition, isLoading, error } = useVaultForecastStats()

  // Calculate forecast metrics for insights
  const forecastMetrics = useMemo(() => {
    if (!apy || apy <= 0) {
      return null
    }

    const baseAmount = 1 // 1 BTC for calculations
    const dailyForecast = calculateVaultForecast({
      initialAmount: baseAmount,
      days: 1,
      apy: apy / 100,
      compoundingFrequency: 'daily',
    })

    const monthlyForecast = calculateVaultForecast({
      initialAmount: baseAmount,
      days: 30,
      apy: apy / 100,
      compoundingFrequency: 'daily',
    })

    const yearlyForecast = calculateVaultForecast({
      initialAmount: baseAmount,
      days: 365,
      apy: apy / 100,
      compoundingFrequency: 'daily',
    })

    return {
      dailyYield: dailyForecast.summary.dailyGain,
      monthlyYield: monthlyForecast.summary.monthlyGain,
      yearlyYield: yearlyForecast.summary.yearlyGain,
      yearlyAPY: apy,
    }
  }, [apy])

  return (
    <div className="space-y-8">
      {/* Loading State */}
      {isLoading && (
        <Card className="bg-black border border-white">
          <CardContent className="py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-white" />
              <p className="text-white/70">Loading vault insights...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="bg-black border border-white">
          <CardContent className="py-12">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load vault data. Please try again later.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Key Insights - Only show if we have real data */}
      {!isLoading && !error && apy && forecastMetrics && (
        <>
          <Card className="bg-black border border-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-black/50 rounded-t-lg border-b border-white/20">
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="h-5 w-5 text-white" />
                Vault Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white/10 rounded-lg border border-white/30 shadow-md hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">Current Vault APY</h3>
                    <TrendingUp className="h-4 w-4 text-bitcoin-gold" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-bitcoin-gold">{apy.toFixed(2)}%</span>
                  </div>
                  <p className="text-sm text-white/70">
                    Annual Percentage Yield calculated from real-time pool yields
                  </p>
                </div>

                {totalAssets && (
                  <div className="p-4 bg-white/10 rounded-lg border border-white/30 shadow-md hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white">Total Vault Assets</h3>
                      <BarChart className="h-4 w-4 text-bitcoin-gold" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-bitcoin-gold">{totalAssetsFormatted} BTC</span>
                    </div>
                    <p className="text-sm text-white/70">
                      Total assets currently managed by the vault
                    </p>
                  </div>
                )}

                {forecastMetrics && (
                  <>
                    <div className="p-4 bg-white/10 rounded-lg border border-white/30 shadow-md hover:shadow-lg transition-all duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white">Estimated Daily Yield</h3>
                        <TrendingUp className="h-4 w-4 text-bitcoin-gold" />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-bold text-bitcoin-gold">
                          +{(forecastMetrics.dailyYield * 100).toFixed(4)}%
                        </span>
                      </div>
                      <p className="text-sm text-white/70">
                        Projected daily return on 1 BTC (based on current APY)
                      </p>
                    </div>

                    <div className="p-4 bg-white/10 rounded-lg border border-white/30 shadow-md hover:shadow-lg transition-all duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white">Estimated Monthly Yield</h3>
                        <TrendingUp className="h-4 w-4 text-bitcoin-gold" />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-bold text-bitcoin-gold">
                          +{(forecastMetrics.monthlyYield * 100).toFixed(2)}%
                        </span>
                      </div>
                      <p className="text-sm text-white/70">
                        Projected monthly return on 1 BTC (based on current APY)
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Strategy Comparison */}
          <Card className="bg-black border border-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-black/50 rounded-t-lg border-b border-white/20">
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart className="h-5 w-5 text-white" />
                Strategy Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded bg-bitcoin-gold"></div>
                      <span className="font-semibold text-white">BTC Vault</span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30">
                        Active
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-white">{apy.toFixed(2)}% APY</div>
                      <div className="text-sm text-white/70">{totalAssetsFormatted} BTC TVL</div>
                    </div>
                  </div>
                  <Progress value={Math.min(apy * 10, 100)} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded bg-gradient-to-r from-gray-400 to-gray-500"></div>
                      <span className="font-semibold text-white/80">HODL</span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/20">
                        No Yield
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-white/80">0% APY</div>
                      <div className="text-sm text-white/70">No yield</div>
                    </div>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
              </div>

              <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/30 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-bitcoin-gold" />
                  <span className="font-semibold text-white">Forecast Note</span>
                </div>
                <p className="text-sm text-white/80">
                  The BTC Vault strategy provides yield through active management across multiple pools.
                  Projections are based on current APY and assume daily compounding. Actual returns may vary.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* User Position (if connected) */}
          {userPosition && (
            <Card className="bg-black border border-white shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-black/50 rounded-t-lg border-b border-white/20">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="h-5 w-5 text-white" />
                  Your Vault Position
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-white/10 rounded-lg border border-white/30 shadow-md hover:shadow-lg transition-all duration-200">
                    <Target className="h-8 w-8 text-bitcoin-gold mx-auto mb-3" />
                    <h3 className="font-semibold text-white mb-2">Your Balance</h3>
                    <p className="text-sm text-white/70 mb-3">Current position in vault</p>
                    <div className="text-2xl font-bold text-bitcoin-gold">{userPosition.formatted} BTC</div>
                  </div>

                  {apy && (
                    <div className="text-center p-4 bg-white/10 rounded-lg border border-white/30 shadow-md hover:shadow-lg transition-all duration-200">
                      <TrendingUp className="h-8 w-8 text-bitcoin-gold mx-auto mb-3" />
                      <h3 className="font-semibold text-white mb-2">Projected Annual Yield</h3>
                      <p className="text-sm text-white/70 mb-3">Based on current APY</p>
                      <div className="text-2xl font-bold text-bitcoin-gold">
                        {((Number.parseFloat(userPosition.formatted) * apy) / 100).toFixed(6)} BTC
                      </div>
                      <div className="text-sm text-white/70">at {apy.toFixed(2)}% APY</div>
                    </div>
                  )}
                </div>

                <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/20">
                  <div className="text-xs text-white/70">
                    <strong className="text-white">Note:</strong> Projections are estimates based on current APY. Actual returns may vary.
                    This is a read-only forecast and does not affect your vault position.
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Data State */}
          {!apy && !isLoading && !error && (
            <Card className="bg-black border border-white">
              <CardContent className="py-12">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Unable to load vault insights. Please ensure the vault is configured and has pools.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
