"use client";

import { useRef, useState } from "react";
import { Renderer } from "./renderer";
import { Tooltip } from "./tooltip";
import { useDimensions } from "@/hooks/useDimensions";

type HeatmapProps = {
  width?: number;
  height?: number;
  data: { x: string; y: string; value: number }[];
  colors: {
    min: string;
    max: string;
  };
};

export type InteractionData = {
  xLabel: string;
  yLabel: string;
  xPos: number;
  yPos: number;
  value: number;
};

export const Heatmap = ({ width, height, data, colors }: HeatmapProps) => {
  const [hoveredCell, setHoveredCell] = useState<InteractionData | null>(null);

  const targetRef = useRef<HTMLDivElement>(null);

  const dimensions = useDimensions(targetRef);

  const w = width ?? dimensions.width;
  const h = height ?? dimensions.height;

  return (
    <div className="relative w-full h-full" ref={targetRef}>
      <Renderer
        width={w}
        height={h}
        data={data}
        setHoveredCell={setHoveredCell}
        colors={colors}
      />
      <Tooltip interactionData={hoveredCell} width={w} height={h} />
    </div>
  );
};
