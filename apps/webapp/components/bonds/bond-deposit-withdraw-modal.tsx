"use client"

import { useState, useEffect } from "react"
import { Lock, Unlock, Loader2, CheckCircle, AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useLockToEarnBond } from "@/hooks/use-lock-to-earn-bond"
import { useWalletStatus } from "@/hooks/use-wallet"
import { useToast } from "@/hooks/use-toast"

// Lock period presets (in seconds)
const LOCK_PERIODS = {
  THIRTY_DAYS: 2_592_000,
  NINETY_DAYS: 7_776_000,
  ONE_HUNDRED_EIGHTY_DAYS: 15_552_000,
  ONE_YEAR: 31_536_000,
}

const LOCK_PERIOD_LABELS = {
  [LOCK_PERIODS.THIRTY_DAYS]: "30 días",
  [LOCK_PERIODS.NINETY_DAYS]: "90 días",
  [LOCK_PERIODS.ONE_HUNDRED_EIGHTY_DAYS]: "180 días",
  [LOCK_PERIODS.ONE_YEAR]: "365 días",
}

function formatTimeUntil(unixTimestamp: number): string {
  if (!unixTimestamp || unixTimestamp === 0) return "No lock"
  
  const now = Math.floor(Date.now() / 1000)
  const diff = unixTimestamp - now
  
  if (diff <= 0) return "Lock expired - Can withdraw"
  
  const days = Math.floor(diff / 86400)
  const hours = Math.floor((diff % 86400) / 3600)
  const minutes = Math.floor((diff % 3600) / 60)
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m remaining`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m remaining`
  } else {
    return `${minutes}m remaining`
  }
}

