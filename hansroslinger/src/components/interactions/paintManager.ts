import { GesturePayload } from "app/detection/Gesture";
import {
  paintStart,
  paintMove,
  paintEnd,
  isPainting,
} from "./actions/handlePaint";
import { eraserOverlay } from "./actions/eraserOverlay";

type Tool = "draw" | "erase";
type Point = { x: number; y: number };

const ERASER_MULTIPLIER = 3;
const EMPTY_LIMIT_FRAMES = 5; // end stroke after N empty frames
const SWITCH_HYSTERESIS_FRAMES = 3; // require N frames to switch tools
const JUMP_DISTANCE_THRESHOLD = 100; // px — break path if hand jumps too far

function getCanvas(): HTMLCanvasElement | null {
  return document.getElementById(
    "annotation-canvas",
  ) as HTMLCanvasElement | null;
}

function getAttr(name: string): string | null {
  return getCanvas()?.getAttribute(name) ?? null;
}
function setAttr(name: string, value: string) {
  const c = getCanvas();
  if (c) c.setAttribute(name, value);
}
function getStrokeWidth(): number {
  const w = Number(getAttr("data-stroke-width") ?? 4);
  return Number.isFinite(w) ? w : 4;
}
function setStrokeWidth(px: number) {
  setAttr("data-stroke-width", String(Math.max(1, Math.round(px))));
}
function setToolAttr(tool: Tool) {
  setAttr("data-tool", tool);
}

/** Eraser preview radius (device px); overlay converts to CSS px internally if needed */
function getEraseRadiusDevicePx(baseDrawWidth: number | null): number {
  const base = baseDrawWidth ?? getStrokeWidth(); // draw width we recorded or current
  return Math.max(1, (base * ERASER_MULTIPLIER) / 2);
}

/**
 * Paint Manager
 * - Single owner of paint-mode behavior: debounce, priority, hysteresis, overlay.
 * - Enlarges eraser by increasing `data-stroke-width` while erasing; restores when drawing.
 */
export class PaintManager {
  private emptyFrames = 0;
  private toolState: { current: Tool; vote: number } = {
    current: "draw",
    vote: 0,
  };

  // Remember the user's brush width so we can restore it after erasing.
  private savedDrawWidth: number | null = null;

  // Track last paint point to detect jump distances (prevents "connecting line" bug)
  private lastPaintPoint: Point | null = null;

  /** Call once per frame with ALL gesture payloads (only in paint mode). */
  processFrame(payloads: GesturePayload[]) {
    // No gestures → debounce stop + hide overlay
    if (!payloads || payloads.length === 0) {
      if (++this.emptyFrames >= EMPTY_LIMIT_FRAMES) {
        this.stopDrawing();
        this.emptyFrames = 0;
      }
      eraserOverlay?.clear?.();
      return;
    }

    this.emptyFrames = 0;

    // Choose target tool for this frame (eraser has priority over draw)
    const fist = payloads.find((p) => p.name === "closed_fist");
    const pinch = payloads.find((p) => p.name === "pinch");
    const target: Tool = fist
      ? "erase"
      : pinch
        ? "draw"
        : this.toolState.current;

    // Hysteresis for tool switching
    if (target !== this.toolState.current) {
      this.toolState.vote += 1;
      if (this.toolState.vote >= SWITCH_HYSTERESIS_FRAMES) {
        this.toolState.current = target;
        this.toolState.vote = 0;
        this.onToolSwitched(target);
      }
    } else {
      this.toolState.vote = 0;
    }

    // Execute only the stabilized tool for this frame
    if (this.toolState.current === "erase" && fist) {
      this.handleClosedFist(fist);
      return; // do not also draw
    }
    if (this.toolState.current === "draw" && pinch) {
      this.handlePinch(pinch);
      return;
    }
    // ignore other gestures in paint mode
  }

  /** Apply stroke-width changes when the tool switches. */
  private onToolSwitched(newTool: Tool) {
    if (newTool === "erase") {
      // Save current draw width (once per erase session) and bump the stroke width.
      if (this.savedDrawWidth == null) this.savedDrawWidth = getStrokeWidth();
      const eraseWidth = (this.savedDrawWidth ?? 4) * ERASER_MULTIPLIER;
      setStrokeWidth(eraseWidth);
      setToolAttr("erase");
    } else {
      // Restore the original draw width and tool attr.
      if (this.savedDrawWidth != null) setStrokeWidth(this.savedDrawWidth);
      setToolAttr("draw");
      // Reset for next erase session
      this.savedDrawWidth = null;
      // Hide overlay when returning to draw
      eraserOverlay?.clear?.();
    }
  }

  /** Draw with pinch (uses current brush width from data-stroke-width). */
  handlePinch(payload: GesturePayload) {
    const p = payload.points.pinchPoint;
    if (!p) return;
    eraserOverlay?.clear?.();

    // If already painting, check for large jump
    if (isPainting() && this.lastPaintPoint) {
      const jump = Math.hypot(
        p.x - this.lastPaintPoint.x,
        p.y - this.lastPaintPoint.y,
      );
      if (jump > JUMP_DISTANCE_THRESHOLD) {
        // Treat as a new stroke
        paintEnd();
        paintStart(p);
      } else {
        paintMove(p);
      }
    } else {
      // Start a new stroke
      paintStart(p);
    }

    // Update last point
    this.lastPaintPoint = p;
  }

  /** Erase with closed fist (uses enlarged stroke width, shows overlay). */
  handleClosedFist(payload: GesturePayload) {
    const p = payload.points.fistPoint || payload.points.erasePoint;
    if (!p) return;

    // Overlay radius reflects the actual (enlarged) erase size.
    eraserOverlay?.drawAt?.(p, getEraseRadiusDevicePx(this.savedDrawWidth));

    if (isPainting() && this.lastPaintPoint) {
      const jump = Math.hypot(
        p.x - this.lastPaintPoint.x,
        p.y - this.lastPaintPoint.y,
      );
      if (jump > JUMP_DISTANCE_THRESHOLD) {
        paintEnd();
        paintStart(p);
      } else {
        paintMove(p);
      }
    } else {
      paintStart(p);
    }

    this.lastPaintPoint = p;
  }

  /** Lift pen & hide overlay. */
  stopDrawing() {
    paintEnd();
    eraserOverlay?.clear?.();
    this.lastPaintPoint = null;
  }

  /** Clear only the annotation canvas; also hide overlay. */
  clearCanvas() {
    const canvas = getCanvas();
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    eraserOverlay?.clear?.();
    this.lastPaintPoint = null;
    console.log("[PaintManager] Canvas cleared");
  }
}

export const paintManager = new PaintManager();
