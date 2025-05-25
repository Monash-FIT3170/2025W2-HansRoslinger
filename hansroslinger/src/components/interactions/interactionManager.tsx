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

  private get visuals() {
    return useVisualStore.getState().visuals;
  }

  /**
   * Primary handler for all gesture-to-action mappings.
   * Called by `useGestureListener` with mapped ActionPayloads.
   */
  handleAction(actionPayload: ActionPayload) {
    const { action, coordinates } = actionPayload;

    if (!coordinates || coordinates.length === 0) return;

    // Use the first gesture point as the targeting reference
    const point = coordinates[0];
    const target = this.findTargetAt(point);

    // Flag for checking if action is same as previous action
    const isActionSameAsPrevious = this.previousAction === action;

    switch (action) {
      case MOVE: {
        // if action is move and previous is also move, move the same target, don't find new ones
        if (isActionSameAsPrevious) {
          if (this.gestureTargetId) {
            handleDrag(this.gestureTargetId, point, this.dragOffset!);
          }
          return;
        }
        // if from other action then to move action, use new target
        if (target) {
          // Calculate drag offset only on new visual grab
          // or if action is not the same as previous (say pinch --> open palm --> pinch
          // (in different position but still within the bounds of the visual))
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
        // Use midpoint or first point if no second point is available
        if (target) handleResize(target.assetId, point);
        break;
      }
    }
    this.gestureTargetId = target ? target.assetId : null;
    this.previousAction = action;
  }

  /**
   * Clear target and previous action
   * Only clear if the clear threshold is reached
   */
  handleClear() {
    this.gestureTargetId = null;
    this.previousAction = null;
  }

  /**
   * Finds the visual (if any) currently under the given pointer position.
   * Used when no targetId is explicitly provided by the interaction stream.
   *
   * @param position - The current pointer position (x, y) relative to canvas
   * @returns first visual (with the highest index) that contains the pointer, or null if none match
   */
  private findTargetAt(position: { x: number; y: number }): Visual | null {
    for (const visual of [...this.visuals].reverse()) {
      const { x, y } = visual.position;
      const { width, height } = visual.size;

      const withinBounds =
        position.x >= x &&
        position.x <= x + width &&
        position.y >= y &&
        position.y <= y + height;

      if (withinBounds) return visual;
    }
    return null;
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
    }
  }
}
