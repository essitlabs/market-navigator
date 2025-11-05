"use client"

import { useState } from "react"
import Header from "@/components/layout/header"
import MarketTabs from "./market-tabs"
import MarketPerformance from "./market-performance"
import RevisionsTable from "./revisions-table"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("total-market")
  const [selectedSector, setSelectedSector] = useState("Business Services")
  const [selectedMethod, setSelectedMethod] = useState("Absolute Revision")
  const [selectedPeriod, setSelectedPeriod] = useState("Last week")

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-6">Market Dashboard</h1>

          <MarketTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="space-y-6">
          <MarketPerformance
            selectedSector={selectedSector}
            onSectorChange={setSelectedSector}
            selectedMethod={selectedMethod}
            onMethodChange={setSelectedMethod}
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />

          <RevisionsTable />
        </div>
      </main>
    </div>
  )
}
