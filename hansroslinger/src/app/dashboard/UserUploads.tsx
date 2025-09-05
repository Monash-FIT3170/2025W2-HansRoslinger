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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 mx-auto max-w-4xl">
          <strong className="font-bold">Error loading your uploads: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {isLoading ? (
        <div className="flex flex-col justify-center items-center my-8 py-12 bg-gray-50 rounded-lg mx-auto max-w-4xl">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-3"></div>
          <span>Loading your uploads...</span>
        </div>
      ) : (
        <UploadsDisplay uploads={uploads} />
      )}
    </>
  );
}
