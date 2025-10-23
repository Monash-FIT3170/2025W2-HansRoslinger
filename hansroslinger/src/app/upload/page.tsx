"use client";

import { useEffect, useState } from "react";
import { FILE_TYPE_JSON, FILE_TYPE_PNG } from "../../constants/application";
import ReturnToDashboard from "@/components/ReturnToDashboard";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const router = useRouter();
  const [collections, setCollections] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>("");

  // Load collections: prefer localStorage (populated by Collections page), fallback to API
  useEffect(() => {
    let isMounted = true;
    try {
      const raw = window.localStorage.getItem("collections");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && isMounted) {
          setCollections(parsed);
        }
      }
    } catch (_) {
      // ignore parse errors
    }

    (async () => {
      try {
        const res = await fetch("/api/collections", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { collections?: Array<{ id: string; name: string }>; };
        if (isMounted && Array.isArray(data.collections) && data.collections.length > 0) {
          setCollections(data.collections);
          try {
            window.localStorage.setItem("collections", JSON.stringify(data.collections));
          } catch (_) {}
        }
      } catch (_) {
        // ignore
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter((file) => {
      const fileType = file.name.split(".").pop()?.toLowerCase();
      return fileType === FILE_TYPE_PNG || fileType === FILE_TYPE_JSON;
    });

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter((file) => {
        const fileType = file.name.split(".").pop()?.toLowerCase();
        return fileType === FILE_TYPE_PNG || fileType === FILE_TYPE_JSON;
      });

      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setUploadStatus({
        success: false,
        message: "Please select files to upload",
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      
      files.forEach((file) => {
        formData.append("file", file);
      });
      
      // Send the collection name to the backend
      if (selectedCollection) {
        formData.append("collectionName", selectedCollection);
      }

      console.log(
        "Uploading files...",
        files.map((f) => f.name),
        "to collection:",
        selectedCollection || "Home (default)"
      );

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        // Don't set Content-Type header when sending FormData
        // The browser will automatically set the correct multipart/form-data with boundary
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload response not OK:", response.status, errorText);
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Upload result:", result);

      if (result.success) {
        setUploadStatus({
          success: true,
          message: `Successfully uploaded ${files.length} file(s)`,
        });
        setFiles([]);

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setUploadStatus({
          success: false,
          message: result.error || "Upload failed",
        });
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadStatus({
        success: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <main className="flex-1 p-8 relative overflow-hidden">
      {/* Enhanced Background decoration to match dashboard */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F5F9FC] via-[#5C9BB8]/10 to-[#E8F0F7]/25 -z-10"></div>

      {/* Floating background orbs */}
      <div className="absolute top-10 left-[10%] w-96 h-96 bg-gradient-to-r from-[#5C9BB8]/10 to-[#FC9770]/10 blur-3xl animate-float-slow opacity-40"></div>
      <div className="absolute bottom-20 right-[15%] w-80 h-80 bg-gradient-to-r from-[#FBC841]/10 to-[#E5A168]/10 blur-3xl animate-float-delayed opacity-40"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-8 flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-2">
              Upload <span className="gradient-text-enhanced">Files</span>
            </h1>
            <p className="text-lg md:text-xl text-[#4a4a4a]/90 leading-relaxed">
              Add your visualisations and images to the platform
            </p>
          </div>
          <ReturnToDashboard />
        </div>

        {uploadStatus && (
          <div
            className={`mb-6 p-5 animate-fade-in flex items-center gap-3 shadow-lg ${
              uploadStatus.success
                ? "bg-gradient-to-r from-[#5C9BB8]/10 to-[#7BAFD4]/10 border-2 border-[#5C9BB8] text-[#2a2a2a] backdrop-blur-sm"
                : "bg-red-50 border-2 border-red-500 text-red-700"
            }`}
          >
            {uploadStatus.success ? (
              <svg
                className="w-6 h-6 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span className="font-medium">{uploadStatus.message}</span>
          </div>
        )}

        <div
          className={`modern-card-enhanced p-12 mb-6 text-center transition-all duration-500 animate-scale-in backdrop-blur-md overflow-hidden
            ${
              isDragging
                ? "ring-4 ring-[#5C9BB8] bg-white/95 shadow-2xl shadow-[#5C9BB8]/40 scale-105"
                : "bg-white/80 hover:bg-white/90"
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Animated gradient overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-br from-[#5C9BB8]/8 via-[#FC9770]/5 to-[#FBC841]/8 transition-opacity duration-500 pointer-events-none ${isDragging ? "opacity-100" : "opacity-0"}`}
          ></div>

          <div className="mb-6 relative z-10">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div
                  className={`absolute inset-0 bg-[#5C9BB8]/30 blur-3xl transition-opacity duration-500 ${isDragging ? "opacity-100 animate-pulse" : "opacity-0"}`}
                ></div>
                <div className="relative p-8 bg-gradient-to-br from-[#5C9BB8]/20 to-[#FC9770]/20 backdrop-blur-sm">
                  <svg
                    className="w-20 h-20 text-[#5C9BB8] relative"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <p className="text-2xl font-bold mb-3 text-[#2a2a2a]">
              {isDragging ? "Drop files here!" : "Drag and drop files here"}
            </p>
            <p className="text-base text-[#4a4a4a]/80 mb-6 leading-relaxed">
              Supported formats:{" "}
              <span className="font-bold text-[#FC9770]">PNG</span>,{" "}
              <span className="font-bold text-[#5C9BB8]">JSON</span>
            </p>
          </div>

          <div className="flex justify-center relative z-10">
            <label className="group relative cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-[#5C9BB8] to-[#4a89a6] text-white px-10 py-4 font-bold shadow-xl shadow-[#5C9BB8]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#5C9BB8]/70 hover:-translate-y-0.5 overflow-hidden">
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5C9BB8] to-[#7BAFD4] opacity-0 group-hover:opacity-75 blur-sm transition-opacity duration-300"></div>

              <svg
                className="w-6 h-6 relative z-10 transition-transform group-hover:scale-110 group-hover:rotate-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span className="relative z-10 tracking-wide">Browse Files</span>
              <input
                type="file"
                className="hidden"
                multiple
                accept=".png,.json"
                onChange={handleFileInput}
              />
            </label>
          </div>
        </div>

        <div className="modern-card-enhanced p-8 animate-slide-up backdrop-blur-md bg-white/80">
            <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <span className="gradient-text-enhanced">Selected Files</span>
                <span className="relative">
                  <div className="absolute inset-0 bg-[#5C9BB8]/30 blur-md"></div>
                  <span className="relative text-base font-bold px-4 py-2 bg-gradient-to-r from-[#5C9BB8] to-[#7BAFD4] text-white shadow-lg">
                    {files.length}
                  </span>
                </span>
              </h2>
              {files.length > 0 && (
                <div className="flex items-center gap-3">
                  <label className="text-sm font-semibold text-[#4a4a4a]">
                    Add all files to:
                  </label>
                  <select
                    value={selectedCollection}
                    onChange={(e) => setSelectedCollection(e.target.value)}
                    className="px-4 py-2 border border-[#5C9BB8]/30 bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#5C9BB8]/40 focus:border-transparent font-semibold"
                  >
                    <option value="">Home (default)</option>
                    {collections.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="space-y-4 mb-8">
              {files.length === 0 ? (
                <div className="p-5 bg-gradient-to-r from-[#F5F9FC] via-[#E8F0F7]/60 to-[#D8E4F0]/40 border border-[#5C9BB8]/15 text-center text-[#4a4a4a]/80 font-semibold">
                  No files selected yet
                </div>
              ) : (
                files.map((file, index) => (
                <div
                  key={index}
                  className="group relative flex items-center justify-between p-5 bg-gradient-to-r from-[#F5F9FC] via-[#E8F0F7]/60 to-[#D8E4F0]/40 border border-[#5C9BB8]/15 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: "scaleIn 0.5s ease-out backwards",
                  }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                  <div className="flex items-center gap-4 flex-1 relative z-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#5C9BB8]/20 blur-md"></div>
                      <div className="relative p-3 bg-gradient-to-br from-[#5C9BB8]/20 to-[#FC9770]/20 backdrop-blur-sm">
                        <svg
                          className="w-7 h-7 text-[#5C9BB8]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-lg truncate text-[#2a2a2a] group-hover:text-[#5C9BB8] transition-colors">
                        {file.name}
                      </div>
                      <div className="text-sm text-[#4a4a4a]/80 font-semibold">
                        {Math.round(file.size / 1024)} KB
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="relative z-10 p-2.5 text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-300 group-hover:scale-110"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              )))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleUpload}
                disabled={isUploading || files.length === 0}
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-[#FC9770] to-[#fb8659] text-white px-10 py-4 font-bold shadow-xl shadow-[#FC9770]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#FC9770]/70 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 overflow-hidden"
              >
                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FC9770] to-[#FBC841] opacity-0 group-hover:opacity-75 blur-sm transition-opacity duration-300"></div>

                {isUploading ? (
                  <>
                    <span className="loading-dots relative z-10">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </span>
                    <span className="relative z-10 tracking-wide">Uploading</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-6 h-6 relative z-10 transition-transform group-hover:scale-110"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-6"
                      />
                    </svg>
                    <span className="relative z-10 tracking-wide">
                      Upload Files
                    </span>
                  </>
                )}
              </button>
            </div>
        </div>
      </div>
    </main>
  );
}
