import { Zap, CheckCircle, Lightbulb } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function DefiExplanation() {
  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 border-b">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">¿Qué es DeFi?</h2>
            <p className="text-blue-700 dark:text-blue-300">Finanzas descentralizadas: el futuro del dinero</p>
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed mb-6">
            DeFi (Finanzas Descentralizadas) representa una revolución en el sistema financiero tradicional. Imagina un
            mundo donde puedes prestar, pedir prestado, intercambiar e invertir sin necesidad de bancos o
            intermediarios.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">Finanzas Tradicionales</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  Bancos como intermediarios
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  Horarios de operación limitados
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  Requisitos de documentación
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  Comisiones altas
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">DeFi</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  Sin intermediarios
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  Disponible 24/7
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  Solo necesitas una wallet
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  Comisiones transparentes
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  Características Clave de DeFi
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-purple-800 dark:text-purple-200 mb-2">
                      🔓 Sin Permisos (Permissionless)
                    </h5>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Cualquier persona con una wallet puede acceder a servicios DeFi, sin necesidad de aprobaciones o
                      verificaciones.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-purple-800 dark:text-purple-200 mb-2">🔍 Transparente</h5>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Todas las transacciones son públicas y verificables en la blockchain, eliminando la opacidad del
                      sistema tradicional.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-purple-800 dark:text-purple-200 mb-2">🔗 Interoperable</h5>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Los protocolos DeFi pueden trabajar juntos como bloques de construcción, creando experiencias
                      financieras complejas.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-purple-800 dark:text-purple-200 mb-2">🔐 Sin Custodios</h5>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Mantienes el control total de tus activos en todo momento, sin depender de terceros.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
