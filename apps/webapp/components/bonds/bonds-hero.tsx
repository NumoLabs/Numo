import { Lock, TrendingUp, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface BondsHeroProps {
  totalTVL?: string
  lockOptions?: number
  minLock?: string
  apy?: string | null
  isLoading?: boolean
}

export function BondsHero({ 
  totalTVL = '0.0000', 
  lockOptions = 3, 
  minLock = '7d',
  apy = null,
  isLoading = false 
}: BondsHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-bitcoin-gradient p-8 md:p-12 mb-8 text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-bitcoin-gold/20 to-bitcoin-orange/20 rounded-full blur-3xl"></div>
      <div className="relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-8 w-8" />
              <Badge className="bg-white/20 text-white border-white/30">BTC Bonds</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Boost your yield by
              <span className="block bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                locking your BTC
              </span>
            </h1>
            <p className="text-xl text-orange-100 mb-6">
              Lock your WBTC for a fixed period and earn higher rewards. Choose your preferred lock duration and let
              your BTC work harder.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 gap-2">
                <Lock className="h-5 w-5" />
                Start Locking
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm gap-2"
              >
                <Clock className="h-5 w-5" />
                Learn More
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-bitcoin-gold to-bitcoin-orange rounded-full blur-3xl opacity-30"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-bitcoin-gold" />
                    <p className="text-sm font-medium">Total TVL</p>
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 mx-auto mt-1 animate-spin text-bitcoin-gold" />
                    ) : (
                      <p className="text-2xl font-bold">{totalTVL} wBTC</p>
                    )}
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Lock className="h-8 w-8 mx-auto mb-2 text-bitcoin-orange" />
                    <p className="text-sm font-medium">Lock Options</p>
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 mx-auto mt-1 animate-spin text-bitcoin-orange" />
                    ) : (
                      <p className="text-2xl font-bold">{lockOptions}</p>
                    )}
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-bitcoin-gold" />
                    <p className="text-sm font-medium">Max APY</p>
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 mx-auto mt-1 animate-spin text-bitcoin-gold" />
                    ) : (
                      <p className="text-2xl font-bold">{apy || 'N/A'}</p>
                    )}
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-bitcoin-orange" />
                    <p className="text-sm font-medium">Min Lock</p>
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 mx-auto mt-1 animate-spin text-bitcoin-orange" />
                    ) : (
                      <p className="text-2xl font-bold">{minLock}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
