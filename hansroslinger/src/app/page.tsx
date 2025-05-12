"use client";

//import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import React, {useRef } from "react";
import { drawHand } from "./drawHand";
import "./page.css"
import grabGesture from './gestures/grabGesture';
import pinchGesture from './gestures/pinchGesture';
import pointGesture from './gestures/pointGesture';
import * as fp from 'fingerpose';

export default function Home() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const runHandpose = async (): Promise<void> => {
    const net: handpose.HandPose = await handpose.load();
    console.log("Handpose model loaded");
    //loop and detect hands
    setInterval(()=>{
      detect(net)
    }, 100)
  };

  const detect = async (net: handpose.HandPose) => {
    // Check data is available
    if (
      webcamRef.current !== null &&
      webcamRef.current.video !== null &&
      webcamRef.current.video.readyState === 4 &&
      canvasRef.current !== null
    ) {
      // Get video properties
      const video: HTMLVideoElement = webcamRef.current.video;
      const videoWidth: number = 640;
      const videoHeight: number = 480;

      // Set video height and width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make detections
      const hand: handpose.AnnotatedPrediction[] = await net.estimateHands(video);

      if (hand.length > 0) {
        const GE = new fp.GestureEstimator([grabGesture, pinchGesture]);

        const gesture = await GE.estimate(hand[0].landmarks, 8);
        console.log(hand);
        console.log(gesture);
      }

      // Draw mesh
      const ctx: CanvasRenderingContext2D | null = canvasRef.current.getContext("2d");
      if (ctx !== null) {
        // Mirror the canvas
        ctx.save(); // Save the current state
        ctx.scale(-1, 1); // Flip horizontally
        ctx.translate(-videoWidth, 0); // Adjust the position

        // Draw the video onto the canvas
        ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

        // Draw the hand mesh
        drawHand(hand, ctx);

        ctx.restore(); // Restore the original state
      }
    }
  };

  runHandpose();

  return (
    <div className="Webcam">
      <header className="Webcam-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
            transform: "scaleX(-1)"
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
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}