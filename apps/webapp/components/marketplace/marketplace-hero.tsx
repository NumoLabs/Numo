import { TrendingUp, Users, Shield, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function MarketplaceHero() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20 p-8 mb-8">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Vault Marketplace</h1>
        </div>

        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
          Browse community-generated BTC vaults, compare APYs, and follow the strategy that fits your goals. Discover
          proven strategies from top performers in the ecosystem.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white/50 dark:bg-gray-900/50 border-0">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold">5</div>
              <div className="text-sm text-muted-foreground">Active Strategies</div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-gray-900/50 border-0">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold">4.4K</div>
              <div className="text-sm text-muted-foreground">Total Followers</div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-gray-900/50 border-0">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Shield className="h-5 w-5 text-purple-500" />
              </div>
              <div className="text-2xl font-bold">492.4</div>
              <div className="text-sm text-muted-foreground">Total BTC</div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-gray-900/50 border-0">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold">12.4%</div>
              <div className="text-sm text-muted-foreground">Highest APY</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/20 to-blue-200/20 dark:from-purple-800/10 dark:to-blue-800/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-200/20 to-purple-200/20 dark:from-indigo-800/10 dark:to-purple-800/10 rounded-full blur-3xl" />
    </div>
  )
}
