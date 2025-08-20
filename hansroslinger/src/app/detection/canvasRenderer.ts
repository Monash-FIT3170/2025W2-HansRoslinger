import { DrawingUtils, GestureRecognizerResult } from "@mediapipe/tasks-vision";

export const canvasRenderer = async (
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  handLandmarks: GestureRecognizerResult,
) => {
  const canvasCtx = canvas.getContext("2d");
  const drawingUtils = new DrawingUtils(canvasCtx!);

  canvas.width = video.clientWidth;
  canvas.height = video.clientHeight;

  canvasCtx!.save();
  canvasCtx!.scale(-1, 1);
  canvasCtx!.translate(-canvas.width, 0);
  canvasCtx!.clearRect(0, 0, canvas.width, canvas.height);

  handLandmarks.landmarks.forEach((landmarks) => {
    // Only draw thumb and index finger tip
    // Index 4: thumb tip
    // Index 8: index finger tip
    drawingUtils.drawLandmarks([landmarks[4], landmarks[8]], {
      color: "#FF0000",
      lineWidth: 2,
    });
  });
};
