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
        <CardTitle className="text-lg">Search and Filter</CardTitle>
        <CardDescription>Find specific transactions using the available filters</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by transaction ID, hash or description..."
              className="pl-10"
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
          <Select onValueChange={onTypeChange}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="deposit">Deposits</SelectItem>
              <SelectItem value="withdrawal">Withdrawals</SelectItem>
              <SelectItem value="rebalance">Rebalances</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={onPeriodChange}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
