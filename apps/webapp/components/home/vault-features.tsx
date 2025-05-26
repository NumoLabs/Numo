import { ArrowUpDown, Bitcoin, Clock, Shield } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function VaultFeatures() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-900/20" id="features">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 px-3 py-1 text-sm text-white font-medium shadow-lg shadow-blue-500/50 animate-pulse">
              Características
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">¿Por qué elegir nuestra Vault?</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Diseñada para maximizar tu rendimiento en BTC sin complicaciones.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Bitcoin className="w-8 h-8 text-orange-500 dark:text-orange-400 mb-4" />
              <CardTitle>100% Exposición a BTC</CardTitle>
              <CardDescription>
                Todo el rendimiento se mantiene en BTC o WBTC, asegurando que tu exposición sea siempre al activo que
                deseas.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <ArrowUpDown className="w-8 h-8 text-blue-500 dark:text-blue-400 mb-4" />
              <CardTitle>Rebalanceo Automático</CardTitle>
              <CardDescription>
                La vault mueve automáticamente los fondos entre Vesu y Ekubo para encontrar el mejor rendimiento
                disponible.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Shield className="w-8 h-8 text-green-500 dark:text-green-400 mb-4" />
              <CardTitle>Seguridad Descentralizada</CardTitle>
              <CardDescription>
                Construido sobre Starknet con contratos inteligentes auditados para garantizar la seguridad de tus
                fondos.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Clock className="w-8 h-8 text-purple-500 dark:text-purple-400 mb-4" />
              <CardTitle>Disponibilidad Inmediata</CardTitle>
              <CardDescription>
                Retira tus fondos en cualquier momento junto con el rendimiento acumulado en WBTC.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="md:col-span-2 lg:col-span-2">
            <CardHeader>
              <CardTitle>Cómo Funciona</CardTitle>
              <CardDescription>Un proceso simple y automatizado para maximizar tu rendimiento.</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-50">
                    1
                  </div>
                  <div className="text-left">
                    <strong>Depósito:</strong> Deposita WBTC en el contrato de la vault.
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-50">
                    2
                  </div>
                  <div className="text-left">
                    <strong>Análisis:</strong> La vault consulta oráculos de Pragma para obtener precios, volatilidad y
                    APYs estimados.
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-50">
                    3
                  </div>
                  <div className="text-left">
                    <strong>Asignación:</strong> Los fondos se mueven automáticamente hacia la estrategia con mayor
                    rendimiento.
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-50">
                    4
                  </div>
                  <div className="text-left">
                    <strong>Rebalanceo:</strong> Periódicamente se evalúan las estrategias y se ajustan para maximizar
                    el rendimiento.
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
