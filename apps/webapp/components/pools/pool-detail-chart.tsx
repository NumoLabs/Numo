"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function PoolDetailChart() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const data = [
    { name: "Ene", apy: 4.2 },
    { name: "Feb", apy: 4.5 },
    { name: "Mar", apy: 4.3 },
    { name: "Abr", apy: 4.8 },
    { name: "May", apy: 5.1 },
    { name: "Jun", apy: 4.9 },
    { name: "Jul", apy: 4.7 },
    { name: "Ago", apy: 4.8 },
  ]

  if (!isMounted) {
    return <div className="h-[300px] flex items-center justify-center">Cargando gráfico...</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
        <XAxis dataKey="name" />
        <YAxis domain={[4, 6]} tickFormatter={(value) => `${value}%`} />
        <Tooltip formatter={(value) => [`${value}%`, "APY"]} />
        <Line type="monotone" dataKey="apy" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
