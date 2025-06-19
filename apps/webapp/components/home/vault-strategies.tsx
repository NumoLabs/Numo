import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function VaultStrategies() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32" id="strategies">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 px-3 py-1 text-sm text-white font-medium shadow-lg shadow-blue-500/50 animate-pulse">
              Strategies
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Optimized Strategies</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our vault uses multiple strategies to maximize your BTC returns.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-2">
          <Card className="group overflow-hidden rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 ease-out hover:-translate-y-2 hover:rotate-1 hover:border-purple-500 dark:hover:border-purple-400 hover:scale-[1.02] animate-fade-in will-change-transform">
            <div className="relative h-56 w-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
              <div className="relative w-4/5 max-w-[300px] py-6 transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-2 will-change-transform">
                <Image
                  src="/ekubo-logo.png"
                  alt="Ekubo Logo"
                  width={400}
                  height={150}
                  className="object-contain w-full transition-all duration-300 ease-out group-hover:brightness-110 will-change-transform"
                />
              </div>
              <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ease-out group-hover:scale-110 group-hover:bg-purple-400 will-change-transform">
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
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-1 focus:scale-105 focus:shadow-lg focus:-translate-y-1 transform">
                    Learn More
                  </Button>
                </div>
              </CardFooter>
            </div>
          </Card>

          <Card className="group overflow-hidden rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 ease-out hover:-translate-y-2 hover:-rotate-1 hover:border-blue-500 dark:hover:border-blue-400 hover:scale-[1.02] animate-fade-in will-change-transform">
            <div className="relative h-56 w-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10"></div>
              <div className="relative w-3/4 max-w-[250px] py-6 transition-all duration-300 ease-out group-hover:scale-110 group-hover:-rotate-2 will-change-transform">
                <Image
                  src="/vesu-logo.png"
                  alt="Vesu Logo"
                  width={300}
                  height={120}
                  className="object-contain w-full transition-all duration-300 ease-out group-hover:brightness-110 will-change-transform"
                />
              </div>
              <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ease-out group-hover:scale-110 group-hover:bg-blue-400 will-change-transform">
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
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-1 focus:scale-105 focus:shadow-lg focus:-translate-y-1 transform">
                    Learn More
                  </Button>
                </div>
              </CardFooter>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
