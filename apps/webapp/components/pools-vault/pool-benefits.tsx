"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Shield, Zap, CheckCircle } from 'lucide-react'

export function PoolBenefits() {
  const benefits = [
    {
      icon: TrendingUp,
      title: "High Yield Returns",
      description: "Earn up to 12.5% APY with rebalancing strategies",
      color: "bitcoin-gold",
    },
    {
      icon: Shield,
      title: "Secure & Audited",
      description: "Multi-signature vaults with comprehensive security audits",
      color: "bitcoin-orange",
    },
    {
      icon: Zap,
      title: "Rebalancing Strategies",
      description: "AI-powered trading strategies for optimal returns",
      color: "bitcoin-gold",
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
      color: "bitcoin-orange",
    },
    {
      icon: CheckCircle,
      title: "Risk Management",
      description: "Advanced risk controls and portfolio diversification",
      color: "bitcoin-gold",
    },
  ]

  const colorClasses = {
    "bitcoin-gold": "from-yellow-100/50 via-bitcoin-gold/30 to-yellow-200/50 dark:from-yellow-900/30 dark:via-bitcoin-gold/20 dark:to-yellow-800/20 border-2 border-gradient-to-r from-yellow-300/40 to-bitcoin-gold/40 text-yellow-700 dark:text-yellow-300 shadow-md hover:shadow-lg transition-all duration-200",
    "bitcoin-orange": "from-orange-100/50 via-bitcoin-orange/30 to-red-100/50 dark:from-orange-900/30 dark:via-bitcoin-orange/20 dark:to-red-800/20 border-2 border-gradient-to-r from-orange-300/40 to-bitcoin-orange/40 text-orange-700 dark:text-orange-300 shadow-md hover:shadow-lg transition-all duration-200",
    purple: "from-purple-100/50 via-pink-100/30 to-purple-200/50 dark:from-purple-900/30 dark:via-pink-900/20 dark:to-purple-800/20 border-2 border-gradient-to-r from-purple-300/40 to-pink-300/40 text-purple-600 dark:text-purple-400 shadow-md hover:shadow-lg transition-all duration-200",
  }

  return (
    <Card className="bg-gradient-to-br from-white/90 via-yellow-50/30 to-orange-50/30 dark:from-gray-900/90 dark:via-yellow-950/20 dark:to-orange-950/20 backdrop-blur-xl border-2 border-gradient-to-r from-bitcoin-gold/40 via-bitcoin-orange/40 to-yellow-400/40 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-bitcoin-gold/5 to-bitcoin-orange/5 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-bitcoin-orange">
          <CheckCircle className="h-5 w-5 text-bitcoin-gold" />
          Pool Benefits & Features
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Discover why the Vesu pool is the ideal choice for your DeFi investments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Benefits Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`p-4 bg-gradient-to-br ${colorClasses[benefit.color as keyof typeof colorClasses]} rounded-lg transition-all duration-200 hover:scale-105`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-white/20 dark:bg-black/20 shadow-md`}>
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
          <h4 className="font-medium text-sm text-bitcoin-gold">Strategy Overview</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-gradient-to-br from-yellow-100/30 via-bitcoin-gold/20 to-orange-100/30 dark:from-yellow-900/20 dark:via-bitcoin-gold/10 dark:to-orange-800/10 rounded-lg border-2 border-gradient-to-r from-yellow-200/40 via-bitcoin-gold/40 to-orange-200/40 shadow-md hover:shadow-lg transition-all duration-200">
              <h5 className="font-medium text-sm mb-2 text-yellow-700 dark:text-yellow-300">Automated Market Making</h5>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Advanced algorithms provide liquidity across multiple DEXs for optimal yield generation.
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-gradient-to-r from-yellow-400 to-bitcoin-gold rounded-full shadow-sm" />
                  <span>Uniswap V3 integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-gradient-to-r from-yellow-400 to-bitcoin-gold rounded-full shadow-sm" />
                  <span>Dynamic fee optimization</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-gradient-to-r from-yellow-400 to-bitcoin-gold rounded-full shadow-sm" />
                  <span>Cross-chain arbitrage</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-100/30 via-bitcoin-orange/20 to-red-100/30 dark:from-orange-900/20 dark:via-bitcoin-orange/10 dark:to-red-800/10 rounded-lg border-2 border-gradient-to-r from-orange-200/40 via-bitcoin-orange/40 to-red-200/40 shadow-md hover:shadow-lg transition-all duration-200">
              <h5 className="font-medium text-sm mb-2 text-orange-700 dark:text-orange-300">Risk Management</h5>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Comprehensive risk controls ensure capital preservation while maximizing returns.
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-gradient-to-r from-orange-400 to-bitcoin-orange rounded-full shadow-sm" />
                  <span>Portfolio diversification</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-gradient-to-r from-orange-400 to-bitcoin-orange rounded-full shadow-sm" />
                  <span>Stop-loss mechanisms</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-gradient-to-r from-orange-400 to-bitcoin-orange rounded-full shadow-sm" />
                  <span>Real-time monitoring</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Highlights */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-bitcoin-gold">Performance Highlights</h4>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-gradient-to-br from-yellow-100/50 via-bitcoin-gold/30 to-yellow-200/50 dark:from-yellow-900/30 dark:via-bitcoin-gold/20 dark:to-yellow-800/20 rounded-lg border-2 border-gradient-to-r from-yellow-300/40 to-bitcoin-gold/40 text-center shadow-md hover:shadow-lg transition-all duration-200">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                98.5%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Success Rate
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-100/50 via-bitcoin-orange/30 to-red-100/50 dark:from-orange-900/30 dark:via-bitcoin-orange/20 dark:to-red-800/20 rounded-lg border-2 border-gradient-to-r from-orange-300/40 to-bitcoin-orange/40 text-center shadow-md hover:shadow-lg transition-all duration-200">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                $2.5M
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Total Value Locked
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-100/50 via-pink-100/30 to-purple-200/50 dark:from-purple-900/30 dark:via-pink-900/20 dark:to-purple-800/20 rounded-lg border-2 border-gradient-to-r from-purple-300/40 to-pink-300/40 text-center shadow-md hover:shadow-lg transition-all duration-200">
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
          <h4 className="font-medium text-sm text-bitcoin-gold">Security Features</h4>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-yellow-100/30 via-bitcoin-gold/20 to-yellow-200/30 dark:from-yellow-900/20 dark:via-bitcoin-gold/10 dark:to-yellow-800/10 rounded-lg border-2 border-gradient-to-r from-yellow-200/40 to-bitcoin-gold/40 shadow-md hover:shadow-lg transition-all duration-200">
              <Shield className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <div>
                <div className="font-medium text-sm">Multi-Signature Vaults</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Requires multiple approvals for large transactions
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-orange-100/30 via-bitcoin-orange/20 to-red-100/30 dark:from-orange-900/20 dark:via-bitcoin-orange/10 dark:to-red-800/10 rounded-lg border-2 border-gradient-to-r from-orange-200/40 to-bitcoin-orange/40 shadow-md hover:shadow-lg transition-all duration-200">
              <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <div>
                <div className="font-medium text-sm">Audited Smart Contracts</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Comprehensive security audits by leading firms
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-purple-100/30 via-pink-100/20 to-purple-200/30 dark:from-purple-900/20 dark:via-pink-900/10 dark:to-purple-800/10 rounded-lg border-2 border-gradient-to-r from-purple-200/40 to-pink-200/40 shadow-md hover:shadow-lg transition-all duration-200">
              <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <div>
                <div className="font-medium text-sm">Real-Time Monitoring</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  24/7 monitoring of all pool activities
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-yellow-100/30 via-bitcoin-gold/20 to-orange-100/30 dark:from-yellow-900/20 dark:via-bitcoin-gold/10 dark:to-orange-800/10 rounded-lg border-2 border-gradient-to-r from-yellow-200/40 via-bitcoin-gold/40 to-orange-200/40 shadow-md hover:shadow-lg transition-all duration-200">
              <CheckCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
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