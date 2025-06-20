import { Wallet, Bitcoin, Coins } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import type { WalletBalance } from "@/lib/deposit-data"

interface WalletBalanceCardProps {
  balance: WalletBalance
}

export function WalletBalanceCard({ balance }: WalletBalanceCardProps) {
  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
            Wallet Balance
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* BTC Balance */}
        <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
                <Bitcoin className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Bitcoin (BTC)</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Native</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{balance.btc}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{balance.btcUSD}</p>
            </div>
          </div>
        </div>

        {/* WBTC Balance */}
        <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
                <Coins className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Wrapped Bitcoin (WBTC)</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">ERC-20</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{balance.wbtc}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{balance.wbtcUSD}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* ETH for Gas */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-md">
              <span className="text-xs font-bold text-white">Ξ</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">ETH (for gas)</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Available for transactions</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium text-gray-900 dark:text-gray-100">{balance.eth}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{balance.ethUSD}</p>
          </div>
        </div>

        <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg border border-green-200 dark:border-green-700 shadow-sm">
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md">✓</Badge>
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong>Wallet connected</strong> - Ready to deposit
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
