"use client";
import embed from "vega-embed";
import { useEffect, useRef } from "react";
import { useVisualStore } from "store/visualsSlice";

type VegaLiteVisualProp = {
  id: string;
};

const VegaLiteVisual = ({ id }: VegaLiteVisualProp) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const visual = useVisualStore((state) => state.getVisual(id));

  const position = visual ? visual.position : { x: 0, y: 0 };
  const setVisualSize = useVisualStore((state) => state.setVisualSize);
  const setUseOriginalSizeOnLoad = useVisualStore(
    (state) => state.setUseOriginalSizeOnLoad,
  );
  const size = visual?.size;

  const renderChart = () => {
    if (!visual || !chartRef) return;
    fetch(visual.uploadData.src)
      .then((res) => res.json())
      .then((jsonData) => {
        // WIll fit into div, if div change size, chart will follow
        jsonData.autosize = {
          type: "fit",
          contains: "padding",
        };
        // If not use original size, set size to use stored size
        if (!visual.useOriginalSizeOnLoad && size) {
          jsonData.width = size.width;
          jsonData.height = size.height;
        }

        if (chartRef.current) {
          // embed vegalite into div
          embed(chartRef.current, jsonData, {
            actions: false,
            tooltip: true,
            renderer: "canvas",
          }).then(() => {
            // Get Vega chart bounding box
            const viewEl = chartRef.current?.querySelector("canvas");

            if (viewEl) {
              const bounds = viewEl.getBoundingClientRect();

              // On first load, need to use size define in json file
              if (visual.useOriginalSizeOnLoad) {
                setVisualSize(id, {
                  width: bounds.width,
                  height: bounds.height,
                });
                setUseOriginalSizeOnLoad(id, false);
              }
            }
          });
        }
      });
  };

  // Initial render
  useEffect(() => {
    renderChart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Render when size updates
  useEffect(() => {
    if (visual && !visual.useOriginalSizeOnLoad) {
      renderChart();
    }
    // don't want it to re-render when position change, only when size change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, visual?.useOriginalSizeOnLoad]);

  return (
    <div
      id={id}
      className={
        visual?.isHovered ? "outline-5 outline-offset-0 outline-green-500" : ""
      }
      ref={chartRef}
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        ...(size ? { width: size.width, height: size.height } : {}),
        pointerEvents: "auto",
        zIndex: 10,
      }}
    />
  );
};

export default VegaLiteVisual;
