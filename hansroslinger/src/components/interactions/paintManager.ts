import { GesturePayload } from "app/detection/Gesture";
import {
  paintStart,
  paintMove,
  paintEnd,
  isPainting,
} from "./actions/handlePaint";


function setTool(tool: "draw" | "erase") {
  const canvas = document.getElementById("annotation-canvas");
  if (canvas) canvas.setAttribute("data-tool", tool);
}

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

  handleClosedFist(payload: GesturePayload) {
    // Your ClosedFist payload uses `fistPoint`
    const p = payload.points.fistPoint || payload.points.erasePoint;
    if (!p) return;

    setTool("erase");
    if (!isPainting()) paintStart(p);
    else paintMove(p);
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
