"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, ArrowRight } from "lucide-react"

interface Step {
  id: number
  name: string
  description: string
}

interface BitcoinBridgeFlowProps {
  steps: Step[]
  currentStep: number
}

export function BitcoinBridgeFlow({ steps, currentStep }: BitcoinBridgeFlowProps) {
  return (
    <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-orange-200/50 dark:border-orange-800/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          Bridge Flow Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-all duration-300 ${
                    currentStep > step.id
                      ? "bg-orange-500 text-white"
                      : currentStep === step.id
                      ? "bg-orange-500 text-white animate-pulse"
                      : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div className="text-xs font-medium">{step.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {step.description}
                  </div>
                </div>
                {currentStep === step.id && (
                  <Badge variant="secondary" className="mt-2 text-xs">
                    Current
                  </Badge>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div className="h-0.5 bg-gray-200 dark:bg-gray-700 relative">
                    <div
                      className={`h-full transition-all duration-500 ${
                        currentStep > step.id
                          ? "bg-orange-500"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                      style={{
                        width: currentStep > step.id ? "100%" : "0%",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 