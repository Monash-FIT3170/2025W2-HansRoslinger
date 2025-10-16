"use client";

import { useState } from "react";
import { UploadProp } from "types/application";
import Image from "next/image";
import { FILE_TYPE_PNG } from "constants/application";

interface CollectionItemSelectorProps {
  availableItems: Record<string, UploadProp>;
  selectedItems: string[];
  onSelectionChange: (selectedItems: string[]) => void;
}

export default function CollectionItemSelector({
  availableItems,
  selectedItems,
  onSelectionChange,
}: CollectionItemSelectorProps) {
  const [search, setSearch] = useState("");

  // Filter items based on search term
  const filteredItems = Object.entries(availableItems).filter(([, item]) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleItemSelection = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      onSelectionChange(selectedItems.filter((id) => id !== itemId));
    } else {
      onSelectionChange([...selectedItems, itemId]);
    }
  };

  return (
    <div className="p-8">
      {/* Enhanced Search Input */}
      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-[#5C9BB8]/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search Assets"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 border border-[#5C9BB8]/30 focus:outline-none focus:ring-2 focus:ring-[#5C9BB8]/50 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm text-[#2a2a2a] placeholder-[#4a4a4a]/50 font-medium"
        />
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 max-h-[520px] overflow-y-auto p-6 scrollbar-thin">
        {filteredItems.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-[#5C9BB8]/20 blur-2xl"></div>
              <div className="relative p-6 bg-gradient-to-br from-[#5C9BB8]/10 to-[#FC9770]/10">
                <svg
                  className="w-16 h-16 text-[#5C9BB8]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-[#2a2a2a] font-bold text-lg mb-2">No items found</p>
            <p className="text-[#4a4a4a]/70 text-sm">Try adjusting your search</p>
          </div>
        ) : (
          filteredItems.map(([itemId, item], idx) => {
            const isSelected = selectedItems.includes(itemId);
            return (
              <div
                key={itemId}
                onClick={() => toggleItemSelection(itemId)}
                className={`
                  group relative cursor-pointer backdrop-blur-md transition-all duration-500 overflow-visible animate-scale-in
                  ${
                    isSelected
                      ? "bg-white/95 shadow-2xl shadow-[#5C9BB8]/40 ring-2 ring-[#5C9BB8] scale-105 -translate-y-2"
                      : "bg-white/80 shadow-xl hover:shadow-2xl hover:bg-white/95 hover:-translate-y-2 hover:ring-2 hover:ring-[#FC9770]/40"
                  }
                `}
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                {/* Animated gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br from-[#5C9BB8]/8 via-[#FC9770]/5 to-[#FBC841]/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>
                
                {/* Animated border glow */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-[#5C9BB8] via-[#FC9770] to-[#FBC841] opacity-0 blur-sm transition-opacity duration-500 pointer-events-none ${
                  isSelected ? 'opacity-30' : 'group-hover:opacity-20'
                }`}></div>

                {/* Image Container */}
                <div className="relative w-full aspect-square bg-gradient-to-br from-[#F5F9FC] via-[#E8F0F7]/60 to-[#D8E4F0]/40 flex items-center justify-center overflow-hidden border-b border-[#5C9BB8]/15 shadow-inner p-6">
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  {/* Corner accents - Dashboard Style */}
                  <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#5C9BB8]/30 group-hover:border-[#5C9BB8]/60 transition-colors duration-300"></div>
                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FC9770]/30 group-hover:border-[#FC9770]/60 transition-colors duration-300"></div>
                  
                  {item.type === FILE_TYPE_PNG ? (
                    <Image
                      src={item.thumbnailSrc || "/uploads/default-thumbnail.png"}
                      alt={item.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center relative z-10">
                      <Image
                        src="/uploads/chart-icon.png"
                        alt={item.name}
                        width={56}
                        height={56}
                        className="transition-transform group-hover:scale-110 duration-300"
                      />
                    </div>
                  )}

                </div>

                {isSelected && (
                  <div className="absolute -top-3 -right-3 z-30 pointer-events-none">
                    <div className="relative animate-scale-in">
                      <div className="absolute inset-0 bg-[#5C9BB8] blur-md opacity-60"></div>
                      <div className="relative bg-gradient-to-br from-[#5C9BB8] to-[#4a89a6] p-3 shadow-xl border-4 border-white">
                        <svg className="w-5 h-5 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                {/* Item Details */}
                <div className="relative p-4">
                  <div className="w-full space-y-2.5">
                    <div className="font-bold text-sm truncate text-center text-[#2a2a2a] group-hover:text-[#5C9BB8] transition-colors duration-300 px-1">
                      {item.name}
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="relative">
                        {/* Badge glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#5C9BB8] to-[#7BAFD4] blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                        <span className="relative px-3 py-1 bg-gradient-to-r from-[#5C9BB8] to-[#7BAFD4] text-white font-bold text-[10px] uppercase tracking-widest shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 inline-block">
                          {item.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
