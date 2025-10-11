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
  const filteredItems = Object.entries(availableItems).filter(([_, item]) => 
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleItemSelection = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      onSelectionChange(selectedItems.filter(id => id !== itemId));
    } else {
      onSelectionChange([...selectedItems, itemId]);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-2">
        {filteredItems.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 py-8">No items found</p>
        ) : (
          filteredItems.map(([itemId, item]) => (
            <div
              key={itemId}
              onClick={() => toggleItemSelection(itemId)}
              className={`
                cursor-pointer border rounded-md overflow-hidden transition-all
                ${selectedItems.includes(itemId) 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-blue-300'}
              `}
            >
              <div className="h-28 bg-gray-100 relative flex items-center justify-center">
                {item.type === FILE_TYPE_PNG ? (
                  <Image
                    src={item.thumbnailSrc || "/uploads/default-thumbnail.png"}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <Image
                      src="/uploads/chart-icon.png"
                      alt={item.name}
                      width={40}
                      height={40}
                    />
                  </div>
                )}
                
                {selectedItems.includes(itemId) && (
                  <div className="absolute top-2 right-2 bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-2">
                <h4 className="font-medium text-sm truncate">{item.name}</h4>
                <p className="text-xs text-gray-500">{item.type}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}