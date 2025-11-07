export const runtime = "nodejs";

import * as XLSX from "xlsx";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

interface PriceDataPoint {
    date: string;
    avgPrice: number;
    count: number;
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const sector = searchParams.get("sector");
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        const filePath = path.join(process.cwd(), "public", "data.xlsx");
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: "Excel file not found" }, { status: 404 });
        }

        const workbook = XLSX.read(fs.readFileSync(filePath), { type: "buffer" });
        const sheetName = "Price";

        if (!workbook.SheetNames.includes(sheetName)) {
            return NextResponse.json(
                { error: `Sheet '${sheetName}' not found`, available: workbook.SheetNames },
                { status: 400 }
            );
        }

        const worksheet = workbook.Sheets[sheetName];
        let data = XLSX.utils.sheet_to_json(worksheet, { defval: null });

        // Filter by sector if provided
        if (sector && sector !== "All Sectors") {
            data = data.filter((row: any) => row.Sector?.toLowerCase() === sector.toLowerCase());
        }

        // Get all date columns (format: M/D/YYYY or MM/DD/YYYY)
        const allColumns = Object.keys(data[0] || {});
        const dateColumns = allColumns.filter((col) => /^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(col));

        // Parse date helper (M/D/YY or M/D/YYYY → Date object)
        const parseMDY = (s: string) => {
            const [m, d, y] = s.split("/").map(Number);
            // Handle 2-digit years: 00-99 → 2000-2099
            const fullYear = y < 100 ? 2000 + y : y;
            return new Date(fullYear, m - 1, d);
        };

        // Sort date columns chronologically
        const sortedDateCols = dateColumns.sort((a, b) => {
            const dateA = parseMDY(a);
            const dateB = parseMDY(b);
            return dateA.getTime() - dateB.getTime();
        });

        // Filter by date range if provided
        let filteredDateCols = sortedDateCols;
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            
            // Reset time to start of day for accurate comparison
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            
            filteredDateCols = sortedDateCols.filter((col) => {
                const colDate = parseMDY(col);
                colDate.setHours(0, 0, 0, 0);
                return colDate >= start && colDate <= end;
            });
        }

        // If no dates match the filter, return empty
        if (filteredDateCols.length === 0) {
            return NextResponse.json({
                sector: sector || "All Sectors",
                startDate: startDate,
                endDate: endDate,
                dataPoints: 0,
                data: [],
                message: "No data found in the specified date range",
            });
        }

        // Calculate average prices for each date across all companies in the sector
        const priceData: PriceDataPoint[] = filteredDateCols.map((dateCol) => {
            let sum = 0;
            let count = 0;

            data.forEach((row: any) => {
                const val = Number(row[dateCol]);
                if (!isNaN(val) && val !== 0) {
                    sum += val;
                    count++;
                }
            });

            return {
                date: dateCol,
                avgPrice: count > 0 ? sum / count : 0,
                count,
            };
        });

        // Calculate percentage changes from first data point (for Price Change line)
        const basePrice = priceData[0]?.avgPrice || 0;
        const priceChanges = priceData.map((point) => {
            const change = basePrice !== 0 ? ((point.avgPrice - basePrice) / basePrice) * 100 : 0;
            return {
                date: point.date,
                priceChange: change,
                absolutePrice: point.avgPrice,
            };
        });

        // Calculate trend line (linear regression)
        const n = priceChanges.length;
        let sumX = 0;
        let sumY = 0;
        let sumXY = 0;
        let sumX2 = 0;

        priceChanges.forEach((point, index) => {
            sumX += index;
            sumY += point.priceChange;
            sumXY += index * point.priceChange;
            sumX2 += index * index;
        });

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // Generate trend line values
        const trendLineData = priceChanges.map((point, index) => ({
            date: point.date,
            trendValue: slope * index + intercept,
        }));

        // Combine all data
        const chartData = priceChanges.map((point, index) => ({
            date: point.date,
            priceChange: point.priceChange,
            fundamentalAbsolute: point.priceChange, // For now, same as price change (will be updated with formula)
            trendLine: trendLineData[index].trendValue,
            absolutePrice: point.absolutePrice,
        }));

        return NextResponse.json({
            sector: sector || "All Sectors",
            startDate: filteredDateCols[0] || null,
            endDate: filteredDateCols[filteredDateCols.length - 1] || null,
            dataPoints: chartData.length,
            data: chartData,
        });
    } catch (err: any) {
        console.error("❌ Error reading Excel for line chart:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

