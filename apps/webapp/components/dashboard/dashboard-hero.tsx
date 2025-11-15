"use client"

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
    <div className="relative overflow-hidden rounded-3xl bg-[#0f1114] p-8 md:p-12 text-white mb-8 shadow-2xl animate-border-gradient">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-full blur-3xl"></div>
      <div className="relative z-10">
        {/* Balance Toggle Button - Top Right Corner */}
        <div className="absolute -top-2 right-0 mb-4">
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="h-8 w-8 rounded-full bg-[#0f1114] hover:bg-gray-800 flex items-center justify-center transition-all duration-200 hover:scale-105 border-2 border-orange-500"
            title={showBalance ? "Hide balance" : "Show balance"}
          >
            {showBalance ? <Eye className="h-4 w-4 text-orange-500" /> : <EyeOff className="h-4 w-4 text-orange-500" />}
          </button>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-[#0f1114] border-2 border-orange-500 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Welcome back!</h1>
                <p className="text-gray-300">Your vault is automatically generating returns</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <Badge className="bg-[#0f1114] text-white border-2 border-orange-500 gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Active Vault
              </Badge>
              <Badge className="bg-[#0f1114] text-white border-2 border-orange-500 gap-1">
                <Activity className="h-3 w-3" />
                Auto-Rebalancing
              </Badge>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 hover:from-orange-400 hover:via-yellow-400 hover:to-orange-400 text-black px-4 py-2 rounded-lg font-bold transition-all duration-200 shadow-bitcoin hover:shadow-bitcoin-gold focus-visible:shadow-bitcoin-gold transform hover:-translate-y-1 hover:scale-105 focus-visible:-translate-y-1 focus-visible:scale-105 flex items-center gap-2"
            >
              <Upload className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
              Deposit
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black gap-2 transform transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 group bg-[#0f1114]"
            >
              <Download className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-12" />
              Withdraw
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#0f1114] border-2 border-orange-500 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-300">Total Balance</p>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#0f1114] border-2 border-yellow-500 flex items-center justify-center">
                  <Bitcoin className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
            <p className="text-2xl font-bold">{showBalance ? "1.245 BTC" : "••••••••"}</p>
            <p className="text-xs text-gray-400">{showBalance ? "≈ $78,435.67 USD" : "≈ $••••••••"}</p>
          </div>
          <div className="bg-[#0f1114] border-2 border-orange-500 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-300">Performance</p>
                              <div className="h-8 w-8 rounded-full bg-[#0f1114] border-2 border-yellow-500 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
            </div>
            <p className="text-2xl font-bold">+0.078 BTC</p>
            <p className="text-xs text-gray-400">+6.3% since start</p>
          </div>
          <div className="bg-[#0f1114] border-2 border-orange-500 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-300">Current APY</p>
                              <div className="h-8 w-8 rounded-full bg-[#0f1114] border-2 border-yellow-500 flex items-center justify-center">
                  <Star className="h-5 w-5 text-white" />
                </div>
            </div>
            <p className="text-2xl font-bold">5.8%</p>
            <p className="text-xs text-gray-400">+0.3% vs previous</p>
          </div>
          <div className="bg-[#0f1114] border-2 border-orange-500 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-300">Next Rebalance</p>
                              <div className="h-8 w-8 rounded-full bg-[#0f1114] border-2 border-yellow-500 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-white" />
                </div>
            </div>
            <p className="text-2xl font-bold">12h 34m</p>
            <p className="text-xs text-gray-400">Or when APY changes</p>
          </div>
        </div>
      </div>
    </div>
  )
}
