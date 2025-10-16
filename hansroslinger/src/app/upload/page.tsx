"use client";

import { useState } from "react";
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

      console.log(
        "Uploading files...",
        files.map((f) => f.name),
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
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F5F9FC] via-[#5C9BB8]/6 to-[#E8F0F7]/15 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-amber-900/10 -z-10"></div>
      
      <div className="max-w-4xl mx-auto relative">
        <div className="mb-8 flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Upload <span className="gradient-text">Files</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Add your visualisations and images to the platform
            </p>
          </div>
          <ReturnToDashboard />
        </div>

        {uploadStatus && (
          <div
            className={`mb-6 p-4 animate-fade-in flex items-center gap-3 ${
              uploadStatus.success
                ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
                : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
            }`}
          >
            {uploadStatus.success ? (
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <span className="font-medium">{uploadStatus.message}</span>
          </div>
        )}

        <div
          className={`modern-card p-12 mb-6 text-center transition-all duration-300 animate-scale-in
            ${isDragging ? "ring-4 ring-[#5C9BB8] bg-[#5C9BB8]/10 scale-105" : ""}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <div className="p-6 bg-gradient-to-br from-[#5C9BB8]/20 to-[#D8E4F0]/35">
                <svg className="w-16 h-16 text-[#5C9BB8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
            </div>
            <p className="text-xl font-semibold mb-2 text-foreground">
              {isDragging ? "Drop files here!" : "Drag and drop files here"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Supported formats: <span className="font-semibold text-[#FC9770]">PNG</span>, <span className="font-semibold text-[#5C9BB8]">JSON</span>
            </p>
          </div>

          <div className="flex justify-center">
            <label className="group cursor-pointer inline-flex items-center gap-2 bg-[#5C9BB8] text-white px-8 py-3 font-semibold shadow-lg shadow-[#5C9BB8]/30 transition-all hover:shadow-xl hover:shadow-[#5C9BB8]/40 hover:-translate-y-0.5 hover:bg-[#4a89a6]">
              <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Browse Files
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

        {files.length > 0 && (
          <div className="modern-card p-6 animate-slide-up">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="gradient-text">Selected Files</span>
              <span className="text-sm font-normal px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                {files.length}
              </span>
            </h2>
            <div className="space-y-3 mb-6">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate text-foreground">{file.name}</div>
                      <div className="text-sm text-gray-500">
                        {Math.round(file.size / 1024)} KB
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 font-semibold shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isUploading ? (
                  <>
                    <div className="spinner w-5 h-5 border-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-6" />
                    </svg>
                    Upload Files
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
