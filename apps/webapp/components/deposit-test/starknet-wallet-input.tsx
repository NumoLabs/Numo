"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Wallet, Copy, CheckCircle, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StarknetWalletInputProps {
  onWalletSubmit: (wallet: string) => void
  currentWallet: string
}

export function StarknetWalletInput({ onWalletSubmit, currentWallet }: StarknetWalletInputProps) {
  const [walletAddress, setWalletAddress] = useState(currentWallet)
  const [isValid, setIsValid] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const validateStarknetAddress = (address: string) => {
    // Basic StarkNet address validation (starts with 0x and has correct length)
    const starknetRegex = /^0x[0-9a-fA-F]{63,64}$/
    return starknetRegex.test(address)
  }

  const handleWalletChange = (value: string) => {
    setWalletAddress(value)
    setIsValid(validateStarknetAddress(value))
  }

  const handleSubmit = () => {
    if (isValid && walletAddress) {
      onWalletSubmit(walletAddress)
      toast({
        title: "StarkNet Wallet Saved",
        description: "StarkNet wallet address has been successfully configured",
      })
    } else {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid StarkNet wallet address",
        variant: "destructive",
      })
    }
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      handleWalletChange(text)
      toast({
        title: "Address Pasted",
        description: "StarkNet address has been pasted from clipboard",
      })
    } catch {
      toast({
        title: "Paste Failed",
        description: "Could not paste from clipboard",
        variant: "destructive",
      })
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress)
      setIsCopied(true)
      toast({
        title: "Address Copied",
        description: "StarkNet address has been copied to clipboard",
      })
      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      toast({
        title: "Copy Failed",
        description: "Could not copy address to clipboard",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-orange-200/50 dark:border-orange-800/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-purple-500" />
          StarkNet Wallet Address
        </CardTitle>
        <CardDescription>
          Enter your StarkNet wallet address for receiving WBTC
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* StarkNet Info */}
        <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/50 dark:to-yellow-950/50 rounded-lg border border-orange-200/50">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-orange-500" />
            <span className="font-medium text-sm">StarkNet Network</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Your WBTC will be sent to this StarkNet wallet address
          </p>
        </div>

        {/* Address Input */}
        <div className="space-y-2">
          <Label htmlFor="starknet-wallet">StarkNet Wallet Address</Label>
          <div className="flex gap-2">
            <Input
              id="starknet-wallet"
              type="text"
              placeholder="0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
              value={walletAddress}
              onChange={(e) => handleWalletChange(e.target.value)}
              className={`flex-1 ${
                walletAddress && isValid
                  ? "border-green-500 focus:border-green-500"
                  : walletAddress && !isValid
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }`}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handlePaste}
              className="shrink-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          {walletAddress && (
            <div className="flex items-center gap-2 text-sm">
              {isValid ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-600 dark:text-green-400">
                    Valid StarkNet address
                  </span>
                </>
              ) : (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-red-500" />
                  <span className="text-red-600 dark:text-red-400">
                    Invalid StarkNet address format
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Example Address */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Example StarkNet Address:</h4>
          <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
            <div className="font-mono break-all">
              0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              Format: 0x + 64 hexadecimal characters
            </div>
          </div>
        </div>

        {/* Network Info */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/50 dark:to-yellow-950/50 rounded-lg border border-orange-200/50">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-orange-500" />
              <span className="font-medium text-sm">StarkNet</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Layer 2 scaling solution for Ethereum
            </p>
          </div>
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/50 dark:to-orange-950/50 rounded-lg border border-yellow-200/50">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4 text-yellow-500" />
              <span className="font-medium text-sm">WBTC Support</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Native WBTC support on StarkNet
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleSubmit}
            disabled={!isValid || !walletAddress}
            className="flex-1"
          >
            Continue to Swap
          </Button>
          {walletAddress && (
            <Button
              variant="outline"
              onClick={handleCopy}
              className="shrink-0"
            >
              {isCopied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 