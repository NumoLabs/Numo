import { TrendingUp, BarChart3, Calculator } from "lucide-react"

export default function ForecastHero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">BTC Forecasting & Insights</h1>
          <p className="text-xl sm:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Compare your BTC performance across strategies, simulate potential gains, and explore insights about your
            vault activity.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Calculator className="h-8 w-8 text-purple-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Yield Simulator</h3>
              <p className="text-purple-100 text-sm">Calculate potential returns across different strategies</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <BarChart3 className="h-8 w-8 text-blue-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Performance Charts</h3>
              <p className="text-purple-100 text-sm">Visual comparison of vault vs HODL strategies</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <TrendingUp className="h-8 w-8 text-green-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Smart Insights</h3>
              <p className="text-purple-100 text-sm">AI-powered analytics and optimization tips</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
