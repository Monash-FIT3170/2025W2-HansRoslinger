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
    <main className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <ReturnToDashboard />
        </div>

        <h1 className="text-3xl font-bold mb-8">Upload Files</h1>

        {uploadStatus && (
          <div
            className={`mb-6 p-4 rounded-md ${
              uploadStatus.success
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {uploadStatus.message}
          </div>
        )}

        <div
          className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center
            ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}
            ${files.length > 0 ? "bg-gray-50" : ""}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="mb-4">
            <p className="text-lg mb-2">Drag and drop files here</p>
            <p className="text-sm text-gray-500">
              Supported formats: PNG, JSON
            </p>
          </div>

          <div className="flex justify-center">
            <label className="cursor-pointer bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
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
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Selected Files</h2>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-gray-600">{file.name}</div>
                    <div className="text-sm text-gray-400">
                      ({Math.round(file.size / 1024)} KB)
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className={`${
                  isUploading
                    ? "bg-gray-400"
                    : "bg-green-500 hover:bg-green-600"
                } text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center`}
              >
                {isUploading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  "Upload Files"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
