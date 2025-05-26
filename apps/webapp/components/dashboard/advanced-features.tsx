import Link from "next/link"
import { Target, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getAdvancedFeatures } from "@/lib/dashboard-data"

const iconMap = {
  Target,
  BookOpen,
}

export function AdvancedFeatures() {
  const features = getAdvancedFeatures()

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {features.map((feature, index) => {
        const IconComponent = iconMap[feature.icon as keyof typeof iconMap]

        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<Card key={index} className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full bg-${feature.color}-500 flex items-center justify-center`}>
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
                {feature.title}
              </CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feature.stats.map((stat, statIndex) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<div key={statIndex} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                    <Badge variant="secondary">{stat.value}</Badge>
                  </div>
                ))}
                {feature.title === "Aprende sobre DeFi" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Conceptos Básicos</span>
                      <span>0/3 completados</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  {feature.title === "Pools Personalizados"
                    ? "Selecciona manualmente los pools de liquidez y asigna porcentajes específicos según tu estrategia de inversión."
                    : "Guías paso a paso, explicaciones de conceptos y estrategias para maximizar tus rendimientos mientras minimizas riesgos."}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={feature.buttonHref} className="w-full">
                <Button variant={feature.buttonVariant} className="w-full gap-2">
                  <IconComponent className="h-4 w-4" />
                  {feature.buttonText}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
