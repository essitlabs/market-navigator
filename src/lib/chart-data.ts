import * as d3 from "d3";

export type DataPoint = { x: Date; y: number };
export type Series = { id: string; color: string; data: DataPoint[] };

/**
 * Generates a 3-month dataset with 7 data points per day.
 * - Includes price and fundamental_trend
 * - Adds time to the date (03:00, 06:00, ..., 21:00)
 */
function generateDataset(startDateStr: string, endDateStr: string) {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const rows: { date: string; fundamental_trend: number; price: number }[] = [];

  const base = 1000;
  let trend = base;
  let price = base;

  // 7 time points per day (in 3-hour intervals)
  const times = [3, 6, 9, 12, 15, 18, 21];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    for (const hour of times) {
      const current = new Date(d);
      current.setHours(hour, 0, 0, 0);

      // small smooth drift in trend (±0.15%)
      trend += trend * (Math.random() * 0.003 - 0.0015);

      // price fluctuates more around trend (±0.7%)
      price = trend + trend * (Math.random() * 0.014 - 0.007);

      rows.push({
        date: current.toISOString().slice(0, 16), // e.g. "2025-10-01T09:00"
        fundamental_trend: +trend.toFixed(2),
        price: +price.toFixed(2),
      });
    }
  }

  return rows;
}

// Generate rows spanning 3 months
const rows = generateDataset("2025-10-01", "2025-12-31");

// Parse the date string with D3
const parseDate = d3.timeParse("%Y-%m-%dT%H:%M");

// Build D3-compatible chart series
export const chartSeries: Series[] = [
  {
    id: "price",
    color: "#008d9a",
    data: rows.map((r) => ({
      x: parseDate(r.date) ?? new Date(),
      y: r.price,
    })),
  },
  {
    id: "fundamental_trend",
    color: "#004985",
    data: rows.map((r) => ({
      x: parseDate(r.date) ?? new Date(),
      y: r.fundamental_trend,
    })),
  },
];

export default chartSeries;
