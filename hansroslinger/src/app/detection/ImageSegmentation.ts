import { ImageSegmenter, FilesetResolver } from "@mediapipe/tasks-vision";

let imageSegmenter: ImageSegmenter;
const runningMode: "VIDEO" | "IMAGE" = "VIDEO";

export const createImageSegmenter = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
  );
  
  imageSegmenter = await ImageSegmenter.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmentation/float16/1/selfie_segmentation.tflite",
      delegate: "GPU",
    },
    runningMode: runningMode,
    outputCategoryMask: true,
  });
  console.log("Image segmenter initialized");
};

// Initialize the segmenter
await createImageSegmenter();

// Common function to process segmentation and apply background effects
const processSegmentationWithBackground = async (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  backgroundProcessor: (data: Uint8ClampedArray, mask: Float32Array, imageData: ImageData) => void
) => {
  const startTimeMs = performance.now();
  
  try {
    const segmentationResult = imageSegmenter.segmentForVideo(
      video,
      startTimeMs,
    );

    if (segmentationResult.categoryMask) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the original video frame
      ctx.save();
      ctx.scale(-1, 1); // Mirror the video
      ctx.translate(-canvas.width, 0);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Get image data and mask
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const mask = segmentationResult.categoryMask.getAsFloat32Array();

      // Apply background processing
      backgroundProcessor(data, mask, imageData);

      // Put the processed image data back
      ctx.putImageData(imageData, 0, 0);
    }
  } catch (error) {
    console.error("Background processing error:", error);
  }
};

export const processBackgroundRemoval = async (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  backgroundColor: string = "transparent"
) => {
  await processSegmentationWithBackground(video, canvas, (data, mask) => {
    for (let i = 0; i < data.length; i += 4) {
      const maskIndex = (i / 4) | 0;
      const maskValue = mask[maskIndex];

      if (maskValue < 0.5) {
        // Background pixels - replace with background color
        if (backgroundColor === "transparent") {
          data[i + 3] = 0; // Set alpha to 0 for transparency
        } else {
          // Set to solid background color
          const color = hexToRgb(backgroundColor);
          if (color) {
            data[i] = color.r;     // Red
            data[i + 1] = color.g; // Green
            data[i + 2] = color.b; // Blue
            data[i + 3] = 255;     // Alpha
          }
        }
      }
    }
  });
};

export const processBackgroundBlur = async (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  blurRadius: number = 10
) => {
  // Create blurred background image
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  
  if (!tempCtx) return;

  // Draw and blur the video
  tempCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
  tempCtx.filter = `blur(${blurRadius}px)`;
  tempCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  const blurredData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
  const blurredPixels = blurredData.data;

  await processSegmentationWithBackground(video, canvas, (data, mask) => {
    for (let i = 0; i < data.length; i += 4) {
      const maskIndex = (i / 4) | 0;
      const maskValue = mask[maskIndex];

      if (maskValue < 0.5) {
        // Background pixels - use blurred version
        data[i] = blurredPixels[i];         // Red
        data[i + 1] = blurredPixels[i + 1]; // Green
        data[i + 2] = blurredPixels[i + 2]; // Blue
        data[i + 3] = blurredPixels[i + 3]; // Alpha
      }
    }
  });
};

// Helper function to convert hex color to RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};
