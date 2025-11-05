"use client"

export default function HeatmapGrid() {
  const metrics = ["Price Change", "Sales Revision", "Sales Multiple", "EBITDA Revision", "EBITDA Multiple"]
  const rows = 7

  const heatmapData = [
    [null, null, null, null, null],
    [11, null, null, null, null],
    [11, null, null, null, null],
    [11, null, null, 11, null],
    [11, null, null, null, null],
    [11, null, 11, null, 11],
    [11, null, null, null, 11],
  ]

  const getColor = (value: number | null) => {
    if (value === null) return "bg-muted"
    return "bg-primary/30"
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Large Cap Metrics</h3>

      <div className="space-y-2">
        <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
          {metrics.map((metric) => (
            <div key={metric} className="text-xs font-medium text-muted-foreground text-center py-2">
              {metric}
            </div>
          ))}
        </div>

        <div className="space-y-1">
          {heatmapData.map((row, rowIdx) => (
            <div key={rowIdx} className="grid gap-1" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
              {row.map((value, colIdx) => (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  className={`h-12 rounded border border-border flex items-center justify-center text-xs font-medium transition-colors hover:opacity-80 ${getColor(value)}`}
                >
                  {value !== null && <span className="text-foreground">{value}%</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
