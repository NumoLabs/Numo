import { BookOpen, Coins, Shield } from "lucide-react"
import { LearningPathCard } from "./learning-path-card"

export function LearningPath() {
  const learningPaths = [
    {
      title: "Fundamentals",
      description: "Basic DeFi concepts",
      icon: BookOpen,
      iconColor: "text-yellow-500",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      items: ["What is DeFi?", "Smart Contracts", "Starknet Ecosystem"],
      isActive: true,
    },
    {
      title: "Liquidity Pools",
      description: "How pools work",
      icon: Coins,
      iconColor: "text-yellow-500",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      items: ["AMM Explained", "Impermanent Loss", "Yield Farming"],
      isDisabled: true,
    },
    {
      title: "Risk Management",
      description: "Advanced strategies",
      icon: Shield,
      iconColor: "text-yellow-500",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      items: ["Risk Analysis", "Diversification", "Advanced Strategies"],
      isDisabled: true,
    },
  ]

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {learningPaths.map((path) => (
        <LearningPathCard key={path.title} {...path} />
      ))}
    </div>
  )
}
