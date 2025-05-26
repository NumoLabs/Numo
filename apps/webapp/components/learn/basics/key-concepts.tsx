import { Target, Zap, Coins, BarChart3, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function KeyConcepts() {
  const concepts = [
    {
      title: "Smart Contracts",
      description:
        "Programas que se ejecutan automáticamente cuando se cumplen condiciones específicas. Son como contratos tradicionales, pero escritos en código y ejecutados por la blockchain.",
      icon: Zap,
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      borderColor: "border-orange-200 dark:border-orange-800",
      iconBg: "bg-orange-500",
      titleColor: "text-orange-900 dark:text-orange-100",
      textColor: "text-orange-800 dark:text-orange-200",
    },
    {
      title: "Tokens",
      description:
        "Activos digitales que representan valor, derechos o utilidades dentro del ecosistema DeFi. Pueden ser criptomonedas, stablecoins o tokens de gobernanza.",
      icon: Coins,
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      iconBg: "bg-blue-500",
      titleColor: "text-blue-900 dark:text-blue-100",
      textColor: "text-blue-800 dark:text-blue-200",
    },
    {
      title: "Liquidez",
      description:
        "La facilidad con la que un activo puede convertirse en otro sin afectar significativamente su precio. Mayor liquidez = mejores precios y menos deslizamiento.",
      icon: BarChart3,
      bgColor: "bg-green-50 dark:bg-green-950/20",
      borderColor: "border-green-200 dark:border-green-800",
      iconBg: "bg-green-500",
      titleColor: "text-green-900 dark:text-green-100",
      textColor: "text-green-800 dark:text-green-200",
    },
    {
      title: "Yield Farming",
      description:
        "Estrategia para maximizar rendimientos moviendo activos entre diferentes protocolos DeFi para capturar las mejores oportunidades de retorno.",
      icon: TrendingUp,
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      iconBg: "bg-purple-500",
      titleColor: "text-purple-900 dark:text-purple-100",
      textColor: "text-purple-800 dark:text-purple-200",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Target className="h-6 w-6 text-orange-500" />
          Conceptos Fundamentales
        </CardTitle>
        <CardDescription>Los pilares que sostienen el ecosistema DeFi</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {concepts.map((concept) => (
            <div key={concept.title} className={`${concept.bgColor} rounded-lg p-4 border ${concept.borderColor}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`h-8 w-8 rounded-full ${concept.iconBg} flex items-center justify-center`}>
                  <concept.icon className="h-4 w-4 text-white" />
                </div>
                <h4 className={`font-semibold ${concept.titleColor}`}>{concept.title}</h4>
              </div>
              <p className={`text-sm ${concept.textColor}`}>{concept.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
