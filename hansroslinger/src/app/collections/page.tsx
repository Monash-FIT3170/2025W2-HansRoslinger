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
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8F0] via-[#FFEFD5] to-[#FED6A6]/40 -z-10"></div>
      
      <div className="max-w-7xl mx-auto relative">
        <div className="mb-8 flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              My <span className="gradient-text">Collections</span>
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
              className="inline-flex items-center gap-2 bg-[#FC9770] text-white px-5 py-2.5 font-semibold shadow-lg shadow-[#FC9770]/30 transition-all hover:shadow-xl hover:shadow-[#FC9770]/40 hover:-translate-y-0.5 hover:bg-[#fb8659]"
              onClick={() => setShowActiveOnly(!showActiveOnly)}
            >
              {showActiveOnly ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 12h16.5"
                    />
                  </svg>
                  Show All
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                    />
                  </svg>
                  View Active
                </>
              )}
            </button>
            <button
              onClick={toggleCreateForm}
              className="inline-flex items-center gap-2 bg-[#5C9BB8] text-white px-5 py-2.5 font-semibold shadow-lg shadow-[#5C9BB8]/30 transition-all hover:shadow-xl hover:shadow-[#5C9BB8]/40 hover:-translate-y-0.5 hover:bg-[#4a89a6]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              New Collection
            </button>
          </div>
        </div>

        {isCreating && (
          <div className="modern-card p-8 mb-8 animate-scale-in">
            <h2 className="text-2xl font-bold mb-6 gradient-text">
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
                  className="px-6 py-2.5 border-2 border-[#2a2a2a] text-[#2a2a2a] font-semibold hover:bg-[#2a2a2a] hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCollection}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#5C9BB8] via-[#FC9770] to-[#FBC841] text-white font-semibold shadow-lg shadow-[#5C9BB8]/30 transition-all hover:shadow-xl hover:shadow-[#FC9770]/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  disabled={!newCollection.name.trim()}
                >
                  Create Collection
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
            <div className="col-span-full modern-card p-12 text-center animate-fade-in">
              <div className="flex justify-center mb-4">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
              </div>
              <p className="text-[#4a4a4a] mb-2 text-lg font-semibold">No active collections</p>
              <p className="text-gray-500">
                Mark collections as active by clicking the star icon
              </p>
            </div>
          ) : collections.length === 0 ? (
            <div className="col-span-full modern-card p-12 text-center animate-fade-in">
              <div className="flex justify-center mb-4">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-[#4a4a4a] mb-2 text-lg font-semibold">
                No collections yet
              </p>
              <p className="text-gray-500">
                Create a collection to organise your uploads
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
                  className={`modern-card overflow-hidden cursor-pointer group animate-scale-in
                    ${selectedCollection?.id === collection.id ? "ring-4 ring-purple-500 shadow-purple-500/30" : ""}`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                  onClick={() => selectCollection(collection)}
                >
                  <div className="h-28 bg-gray-200 relative">
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
                  <div className="p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <h3 className="text-base font-semibold truncate">
                          {collection.name}
                        </h3>
                        <button
                          onClick={(e) =>
                            toggleActiveCollection(collection.id, e)
                          }
                          className={`ml-2 p-1 ${
                            activeCollections.includes(collection.id)
                              ? "text-yellow-500 bg-yellow-50"
                              : "text-gray-400 hover:text-gray-600 bg-transparent"
                          }`}
                          title={
                            activeCollections.includes(collection.id)
                              ? "Remove from presentation"
                              : "Add to presentation"
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
                            strokeWidth={1.5}
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
                        className="text-gray-400 hover:text-red-500"
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
          <div className="mt-8 modern-card p-8 animate-slide-up">
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
                className="inline-flex items-center gap-2 bg-[#FBC841] text-white px-5 py-2.5 font-semibold shadow-lg shadow-[#FBC841]/30 transition-all hover:shadow-xl hover:shadow-[#FBC841]/40 hover:-translate-y-0.5 hover:bg-[#eab730]"
                onClick={() => setIsAddItemsModalOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Items
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
                <div className="col-span-full p-12 bg-gradient-to-br from-gray-50 to-gray-100 text-center">
                  <div className="flex justify-center mb-3">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-[#4a4a4a] font-semibold">
                    This collection is empty
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Add some items to get started
                  </p>
                </div>
              ) : (
                selectedCollection.items.map((itemId, idx) => {
                  const item = availableUploads[itemId];
                  if (!item) return null;

                  return (
                    <div
                      key={itemId}
                      className="group bg-gradient-to-br from-white to-gray-50 border border-gray-200 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 animate-scale-in"
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      <div className="h-28 bg-gray-100 relative flex items-center justify-center">
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
