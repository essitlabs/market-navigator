export const runtime = "nodejs";

import * as XLSX from "xlsx";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

interface CompanyRevisionData {
    Symbol: string;
    Name: string;
    Sector: string;
    MarketCap: number;
    
    // Price data
    PriceChange: number;
    
    // Sales data
    SalesNTMChange: number;
    SalesLTermChange: number;
    SalesNTMvsLTerm: number;
    SalesMultipleChange: number;
    
    // EBITDA data
    EBITDANTMChange: number;
    EBITDALTermChange: number;
    EBITDANTMvsLTerm: number;
    EBITDAMultipleChange: number;
    
    // Trend calculations
    SalesTrend: number;
    EBITDATrend: number;
    PriceTrend: number;
    
    // Trend changes
    SalesTrendChange: number;
    EBITDATrendChange: number;
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

        // Read all three sheets
        const sheets = ["Price", "Sales", "EBITDA"];
        const sheetData: Record<string, any[]> = {};

        for (const sheetName of sheets) {
            if (!workbook.SheetNames.includes(sheetName)) {
                return NextResponse.json(
                    { error: `Sheet '${sheetName}' not found` },
                    { status: 400 }
                );
            }

            const worksheet = workbook.Sheets[sheetName];
            let data = XLSX.utils.sheet_to_json(worksheet, { defval: null });

            // Filter by sector
            if (sector && sector !== "All Sectors") {
                data = data.filter((row: any) => 
                    row.Sector?.toLowerCase() === sector.toLowerCase()
                );
            }

            sheetData[sheetName] = data;
        }

        // Helper: Parse date (M/D/YY or M/D/YYYY → Date object)
        const parseMDY = (s: string): Date => {
            const trimmed = s.trim(); // Remove leading/trailing spaces
            const [m, d, y] = trimmed.split("/").map(Number);
            const fullYear = y < 100 ? 2000 + y : y;
            return new Date(fullYear, m - 1, d);
        };

        // Get date columns from first sheet
        const allColumns = Object.keys(sheetData["Price"][0] || {});
        // Date columns might have spaces - trim them
        const dateColumns = allColumns.filter((col) => 
            /^\s*\d{1,2}\/\d{1,2}\/\d{2,4}\s*$/.test(col)
        );

        // Sort dates chronologically
        const sortedDateCols = dateColumns.sort((a, b) => 
            parseMDY(a).getTime() - parseMDY(b).getTime()
        );

