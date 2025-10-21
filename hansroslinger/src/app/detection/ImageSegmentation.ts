import { ImageSegmenter, FilesetResolver } from "@mediapipe/tasks-vision";

let imageSegmenter: ImageSegmenter;
const runningMode: "VIDEO" | "IMAGE" = "VIDEO";

export const createImageSegmenter = async () => {
  try {
    console.log("Initializing image segmenter...");
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
    );
    
    imageSegmenter = await ImageSegmenter.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter_landscape/float16/latest/selfie_segmenter_landscape.tflite",
        delegate: "GPU",
      },
      runningMode: runningMode,
      outputCategoryMask: true,
    });
    console.log("Image segmenter initialized successfully");
  } catch (error) {
    console.error("Failed to initialize image segmenter:", error);
    throw error;
  }
};

// Initialize the segmenter when first needed
let isInitialized = false;

const ensureInitialized = async () => {
  if (!isInitialized) {
    await createImageSegmenter();
    isInitialized = true;
  }
};

// Common function to process segmentation and apply background effects
const processSegmentationWithBackground = async (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  backgroundProcessor: (data: Uint8ClampedArray, mask: Float32Array, imageData: ImageData) => void
) => {
  const startTimeMs = performance.now();
  
  try {
    console.log("Processing segmentation...", { videoWidth: video.videoWidth, videoHeight: video.videoHeight, canvasWidth: canvas.width, canvasHeight: canvas.height });
    
    const segmentationResult = imageSegmenter.segmentForVideo(
      video,
      startTimeMs,
    );

    console.log("Segmentation result:", segmentationResult);

    if (segmentationResult.categoryMask) {
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Failed to get canvas context");
        return;
      }

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the original video frame (no mirroring for processing)
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get image data and mask
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const mask = segmentationResult.categoryMask.getAsFloat32Array();

      console.log("Mask data length:", mask.length, "Image data length:", data.length, "Canvas size:", canvas.width, "x", canvas.height);

      // Apply background processing
      backgroundProcessor(data, mask, imageData);

      // Put the processed image data back
      ctx.putImageData(imageData, 0, 0);
      
      // Create a temporary canvas for mirroring
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      
      if (tempCtx) {
        // Copy the processed result to temp canvas
        tempCtx.putImageData(imageData, 0, 0);
        
        // Clear the main canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Mirror the temp canvas to the main canvas
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
        ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
        ctx.restore();
      }
    } else {
      console.warn("No category mask returned from segmentation");
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
  console.log("Starting background removal with color:", backgroundColor);
  await ensureInitialized();
  await processSegmentationWithBackground(video, canvas, (data, mask) => {
    console.log("Processing background removal...", { dataLength: data.length, maskLength: mask.length });
    let backgroundPixels = 0;
    let foregroundPixels = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const maskIndex = (i / 4) | 0;
      const maskValue = mask[maskIndex];

      // Use a more aggressive threshold for cleaner edges
      const threshold = 0.1; // Lower threshold for more aggressive background removal
      
      if (maskValue < threshold) {
        foregroundPixels++;
        // Foreground pixels (person) - keep original
      } else {
        backgroundPixels++;
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
    console.log("Background removal complete:", { backgroundPixels, foregroundPixels });
    
    // Debug: check mask value distribution
    const maskValues = mask.slice(0, 100); // Sample first 100 values
    const minMask = Math.min(...maskValues);
    const maxMask = Math.max(...maskValues);
    const avgMask = maskValues.reduce((a, b) => a + b, 0) / maskValues.length;
    console.log("Mask value stats:", { minMask, maxMask, avgMask, sampleValues: maskValues.slice(0, 10) });
  });
};

export const processBackgroundBlur = async (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  blurRadius: number = 10
) => {
  await ensureInitialized();
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
        // Foreground pixels (person) - keep original
      } else {
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
