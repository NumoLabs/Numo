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

function getFeatureBgColor(color: string) {
  if (color === "black") return "bg-black"
  if (color === "zinc") return "bg-zinc-900"
  return `bg-${color}-500`
}

function getButtonBgColor(color?: string) {
  if (!color) return ''
  if (color === "black") return "bg-black hover:bg-zinc-900 text-white"
  if (color === "zinc") return "bg-zinc-900 hover:bg-zinc-800 text-white"
  if (color === "amber") return "bg-amber-500 hover:bg-amber-600 text-white"
  if (color === "green") return "bg-green-500 hover:bg-green-600 text-white"
  return ''
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
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getFeatureBgColor(feature.color)}`}>
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
                {feature.title === "Learn about DeFi" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Basic Concepts</span>
                      <span>0/3 completed</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  {feature.title === "Custom Pools"
                    ? "Manually select liquidity pools and assign specific percentages according to your investment strategy."
                    : "Step-by-step guides, concept explanations, and strategies to maximize your returns while minimizing risks."}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={feature.buttonHref} className="w-full">
                <Button
                  variant={feature.buttonVariant}
                  className={`w-full gap-2 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg active:scale-95 group ${getButtonBgColor(feature.buttonColor)}`}
                >
                  <IconComponent className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
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
