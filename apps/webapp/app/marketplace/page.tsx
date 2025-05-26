"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/ui/header"
import { MarketplaceHero } from "@/components/marketplace/marketplace-hero"
import { MarketplaceFilters } from "@/components/marketplace/marketplace-filters"
import { StrategyCard } from "@/components/marketplace/strategy-card"
import { useToast } from "@/hooks/use-toast"
import {
  marketplaceStrategies,
  sortStrategiesByAPY,
  sortStrategiesByTVL,
  sortStrategiesByFollowers,
} from "@/lib/marketplace-data"

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRisk, setSelectedRisk] = useState("all")
  const [sortBy, setSortBy] = useState("apy")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false)
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  const [followedStrategies, setFollowedStrategies] = useState<Set<string>>(new Set())

  const { toast } = useToast()

  const filteredAndSortedStrategies = useMemo(() => {
    let filtered = marketplaceStrategies

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (strategy) =>
          strategy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          strategy.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          strategy.creatorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          strategy.creator.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply risk filter
    if (selectedRisk !== "all") {
      filtered = filtered.filter((strategy) => strategy.risk === selectedRisk)
    }

    // Apply verified filter
    if (showVerifiedOnly) {
      filtered = filtered.filter((strategy) => strategy.verified)
    }

    // Apply featured filter
    if (showFeaturedOnly) {
      filtered = filtered.filter((strategy) => strategy.featured)
    }

    // Apply sorting
    switch (sortBy) {
      case "apy":
        return sortStrategiesByAPY(filtered, sortOrder === "asc")
      case "tvl":
        return sortStrategiesByTVL(filtered, sortOrder === "asc")
      case "followers":
        return sortStrategiesByFollowers(filtered, sortOrder === "asc")
      case "created":
        return [...filtered].sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime()
          const dateB = new Date(b.createdAt).getTime()
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA
        })
      default:
        return filtered
    }
  }, [searchQuery, selectedRisk, sortBy, sortOrder, showVerifiedOnly, showFeaturedOnly])

  const handleFollowStrategy = (strategyId: string) => {
    const strategy = marketplaceStrategies.find((s) => s.id === strategyId)
    if (!strategy) return

    const newFollowedStrategies = new Set(followedStrategies)

    if (followedStrategies.has(strategyId)) {
      newFollowedStrategies.delete(strategyId)
      toast({
        title: "Unfollowed strategy",
        description: `You are no longer following ${strategy.name}.`,
      })
    } else {
      newFollowedStrategies.add(strategyId)
      toast({
        title: "Following strategy",
        description: `You are now following ${strategy.name}. You'll receive updates on performance and changes.`,
      })
    }

    setFollowedStrategies(newFollowedStrategies)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header variant="dashboard" />
      <main className="flex-1 p-4 md:p-8 pt-6">
        <div className="mx-auto max-w-7xl">
          {/* Navigation */}
          <div className="flex items-center gap-2 mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <MarketplaceHero />

          {/* Filters */}
          <div className="mb-8">
            <MarketplaceFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedRisk={selectedRisk}
              onRiskChange={setSelectedRisk}
              sortBy={sortBy}
              onSortChange={setSortBy}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
              showVerifiedOnly={showVerifiedOnly}
              onVerifiedOnlyChange={setShowVerifiedOnly}
              showFeaturedOnly={showFeaturedOnly}
              onFeaturedOnlyChange={setShowFeaturedOnly}
            />
          </div>

          {/* Results */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{filteredAndSortedStrategies.length} Strategies Found</h2>
              <div className="text-sm text-muted-foreground">
                Sorted by {sortBy} ({sortOrder === "desc" ? "highest" : "lowest"} first)
              </div>
            </div>
          </div>

          {/* Strategy Grid */}
          {filteredAndSortedStrategies.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAndSortedStrategies.map((strategy) => (
                <StrategyCard
                  key={strategy.id}
                  strategy={strategy}
                  onFollow={handleFollowStrategy}
                  isFollowing={followedStrategies.has(strategy.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">No strategies found matching your criteria.</div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedRisk("all")
                  setShowVerifiedOnly(false)
                  setShowFeaturedOnly(false)
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
