import { GesturePayload } from "app/detection/Gesture";
import { paintStart, paintMove, paintEnd, isPainting } from "./actions/handlePaint";

/**
 * Paint Manager - handles all paint mode gesture interactions
 */
export class PaintManager {
  /**
   * Handle pinch gesture for drawing
   */
  handlePinch(payload: GesturePayload) {
    const pinchPoint = payload.points.pinchPoint;
    if (!pinchPoint) return;

    // Delegate to paint helpers so behavior matches AnnotationLayer
    if (!isPainting()) {
      paintStart(pinchPoint);
    } else {
      paintMove(pinchPoint);
    }
  }

  /**
   * Handle open palm gesture (could be used for erasing or changing tools)
   */
  handleOpenPalm(_payload: GesturePayload) {
    console.log("[PaintManager] Open palm gesture detected");
  }

  /**
   * Handle double pinch gesture (could be used for changing brush size)
   */
  handleDoublePinch(_payload: GesturePayload) {
    console.log("[PaintManager] Double pinch gesture detected");
    // TODO: Implement brush size changing
  }

  /**
   * Handle point up gesture (could be used for color selection)
   */
  handlePointUp(_payload: GesturePayload) {
    console.log("[PaintManager] Point up gesture detected");
    // TODO: Implement color selection
  }

  /**
   * Stop drawing
   */
  stopDrawing() {
    paintEnd();
  }

  /**
   * Clear the canvas
   */
  clearCanvas() {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log("[PaintManager] Canvas cleared");
  }
}

// Export singleton instance
export const paintManager = new PaintManager();
