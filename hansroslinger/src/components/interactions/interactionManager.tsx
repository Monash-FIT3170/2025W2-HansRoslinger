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
  private hoveredTargetId: string | null = null;

  /**
   * Clear threshold prevents flicker when pinch gestures are too fast.
   * Without it: pinch → empty → empty → pinch. Will result in loss of target visual
   * With threshold: pinch → pinch. Does not clear target when the number of consecutive none is less then threshold
   */
  private readonly CLEAR_THRESHOLD = 3;
  private currentClearCount = 0;

  private get visuals() {
    return useVisualStore.getState().visuals;
  }

  private pinchStartDistance: number | null = null;
  private pinchStartSize: { width: number; height: number } | null = null;

  /**
   * Primary handler for all gesture-to-action mappings.
   * Called by `useGestureListener` with mapped ActionPayloads.
   */
  handleAction(actionPayload: ActionPayload) {
    // reset count
    this.currentClearCount = 0;
    const { action, coordinates } = actionPayload;

    if (!coordinates || coordinates.length === 0) return;

    // Use the first gesture point as the targeting reference
    const point = coordinates[0];
    const target = this.findTargetAt(point);

    // Flag for checking if action is same as previous action
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
    }
    this.gestureTargetId = target ? target.assetId : null;
    this.previousAction = action;
  }

  /**
   * Clear target and previous action
   * Only clear if the clear threshold is reached
   */
  handleClear() {
    if (this.currentClearCount === this.CLEAR_THRESHOLD) {
      handleHover(this.gestureTargetId, false);
      this.gestureTargetId = null;
      this.previousAction = null;
      this.hoveredTargetId = null;
      this.dragOffset = null;
      return;
    }
    this.currentClearCount += 1;
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

      if (withinBounds) {
      console.log('[Manager] Found target ${visual.assetId} under pointer at (${position.x}, ${position.y})'
      );
      return visual;
    }
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
      case "resize": {
        const target = this.findTargetAt(input.position);
        if (!target) break;
        // For mouse mock, use the same position for both pointers and a default pinch distance/size
        handleResize(
          target.assetId,
          input.position,
          input.position,
          1, // mock pinchStartDistance
          { ...target.size }, // mock pinchStartSize
        );
        break;
      }
      case "hover":
        handleHover(targetId, input.isHovered ?? true);
        break;
    }
  }
}
