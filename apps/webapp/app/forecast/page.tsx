import ForecastHero from "@/components/forecast/forecast-hero"
import YieldSimulator from "@/components/forecast/yield-simulator"
import PerformanceChart from "@/components/forecast/performance-chart"
import InsightsDashboard from "@/components/forecast/insights-dashboard"

export default function ForecastPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ForecastHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Yield Simulator */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Yield Simulator</h2>
            <p className="text-lg text-gray-600">
              Calculate and compare potential returns across different BTC strategies
            </p>
          </div>
          <YieldSimulator />
        </section>

        {/* Performance Chart */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Historical Performance</h2>
            <p className="text-lg text-gray-600">Compare how different strategies have performed over time</p>
          </div>
          <PerformanceChart />
        </section>

        {/* Insights Dashboard */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Analytics & Insights</h2>
            <p className="text-lg text-gray-600">Deep dive into performance metrics and optimization recommendations</p>
          </div>
          <InsightsDashboard />
        </section>
      </div>
    </div>
  )
}
