import { GesturePayload } from "app/detection/Gesture";
import { paintStart, paintMove, paintEnd, isPainting } from "./actions/handlePaint";
import { eraserOverlay } from "./actions/eraserOverlay";

type Tool = "draw" | "erase";

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
  // internal stabilizers
  private emptyFrames = 0;
  private toolState: { current: Tool; vote: number } = { current: "draw", vote: 0 };

  private readonly EMPTY_LIMIT = 5;       // end stroke after N empty frames
  private readonly SWITCH_HYSTERESIS = 3; // require N frames to switch tools

  /** Call this once per frame with all gesture payloads */
  processFrame(payloads: GesturePayload[]) {
    // 0) no gestures → debounce & maybe end stroke
    if (!payloads || payloads.length === 0) {
      if (++this.emptyFrames >= this.EMPTY_LIMIT) {
        this.stopDrawing();
        this.emptyFrames = 0;
      }
      // hide HUD immediately
      eraserOverlay?.clear?.();
      return;
    }

    this.emptyFrames = 0;

    // choose target tool for this frame (eraser has priority)
    const fist = payloads.find((p) => p.name === "closed_fist");
    const pinch = payloads.find((p) => p.name === "pinch");
    const target: Tool = fist ? "erase" : pinch ? "draw" : this.toolState.current;

    // hysteresis: only switch tools after N consecutive frames
    if (target !== this.toolState.current) {
      this.toolState.vote += 1;
      if (this.toolState.vote >= this.SWITCH_HYSTERESIS) {
        this.toolState.current = target;
        this.toolState.vote = 0;
      }
    } else {
      this.toolState.vote = 0;
    }

    // execute only the stabilized tool
    if (this.toolState.current === "erase" && fist) {
      this.handleClosedFist(fist);
      return; // don't also draw this frame
    }
    if (this.toolState.current === "draw" && pinch) {
      this.handlePinch(pinch);
      return;
    }
    // ignore other gestures in paint mode for now
  }

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
