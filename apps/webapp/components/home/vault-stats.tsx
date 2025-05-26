import { ArrowUpRight, Bitcoin, Percent, TrendingUp } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function VaultStats() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32" id="stats">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 px-3 py-1 text-sm text-white font-medium shadow-lg shadow-blue-500/50 animate-pulse">
              Estadísticas en tiempo real
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Rendimiento Actual</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Nuestra vault constantemente busca y aplica las mejores estrategias para maximizar tu rendimiento en BTC.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
          <div className="p-[3px] rounded-lg bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-gradient-x">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">APY Actual</CardTitle>
                <TrendingUp className="w-4 h-4 text-gray-800 dark:text-gray-200" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5.8%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 inline-flex items-center">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +0.3%
                  </span>{" "}
                  desde el último rebalanceo
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="p-[3px] rounded-lg bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-gradient-x">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Depositado</CardTitle>
                <Bitcoin className="w-4 h-4 text-gray-800 dark:text-gray-200" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127.45 BTC</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 inline-flex items-center">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +12.3%
                  </span>{" "}
                  en los últimos 30 días
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="p-[3px] rounded-lg bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-gradient-x">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Estrategia Actual</CardTitle>
                <Percent className="w-4 h-4 text-gray-800 dark:text-gray-200" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Ekubo</div>
                <p className="text-xs text-muted-foreground">Pool BTC/USDC con 70% de los fondos</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
