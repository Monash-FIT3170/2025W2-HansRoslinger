"use client";

import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { HandDetection } from "./components/handDetection";
import { GestureRecognition } from "./components/gestureRecognition";
import { useCanvasRenderer } from "./components/useCanvasRenderer";

export default function Home() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure the code only runs on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get the video element from the webcam
  const videoElement = webcamRef.current?.video || null;

  // Use custom hooks for hand detection and gesture recognition
  const hands = HandDetection(videoElement); // Always call the hook
  const gesture = hands.length > 0 ? GestureRecognition(hands[0]) : null;

  // Use canvas rendering
  useCanvasRenderer(canvasRef, videoElement, hands);

  if (!isClient) {
    console.log("Home: Rendering on the server. Skipping client-specific logic.");
    return null; // Prevent rendering until on the client
  }

  console.log("Home: Hands detected:", hands);
  console.log("Home: Gesture recognized:", gesture);

  return (
    <div className="Webcam">
      <header className="Webcam-header">
        <Webcam
          ref={webcamRef}
          mirrored={true}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 0, // Ensure video is on below
            width: 640,
            height: 480,
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 1, // Ensure canvas is on top of the video
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}