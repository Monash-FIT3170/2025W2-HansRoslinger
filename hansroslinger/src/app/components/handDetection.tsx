import { useEffect, useState } from "react";
import * as handpose from "@tensorflow-models/handpose";
import * as tf from "@tensorflow/tfjs";

export type HandDetection = handpose.AnnotatedPrediction[];

export const HandDetection = (video: HTMLVideoElement | null): HandDetection => {
  const [net, setNet] = useState<handpose.HandPose | null>(null);
  const [hands, setHands] = useState<HandDetection>([]);

  useEffect(() => {
    const initializeBackend = async () => {
      try {
        console.log("HandDetection: Initializing TensorFlow.js backend.");
        await tf.setBackend("webgl"); // Use "webgl" as the backend
        await tf.ready(); // Ensure the backend is ready
        console.log("HandDetection: TensorFlow.js backend initialized.");
      } catch (error) {
        console.error("HandDetection: Failed to initialize TensorFlow.js backend.", error);
      }
    };

    const loadModel = async () => {
      try {
        console.log("HandDetection: Loading handpose model.");
        const loadedNet = await handpose.load();
        console.log("HandDetection: Model loaded successfully.");
        setNet(loadedNet);
      } catch (error) {
        console.error("HandDetection: Failed to load handpose model.", error);
      }
    };

    initializeBackend().then(loadModel);
  }, []);

  useEffect(() => {
    if (!net || !video || video.readyState !== 4) {
      console.log("HandDetection: Skipping detection due to missing model, video, or video not ready.");
      return;
    }

    console.log("HandDetection: Starting hand detection.");

    const detectHands = async () => {
      try {
        const predictions = await net.estimateHands(video);
        console.log("HandDetection: Hands detected:", predictions);
        setHands(predictions);
      } catch (error) {
        console.error("HandDetection: Error during hand detection.", error);
      }
    };

    const interval = setInterval(detectHands, 100); // Run detection every 100ms
    return () => {
      console.log("HandDetection: Cleaning up detection interval.");
      clearInterval(interval);
    };
  }, [net, video]);

  return hands;
};