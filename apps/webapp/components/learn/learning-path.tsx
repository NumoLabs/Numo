import { BookOpen, Coins, Shield } from "lucide-react"
import { LearningPathCard } from "./learning-path-card"

export function LearningPath() {
  const learningPaths = [
    {
      title: "Fundamentals",
      description: "Basic DeFi concepts",
      icon: BookOpen,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      items: ["What is DeFi?", "Smart Contracts", "Starknet Ecosystem"],
      isActive: true,
    },
    {
      title: "Liquidity Pools",
      description: "How pools work",
      icon: Coins,
      iconColor: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      items: ["AMM Explained", "Impermanent Loss", "Yield Farming"],
      isDisabled: true,
    },
    {
      title: "Risk Management",
      description: "Advanced strategies",
      icon: Shield,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
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
