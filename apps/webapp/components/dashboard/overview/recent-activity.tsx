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
  yellow: {
    bg: "bg-yellow-50 dark:bg-yellow-950/20",
    border: "border-yellow-200 dark:border-yellow-800",
    badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    text: "text-yellow-600",
  },
}

export function RecentActivity() {
  const activities = getRecentActivity()

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex-1 min-w-0">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="truncate">Recent Activity</span>
            </CardTitle>
            <CardDescription className="truncate">Latest transactions and automatic rebalances</CardDescription>
          </div>
          <Link href="/history" className="flex-shrink-0">
            <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">View All</span>
              <span className="sm:hidden">All</span>
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          {activities.map((activity, index) => {
            const IconComponent = iconMap[activity.icon as keyof typeof iconMap]
            const colors = colorMap[activity.color as keyof typeof colorMap]

            return (
              <div
                key={index}
                className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg ${colors.bg} border ${colors.border} overflow-hidden`}
              >
                <div className={`h-10 w-10 rounded-full bg-${activity.color}-500 flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0 w-full sm:w-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                    <p className="font-medium text-sm sm:text-base break-words">{activity.title}</p>
                    <Badge className={`${colors.badge} text-xs whitespace-nowrap flex-shrink-0 self-start sm:self-auto`}>{activity.badge}</Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground break-words">{activity.description}</p>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto flex-shrink-0 sm:ml-auto">
                  <p className={`font-semibold text-sm sm:text-base ${colors.text} break-words`}>{activity.value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground break-words">{activity.subValue}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
