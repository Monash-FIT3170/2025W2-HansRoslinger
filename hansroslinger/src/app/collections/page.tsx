"use client";

import { useState, useEffect } from "react";
import ReturnToDashboard from "@/components/ReturnToDashboard";
import { Uploads } from "types/application";
import Image from "next/image";
import VegaLiteChartDisplay from "@/components/VegaLiteChartDisplay";
import { FILE_TYPE_PNG } from "constants/application";
import AddToCollectionModal from "@/components/collections/AddToCollectionModal";

interface Collection {
  id: string;
  name: string;
  description: string;
  items: string[];
  createdAt: string;
  thumbnailSrc?: string;
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newCollection, setNewCollection] = useState({
    name: "",
    description: "",
  });
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [activeCollections, setActiveCollections] = useState<string[]>([]);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [availableUploads, setAvailableUploads] = useState<Uploads>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAddItemsModalOpen, setIsAddItemsModalOpen] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setCollections([
        {
          id: "col-1",
          name: "Line Charts",
          description: "Collection of line chart visualizations",
          items: ["chart-1", "chart-2"],
          createdAt: "2025-10-01",
          thumbnailSrc: "/uploads/line-chart.json",
        },
        {
          id: "col-2",
          name: "Bar Charts",
          description: "Collection of bar chart visualizations",
          items: ["chart-3", "chart-4"],
          createdAt: "2025-10-05",
          thumbnailSrc: "/uploads/bar-chart.json",
        },
        {
          id: "col-3",
          name: "User Photos",
          description: "Collection of user photos",
          items: ["img-1", "img-2", "img-3"],
          createdAt: "2025-10-08",
          thumbnailSrc: "/uploads/ian.png",
        }
      ]);

      // Mock available uploads
      setAvailableUploads({
        "chart-1": {
          name: "Stock Trends",
          type: "json",
          src: "/uploads/line-chart.json",
          thumbnailSrc: "/uploads/chart-icon.png"
        },
        "chart-2": {
          name: "Revenue Growth",
          type: "json",
          src: "/uploads/line-chart.json",
          thumbnailSrc: "/uploads/chart-icon.png"
        },
        "chart-3": {
          name: "Sales by Region",
          type: "json",
          src: "/uploads/bar-chart.json",
          thumbnailSrc: "/uploads/chart-icon.png"
        },
        "chart-4": {
          name: "Quarterly Results",
          type: "json",
          src: "/uploads/bar-chart.json",
          thumbnailSrc: "/uploads/chart-icon.png"
        },
        "img-1": {
          name: "Profile Photo",
          type: "png",
          src: "/uploads/ian.png",
          thumbnailSrc: "/uploads/ian.png"
        },
        "img-2": {
          name: "Team Photo",
          type: "png",
          src: "/uploads/default-thumbnail.png",
          thumbnailSrc: "/uploads/default-thumbnail.png"
        },
        "img-3": {
          name: "Project Logo",
          type: "png",
          src: "/uploads/default-thumbnail.png",
          thumbnailSrc: "/uploads/default-thumbnail.png"
        }
      });
      
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCreateCollection = () => {
    if (!newCollection.name.trim()) return;
    
    const newCol: Collection = {
      id: `col-${Date.now()}`,
      name: newCollection.name,
      description: newCollection.description,
      items: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setCollections([...collections, newCol]);
    setNewCollection({ name: "", description: "" });
    setIsCreating(false);
  };

  const handleDeleteCollection = (id: string) => {
    setCollections(collections.filter(col => col.id !== id));
    if (selectedCollection?.id === id) {
      setSelectedCollection(null);
    }
  };

  const toggleCreateForm = () => {
    setIsCreating(!isCreating);
  };

  const selectCollection = (collection: Collection) => {
    // Toggle selection - if clicking the already selected collection, unselect it
    if (selectedCollection && selectedCollection.id === collection.id) {
      setSelectedCollection(null);
    } else {
      setSelectedCollection(collection);
    }
  };
  
  const toggleActiveCollection = (collectionId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering selectCollection
    
    setActiveCollections(prev => {
      if (prev.includes(collectionId)) {
        return prev.filter(id => id !== collectionId);
      } else {
        return [...prev, collectionId];
      }
    });
  };

  return (
    <main className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <ReturnToDashboard />
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Collections</h1>
          <div className="flex items-center space-x-3">
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center"
              onClick={() => setShowActiveOnly(!showActiveOnly)}
            >
              {showActiveOnly ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5" />
                  </svg>
                  Show All
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                  View Active
                </>
              )}
            </button>
            <button 
              onClick={toggleCreateForm}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Collection
            </button>
          </div>
        </div>

        {isCreating && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Create New Collection</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="name">Collection Name</label>
                <input 
                  type="text"
                  id="name"
                  value={newCollection.name}
                  onChange={(e) => setNewCollection({...newCollection, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter collection name"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="description">Description (Optional)</label>
                <textarea 
                  id="description"
                  value={newCollection.description}
                  onChange={(e) => setNewCollection({...newCollection, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your collection"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateCollection}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  disabled={!newCollection.name.trim()}
                >
                  Create Collection
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({length: 4}).map((_, i) => (
              <div key={i} className="bg-gray-100 h-32 rounded-lg animate-pulse"></div>
            ))
          ) : showActiveOnly && activeCollections.length === 0 ? (
            <div className="md:col-span-2 lg:col-span-3 p-10 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600 mb-2">No active collections.</p>
              <p className="text-gray-500">Mark collections as active by clicking the star icon.</p>
            </div>
          ) : collections.length === 0 ? (
            <div className="md:col-span-2 lg:col-span-3 p-10 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600 mb-2">You don't have any collections yet.</p>
              <p className="text-gray-500">Create a collection to organize your uploads.</p>
            </div>
          ) : (
            collections
              .filter(collection => !showActiveOnly || activeCollections.includes(collection.id))
              .map((collection) => (
                <div 
                  key={collection.id} 
                  className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg cursor-pointer transition-shadow
                    ${selectedCollection?.id === collection.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => selectCollection(collection)}
                >
                  <div className="h-28 bg-gray-200 relative">
                    {collection.thumbnailSrc && collection.thumbnailSrc.endsWith('.json') ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Image
                          src="/uploads/chart-icon.png"
                          alt={collection.name}
                          width={40}
                          height={40}
                        />
                      </div>
                    ) : (
                      <div className="relative w-full h-full">
                        <Image
                          src={collection.thumbnailSrc || "/uploads/default-thumbnail.png"}
                          alt={collection.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <h3 className="text-base font-semibold truncate">{collection.name}</h3>
                        <button 
                          onClick={(e) => toggleActiveCollection(collection.id, e)}
                          className={`ml-2 p-1 rounded-full ${
                            activeCollections.includes(collection.id) 
                              ? 'text-yellow-500 bg-yellow-50' 
                              : 'text-gray-400 hover:text-gray-600 bg-transparent'
                          }`}
                          title={activeCollections.includes(collection.id) ? "Remove from presentation" : "Add to presentation"}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill={activeCollections.includes(collection.id) ? "currentColor" : "none"} 
                            viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" 
                              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                          </svg>
                        </button>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCollection(collection.id);
                        }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-gray-500 text-xs mt-1 line-clamp-1">{collection.description || "No description"}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">{collection.items.length} items</span>
                      <span className="text-xs text-gray-400">Created: {collection.createdAt}</span>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>

        {selectedCollection && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{selectedCollection.name}</h2>
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center text-sm"
                onClick={() => setIsAddItemsModalOpen(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Items
              </button>
            </div>
            
            {selectedCollection.description && (
              <p className="text-gray-600 mb-6">{selectedCollection.description}</p>
            )}
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {selectedCollection.items.length === 0 ? (
                <div className="col-span-full p-8 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-500">This collection is empty. Add some items to get started.</p>
                </div>
              ) : (
                selectedCollection.items.map((itemId) => {
                  const item = availableUploads[itemId];
                  if (!item) return null;
                  
                  return (
                    <div key={itemId} className="bg-white border rounded-md overflow-hidden hover:shadow-md transition-shadow">
                      <div className="h-28 bg-gray-100 relative flex items-center justify-center">
                        {item.type === FILE_TYPE_PNG ? (
                          <Image
                            src={item.thumbnailSrc || "/uploads/default-thumbnail.png"}
                            alt={item.name}
                            fill
                            className="object-contain"
                          />
                        ) : (
                          <Image
                            src="/uploads/chart-icon.png"
                            alt={item.name}
                            width={40}
                            height={40}
                          />
                        )}
                      </div>
                      <div className="p-2">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-medium truncate">{item.name}</h4>
                          <button 
                            onClick={() => {
                              // Remove item from collection
                              const updatedCollection = {
                                ...selectedCollection,
                                items: selectedCollection.items.filter(id => id !== itemId)
                              };
                              setSelectedCollection(updatedCollection);
                              setCollections(collections.map(c => 
                                c.id === updatedCollection.id ? updatedCollection : c
                              ));
                            }}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-xs text-gray-500">{item.type}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Add Items Modal */}
        {selectedCollection && (
          <AddToCollectionModal
            isOpen={isAddItemsModalOpen}
            onClose={() => setIsAddItemsModalOpen(false)}
            onSave={(itemIds) => {
              const updatedCollection = {
                ...selectedCollection,
                items: [...new Set([...selectedCollection.items, ...itemIds])]
              };
              setSelectedCollection(updatedCollection);
              setCollections(collections.map(c => 
                c.id === updatedCollection.id ? updatedCollection : c
              ));
            }}
            availableItems={availableUploads}
            currentItems={selectedCollection.items}
            title={`Add Items to ${selectedCollection.name}`}
          />
        )}
      </div>
    </main>
  );
}