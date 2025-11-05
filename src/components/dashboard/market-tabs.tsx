"use client"

import { Button } from "@/components/ui/button"

const tabs = [
  { id: "total-market", label: "Total Market" },
  { id: "sp500", label: "S&P 500" },
  { id: "russell", label: "Russel 3000 (IWM)" },
  { id: "nasdaq", label: "NASDAQ" },
  { id: "djia", label: "DJIA" },
]

interface MarketTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function MarketTabs({ activeTab, onTabChange }: MarketTabsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "outline"}
          onClick={() => onTabChange(tab.id)}
          className="text-sm"
        >
          {tab.label}
        </Button>
      ))}
    </div>
  )
}
