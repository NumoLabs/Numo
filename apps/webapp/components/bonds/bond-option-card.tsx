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
  bitcoin: {
    bg: "bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20",
    border: "border-orange-200 dark:border-orange-800",
    icon: "bg-bitcoin-orange",
    text: "text-bitcoin-orange",
    badge: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  },
  gold: {
    bg: "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20",
    border: "border-yellow-200 dark:border-yellow-800",
    icon: "bg-bitcoin-gold",
    text: "text-bitcoin-gold",
    badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  },
  orange: {
    bg: "bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20",
    border: "border-orange-200 dark:border-orange-800",
    icon: "bg-orange-500",
    text: "text-orange-600",
    badge: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  },
}

export function BondOptionCard({ option, selectedOption, onSelectOption }: BondOptionCardProps) {
  const IconComponent = iconMap[option.icon as keyof typeof iconMap]
  const colors = colorMap[option.color as keyof typeof colorMap] || colorMap.bitcoin
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
              <Badge className="bg-bitcoin-gold/20 text-bitcoin-gold border-bitcoin-gold/30 gap-1">
                <Star className="h-3 w-3" />
                Popular
              </Badge>
            )}
            {isSelected && <CheckCircle className="h-5 w-5 text-bitcoin-orange" />}
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
