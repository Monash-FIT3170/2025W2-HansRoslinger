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
  title
}: AddToCollectionModalProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([...currentItems]);

  const handleSave = () => {
    onSave(selectedItems);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <CollectionItemSelector
            availableItems={availableItems}
            selectedItems={selectedItems}
            onSelectionChange={setSelectedItems}
          />
        </div>
        
        <div className="border-t p-4 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}