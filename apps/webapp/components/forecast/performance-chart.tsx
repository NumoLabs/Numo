"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { BarChart3 } from "lucide-react"
import { generateHistoricalData } from "@/lib/forecast-data"

export default function PerformanceChart() {
  const [timeframe, setTimeframe] = useState<number>(30)
  const data = generateHistoricalData(timeframe)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{`Day ${label}`}</p>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value.toFixed(4)} BTC`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="border-blue-200 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Historical Performance Comparison
          </CardTitle>
          <div className="flex gap-2">
            <Button variant={timeframe === 7 ? "default" : "outline"} size="sm" onClick={() => setTimeframe(7)}>
              7D
            </Button>
            <Button variant={timeframe === 30 ? "default" : "outline"} size="sm" onClick={() => setTimeframe(30)}>
              30D
            </Button>
            <Button variant={timeframe === 90 ? "default" : "outline"} size="sm" onClick={() => setTimeframe(90)}>
              90D
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#666" fontSize={12} tickFormatter={(value) => `${value}d`} />
              <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => `${value.toFixed(3)}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="vault" stroke="#8b5cf6" strokeWidth={3} name="BTC Vault" dot={false} />
              <Line
                type="monotone"
                dataKey="hodl"
                stroke="#6b7280"
                strokeWidth={2}
                name="HODL"
                dot={false}
                strokeDasharray="5 5"
              />
              <Line type="monotone" dataKey="vesu" stroke="#10b981" strokeWidth={2} name="Vesu Only" dot={false} />
              <Line type="monotone" dataKey="ekubo" stroke="#f59e0b" strokeWidth={2} name="Ekubo Only" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="w-4 h-4 bg-purple-500 rounded mx-auto mb-2"></div>
            <div className="font-semibold text-purple-700">BTC Vault</div>
            <div className="text-sm text-gray-600">7.8% APY</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-4 h-4 bg-gray-500 rounded mx-auto mb-2 border-2 border-dashed border-gray-400"></div>
            <div className="font-semibold text-gray-700">HODL</div>
            <div className="text-sm text-gray-600">0% APY</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="w-4 h-4 bg-green-500 rounded mx-auto mb-2"></div>
            <div className="font-semibold text-green-700">Vesu Only</div>
            <div className="text-sm text-gray-600">5.2% APY</div>
          </div>
          <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="w-4 h-4 bg-amber-500 rounded mx-auto mb-2"></div>
            <div className="font-semibold text-amber-700">Ekubo Only</div>
            <div className="text-sm text-gray-600">8.9% APY</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
