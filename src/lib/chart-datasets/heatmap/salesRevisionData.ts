type HeatmapData = { x: string; y: string; value: number }[];

const salesRevisionData: HeatmapData = [
  // Technology
  { x: "A", y: "Technology", value: 0.8 },
  { x: "B", y: "Technology", value: -0.5 },
  { x: "C", y: "Technology", value: 1.1 },
  { x: "D", y: "Technology", value: 0.6 },
  { x: "E", y: "Technology", value: 1.4 },
  { x: "F", y: "Technology", value: -0.2 },
  { x: "G", y: "Technology", value: 0.9 },
  { x: "H", y: "Technology", value: 1.8 },
  { x: "I", y: "Technology", value: -0.1 },
  { x: "J", y: "Technology", value: 0.5 },

  // Financials
  { x: "A", y: "Financials", value: -0.4 },
  { x: "B", y: "Financials", value: 0.3 },
  { x: "C", y: "Financials", value: 0.9 },
  { x: "D", y: "Financials", value: 0.2 },
  { x: "E", y: "Financials", value: -1.0 },
  { x: "F", y: "Financials", value: 0.5 },
  { x: "G", y: "Financials", value: 0.7 },
  { x: "H", y: "Financials", value: 1.3 },
  { x: "I", y: "Financials", value: 0.4 },
  { x: "J", y: "Financials", value: 0.8 },

  // Energy
  { x: "A", y: "Energy", value: 1.2 },
  { x: "B", y: "Energy", value: 0.8 },
  { x: "C", y: "Energy", value: -0.3 },
  { x: "D", y: "Energy", value: 0.5 },
  { x: "E", y: "Energy", value: 1.1 },
  { x: "F", y: "Energy", value: 0.3 },
  { x: "G", y: "Energy", value: -0.2 },
  { x: "H", y: "Energy", value: 1.7 },
  { x: "I", y: "Energy", value: 0.6 },
  { x: "J", y: "Energy", value: 0.9 },

  // Health Care
  { x: "A", y: "Health Care", value: 0.4 },
  { x: "B", y: "Health Care", value: 0.2 },
  { x: "C", y: "Health Care", value: -0.1 },
  { x: "D", y: "Health Care", value: 0.8 },
  { x: "E", y: "Health Care", value: 0.5 },
  { x: "F", y: "Health Care", value: -0.3 },
  { x: "G", y: "Health Care", value: 0.9 },
  { x: "H", y: "Health Care", value: 1.1 },
  { x: "I", y: "Health Care", value: 0.6 },
  { x: "J", y: "Health Care", value: 0.7 },

  // Consumer
  { x: "A", y: "Consumer", value: 0.2 },
  { x: "B", y: "Consumer", value: -0.6 },
  { x: "C", y: "Consumer", value: 0.3 },
  { x: "D", y: "Consumer", value: 1.1 },
  { x: "E", y: "Consumer", value: 0.8 },
  { x: "F", y: "Consumer", value: 0.1 },
  { x: "G", y: "Consumer", value: 0.5 },
  { x: "H", y: "Consumer", value: 1.0 },
  { x: "I", y: "Consumer", value: -0.2 },
  { x: "J", y: "Consumer", value: 0.9 },
];

export { salesRevisionData };
