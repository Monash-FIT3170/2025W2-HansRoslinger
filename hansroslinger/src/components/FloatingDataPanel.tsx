"use client";

import { usePanelStore } from "store/panelSlice";

const FloatingDataPanel = () => {
  const isOpen = usePanelStore((state) => state.isOpen);
  const toggle = usePanelStore((state) => state.toggle);

  return (
    <div className="absolute top-1/2 -translate-y-1/2 left-4 z-[9999]">
      {/* arrow button */}
      <button
        onClick={toggle}
        className="bg-white border px-4 py-2 text-2xl rounded shadow hover:bg-gray-100"
      >
        {isOpen ? "<" : ">"}
      </button>

      {/* content */}
      {isOpen && (
        <div className="mt-2 w-64 max-h-[70vh] overflow-y-auto bg-white border rounded shadow p-3 space-y-2">
          <h2 className="text-lg font-semibold mb-2 text-black">Uploaded Visuals</h2>

          {/* chart entry (draggable later) */}
          <div
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData("application/json", "bar-chart.json")
            }
            className="cursor-grab p-2 border rounded hover:bg-gray-100 active:cursor-grabbing text-black bg-gray-50"
          >
            example chart (assets will be here soon)
          </div>

          {/* More to be added below */}
        </div>
      )}
    </div>
  );
};

export default FloatingDataPanel;
