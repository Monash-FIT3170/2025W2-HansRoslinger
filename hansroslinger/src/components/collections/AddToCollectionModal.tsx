"use client";

import { useState } from "react";
import CollectionItemSelector from "./CollectionItemSelector";
import { UploadProp } from "types/application";

interface AddToCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemIds: string[]) => void;
  availableItems: Record<string, UploadProp>;
  currentItems: string[];
  title: string;
}

export default function AddToCollectionModal({
  isOpen,
  onClose,
  onSave,
  availableItems,
  currentItems,
  title,
}: AddToCollectionModalProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([
    ...currentItems,
  ]);

  const handleSave = () => {
    onSave(selectedItems);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white/95 backdrop-blur-md shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col border border-[#5C9BB8]/20 animate-scale-in overflow-hidden">
        {/* Enhanced Header */}
        <div className="relative border-b border-[#5C9BB8]/20 px-8 py-6 bg-gradient-to-r from-[#F5F9FC] via-[#E8F0F7]/60 to-[#D8E4F0]/40">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#5C9BB8]/5 via-transparent to-[#FC9770]/5 pointer-events-none"></div>
          
          <div className="relative flex justify-between items-center">
            <h2 className="text-2xl font-bold gradient-text-enhanced">{title}</h2>
            <button
              onClick={onClose}
              className="group relative p-2.5 text-[#4a4a4a] hover:text-[#FC9770] hover:bg-[#FC9770]/10 transition-all duration-300 hover:scale-110 hover:rotate-90"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative bg-gradient-to-br from-[#F5F9FC]/30 via-white to-[#E8F0F7]/20">
          <CollectionItemSelector
            availableItems={availableItems}
            selectedItems={selectedItems}
            onSelectionChange={setSelectedItems}
          />
        </div>

        {/* Enhanced Footer */}
        <div className="relative border-t border-[#5C9BB8]/20 px-8 py-6 bg-gradient-to-r from-[#F5F9FC]/80 via-white to-[#E8F0F7]/60 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="group relative px-6 py-3 border-2 border-[#2a2a2a] text-[#2a2a2a] font-bold hover:bg-[#2a2a2a] hover:text-white transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">Cancel</span>
          </button>
          <button
            onClick={handleSave}
            className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#5C9BB8] via-[#FC9770] to-[#FBC841] text-white font-bold shadow-lg shadow-[#5C9BB8]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#FC9770]/40 hover:-translate-y-0.5 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 relative z-10"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="relative z-10 tracking-wide">Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
