"use client"

import { Search, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface SearchFiltersProps {
  onSearchChange?: (value: string) => void
  onTypeChange?: (value: string) => void
  onPeriodChange?: (value: string) => void
}

export function SearchFilters({ onSearchChange, onTypeChange, onPeriodChange }: SearchFiltersProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Buscar y Filtrar</CardTitle>
        <CardDescription>Encuentra transacciones específicas usando los filtros disponibles</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por ID de transacción, hash o descripción..."
              className="pl-10"
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
          <Select onValueChange={onTypeChange}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="deposit">Depósitos</SelectItem>
              <SelectItem value="withdrawal">Retiros</SelectItem>
              <SelectItem value="rebalance">Rebalanceos</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={onPeriodChange}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 días</SelectItem>
              <SelectItem value="30d">Últimos 30 días</SelectItem>
              <SelectItem value="90d">Últimos 90 días</SelectItem>
              <SelectItem value="all">Todo el tiempo</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Más Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
