import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface LearningPathCardProps {
  title: string
  description: string
  icon: LucideIcon
  iconColor: string
  bgColor: string
  items: string[]
  isActive?: boolean
  isDisabled?: boolean
}

export function LearningPathCard({
  title,
  description,
  icon: Icon,
  iconColor,
  bgColor,
  items,
  isActive = false,
  isDisabled = false,
}: LearningPathCardProps) {
  return (
    <Card className={`relative overflow-hidden transition-all duration-300 ${isActive ? "border-2 border-bitcoin-gold dark:border-bitcoin-gold" : "border border-border/50 hover:border-bitcoin-orange/30 hover:shadow-lg hover:shadow-bitcoin-orange/10"}`}>
      {isActive && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-bitcoin-orange to-bitcoin-gold" />}
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className={`h-12 w-12 rounded-full ${bgColor} flex items-center justify-center`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {items.map((item, index) => (
            <li key={item} className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${index === 0 && isActive ? "bg-bitcoin-orange" : "bg-gray-300"}`} />
              {item}
            </li>
          ))}
        </ul>
        <Button className="w-full mt-4" size="sm" variant={isDisabled ? "outline" : "default"} disabled={isDisabled}>
          {isDisabled ? "Coming Soon" : "Start"}
        </Button>
      </CardContent>
    </Card>
  )
}
