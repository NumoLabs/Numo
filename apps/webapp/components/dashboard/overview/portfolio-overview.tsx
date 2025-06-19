import { Bitcoin, TrendingUp, Star, Clock } from "lucide-react"
import { getPortfolioCards } from "@/lib/dashboard-data"

const iconMap = {
  Bitcoin,
  TrendingUp,
  Star,
  Clock,
}

export function PortfolioOverview() {
  const portfolioCards = getPortfolioCards()

  return null
}
