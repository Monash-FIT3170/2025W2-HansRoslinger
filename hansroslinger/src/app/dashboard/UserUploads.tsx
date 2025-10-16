"use client";

import { useState, useEffect } from "react";
import UploadsDisplay from "./UploadsDisplay";
import { Uploads } from "types/application";

interface UserUploadsProps {
  initialUploads: Uploads;
}

export default function UserUploads({ initialUploads }: UserUploadsProps) {
  const [uploads, setUploads] = useState<Uploads>(initialUploads);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserUploads() {
      try {
        const response = await fetch("/api/user-uploads");
        if (!response.ok) {
          throw new Error(
            `Failed to fetch user uploads: ${response.statusText}`,
          );
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        // Merge the hardcoded uploads with user uploads
        // User uploads take precedence (will override if same key exists)
        setUploads((prevUploads) => ({
          ...prevUploads,
          ...data.uploads,
        }));
      } catch (err) {
        console.error("Error fetching user uploads:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load your uploads",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserUploads();
  }, []);

  return (
    <>
      {error && (
        <div className="mx-auto max-w-4xl px-6 mb-6 animate-fade-in">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <strong className="font-bold text-red-700 dark:text-red-400 block">Error loading uploads</strong>
                <span className="text-red-600 dark:text-red-400 text-sm">{error}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="w-full py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col justify-center items-center py-16 modern-card animate-fade-in">
              <div className="mb-4">
                <span className="loading-dots">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </span>
              </div>
              <span className="text-lg font-medium text-[#2a2a2a]">Loading your uploads...</span>
              <span className="text-sm text-[#4a4a4a] mt-2">This won&apos;t take long</span>
            </div>
          </div>
        </div>
      ) : (
        <UploadsDisplay uploads={uploads} />
      )}
    </>
  );
}
