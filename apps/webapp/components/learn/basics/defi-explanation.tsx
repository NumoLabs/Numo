import { Zap, CheckCircle, Lightbulb } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function DefiExplanation() {
  return (
    <Card className="relative overflow-hidden transition-all duration-300 border-2 border-bitcoin-gold/40 hover:border-bitcoin-gold/60 hover:shadow-lg hover:shadow-bitcoin-orange/10">
      <div className="bg-muted/50 p-6 border-b border-bitcoin-gold/30">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-bitcoin-gold/20 border-2 border-bitcoin-gold/50 flex items-center justify-center">
            <Zap className="h-8 w-8 text-bitcoin-gold" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">What is DeFi?</h2>
            <p className="text-muted-foreground">Decentralized Finance: The Future of Money</p>
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
            <div className="bg-muted/50 rounded-lg p-6 border-2 border-bitcoin-gold/40 hover:border-bitcoin-gold/60 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-6 w-6 text-bitcoin-gold" />
                <h3 className="text-lg font-semibold text-foreground">Traditional Finance</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-bitcoin-gold"></div>
                  Banks as intermediaries
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-bitcoin-gold"></div>
                  Limited operating hours
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-bitcoin-gold"></div>
                  Documentation requirements
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-bitcoin-gold"></div>
                  High fees
                </li>
              </ul>
            </div>

            <div className="bg-muted/50 rounded-lg p-6 border-2 border-bitcoin-gold/40 hover:border-bitcoin-gold/60 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-6 w-6 text-bitcoin-gold" />
                <h3 className="text-lg font-semibold text-foreground">DeFi</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-bitcoin-gold"></div>
                  No intermediaries
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-bitcoin-gold"></div>
                  Available 24/7
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-bitcoin-gold"></div>
                  Just need a wallet
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-bitcoin-gold"></div>
                  Transparent fees
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-6 border-2 border-bitcoin-gold/40 hover:border-bitcoin-gold/60 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-bitcoin-gold/20 border-2 border-bitcoin-gold/50 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="h-6 w-6 text-bitcoin-gold" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  Key Features of DeFi
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-foreground mb-2">Permissionless</h5>
                    <p className="text-sm text-muted-foreground">
                      Anyone with a wallet can access DeFi services, without the need for approvals or verifications.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-foreground mb-2">Transparent</h5>
                    <p className="text-sm text-muted-foreground">
                      All transactions are public and verifiable on the blockchain, eliminating the opacity of the
                      traditional system.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-foreground mb-2">Interoperable</h5>
                    <p className="text-sm text-muted-foreground">
                      DeFi protocols can work together as building blocks, creating complex financial experiences.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-foreground mb-2">Non-Custodial</h5>
                    <p className="text-sm text-muted-foreground">
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
