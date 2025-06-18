/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { ARGENT_WEBWALLET_URL, getChainId } from "@/constants"
import { walletStarknetkitLatestAtom } from "@/app/state/connectedWallet"
import { useAtom } from "jotai"
import { connect, disconnect } from "starknetkit"
import { Button } from "./button"

export default function WalletConnector() {
  const [wallet, setWallet] = useAtom(walletStarknetkitLatestAtom)

  const handleConnect = async () => {
    try {
      const chainId = getChainId()
      const { wallet: connectedWallet } = await connect({
        modalMode: "alwaysAsk",
        webWalletUrl: ARGENT_WEBWALLET_URL,
        argentMobileOptions: {
          dappName: "Numo",
          url: window.location.hostname,
          chainId,
          icons: [],
        },
      })
      setWallet(connectedWallet)
    } catch (e) {
      console.error(e)
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      alert((e as any).message)
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleDisconnect = async (event: any) => {
    event.preventDefault()
    try {
      await disconnect()
      setWallet(undefined)
    } catch (error) {
      console.error("Failed to disconnect wallet:", error)
    }
  }

  return (
    <div className="flex items-center gap-4">
      {wallet ? (
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {/* @ts-expect-error - Starknet wallet type definition is incomplete */}
            {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
          </span>
          <Button
            onClick={handleDisconnect}
            variant="default"
            className="bg-gradient-to-r from-white via-gray-50 to-white hover:from-gray-50 hover:via-gray-100 hover:to-gray-50 text-gray-900 border border-gray-300 hover:border-gray-400 transition-all duration-200 shadow-lg hover:shadow-xl focus-visible:shadow-xl transform hover:-translate-y-1 hover:scale-105 focus-visible:-translate-y-1 focus-visible:scale-105"
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleConnect}
          variant="default"
          className="bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 hover:from-cyan-400 hover:via-blue-400 hover:to-cyan-400 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-400/60 focus-visible:shadow-xl transform hover:-translate-y-1 hover:scale-105 focus-visible:-translate-y-1 focus-visible:scale-105"
        >
          Connect Wallet
        </Button>
      )}
    </div>
  )
}
