import { ArrowUpDown, Bitcoin, Clock, TrendingUp, Target, BookOpen, Shield } from "lucide-react"

import { Card, CardDescription, CardTitle } from "@/components/ui/card"

export function VaultFeatures() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900" id="features">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 px-3 py-1 text-sm text-white font-medium shadow-lg shadow-blue-500/50 animate-pulse">
              Platform Features
            </div>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-gray-900 dark:text-white">
              Why Choose Numo?
            </h2>
            <p className="max-w-3xl text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Numo is a modular BTC-first DeFi platform that combines yield generation, strategic bonds,
              community-driven strategies, and advanced forecasting tools—all designed for the modern Bitcoin investor.
            </p>
          </div>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* BTC Savings+ Vault - Featured */}
          <div className="lg:col-span-1 lg:row-span-2">
            <Card className="group h-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-orange-600 dark:hover:border-orange-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 rounded-2xl p-8 hover:shadow-orange-600/20">
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Bitcoin className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                    BTC Savings+ Vault
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    Auto-rebalancing vault designed for WBTC with{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">100% BTC exposure</span>. Enjoy
                    flexible deposits and withdrawals while earning yield that&apos;s always paid in WBTC.
                  </CardDescription>
                </div>
                <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Current APY</span>
                    <span className="font-semibold text-gray-900 dark:text-white">5.8%</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* BTC Bonds */}
          <Card className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 rounded-2xl p-6 hover:shadow-blue-600/20">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <ArrowUpDown className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-xl font-bold mb-2 text-gray-900 dark:text-white">BTC Bonds</CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
              Lock BTC for <span className="font-semibold text-gray-900 dark:text-white">7, 30, or 90 days</span> and
              earn enhanced yields. Perfect for long-term holders.
            </CardDescription>
          </Card>

          {/* Strategy Marketplace */}
          <Card className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-green-600 dark:hover:border-green-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 rounded-2xl p-6 hover:shadow-green-600/20">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Strategy Marketplace</CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
              Discover and publish community strategies. View detailed{" "}
              <span className="font-semibold text-gray-900 dark:text-white">risk metrics and APY data</span>.
            </CardDescription>
          </Card>

          {/* Forecasting & Insights */}
          <Card className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-600 dark:hover:border-purple-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 rounded-2xl p-6 hover:shadow-purple-600/20">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Forecasting Tools</CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
              Simulate performance and visualize potential returns with{" "}
              <span className="font-semibold text-gray-900 dark:text-white">advanced analytics</span>.
            </CardDescription>
          </Card>

          {/* Strategy Modes */}
          <Card className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-600 dark:hover:border-gray-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 rounded-2xl p-6 hover:shadow-gray-600/20">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Target className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Strategy Modes</CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
              Choose from <span className="font-semibold text-gray-900 dark:text-white">Auto, Manual, or Hybrid</span>{" "}
              modes to match your investment style.
            </CardDescription>
          </Card>
        </div>

        {/* Bottom Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 rounded-2xl p-6 hover:shadow-blue-500/20">
            <div className="flex flex-col items-start">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl font-bold mb-3 text-gray-900 dark:text-white">DeFi Learning Hub</CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Master DeFi concepts with our comprehensive educational resources covering vaults, liquidity management,
                risk assessment, and advanced strategies.
              </CardDescription>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                    <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Interactive tutorials</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                    <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Risk assessment guides</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 rounded-2xl p-6 hover:shadow-green-500/20">
            <div className="flex flex-col items-start">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Security First</CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Built on Starknet with bank-grade security protocols, multi-signature support, and comprehensive audit
                coverage for maximum protection.
              </CardDescription>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                    <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Multi-signature support</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                    <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Comprehensive audits</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
