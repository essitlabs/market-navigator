"use client";

import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { subWeeks, subMonths, subQuarters, subYears, format } from "date-fns";
import ClientOnly from "./client-only";
import { useLineChartData } from "@/hooks/useLineChartData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// --- Helper: Date range logic
function getDateRange(period: string) {
  const end = new Date("2025-09-19"); // Last date in Excel: 9/19/2025
  let start: Date;

  switch (period) {
    case "Last week":
      start = subWeeks(end, 1);
      break;
    case "Last month":
      start = subMonths(end, 1);
      break;
    case "Last quarter":
      start = subQuarters(end, 1);
      break;
    case "Last year":
      start = subYears(end, 1);
      break;
    default:
      start = subMonths(end, 1);
  }

  return {
    startDate: format(start, "yyyy-MM-dd"),
    endDate: format(end, "yyyy-MM-dd"),
  };
}

interface MarketFundamentalsChartProps {
  sector: string;
  period: string;
}

type ViewMode = "Absolute" | "Multiple";

export default function MarketFundamentalsChart({
  sector,
  period,
}: MarketFundamentalsChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("Absolute");

  const { startDate, endDate } = useMemo(
    () => getDateRange(period),
    [period]
  );

  // Fetch data from API
  const { data: lineChartData, isLoading, isError } = useLineChartData({
    sector,
    startDate,
    endDate,
  });

  // Format data for chart
  const chartData = useMemo(() => {
    if (!lineChartData?.data) return [];
    
    return lineChartData.data.map((point, index) => ({
      id: `${point.date}-${index}`, // Unique key for each data point
      date: point.date,
      "Price": point.priceChange,
      "Fundamental Absolute": point.fundamentalAbsolute,
      "Fundamental Trend Line": point.trendLine,
    }));
  }, [lineChartData]);

  if (isLoading) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="text-muted-foreground">Loading chart data...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="text-destructive">Failed to load chart data</div>
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="text-muted-foreground">No data available for selected filters</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-0 right-0 z-10">
        <Select
          value={viewMode}
          onValueChange={(value: ViewMode) => setViewMode(value)}
        >
          <SelectTrigger className="w-[130px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Absolute">Absolute</SelectItem>
            <SelectItem value="Multiple">Multiple</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ClientOnly>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 30, right: 20, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF" 
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => {
                // Format date to show only month/day
                const [month, day] = value.split("/");
                return `${month}/${day}`;
              }}
            />
            <YAxis
              tickFormatter={(v) => `${v.toFixed(1)}%`}
              stroke="#9CA3AF"
              tick={{ fontSize: 11 }}
              width={50}
            />
            <Tooltip
              formatter={(value: number) => `${value.toFixed(2)}%`}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{
                backgroundColor: "rgba(17, 24, 39, 0.95)",
                border: "1px solid #374151",
                borderRadius: "6px",
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: "12px" }}
              iconType="line"
            />

            {/* Price - Light green/yellow wavy line */}
            <Line
              type="monotone"
              dataKey="Price"
              stroke="#34D399"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              name="Price"
              activeDot={{ r: 5 }}
            />

            {/* Fundamental Absolute - Light blue wavy line */}
            <Line
              type="monotone"
              dataKey="Fundamental Absolute"
              stroke="#60A5FA"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              name="Fundamental Absolute"
              activeDot={{ r: 5 }}
            />

            {/* Fundamental Trend Line - Dark gray straight line (render last for visibility) */}
            <Line
              type="monotone"
              dataKey="Fundamental Trend Line"
              stroke="#1F2937"
              strokeWidth={2.5}
              dot={false}
              name="Fundamental Trend Line"
              strokeDasharray="0"
            />
          </LineChart>
        </ResponsiveContainer>
      </ClientOnly>
    </div>
  );
}
