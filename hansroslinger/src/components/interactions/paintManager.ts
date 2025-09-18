import { GesturePayload } from "app/detection/Gesture";
import { paintStart, paintMove, paintEnd, isPainting } from "./actions/handlePaint";
import { eraserOverlay } from "./actions/eraserOverlay";


function setTool(tool: "draw" | "erase") {
  document.getElementById("annotation-canvas")?.setAttribute("data-tool", tool);
}

function getStrokeRadius(): number {
  const w = Number(document.getElementById("annotation-canvas")?.getAttribute("data-stroke-width") || 4);
  return Math.max(1, w / 2);
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

    setTool("draw");
    eraserOverlay.clear();

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
    eraserOverlay.drawAt(p, getStrokeRadius());

    if (!isPainting()) paintStart(p);
    else paintMove(p);
  }

  /**
   * Stop drawing
   */
  stopDrawing() {
    paintEnd();
    eraserOverlay.clear();
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
    eraserOverlay.clear();
    console.log("[PaintManager] Canvas cleared");
  }
}

// Export singleton instance
export const paintManager = new PaintManager();
