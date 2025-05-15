import { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import '@tensorflow/tfjs-backend-webgl';
import * as mpHands from '@mediapipe/hands';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';

export type HandDetection = handPoseDetection.Hand[];


export const HandDetection = (video: HTMLVideoElement | null): HandDetection => {
  const [net, setNet] = useState<handPoseDetection.HandDetector | null>(null);
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
        // const loadedNet = await handpose.load();
        const model = handPoseDetection.SupportedModels.MediaPipeHands;
        const detectorConfig: handPoseDetection.MediaPipeHandsTfjsModelConfig = {
          runtime: 'tfjs',
          modelType: 'full',
        };
        const detector = await handPoseDetection.createDetector(model, detectorConfig);
        console.log("HandDetection: Model loaded successfully.");
        setNet(detector);
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