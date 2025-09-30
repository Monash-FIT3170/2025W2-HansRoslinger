import { GesturePayload } from "app/detection/Gesture";
import { LEFT_RIGHT, PINCH } from "constants/application";
import { containerStore } from "store/containerSlice";
import { HandIds } from "types/application";

type HandState = {
  wasPinching: boolean;
  downTarget: Element | null;
  pinchStartTime: number;
  lastPoint: { x: number; y: number } | null;
};

type HandStateMap = Record<HandIds, HandState>;

const PINCH_MAX_DURATION_MS = 1300;

/**
 * This class handles pinch to click
 * It will mouse events as a result of pinching gesture
 * If not pinch -> pinch -> not pinch all happens within 1.3 second (max duration),
 * this class will fire on mouse events to trigger clicking
 *
 * Duration is set so that dragging does not trigger click
 * Dragging is activated after 1 second of constantly pinching
 * Threshold of 1 second is chosen for click as not pinch -> pinch -> not pinch
 * all need to happen within 1.3 second, meaning drag is not trigger yet
 */
class GestureToClick {
  private handStateMap: HandStateMap = {
    left: {
      wasPinching: false,
      downTarget: null,
      pinchStartTime: 0,
      lastPoint: null,
    },
    right: {
      wasPinching: false,
      downTarget: null,
      pinchStartTime: 0,
      lastPoint: null,
    },
  };

  resetState(handId: HandIds) {
    if (handId === LEFT_RIGHT) return;
    this.handStateMap[handId].wasPinching = false;
    this.handStateMap[handId].downTarget = null;
    this.handStateMap[handId].pinchStartTime = 0;
    this.handStateMap[handId].lastPoint = null;
  }

  handleGestureClick(gesturePayload: GesturePayload) {
    const point = Object.values(gesturePayload.points)[0];
    const handId = gesturePayload.id;

    // Get the container used to detect gesture
    const { container } = containerStore.getState();
    if (!container) {
      console.warn("Canvas used to detect gesture not found");
      return;
    }

    // Get the client area and calculate the x and y respective to the client bounding area
    const rect = container.getBoundingClientRect();
    // Map to client coordinates
    const clientX = rect.left + point.x;
    const clientY = rect.top + point.y;

    const state = this.handStateMap[handId];
    const prevIsPinching = state.wasPinching;

    // Not pinch --> pinch
    if (gesturePayload.name === PINCH && !prevIsPinching) {
      this.handStateMap[handId].pinchStartTime = Date.now();

      const el = document.elementFromPoint(clientX, clientY);
      console.log(el);
      if (el) {
        this.handStateMap[handId].downTarget = el;
        el.dispatchEvent(
          new MouseEvent("mousedown", { bubbles: true, clientX, clientY })
        );
      }
    }

    // Pinch released
    if (gesturePayload.name !== PINCH && prevIsPinching) {
      const elapsed = Date.now() - state.pinchStartTime;
      console.log(elapsed);

      if (elapsed <= PINCH_MAX_DURATION_MS && state.downTarget) {
        state.downTarget.dispatchEvent(
          new MouseEvent("mouseup", { bubbles: true, clientX, clientY })
        );
        (state.downTarget as HTMLElement).click?.();
      } else {
        if (state.downTarget) {
          state.downTarget.dispatchEvent(
            new MouseEvent("mouseup", { bubbles: true, clientX, clientY })
          );
        }
      }

      // reset
      this.resetState(handId);
    }

    state.wasPinching = gesturePayload.name === PINCH;
  }
}

// Export singleton instance
export const gestureToClick = new GestureToClick();
