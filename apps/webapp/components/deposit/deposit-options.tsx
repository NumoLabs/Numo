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
      return "border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/20"
    }
    return "border hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer transition-colors"
  }

  const getBadgeStyle = (optionId: string) => {
    switch (optionId) {
      case "priority":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
      case "standard":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "scheduled":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Opciones de Depósito</h3>
        <p className="text-sm text-muted-foreground">
          Selecciona la velocidad de confirmación que prefieras para tu depósito
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
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{option.name}</CardTitle>
                      {option.recommended && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 gap-1">
                          <Star className="h-3 w-3" />
                          Recomendado
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{option.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedOption === option.id && <CheckCircle className="h-5 w-5 text-blue-500" />}
                  {!option.available && <Badge variant="secondary">Próximamente</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Tiempo</p>
                  <p className="font-medium">{option.estimatedTime}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Comisión</p>
                  <p className="font-medium text-green-600">{option.fees}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Gas estimado</p>
                  <p className="font-medium">{option.gasEstimate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Mínimo</p>
                  <p className="font-medium">{option.minAmount}</p>
                </div>
              </div>
              {option.id === "priority" && (
                <div className="mt-3 p-2 bg-orange-50 dark:bg-orange-950/20 rounded border border-orange-200 dark:border-orange-800">
                  <p className="text-xs text-orange-700 dark:text-orange-300">
                    ⚡ Confirmación prioritaria con gas alto para máxima velocidad
                  </p>
                </div>
              )}
              {option.id === "standard" && option.recommended && (
                <div className="mt-3 p-2 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                  <p className="text-xs text-green-700 dark:text-green-300">
                    ⭐ Opción recomendada - Balance perfecto entre velocidad y costo
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
