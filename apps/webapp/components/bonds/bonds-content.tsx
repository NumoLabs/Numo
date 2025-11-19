"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Briefcase, Loader2, Search, AlertCircle, Wallet, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BondsHero } from "@/components/bonds/bonds-hero"
import { BondCard } from "@/components/bonds/bond-card"
import { BondDepositWithdrawModal } from "@/components/bonds/bond-deposit-withdraw-modal"
import { useLockToEarnBond } from "@/hooks/use-lock-to-earn-bond"
import { useAccount } from "@starknet-react/core"
import { useWallet } from "@/hooks/use-wallet"

interface Bond {
  id: string
  name: string
  description: string
  totalAssets: bigint | null
  isLoading?: boolean
}

export function BondsContent() {
  const { isConnected } = useAccount()
  const { connect, connectors, isConnecting } = useWallet()
  const [selectedConnector, setSelectedConnector] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBond, setSelectedBond] = useState<string | null>(null)
  const [totalAssets, setTotalAssets] = useState<bigint | null>(null)
  const [isLoadingTotalAssets, setIsLoadingTotalAssets] = useState(true)
  const [minLockPeriod, setMinLockPeriod] = useState<number | null>(null)
  const [apy, setApy] = useState<number | null>(null)

  const { getTotalAssets, getMinLockPeriod, getAveragePoolApy } = useLockToEarnBond()

  const handleConnect = async (connectorId: string) => {
    setSelectedConnector(connectorId)
    try {
      const connector = connectors.find(c => c.id === connectorId)
      if (connector) {
        await connect({ connector })
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    } finally {
      setSelectedConnector(null)
    }
  }

  // Load contract data
  useEffect(() => {
    const loadContractData = async () => {
      setIsLoadingTotalAssets(true)
      try {
        const [assets, minPeriod, averageApy] = await Promise.all([
          getTotalAssets(),
          getMinLockPeriod(),
          getAveragePoolApy()
        ])
        setTotalAssets(assets)
        setMinLockPeriod(minPeriod)
        setApy(averageApy)
      } catch (err) {
        console.error('Error loading contract data:', err)
        setTotalAssets(null)
        setMinLockPeriod(null)
        setApy(null)
      } finally {
        setIsLoadingTotalAssets(false)
      }
    }

    loadContractData()
  }, [getTotalAssets, getMinLockPeriod, getAveragePoolApy])

  // Format lock period from seconds to days
  const formatLockPeriodDays = (seconds: number | null): string => {
    if (!seconds) return 'N/A'
    const days = Math.floor(seconds / 86400)
    if (days === 0) {
      const hours = Math.floor(seconds / 3600)
      return `${hours}h`
    }
    return `${days}d`
  }

  // Format TVL
  const formattedTVL = useMemo(() => {
    if (!totalAssets) return '0.0000'
    const tvl = Number(totalAssets) / 1e8
    if (tvl === 0) return '0.0000'
    if (tvl > 0 && tvl < 0.0001) return tvl.toFixed(8)
    return tvl.toFixed(4)
  }, [totalAssets])

  // Create bonds data
  const bonds = useMemo(() => {
    return [
      {
        id: 'lock-to-earn-bond',
        name: 'Bond Numo wBTC',
        description: 'Lock your WBTC for a fixed period and earn higher rewards. Choose your preferred lock duration.',
        totalAssets: totalAssets,
        isLoading: isLoadingTotalAssets,
      },
    ] as Bond[]
  }, [totalAssets, isLoadingTotalAssets])

  // Lock options count = number of actual bonds available
  const lockOptionsCount = bonds.length

  // Filter bonds based on search term
  const filteredBonds = useMemo(() => {
    if (!searchTerm) return bonds
    const term = searchTerm.toLowerCase()
    return bonds.filter((bond) =>
      bond.name.toLowerCase().includes(term) ||
      bond.description.toLowerCase().includes(term)
    )
  }, [bonds, searchTerm])


  const isLoading = isLoadingTotalAssets

  if (!isConnected) {
    return (
      <div className="relative space-y-8 min-h-screen">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-bitcoin-orange/20 via-bitcoin-orange/10 to-transparent rounded-full blur-3xl"
            animate={{ 
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-bitcoin-gold/20 via-bitcoin-gold/10 to-transparent rounded-full blur-3xl"
            animate={{ 
              x: [0, -40, 0],
              y: [0, 40, 0],
              scale: [1, 0.9, 1],
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <BondsHero />
        </motion.div>

        {/* Wallet Connection Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
        <Card className="relative overflow-hidden border-2 border-bitcoin-orange/40 bg-gradient-to-br from-bitcoin-orange/10 via-bitcoin-gold/5 to-gray-900/50 backdrop-blur-md shadow-xl shadow-bitcoin-orange/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-bitcoin-orange/20 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-bitcoin-gold/15 rounded-full blur-2xl -ml-24 -mb-24" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-bitcoin-orange text-xl">
              Connect StarkNet Wallet
            </CardTitle>
            <CardDescription className="text-gray-300 mt-2">
              Connect your StarkNet wallet to view and interact with bonds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 relative z-10">
            <Alert className="border-2 border-bitcoin-orange/40 bg-gradient-to-r from-bitcoin-orange/15 to-bitcoin-orange/10 backdrop-blur-sm">
              <AlertCircle className="h-5 w-5 text-bitcoin-orange" />
              <AlertDescription className="text-bitcoin-orange font-medium">
                Please connect your StarkNet wallet to view available bonds
              </AlertDescription>
            </Alert>

            {/* Wallet Options */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-gray-300 uppercase tracking-wider">Available Wallets</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {connectors.map((connector) => (
                  <Button
                    key={connector.id}
                    onClick={() => handleConnect(connector.id)}
                    disabled={isConnecting || selectedConnector === connector.id}
                    className="w-full justify-start h-14 bg-gradient-to-r from-bitcoin-orange/15 to-bitcoin-gold/10 hover:from-bitcoin-orange/25 hover:to-bitcoin-gold/15 border-2 border-bitcoin-orange/30 hover:border-bitcoin-orange/50 text-bitcoin-orange font-medium rounded-xl transition-all duration-300 shadow-lg shadow-bitcoin-orange/10 hover:shadow-xl hover:shadow-bitcoin-orange/20 disabled:opacity-50"
                    variant="outline"
                  >
                    {selectedConnector === connector.id ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Wallet className="mr-2 h-5 w-5" />
                        {connector.name}
                      </>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="text-xs text-gray-400 space-y-2 pt-4 border-t border-gray-700/50">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-bitcoin-orange" />
                <p>Supported wallets: Argent, Braavos</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-bitcoin-gold" />
                <p>Make sure you&apos;re on StarkNet Mainnet</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-bitcoin-orange" />
                <p>You&apos;ll need wBTC to make deposits</p>
              </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative space-y-8">
      {/* Hero */}
      <BondsHero 
        totalTVL={formattedTVL}
        lockOptions={lockOptionsCount}
        minLock={formatLockPeriodDays(minLockPeriod)}
        apy={apy !== null ? `${apy.toFixed(2)}%` : null}
        isLoading={isLoadingTotalAssets}
      />

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Alert className="relative overflow-hidden border border-bitcoin-gold/20 bg-bitcoin-gold/5 hover:border-bitcoin-gold/30 hover:shadow-md transition-all duration-300 group">
          {/* Gradient border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-bitcoin-gold/0 via-bitcoin-gold/20 to-bitcoin-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Sparkles className="h-4 w-4 text-bitcoin-gold relative z-10" />
          <AlertDescription className="text-sm relative z-10">
            <strong className="text-bitcoin-gold font-semibold">New to Bonds?</strong>{' '}
            Lock your wBTC for a fixed period to earn higher rewards. The longer you lock, the better the rewards.
          </AlertDescription>
        </Alert>
      </motion.div>

      {/* Search */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground -translate-y-1/2 group-hover:text-bitcoin-orange transition-colors z-10" />
          <Input
            type="search"
            placeholder="Search bonds by name or description..."
            className="pl-9 h-10 transition-all duration-300 focus:border-bitcoin-orange/50 focus:ring-2 focus:ring-bitcoin-orange/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-0 rounded-md bg-gradient-to-r from-bitcoin-orange/0 via-bitcoin-orange/10 to-bitcoin-orange/0 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-300 -z-10" />
        </div>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredBonds.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm">
              {searchTerm ? 'No bonds found matching your search' : 'No bonds available'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Bonds Cards */}
      {!isLoading && filteredBonds.length > 0 && (
        <div className="space-y-3">
          {filteredBonds.map((bond, index) => (
            <motion.div
              key={bond.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
            >
              <BondCard
                id={bond.id}
                name={bond.name}
                description={bond.description}
                totalAssets={bond.totalAssets}
                isLoading={bond.isLoading}
                onClick={() => setSelectedBond(bond.id)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Deposit/Withdraw Modal */}
      {selectedBond && (
        <BondDepositWithdrawModal
          bondId={selectedBond}
          bondName={filteredBonds.find(b => b.id === selectedBond)?.name || 'Bond'}
          isOpen={!!selectedBond}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedBond(null)
            }
          }}
        />
      )}
    </div>
  )
}
