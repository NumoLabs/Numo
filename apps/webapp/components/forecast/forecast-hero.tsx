import { TrendingUp, BarChart3, Calculator, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function ForecastHero() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-bitcoin-gradient p-8 md:p-12 mb-8 text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-bitcoin-gold/20 to-bitcoin-orange/20 rounded-full blur-3xl"></div>
      <div className="relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-8 w-8" />
            <Badge className="bg-white/20 text-white border-white/30">BTC Forecasting</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            BTC Forecasting & Insights
          </h1>
          <p className="text-xl text-orange-100 mb-6">
            Compare your BTC performance across strategies, simulate potential gains, and explore insights about your vault activity.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <Calculator className="h-6 w-6 text-yellow-300 mb-2" />
              <h3 className="text-sm font-semibold mb-1">Yield Simulator</h3>
              <p className="text-orange-100 text-xs">Calculate potential returns across different strategies</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <BarChart3 className="h-6 w-6 text-orange-300 mb-2" />
              <h3 className="text-sm font-semibold mb-1">Performance Charts</h3>
              <p className="text-orange-100 text-xs">Visual comparison of vault vs HODL strategies</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <TrendingUp className="h-6 w-6 text-bitcoin-gold mb-2" />
              <h3 className="text-sm font-semibold mb-1">Smart Insights</h3>
              <p className="text-orange-100 text-xs">AI-powered analytics and optimization tips</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
