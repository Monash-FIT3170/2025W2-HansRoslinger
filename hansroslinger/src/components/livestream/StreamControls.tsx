"use client";

import { useState, useEffect, useRef } from "react";
import { Broadcaster } from "../../lib/livestream/webrtc";

interface StreamControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

/**
 * Component for controlling livestreaming functionality
 * Allows users to start/stop streaming and displays the stream link
 */
const StreamControls: React.FC<StreamControlsProps> = ({
  videoRef,
  canvasRef,
}) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamId, setStreamId] = useState<string | null>(null);
  const [viewerCount, setViewerCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const broadcasterRef = useRef<Broadcaster | null>(null);
  
  // Initialize the broadcaster
  useEffect(() => {
    broadcasterRef.current = new Broadcaster();
    
    // Set viewer count callback
    broadcasterRef.current.setViewerCountCallback((count) => {
      setViewerCount(count);
    });
    
    // Clean up on unmount
    return () => {
      if (broadcasterRef.current && isStreaming) {
        broadcasterRef.current.stopStream();
      }
    };
  }, [isStreaming]);
  
  // Toggle streaming on/off
  const toggleStreaming = async () => {
    if (isStreaming) {
      // Stop streaming
      if (broadcasterRef.current) {
        await broadcasterRef.current.stopStream();
      }
      setIsStreaming(false);
      setStreamId(null);
      setViewerCount(0);
    } else {
      // Start streaming
      if (videoRef.current && broadcasterRef.current) {
        try {
          // Create a composite stream from video and canvas
          const videoStream = videoRef.current.srcObject as MediaStream;
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          
          if (!videoStream || !context) {
            console.error("Cannot access video stream or canvas context");
            return;
          }
          
          // Set canvas dimensions to match video
          const videoWidth = videoRef.current.videoWidth;
          const videoHeight = videoRef.current.videoHeight;
          canvas.width = videoWidth;
          canvas.height = videoHeight;
          
          // Create a capture stream from the canvas
          const canvasStream = canvas.captureStream();
          
          // Add audio tracks from the video stream to the canvas stream
          videoStream.getAudioTracks().forEach((track) => {
            canvasStream.addTrack(track);
          });
          
          // Draw video and canvas overlay to the composite canvas
          const drawComposite = () => {
            if (!videoRef.current || !canvasRef.current) return;
            
            // Draw video frame
            context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
            
            // Draw canvas overlay
            context.drawImage(canvasRef.current, 0, 0, videoWidth, videoHeight);
            
            // Request next frame
            requestAnimationFrame(drawComposite);
          };
          
          // Start drawing
          drawComposite();
          
          // Start streaming the composite
          const id = await broadcasterRef.current.startStream(canvasStream);
          setStreamId(id);
          setIsStreaming(true);
        } catch (error) {
          console.error("Error starting stream:", error);
        }
      }
    }
  };
  
  // Copy stream link to clipboard
  const copyStreamLink = () => {
    if (!streamId) return;
    
    const streamUrl = `${window.location.origin}/livestream/${streamId}`;
    navigator.clipboard.writeText(streamUrl);
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2">
      <button
        onClick={toggleStreaming}
        className={`px-4 py-2 rounded-full font-medium ${
          isStreaming
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-green-500 hover:bg-green-600 text-white"
        }`}
      >
        {isStreaming ? "Stop Streaming" : "Start Streaming"}
      </button>
      
      {isStreaming && streamId && (
        <div className="bg-black bg-opacity-70 text-white p-2 rounded-md">
          <div className="flex items-center gap-2 text-sm">
            <span>{viewerCount} viewer{viewerCount !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center mt-2">
            <input
              type="text"
              readOnly
              value={`${window.location.origin}/livestream/${streamId}`}
              className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm w-56 mr-2"
            />
            <button
              onClick={copyStreamLink}
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreamControls;