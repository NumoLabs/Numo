import Link from "next/link"
import { PieChart, BarChart3, Activity, RefreshCw, Settings, Eye, LineChart, TrendingUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardChart } from "./dashboard-chart"
import { DashboardTransactions } from "../transactions"
import { PortfolioOverview } from "../overview"
import { StrategyDistribution } from "../overview"
import { RecentActivity } from "../overview"
import { AnalyticsMetrics } from "../metrics"
import { RebalancingHistory } from "../analytics"

export function DashboardTabs() {
  return (
    <Tabs defaultValue="overview" className="space-y-6 mt-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <TabsList className="grid w-full md:w-auto grid-cols-3 h-12">
          <TabsTrigger
            value="overview"
            className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:via-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100 transition-all duration-300 ease-in-out"
          >
            <PieChart className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:via-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100 transition-all duration-300 ease-in-out"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger
            value="transactions"
            className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:via-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100 transition-all duration-300 ease-in-out"
          >
            <Activity className="h-4 w-4" />
            Transactions
          </TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 hover:scale-105 active:scale-95 transition-all duration-300 hover:shadow-md"
          >
            <RefreshCw className="h-4 w-4 transition-transform duration-300 hover:rotate-180" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 hover:scale-105 active:scale-95 transition-all duration-300 hover:shadow-md"
          >
            <Settings className="h-4 w-4 transition-transform duration-300 hover:rotate-90" />
            Configure
          </Button>
        </div>
      </div>

      <TabsContent value="overview" className="space-y-6">
        {/* Portfolio Overview */}
        <PortfolioOverview />

        {/* Charts and Strategy Distribution */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4 border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-blue-500" />
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

          <StrategyDistribution />
        </div>

        {/* Recent Activity */}
        <RecentActivity />
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6">
        {/* Performance Metrics */}
        <AnalyticsMetrics />

        {/* Detailed Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-orange-500" />
                Strategy Performance
              </CardTitle>
              <CardDescription>Performance comparison between Ekubo and Vesu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-orange-500 mx-auto mb-2" />
                  <p className="text-muted-foreground">Strategy performance chart</p>
                  <p className="text-sm text-muted-foreground">(Ekubo vs Vesu)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                APY History
              </CardTitle>
              <CardDescription>APY evolution over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-center">
                  <LineChart className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-muted-foreground">Historical APY chart</p>
                  <p className="text-sm text-muted-foreground">(Last 6 months)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rebalancing History */}
        <RebalancingHistory />
      </TabsContent>

      <TabsContent value="transactions" className="space-y-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  Transaction History
                </CardTitle>
                <CardDescription>Complete history of deposits, withdrawals, and rebalancing</CardDescription>
              </div>
              <Link href="/history">
                <Button className="gap-2">
                  <Eye className="h-4 w-4" />
                  View Full History
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <DashboardTransactions />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
