import { Bitcoin, TrendingUp, Star, Clock, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPortfolioCards } from "@/lib/dashboard-data"

const iconMap = {
  Bitcoin,
  TrendingUp,
  Star,
  Clock,
}

interface CardColors {
  bg: string
  border: string
  text: string
  subText: string
}

// Helper function to get solid background color for icons based on card colors
function getIconBackgroundColor(cardColors: CardColors): string {
  if (cardColors.bg.includes('amber')) return 'bg-amber-500'
  if (cardColors.bg.includes('green')) return 'bg-green-500'
  if (cardColors.bg.includes('blue')) return 'bg-blue-500'
  if (cardColors.bg.includes('purple')) return 'bg-purple-500'
  if (cardColors.bg.includes('orange')) return 'bg-orange-500'
  return 'bg-gray-500' // fallback
}

export function PortfolioOverview() {
  const portfolioCards = getPortfolioCards()

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {portfolioCards.map((card, index) => {
        const IconComponent = iconMap[card.icon as keyof typeof iconMap]
        const iconBgColor = getIconBackgroundColor(card.colors)

        return (
          <Card key={index} className={`relative overflow-hidden ${card.colors.bg} ${card.colors.border}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${card.colors.text}`}>{card.title}</CardTitle>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${iconBgColor}`}>
                <IconComponent className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${card.colors.text.replace("dark:text-", "dark:text-").replace("-200", "-100")}`}
              >
                {card.value}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3 text-green-500" />
                <p className={`text-xs ${card.colors.subText}`}>{card.subValue}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
