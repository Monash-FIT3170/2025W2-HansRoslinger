import { InteractionInput } from "./types";
import { handleDrag } from "./actions/handleDrag";
import { handleResize } from "./actions/handleResize";
import { handleHover } from "./actions/handleHover";
import { useVisualStore } from "store/visualsSlice";

/**
 * The InteractionManager routes user input actions (e.g. drag, resize, hover)
 * to the correct handler based on pointer location and interaction type.
 */
export class InteractionManager {
  /**
   * Returns the current list of visuals from the Zustand store.
   * This reflects the latest state of all on-screen visual elements.
   */
  private get visuals() {
    return useVisualStore.getState().visuals;
  }

  /**
   * Main entry point for all interaction events.
   * Determines the target visual (if not explicitly provided) and
   * delegates the interaction to the appropriate handler.
   *
   * @param input - InteractionInput containing type, pointer position, and optional targetId
   */
  handleInput(input: InteractionInput) {
    const { x, y } = input.position;

    // Log input action, coordinates, and resolved target (for debugging)
    console.log("[Manager] Inputs:", input.type, "at", `(${x}, ${y})`);

    const targetId = input.targetId ?? this.findTargetAt(input.position);
    console.log("[Manager] Resolved Target:", targetId);

    if (!targetId) return;

    switch (input.type) {
      case "move":
        handleDrag(targetId, input.position);
        break;
      case "resize":
        handleResize(targetId, input.position);
        break;
      case "hover":
        if (typeof input.isHovered === "boolean") {
          handleHover(targetId, input.isHovered);
        }
        break;
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
    console.log("[Manager] Finding target at position:", position);

    for (const visual of this.visuals) {
      const { x, y } = visual.position;
      const { width, height } = visual.size;

      const withinBounds =
        position.x >= x &&
        position.x <= x + width &&
        position.y >= y &&
        position.y <= y + height;

      if (withinBounds) {
        console.log(`[Manager] Found target ${visual.assetId} under pointer at (${position.x}, ${position.y})`);
        return visual.assetId;
      }
    }

    console.log("[Manager] No target found at position:", position);
    return null;
  }

}
