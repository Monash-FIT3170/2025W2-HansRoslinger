type Point = { x: number; y: number };

let isDrawing = false;
let lastPoint: Point | null = null;
let hasActivePath = false;

const getCanvas = (): HTMLCanvasElement | null =>
  document.getElementById("annotation-canvas") as HTMLCanvasElement | null;

const getCtx = (): CanvasRenderingContext2D | null => {
  const canvas = getCanvas();
  if (!canvas) return null;
  return canvas.getContext("2d");
};

const applyStyleFromCanvas = (ctx: CanvasRenderingContext2D) => {
  const canvas = getCanvas();
  if (!canvas) return;

  const tool = (canvas.getAttribute("data-tool") || "draw") as "draw" | "erase";
  const strokeWidth = Number(canvas.getAttribute("data-stroke-width") || 4);
  const strokeColor = canvas.getAttribute("data-stroke-color") || "#00ff88";

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(1, strokeWidth);
  ctx.globalCompositeOperation =
    tool === "erase" ? "destination-out" : "source-over";
  if (tool === "draw") ctx.strokeStyle = strokeColor;
};

export const paintStart = (point: Point) => {
  const ctx = getCtx();
  if (!ctx) return;

  // Reset any dangling path
  ctx.beginPath();
  applyStyleFromCanvas(ctx);

  // Move first to avoid accidental line jump
  ctx.moveTo(point.x, point.y);
  hasActivePath = true;
  isDrawing = true;
  lastPoint = { ...point };
};

export const paintMove = (point: Point) => {
  const ctx = getCtx();
  if (!ctx || !isDrawing || !hasActivePath) return;

  applyStyleFromCanvas(ctx);

  // Defensive check: ensure large jump = new path (avoid connecting distant points)
  if (
    lastPoint &&
    Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y) > 200
  ) {
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  }

  ctx.lineTo(point.x, point.y);
  ctx.stroke();

  lastPoint = { ...point };
};

export const paintEnd = () => {
  const ctx = getCtx();
  if (ctx && hasActivePath) {
    ctx.closePath();
  }

  // Full reset of drawing state
  isDrawing = false;
  hasActivePath = false;
  lastPoint = null;
};

export const isPainting = () => isDrawing;
