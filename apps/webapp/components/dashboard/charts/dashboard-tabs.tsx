import Link from "next/link"
import { PieChart, Activity, Eye, LineChart, TrendingUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardChart } from "./dashboard-chart"
import { DashboardTransactions } from "../transactions"

export function DashboardTabs() {
  return (
    <Tabs defaultValue="overview" className="space-y-6 mt-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <TabsList className="grid w-full md:w-auto grid-cols-2 h-12 rounded-full p-1">
          <TabsTrigger
            value="overview"
            className="gap-2 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:via-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100 transition-all duration-300 ease-in-out"
          >
            <PieChart className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="transactions"
            className="gap-2 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:via-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100 transition-all duration-300 ease-in-out"
          >
            <Activity className="h-4 w-4" />
            Transactions
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="overview" className="space-y-6">
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
      </TabsContent>

      <TabsContent value="transactions" className="space-y-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-orange-500" />
                  Transaction History
                </CardTitle>
                <CardDescription>Complete history of deposits, withdrawals, and rebalancing</CardDescription>
              </div>
              <Link href="/history" className="w-full md:w-auto">
                <Button className="w-full md:w-auto gap-2 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 hover:from-orange-400 hover:via-yellow-400 hover:to-orange-400 text-black border-0">
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
