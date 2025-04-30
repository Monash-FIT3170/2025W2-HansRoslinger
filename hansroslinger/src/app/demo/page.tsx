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
    <main className="flex-1 overflow-y-auto scroll-auto scroll-smooth lg:overflow-hidden">
      <section className="flex items-center justify-center mb-8 mt-8">
        <VegaLite spec={spec} />
      </section>
    </main>
  );
};

export default Demo;
