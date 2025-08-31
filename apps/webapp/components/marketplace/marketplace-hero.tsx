import { TrendingUp, Users, Shield, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function MarketplaceHero() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-950/20 dark:via-orange-950/20 dark:to-red-950/20 p-8 mb-8">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-bitcoin-orange to-bitcoin-gold flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-yellow-400" />
          </div>
          <h1 className="text-3xl font-bold text-bitcoin-orange">Vault Marketplace</h1>
        </div>

        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
          Browse community-generated BTC vaults, compare APYs, and follow the strategy that fits your goals. Discover
          proven strategies from top performers in the ecosystem.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white/50 dark:bg-gray-900/50 border-0">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold">5</div>
              <div className="text-sm text-muted-foreground">Active Strategies</div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-gray-900/50 border-0">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-bitcoin-gold" />
              </div>
              <div className="text-2xl font-bold">4.4K</div>
              <div className="text-sm text-muted-foreground">Total Followers</div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-gray-900/50 border-0">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Shield className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold">492.4</div>
              <div className="text-sm text-muted-foreground">Total BTC</div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-gray-900/50 border-0">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-5 w-5 text-orange-500" />
              </div>
              <div className="text-2xl font-bold">12.4%</div>
              <div className="text-sm text-muted-foreground">Highest APY</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 dark:from-yellow-800/10 dark:to-orange-800/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-200/20 to-red-200/20 dark:from-orange-800/10 dark:to-red-800/10 rounded-full blur-3xl" />
    </div>
  )
}
