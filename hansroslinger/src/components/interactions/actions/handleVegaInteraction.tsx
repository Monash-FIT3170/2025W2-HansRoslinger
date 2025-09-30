import { Visual } from "types/application";
import { handleHover } from "./handleHover";
import { containerStore } from "store/containerSlice";

// Track last simulated pointer position and target to prevent spamming events
let lastSimulatedPosition: { x: number; y: number } | null = null;
let lastSimulatedTargetId: string | null = null;
let lastTargetElement: HTMLCanvasElement | null = null;
let lastClientXY: { x: number; y: number } | null = null;

export const handleVegaInteraction = (
  position: { x: number; y: number } | null,
  visual: Visual | null,
) => {
  // console.log("[Manager] Finding target at position:", position);
  if (!visual || !position) {
    if (lastTargetElement) {
      simulateExitEvents(lastTargetElement, lastClientXY ?? { x: 0, y: 0 });
    }
    clearLastState();
    return;
  }

  const targetChanged =
    lastSimulatedTargetId !== null && lastSimulatedTargetId !== visual.assetId;

  // Only simulate pointer events if position or target changed
  if (
    !lastSimulatedPosition ||
    lastSimulatedPosition.x !== position.x ||
    lastSimulatedPosition.y !== position.y ||
    targetChanged
  ) {
    if (targetChanged && lastTargetElement) {
      simulateExitEvents(lastTargetElement, lastClientXY ?? { x: 0, y: 0 });
    }
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
  visual: Visual,
) => {
  if (!position) return;

  if (!visual) {
    console.warn("No visual found for pointer event simulation");
    return;
  }

  // Get the canvas used to detect gesture
  const { container } = containerStore.getState();
  if (!container) {
    console.warn("Canvas used to detect gesture not found");
    return;
  }

  // Get the client area and calculate the x and y respective to the client bounding area
  const rect = container.getBoundingClientRect();
  // Map to client coordinates
  const clientX = rect.left + position.x;
  const clientY = rect.top + position.y;

  // Always dispatch events directly to the Vega canvas so the overlay
  // doesn't intercept them. Using `elementFromPoint` here would return the
  // overlay div, preventing Vega from receiving pointer events for tooltips.

  // When there is multiple vega chart, there can be multiple Vega canvas
  // To find the right canvas for this specific point, get all the element
  // under this point and filter of canvas marks.
  // When there is multiple under the same point, it gets the very top canvas.
  const stack = document.elementsFromPoint(clientX, clientY);
  const target = stack.find(
    (el) => el instanceof HTMLCanvasElement && el.matches("canvas.marks"),
  ) as HTMLCanvasElement;
  if (!target) return;

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
      }),
    ),
  );

  lastTargetElement = target;
  lastClientXY = { x: clientX, y: clientY };
};

const simulateExitEvents = (
  target: HTMLCanvasElement,
  clientXY: { x: number; y: number },
) => {
  const { x: clientX, y: clientY } = clientXY;

  // Out/leave burst — pointer then mouse. Include pointercancel to be safe.
  const exitEvents = [
    "pointerout",
    "pointerleave",
    "pointercancel",
    "mouseout",
    "mouseleave",
  ];

  exitEvents.forEach((type) => {
    // const EventClass = type.startsWith("pointer") ? PointerEvent : MouseEvent;
    target.dispatchEvent(
      new PointerEvent(type, {
        bubbles: true,
        cancelable: true,
        pointerId: 1,
        pointerType: "mouse",
        isPrimary: true,
        clientX,
        clientY,
      }),
    );
  });

  handleHover(lastSimulatedTargetId, false);
};

const clearLastState = () => {
  lastSimulatedPosition = null;
  lastSimulatedTargetId = null;
  lastTargetElement = null;
  lastClientXY = null;
};
