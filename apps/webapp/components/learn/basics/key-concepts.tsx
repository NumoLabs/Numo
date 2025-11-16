import { Target, Zap, Coins, BarChart3, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function KeyConcepts() {
  const concepts = [
    {
      title: "Smart Contracts",
      description:
        "Programs that automatically execute when specific conditions are met. They are like traditional contracts, but written in code and executed by the blockchain.",
      icon: Zap,
      bgColor: "bg-muted/50",
      iconBg: "bg-bitcoin-gold/20 border-2 border-bitcoin-gold/50",
      iconColor: "text-bitcoin-gold",
      titleColor: "text-foreground",
      textColor: "text-muted-foreground",
    },
    {
      title: "Tokens",
      description:
        "Digital assets that represent value, rights, or utilities within the DeFi ecosystem. They can be cryptocurrencies, stablecoins, or governance tokens.",
      icon: Coins,
      bgColor: "bg-muted/50",
      iconBg: "bg-bitcoin-gold/20 border-2 border-bitcoin-gold/50",
      iconColor: "text-bitcoin-gold",
      titleColor: "text-foreground",
      textColor: "text-muted-foreground",
    },
    {
      title: "Liquidity",
      description:
        "The ease with which an asset can be converted into another without significantly affecting its price. Higher liquidity = better prices and less slippage.",
      icon: BarChart3,
      bgColor: "bg-muted/50",
      iconBg: "bg-bitcoin-gold/20 border-2 border-bitcoin-gold/50",
      iconColor: "text-bitcoin-gold",
      titleColor: "text-foreground",
      textColor: "text-muted-foreground",
    },
    {
      title: "Yield Farming",
      description:
        "Strategy to maximize returns by moving assets between different DeFi protocols to capture the best return opportunities.",
      icon: TrendingUp,
      bgColor: "bg-muted/50",
      iconBg: "bg-bitcoin-gold/20 border-2 border-bitcoin-gold/50",
      iconColor: "text-bitcoin-gold",
      titleColor: "text-foreground",
      textColor: "text-muted-foreground",
    },
  ]

  return (
    <Card className="relative overflow-hidden transition-all duration-300 border-2 border-bitcoin-gold/40 hover:border-bitcoin-gold/60 hover:shadow-lg hover:shadow-bitcoin-orange/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Target className="h-6 w-6 text-bitcoin-gold" />
          Fundamental Concepts
        </CardTitle>
        <CardDescription>The pillars that support the DeFi ecosystem</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {concepts.map((concept) => (
            <div key={concept.title} className={`${concept.bgColor} rounded-lg p-4 border-2 border-bitcoin-gold/30 hover:border-bitcoin-gold/50 transition-all duration-300`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`h-8 w-8 rounded-full ${concept.iconBg} flex items-center justify-center`}>
                  <concept.icon className={`h-4 w-4 ${concept.iconColor}`} />
                </div>
                <h4 className={`font-semibold ${concept.titleColor}`}>{concept.title}</h4>
              </div>
              <p className={`text-sm ${concept.textColor}`}>{concept.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
