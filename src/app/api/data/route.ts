export const runtime = "nodejs";

import * as XLSX from "xlsx";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const tab = searchParams.get("tab"); // frontend TabId
        const sector = searchParams.get("sector");
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        // 🧭 TabId → Sheet mapping
        const tabMap: Record<string, string> = {
            Price_Change: "Price",
            Sales_Revision: "Sales",
            Sales_Multiple: "SalesMultiple",
            EBITDA_Revision: "EBITDA",
            EBITDA_Multiple: "EBITDAMultiple",
        };

        const tabVal = tab ?? "";
        const sheetName = (tabVal && (tabMap[tabVal as keyof typeof tabMap] || tabVal)) || "";

        const filePath = path.join(process.cwd(), "public", "data.xlsx");
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: "Excel file not found" }, { status: 404 });
        }

        const workbook = XLSX.read(fs.readFileSync(filePath), { type: "buffer" });

        if (!workbook.SheetNames.includes(sheetName)) {
            return NextResponse.json(
                { error: `Sheet '${sheetName}' not found`, available: workbook.SheetNames },
                { status: 400 }
            );
        }

        const worksheet = workbook.Sheets[sheetName];
        let data = XLSX.utils.sheet_to_json(worksheet, { defval: null });

        if (sector) {
            data = data.filter((row: any) => row.Sector?.toLowerCase() === sector.toLowerCase());
        }

        const allColumns = Object.keys(data[0] || {});
        const dateColumns = allColumns.filter((col) => /^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(col));

        const parseMDY = (s: string): Date => {
            const [m, d, y] = s.split("/").map(Number);
            // Handle 2-digit years: 00-99 → 2000-2099
            const fullYear = y < 100 ? 2000 + y : y;
            return new Date(fullYear, m - 1, d);
        };

        dateColumns.sort((a, b) => parseMDY(a).getTime() - parseMDY(b).getTime());

        let fromKey = dateColumns[0];
        let toKey = dateColumns[dateColumns.length - 1];

        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            
            // Reset time for accurate comparison
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            
            const included = dateColumns.filter((col) => {
                const d = parseMDY(col);
                d.setHours(0, 0, 0, 0);
                return d >= start && d <= end;
            });
            if (included.length >= 2) {
                fromKey = included[0];
                toKey = included[included.length - 1];
            }
        }

        const result = data.map((row: any) => {
            const fromVal = Number(row[fromKey] ?? 0);
            const toVal = Number(row[toKey] ?? 0);
            const mktCap = Number(row["Mkt Cap"] ?? 0);
            const sales = Number(row["Sales"] ?? 0);
            const ebitda = Number(row["EBITDA"] ?? 0);
            let change = 0;

            switch (sheetName) {
                case "Price":
                    change = fromVal === 0 ? 0 : ((toVal - fromVal) / fromVal) * 100;
                    break;

                case "Sales":
                    change = fromVal === 0 ? 0 : ((toVal - fromVal) / fromVal) * 100;
                    break;

                case "EBITDA":
                    change = fromVal === 0 ? 0 : ((toVal - fromVal) / fromVal) * 100;
                    break;

                case "SalesMultiple":
                    change = sales === 0 ? 0 : mktCap / sales;
                    break;

                case "EBITDAMultiple":
                    change = ebitda === 0 ? 0 : mktCap / ebitda;
                    break;
            }

            return {
                Symbol: row["Symbol"],
                Name: row["Name"],
                Sector: row["Sector"],
                MarketCap: mktCap,
                FromDate: fromKey,
                ToDate: toKey,
                FromValue: fromVal,
                ToValue: toVal,
                Change: change,
            };
        });

        return NextResponse.json({
            tab: sheetName,
            sector: sector || "All",
            from: fromKey,
            to: toKey,
            total: result.length,
            data: result,
        });
    } catch (err: any) {
        console.error("❌ Error reading Excel:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
