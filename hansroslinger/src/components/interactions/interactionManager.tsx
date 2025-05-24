import { handleDrag } from "./actions/handleDrag";
import { handleResize } from "./actions/handleResize";
import { handleHover } from "./actions/handleHover";
import { useVisualStore } from "store/visualsSlice";
import { ActionPayload, InteractionInput } from "types/application";
import { GesturePayload } from "app/detection/Gesture";

/**
 * The InteractionManager routes user input actions (e.g. drag, resize, hover)
 * to the correct handler based on pointer location and interaction type.
 */
export class InteractionManager {
  private gestureTargetId: string | null = null;
  private dragOffset: { x: number; y: number } | null = null;

  /**
   * Returns the current list of visuals from the Zustand store.
   * This reflects the latest state of all on-screen visual elements.
   */
  private get visuals() {
    return useVisualStore.getState().visuals;
  }

  handleAction(actionPayload: ActionPayload) {
    console.log(actionPayload);
  }

  /**
   * Main entry point for all interaction events.
   * Determines the target visual (if not explicitly provided) and
   * delegates the interaction to the appropriate handler.
   *
   * @param input - InteractionInput containing type, pointer position, and optional targetId
   */
  handleInput(input: InteractionInput) {
    // Resolve the target visual: use targetId if provided, otherwise find visual under pointer
    const targetId = input.targetId ?? this.findTargetAt(input.position);

    // Log input action and resolved target (for debugging)
    console.log("[Manager] Input:", input.type, "Target:", targetId);

    // If no valid target was found, exit early
    if (!targetId) return;

    // Dispatch to appropriate handler
    switch (input.type) {
      case "move":
        handleDrag(targetId, input.position, {x: 0, y: 0});
        break;
      case "resize":
        handleResize(targetId, input.position);
        break;
      case "hover":
        handleHover(targetId, input.isHovered ?? true);
        break;
    }
  }

  handleGestureInput(payload: GesturePayload) {
    switch (payload.name) {
      case "Open_Palm": {
        const pos = payload.points.palmCenter;
        console.log(pos);
        const targetId = this.findTargetAt(pos);
        if (targetId) handleHover(targetId, true);
        break;
      }

      case "Pointing_Up": {
        const pos = payload.points.indexFingerTip;
        const targetId = this.findTargetAt(pos);
        if (targetId) handleHover(targetId, true);
        break;
      }

      case "Pinch": {
        const pos = payload.points.pinchPoint;
        const targetId = this.findTargetAt(pos);
        if (!targetId) {
          // Gesture moved off target → reset
          this.gestureTargetId = null;
          this.dragOffset = null;
          return;
        }

        const store = useVisualStore.getState();
        const visual = store.getVisual(targetId);
        if (!visual) return;

        // If new gesture target, calculate and store offset
        if (this.gestureTargetId !== targetId) {
          this.gestureTargetId = targetId;
          this.dragOffset = {
            x: pos.x - visual.position.x,
            y: pos.y - visual.position.y,
          };
        }

        // Reuse stored offset for drag
        handleDrag(targetId, pos, this.dragOffset!);
        break;
      }


      case "Double_Pinch": {
        const p1 = payload.points.pinchPoint1;
        const p2 = payload.points.pinchPoint2;
        const midpoint = {
          x: (p1.x + p2.x) / 2,
          y: (p1.y + p2.y) / 2,
        };
        const targetId = this.findTargetAt(midpoint);
        if (targetId) handleResize(targetId, midpoint);
        break;
      }
    }
  }  

  /**
   * Finds the visual (if any) currently under the given pointer position.
   * Used when no targetId is explicitly provided by the interaction stream.
   *
   * @param position - The current pointer position (x, y) relative to canvas
   * @returns assetId of the first visual that contains the pointer, or null if none match
   */
  private findTargetAt(position: { x: number; y: number }): string | null {
    for (const visual of this.visuals) {
      const { x, y } = visual.position;
      const { width, height } = visual.size;

      const withinBounds =
        position.x >= x &&
        position.x <= x + width &&
        position.y >= y &&
        position.y <= y + height;

      if (withinBounds) {
        return visual.assetId;
      }
    }

    // No matching visual found under the pointer
    return null;
  }
}
