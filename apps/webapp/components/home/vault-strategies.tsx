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
              Estrategias
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Estrategias Optimizadas</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Nuestra vault utiliza múltiples estrategias para maximizar el rendimiento de tu BTC.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2">
          <Card className="overflow-hidden">
            <div className="h-48 w-full bg-black flex items-center justify-center overflow-hidden">
              <div className="w-4/5 max-w-[300px] py-6">
                <Image
                  src="/ekubo-logo.png"
                  alt="Ekubo Logo"
                  width={400}
                  height={150}
                  className="object-contain w-full"
                />
              </div>
            </div>
            <CardHeader>
              <CardTitle>Estrategia Ekubo</CardTitle>
              <CardDescription>Proveer liquidez en pools BTC/USDC para generar comisiones de trading.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Aprovecha la arquitectura AMM optimizada de Ekubo</li>
                <li>Genera rendimiento a través de comisiones de trading</li>
                <li>Ideal en mercados con alto volumen de operaciones</li>
                <li>Todas las comisiones se convierten automáticamente a WBTC</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                APY Actual: 4.8%
              </Button>
            </CardFooter>
          </Card>
          <Card className="overflow-hidden">
            <div className="h-48 w-full bg-black flex items-center justify-center overflow-hidden">
              <div className="w-3/4 max-w-[250px] py-6">
                <Image
                  src="/vesu-logo.png"
                  alt="Vesu Logo"
                  width={300}
                  height={120}
                  className="object-contain w-full"
                />
              </div>
            </div>
            <CardHeader>
              <CardTitle>Estrategia Vesu</CardTitle>
              <CardDescription>Participar en vaults o préstamos con BTC para generar intereses.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Utiliza la plataforma de préstamos descentralizados Vesu</li>
                <li>Genera rendimiento a través de intereses de préstamos</li>
                <li>Ideal en mercados con alta demanda de préstamos de BTC</li>
                <li>Todos los intereses se acumulan directamente en WBTC</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                APY Actual: 5.8%
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}
