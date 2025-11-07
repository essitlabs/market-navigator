"use client"

import MarketCard from "./market-card"

// Generate sample sparkline data
const generateSparklineData = () => {
  return Array.from({ length: 20 }, () => Math.random() * 100 + 50)
}

const tabs = [
  { 
    id: "total-market", 
    label: "Total Market",
    percentage: 4.9,
    price: 22941.80,
    chartData: generateSparklineData()
  },
  { 
    id: "sp500", 
    label: "S&P 500",
    percentage: 4.9,
    price: 22941.80,
    chartData: generateSparklineData()
  },
  { 
    id: "russell", 
    label: "Russell 3000",
    percentage: 4.9,
    price: 22941.80,
    chartData: generateSparklineData()
  },
  { 
    id: "nasdaq", 
    label: "NASDAQ",
    percentage: 4.9,
    price: 22941.80,
    chartData: generateSparklineData()
  },
  { 
    id: "djia", 
    label: "DJIA",
    percentage: 4.9,
    price: 22941.80,
    chartData: generateSparklineData()
  },
]

interface MarketTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function MarketTabs({ activeTab, onTabChange }: MarketTabsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {tabs.map((tab) => (
        <MarketCard
          key={tab.id}
          title={tab.label}
          percentage={tab.percentage}
          price={tab.price}
          chartData={tab.chartData}
          isActive={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
        />
      ))}
    </div>
  )
}
