import { RefreshCw, CheckCircle2, TrendingUp, Zap, Shield, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getRebalanceHistory } from "@/lib/dashboard-data"

const iconMap = {
  TrendingUp,
  Zap,
  Shield,
  Target,
}

const colorMap = {
  green: {
    bg: "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
    border: "border-green-200 dark:border-green-800",
    badge: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    text: "text-green-600",
  },
  blue: {
    bg: "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
    border: "border-blue-200 dark:border-blue-800",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    text: "text-blue-600",
  },
  purple: {
    bg: "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
    border: "border-purple-200 dark:border-purple-800",
    badge: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    text: "text-purple-600",
  },
}

export function RebalancingHistory() {
  const rebalanceEvents = getRebalanceHistory()

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-blue-500" />
          Historial de Rebalanceos
        </CardTitle>
        <CardDescription>Optimizaciones automáticas realizadas por la vault</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {rebalanceEvents.map((event, index) => {
            const colors = colorMap[event.color as keyof typeof colorMap]

            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-lg ${colors.bg} border ${colors.border}`}
              >
                <div className={`h-12 w-12 rounded-full bg-${event.color}-500 flex items-center justify-center`}>
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{event.title}</p>
                    <Badge className={colors.badge}>{event.badge}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    {event.tags.map((tag, tagIndex) => {
                      const TagIcon = iconMap[tag.icon as keyof typeof iconMap]
                      return (
                        <div key={tagIndex} className="flex items-center gap-1">
                          <TagIcon className={`h-3 w-3 text-${tag.color}-500`} />
                          <span className={`text-xs text-${tag.color}-600`}>{tag.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${colors.text}`}>{event.value}</p>
                  <p className="text-sm text-muted-foreground">{event.subValue}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
