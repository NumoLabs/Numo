"use client"

import { Clock, Calendar, CalendarDays, Star, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { BondOption } from "@/lib/bonds-data"

interface BondOptionCardProps {
  option: BondOption
  selectedOption?: string
  onSelectOption: (optionId: string) => void
}

const iconMap = {
  Clock,
  Calendar,
  CalendarDays,
}

const colorMap = {
  blue: {
    bg: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
    border: "border-blue-200 dark:border-blue-800",
    icon: "bg-blue-500",
    text: "text-blue-600",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  },
  green: {
    bg: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
    border: "border-green-200 dark:border-green-800",
    icon: "bg-green-500",
    text: "text-green-600",
    badge: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
    border: "border-purple-200 dark:border-purple-800",
    icon: "bg-purple-500",
    text: "text-purple-600",
    badge: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  },
}

export function BondOptionCard({ option, selectedOption, onSelectOption }: BondOptionCardProps) {
  const IconComponent = iconMap[option.icon as keyof typeof iconMap]
  const colors = colorMap[option.color as keyof typeof colorMap]
  const isSelected = selectedOption === option.id

  const getCardStyle = () => {
    if (isSelected) {
      return `${colors.bg} border-2 ${colors.border.replace("border-", "border-").replace("-200", "-500").replace("-800", "-400")}`
    }
    return `${colors.bg} border ${colors.border} hover:${colors.border.replace("-200", "-300").replace("-800", "-700")} cursor-pointer transition-all duration-200`
  }

  return (
    <Card className={getCardStyle()} onClick={() => onSelectOption(option.id)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-12 w-12 rounded-full ${colors.icon} flex items-center justify-center`}>
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">{option.duration}</CardTitle>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {option.popular && (
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 gap-1">
                <Star className="h-3 w-3" />
                Popular
              </Badge>
            )}
            {isSelected && <CheckCircle className="h-5 w-5 text-green-500" />}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* APY Display */}
          <div className="text-center p-4 bg-white/50 dark:bg-gray-900/50 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl font-bold">{option.baseAPY}%</span>
              <span className="text-lg text-muted-foreground">+</span>
              <Badge className={colors.badge}>{option.boost}</Badge>
            </div>
            <div className="text-3xl font-bold mb-1" style={{ color: colors.text.replace("text-", "") }}>
              {option.boostedAPY}% APY
            </div>
            <p className="text-sm text-muted-foreground">Boosted Annual Yield</p>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Lock Period</p>
              <p className="font-medium">{option.duration}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Boost</p>
              <p className={`font-medium ${colors.text}`}>{option.boost}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Min Amount</p>
              <p className="font-medium">{option.minAmount}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Max Amount</p>
              <p className="font-medium">{option.maxAmount}</p>
            </div>
          </div>

          {/* Benefits */}
          <div className={`p-3 rounded-lg border ${colors.border}`}>
            <p className="text-sm font-medium mb-1">Benefits</p>
            <ul className="text-xs space-y-1">
              <li>• Higher APY than standard vault</li>
              <li>• Guaranteed lock period rewards</li>
              <li>• Automatic compound at maturity</li>
              {option.durationDays >= 30 && <li>• Priority access to new features</li>}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
