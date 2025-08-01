"use client"

import { ArrowUpDown, Bitcoin, Clock, TrendingUp, Target, BookOpen, Shield } from "lucide-react"
import { motion } from "framer-motion"

import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { cardAdvanced, cardStaggerAdvanced } from "@/lib/animation-variants"

export function VaultFeatures() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900" id="features">
      <div className="container px-4 md:px-6">
        <motion.div 
          className="flex flex-col items-center justify-center space-y-6 text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="space-y-4">
            <motion.div 
              className="inline-block rounded-lg bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 px-3 py-1 text-sm text-white font-medium shadow-lg shadow-blue-500/50 animate-pulse"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Platform Features
            </motion.div>
            <motion.h2 
              className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Why Choose Numo?
            </motion.h2>
            <motion.p 
              className="max-w-3xl text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Numo is a modular BTC-first DeFi platform that combines yield generation, strategic bonds,
              community-driven strategies, and advanced forecasting tools—all designed for the modern Bitcoin investor.
            </motion.p>
          </div>
        </motion.div>

        {/* Main Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 perspective-1000"
          initial="hidden"
          whileInView="visible"
          variants={cardStaggerAdvanced}
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* BTC Savings+ Vault - Featured */}
          <div className="lg:col-span-1 lg:row-span-2">
            <motion.div
              variants={cardAdvanced}
              whileHover={{ 
                scale: 1.05,
                rotateY: -8,
                rotateX: 5,
                z: 30,
                transition: { duration: 0.4, ease: "easeOut" }
              }}
              className="h-full transform-gpu preserve-3d"
            >
              <Card className="group h-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-orange-600 dark:hover:border-orange-400 transition-all duration-500 hover:shadow-xl rounded-2xl p-8 hover:shadow-orange-600/30">
                <div className="flex flex-col h-full">
                  <div className="mb-6">
                    <motion.div 
                      className="w-16 h-16 bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/30"
                      whileHover={{ 
                        scale: 1.2,
                        rotate: -15,
                        y: -3,
                        transition: { duration: 0.3, ease: [0.68, -0.55, 0.265, 1.55] }
                      }}
                      animate={{ 
                        rotate: [0, 5, 0, -5, 0],
                        transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      <Bitcoin className="w-8 h-8 text-white" />
                    </motion.div>
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
          </motion.div>
        </div>

          {/* BTC Bonds */}
          <motion.div
            variants={cardAdvanced}
            whileHover={{ 
              scale: 1.05,
              rotateY: -8,
              rotateX: 5,
              z: 30,
              transition: { duration: 0.4, ease: "easeOut" }
            }}
            className="transform-gpu preserve-3d"
          >
            <Card className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-orange-600 dark:hover:border-orange-400 transition-all duration-500 hover:shadow-xl rounded-2xl p-6 hover:shadow-orange-600/30">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/30"
                whileHover={{ 
                  scale: 1.2,
                  rotate: -15,
                  y: -3,
                  transition: { duration: 0.3, ease: [0.68, -0.55, 0.265, 1.55] }
                }}
                animate={{ 
                  rotate: [0, 5, 0, -5, 0],
                  transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <ArrowUpDown className="w-6 h-6 text-white" />
              </motion.div>
              <CardTitle className="text-xl font-bold mb-2 text-gray-900 dark:text-white">BTC Bonds</CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                Lock BTC for <span className="font-semibold text-gray-900 dark:text-white">7, 30, or 90 days</span> and
                earn enhanced yields. Perfect for long-term holders.
              </CardDescription>
            </Card>
          </motion.div>

          {/* Strategy Marketplace */}
          <motion.div
            variants={cardAdvanced}
            whileHover={{ 
              scale: 1.05,
              rotateY: 10,
              rotateX: -5,
              z: 30,
              transition: { duration: 0.4, ease: "easeOut" }
            }}
            className="transform-gpu preserve-3d"
          >
            <Card className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-orange-600 dark:hover:border-orange-400 transition-all duration-500 hover:shadow-xl rounded-2xl p-6 hover:shadow-orange-600/30">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/30"
                whileHover={{ 
                  scale: 1.25,
                  rotate: 20,
                  y: -4,
                  transition: { duration: 0.3, ease: [0.68, -0.55, 0.265, 1.55] }
                }}
                animate={{ 
                  y: [-1, 1, -1],
                  scale: [1, 1.05, 1],
                  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <TrendingUp className="w-6 h-6 text-white" />
              </motion.div>
              <CardTitle className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Strategy Marketplace</CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                Discover and publish community strategies. View detailed{" "}
                <span className="font-semibold text-gray-900 dark:text-white">risk metrics and APY data</span>.
              </CardDescription>
            </Card>
          </motion.div>

          {/* Forecasting & Insights */}
          <motion.div
            variants={cardAdvanced}
            whileHover={{ 
              scale: 1.05,
              rotateY: -10,
              rotateX: 8,
              z: 30,
              transition: { duration: 0.4, ease: "easeOut" }
            }}
            className="transform-gpu preserve-3d"
          >
            <Card className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-orange-600 dark:hover:border-orange-400 transition-all duration-500 hover:shadow-xl rounded-2xl p-6 hover:shadow-orange-600/30">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/30"
                whileHover={{ 
                  scale: 1.15,
                  rotate: -10,
                  y: -3,
                  transition: { duration: 0.3, ease: [0.68, -0.55, 0.265, 1.55] }
                }}
                animate={{ 
                  rotate: [0, -3, 0, 3, 0],
                  transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <Clock className="w-6 h-6 text-white" />
              </motion.div>
              <CardTitle className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Forecasting Tools</CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                Simulate performance and visualize potential returns with{" "}
                <span className="font-semibold text-gray-900 dark:text-white">advanced analytics</span>.
              </CardDescription>
            </Card>
          </motion.div>

          {/* Strategy Modes */}
          <motion.div
            variants={cardAdvanced}
            whileHover={{ 
              scale: 1.05,
              rotateY: 12,
              rotateX: -8,
              z: 30,
              transition: { duration: 0.4, ease: "easeOut" }
            }}
            className="transform-gpu preserve-3d"
          >
            <Card className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-orange-600 dark:hover:border-orange-400 transition-all duration-500 hover:shadow-xl rounded-2xl p-6 hover:shadow-orange-600/30">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/30"
                whileHover={{ 
                  scale: 1.3,
                  rotate: 25,
                  y: -5,
                  transition: { duration: 0.3, ease: [0.68, -0.55, 0.265, 1.55] }
                }}
                animate={{ 
                  scale: [1, 1.08, 1],
                  transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <Target className="w-6 h-6 text-white" />
              </motion.div>
              <CardTitle className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Strategy Modes</CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                Choose from <span className="font-semibold text-gray-900 dark:text-white">Auto, Manual, or Hybrid</span>{" "}
                modes to match your investment style.
              </CardDescription>
            </Card>
          </motion.div>
        </motion.div>

        {/* Bottom Feature Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 perspective-1000"
          initial="hidden"
          whileInView="visible"
          variants={cardStaggerAdvanced}
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            variants={cardAdvanced}
            whileHover={{ 
              scale: 1.03,
              rotateY: -6,
              rotateX: 4,
              z: 20,
              transition: { duration: 0.5, ease: "easeOut" }
            }}
            className="transform-gpu preserve-3d"
          >
            <Card className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-400 transition-all duration-500 hover:shadow-xl rounded-2xl p-6 hover:shadow-orange-500/30">
              <div className="flex flex-col items-start">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/30"
                  whileHover={{ 
                    scale: 1.2,
                    rotate: -8,
                    y: -3,
                    transition: { duration: 0.3, ease: [0.68, -0.55, 0.265, 1.55] }
                  }}
                  animate={{ 
                    y: [-1, 1, -1],
                    rotate: [0, 2, 0, -2, 0],
                    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <BookOpen className="w-6 h-6 text-white" />
                </motion.div>
              <CardTitle className="text-xl font-bold mb-3 text-gray-900 dark:text-white">DeFi Learning Hub</CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Master DeFi concepts with our comprehensive educational resources covering vaults, liquidity management,
                risk assessment, and advanced strategies.
              </CardDescription>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                    <svg className="w-3 h-3 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
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
                  <div className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                    <svg className="w-3 h-3 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
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
        </motion.div>

        <motion.div
          variants={cardAdvanced}
          whileHover={{ 
            scale: 1.03,
            rotateY: 6,
            rotateX: -4,
            z: 20,
            transition: { duration: 0.5, ease: "easeOut" }
          }}
          className="transform-gpu preserve-3d"
        >
          <Card className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-400 transition-all duration-500 hover:shadow-xl rounded-2xl p-6 hover:shadow-orange-500/30">
            <div className="flex flex-col items-start">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/30"
                whileHover={{ 
                  scale: 1.2,
                  rotate: 10,
                  y: -3,
                  transition: { duration: 0.3, ease: [0.68, -0.55, 0.265, 1.55] }
                }}
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, -2, 0, 2, 0],
                  transition: { duration: 7, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <Shield className="w-6 h-6 text-white" />
              </motion.div>
              <CardTitle className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Security First</CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Built on Starknet with bank-grade security protocols, multi-signature support, and comprehensive audit
                coverage for maximum protection.
              </CardDescription>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                    <svg className="w-3 h-3 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
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
                  <div className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                    <svg className="w-3 h-3 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
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
        </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
