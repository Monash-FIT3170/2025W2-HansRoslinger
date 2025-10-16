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
        <div className="mx-auto max-w-5xl px-6 mb-8 animate-fade-in">
          <div className="relative bg-gradient-to-r from-red-50 to-orange-50/50 border-2 border-red-200/60 p-6 backdrop-blur-sm overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-100/30 to-transparent pointer-events-none"></div>
            
            <div className="flex items-start gap-4 relative">
              <div className="flex-shrink-0 p-2 bg-red-100 border border-red-200">
                <svg className="w-7 h-7 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <strong className="font-bold text-red-800 text-lg block mb-1">Error loading uploads</strong>
                <span className="text-red-700/90 text-base leading-relaxed">{error}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="w-full py-24 px-6 relative overflow-hidden">
          {/* Background effects matching UploadsDisplay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#F5F9FC]/50 via-[#E8F0F7]/30 to-transparent"></div>
          <div className="absolute top-10 left-[10%] w-96 h-96 bg-gradient-to-r from-[#5C9BB8]/10 to-[#FC9770]/10 blur-3xl animate-float-slow opacity-40"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-4xl md:text-6xl font-bold mb-5 text-[#2a2a2a]">
                Your <span className="gradient-text-enhanced">Uploads</span>
              </h2>
              <p className="text-lg md:text-xl text-[#4a4a4a]/90 max-w-2xl mx-auto leading-relaxed">
                Click on any file to select it for preview
              </p>
            </div>
            
            <div className="flex flex-col justify-center items-center py-20 modern-card-enhanced animate-fade-in max-w-2xl mx-auto backdrop-blur-sm bg-white/80">
              <div className="relative mb-6">
                {/* Pulsing glow */}
                <div className="absolute inset-0 bg-[#5C9BB8]/30 blur-2xl animate-pulse"></div>
                <div className="relative">
                  <span className="loading-dots">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </span>
                </div>
              </div>
              <span className="text-2xl font-bold text-[#2a2a2a] mb-2">Loading your uploads...</span>
              <span className="text-base text-[#4a4a4a]/80">This won&apos;t take long</span>
            </div>
          </div>
        </div>
      ) : (
        <UploadsDisplay uploads={uploads} />
      )}
    </>
  );
}
