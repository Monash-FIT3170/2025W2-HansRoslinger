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

  // Initial render
  useEffect(() => {
    if (!visual || !chartRef) return;
    fetch(visual.uploadData.src)
      .then((res) => res.json())
      .then((jsonData) => {
        // WIll fit into div, if div change size, chart will follow
        jsonData.autosize = {
          type: "fit",
          contains: "padding",
        };
        jsonData.background = null;
        // When not on initial render, set width and height to container
        // This allows vegalite to listen to teh resize event and change the chart width and height according to the container
        if (!visual.useOriginalSizeOnLoad && size) {
          jsonData.width = "container";
          jsonData.height = "container";
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
    // Only render when the id change or when it is first loaded and original size is to be used
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, visual?.useOriginalSizeOnLoad]);

  /**
   * Vegalite listen to resize events when the chart width and height is set to container
   * This allows size updates without re-embed (costly)
   */
  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, [size]);

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
