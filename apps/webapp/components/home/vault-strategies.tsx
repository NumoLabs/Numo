"use client"

import Image from "next/image"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { staggerContainer, cardAdvanced } from "@/lib/animation-variants"

export function VaultStrategies() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32" id="strategies">
      <div className="container px-4 md:px-6">
        <motion.div 
          className="flex flex-col items-center justify-center space-y-4 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="space-y-2">
            <motion.div 
              className="inline-block rounded-lg bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 px-3 py-1 text-sm text-white font-medium shadow-lg shadow-blue-500/50 animate-pulse"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Strategies
            </motion.div>
            <motion.h2 
              className="text-3xl font-bold tracking-tighter sm:text-5xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Optimized Strategies
            </motion.h2>
            <motion.p 
              className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Our vault uses multiple strategies to maximize your BTC returns.
            </motion.p>
          </div>
        </motion.div>
        <motion.div 
          className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          variants={staggerContainer}
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div
            variants={cardAdvanced}
            whileHover={{ 
              scale: 1.02,
              rotateY: -3,
              rotateX: 2,
              z: 20,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            className="transform-gpu preserve-3d"
          >
            <Card className="group overflow-hidden rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-250 ease-out hover:-translate-y-1 hover:-rotate-1 hover:border-purple-500 dark:hover:border-purple-400 hover:will-change-transform">
            <div className="relative h-56 w-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
              <div className="relative w-4/5 max-w-[300px] py-6 transition-transform duration-250 ease-out group-hover:scale-105 group-hover:-rotate-1">
                <Image
                  src="/ekubo-logo.png"
                  alt="Ekubo Logo"
                  width={400}
                  height={150}
                  className="object-contain w-full transition-all duration-250 ease-out group-hover:brightness-110"
                />
              </div>
              <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ease-out group-hover:scale-105 group-hover:bg-purple-400">
                Active
              </div>
            </div>
            <div className="p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ekubo Strategy</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Provide liquidity in BTC/USDC pools to generate trading fees.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 mb-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Takes advantage of Ekubo&apos;s optimized AMM architecture
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Generates returns through trading fees
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Ideal in markets with high trading volume
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      All fees are automatically converted to WBTC
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-0">
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Current APY</span>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">4.8%</div>
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200 hover:scale-105 hover:shadow-lg transform">
                    Learn More
                  </Button>
                </div>
              </CardFooter>
            </div>
          </Card>
        </motion.div>

          <motion.div
            variants={cardAdvanced}
            whileHover={{ 
              scale: 1.02,
              rotateY: 3,
              rotateX: -2,
              z: 20,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            className="transform-gpu preserve-3d"
          >
            <Card className="group overflow-hidden rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-250 ease-out hover:-translate-y-1 hover:rotate-1 hover:border-blue-500 dark:hover:border-blue-400 hover:will-change-transform">
            <div className="relative h-56 w-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10"></div>
              <div className="relative w-3/4 max-w-[250px] py-6 transition-transform duration-250 ease-out group-hover:scale-105 group-hover:rotate-1">
                <Image
                  src="/vesu-logo.png"
                  alt="Vesu Logo"
                  width={300}
                  height={120}
                  className="object-contain w-full transition-all duration-250 ease-out group-hover:brightness-110"
                />
              </div>
              <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ease-out group-hover:scale-105 group-hover:bg-blue-400">
                Active
              </div>
            </div>
            <div className="p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white mb-2">Vesu Strategy</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Participate in vaults or loans with BTC to generate interest.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 mb-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Uses the decentralized lending platform Vesu
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Generates returns through loan interest
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Ideal in markets with high BTC loan demand
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      All interest accumulates directly in WBTC
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-0">
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Current APY</span>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">5.8%</div>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:scale-105 hover:shadow-lg transform">
                    Learn More
                  </Button>
                </div>
              </CardFooter>
            </div>
          </Card>
        </motion.div>
      </motion.div>
      </div>
    </section>
  )
}
