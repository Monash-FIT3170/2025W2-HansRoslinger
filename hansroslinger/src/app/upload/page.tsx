"use client";

import { useState } from "react";
import { FILE_TYPE_JSON, FILE_TYPE_PNG } from "../../constants/application";
import Image from "next/image";
import ReturnToDashboard from "@/components/ReturnToDashboard";

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

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
    const validFiles = droppedFiles.filter(file => {
      const fileType = file.name.split('.').pop()?.toLowerCase();
      return fileType === FILE_TYPE_PNG || fileType === FILE_TYPE_JSON;
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter(file => {
        const fileType = file.name.split('.').pop()?.toLowerCase();
        return fileType === FILE_TYPE_PNG || fileType === FILE_TYPE_JSON;
      });

      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleUpload = async () => {
    // TODO: Implement actual file upload logic here
    // This would typically involve sending the files to your backend
    console.log('Files to upload:', files);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <main className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <ReturnToDashboard />
        </div>
        
        <h1 className="text-3xl font-bold mb-8">Upload Files</h1>

        <div 
          className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
            ${files.length > 0 ? 'bg-gray-50' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="mb-4">
            <p className="text-lg mb-2">Drag and drop files here</p>
            <p className="text-sm text-gray-500">Supported formats: PNG, JSON</p>
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
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="text-gray-600">{file.name}</div>
                    <div className="text-sm text-gray-400">({Math.round(file.size / 1024)} KB)</div>
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
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
              >
                Upload Files
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
