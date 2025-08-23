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
    bg: "bg-gradient-to-br from-orange-500/10 to-yellow-500/10",
    icon: "bg-gradient-to-r from-orange-500 to-yellow-500",
    text: "text-orange-400",
  },
  blue: {
    bg: "bg-gradient-to-br from-yellow-500/10 to-orange-500/10",
    icon: "bg-gradient-to-r from-yellow-500 to-orange-500",
    text: "text-yellow-400",
  },
  purple: {
    bg: "bg-gradient-to-br from-orange-500/15 to-yellow-500/15",
    icon: "bg-gradient-to-r from-orange-500 to-yellow-500",
    text: "text-orange-400",
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
          <Card key={index} className={`border-0 shadow-lg ${colors.bg} bg-black/30`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <div className={`h-8 w-8 rounded-full ${colors.icon} flex items-center justify-center`}>
                  <IconComponent className="h-4 w-4 text-white" />
                </div>
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {metric.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">{item.label}</span>
                  <span className={`font-semibold ${colors.text}`}>{item.value}</span>
                </div>
              ))}
              {metric.title === "Strategy Efficiency" && (
                <div className="space-y-2">
                  {metric.items.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <div className="flex justify-between text-sm mb-1 text-white">
                        <span>{item.label}</span>
                        <span className="font-medium">{item.value}</span>
                      </div>
                      <Progress value={Number.parseInt(item.value)} className="h-2" />
                    </div>
                  ))}
                </div>
              )}
              {metric.title === "APY Comparison" && (
                <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-lg p-3 border border-orange-500/30">
                  <p className="text-sm text-white">
                    <strong className="text-yellow-400">+38%</strong> better than DeFi average
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
