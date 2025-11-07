export const runtime = "nodejs";

import * as XLSX from "xlsx";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(req: Request) {
    try {
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
        const data = XLSX.utils.sheet_to_json(worksheet, { defval: null });

        // Extract unique sectors
        const sectorsSet = new Set<string>();
        data.forEach((row: any) => {
            if (row.Sector && typeof row.Sector === "string") {
                sectorsSet.add(row.Sector.trim());
            }
        });

        const sectors = Array.from(sectorsSet).sort();

        return NextResponse.json({
            total: sectors.length,
            sectors,
        });
    } catch (err: any) {
        console.error("❌ Error reading sectors from Excel:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

