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
        <Card className="bg-white dark:bg-gray-900 border-2 border-bitcoin-gold">
          <CardContent className="py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-bitcoin-orange" />
              <p className="text-muted-foreground">Loading vault insights...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="bg-white dark:bg-gray-900 border-2 border-bitcoin-gold">
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
          <Card className="bg-white dark:bg-gray-900 border-2 border-bitcoin-gold shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-bitcoin-gold/10 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-bitcoin-orange">
                <Target className="h-5 w-5 text-bitcoin-gold" />
                Vault Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-yellow-100/50 dark:bg-yellow-900/20 rounded-lg border-2 border-bitcoin-gold shadow-md hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-bitcoin-orange">Current Vault APY</h3>
                    <TrendingUp className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-orange-500">{apy.toFixed(2)}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Annual Percentage Yield calculated from real-time pool yields
                  </p>
                </div>

                {totalAssets && (
                  <div className="p-4 bg-yellow-100/50 dark:bg-yellow-900/20 rounded-lg border-2 border-bitcoin-gold shadow-md hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-bitcoin-orange">Total Vault Assets</h3>
                      <BarChart className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-orange-500">{totalAssetsFormatted} BTC</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total assets currently managed by the vault
                    </p>
                  </div>
                )}

                {forecastMetrics && (
                  <>
                    <div className="p-4 bg-yellow-100/50 dark:bg-yellow-900/20 rounded-lg border-2 border-bitcoin-gold shadow-md hover:shadow-lg transition-all duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-bitcoin-orange">Estimated Daily Yield</h3>
                        <TrendingUp className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-bold text-orange-500">
                          +{(forecastMetrics.dailyYield * 100).toFixed(4)}%
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Projected daily return on 1 BTC (based on current APY)
                      </p>
                    </div>

                    <div className="p-4 bg-yellow-100/50 dark:bg-yellow-900/20 rounded-lg border-2 border-bitcoin-gold shadow-md hover:shadow-lg transition-all duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-bitcoin-orange">Estimated Monthly Yield</h3>
                        <TrendingUp className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-bold text-orange-500">
                          +{(forecastMetrics.monthlyYield * 100).toFixed(2)}%
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Projected monthly return on 1 BTC (based on current APY)
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Strategy Comparison */}
          <Card className="bg-white dark:bg-gray-900 border-2 border-bitcoin-gold shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-bitcoin-gold/10 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-bitcoin-orange">
                <BarChart className="h-5 w-5 text-bitcoin-gold" />
                Strategy Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded bg-gradient-to-r from-yellow-400 to-bitcoin-orange"></div>
                      <span className="font-semibold text-foreground">BTC Vault</span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                        Active
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-foreground">{apy.toFixed(2)}% APY</div>
                      <div className="text-sm text-muted-foreground">{totalAssetsFormatted} BTC TVL</div>
                    </div>
                  </div>
                  <Progress value={Math.min(apy * 10, 100)} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded bg-gradient-to-r from-gray-400 to-gray-500"></div>
                      <span className="font-semibold text-foreground">HODL</span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        No Yield
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-foreground">0% APY</div>
                      <div className="text-sm text-muted-foreground">No yield</div>
                    </div>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-yellow-100/50 via-bitcoin-gold/30 to-orange-100/50 rounded-lg border-2 border-bitcoin-gold shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="font-semibold text-yellow-400">Forecast Note</span>
                </div>
                <p className="text-sm text-foreground">
                  The BTC Vault strategy provides yield through active management across multiple pools.
                  Projections are based on current APY and assume daily compounding. Actual returns may vary.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* User Position (if connected) */}
          {userPosition && (
            <Card className="bg-white dark:bg-gray-900 border-2 border-bitcoin-gold shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-bitcoin-gold/10 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-bitcoin-orange">
                  <Shield className="h-5 w-5 text-bitcoin-gold" />
                  Your Vault Position
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-yellow-100/50 dark:bg-yellow-900/20 rounded-lg border-2 border-bitcoin-gold shadow-md hover:shadow-lg transition-all duration-200">
                    <Target className="h-8 w-8 text-bitcoin-gold mx-auto mb-3" />
                    <h3 className="font-semibold text-bitcoin-orange mb-2">Your Balance</h3>
                    <p className="text-sm text-muted-foreground mb-3">Current position in vault</p>
                    <div className="text-2xl font-bold text-bitcoin-orange">{userPosition.formatted} BTC</div>
                  </div>

                  {apy && (
                    <div className="text-center p-4 bg-yellow-100/50 dark:bg-yellow-900/20 rounded-lg border-2 border-bitcoin-gold shadow-md hover:shadow-lg transition-all duration-200">
                      <TrendingUp className="h-8 w-8 text-bitcoin-gold mx-auto mb-3" />
                      <h3 className="font-semibold text-bitcoin-orange mb-2">Projected Annual Yield</h3>
                      <p className="text-sm text-muted-foreground mb-3">Based on current APY</p>
                      <div className="text-2xl font-bold text-bitcoin-orange">
                        {((Number.parseFloat(userPosition.formatted) * apy) / 100).toFixed(6)} BTC
                      </div>
                      <div className="text-sm text-muted-foreground">at {apy.toFixed(2)}% APY</div>
                    </div>
                  )}
                </div>

                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="text-xs text-muted-foreground">
                    <strong>Note:</strong> Projections are estimates based on current APY. Actual returns may vary.
                    This is a read-only forecast and does not affect your vault position.
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Data State */}
          {!apy && !isLoading && !error && (
            <Card className="bg-white dark:bg-gray-900 border-2 border-bitcoin-gold">
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
