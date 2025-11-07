"use client"

import { useState, useEffect } from "react"
import Header from "@/components/layout/header"
import MarketTabs from "./market-tabs"
import MarketPerformance from "./market-performance"
import RevisionsTable from "./revisions-table"
import { useSectors } from "@/hooks/useSectors"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("total-market")
  const [selectedSector, setSelectedSector] = useState("")
  const [selectedMethod, setSelectedMethod] = useState("Absolute Revision")
  const [selectedPeriod, setSelectedPeriod] = useState("Last week")

  // Fetch sectors and set the first one as default
  const { data: sectorsData } = useSectors()
  
  useEffect(() => {
    if (sectorsData?.sectors && sectorsData.sectors.length > 0 && !selectedSector) {
      setSelectedSector(sectorsData.sectors[0])
    }
  }, [sectorsData, selectedSector])

  // Don't render until we have a sector selected
  if (!selectedSector && sectorsData?.sectors && sectorsData.sectors.length > 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-6">Market Dashboard</h1>

          <MarketTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="space-y-6">
          {selectedSector && (
            <MarketPerformance
              selectedSector={selectedSector}
              onSectorChange={setSelectedSector}
              selectedMethod={selectedMethod}
              onMethodChange={setSelectedMethod}
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
            />
          )}

          {selectedSector && (
            <RevisionsTable 
              selectedSector={selectedSector}
              selectedPeriod={selectedPeriod}
            />
          )}
        </div>
      </main>
    </div>
  )
}
