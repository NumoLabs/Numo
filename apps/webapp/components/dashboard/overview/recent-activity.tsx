import Link from "next/link"
import { Activity, Eye, Upload, RefreshCw, Award } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getRecentActivity } from "@/lib/dashboard-data"

const iconMap = {
  Upload,
  RefreshCw,
  Award,
}

const colorMap = {
  green: {
    bg: "bg-green-50 dark:bg-green-950/20",
    border: "border-green-200 dark:border-green-800",
    badge: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    text: "text-green-600",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/20",
    border: "border-blue-200 dark:border-blue-800",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    text: "text-blue-600",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950/20",
    border: "border-purple-200 dark:border-purple-800",
    badge: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    text: "text-purple-600",
  },
}

export function RecentActivity() {
  const activities = getRecentActivity()

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              Actividad Reciente
            </CardTitle>
            <CardDescription>Últimas transacciones y rebalanceos automáticos</CardDescription>
          </div>
          <Link href="/history">
            <Button variant="outline" size="sm" className="gap-2">
              <Eye className="h-4 w-4" />
              Ver Todo
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const IconComponent = iconMap[activity.icon as keyof typeof iconMap]
            const colors = colorMap[activity.color as keyof typeof colorMap]

            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-lg ${colors.bg} border ${colors.border}`}
              >
                <div className={`h-10 w-10 rounded-full bg-${activity.color}-500 flex items-center justify-center`}>
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{activity.title}</p>
                    <Badge className={colors.badge}>{activity.badge}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${colors.text}`}>{activity.value}</p>
                  <p className="text-sm text-muted-foreground">{activity.subValue}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
