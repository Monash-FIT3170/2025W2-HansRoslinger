import {
  HandLandmarker,
  DrawingUtils,
  GestureRecognizerResult,
} from "@mediapipe/tasks-vision";

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
    drawingUtils.drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS, {
      color: "#00FF00",
      lineWidth: 5,
    });
    drawingUtils.drawLandmarks(landmarks, {
      color: "#FF0000",
      lineWidth: 2,
    });
  });
};
