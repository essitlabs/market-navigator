"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MarketCardProps {
  title: string
  percentage: number
  price: number
  chartData?: number[]
  isActive?: boolean
  onClick?: () => void
  className?: string
}

// Simple sparkline component
function MiniChart({ data }: { data: number[] }) {
  if (!data || data.length === 0) {
    return null
  }

  const width = 120
  const height = 40
  const padding = 2

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  // Generate path for the line
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * (width - padding * 2) + padding
    const y = height - padding - ((value - min) / range) * (height - padding * 2)
    return `${x},${y}`
  })

  const linePath = `M ${points.join(" L ")}`

  // Generate area path (fill under the line)
  const areaPath = `${linePath} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`

  return (
    <svg width={width} height={height} className="overflow-visible">
      {/* Filled area under the line */}
      <path
        d={areaPath}
        fill="#86efac"
        fillOpacity="0.2"
        stroke="none"
      />
      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke="#86efac"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function MarketCard({
  title,
  percentage,
  price,
  chartData = [],
  isActive = false,
  onClick,
  className,
}: MarketCardProps) {
  const isPositive = percentage >= 0

  return (
    <Card
      onClick={onClick}
      className={cn(
        "p-4 cursor-pointer transition-all hover:shadow-md border",
        isActive ? "bg-gray-100" : "bg-white",
        className
      )}
    >
      <div className="space-y-3">
        {/* Header with title and percentage badge */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm text-gray-900">{title}</h3>
          <div
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap",
              isPositive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            )}
          >
            {isPositive ? "+" : ""}{percentage.toFixed(1)}%
          </div>
        </div>

        {/* Price section and chart */}
        <div className="flex items-end justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-1">Total Price</p>
            <p className="text-lg font-bold text-gray-900">
              {price.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          {/* Mini chart */}
          {chartData.length > 0 && (
            <div className="flex-shrink-0">
              <MiniChart data={chartData} />
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

