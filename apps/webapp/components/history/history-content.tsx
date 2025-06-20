"use client"

import { useState } from "react"
import { Calendar, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatsOverview } from "@/components/history/stats-overview"
import { SearchFilters } from "@/components/history/search-filters"
import { DashboardTabs } from "@/components/dashboard/charts/dashboard-tabs"
import { historyStats } from "@/lib/history-data"

export function HistoryContent() {
  // const [searchTerm, setSearchTerm] = useState("")
  const [, setSelectedType] = useState("all")
  const [, setSelectedPeriod] = useState("all")

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div>
            <h1 className="text-3xl font-bold">Transaction History</h1>
            <p className="text-muted-foreground mt-1">Complete tracking of your vault activity</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            Filter by Date
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsOverview stats={historyStats} />

      {/* Search and Filters */}
      <SearchFilters onSearchChange={() => {}} onTypeChange={setSelectedType} onPeriodChange={setSelectedPeriod} />

      {/* Transaction Tabs */}
      <DashboardTabs />
    </>
  )
}
