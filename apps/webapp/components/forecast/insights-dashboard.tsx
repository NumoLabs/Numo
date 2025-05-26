import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Target, Zap, Shield, BarChart } from "lucide-react"
import { mockInsights, protocolComparison } from "@/lib/forecast-data"

export default function InsightsDashboard() {
  return (
    <div className="space-y-8">
      {/* Key Insights */}
      <Card className="border-green-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Key Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockInsights.map((insight, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">{insight.title}</h3>
                  {insight.positive ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-gray-900">{insight.value}</span>
                  <span className={`text-sm font-medium ${insight.positive ? "text-green-600" : "text-red-600"}`}>
                    {insight.change}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{insight.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Protocol Comparison */}
      <Card className="border-purple-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-purple-600" />
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
                    <span className="font-semibold text-gray-800">{protocol.protocol}</span>
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
                    <div className="font-bold text-lg">{protocol.apy}</div>
                    <div className="text-sm text-gray-600">{protocol.tvl} TVL</div>
                  </div>
                </div>
                <Progress value={Number.parseFloat(protocol.apy) * 10} className="h-2" />
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-blue-700">Optimization Tip</span>
            </div>
            <p className="text-sm text-gray-600">
              Based on current market conditions, the BTC Vault strategy provides the best risk-adjusted returns.
              Consider increasing your allocation for optimal performance.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Risk Analysis */}
      <Card className="border-amber-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-600" />
            Risk Analysis & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <Shield className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-green-700 mb-2">Low Risk</h3>
              <p className="text-sm text-gray-600 mb-3">Conservative approach with stable returns</p>
              <div className="text-2xl font-bold text-green-700">5.2%</div>
              <div className="text-sm text-gray-600">Expected APY</div>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Target className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-blue-700 mb-2">Balanced</h3>
              <p className="text-sm text-gray-600 mb-3">Optimal risk-reward ratio for most users</p>
              <div className="text-2xl font-bold text-blue-700">7.8%</div>
              <div className="text-sm text-gray-600">Expected APY</div>
            </div>

            <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
              <Zap className="h-8 w-8 text-amber-600 mx-auto mb-3" />
              <h3 className="font-semibold text-amber-700 mb-2">High Yield</h3>
              <p className="text-sm text-gray-600 mb-3">Maximum returns with higher volatility</p>
              <div className="text-2xl font-bold text-amber-700">8.9%</div>
              <div className="text-sm text-gray-600">Expected APY</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
