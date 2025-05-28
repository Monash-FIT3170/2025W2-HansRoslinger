import { handleDrag } from "./actions/handleDrag";
import { handleResize } from "./actions/handleResize";
import { handleHover } from "./actions/handleHover";
import { useVisualStore } from "store/visualsSlice";

import {
  ActionPayload,
  ActionType,
  InteractionInput,
  Visual,
} from "types/application";
import { HOVER, MOVE, RESIZE } from "constants/application";

export class InteractionManager {
  private gestureTargetId: string | null = null;
  private dragOffset: { x: number; y: number } | null = null;
  private previousAction: ActionType | null = null;

  /**
   * Clear threshold prevents flicker when pinch gestures are too fast.
   */
  private readonly CLEAR_THRESHOLD = 3;
  private currentClearCount = 0;

  // Track last simulated pointer position and target to prevent spamming events
  private lastSimulatedPosition: { x: number; y: number } | null = null;
  private lastSimulatedTargetId: string | null = null;

  private get visuals() {
    return useVisualStore.getState().visuals;
  }

  /**
   * Primary handler for all gesture-to-action mappings.
   * Called by `useGestureListener` with mapped ActionPayloads.
   */
  handleAction(actionPayload: ActionPayload) {
    this.currentClearCount = 0;
    const { action, coordinates } = actionPayload;

    if (!coordinates || coordinates.length === 0) return;

    const point = coordinates[0];
    const target = this.findTargetAt(point);

    const isActionSameAsPrevious = this.previousAction === action;

    switch (action) {
      case RESIZE: {
        // If no visual has been selected, don't resize visual
        if (!this.hoveredTargetId) {
          return;
        }

        const pointerA = coordinates[0];
        const pointerB = coordinates[1];

        const target =
          this.findTargetAt(pointerA) || this.findTargetAt(pointerB);
        if (!target) return;

        const distance = Math.hypot(
          pointerA.x - pointerB.x,
          pointerA.y - pointerB.y,
        );

        // if action is move and previous is also move, move the same target, don't find new ones
        if (
          this.hoveredTargetId &&
          this.pinchStartDistance &&
          this.pinchStartSize &&
          isActionSameAsPrevious
        ) {
          handleResize(
            this.hoveredTargetId,
            pointerA,
            pointerB,
            this.pinchStartDistance,
            this.pinchStartSize,
          );

          return;
        }

        if (
          this.pinchStartDistance == null ||
          this.pinchStartSize == null ||
          this.gestureTargetId !== target.assetId ||
          !isActionSameAsPrevious
        ) {
          this.pinchStartDistance = distance;
          this.pinchStartSize = { ...target.size };
          this.gestureTargetId = target.assetId;
          this.previousAction = action;
          return;
        }

        handleResize(
          target.assetId,
          pointerA,
          pointerB,
          this.pinchStartDistance,
          this.pinchStartSize,
        );

        this.gestureTargetId = target.assetId;
        this.previousAction = action;
        break;
      }
      case HOVER:
        this.hoveredTargetId = target ? target.assetId : null;
        handleHover(target ? target.assetId : null, true);
        break;

      case MOVE: {
        // If no visual has been selected, don't move visual
        if (!this.hoveredTargetId) {
          return;
        }

        // if action is move and previous is also move, move the same target, don't find new ones
        if (this.hoveredTargetId && this.dragOffset && isActionSameAsPrevious) {
          handleDrag(this.hoveredTargetId, point, this.dragOffset);
          return;
        }
        if (target) {
          if (
            this.gestureTargetId !== target.assetId ||
            !isActionSameAsPrevious
          ) {
            this.gestureTargetId = target.assetId;
            this.dragOffset = {
              x: point.x - target.position.x,
              y: point.y - target.position.y,
            };
          }
          handleDrag(target.assetId, point, this.dragOffset!);
        }
        break;
      }

      case HOVER:
        handleHover(target ? target.assetId : null, true);
        break;

      case RESIZE: {
        const targetIdOther = this.findTargetAt(coordinates[1]);
        if (!targetIdOther || targetIdOther.assetId === this.gestureTargetId)
          return;
        if (target) handleResize(target.assetId, point);
        break;
      }
    }

    this.gestureTargetId = target ? target.assetId : null;
    this.previousAction = action;
  }

  handleClear() {
    if (this.currentClearCount === this.CLEAR_THRESHOLD) {
      handleHover(this.gestureTargetId, false);
      this.gestureTargetId = null;
      this.previousAction = null;
      return;
    }
    this.currentClearCount += 1;
  }

  /**
   * Finds the visual under pointer position.
   * Also automatically runs pointer event simulation on the Vega canvas at the pointer position,
   * but only if the position or target changed (to avoid spamming events).
   */
  private findTargetAt(position: { x: number; y: number }): Visual | null {
    console.log("[Manager] Finding target at position:", position);

    for (const visual of [...this.visuals].reverse()) {
      const { x, y } = visual.position;
      const { width, height } = visual.size;

      const withinBounds =
        position.x >= x &&
        position.x <= x + width &&
        position.y >= y &&
        position.y <= y + height;

      if (withinBounds) {
        console.log(
          `[Manager] Found target ${visual.assetId} under pointer at (${position.x}, ${position.y})`,
        );

        // Only simulate pointer events if position or target changed
        if (
          !this.lastSimulatedPosition ||
          this.lastSimulatedPosition.x !== position.x ||
          this.lastSimulatedPosition.y !== position.y ||
          this.lastSimulatedTargetId !== visual.assetId
        ) {
          this.simulatePointerEvents(position);
          this.lastSimulatedPosition = position;
          this.lastSimulatedTargetId = visual.assetId;
        }

        return visual;
      }
    }

    console.log("[Manager] No target found at position:", position);

    // Clear last simulated state if no target
    this.lastSimulatedPosition = null;
    this.lastSimulatedTargetId = null;

    return null;
  }

  /**
   * Simulate mouse pointer events at given viewport coordinates.
   */
  simulatePointerEvents(position: { x: number; y: number }) {
    if (!position) return;

    const { x, y } = position;

    const canvas = document.querySelector(".vega-embed canvas");
    if (!canvas) {
      console.warn("Vega canvas not found");
      //return;
    }

    // Use the position as client coordinates for event dispatch
    const clientX = x;
    const clientY = y;

    // Find the element under the pointer or fallback to canvas
    const target = document.elementFromPoint(clientX, clientY) ?? canvas;

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
          clientX,
          clientY,
        }),
      ),
    );

    console.log("[InteractionManager] Dispatched pointer events", {
      clientX,
      clientY,
      target,
    });
  }

  // ONLY USED FOR MOUSE MOCK
  handleInput(input: InteractionInput) {
    const targetId =
      input.targetId ?? this.findTargetAt(input.position)?.assetId;
    console.log("[Manager] Input:", input.type, "Target:", targetId);

    if (!targetId) return;

    switch (input.type) {
      case "move":
        handleDrag(targetId, input.position, { x: 0, y: 0 });
        break;
      case "resize":
        handleResize(targetId, input.position);
        break;
      case "hover":
        handleHover(targetId, input.isHovered ?? true);
        break;
      case "point":
        // No action needed here; pointer simulation runs in findTargetAt
        break;
    }
  }
}
