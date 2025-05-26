import Link from "next/link"
import { Upload, Download, Wallet, CheckCircle2, Activity, Bitcoin, TrendingUp, Star, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getQuickStats } from "@/lib/dashboard-data"

export function HeroSection() {
  const quickStats = getQuickStats()

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 md:p-12 text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl"></div>
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">¡Bienvenido de vuelta!</h1>
                <p className="text-blue-100">Tu vault está generando rendimientos automáticamente</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <Badge className="bg-green-500/20 text-green-100 border-green-400/30 gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Vault Activa
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-100 border-blue-400/30 gap-1">
                <Activity className="h-3 w-3" />
                Auto-Rebalanceando
              </Badge>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/app/deposit">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 gap-2 shadow-lg">
                <Upload className="h-5 w-5" />
                Depositar
              </Button>
            </Link>
            <Link href="/app/withdraw">
              <Button
                size="lg"
                variant="outline"
                className="border-white/50 text-white hover:bg-white/20 backdrop-blur-sm bg-white/10 gap-2"
              >
                <Download className="h-5 w-5" />
                Retirar
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-blue-100">{stat.label}</p>
                <div>
                  {stat.icon === "Bitcoin" && <Bitcoin className="h-5 w-5" />}
                  {stat.icon === "TrendingUp" && <TrendingUp className="h-5 w-5" />}
                  {stat.icon === "Star" && <Star className="h-5 w-5" />}
                  {stat.icon === "Clock" && <Clock className="h-5 w-5" />}
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-white">{stat.subValue}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
