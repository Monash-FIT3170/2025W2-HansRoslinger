import { handleDrag } from "./actions/handleDrag";
import { handleResize } from "./actions/handleResize";
import { handleHover } from "./actions/handleHover";
import { useVisualStore } from "store/visualsSlice";
import {
  ActionPayload,
  HandIds,
  InteractionInput,
  Visual,
} from "types/application";
import {
  HOVER,
  LEFT,
  LEFT_RIGHT,
  MOVE,
  RESIZE,
  RIGHT,
} from "constants/application";

type GestureTrack = {
  visual: Visual | null;
  clearCount: number;
  dragOffset: { x: number; y: number } | null;
};

type HandVisualMap = Record<HandIds, GestureTrack>;

export class InteractionManager {
  // Clear count is added for each hand fue to flicker
  private handVisualMap: HandVisualMap = {
    left: {
      visual: null,
      clearCount: 0,
      dragOffset: null,
    },
    right: {
      visual: null,
      clearCount: 0,
      dragOffset: null,
    },
    left_right: {
      visual: null,
      clearCount: 0,
      dragOffset: null,
    },
  };

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
    this.handVisualMap[actionPayload.handId].clearCount = 0;

    const { action, coordinates } = actionPayload;

    const boundVisual = this.handVisualMap[actionPayload.handId].visual;
    let currentDragOffset = this.handVisualMap[actionPayload.handId].dragOffset;

    if (!coordinates || coordinates.length === 0) return;

    // Use the first gesture point as the targeting reference
    const point = coordinates[0];
    const target = this.findTargetAt(point);

    switch (action) {
      case RESIZE: {
        // Point for each hand
        const pointerA = coordinates[0];
        const pointerB = coordinates[1];
        let target;

        // If there is no bound visual --> just starting to resize (first time resize is called on this visual)
        // Find target at both hands and check if they are the same visual
        // Only set the target if it is the same (both hands are at the same visual)
        if (!boundVisual) {
          const targetA = this.findTargetAt(pointerA);
          const targetB = this.findTargetAt(pointerB);

          target = targetA?.assetId === targetB?.assetId ? targetA : null;

          // If there is a bound visual --> an ongoing resize
        } else {
          target = boundVisual;
        }

        // CHeck if target exists and if is hovered
        // If not hovered before resize, don't resize
        if (!target || !target.isHovered) return;

        // If start distance has been calculated and the visual has been bounded
        // This is an ongoing resize, don't calculate new start distance
        if (this.pinchStartDistance && this.pinchStartSize && target) {
          handleResize(
            target.assetId,
            pointerA,
            pointerB,
            this.pinchStartDistance,
            this.pinchStartSize,
          );
          return;
        }

        // if new visual resize, no calculation ahs been made and visual hasn't been bound yet
        // Calculate necessary calculation and update
        // Handle resize is not called here since this is the start of a resize (hand have not move)
        // Calculate the starting distance and size, and resize on next call
        if (
          this.pinchStartDistance == null ||
          this.pinchStartSize == null ||
          !boundVisual
        ) {
          const distance = Math.hypot(
            pointerA.x - pointerB.x,
            pointerA.y - pointerB.y,
          );

          this.pinchStartDistance = distance;
          this.pinchStartSize = { ...target.size };
          // Bound the target
          this.handVisualMap[actionPayload.handId].visual = target;
        }

        break;
      }
      case HOVER:
        // Find if the visual is on the other hand
        const otherHandId = actionPayload.handId === LEFT ? RIGHT : LEFT;
        const otherHand = this.handVisualMap[otherHandId];
        const otherVisual = otherHand?.visual;

        const isSharedVisual =
          boundVisual &&
          otherVisual &&
          boundVisual.assetId === otherVisual.assetId;

        // If visual is hovered by two hands, don't remove the hover on visual
        // If target is different from bound visual (hovering to different visual)
        // or if there is no visual on hover, remove hover (remove outline) from bound visual
        if (
          boundVisual &&
          !isSharedVisual &&
          ((target && boundVisual.assetId !== target.assetId) || !target)
        ) {
          handleHover(boundVisual.assetId, false);
        }

        this.handVisualMap[actionPayload.handId].visual = target;
        handleHover(target ? target.assetId : null, true);

        // Set drag offset to null when hovering.
        // This will reset drag, useful when user change at which point in the visual they are dragging
        currentDragOffset = null;
        break;

      case MOVE: {
        // If no visual has been selected, don't move visual
        if (!boundVisual || !boundVisual.isHovered) {
          return;
        }

        // If move and object is already selected and drag is already calculated
        // This is an on going drag
        if (boundVisual && currentDragOffset) {
          handleDrag(boundVisual.assetId, point, currentDragOffset);
          return;
        }

        // If there is a bounded object (already hovered), and current target is same as that object
        // and drag offset have not been set, means this is a new drag, calculate offset then drag
        if (
          boundVisual &&
          target &&
          boundVisual.assetId === target.assetId &&
          !currentDragOffset
        ) {
          currentDragOffset = {
            x: point.x - target.position.x,
            y: point.y - target.position.y,
          };

          handleDrag(target.assetId, point, currentDragOffset!);
        }
        break;
      }
    }

    // Update drag offset
    this.handVisualMap[actionPayload.handId].dragOffset = currentDragOffset;
  }

  /**
   * Clear target and reset all hands bound
   * Only clear if the clear threshold is reached
   */
  handleClear() {
    if (this.currentClearCount === this.CLEAR_THRESHOLD) {
      // Clear hover and bound visual for each hand
      Object.values(this.handVisualMap).forEach((handVisual) => {
        handleHover(
          handVisual.visual ? handVisual.visual.assetId : null,
          false,
        );
        handVisual.dragOffset = null;
        handVisual.visual = null;
      });
      return;
    }
    this.currentClearCount += 1;
  }

  /**
   * Clear the hover markup, bound visual and drag offset for a specific hand
   * Only clear when reach threshold
   * @param handId id of hand to be cleared
   */
  clearTargetForHand(handId: HandIds) {
    const currentHand = this.handVisualMap[handId];

    if (currentHand.clearCount === this.CLEAR_THRESHOLD) {
      // Find current and other hand visual and the resize visual if any
      const otherHandId = handId === LEFT ? RIGHT : LEFT;
      const otherHand = this.handVisualMap[otherHandId];
      const currentVisual = currentHand.visual;
      const otherVisual = otherHand.visual;
      const resizeVisual = this.handVisualMap[LEFT_RIGHT].visual;

      // Only remove hover markup if:
      //    - current and other hand have a visual bounded
      //    - the other hand does not hold the same visual as the current.
      //       If it does don't remove as the other hand are still hovering on it
      //    - there is no visual currently on resize. If there is a visual on resize,
      //       it won't show on either left or right but the markup shouldn't be removed
      if (
        (currentVisual &&
          otherVisual &&
          currentVisual.assetId !== otherVisual.assetId) ||
        !resizeVisual
      ) {
        handleHover(currentVisual ? currentVisual.assetId : null, false);
      }

      currentHand.visual = null;
      currentHand.dragOffset = null;

      // Reset resize calculation
      if (handId === LEFT_RIGHT) {
        this.pinchStartDistance = null;
        this.pinchStartSize = null;
      }
    }

    currentHand.clearCount += 1;
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
