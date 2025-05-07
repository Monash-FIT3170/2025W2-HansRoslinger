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
    //check data is available 
    if(webcamRef.current !== null && webcamRef.current.video !== null && webcamRef.current.video.readyState === 4 && canvasRef.current !== null){
    //get video properties
      const video: HTMLVideoElement = webcamRef.current.video;
      const videoWidth: number = video.width;
      const videoHeight: number = video.height;
      //set video height and width
      webcamRef.current.video.width = videoWidth; //done to force the video height and width 
      webcamRef.current.video.height = videoHeight;

    //set canvas height and width
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    //make detections
    const hand: handpose.AnnotatedPrediction[] = await net.estimateHands(video);
    
    if(hand.length > 0){
      const GE = new fp.GestureEstimator([grabGesture,pinchGesture])

      const gesture = await GE.estimate(hand[0].landmarks, 8);
      console.log(hand)
      console.log(gesture);
    }

    

    //draw mesh
    const ctx: CanvasRenderingContext2D | null = canvasRef.current.getContext("2d");
    if(ctx !== null){
      // console.log(ctx)
      drawHand(hand, ctx);
    }
    }
  }

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