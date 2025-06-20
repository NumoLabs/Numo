import { BookOpen, Play, Clock, TrendingUp, Users, Lock, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 md:p-12 mb-8 text-white">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-8 w-8" />
              <Badge className="bg-white/20 text-white border-white/30">Complete Guide</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Master Decentralized
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Finance
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              Learn the fundamental concepts of DeFi, liquidity pools, and investment strategies in a simple and
              practical way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 gap-2">
                <Play className="h-5 w-5" />
                Start Now
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm gap-2"
              >
                <Clock className="h-5 w-5" />
                15 min read
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-30" />
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-300" />
                    <p className="text-sm font-medium">APY Promedio</p>
                    <p className="text-2xl font-bold">5.8%</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-blue-300" />
                    <p className="text-sm font-medium">Usuarios Activos</p>
                    <p className="text-2xl font-bold">10K+</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Lock className="h-8 w-8 mx-auto mb-2 text-purple-300" />
                    <p className="text-sm font-medium">TVL Total</p>
                    <p className="text-2xl font-bold">$50M</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
                    <p className="text-sm font-medium">Protocolos</p>
                    <p className="text-2xl font-bold">2+</p>
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
