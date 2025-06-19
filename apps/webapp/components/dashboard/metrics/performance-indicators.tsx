import { TrendingUp, Activity, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getPerformanceIndicators } from "@/lib/dashboard-data"

const iconMap = {
  TrendingUp,
  Activity,
  Shield,
}

const colorMap = {
  green: {
    gradient: "from-green-500 to-emerald-500",
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-600",
    badge: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
  blue: {
    gradient: "from-blue-500 to-purple-500",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-600",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  },
  orange: {
    gradient: "from-orange-500 to-red-500",
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-600",
    badge: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  },
}

export function PerformanceIndicators() {
  const indicators = getPerformanceIndicators()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {indicators.map((indicator, index) => {
        const IconComponent =
          iconMap[
            indicator.title.includes("24h") ? "TrendingUp" : indicator.title.includes("Estado") ? "Activity" : "Shield"
          ]
        const colors = colorMap[indicator.color as keyof typeof colorMap]

        return (
          <Card key={index} className="relative overflow-hidden border-0 shadow-lg">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient}`} />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-full ${colors.bg} flex items-center justify-center`}>
                    <IconComponent className={`h-4 w-4 ${colors.text}`} />
                  </div>
                  {indicator.title}
                </CardTitle>
                <Badge className={colors.badge}>{indicator.badge}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {indicator.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className={`font-semibold ${colors.text}`}>{item.value}</span>
                  </div>
                ))}
                <Progress value={indicator.progress} className="h-2" />
                <p className="text-xs text-muted-foreground">{indicator.description}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
