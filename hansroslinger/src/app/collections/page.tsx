"use client";

import { useState, useEffect } from "react";
import ReturnToDashboard from "@/components/ReturnToDashboard";
import { Uploads } from "types/application";
import Image from "next/image";
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
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);
  const [activeCollections, setActiveCollections] = useState<string[]>([]);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [availableUploads, setAvailableUploads] = useState<Uploads>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAddItemsModalOpen, setIsAddItemsModalOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editableTitle, setEditableTitle] = useState("");
  const [editableDescription, setEditableDescription] = useState("");

  // Mock data for demonstration
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setCollections([
        {
          id: "col-1",
          name: "Line Charts",
          description: "Collection of line chart visualisations",
          items: ["chart-1", "chart-2"],
          createdAt: "2025-10-01",
          thumbnailSrc: "/uploads/line-chart.json",
        },
        {
          id: "col-2",
          name: "Bar Charts",
          description: "Collection of bar chart visualisations",
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
        },
      ]);

      // Mock available uploads
      setAvailableUploads({
        "chart-1": {
          name: "Stock Trends",
          type: "json",
          src: "/uploads/line-chart.json",
          thumbnailSrc: "/uploads/chart-icon.png",
        },
        "chart-2": {
          name: "Revenue Growth",
          type: "json",
          src: "/uploads/line-chart.json",
          thumbnailSrc: "/uploads/chart-icon.png",
        },
        "chart-3": {
          name: "Sales by Region",
          type: "json",
          src: "/uploads/bar-chart.json",
          thumbnailSrc: "/uploads/chart-icon.png",
        },
        "chart-4": {
          name: "Quarterly Results",
          type: "json",
          src: "/uploads/bar-chart.json",
          thumbnailSrc: "/uploads/chart-icon.png",
        },
        "img-1": {
          name: "Profile Photo",
          type: "png",
          src: "/uploads/ian.png",
          thumbnailSrc: "/uploads/ian.png",
        },
        "img-2": {
          name: "Team Photo",
          type: "png",
          src: "/uploads/default-thumbnail.png",
          thumbnailSrc: "/uploads/default-thumbnail.png",
        },
        "img-3": {
          name: "Project Logo",
          type: "png",
          src: "/uploads/default-thumbnail.png",
          thumbnailSrc: "/uploads/default-thumbnail.png",
        },
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
      createdAt: new Date().toISOString().split("T")[0],
    };

    setCollections([...collections, newCol]);
    setNewCollection({ name: "", description: "" });
    setIsCreating(false);
  };

  const handleDeleteCollection = (id: string) => {
    setCollections(collections.filter((col) => col.id !== id));
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
      // Reset editing states when selecting a new collection
      setIsEditingTitle(false);
      setIsEditingDescription(false);
      setEditableTitle(collection.name);
      setEditableDescription(collection.description || "");
    }
  };

  const toggleActiveCollection = (
    collectionId: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation(); // Prevent triggering selectCollection

    setActiveCollections((prev) => {
      if (prev.includes(collectionId)) {
        return prev.filter((id) => id !== collectionId);
      } else {
        return [...prev, collectionId];
      }
    });
  };

  const startEditingTitle = () => {
    if (selectedCollection) {
      setEditableTitle(selectedCollection.name);
      setIsEditingTitle(true);
    }
  };

  const startEditingDescription = () => {
    if (selectedCollection) {
      setEditableDescription(selectedCollection.description || "");
      setIsEditingDescription(true);
    }
  };

  const saveTitle = () => {
    if (selectedCollection && editableTitle.trim()) {
      const updatedCollection = {
        ...selectedCollection,
        name: editableTitle.trim(),
      };
      setSelectedCollection(updatedCollection);
      setCollections(
        collections.map((c) =>
          c.id === updatedCollection.id ? updatedCollection : c,
        ),
      );
      setIsEditingTitle(false);
    }
  };

  const saveDescription = () => {
    if (selectedCollection) {
      const updatedCollection = {
        ...selectedCollection,
        description: editableDescription.trim(),
      };
      setSelectedCollection(updatedCollection);
      setCollections(
        collections.map((c) =>
          c.id === updatedCollection.id ? updatedCollection : c,
        ),
      );
      setIsEditingDescription(false);
    }
  };

  return (
    <main className="flex-1 p-8 relative overflow-hidden">
      {/* Enhanced Background decoration to match dashboard */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F5F9FC] via-[#5C9BB8]/10 to-[#E8F0F7]/25 -z-10"></div>
      
      {/* Floating background orbs */}
      <div className="absolute top-10 left-[10%] w-96 h-96 bg-gradient-to-r from-[#5C9BB8]/10 to-[#FC9770]/10 blur-3xl animate-float-slow opacity-40"></div>
      <div className="absolute bottom-20 right-[15%] w-80 h-80 bg-gradient-to-r from-[#FBC841]/10 to-[#E5A168]/10 blur-3xl animate-float-delayed opacity-40"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-8 flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              My <span className="gradient-text-enhanced">Collections</span>
            </h1>
            <p className="text-[#4a4a4a]">
              Organise and manage your visual assets
            </p>
          </div>
          <ReturnToDashboard />
        </div>

        <div className="flex justify-between items-center mb-8 animate-slide-up">
          <div className="flex items-center gap-3">
            <button
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-[#FC9770] to-[#fb8659] text-white px-6 py-3 font-bold shadow-lg shadow-[#FC9770]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#FC9770]/40 hover:-translate-y-0.5 overflow-hidden"
              onClick={() => setShowActiveOnly(!showActiveOnly)}
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FC9770] to-[#FBC841] opacity-0 group-hover:opacity-75 blur-sm transition-opacity duration-300"></div>
              {showActiveOnly ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="h-5 w-5 relative z-10 transition-transform group-hover:scale-110"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 12h16.5"
                    />
                  </svg>
                  <span className="relative z-10 tracking-wide">Show All</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="h-5 w-5 relative z-10 transition-transform group-hover:scale-110"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                    />
                  </svg>
                  <span className="relative z-10 tracking-wide">View Active</span>
                </>
              )}
            </button>
            <button
              onClick={toggleCreateForm}
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-[#5C9BB8] to-[#4a89a6] text-white px-6 py-3 font-bold shadow-lg shadow-[#5C9BB8]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#5C9BB8]/40 hover:-translate-y-0.5 overflow-hidden"
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5C9BB8] to-[#7BAFD4] opacity-0 group-hover:opacity-75 blur-sm transition-opacity duration-300"></div>
              
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 relative z-10 transition-transform group-hover:scale-110 group-hover:rotate-90"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="relative z-10 tracking-wide">New Collection</span>
            </button>
          </div>
        </div>

        {isCreating && (
          <div className="modern-card-enhanced p-8 mb-8 animate-scale-in backdrop-blur-md bg-white/80">
            <h2 className="text-2xl font-bold mb-6 gradient-text-enhanced">
              Create New Collection
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-foreground font-semibold mb-2" htmlFor="name">
                  Collection Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={newCollection.name}
                  onChange={(e) =>
                    setNewCollection({ ...newCollection, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[#E5A168]/30 focus:outline-none focus:ring-2 focus:ring-[#5C9BB8]/50 focus:border-transparent transition-all bg-white text-[#2a2a2a]"
                  placeholder="Enter collection name"
                />
              </div>
              <div>
                <label
                  className="block text-foreground font-semibold mb-2"
                  htmlFor="description"
                >
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  value={newCollection.description}
                  onChange={(e) =>
                    setNewCollection({
                      ...newCollection,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-[#E5A168]/30 focus:outline-none focus:ring-2 focus:ring-[#5C9BB8]/50 focus:border-transparent transition-all bg-white text-[#2a2a2a]"
                  placeholder="Describe your collection"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsCreating(false)}
                  className="group relative px-6 py-3 border-2 border-[#2a2a2a] text-[#2a2a2a] font-bold hover:bg-[#2a2a2a] hover:text-white transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10">Cancel</span>
                </button>
                <button
                  onClick={handleCreateCollection}
                  className="group relative px-6 py-3 bg-gradient-to-r from-[#5C9BB8] via-[#FC9770] to-[#FBC841] text-white font-bold shadow-lg shadow-[#5C9BB8]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#FC9770]/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 overflow-hidden"
                  disabled={!newCollection.name.trim()}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative z-10">Create Collection</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="modern-card h-48 animate-pulse bg-gradient-to-br from-gray-100 to-gray-200"
              ></div>
            ))
          ) : showActiveOnly && activeCollections.length === 0 ? (
            <div className="col-span-full modern-card-enhanced p-20 text-center animate-fade-in max-w-2xl mx-auto backdrop-blur-sm bg-white/80">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#FBC841]/30 blur-3xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-[#FBC841]/20 to-[#FC9770]/20 p-8 backdrop-blur-sm">
                    <svg className="w-24 h-24 text-[#FBC841] relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-[#2a2a2a] mb-3 text-2xl font-bold">No active collections</p>
              <p className="text-[#4a4a4a]/80 text-lg leading-relaxed">
                Mark collections as active by clicking the <span className="text-[#FBC841] font-semibold">star</span> icon
              </p>
            </div>
          ) : collections.length === 0 ? (
            <div className="col-span-full modern-card-enhanced p-20 text-center animate-fade-in max-w-2xl mx-auto backdrop-blur-sm bg-white/80">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#5C9BB8]/30 blur-3xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-[#5C9BB8]/20 to-[#FC9770]/20 p-8 backdrop-blur-sm">
                    <svg className="w-24 h-24 text-[#5C9BB8] relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-[#2a2a2a] mb-3 text-2xl font-bold">
                No collections yet
              </p>
              <p className="text-[#4a4a4a]/80 text-lg leading-relaxed">
                Create a collection to organise your <span className="text-[#5C9BB8] font-semibold">uploads</span>
              </p>
            </div>
          ) : (
            collections
              .filter(
                (collection) =>
                  !showActiveOnly || activeCollections.includes(collection.id),
              )
              .map((collection, idx) => (
                <div
                  key={collection.id}
                  className={`modern-card-enhanced overflow-hidden cursor-pointer group animate-scale-in backdrop-blur-md transition-all duration-500
                    ${selectedCollection?.id === collection.id 
                      ? "bg-white/95 shadow-2xl shadow-[#5C9BB8]/40 ring-2 ring-[#5C9BB8] scale-105" 
                      : "bg-white/80 hover:bg-white/95 hover:shadow-2xl hover:-translate-y-2"
                    }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                  onClick={() => selectCollection(collection)}
                >
                  <div className="h-28 bg-gradient-to-br from-[#F5F9FC] via-[#E8F0F7]/60 to-[#D8E4F0]/40 relative overflow-hidden border-b border-[#5C9BB8]/15">
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    {collection.thumbnailSrc &&
                    collection.thumbnailSrc.endsWith(".json") ? (
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
                          src={
                            collection.thumbnailSrc ||
                            "/uploads/default-thumbnail.png"
                          }
                          alt={collection.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <div className="p-3 relative z-10">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-1">
                        <h3 className="text-base font-semibold truncate">
                          {collection.name}
                        </h3>
                        <button
                          onClick={(e) =>
                            toggleActiveCollection(collection.id, e)
                          }
                          className={`relative p-1.5 transition-all duration-300 hover:scale-110 ${
                            activeCollections.includes(collection.id)
                              ? "text-[#FBC841] bg-[#FBC841]/20"
                              : "text-gray-400 hover:text-[#FBC841] hover:bg-[#FBC841]/10 bg-transparent"
                          }`}
                          title={
                            activeCollections.includes(collection.id)
                              ? "Remove from active"
                              : "Add to active"
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill={
                              activeCollections.includes(collection.id)
                                ? "currentColor"
                                : "none"
                            }
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                            />
                          </svg>
                        </button>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCollection(collection.id);
                        }}
                        className="relative p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 hover:scale-110"
                        title="Delete collection"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                    <p className="text-gray-500 text-xs mt-1 line-clamp-1">
                      {collection.description || "No description"}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        {collection.items.length} items
                      </span>
                      <span className="text-xs text-gray-400">
                        Created: {collection.createdAt}
                      </span>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>

        {selectedCollection && (
          <div className="mt-8 modern-card-enhanced p-8 animate-slide-up backdrop-blur-md bg-white/80">
            <div className="flex justify-between items-center mb-6">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editableTitle}
                    onChange={(e) => setEditableTitle(e.target.value)}
                    className="text-2xl font-bold border-b-2 border-blue-500 focus:outline-none py-1"
                    autoFocus
                  />
                  <div className="flex items-center">
                    <button
                      onClick={saveTitle}
                      className="text-green-500 hover:text-green-700"
                      title="Save"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setIsEditingTitle(false)}
                      className="text-red-500 hover:text-red-700 ml-1"
                      title="Cancel"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <h2 className="text-2xl font-bold">
                    {selectedCollection.name}
                  </h2>
                  <button
                    onClick={startEditingTitle}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                    title="Edit title"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>
              )}
              <button
                className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-[#5C9BB8] to-[#4a89a6] text-white px-6 py-3 font-bold shadow-lg shadow-[#5C9BB8]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#5C9BB8]/40 hover:-translate-y-0.5 overflow-hidden"
                onClick={() => setIsAddItemsModalOpen(true)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5C9BB8] to-[#7BAFD4] opacity-0 group-hover:opacity-75 blur-sm transition-opacity duration-300"></div>
                
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 relative z-10 transition-transform group-hover:scale-110 group-hover:rotate-90"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="relative z-10 tracking-wide">Add Items</span>
              </button>
            </div>

            {isEditingDescription ? (
              <div className="mb-6">
                <textarea
                  value={editableDescription}
                  onChange={(e) => setEditableDescription(e.target.value)}
                  className="w-full p-2 text-gray-600 border-2 border-blue-300 focus:outline-none focus:border-blue-500"
                  rows={3}
                  placeholder="Add a description"
                  autoFocus
                />
                <div className="flex justify-end mt-2 gap-2">
                  <button
                    onClick={saveDescription}
                    className="text-green-500 hover:text-green-700 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingDescription(false)}
                    className="text-red-500 hover:text-red-700 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start mb-6">
                <p className="text-gray-600">
                  {selectedCollection.description || "No description"}
                </p>
                <button
                  onClick={startEditingDescription}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                  title="Edit description"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {selectedCollection.items.length === 0 ? (
                <div className="col-span-full p-16 bg-gradient-to-br from-[#F5F9FC] via-[#E8F0F7]/60 to-[#D8E4F0]/40 text-center border border-[#5C9BB8]/15">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#5C9BB8]/20 blur-2xl"></div>
                      <div className="relative p-6 bg-gradient-to-br from-[#5C9BB8]/10 to-[#FC9770]/10">
                        <svg className="w-16 h-16 text-[#5C9BB8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="text-[#2a2a2a] font-bold text-xl mb-2">
                    This collection is empty
                  </p>
                  <p className="text-[#4a4a4a]/80 text-base">
                    Click <span className="text-[#5C9BB8] font-semibold">Add Items</span> to get started
                  </p>
                </div>
              ) : (
                selectedCollection.items.map((itemId, idx) => {
                  const item = availableUploads[itemId];
                  if (!item) return null;

                  return (
                    <div
                      key={itemId}
                      className="group bg-white/80 backdrop-blur-md border border-[#5C9BB8]/15 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/95 animate-scale-in"
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      <div className="h-28 bg-gradient-to-br from-[#F5F9FC] via-[#E8F0F7]/60 to-[#D8E4F0]/40 relative flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        {item.type === FILE_TYPE_PNG ? (
                          <Image
                            src={
                              item.thumbnailSrc ||
                              "/uploads/default-thumbnail.png"
                            }
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
                          <h4 className="text-sm font-medium truncate">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => {
                              // Remove item from collection
                              const updatedCollection = {
                                ...selectedCollection,
                                items: selectedCollection.items.filter(
                                  (id) => id !== itemId,
                                ),
                              };
                              setSelectedCollection(updatedCollection);
                              setCollections(
                                collections.map((c) =>
                                  c.id === updatedCollection.id
                                    ? updatedCollection
                                    : c,
                                ),
                              );
                            }}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
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
                items: [...new Set([...selectedCollection.items, ...itemIds])],
              };
              setSelectedCollection(updatedCollection);
              setCollections(
                collections.map((c) =>
                  c.id === updatedCollection.id ? updatedCollection : c,
                ),
              );
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
