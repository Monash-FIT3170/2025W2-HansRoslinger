"use client";
import React, { useEffect, useRef } from "react";
import { UploadProp } from "types/application";
import embed from "vega-embed";

type VegaLiteChartDisplayProp = {
  data: UploadProp;
};

const VegaLiteChartDisplay = ({ data }: VegaLiteChartDisplayProp) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      embed(chartRef.current, data.src, {
        actions: false, // disables the action menu
      });
    }
  }, [data.src]);

  return (
    <div className="w-full h-full">
      <div ref={chartRef} className="w-full h-full" />
    </div>
  );
};

export default VegaLiteChartDisplay;
