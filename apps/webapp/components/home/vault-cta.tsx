import Link from "next/link"
import WalletConnector from "@/components/ui/connectWallet"
import { Button } from "@/components/ui/button"

export function VaultCTA() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-900/20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Start Generating Returns</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Deposit BTC today and let our vault maximize your returns automatically.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <WalletConnector />
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}