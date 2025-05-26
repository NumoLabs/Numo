import { BookOpen, Coins, Shield } from "lucide-react"
import { LearningPathCard } from "./learning-path-card"

export function LearningPath() {
  const learningPaths = [
    {
      title: "Fundamentos",
      description: "Conceptos básicos de DeFi",
      icon: BookOpen,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      items: ["¿Qué es DeFi?", "Smart Contracts", "Starknet Ecosystem"],
      isActive: true,
    },
    {
      title: "Pools de Liquidez",
      description: "Cómo funcionan los pools",
      icon: Coins,
      iconColor: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      items: ["AMM Explicado", "Impermanent Loss", "Yield Farming"],
      isDisabled: true,
    },
    {
      title: "Gestión de Riesgos",
      description: "Estrategias avanzadas",
      icon: Shield,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      items: ["Análisis de Riesgos", "Diversificación", "Estrategias Avanzadas"],
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
