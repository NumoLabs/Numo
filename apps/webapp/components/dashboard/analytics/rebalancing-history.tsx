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
    bg: "bg-gradient-to-r from-orange-500/10 to-yellow-500/10",
    border: "border-orange-500/30",
    badge: "bg-orange-500 text-white",
    text: "text-orange-400",
  },
  blue: {
    bg: "bg-gradient-to-r from-yellow-500/10 to-orange-500/10",
    border: "border-yellow-500/30",
    badge: "bg-yellow-500 text-black",
    text: "text-yellow-400",
  },
  purple: {
    bg: "bg-gradient-to-r from-orange-500/15 to-yellow-500/15",
    border: "border-orange-500/40",
    badge: "bg-orange-500 text-white",
    text: "text-orange-400",
  },
}

export function RebalancingHistory() {
  const rebalanceEvents = getRebalanceHistory()

  return (
    <Card className="border-0 shadow-lg bg-black/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <RefreshCw className="h-5 w-5 text-orange-500" />
          Rebalancing History
        </CardTitle>
        <CardDescription className="text-gray-300">Automatic optimizations performed by the vault</CardDescription>
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
                <div className={`h-12 w-12 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center`}>
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-white">{event.title}</p>
                    <Badge className={colors.badge}>{event.badge}</Badge>
                  </div>
                  <p className="text-sm text-gray-300">{event.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    {event.tags.map((tag, tagIndex) => {
                      const TagIcon = iconMap[tag.icon as keyof typeof iconMap]
                      return (
                        <div key={tagIndex} className="flex items-center gap-1">
                          <TagIcon className={`h-3 w-3 text-yellow-500`} />
                          <span className={`text-xs text-yellow-400`}>{tag.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${colors.text}`}>{event.value}</p>
                  <p className="text-sm text-gray-300">{event.subValue}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
