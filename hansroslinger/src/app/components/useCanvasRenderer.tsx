import { useEffect } from "react";
import { drawHand } from "../utils/drawHand";
import { IGesture } from "../types/core/IGesture";

export const useCanvasRenderer = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  video: HTMLVideoElement | null,
  hands: any,
  gesture: IGesture | null
) => {
  useEffect(() => {
    if (!canvasRef.current || !video || video.readyState !== 4) {
      console.log("useCanvasRenderer: Skipping rendering due to missing canvas, video, or video not ready.");
      return;
    }

    console.log("useCanvasRenderer: Starting rendering process.");

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.log("useCanvasRenderer: Failed to get canvas context.");
      return;
    }

    // Set canvas dimensions to match video
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    console.log("Canvas dimensions:", canvas.width, canvas.height);
    console.log("Video dimensions:", videoWidth, videoHeight);

    const render = () => {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Mirror the video feed
      ctx.save();
      ctx.scale(-1, 1); // Flip horizontally
      ctx.translate(-canvas.width, 0); // Align the mirrored video
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Draw detected hands
      console.log("useCanvasRenderer: Drawing hands:", hands);
      ctx.save();
      ctx.scale(-1, 1); // Flip horizontally again to match the video
      ctx.translate(-canvas.width, 0); // Align the mirrored hand landmarks
      drawHand(hands, ctx);
      ctx.restore();

      // Display gesture information in the bottom-right corner
      ctx.save();
      ctx.font = "30px Arial"; // Increase font size for better visibility
      ctx.fillStyle = "white"; // Ensure text color contrasts with the background
      ctx.textAlign = "right";

      if (gesture) {
        console.log("useCanvasRenderer: Displaying gesture:", gesture);
        ctx.fillText(`Gesture: ${gesture.name}`, canvas.width - 10, canvas.height - 30);
      } else {
        console.log("useCanvasRenderer: No gesture detected.");
        ctx.fillText("Gesture: none", canvas.width - 10, canvas.height - 30);
      }

      ctx.restore();
    };

    render();
  }, [canvasRef, video, hands, gesture]);
};