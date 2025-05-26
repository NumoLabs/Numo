"use client"

import Link from "next/link"
import { ArrowRight, Settings, TrendingUp, Download, Plus, MoreVertical, Bitcoin } from "lucide-react"

import { Button } from "@/components/ui/button"

export function VaultHero() {
  return (
    <section className="w-full pt-4 pb-12 md:pt-8 md:pb-20 lg:pt-12 lg:pb-28 bg-gray-100 dark:bg-gray-900/20">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">Numo</h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Maximiza tu rendimiento en BTC sin complicaciones. Deposita BTC y deja que nuestra vault encuentre
                automáticamente la mejor estrategia.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/app">
                <Button size="lg" className="gap-1">
                  Comenzar ahora
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline">
                  Cómo funciona
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-[320px] h-[600px] rounded-[40px] overflow-hidden border-8 border-black bg-black shadow-2xl">
              {/* Phone frame */}
              <div className="absolute top-0 left-0 right-0 h-6 bg-black z-10 flex justify-center">
                <div className="w-32 h-5 bg-black rounded-b-xl"></div>
              </div>

              {/* App content */}
              <div className="relative h-full bg-gray-900 text-white overflow-hidden pt-6">
                {/* Status bar */}
                <div className="flex justify-between items-center px-5 py-2">
                  <div className="text-sm font-medium">9:41</div>
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 flex items-end space-x-px">
                      <div className="w-1 h-1 bg-white rounded-sm"></div>
                      <div className="w-1 h-2 bg-white rounded-sm"></div>
                      <div className="w-1 h-3 bg-white rounded-sm"></div>
                      <div className="w-1 h-4 bg-white rounded-sm"></div>
                    </div>
                    <div className="w-4 h-4">
                      <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                        <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
                      </svg>
                    </div>
                    <div className="w-6 h-3 border border-white rounded-sm relative">
                      <div className="absolute top-0 left-0 bottom-0 right-1 bg-white rounded-sm"></div>
                    </div>
                  </div>
                </div>

                {/* User profile */}
                <div className="flex justify-between items-center px-5 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                      <span className="text-sm font-bold">N</span>
                    </div>
                    <span className="font-medium">@numo_user</span>
                  </div>
                  <Settings className="w-6 h-6 text-gray-400" />
                </div>

                {/* Vault value */}
                <div className="px-5 pt-4">
                  <div className="text-gray-400 text-sm flex items-center">
                    Valor total de la vault
                    <div className="w-4 h-4 ml-1 rounded-full border border-gray-400 flex items-center justify-center">
                      <span className="text-xs">i</span>
                    </div>
                  </div>
                  <div className="text-4xl font-bold mt-1">$2,845.67</div>
                  <div className="flex items-center mt-1">
                    <span className="text-green-500 mr-2">+$128.45</span>
                    <div className="bg-green-500/20 text-green-500 px-2 py-0.5 rounded flex items-center text-sm">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      5.23%
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex px-5 mt-6 space-x-3">
                  <button className="flex-1 bg-gray-800 rounded-full py-3 flex items-center justify-center">
                    <Plus className="w-5 h-5 mr-2" />
                    <span>Depositar</span>
                  </button>
                  <button className="flex-1 bg-gray-800 rounded-full py-3 flex items-center justify-center">
                    <Download className="w-5 h-5 mr-2" />
                    <span>Retirar</span>
                  </button>
                  <button className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-800 mt-6">
                  <button className="flex-1 text-center py-3 border-b-2 border-white font-medium">Estrategias</button>
                  <button className="flex-1 text-center py-3 text-gray-500">Historial</button>
                </div>

                {/* Strategies list */}
                <div className="px-5 py-4">
                  <div className="bg-gray-800 rounded-lg p-4 mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center mr-3">
                        <Bitcoin className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">BTC-ETH Pool</div>
                        <div className="text-sm text-gray-400">Ekubo DEX</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">$1,245.32</div>
                        <div className="text-sm text-green-500">+4.8%</div>
                      </div>
                    </div>
                    <div className="mt-3 bg-gray-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-blue-500 h-full rounded-full"
                        style={{ width: "65%" }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <div>Asignación: 65%</div>
                      <div>APY: 12.4%</div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white">
                          <path
                            fill="currentColor"
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">BTC-USDC Vault</div>
                        <div className="text-sm text-gray-400">Vesu Finance</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">$985.45</div>
                        <div className="text-sm text-green-500">+3.2%</div>
                      </div>
                    </div>
                    <div className="mt-3 bg-gray-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full"
                        style={{ width: "35%" }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <div>Asignación: 35%</div>
                      <div>APY: 8.7%</div>
                    </div>
                  </div>

                  <button className="w-full py-3 border border-dashed border-gray-700 rounded-lg text-gray-400 mt-2 flex items-center justify-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Añadir nueva estrategia
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
