"use client";

import React, { useMemo } from "react";
import { Treemap, Tooltip, ResponsiveContainer } from "recharts";
import ClientOnly from "../client-only";
import { useQuery } from "@tanstack/react-query";
import { fetchSheetData, SheetQueryParams, SheetRow } from "@/lib/fetchSheetData";
import SkeletonTable from "@/components/skeleton/SkeletonTable";
import { TabId } from "../heatmap/tabs";
import { subWeeks, subMonths, subQuarters, subYears, format } from "date-fns";


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

type TreemapItem = {
    name: string;
    fullName: string;
    size: number;
    change: number;
    fill: string;
};

interface MarketHeatmapProps {
    selectedSector: string;
    selectedPeriod: string;
    selectedTab: TabId;
}

export default function MarketHeatmap({
    selectedSector,
    selectedPeriod,
    selectedTab,
}: MarketHeatmapProps) {
    // Dynamic date range
    const { startDate, endDate } = useMemo(
        () => getDateRange(selectedPeriod),
        [selectedPeriod]
    );

    // Filters for API
    const filters = useMemo<SheetQueryParams>(
        () => ({
            tab: selectedTab,
            sector: selectedSector,
            startDate,
            endDate,
        }),
        [selectedSector, selectedTab, startDate, endDate]
    );

    const { data: sheetData, isLoading: sheetLoading, isError } = useQuery({
        queryKey: ["sheetData", filters],
        queryFn: fetchSheetData,
    });

    // --- Map API result to treemap-friendly format
    const treemapData: TreemapItem[] = useMemo(() => {
        if (!sheetData?.data || sheetData.data.length === 0) return [];

        return sheetData.data.map((row: SheetRow) => {
            const fromVal = parseFloat(String(row.FromValue ?? 0)) || 0;
            const toVal = parseFloat(String(row.ToValue ?? 0)) || 0;

            // Safe calculation (no divide by zero)
            let change = 0;
            if (fromVal !== 0) {
                change = ((toVal - fromVal) / fromVal) * 100;
            }

            // Prefer MarketCap returned by the API; fallback to absolute change magnitude
            const marketCap = Number(row.MarketCap ?? 0) || 0;
            const size = marketCap > 0 ? marketCap : Math.abs(change);

            return {
                name: String(row.Symbol || ""),
                fullName: String(row.Name || ""),
                size,
                change,
                // keep color scheme but also allow shade mapping in future
                fill: change >= 0 ? "#657fe7ff" : "#10012cff",
            };
        });
    }, [sheetData]);

    if (sheetLoading) return <SkeletonTable />;
    if (isError) return <p className="text-red-500">Failed to load data</p>;

    return (
        <div className="relative w-full h-80 p-2 rounded-lg bg-white/5">
            <ClientOnly>
                <ResponsiveContainer>
                    <Treemap
                        data={treemapData}
                        dataKey="size"
                        stroke="#fff"
                        animationDuration={800}
                        content={(props) => {
                            const { x, y, width, height, name } = props;
                            const payload = props as unknown as TreemapItem;
                            const fill = payload.fill;
                            return (
                                <g>
                                    <rect x={x} y={y} width={width} height={height} fill={fill} />
                                    {width > 40 && height > 40 && (
                                        <>
                                            <text
                                                x={x + width / 2}
                                                y={y + height / 2 - 6}
                                                dominantBaseline="middle"
                                                textAnchor="middle"
                                                fill="white"
                                                fontSize={16}
                                                fontWeight="500"
                                            >
                                                {name}
                                            </text>
                                            <text
                                                x={x + width / 2}
                                                y={y + height / 2 + 12}
                                                dominantBaseline="middle"
                                                textAnchor="middle"
                                                fill="white"
                                                fontSize={12}
                                            >
                                                {payload.change?.toFixed(1) ?? 0}%
                                            </text>
                                        </>
                                    )}
                                </g>
                            );
                        }}
                    >
                        <Tooltip
                            formatter={(value, name, entry) => {
                                const item = entry as unknown as { payload: TreemapItem };
                                return [
                                    `${item.payload.fullName}: ${item.payload.change.toFixed(2)}%`,
                                ];
                            }}
                        />
                    </Treemap>
                </ResponsiveContainer>
            </ClientOnly>
        </div>
    );
}
