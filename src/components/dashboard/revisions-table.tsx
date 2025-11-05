"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const tableData = [
  { ticker: "AAPL", priceChange: "+2.5%", salesNTM: "+1.2%", col1: "Stable", col2: "Trend Break", col3: "Mean Revert" },
  { ticker: "MSFT", priceChange: "+1.8%", salesNTM: "+0.9%", col1: "Stable", col2: "Stable", col3: "Stable" },
  {
    ticker: "GOOGL",
    priceChange: "+3.2%",
    salesNTM: "+2.1%",
    col1: "Trend Break",
    col2: "Mean Revert",
    col3: "Stable",
  },
  { ticker: "AMZN", priceChange: "+0.5%", salesNTM: "-0.3%", col1: "Mean Revert", col2: "Stable", col3: "Trend Break" },
  { ticker: "NVDA", priceChange: "+5.1%", salesNTM: "+3.8%", col1: "Stable", col2: "Stable", col3: "Mean Revert" },
  { ticker: "TSLA", priceChange: "-1.2%", salesNTM: "-0.8%", col1: "Trend Break", col2: "Trend Break", col3: "Stable" },
  { ticker: "META", priceChange: "+2.9%", salesNTM: "+1.5%", col1: "Stable", col2: "Mean Revert", col3: "Stable" },
  { ticker: "NFLX", priceChange: "+4.3%", salesNTM: "+2.7%", col1: "Mean Revert", col2: "Stable", col3: "Stable" },
  { ticker: "INTC", priceChange: "-0.8%", salesNTM: "-1.1%", col1: "Stable", col2: "Trend Break", col3: "Mean Revert" },
  { ticker: "AMD", priceChange: "+3.6%", salesNTM: "+2.2%", col1: "Stable", col2: "Stable", col3: "Trend Break" },
]

export default function RevisionsTable() {
  const [sortBy, setSortBy] = useState("price")

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Top & Bottom 10 weekly Revisions</h3>

        <div className="flex gap-2">
          {["Filter", "Filter", "Filter", "Filter", "Filter"].map((_, idx) => (
            <DropdownMenu key={idx}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Option 1</DropdownMenuItem>
                <DropdownMenuItem>Option 2</DropdownMenuItem>
                <DropdownMenuItem>Option 3</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-foreground bg-muted/50">Ticker</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground bg-muted/50">Price Change</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground bg-muted/50">Sales NTM Change</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground bg-muted/50">L-Term/S-Term</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground bg-muted/50">Trend Break</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground bg-muted/50">Mean Revert</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, idx) => (
              <tr key={idx} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 font-medium text-foreground">{row.ticker}</td>
                <td className="py-3 px-4 text-muted-foreground">{row.priceChange}</td>
                <td className="py-3 px-4 text-muted-foreground">{row.salesNTM}</td>
                <td className="py-3 px-4 text-muted-foreground">{row.col1}</td>
                <td className="py-3 px-4 text-muted-foreground">{row.col2}</td>
                <td className="py-3 px-4 text-muted-foreground">{row.col3}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
