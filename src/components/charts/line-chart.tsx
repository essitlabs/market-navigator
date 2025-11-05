"use client";

import React, { useMemo } from "react";
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

// --- Helper: Date range logic (same as your heatmap)
function getDateRange(period: string) {
  const end = new Date("2015-05-09"); // fallback or last known date
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
  selectedSector: string;
  selectedPeriod: string;
  selectedTab: string;
}

export default function MarketFundamentalsChart({
  selectedSector,
  selectedPeriod,
  selectedTab,
}: MarketFundamentalsChartProps) {
  const { startDate, endDate } = useMemo(
    () => getDateRange(selectedPeriod),
    [selectedPeriod]
  );

  // --- Mock raw values
  const mockRawData = [
    { date: "2015-04-10", price: 100, sales: 250, ebitda: 120 },
    { date: "2015-04-17", price: 110, sales: 260, ebitda: 130 },
    { date: "2015-04-24", price: 105, sales: 245, ebitda: 125 },
    { date: "2015-05-01", price: 120, sales: 270, ebitda: 140 },
    { date: "2015-05-08", price: 150, sales: 300, ebitda: 160 },
  ];

  // --- Calculate percentage changes
  const chartData = useMemo(() => {
    return mockRawData.map((item, index) => {
      if (index === 0) {
        return {
          date: item.date,
          PriceChange: 0,
          SalesRevision: 0,
          EBITDARevision: 0,
        };
      }

      const prev = mockRawData[index - 1];
      const PriceChange = ((item.price - prev.price) / prev.price) * 100;
      const SalesRevision = ((item.sales - prev.sales) / prev.sales) * 100;
      const EBITDARevision = ((item.ebitda - prev.ebitda) / prev.ebitda) * 100;

      return {
        date: item.date,
        PriceChange,
        SalesRevision,
        EBITDARevision,
      };
    });
  }, [mockRawData]);

  return (
    <div className="relative w-full h-[420px] p-4 rounded-lg bg-white/5">
      <h2 className="text-lg font-semibold mb-1 text-white">
        Market Fundamentals — {selectedSector || "All Sectors"}
      </h2>
      <ClientOnly>
        <ResponsiveContainer width="100%" height="80%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="date" stroke="#ccc" tick={{ fontSize: 12 }} />
            <YAxis
              tickFormatter={(v) => `${v.toFixed(1)}%`}
              stroke="#ccc"
              width={60}
            />
            <Tooltip
              formatter={(value: number) => `${value.toFixed(2)}%`}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />

            <Line
              type="monotone"
              dataKey="PriceChange"
              stroke="#4f8bff"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Price Change"
            />
            <Line
              type="monotone"
              dataKey="SalesRevision"
              stroke="#f39c12"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Sales Revision"
            />
            <Line
              type="monotone"
              dataKey="EBITDARevision"
              stroke="#2ecc71"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="EBITDA Revision"
            />
          </LineChart>
        </ResponsiveContainer>
      </ClientOnly>
    </div>
  );
}
