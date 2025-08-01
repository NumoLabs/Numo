"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Shield, Zap, CheckCircle } from "lucide-react"

export function PoolBenefits() {
  const benefits = [
    {
      icon: TrendingUp,
      title: "High Yield Returns",
      description: "Earn up to 12.5% APY with automated strategies",
      color: "green",
    },
    {
      icon: Shield,
      title: "Secure & Audited",
      description: "Multi-signature vaults with comprehensive security audits",
      color: "blue",
    },
    {
      icon: Zap,
      title: "Automated Strategies",
      description: "AI-powered trading strategies for optimal returns",
      color: "yellow",
    },
    {
      icon: CheckCircle,
      title: "Community Driven",
      description: "Governance tokens and community voting rights",
      color: "purple",
    },
    {
      icon: CheckCircle,
      title: "Multiple Rewards",
      description: "Earn trading fees, liquidity incentives, and VESU tokens",
      color: "orange",
    },
    {
      icon: CheckCircle,
      title: "Risk Management",
      description: "Advanced risk controls and portfolio diversification",
      color: "cyan",
    },
  ]

  const colorClasses = {
    green: "from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-200/50 text-green-600 dark:text-green-400",
    blue: "from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border-blue-200/50 text-blue-600 dark:text-blue-400",
    yellow: "from-yellow-50 to-orange-50 dark:from-yellow-950/50 dark:to-orange-950/50 border-yellow-200/50 text-yellow-600 dark:text-yellow-400",
    purple: "from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-200/50 text-purple-600 dark:text-purple-400",
    orange: "from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50 border-orange-200/50 text-orange-600 dark:text-orange-400",
    cyan: "from-cyan-50 to-blue-50 dark:from-cyan-950/50 dark:to-blue-950/50 border-cyan-200/50 text-cyan-600 dark:text-cyan-400",
  }

  return (
    <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-cyan-200/50 dark:border-cyan-800/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-purple-500" />
          Pool Benefits & Features
        </CardTitle>
        <CardDescription>
          Discover why the Vesu pool is the ideal choice for your DeFi investments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Benefits Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`p-4 bg-gradient-to-r ${colorClasses[benefit.color as keyof typeof colorClasses]} rounded-lg border transition-all duration-200 hover:scale-105 hover:shadow-lg`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-white/20 dark:bg-black/20`}>
                  <benefit.icon className="h-5 w-5" />
                </div>
                <h4 className="font-medium text-sm">{benefit.title}</h4>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Strategy Overview */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Strategy Overview</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-lg border border-gray-200/50">
              <h5 className="font-medium text-sm mb-2">Automated Market Making</h5>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Advanced algorithms provide liquidity across multiple DEXs for optimal yield generation.
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-green-500 rounded-full" />
                  <span>Uniswap V3 integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-green-500 rounded-full" />
                  <span>Dynamic fee optimization</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-green-500 rounded-full" />
                  <span>Cross-chain arbitrage</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-lg border border-gray-200/50">
              <h5 className="font-medium text-sm mb-2">Risk Management</h5>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Comprehensive risk controls ensure capital preservation while maximizing returns.
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-blue-500 rounded-full" />
                  <span>Portfolio diversification</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-blue-500 rounded-full" />
                  <span>Stop-loss mechanisms</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-blue-500 rounded-full" />
                  <span>Real-time monitoring</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Highlights */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Performance Highlights</h4>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-lg border border-green-200/50 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                98.5%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Success Rate
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 rounded-lg border border-blue-200/50 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                $2.5M
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Total Value Locked
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 rounded-lg border border-purple-200/50 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                1,250+
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Active Users
              </div>
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Security Features</h4>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-lg border border-green-200/50">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <div className="font-medium text-sm">Multi-Signature Vaults</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Requires multiple approvals for large transactions
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 rounded-lg border border-blue-200/50">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              <div>
                <div className="font-medium text-sm">Audited Smart Contracts</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Comprehensive security audits by leading firms
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 rounded-lg border border-purple-200/50">
              <Zap className="h-5 w-5 text-purple-500" />
              <div>
                <div className="font-medium text-sm">Real-Time Monitoring</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  24/7 monitoring of all pool activities
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50 rounded-lg border border-orange-200/50">
              <CheckCircle className="h-5 w-5 text-orange-500" />
              <div>
                <div className="font-medium text-sm">Community Governance</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  VESU token holders vote on pool parameters
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 