import { Zap, CheckCircle, Lightbulb } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function DefiExplanation() {
  return (
    <Card className="relative overflow-hidden transition-all duration-300 border-2 border-bitcoin-gold/40 hover:border-bitcoin-gold/60 hover:shadow-lg hover:shadow-bitcoin-orange/10">
      <div className="bg-muted/50 p-3 md:p-4 border-b border-bitcoin-gold/30">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-bitcoin-gold/20 border-2 border-bitcoin-gold/50 flex items-center justify-center flex-shrink-0">
            <Zap className="h-5 w-5 md:h-6 md:w-6 text-bitcoin-gold" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg md:text-xl font-bold text-foreground">What is DeFi?</h2>
            <p className="text-xs md:text-sm text-muted-foreground">Decentralized Finance: The Future of Money</p>
          </div>
        </div>
      </div>
      <CardContent className="p-3 md:p-4">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-sm md:text-base leading-relaxed mb-3 md:mb-4">
            DeFi (Decentralized Finance) represents a revolution in the traditional financial system. Imagine a world
            where you can lend, borrow, exchange, and invest without the need for banks or intermediaries.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 my-3 md:my-4">
            <div className="bg-muted/50 rounded-lg p-3 md:p-4 border-2 border-bitcoin-gold/40 hover:border-bitcoin-gold/60 transition-all duration-300">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-bitcoin-gold flex-shrink-0" />
                <h3 className="text-sm md:text-base font-semibold text-foreground">Traditional Finance</h3>
              </div>
              <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-muted-foreground">
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

            <div className="bg-muted/50 rounded-lg p-3 md:p-4 border-2 border-bitcoin-gold/40 hover:border-bitcoin-gold/60 transition-all duration-300">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <Zap className="h-4 w-4 md:h-5 md:w-5 text-bitcoin-gold flex-shrink-0" />
                <h3 className="text-sm md:text-base font-semibold text-foreground">DeFi</h3>
              </div>
              <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-muted-foreground">
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

          <div className="bg-muted/50 rounded-xl p-4 border-2 border-bitcoin-gold/40 hover:border-bitcoin-gold/60 transition-all duration-300">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-bitcoin-gold/20 border-2 border-bitcoin-gold/50 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="h-5 w-5 text-bitcoin-gold" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-base font-semibold text-foreground mb-2">
                  Key Features of DeFi
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <h5 className="text-sm font-medium text-foreground mb-1.5">Permissionless</h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Anyone with a wallet can access DeFi services, without the need for approvals or verifications.
                    </p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-foreground mb-1.5">Transparent</h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      All transactions are public and verifiable on the blockchain, eliminating the opacity of the
                      traditional system.
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <Separator className="my-3" />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-foreground mb-1.5">Interoperable</h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      DeFi protocols can work together as building blocks, creating complex financial experiences.
                    </p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-foreground mb-1.5">Non-Custodial</h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">
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
