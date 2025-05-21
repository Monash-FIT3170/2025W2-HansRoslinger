"use client";
import React, { useEffect, useRef, useState } from "react";
import { UploadProp } from "types/application";
import embed from "vega-embed";

type VegaLiteChartDisplayProp = {
  data: UploadProp;
};

const VegaLiteChartDisplay = ({ data }: VegaLiteChartDisplayProp) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
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
        jsonData.encoding.tooltip = null
        jsonData.mark.tooltip = null

        if (chartRef.current) {
          embed(chartRef.current, jsonData, {
            actions: false, // disables the action menu
          });
        }
      })
      .catch((error) => {
        setError(true);
        console.log("Fail to fetch or load json data", error);
      });
  }, [data.src]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {error ? (
        <div className="text-red-600 text-center w-full max-w-md">
          <p className="text-sm font-semibold">Failed to load</p>
          <p className="text-xs mt-1">
            Please check the data source or try again later.
          </p>
        </div>
      ) : (
        <div ref={chartRef} className="w-full h-full" />
      )}
    </div>
  );
};

export default VegaLiteChartDisplay;
