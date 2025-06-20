import { Zap, CheckCircle, Lightbulb } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function DefiExplanation() {
  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 border-b">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">What is DeFi?</h2>
            <p className="text-blue-700 dark:text-blue-300">Decentralized Finance: The Future of Money</p>
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
            <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">Traditional Finance</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  Banks as intermediaries
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  Limited operating hours
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  Documentation requirements
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  High fees
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">DeFi</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  No intermediaries
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  Available 24/7
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  Just need a wallet
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  Transparent fees
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  Key Features of DeFi
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-purple-800 dark:text-purple-200 mb-2">🔓 Permissionless</h5>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Anyone with a wallet can access DeFi services, without the need for approvals or verifications.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-purple-800 dark:text-purple-200 mb-2">🔍 Transparent</h5>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      All transactions are public and verifiable on the blockchain, eliminating the opacity of the
                      traditional system.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-purple-800 dark:text-purple-200 mb-2">🔗 Interoperable</h5>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      DeFi protocols can work together as building blocks, creating complex financial experiences.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-purple-800 dark:text-purple-200 mb-2">🔐 Non-Custodial</h5>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
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
