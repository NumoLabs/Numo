"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/ui/header"
import { StatsOverview } from "@/components/history/stats-overview"
import { SearchFilters } from "@/components/history/search-filters"
import { HistoryTabs } from "@/components/history/history-tabs"
import { historyStats } from "@/lib/history-data"

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedPeriod, setSelectedPeriod] = useState("all")

  return (
    <div className="flex min-h-screen flex-col">
      <Header variant="dashboard" />
      <main className="flex-1 p-4 md:p-8 pt-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver al Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Historial de Transacciones</h1>
              <p className="text-muted-foreground mt-1">Seguimiento completo de tu actividad en la vault</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              Filtrar por Fecha
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview stats={historyStats} />

        {/* Search and Filters */}
        <SearchFilters
          onSearchChange={setSearchTerm}
          onTypeChange={setSelectedType}
          onPeriodChange={setSelectedPeriod}
        />

        {/* Transaction Tabs */}
        <HistoryTabs searchTerm={searchTerm} />
      </main>
    </div>
  )
}
