type Pt = { x: number; y: number };

const getOverlay = () =>
  document.getElementById("annotation-overlay") as HTMLCanvasElement | null;

const getAnn = () =>
  document.getElementById("annotation-canvas") as HTMLCanvasElement | null;

// Convert a point expressed in *device pixels* to *CSS pixels*
// using the annotation canvas as source of truth.
function toCssPx(p: Pt): Pt {
  const ann = getAnn();
  if (!ann) return p;
  const dprX = ann.width / ann.clientWidth;
  const dprY = ann.height / ann.clientHeight;
  // usually equal, but keep independent to be safe
  return { x: p.x / dprX, y: p.y / dprY };
}

export const eraserOverlay = {
  clear() {
    const c = getOverlay();
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
  },

  // `point` is coming from gestures (device px). We'll convert to CSS px here.
  drawAt(point: Pt, radiusPx: number) {
    const c = getOverlay();
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const cssPt = toCssPx(point);
    const cssRadius = (() => {
      const ann = getAnn();
      if (!ann) return radiusPx;
      const dpr = ann.width / ann.clientWidth;
      return radiusPx / dpr; // radius was in device px if tied to lineWidth
    })();

    ctx.clearRect(0, 0, c.width, c.height);
    ctx.save();
    ctx.beginPath();
    ctx.arc(cssPt.x, cssPt.y, Math.max(1, cssRadius), 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.strokeStyle = "rgba(255,255,255,0.85)";
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  },
};
