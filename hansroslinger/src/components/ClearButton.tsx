"use client";
import React from "react";
import { useVisualStore } from "store/visualsSlice";
import { RotateCcw } from "lucide-react";

interface ClearButtonProps {
  className?: string;
  variant?: "fixed" | "relative";
}

const ClearButton = ({ className = "", variant = "fixed" }: ClearButtonProps) => {
  const clearVisual = useVisualStore((state) => state.clearVisual);

  const baseStyles = "group px-5 py-3 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/30 hover:-translate-y-0.5 active:translate-y-0 overflow-hidden";
  
  const variantStyles = variant === "fixed" 
    ? "fixed bottom-6 right-6 z-[9999]" 
    : "relative";

  return (
    <button
      onClick={clearVisual}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {/* Shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      
      <div className="relative flex items-center gap-2">
        <RotateCcw className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
        <span className="text-sm tracking-wide">Clear All</span>
      </div>
    </button>
  );
};

export default ClearButton;
