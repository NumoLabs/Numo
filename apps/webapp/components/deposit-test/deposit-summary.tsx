 "use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Wallet, TrendingUp, ArrowRight, Loader2, Shield } from "lucide-react"

interface DepositSummaryProps {
  onDeposit: () => void
  isLoading: boolean
  bitcoinWallet: string
  starknetWallet: string
  swapAmount: string
}

export function DepositSummary({ 
  onDeposit, 
  isLoading, 
  bitcoinWallet, 
  starknetWallet, 
  swapAmount 
}: DepositSummaryProps) {
  const estimatedWBTC = Number(swapAmount) * 1.0 // Assuming 1:1 ratio for simplicity
  const depositFee = estimatedWBTC * 0.001 // 0.1% deposit fee
  const finalAmount = estimatedWBTC - depositFee

  return (
    <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-orange-200/50 dark:border-orange-800/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Deposit Summary
        </CardTitle>
        <CardDescription>
          Review and complete your WBTC deposit to the dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Success Message */}
        <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/50 dark:to-yellow-950/50 rounded-lg border border-orange-200/50">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-orange-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-orange-800 dark:text-orange-200 mb-1">
                Bridge Completed Successfully!
              </p>
              <p className="text-orange-700 dark:text-orange-300 text-xs">
                Your Bitcoin has been successfully bridged to WBTC using LayerSwap and is ready for deposit to StarkNet.
              </p>
            </div>
          </div>
        </div>

        {/* Transaction Summary */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Transaction Summary</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span className="text-sm">Original Amount</span>
              </div>
              <span className="font-medium">{swapAmount} BTC</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span className="text-sm">Bridged Amount</span>
              </div>
              <span className="font-medium">{estimatedWBTC.toFixed(4)} WBTC</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span className="text-sm">Deposit Fee</span>
              </div>
              <span className="font-medium text-red-600 dark:text-red-400">
                -{depositFee.toFixed(4)} WBTC
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-lg border border-green-200/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium">Final Deposit</span>
              </div>
              <span className="font-bold text-green-600 dark:text-green-400">
                {finalAmount.toFixed(4)} WBTC
              </span>
            </div>
          </div>
        </div>

        {/* Wallet Information */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/50 dark:to-orange-950/50 rounded-lg border border-yellow-200/50">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4 text-yellow-500" />
              <span className="font-medium text-sm">Source Wallet</span>
            </div>
            <div className="max-w-full overflow-hidden">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-mono break-all word-break-all leading-relaxed">
                {bitcoinWallet}
              </p>
            </div>
            <Badge variant="secondary" className="mt-2">Bitcoin</Badge>
          </div>
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 rounded-lg border border-purple-200/50">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-purple-500" />
                <span className="font-medium text-sm">StarkNet Address</span>
              </div>
              <div className="max-w-full overflow-hidden">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-mono break-all word-break-all leading-relaxed">
                  {starknetWallet}
                </p>
              </div>
              <Badge variant="outline" className="mt-2 bg-purple-100 dark:bg-purple-900/20">
                StarkNet
              </Badge>
            </div>
        </div>

        {/* Deposit Benefits */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Deposit Benefits</h4>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 rounded-lg border border-blue-200/50">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-sm">Earn Returns</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Start earning on your WBTC immediately
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-lg border border-green-200/50">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="font-medium text-sm">Secure Storage</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Multi-signature vault protection
              </p>
            </div>
          </div>
        </div>

        {/* Deposit Details */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Deposit Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Deposit Type</span>
              <span className="font-medium">WBTC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Network</span>
              <span className="font-medium">Ethereum</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Deposit Fee</span>
              <span className="font-medium">0.1%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Processing Time</span>
              <span className="font-medium">~2 minutes</span>
            </div>
          </div>
        </div>

        {/* Final Action */}
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/50 dark:to-yellow-950/50 rounded-lg border border-orange-200/50">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-orange-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-orange-800 dark:text-orange-200 mb-1">
                  Ready to Deposit
                </p>
                <p className="text-orange-700 dark:text-orange-300 text-xs">
                  Your WBTC is ready to be deposited to your dashboard. Click &quot;Complete Deposit&quot; to finish the process.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={onDeposit}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing Deposit...
              </>
            ) : (
              <>
                <ArrowRight className="h-4 w-4 mr-2" />
                Complete Deposit
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}