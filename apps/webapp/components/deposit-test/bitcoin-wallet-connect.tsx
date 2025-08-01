"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Wallet, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BitcoinWalletConnectProps {
  onWalletConnect: (wallet: string) => void
  currentWallet: string
}

export function BitcoinWalletConnect({ onWalletConnect, currentWallet }: BitcoinWalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(!!currentWallet)
  const { toast } = useToast()

  const handleConnectWallet = async () => {
    setIsConnecting(true)
    try {
      // Simulate wallet connection
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      // Mock Bitcoin wallet address
      const mockWalletAddress = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
      
      setIsConnected(true)
      onWalletConnect(mockWalletAddress)
      
      toast({
        title: "Wallet Connected",
        description: "Bitcoin wallet connected successfully",
      })
    } catch {
      toast({
        title: "Connection Failed",
        description: "Could not connect to Bitcoin wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    onWalletConnect("")
    toast({
      title: "Wallet Disconnected",
      description: "Bitcoin wallet disconnected",
    })
  }

  return (
    <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-orange-200/50 dark:border-orange-800/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-yellow-500" />
          Connect Bitcoin Wallet
        </CardTitle>
        <CardDescription>
          Connect your Bitcoin wallet to start the deposit process
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connection Status */}
        {isConnected ? (
          <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/50 dark:to-yellow-950/50 rounded-lg border border-orange-200/50">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-orange-500" />
              <span className="font-medium text-sm">Wallet Connected</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
              {currentWallet}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnect}
              className="mt-2"
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/50 dark:to-orange-950/50 rounded-lg border border-yellow-200/50">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4 text-yellow-500" />
              <span className="font-medium text-sm">No Wallet Connected</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Connect your Bitcoin wallet to continue
            </p>
          </div>
        )}

        {/* Connect Button */}
        {!isConnected && (
          <Button
            onClick={handleConnectWallet}
            disabled={isConnecting}
            className="w-full"
            size="lg"
          >
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4 mr-2" />
                Connect Bitcoin Wallet
              </>
            )}
          </Button>
        )}

        {/* Wallet Options */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Supported Wallets</h4>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/50 dark:to-orange-950/50 rounded-lg border border-yellow-200/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span className="font-medium text-sm">Hardware Wallets</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Ledger, Trezor, Coldcard
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 rounded-lg border border-blue-200/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="font-medium text-sm">Software Wallets</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Electrum, Bitcoin Core, Sparrow
              </p>
            </div>
          </div>
        </div>

        {/* Security Info */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Security Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Secure Connection</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Your private keys never leave your wallet
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">Read-Only Access</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  We only read your public address and balance
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        {isConnected && (
          <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/50 dark:to-yellow-950/50 rounded-lg border border-orange-200/50">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-orange-500" />
              <span className="font-medium text-sm">Ready to Continue</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Your Bitcoin wallet is connected. You can now proceed to the next step.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 