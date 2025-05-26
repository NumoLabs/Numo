"use client"
import { Filter, Search, SortAsc, SortDesc } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MarketplaceFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedRisk: string
  onRiskChange: (risk: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
  sortOrder: "asc" | "desc"
  onSortOrderChange: (order: "asc" | "desc") => void
  showVerifiedOnly: boolean
  onVerifiedOnlyChange: (verified: boolean) => void
  showFeaturedOnly: boolean
  onFeaturedOnlyChange: (featured: boolean) => void
}

export function MarketplaceFilters({
  searchQuery,
  onSearchChange,
  selectedRisk,
  onRiskChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  showVerifiedOnly,
  onVerifiedOnlyChange,
  showFeaturedOnly,
  onFeaturedOnlyChange,
}: MarketplaceFiltersProps) {
  const activeFiltersCount = [selectedRisk !== "all", showVerifiedOnly, showFeaturedOnly].filter(Boolean).length

  const clearAllFilters = () => {
    onRiskChange("all")
    onVerifiedOnlyChange(false)
    onFeaturedOnlyChange(false)
    onSearchChange("")
  }

  return (
    <div className="space-y-4">
      {/* Search and Sort */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search strategies by name or creator..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apy">APY</SelectItem>
              <SelectItem value="tvl">TVL</SelectItem>
              <SelectItem value="followers">Followers</SelectItem>
              <SelectItem value="created">Created Date</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}>
            {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                <Filter className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Risk Level</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onRiskChange("all")}>
                <div className="flex items-center justify-between w-full">
                  All Risk Levels
                  {selectedRisk === "all" && <div className="h-2 w-2 bg-blue-500 rounded-full" />}
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRiskChange("Low")}>
                <div className="flex items-center justify-between w-full">
                  Low Risk
                  {selectedRisk === "Low" && <div className="h-2 w-2 bg-blue-500 rounded-full" />}
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRiskChange("Medium")}>
                <div className="flex items-center justify-between w-full">
                  Medium Risk
                  {selectedRisk === "Medium" && <div className="h-2 w-2 bg-blue-500 rounded-full" />}
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRiskChange("High")}>
                <div className="flex items-center justify-between w-full">
                  High Risk
                  {selectedRisk === "High" && <div className="h-2 w-2 bg-blue-500 rounded-full" />}
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Strategy Type</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onVerifiedOnlyChange(!showVerifiedOnly)}>
                <div className="flex items-center justify-between w-full">
                  Verified Only
                  {showVerifiedOnly && <div className="h-2 w-2 bg-blue-500 rounded-full" />}
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFeaturedOnlyChange(!showFeaturedOnly)}>
                <div className="flex items-center justify-between w-full">
                  Featured Only
                  {showFeaturedOnly && <div className="h-2 w-2 bg-blue-500 rounded-full" />}
                </div>
              </DropdownMenuItem>

              {activeFiltersCount > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={clearAllFilters}>Clear All Filters</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedRisk !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Risk: {selectedRisk}
              <button
                onClick={() => onRiskChange("all")}
                className="ml-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-0.5"
              >
                ×
              </button>
            </Badge>
          )}
          {showVerifiedOnly && (
            <Badge variant="secondary" className="gap-1">
              Verified Only
              <button
                onClick={() => onVerifiedOnlyChange(false)}
                className="ml-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-0.5"
              >
                ×
              </button>
            </Badge>
          )}
          {showFeaturedOnly && (
            <Badge variant="secondary" className="gap-1">
              Featured Only
              <button
                onClick={() => onFeaturedOnlyChange(false)}
                className="ml-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-0.5"
              >
                ×
              </button>
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear All
          </Button>
        </div>
      )}
    </div>
  )
}
