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
    fetch(data.src)
      .then((res) => res.json())
      .then((jsonData) => {
        // Add format for thumbnail
        jsonData.autosize = {
          type: "fit",
          contain: "padding",
        };
        jsonData.width = "container"; // Makes it fits to the container
        jsonData.height = "container";
        jsonData.padding = 0;
        jsonData.encoding.x.axis = {
          labelAngle: -45,
          labelFontSize: 8,
          title: null,
        };
        jsonData.encoding.y.axis = {
          title: null,
          labelFontSize: 8,
        };

        if (chartRef.current) {
          embed(chartRef.current, jsonData, {
            actions: false, // disables the action menu
          });
        }
      });
  }, [data.src]);

  return (
    <div className="w-full h-full">
      <div ref={chartRef} className="w-full h-full" />
    </div>
  );
};

export default VegaLiteChartDisplay;