interface BondDepositWithdrawModalProps {
  bondId: string
  bondName: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function BondDepositWithdrawModal({
  bondName,
  isOpen,
  onOpenChange,
}: BondDepositWithdrawModalProps) {
  const { address, isConnected } = useWalletStatus()
  const { toast } = useToast()
  
  const {
    depositWithCustomLock,
    depositLocked,
    withdraw,
    getLockInfo,
    canWithdraw,
    getMaxWithdraw,
    isLoading,
  } = useLockToEarnBond()

  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit")
  
  // Deposit form state
  const [depositAmount, setDepositAmount] = useState("")
  const [lockPeriod, setLockPeriod] = useState(LOCK_PERIODS.THIRTY_DAYS) // Default to 30 days
  const [customLockPeriod, setCustomLockPeriod] = useState("")
  
  // Withdraw form state
  const [withdrawAmount, setWithdrawAmount] = useState("")
  
  // Lock info state
  const [lockInfo, setLockInfo] = useState<{ lockUntil: number; lockedShares: string } | null>(null)
  const [canWithdrawFunds, setCanWithdrawFunds] = useState(false)
  const [maxWithdraw, setMaxWithdraw] = useState("0")

  // Load lock info and status
  useEffect(() => {
    if (isOpen && isConnected && address && address.startsWith('0x')) {
      let isMounted = true

      const loadLockInfo = async () => {
        if (!address) return
        
        try {
          const info = await getLockInfo(address)
          if (isMounted) {
            setLockInfo(info)
          }
        } catch (err) {
          console.error("Error loading lock info:", err)
          if (isMounted) {
            setLockInfo(null)
          }
        }
      }

      const loadCanWithdraw = async () => {
        if (!address) return
        
        try {
          const canWithdrawResult = await canWithdraw(address)
          if (isMounted) {
            setCanWithdrawFunds(canWithdrawResult)
          }
        } catch (err) {
          console.error("Error loading can withdraw:", err)
          if (isMounted) {
            setCanWithdrawFunds(false)
          }
        }
      }

      const loadMaxWithdraw = async () => {
        if (!address) return
        
        try {
          const maxWithdrawResult = await getMaxWithdraw(address)
          if (isMounted) {
            setMaxWithdraw(maxWithdrawResult)
          }
        } catch (err) {
          console.error("Error loading max withdraw:", err)
          if (isMounted) {
            setMaxWithdraw("0")
          }
        }
      }

      // Small delay to ensure address is fully ready
      const timeoutId = setTimeout(() => {
        loadLockInfo()
        loadCanWithdraw()
        loadMaxWithdraw()
      }, 100)
      
      const interval = setInterval(() => {
        if (isMounted) {
          loadLockInfo()
          loadCanWithdraw()
          loadMaxWithdraw()
        }
      }, 30000) // Refresh every 30 seconds
      
      return () => {
        isMounted = false
        clearTimeout(timeoutId)
        clearInterval(interval)
      }
    } else {
      setLockInfo(null)
      setCanWithdrawFunds(false)
      setMaxWithdraw("0")
    }
      }, [isOpen, isConnected, address, getLockInfo, canWithdraw, getMaxWithdraw])

  const handleDeposit = async () => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to deposit",
        variant: "destructive",
      })
      return
    }

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      })
      return
    }

    // Check if user already has an active lock position
    const hasActiveLock = lockInfo && lockInfo.lockUntil > 0

    try {
      let result
      
      if (hasActiveLock) {
        result = await depositLocked({
          amount: depositAmount,
          receiver: address,
          assetDecimals: 8, // WBTC has 8 decimals
        })
      } else {
        // New deposit - user needs to specify lock period
        const lockPeriodToUse = customLockPeriod 
          ? parseInt(customLockPeriod) 
          : lockPeriod

        if (!lockPeriodToUse || lockPeriodToUse <= 0) {
          toast({
            title: "Invalid Lock Period",
            description: "Please enter a valid lock period",
            variant: "destructive",
          })
          return
        }

        result = await depositWithCustomLock({
          amount: depositAmount,
          receiver: address,
          lockPeriodSeconds: lockPeriodToUse,
          assetDecimals: 8, // WBTC has 8 decimals
        })
      }

      if (result.success) {
        setDepositAmount("")
        setCustomLockPeriod("")
        // Refresh lock info and shares balance after successful deposit
        setTimeout(async () => {
          const info = await getLockInfo(address)
          setLockInfo(info)
        }, 2000)
      }
    } catch (err) {
      console.error("Deposit error:", err)
    }
  }

  const handleWithdraw = async () => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to withdraw",
        variant: "destructive",
      })
      return
    }

    if (!canWithdrawFunds) {
      toast({
        title: "Funds Locked",
        description: "You cannot withdraw until the lock period expires",
        variant: "destructive",
      })
      return
    }

    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      })
      return
    }

    if (parseFloat(withdrawAmount) > parseFloat(maxWithdraw)) {
      toast({
        title: "Insufficient Balance",
        description: `Maximum withdrawable amount is ${maxWithdraw}`,
        variant: "destructive",
      })
      return
    }

    try {
      const result = await withdraw({
        assets: withdrawAmount,
        receiver: address,
        owner: address,
        assetDecimals: 8,
      })

      if (result.success) {
        setWithdrawAmount("")
        // Refresh lock info after successful withdrawal
        setTimeout(async () => {
          const info = await getLockInfo(address)
          setLockInfo(info)
          const canWithdrawResult = await canWithdraw(address)
          setCanWithdrawFunds(canWithdrawResult)
          const maxWithdrawResult = await getMaxWithdraw(address)
          setMaxWithdraw(maxWithdrawResult)
        }, 2000)
      }
    } catch (err) {
      console.error("Withdraw error:", err)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{bondName}</DialogTitle>
          <DialogDescription>
            Manage your deposit and withdrawal for {bondName}
          </DialogDescription>
        </DialogHeader>

        {/* Lock Info Card */}
        {isConnected && address && lockInfo && (
          <Card className="border-spacing-2 dark:border-spacing-2 border-white/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Info className="h-4 w-4" />
                Your Lock Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label className="text-muted-foreground text-xs">Lock Until</Label>
                  <p className="text-sm font-semibold">
                    {lockInfo && lockInfo.lockUntil > 0
                      ? formatTimeUntil(lockInfo.lockUntil)
                      : "No active lock"}
                  </p>
                  {lockInfo && lockInfo.lockUntil > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(lockInfo.lockUntil * 1000).toLocaleString()}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Locked Shares</Label>
                  <p className="text-sm font-semibold">
                    {lockInfo?.lockedShares || "0"} shares
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Can Withdraw</Label>
                  <div className="flex items-center gap-2">
                    {canWithdrawFunds ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-semibold text-green-600">Yes</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-semibold text-orange-600">Locked</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "deposit" | "withdraw")} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deposit">
              <Lock className="h-4 w-4 mr-2" />
              Deposit
            </TabsTrigger>
            <TabsTrigger value="withdraw">
              <Unlock className="h-4 w-4 mr-2" />
              Withdraw
            </TabsTrigger>
          </TabsList>

          {/* Deposit Tab */}
          <TabsContent value="deposit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Deposit with Lock Period</CardTitle>
                <CardDescription className="text-sm">
                  {lockInfo && lockInfo.lockUntil > 0
                    ? `You already have an active lock position. New deposits will use your existing lock period (unlocks ${formatTimeUntil(lockInfo.lockUntil)}).`
                    : "Lock your tokens for a specified period. The longer the lock, the better the rewards."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {lockInfo && lockInfo.lockUntil > 0 && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      You have an active lock position. Additional deposits will use your existing lock period and will unlock at the same time as your current position.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="deposit-amount" className="text-sm">Amount (WBTC)</Label>
                  <Input
                    id="deposit-amount"
                    type="number"
                    step="0.00000001"
                    placeholder="0.00000000"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    disabled={!isConnected || isLoading}
                  />
                </div>

                {(!lockInfo || lockInfo.lockUntil === 0) && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-sm">Lock Period Presets</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {Object.entries(LOCK_PERIOD_LABELS).map(([seconds, label]) => (
                          <Button
                            key={seconds}
                            variant={lockPeriod === parseInt(seconds) ? "default" : "outline"}
                            onClick={() => {
                              setLockPeriod(parseInt(seconds))
                              setCustomLockPeriod("")
                            }}
                            disabled={!isConnected || isLoading}
                            className="w-full text-xs"
                            size="sm"
                          >
                            {label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="custom-lock-period" className="text-sm">
                        Or Custom Lock Period (seconds)
                      </Label>
                      <Input
                        id="custom-lock-period"
                        type="number"
                        placeholder="Enter custom lock period in seconds"
                        value={customLockPeriod}
                        onChange={(e) => {
                          setCustomLockPeriod(e.target.value)
                          setLockPeriod(0)
                        }}
                        disabled={!isConnected || isLoading}
                      />
                      {customLockPeriod && (
                        <p className="text-xs text-muted-foreground">
                          {formatTimeUntil(Math.floor(Date.now() / 1000) + parseInt(customLockPeriod || "0"))}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {!isConnected && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Please connect your wallet to deposit
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleDeposit}
                  disabled={!isConnected || isLoading || !depositAmount || parseFloat(depositAmount) <= 0}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Deposit & Lock
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Withdraw Tab */}
          <TabsContent value="withdraw" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Withdraw Funds</CardTitle>
                <CardDescription className="text-sm">
                  Withdraw your tokens after the lock period has expired.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!canWithdrawFunds && (
                  <Alert variant="destructive">
                    <Lock className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Your funds are still locked. You cannot withdraw until the lock period expires.
                    </AlertDescription>
                  </Alert>
                )}

                {canWithdrawFunds && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Your lock period has expired. You can now withdraw your funds.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="withdraw-amount" className="text-sm">Amount (WBTC)</Label>
                  <Input
                    id="withdraw-amount"
                    type="number"
                    step="0.00000001"
                    placeholder="0.00000000"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    disabled={!isConnected || isLoading || !canWithdrawFunds}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum withdrawable: {maxWithdraw} WBTC
                  </p>
                </div>

                <Button
                  onClick={() => setWithdrawAmount(maxWithdraw)}
                  variant="outline"
                  disabled={!isConnected || !canWithdrawFunds}
                  className="w-full"
                  size="sm"
                >
                  Use Max
                </Button>

                {!isConnected && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Please connect your wallet to withdraw
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleWithdraw}
                  disabled={!isConnected || isLoading || !canWithdrawFunds || !withdrawAmount || parseFloat(withdrawAmount) <= 0}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Unlock className="h-4 w-4 mr-2" />
                      Withdraw
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