        // Filter by date range
        let filteredDateCols = sortedDateCols;
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);

            filteredDateCols = sortedDateCols.filter((col) => {
                const d = parseMDY(col);
                d.setHours(0, 0, 0, 0);
                return d >= start && d <= end;
            });
        }

        if (filteredDateCols.length < 2) {
            return NextResponse.json({
                sector: sector || "All Sectors",
                message: "Need at least 2 dates for calculations",
                data: [],
            });
        }

        // Get from and to dates
        const fromDate = filteredDateCols[0];
        const toDate = filteredDateCols[filteredDateCols.length - 1];
        
        // For L-Term, use dates further back (e.g., 1/3 point and 2/3 point)
        const midIndex = Math.floor(filteredDateCols.length / 2);
        const oldLTermDate = filteredDateCols[Math.floor(midIndex / 2)];
        const newLTermDate = filteredDateCols[midIndex];

        // Calculate trend (linear regression slope)
        const calculateTrend = (values: number[]): number => {
            const n = values.length;
            if (n < 3) return 0;

            let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
            
            values.forEach((val, idx) => {
                sumX += idx;
                sumY += val;
                sumXY += idx * val;
                sumX2 += idx * idx;
            });

            const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
            return isNaN(slope) ? 0 : slope;
        };

        // Process each company
        const results: CompanyRevisionData[] = sheetData["Price"].map((priceRow: any) => {
            const symbol = priceRow["Symbol"];
            
            // Find matching rows in other sheets
            const salesRow = sheetData["Sales"].find((r: any) => r["Symbol"] === symbol);
            const ebitdaRow = sheetData["EBITDA"].find((r: any) => r["Symbol"] === symbol);

            // Price calculations
            const oldPrice = Number(priceRow[fromDate] ?? 0);
            const newPrice = Number(priceRow[toDate] ?? 0);
            const priceChange = oldPrice === 0 ? 0 : 
                ((newPrice - oldPrice) / oldPrice) * 100;

            // Sales NTM calculations
            const oldSalesNTM = Number(salesRow?.[fromDate] ?? 0);
            const newSalesNTM = Number(salesRow?.[toDate] ?? 0);
            const salesNTMChange = oldSalesNTM === 0 ? 0 : 
                ((newSalesNTM - oldSalesNTM) / oldSalesNTM) * 100;

            // Sales L-Term calculations
            const oldSalesLTerm = Number(salesRow?.[oldLTermDate] ?? 0);
            const newSalesLTerm = Number(salesRow?.[newLTermDate] ?? 0);
            const salesLTermChange = oldSalesLTerm === 0 ? 0 : 
                ((newSalesLTerm - oldSalesLTerm) / oldSalesLTerm) * 100;

            // Sales NTM vs L-Term
            const salesNTMvsLTerm = salesNTMChange - salesLTermChange;

            // EBITDA NTM calculations
            const oldEBITDANTM = Number(ebitdaRow?.[fromDate] ?? 0);
            const newEBITDANTM = Number(ebitdaRow?.[toDate] ?? 0);
            const ebitdaNTMChange = oldEBITDANTM === 0 ? 0 : 
                ((newEBITDANTM - oldEBITDANTM) / oldEBITDANTM) * 100;

            // EBITDA L-Term calculations
            const oldEBITDALTerm = Number(ebitdaRow?.[oldLTermDate] ?? 0);
            const newEBITDALTerm = Number(ebitdaRow?.[newLTermDate] ?? 0);
            const ebitdaLTermChange = oldEBITDALTerm === 0 ? 0 : 
                ((newEBITDALTerm - oldEBITDALTerm) / oldEBITDALTerm) * 100;

            // EBITDA NTM vs L-Term
            const ebitdaNTMvsLTerm = ebitdaNTMChange - ebitdaLTermChange;

            // Multiple calculations  
            // Note: Column names have spaces in the Excel file
            const mktCap = Number(priceRow[" Mkt Cap "] ?? priceRow["Mkt Cap"] ?? 0);
            const sales = Number(salesRow?.[" Sales "] ?? salesRow?.["Sales"] ?? 0);
            const ebitda = Number(ebitdaRow?.[" EBITDA "] ?? ebitdaRow?.["EBITDA"] ?? 0);
            
            const oldSalesMultiple = oldSalesNTM === 0 ? 0 : mktCap / oldSalesNTM;
            const newSalesMultiple = newSalesNTM === 0 ? 0 : mktCap / newSalesNTM;
            const salesMultipleChange = oldSalesMultiple === 0 ? 0 : 
                ((newSalesMultiple - oldSalesMultiple) / oldSalesMultiple) * 100;

            const oldEBITDAMultiple = oldEBITDANTM === 0 ? 0 : mktCap / oldEBITDANTM;
            const newEBITDAMultiple = newEBITDANTM === 0 ? 0 : mktCap / newEBITDANTM;
            const ebitdaMultipleChange = oldEBITDAMultiple === 0 ? 0 : 
                ((newEBITDAMultiple - oldEBITDAMultiple) / oldEBITDAMultiple) * 100;

            // Trend calculations (using all values in date range)
            const priceValues = filteredDateCols.map(date => Number(priceRow[date] ?? 0));
            const salesValues = filteredDateCols.map(date => Number(salesRow?.[date] ?? 0));
            const ebitdaValues = filteredDateCols.map(date => Number(ebitdaRow?.[date] ?? 0));

            const priceTrend = calculateTrend(priceValues);
            const salesTrend = calculateTrend(salesValues);
            const ebitdaTrend = calculateTrend(ebitdaValues);

            // Trend change (compare first half vs second half trend)
            const halfPoint = Math.floor(filteredDateCols.length / 2);
            const firstHalfSales = filteredDateCols.slice(0, halfPoint).map(d => Number(salesRow?.[d] ?? 0));
            const secondHalfSales = filteredDateCols.slice(halfPoint).map(d => Number(salesRow?.[d] ?? 0));
            const salesTrendChange = calculateTrend(secondHalfSales) - calculateTrend(firstHalfSales);

            const firstHalfEBITDA = filteredDateCols.slice(0, halfPoint).map(d => Number(ebitdaRow?.[d] ?? 0));
            const secondHalfEBITDA = filteredDateCols.slice(halfPoint).map(d => Number(ebitdaRow?.[d] ?? 0));
            const ebitdaTrendChange = calculateTrend(secondHalfEBITDA) - calculateTrend(firstHalfEBITDA);

            return {
                Symbol: symbol,
                Name: priceRow["Name"] || "",
                Sector: priceRow["Sector"] || "",
                MarketCap: mktCap,
                
                PriceChange: priceChange,
                
                SalesNTMChange: salesNTMChange,
                SalesLTermChange: salesLTermChange,
                SalesNTMvsLTerm: salesNTMvsLTerm,
                SalesMultipleChange: salesMultipleChange,
                
                EBITDANTMChange: ebitdaNTMChange,
                EBITDALTermChange: ebitdaLTermChange,
                EBITDANTMvsLTerm: ebitdaNTMvsLTerm,
                EBITDAMultipleChange: ebitdaMultipleChange,
                
                SalesTrend: salesTrend,
                EBITDATrend: ebitdaTrend,
                PriceTrend: priceTrend,
                
                SalesTrendChange: salesTrendChange,
                EBITDATrendChange: ebitdaTrendChange,
            };
        });

        // Sort by Market Cap (descending) and take top 10
        const validResults = results.filter(r => r.MarketCap > 0);
        const top10 = validResults
            .sort((a, b) => b.MarketCap - a.MarketCap)
            .slice(0, 10);

        return NextResponse.json({
            sector: sector || "All Sectors",
            fromDate,
            toDate,
            total: top10.length,
            data: top10,
        });

    } catch (err: any) {
        console.error("❌ Error in revisions API:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

