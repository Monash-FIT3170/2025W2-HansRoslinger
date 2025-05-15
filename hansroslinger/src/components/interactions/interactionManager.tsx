import { InteractionInput } from "./types";
import { handleDrag } from "./actions/handleDrag"
import { handleResize } from "./actions/handleResize";
import { handleHover } from "./actions/handleHover";
import { useVisualStore } from "app/store/visualsSlice";

export class InteractionManager {
  private get visuals() {
    return useVisualStore.getState().Visuals;
  }

  handleInput(input: InteractionInput) {
    const targetId = input.targetId ?? this.findTargetAt(input.position);
    console.log("[Manager] Input:", input.type, "Target:", targetId);

    if (!targetId) return;

    switch (input.type) {
      case "move":
        handleDrag(targetId, input.position);
        break;
      case "resize":
        handleResize(targetId, input.position);
        break;
      case "hover":
        handleHover(targetId);
        break;
    }
  }

  private findTargetAt(position: { x: number; y: number }): string | null {
    for (const [id, visual] of Object.entries(this.visuals)) {
      const { x, y } = visual.position;
      const { width, height } = visual.size;
      if (
        position.x >= x &&
        position.x <= x + width &&
        position.y >= y &&
        position.y <= y + height
      ) {
        return id;
      }
    }
    return null;
  }
}
