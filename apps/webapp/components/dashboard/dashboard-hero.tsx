"use client"

import Link from "next/link"
import {
  Upload,
  Download,
  Wallet,
  Activity,
  Bitcoin,
  TrendingUp,
  Star,
  Clock,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export function DashboardHero() {
  const [showBalance, setShowBalance] = useState(true)

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 p-8 md:p-12 text-white mb-8 shadow-2xl">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl"></div>
      <div className="relative z-10">
        {/* Balance Toggle Button - Top Right Corner */}
        <div className="absolute -top-2 right-0 mb-4">
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-105 border border-white/20"
            title={showBalance ? "Hide balance" : "Show balance"}
          >
            {showBalance ? <Eye className="h-4 w-4 text-white" /> : <EyeOff className="h-4 w-4 text-white" />}
          </button>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Welcome back!</h1>
                <p className="text-blue-100">Your vault is automatically generating returns</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <Badge className="bg-green-500/20 text-green-100 border-green-400/30 gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Active Vault
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-100 border-blue-400/30 gap-1">
                <Activity className="h-3 w-3" />
                Auto-Rebalancing
              </Badge>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/deposit">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 gap-2 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
              >
                <Upload className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                Deposit
              </Button>
            </Link>
            <Link href="/withdraw">
              <Button
                size="lg"
                variant="outline"
                className="border-white/50 text-white hover:bg-white/20 backdrop-blur-sm bg-white/10 gap-2 transform transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 group"
              >
                <Download className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-12" />
                Withdraw
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-blue-100">Total Balance</p>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-orange-300/30 flex items-center justify-center">
                  <Bitcoin className="h-5 w-5 text-orange-300" />
                </div>
              </div>
            </div>
            <p className="text-2xl font-bold">{showBalance ? "1.245 BTC" : "••••••••"}</p>
            <p className="text-xs text-white">{showBalance ? "≈ $78,435.67 USD" : "≈ $••••••••"}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-blue-100">Performance</p>
              <div className="h-8 w-8 rounded-full bg-green-300/30 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-300" />
              </div>
            </div>
            <p className="text-2xl font-bold">+0.078 BTC</p>
            <p className="text-xs text-white">+6.3% since start</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-blue-100">Current APY</p>
              <div className="h-8 w-8 rounded-full bg-yellow-300/30 flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-300" />
              </div>
            </div>
            <p className="text-2xl font-bold">5.8%</p>
            <p className="text-xs text-white">+0.3% vs previous</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-blue-100">Next Rebalance</p>
              <div className="h-8 w-8 rounded-full bg-blue-300/30 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-300" />
              </div>
            </div>
            <p className="text-2xl font-bold">12h 34m</p>
            <p className="text-xs text-white">Or when APY changes</p>
          </div>
        </div>
      </div>
    </div>
  )
}
