"use client"

import { useMemo } from "react"
import { useRevisionsData } from "@/hooks/useRevisionsData"
import { subWeeks, subMonths, subQuarters, subYears, format } from "date-fns"

// Helper: Get date range
function getDateRange(period: string) {
  const end = new Date("2025-09-19"); // Last date in Excel
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

interface RevisionsTableProps {
  selectedSector: string;
  selectedPeriod: string;
}

export default function RevisionsTable({ selectedSector, selectedPeriod }: RevisionsTableProps) {
  const { startDate, endDate } = useMemo(
    () => getDateRange(selectedPeriod),
    [selectedPeriod]
  );

  const { data: revisionsData, isLoading, isError } = useRevisionsData({
    sector: selectedSector,
    startDate,
    endDate,
  });

  // Format number as percentage
  const formatPercent = (value: number) => {
    const formatted = value.toFixed(2);
    return value >= 0 ? `+${formatted}%` : `${formatted}%`;
  };

  // Get trend direction text
  const getTrendDirection = (trendValue: number) => {
    if (trendValue > 0.1) return "↑ Upward";
    if (trendValue < -0.1) return "↓ Downward";
    return "→ Flat";
  };

  // Get trend change text
  const getTrendChange = (changeValue: number) => {
    if (changeValue > 0.1) return "Strengthening";
    if (changeValue < -0.1) return "Weakening";
    return "Unchanged";
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading revisions data...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-destructive">Failed to load revisions data</div>
        </div>
      </div>
    );
  }

  const tableData = revisionsData?.data || [];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Top 10 Companies by Market Cap - {selectedSector}
        </h3>
        <div className="text-sm text-muted-foreground">
          Period: {selectedPeriod}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-center py-3 px-3 font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 sticky left-0">
                Company Name
              </th>
              <th className="text-center py-3 px-3 font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <div className="leading-tight">
                  <div>Price%</div>
                  <div>Change</div>
                </div>
              </th>
              <th className="text-center py-3 px-3 font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <div className="leading-tight">
                  <div>Sales NTM%</div>
                  <div>Change</div>
                </div>
              </th>
              <th className="text-center py-3 px-3 font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <div className="leading-tight">
                  <div>EBITDA NTM%</div>
                  <div>Change</div>
                </div>
              </th>
              <th className="text-center py-3 px-3 font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <div className="leading-tight">
                  <div>Sales NTM%</div>
                  <div>Chg vs. L-</div>
                  <div>Term</div>
                </div>
              </th>
              <th className="text-center py-3 px-3 font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <div className="leading-tight">
                  <div>EBITDA NTM%</div>
                  <div>chg vs. L-</div>
                  <div>Term</div>
                </div>
              </th>
              <th className="text-center py-3 px-3 font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <div className="leading-tight">
                  <div>Sales</div>
                  <div>Multiple%</div>
                  <div>Change</div>
                </div>
              </th>
              <th className="text-center py-3 px-3 font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <div className="leading-tight">
                  <div>EBITDA</div>
                  <div>Multiple %</div>
                  <div>Change</div>
                </div>
              </th>
              <th className="text-center py-3 px-3 font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                Trend
              </th>
              <th className="text-center py-3 px-3 font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <div className="leading-tight">
                  <div>Trend Change</div>
                  <div>or Mean</div>
                  <div>revert</div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 px-4 text-center text-muted-foreground">
                  No data available for selected filters
                </td>
              </tr>
            ) : (
              tableData.map((row, idx) => (
                <tr key={row.Symbol} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-3 text-center font-medium text-foreground sticky left-0 bg-card">
                    {row.Symbol}
                  </td>
                  <td className={`py-3 px-3 text-center ${row.PriceChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatPercent(row.PriceChange)}
                  </td>
                  <td className={`py-3 px-3 text-center ${row.SalesNTMChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatPercent(row.SalesNTMChange)}
                  </td>
                  <td className={`py-3 px-3 text-center ${row.EBITDANTMChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatPercent(row.EBITDANTMChange)}
                  </td>
                  <td className={`py-3 px-3 text-center ${row.SalesNTMvsLTerm >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatPercent(row.SalesNTMvsLTerm)}
                  </td>
                  <td className={`py-3 px-3 text-center ${row.EBITDANTMvsLTerm >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatPercent(row.EBITDANTMvsLTerm)}
                  </td>
                  <td className={`py-3 px-3 text-center ${row.SalesMultipleChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatPercent(row.SalesMultipleChange)}
                  </td>
                  <td className={`py-3 px-3 text-center ${row.EBITDAMultipleChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatPercent(row.EBITDAMultipleChange)}
                  </td>
                  <td className="py-3 px-3 text-center text-muted-foreground">
                    {getTrendDirection(row.SalesTrend)}
                  </td>
                  <td className="py-3 px-3 text-center text-muted-foreground">
                    {getTrendChange(row.SalesTrendChange)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
