import { LineChart, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardChart } from "./dashboard-chart"

export function DashboardTabs() {
  return (
    <div className="space-y-6 mt-8">
      {/* Historical Performance Chart */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-orange-500" />
                Historical Performance
              </CardTitle>
              <CardDescription>Evolution of your investment over the last months</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <TrendingUp className="h-3 w-3" />
                Upward trend
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pl-2">
          <DashboardChart />
        </CardContent>
      </Card>
    </div>
  )
}
