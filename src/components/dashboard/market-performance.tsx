"use client";

import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import chartSeries from "@/lib/chart-data";
import { HeatmapTabs, TabId } from "../charts/heatmap/tabs";

import MarketHeatmap from "../charts/marketcap";
import MarketFundamentalsChart from "../charts/line-chart";

const sectors = [
  "Business Services",
  "Tele-communication",
  "Technology",
  "Healthcare",
  "Finance",
  "Energy",
];
const methods = ["Absolute Revision", "Relative Revision", "Price Target"];
const periods = ["Last week", "Last month", "Last quarter", "Last year"];

interface MarketPerformanceProps {
  selectedSector: string;

  onSectorChange: (sector: string) => void;
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

type Timeframe = "monthly" | "weekly";

export default function MarketPerformance({
  selectedSector,
  selectedPeriod,
  onSectorChange,
  onMethodChange,
  onPeriodChange,
}: MarketPerformanceProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>("monthly");
  const [activeTab, setActiveTab] = useState<TabId>(TabId.Price_Change);

  const [cursorPosition, setCursorPosition] = useState<number | null>(null);


  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Market Performance Snapshot
        </h2>

        <div className="flex gap-3 flex-wrap mb-6">
          <div className="flex max-w-sm items-center gap-1">
            <Label htmlFor="picture">Sector</Label>
            <Select
              defaultValue={sectors[0]}
              onValueChange={(value) => onSectorChange(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex max-w-sm items-center gap-1">
            <Label htmlFor="picture">Method</Label>
            <Select
              defaultValue={methods[0]}
              onValueChange={(value) => onMethodChange(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                {methods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex max-w-sm items-center gap-1">
            <Label htmlFor="picture">Period</Label>
            <Select
              defaultValue={periods[0]}
              onValueChange={(value) => onPeriodChange(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period} value={period}>
                    {period}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-card rounded-lg border border-border p-6 w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Market Price vs. Fundamentals
            </h3>

            <Select
              defaultValue="monthly"
              onValueChange={(value: Timeframe) => setTimeframe(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full h-80">
            <MarketFundamentalsChart
              sector={selectedSector}
              startDate={selectedPeriod.startDate}
              endDate={selectedPeriod.endDate}
            />
          </div>
        </div>

        <div className="lg:col-span-5 bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-2 pr-2.5">
            <HeatmapTabs
              activeTab={activeTab}
              onTabChange={(tab) => setActiveTab(tab)}
            />
          </div>

          <div className="w-full h-80">
            <MarketHeatmap selectedTab={activeTab} selectedSector={selectedSector} selectedPeriod={selectedPeriod} />
          </div>
        </div>
      </div>
    </div>
  );
}
