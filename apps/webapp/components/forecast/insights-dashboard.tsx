import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Target, Zap, Shield, BarChart } from "lucide-react"
import { mockInsights, protocolComparison } from "@/lib/forecast-data"

export default function InsightsDashboard() {
  return (
    <div className="space-y-8">
      {/* Key Insights */}
      <Card className="bg-white dark:bg-gray-900 border-2 border-bitcoin-gold shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-bitcoin-gold/10 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-bitcoin-orange">
            <Target className="h-5 w-5 text-bitcoin-gold" />
            Key Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockInsights.map((insight, index) => (
              <div
                key={index}
                className="p-4 bg-yellow-100/50 dark:bg-yellow-900/20 rounded-lg border-2 border-bitcoin-gold shadow-md hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-bitcoin-orange">{insight.title}</h3>
                  {insight.positive ? (
                    <TrendingUp className="h-4 w-4 text-yellow-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-orange-500">{insight.value}</span>
                  <span className={`text-sm font-medium ${insight.positive ? "text-green-600" : "text-red-600"}`}>
                    {insight.change}
                  </span>
                </div>
                <p className="text-sm text-white">{insight.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Protocol Comparison */}
      <Card className="bg-white dark:bg-gray-900 border-2 border-bitcoin-gold shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-bitcoin-gold/10 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-bitcoin-orange">
            <BarChart className="h-5 w-5 text-bitcoin-gold" />
            Protocol Performance Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {protocolComparison.map((protocol, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded bg-gradient-to-r ${protocol.color}`}></div>
                    <span className="font-semibold text-white">{protocol.protocol}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        protocol.risk === "Low"
                          ? "bg-green-100 text-green-700"
                          : protocol.risk === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : protocol.risk === "High"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {protocol.risk} Risk
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-white">{protocol.apy}</div>
                    <div className="text-sm text-white">{protocol.tvl} TVL</div>
                  </div>
                </div>
                <Progress value={Number.parseFloat(protocol.apy) * 10} className="h-2" />
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-100/50 via-bitcoin-gold/30 to-orange-100/50 rounded-lg border-2 border-bitcoin-gold shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold text-yellow-400">Optimization Tip</span>
            </div>
            <p className="text-sm text-white">
              Based on current market conditions, the BTC Vault strategy provides the best risk-adjusted returns.
              Consider increasing your allocation for optimal performance.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Risk Analysis */}
      <Card className="bg-white dark:bg-gray-900 border-2 border-bitcoin-gold shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-bitcoin-gold/10 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-bitcoin-orange">
            <Shield className="h-5 w-5 text-bitcoin-gold" />
            Risk Analysis & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-100/50 dark:bg-green-900/20 rounded-lg border-2 border-green-400 shadow-md hover:shadow-lg transition-all duration-200">
              <Shield className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-green-700 mb-2">Low Risk</h3>
              <p className="text-sm text-white mb-3">Conservative approach with stable returns</p>
              <div className="text-2xl font-bold text-green-700">5.2%</div>
              <div className="text-sm text-white">Expected APY</div>
            </div>

            <div className="text-center p-4 bg-yellow-100/50 dark:bg-yellow-900/20 rounded-lg border-2 border-bitcoin-gold shadow-md hover:shadow-lg transition-all duration-200">
              <Target className="h-8 w-8 text-bitcoin-gold mx-auto mb-3" />
              <h3 className="font-semibold text-bitcoin-orange mb-2">Balanced</h3>
              <p className="text-sm text-white mb-3">Optimal risk-reward ratio for most users</p>
              <div className="text-2xl font-bold text-bitcoin-orange">7.8%</div>
              <div className="text-sm text-white">Expected APY</div>
            </div>

            <div className="text-center p-4 bg-orange-100/50 dark:bg-orange-900/20 rounded-lg border-2 border-bitcoin-gold shadow-md hover:shadow-lg transition-all duration-200">
              <Zap className="h-8 w-8 text-bitcoin-orange mx-auto mb-3" />
              <h3 className="font-semibold text-bitcoin-orange mb-2">High Yield</h3>
              <p className="text-sm text-white mb-3">Maximum returns with higher volatility</p>
              <div className="text-2xl font-bold text-bitcoin-orange">8.9%</div>
              <div className="text-sm text-white">Expected APY</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
