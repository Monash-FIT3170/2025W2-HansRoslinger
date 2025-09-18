type Pt = { x: number; y: number };

const getOverlay = () =>
  document.getElementById("annotation-overlay") as HTMLCanvasElement | null;

export const eraserOverlay = {
  clear() {
    const c = getOverlay(); if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
  },
  drawAt(point: Pt, radiusPx: number) {
    const c = getOverlay(); if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.save();
    ctx.beginPath();
    ctx.arc(point.x, point.y, Math.max(1, radiusPx), 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.strokeStyle = "rgba(255,255,255,0.85)";
    ctx.lineWidth = 1;
    ctx.fill(); ctx.stroke(); ctx.restore();
  },
};
