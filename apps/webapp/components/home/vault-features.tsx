import { ArrowUpDown, Bitcoin, Clock, Shield } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function VaultFeatures() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-900/20" id="features">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 px-3 py-1 text-sm text-white font-medium shadow-lg shadow-blue-500/50 animate-pulse">
              Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why Choose Our Vault?</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Designed to maximize your BTC returns without complications.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Bitcoin className="w-8 h-8 text-orange-500 dark:text-orange-400 mb-4" />
              <CardTitle>100% BTC Exposure</CardTitle>
              <CardDescription>
                All returns are maintained in BTC or WBTC, ensuring your exposure is always to the asset you want.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <ArrowUpDown className="w-8 h-8 text-blue-500 dark:text-blue-400 mb-4" />
              <CardTitle>Automatic Rebalancing</CardTitle>
              <CardDescription>
                The vault automatically moves funds between Vesu and Ekubo to find the best available returns.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Shield className="w-8 h-8 text-green-500 dark:text-green-400 mb-4" />
              <CardTitle>Decentralized Security</CardTitle>
              <CardDescription>
                Built on Starknet with audited smart contracts to ensure the security of your funds.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Clock className="w-8 h-8 text-purple-500 dark:text-purple-400 mb-4" />
              <CardTitle>Instant Availability</CardTitle>
              <CardDescription>
                Withdraw your funds at any time along with accumulated returns in WBTC.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="md:col-span-2 lg:col-span-2">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>A simple and automated process to maximize your returns.</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-50">
                    1
                  </div>
                  <div className="text-left">
                    <strong>Deposit:</strong> Deposit WBTC into the vault contract.
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-50">
                    2
                  </div>
                  <div className="text-left">
                    <strong>Analysis:</strong> The vault queries Pragma oracles to obtain prices, volatility, and estimated APYs.
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-50">
                    3
                  </div>
                  <div className="text-left">
                    <strong>Allocation:</strong> Funds are automatically moved to the strategy with the highest returns.
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-50">
                    4
                  </div>
                  <div className="text-left">
                    <strong>Rebalancing:</strong> Strategies are periodically evaluated and adjusted to maximize returns.
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
