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
      return "opacity-50 cursor-not-allowed border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50"
    }
    if (isSelected) {
      return "border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 shadow-lg transform scale-[1.02] transition-all duration-300"
    }
    return "border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.01] bg-white dark:bg-gray-800/50"
  }

  const getIconBackground = (optionId: string, isSelected: boolean) => {
    if (isSelected) {
      switch (optionId) {
        case "instant":
          return "bg-gradient-to-br from-orange-500 to-red-500"
        case "standard":
          return "bg-gradient-to-br from-blue-500 to-indigo-500"
        case "scheduled":
          return "bg-gradient-to-br from-purple-500 to-violet-500"
        default:
          return "bg-gray-500"
      }
    }
    return "bg-gray-100 dark:bg-gray-700"
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Withdrawal Options</h3>
        <p className="text-gray-600 dark:text-gray-400">Select the withdrawal type that best suits your needs</p>
      </div>

      <div className="grid gap-4">
        {options.map((option) => (
          <Card
            key={option.id}
            className={getCardStyle(option.id, selectedOption === option.id, option.available)}
            onClick={() => option.available && onSelectOption(option.id)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center shadow-md ${getIconBackground(option.id, selectedOption === option.id)}`}
                  >
                    {getIcon(option.id)}
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">{option.name}</CardTitle>
                    <CardDescription className="text-sm">{option.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {selectedOption === option.id && (
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                  )}
                  {!option.available && (
                    <Badge variant="secondary" className="bg-gray-200 text-gray-600">
                      Coming Soon
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Time</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{option.estimatedTime}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Fee</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{option.fees}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Gas</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{option.gasEstimate}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Minimum</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{option.minAmount}</p>
                </div>
              </div>

              {option.id === "instant" && (
                <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-lg border border-orange-200 dark:border-orange-800">
                  <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                    ⚡ Immediate withdrawal with additional priority fee
                  </p>
                </div>
              )}
              {option.id === "standard" && (
                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
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
