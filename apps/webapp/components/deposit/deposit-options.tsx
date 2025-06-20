"use client"

import { Clock, Zap, Calendar, CheckCircle, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { DepositOption } from "@/lib/deposit-data"

interface DepositOptionsProps {
  options: DepositOption[]
  selectedOption?: string
  onSelectOption: (optionId: string) => void
}

export function DepositOptions({ options, selectedOption, onSelectOption }: DepositOptionsProps) {
  const getIcon = (optionId: string) => {
    switch (optionId) {
      case "priority":
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
      return "border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-xl"
    }
    return "border-0 shadow-lg hover:shadow-xl hover:scale-[1.02] cursor-pointer transition-all duration-300"
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Deposit Options</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Select the confirmation speed you prefer for your deposit
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
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center shadow-md">
                    {getIcon(option.id)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base text-gray-900 dark:text-gray-100">{option.name}</CardTitle>
                      {option.recommended && (
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md gap-1">
                          <Star className="h-3 w-3" />
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-gray-600 dark:text-gray-400">{option.description}</CardDescription>
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
                  <p className="text-gray-600 dark:text-gray-400">Time</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{option.estimatedTime}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Fee</p>
                  <p className="font-medium text-green-600">{option.fees}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Estimated gas</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{option.gasEstimate}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Minimum</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{option.minAmount}</p>
                </div>
              </div>
              {option.id === "priority" && (
                <div className="mt-3 p-2 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded border border-orange-200 dark:border-orange-800">
                  <p className="text-xs text-orange-700 dark:text-orange-300">
                    ⚡ Priority confirmation with high gas for maximum speed
                  </p>
                </div>
              )}
              {option.id === "standard" && option.recommended && (
                <div className="mt-3 p-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded border border-green-200 dark:border-green-800">
                  <p className="text-xs text-green-700 dark:text-green-300">
                    ⭐ Recommended option - Perfect balance between speed and cost
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
