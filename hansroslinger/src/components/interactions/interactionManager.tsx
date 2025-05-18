import { InteractionInput } from "./types";
import { handleDrag } from "./actions/handleDrag";
import { handleResize } from "./actions/handleResize";
// import { handleHover } from "./actions/handleHover";
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
    // Resolve the target visual: use targetId if provided, otherwise find visual under pointer
    const targetId = input.targetId ?? this.findTargetAt(input.position);

    // Log input action and resolved target (for debugging)
    console.log("[Manager] Input:", input.type, "Target:", targetId);

    // If no valid target was found, exit early
    if (!targetId) return;

    // Dispatch to appropriate handler
    switch (input.type) {
      case "move":
        handleDrag(targetId, input.position);
        break;
      case "resize":
        handleResize(targetId, input.position);
        break;
      case "hover":
        // handleHover(targetId);
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
