import { Award, Zap, Coins, Shield, BarChart3, Lock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function StarknetSection() {
  const advantages = [
    {
      title: "Fast Transactions",
      description: "Processing thousands of transactions per second with near-instant confirmations.",
      icon: Zap,
      bgColor: "bg-bitcoin-gold/20 border-2 border-bitcoin-gold/50",
      iconColor: "text-bitcoin-gold",
      textColor: "text-foreground",
      descColor: "text-muted-foreground",
    },
    {
      title: "Low Fees",
      description: "Minimal transaction costs that make trading and farming viable even with small amounts.",
      icon: Coins,
      bgColor: "bg-bitcoin-gold/20 border-2 border-bitcoin-gold/50",
      iconColor: "text-bitcoin-gold",
      textColor: "text-foreground",
      descColor: "text-muted-foreground",
    },
    {
      title: "Ethereum Security",
      description: "Inherits Ethereum's security while offering improved scalability and efficiency.",
      icon: Shield,
      bgColor: "bg-bitcoin-gold/20 border-2 border-bitcoin-gold/50",
      iconColor: "text-bitcoin-gold",
      textColor: "text-foreground",
      descColor: "text-muted-foreground",
    },
  ]

  const protocols = [
    {
      name: "Vesu",
      description: "Decentralized lending and vault platform with rebalancing strategies.",
      icon: Lock,
      bgColor: "bg-bitcoin-gold/20 border-2 border-bitcoin-gold/50",
      iconColor: "text-bitcoin-gold",
    },
  ]

  return (
    <Card className="relative overflow-hidden transition-all duration-300 border-2 border-bitcoin-gold/40 hover:border-bitcoin-gold/60 hover:shadow-lg hover:shadow-bitcoin-orange/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Award className="h-6 w-6 text-bitcoin-gold" />
          DeFi on Starknet: The Competitive Advantage
        </CardTitle>
        <CardDescription>Why Starknet is ideal for DeFi applications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          {advantages.map((advantage) => (
            <div key={advantage.title} className="text-center">
              <div
                className={`h-16 w-16 rounded-full ${advantage.bgColor} flex items-center justify-center mx-auto mb-4`}
              >
                <advantage.icon className={`h-8 w-8 ${advantage.iconColor}`} />
              </div>
              <h4 className={`font-semibold ${advantage.textColor} mb-2`}>{advantage.title}</h4>
              <p className={`text-sm ${advantage.descColor}`}>{advantage.description}</p>
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        <div className="bg-muted/50 rounded-lg p-6">
          <h4 className="font-semibold text-foreground mb-4">
            Featured DeFi Protocols on Starknet
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            {protocols.map((protocol) => (
              <div
                key={protocol.name}
                className="flex items-center gap-4 p-4 bg-background rounded-lg border-2 border-bitcoin-gold/30 hover:border-bitcoin-gold/50 transition-all duration-300"
              >
                <div className={`h-12 w-12 rounded-lg ${protocol.bgColor} flex items-center justify-center`}>
                  <protocol.icon className={`h-6 w-6 ${protocol.iconColor}`} />
                </div>
                <div>
                  <h5 className="font-medium text-foreground">{protocol.name}</h5>
                  <p className="text-sm text-muted-foreground">{protocol.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
