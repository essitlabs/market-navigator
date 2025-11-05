"use client";

import { motion } from "motion/react";

export enum TabId {
  Price_Change = "Price_Change",
  Sales_Revision = "Sales_Revision",
  Sales_Multiple = "Sales_Multiple",
  EBITDA_Revision = "EBITDA_Revision",
  EBITDA_Multiple = "EBITDA_Multiple",
}

const tabs = [
  { id: TabId.Price_Change, label: "Price Change" },
  { id: TabId.Sales_Revision, label: "Sales Revision" },
  { id: TabId.Sales_Multiple, label: "Sales Multiple" },
  { id: TabId.EBITDA_Revision, label: "EBITDA Revision" },
  { id: TabId.EBITDA_Multiple, label: "EBITDA Multiple" },
];

type HeatmapTabsProps = {
  activeTab: TabId;
  onTabChange: (id: TabId) => void;
};

export const HeatmapTabs = ({
  activeTab,
  onTabChange,
}: HeatmapTabsProps) => {
  return (
    <div role="tablist" className="flex gap-2">
      {tabs.map((item) => (
        <div key={item.id} className="relative flex-1">
          <button
            role="tab"
            aria-selected={item.id === activeTab}
            onClick={() => onTabChange(item.id)}
            className={`w-full p-2 text-sm rounded ${item.id === activeTab ? "bg-muted/80 font-medium" : "bg-muted"
              }`}
          >
            {item.label}
          </button>

          {item.id === activeTab ? (
            <motion.div
              layoutId="underline"
              className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-blue-600"
            />
          ) : null}
        </div>
      ))}
    </div>
  );
};
