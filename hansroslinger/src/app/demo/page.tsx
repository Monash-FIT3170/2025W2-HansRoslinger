"use client";
import { VegaLite } from "react-vega";
import { TopLevelSpec } from "vega-lite";
const spec: TopLevelSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v6.json",
  description: "A simple bar chart with embedded data.",
  data: {
    values: [
      {
        a: "A",
        b: 28,
      },
      {
        a: "B",
        b: 55,
      },
      {
        a: "C",
        b: 43,
      },
      {
        a: "D",
        b: 91,
      },
      {
        a: "E",
        b: 81,
      },
      {
        a: "F",
        b: 53,
      },
      {
        a: "G",
        b: 19,
      },
      {
        a: "H",
        b: 87,
      },
      {
        a: "I",
        b: 52,
      },
    ],
  },
  mark: {
    type: "bar",
    tooltip: true,
  },
  encoding: {
    x: {
      field: "a",
      type: "nominal",
      axis: {
        labelAngle: 0,
      },
    },
    y: {
      field: "b",
      type: "quantitative",
    },
    tooltip: [
      { field: "a", type: "nominal", title: "Category" },
      { field: "b", type: "quantitative", title: "Value" },
    ],
  },
};
const Demo = () => {
  return (
    <main className="flex-1 p-8 relative overflow-hidden">
      {/* Background decoration to match dashboard */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F5F9FC] via-[#5C9BB8]/10 to-[#E8F0F7]/25 -z-10"></div>

      <section className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold">
            Vega-Lite <span className="gradient-text">Demo</span>
          </h1>
          <p className="text-[#4a4a4a] mt-1">A simple chart rendered with Vega-Lite</p>
        </div>

        <div className="modern-card p-6">
          <div className="flex items-center justify-center">
            <VegaLite spec={spec} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Demo;
