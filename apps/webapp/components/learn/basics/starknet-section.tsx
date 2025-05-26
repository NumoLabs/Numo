import { Award, Zap, Coins, Shield, BarChart3, Lock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function StarknetSection() {
  const advantages = [
    {
      title: "Fast Transactions",
      description: "Processing thousands of transactions per second with near-instant confirmations.",
      icon: Zap,
      bgColor: "bg-indigo-500",
      textColor: "text-indigo-900 dark:text-indigo-100",
      descColor: "text-indigo-700 dark:text-indigo-300",
    },
    {
      title: "Low Fees",
      description: "Minimal transaction costs that make trading and farming viable even with small amounts.",
      icon: Coins,
      bgColor: "bg-green-500",
      textColor: "text-green-900 dark:text-green-100",
      descColor: "text-green-700 dark:text-green-300",
    },
    {
      title: "Ethereum Security",
      description: "Inherits Ethereum's security while offering improved scalability and efficiency.",
      icon: Shield,
      bgColor: "bg-purple-500",
      textColor: "text-purple-900 dark:text-purple-100",
      descColor: "text-purple-700 dark:text-purple-300",
    },
  ]

  const protocols = [
    {
      name: "Ekubo",
      description: "DEX with AMM architecture optimized for efficient trading and liquidity provision.",
      icon: BarChart3,
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      iconColor: "text-orange-600",
    },
    {
      name: "Vesu",
      description: "Decentralized lending and vault platform with automated strategies.",
      icon: Lock,
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600",
    },
  ]

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200 dark:border-indigo-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Award className="h-6 w-6 text-indigo-600" />
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
                <advantage.icon className="h-8 w-8 text-white" />
              </div>
              <h4 className={`font-semibold ${advantage.textColor} mb-2`}>{advantage.title}</h4>
              <p className={`text-sm ${advantage.descColor}`}>{advantage.description}</p>
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        <div className="bg-white/50 dark:bg-gray-900/50 rounded-lg p-6">
          <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-4">
            Featured DeFi Protocols on Starknet
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            {protocols.map((protocol) => (
              <div
                key={protocol.name}
                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border"
              >
                <div className={`h-12 w-12 rounded-lg ${protocol.bgColor} flex items-center justify-center`}>
                  <protocol.icon className={`h-6 w-6 ${protocol.iconColor}`} />
                </div>
                <div>
                  <h5 className="font-medium">{protocol.name}</h5>
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
