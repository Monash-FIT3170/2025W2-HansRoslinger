"use client";
import React from "react";
import { useVisualStore } from "store/visualsSlice";

const ClearButton = () => {
  const clearVisual = useVisualStore((state) => state.clearVisual);

  return (
    <button
      onClick={clearVisual}
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        padding: "10px 16px",
        backgroundColor: "#ef4444",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
        zIndex: 9999,
      }}
    >
      Clear All
    </button>
  );
};

export default ClearButton;
