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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          Balance de Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* BTC Balance */}
        <div className="p-4 bg-white/50 dark:bg-gray-900/50 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                <Bitcoin className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold">Bitcoin (BTC)</p>
                <p className="text-sm text-muted-foreground">Nativo</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">{balance.btc}</p>
              <p className="text-sm text-muted-foreground">{balance.btcUSD}</p>
            </div>
          </div>
        </div>

        {/* WBTC Balance */}
        <div className="p-4 bg-white/50 dark:bg-gray-900/50 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                <Coins className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold">Wrapped Bitcoin (WBTC)</p>
                <p className="text-sm text-muted-foreground">ERC-20</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">{balance.wbtc}</p>
              <p className="text-sm text-muted-foreground">{balance.wbtcUSD}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* ETH for Gas */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center">
              <span className="text-xs font-bold text-white">Ξ</span>
            </div>
            <div>
              <p className="text-sm font-medium">ETH (para gas)</p>
              <p className="text-xs text-muted-foreground">Disponible para transacciones</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">{balance.eth}</p>
            <p className="text-xs text-muted-foreground">{balance.ethUSD}</p>
          </div>
        </div>

        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-300 dark:border-green-700">
          <div className="flex items-center gap-2">
            <Badge className="bg-green-600 text-white">✓</Badge>
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong>Wallet conectada</strong> - Lista para depositar
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
