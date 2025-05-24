import { handleDrag } from "./actions/handleDrag";
import { handleResize } from "./actions/handleResize";
import { handleHover } from "./actions/handleHover";
import { useVisualStore } from "store/visualsSlice";
import { InteractionInput, ActionPayload } from "types/application";

export class InteractionManager {
  private gestureTargetId: string | null = null;
  private dragOffset: { x: number; y: number } | null = null;

  private get visuals() {
    return useVisualStore.getState().visuals;
  }

  handleInput(input: InteractionInput) {
    const targetId = input.targetId ?? this.findTargetAt(input.position);
    console.log("[Manager] Input:", input.type, "Target:", targetId);

    if (!targetId) return;

    switch (input.type) {
      case "move":
        handleDrag(targetId, input.position, {x:0, y:0});
        break;
      case "resize":
        handleResize(targetId, input.position);
        break;
      case "hover":
        handleHover(targetId, input.isHovered ?? true);
        break;
    }
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
    const targetId = this.findTargetAt(point);
    if (!targetId) return;

    const store = useVisualStore.getState();
    const visual = store.getVisual(targetId);
    if (!visual) return;

    switch (action) {
      case "move": {
        // Calculate drag offset only on new visual grab
        if (this.gestureTargetId !== targetId) {
          this.gestureTargetId = targetId;
          this.dragOffset = {
            x: point.x - visual.position.x,
            y: point.y - visual.position.y,
          };
        }

        handleDrag(targetId, point, this.dragOffset!);
        break;
      }

      case "hover":
        handleHover(targetId, true);
        break;

      case "resize": {
        // Use midpoint or first point if no second point is available
        handleResize(targetId, point);
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

      if (withinBounds) return visual.assetId;
    }
    return null;
  }
}
