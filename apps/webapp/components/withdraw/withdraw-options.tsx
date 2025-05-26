"use client"

import { Clock, Zap, Calendar, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { WithdrawOption } from "@/lib/withdraw-data"

interface WithdrawOptionsProps {
  options: WithdrawOption[]
  selectedOption?: string
  onSelectOption: (optionId: string) => void
}

export function WithdrawOptions({ options, selectedOption, onSelectOption }: WithdrawOptionsProps) {
  const getIcon = (optionId: string) => {
    switch (optionId) {
      case "instant":
        return <Zap className="h-5 w-5 text-orange-500" />
      case "standard":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "scheduled":
        return <Calendar className="h-5 w-5 text-purple-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getCardStyle = (optionId: string, isSelected: boolean, isAvailable: boolean) => {
    if (!isAvailable) {
      return "opacity-50 cursor-not-allowed border-gray-200 dark:border-gray-800"
    }
    if (isSelected) {
      return "border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/20"
    }
    return "border hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer transition-colors"
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Withdrawal Options</h3>
        <p className="text-sm text-muted-foreground">
          Select the withdrawal type that best suits your needs
        </p>
      </div>

      <div className="grid gap-4">
        {options.map((option) => (
          <Card
            key={option.id}
            className={getCardStyle(option.id, selectedOption === option.id, option.available)}
            onClick={() => option.available && onSelectOption(option.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getIcon(option.id)}
                  <div>
                    <CardTitle className="text-base">{option.name}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedOption === option.id && <CheckCircle className="h-5 w-5 text-blue-500" />}
                  {!option.available && <Badge variant="secondary">Coming Soon</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Time</p>
                  <p className="font-medium">{option.estimatedTime}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Fee</p>
                  <p className="font-medium">{option.fees}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Estimated gas</p>
                  <p className="font-medium">{option.gasEstimate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Minimum</p>
                  <p className="font-medium">{option.minAmount}</p>
                </div>
              </div>
              {option.id === "instant" && (
                <div className="mt-3 p-2 bg-orange-50 dark:bg-orange-950/20 rounded border border-orange-200 dark:border-orange-800">
                  <p className="text-xs text-orange-700 dark:text-orange-300">
                    ⚡ Immediate withdrawal with additional priority fee
                  </p>
                </div>
              )}
              {option.id === "standard" && (
                <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    ⭐ Recommended option - Balance between speed and cost
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
