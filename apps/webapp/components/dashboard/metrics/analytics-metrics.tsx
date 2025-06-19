import { TrendingUp, BarChart3, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getAnalyticsMetrics } from "@/lib/dashboard-data"

const iconMap = {
  TrendingUp,
  BarChart3,
  Target,
}

const colorMap = {
  green: {
    bg: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
    icon: "bg-green-500",
    text: "text-green-600",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
    icon: "bg-blue-500",
    text: "text-blue-600",
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
    icon: "bg-purple-500",
    text: "text-purple-600",
  },
}

export function AnalyticsMetrics() {
  const metrics = getAnalyticsMetrics()

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {metrics.map((metric, index) => {
        const IconComponent = iconMap[metric.icon as keyof typeof iconMap]
        const colors = colorMap[metric.color as keyof typeof colorMap]

        return (
          <Card key={index} className={`border-0 shadow-lg ${colors.bg}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className={`h-8 w-8 rounded-full ${colors.icon} flex items-center justify-center`}>
                  <IconComponent className="h-4 w-4 text-white" />
                </div>
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {metric.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className={`font-semibold ${colors.text}`}>{item.value}</span>
                </div>
              ))}
              {metric.title === "Strategy Efficiency" && (
                <div className="space-y-2">
                  {metric.items.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.label}</span>
                        <span className="font-medium">{item.value}</span>
                      </div>
                      <Progress value={Number.parseInt(item.value)} className="h-2" />
                    </div>
                  ))}
                </div>
              )}
              {metric.title === "APY Comparison" && (
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>+38%</strong> better than DeFi average
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
