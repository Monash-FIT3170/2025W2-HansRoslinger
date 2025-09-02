type Point = { x: number; y: number };

let isDrawing = false;
let lastPoint: Point | null = null;

const getCanvas = (): HTMLCanvasElement | null => {
  return document.getElementById("annotation-canvas") as HTMLCanvasElement | null;
};

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
  ctx.globalCompositeOperation = tool === "erase" ? "destination-out" : "source-over";
  if (tool === "draw") ctx.strokeStyle = strokeColor;
};

export const paintStart = (point: Point) => {
  const ctx = getCtx();
  if (!ctx) return;
  applyStyleFromCanvas(ctx);
  isDrawing = true;
  lastPoint = { ...point };
};

export const paintMove = (point: Point) => {
  const ctx = getCtx();
  if (!ctx || !isDrawing) return;
  applyStyleFromCanvas(ctx);
  if (lastPoint) {
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  }
  lastPoint = { ...point };
};

export const paintEnd = () => {
  isDrawing = false;
  lastPoint = null;
};

export const isPainting = () => isDrawing;


