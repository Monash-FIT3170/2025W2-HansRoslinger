"use client";
import { VegaLite } from "react-vega";
import { TopLevelSpec } from "vega-lite";
import ReturnToDashboard from "@/components/ReturnToDashboard";
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
      {/* Enhanced Background decoration to match dashboard */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F5F9FC] via-[#5C9BB8]/10 to-[#E8F0F7]/25 -z-10"></div>
      
      {/* Floating background orbs */}
      <div className="absolute top-10 left-[10%] w-96 h-96 bg-gradient-to-r from-[#5C9BB8]/10 to-[#FC9770]/10 blur-3xl animate-float-slow opacity-40"></div>
      <div className="absolute bottom-20 right-[15%] w-80 h-80 bg-gradient-to-r from-[#FBC841]/10 to-[#E5A168]/10 blur-3xl animate-float-delayed opacity-40"></div>

      <section className="max-w-7xl mx-auto relative z-10">
        <div className="mb-8 flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-2">
              Vega-Lite <span className="gradient-text-enhanced">Demo</span>
            </h1>
            <p className="text-lg md:text-xl text-[#4a4a4a]/90 leading-relaxed">
              A simple chart rendered with Vega-Lite
            </p>
          </div>
          <ReturnToDashboard />
        </div>

        <div className="modern-card-enhanced p-8 animate-scale-in backdrop-blur-md bg-white/80">
          <div className="flex items-center justify-center">
            <VegaLite spec={spec} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Demo;
