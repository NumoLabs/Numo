import { ArrowUpRight, Bitcoin, Percent, TrendingUp } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function VaultStats() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-black" id="stats">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 px-3 py-1 text-sm text-white font-medium shadow-lg shadow-blue-500/50 animate-pulse">
              Platform Stats
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Numo by the Numbers</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Real-time metrics: vault performance, BTC locked, active strategies, users, and bond yields.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
          <div className="group p-[3px] rounded-lg bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-gradient-x hover:shadow-xl transition-all duration-300">
            <Card className="h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Vault APY</CardTitle>
                <TrendingUp className="w-4 h-4 text-gray-800 dark:text-gray-200 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold transition-all duration-300 group-hover:scale-105">5.8%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 inline-flex items-center">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +0.3%
                  </span>{" "}
                  last 30 days
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="group p-[3px] rounded-lg bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-gradient-x hover:shadow-xl transition-all duration-300">
            <Card className="h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">BTC Locked</CardTitle>
                <Bitcoin className="w-4 h-4 text-gray-800 dark:text-gray-200 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold transition-all duration-300 group-hover:scale-105">127.45 BTC</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 inline-flex items-center">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +12.3%
                  </span>{" "}
                  last 30 days
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="group p-[3px] rounded-lg bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-gradient-x hover:shadow-xl transition-all duration-300">
            <Card className="h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Active Strategies</CardTitle>
                <Percent className="w-4 h-4 text-gray-800 dark:text-gray-200 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold transition-all duration-300 group-hover:scale-105">
                  Ekubo, Vesu, Custom
                </div>
                <p className="text-xs text-muted-foreground">Community and protocol strategies live</p>
              </CardContent>
            </Card>
          </div>
          <div className="group p-[3px] rounded-lg bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-gradient-x hover:shadow-xl transition-all duration-300">
            <Card className="h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Users</CardTitle>
                <Bitcoin className="w-4 h-4 text-gray-800 dark:text-gray-200 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold transition-all duration-300 group-hover:scale-105">4,400+</div>
                <p className="text-xs text-muted-foreground">Active users on Numo</p>
              </CardContent>
            </Card>
          </div>
          <div className="group p-[3px] rounded-lg bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-gradient-x hover:shadow-xl transition-all duration-300">
            <Card className="h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Bond Yields</CardTitle>
                <Percent className="w-4 h-4 text-gray-800 dark:text-gray-200 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold transition-all duration-300 group-hover:scale-105">Up to 8.2%</div>
                <p className="text-xs text-muted-foreground">Depending on lock duration</p>
              </CardContent>
            </Card>
          </div>
          <div className="group p-[3px] rounded-lg bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-gradient-x hover:shadow-xl transition-all duration-300">
            <Card className="h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Forecasts Simulated</CardTitle>
                <Percent className="w-4 h-4 text-gray-800 dark:text-gray-200 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold transition-all duration-300 group-hover:scale-105">12,000+</div>
                <p className="text-xs text-muted-foreground">Yield simulations run by users</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
