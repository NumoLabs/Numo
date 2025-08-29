import { Zap, CheckCircle, Lightbulb } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function DefiExplanation() {
  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 p-6 border-b">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-yellow-500 flex items-center justify-center">
            <Zap className="h-8 w-8 text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">What is DeFi?</h2>
            <p className="text-yellow-700 dark:text-yellow-300">Decentralized Finance: The Future of Money</p>
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed mb-6">
            DeFi (Decentralized Finance) represents a revolution in the traditional financial system. Imagine a world
            where you can lend, borrow, exchange, and invest without the need for banks or intermediaries.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-6 w-6 text-yellow-600" />
                <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100">Traditional Finance</h3>
              </div>
              <ul className="space-y-2 text-sm text-white">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-yellow-500"></div>
                  Banks as intermediaries
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-yellow-500"></div>
                  Limited operating hours
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-yellow-500"></div>
                  Documentation requirements
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-yellow-500"></div>
                  High fees
                </li>
              </ul>
            </div>

            <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-6 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-6 w-6 text-orange-600" />
                <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100">DeFi</h3>
              </div>
              <ul className="space-y-2 text-sm text-white">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-500"></div>
                  No intermediaries
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-500"></div>
                  Available 24/7
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-500"></div>
                  Just need a wallet
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-500"></div>
                  Transparent fees
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="h-6 w-6 text-black" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  Key Features of DeFi
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Permissionless</h5>
                    <p className="text-sm text-white">
                      Anyone with a wallet can access DeFi services, without the need for approvals or verifications.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Transparent</h5>
                    <p className="text-sm text-white">
                      All transactions are public and verifiable on the blockchain, eliminating the opacity of the
                      traditional system.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Interoperable</h5>
                    <p className="text-sm text-white">
                      DeFi protocols can work together as building blocks, creating complex financial experiences.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Non-Custodial</h5>
                    <p className="text-sm text-white">
                      You maintain total control of your assets at all times, without depending on third parties.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
