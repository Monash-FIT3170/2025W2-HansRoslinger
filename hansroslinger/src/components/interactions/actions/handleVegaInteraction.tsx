import { Visual } from "types/application";

// Track last simulated pointer position and target to prevent spamming events
let lastSimulatedPosition: { x: number; y: number } | null = null;
let lastSimulatedTargetId: string | null = null;

export const handleVegaInteraction = (
  position: { x: number; y: number },
  visual: Visual
) => {
  // console.log("[Manager] Finding target at position:", position);

  const targetChanged =
    lastSimulatedTargetId !== null && lastSimulatedTargetId !== visual.assetId;

  // Only simulate pointer events if position or target changed
  if (
    !lastSimulatedPosition ||
    lastSimulatedPosition.x !== position.x ||
    lastSimulatedPosition.y !== position.y ||
    targetChanged
  ) {
    simulatePointerEvents(position, visual);
    lastSimulatedPosition = position;
    lastSimulatedTargetId = visual.assetId;
    return;
  }

  // Clear last simulated state if no target
  lastSimulatedPosition = null;
  lastSimulatedTargetId = null;
};

const simulatePointerEvents = (
  position: { x: number; y: number },
  visual: Visual
) => {
  if (!position) return;

  if (!visual) {
    console.warn("No visual found for pointer event simulation");
    return;
  }

  // Target the Vega canvas with class 'marks'
  const canvas = document.querySelector("canvas.marks") as HTMLCanvasElement;
  if (!canvas) {
    console.warn("Vega canvas with class 'marks' not found");
    return;
  }

  const rect = canvas.getBoundingClientRect();

  // Offset the pointer position by the visual's position
  const localX = position.x - visual.position.x;
  const localY = position.y - visual.position.y;

  // Map to client coordinates
  const clientX = rect.left + localX;
  const clientY = rect.top + localY;

  // Always dispatch events directly to the Vega canvas so the overlay
  // doesn't intercept them. Using `elementFromPoint` here would return the
  // overlay div, preventing Vega from receiving pointer events for tooltips.
  const target = canvas;

  [
    "pointerenter",
    "pointerover",
    "pointermove",
    "mouseenter",
    "mouseover",
    "mousemove",
  ].forEach((type) =>
    target.dispatchEvent(
      new PointerEvent(type, {
        bubbles: true,
        cancelable: true,
        pointerId: 1,
        pointerType: "mouse",
        isPrimary: true,
        clientX: clientX,
        clientY: clientY,
      })
    )
  );
};
