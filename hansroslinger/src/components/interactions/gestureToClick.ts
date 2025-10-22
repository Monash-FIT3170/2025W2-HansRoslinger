import { GesturePayload } from "app/detection/Gesture";
import { LEFT_RIGHT, OPEN_PALM, PINCH } from "constants/application";
import { containerStore } from "store/containerSlice";
import { HandIds } from "types/application";

type HandState = {
  wasPinching: boolean;
  downTarget: Element | null;
  pinchStartTime: number;
  lastPoint: { x: number; y: number } | null;
  lastHovered: HTMLElement | null;
};

type HandStateMap = Record<HandIds, HandState>;

const PINCH_MAX_DURATION_MS = 1500;

/**
 * This class handles pinch to click
 * It will mouse events as a result of pinching gesture
 * If not pinch -> pinch -> not pinch all happens within 1.5 second (max duration),
 * this class will fire on mouse events to trigger clicking
 *
 * Duration is set so that dragging does not trigger click
 * Dragging is activated after 1 second of constantly pinching
 * Threshold of 1 second is chosen for click as not pinch -> pinch -> not pinch
 * all need to happen within 1.3 second, meaning drag is not trigger yet
 */
class GestureToMouse {
  private handStateMap: HandStateMap = {
    left: {
      wasPinching: false,
      downTarget: null,
      pinchStartTime: 0,
      lastPoint: null,
      lastHovered: null,
    },
    right: {
      wasPinching: false,
      downTarget: null,
      pinchStartTime: 0,
      lastPoint: null,
      lastHovered: null,
    },
  };

  resetState(handId: HandIds) {
    if (handId === LEFT_RIGHT) return;
    this.handStateMap[handId].wasPinching = false;
    this.handStateMap[handId].downTarget = null;
    this.handStateMap[handId].pinchStartTime = 0;
    this.handStateMap[handId].lastPoint = null;
  }

  // Dispatch hover events
  handleHover(clientX: number, clientY: number, handId: HandIds) {
    let hoverEl = document.elementFromPoint(
      clientX,
      clientY
    ) as HTMLElement | null;

    // Walk up until we find something clickable
    while (hoverEl && !this.isClickable(hoverEl)) {
      hoverEl = hoverEl.parentElement as HTMLElement | null;
    }

    // If no element, clear the hover
    if (!hoverEl) {
      this.clearHover(handId);
      return;
    }

    const state = this.handStateMap[handId];
    if (state.lastHovered === hoverEl) return;

    // Clear previous hovered element
    const prevEl = state.lastHovered;
    if (prevEl && prevEl !== hoverEl) {
      this.clearHover(handId);
    }

    // Dispatch real mouse event for hover
    hoverEl.dispatchEvent(
      new MouseEvent("mouseenter", { bubbles: true, clientX, clientY })
    );
    hoverEl.dispatchEvent(
      new MouseEvent("mouseover", { bubbles: true, clientX, clientY })
    );

    state.lastHovered = hoverEl;
  }

  clearHover(handId: HandIds) {
    const state = this.handStateMap[handId];
    if (!state.lastHovered) return;

    const el = state.lastHovered;
    state.lastHovered = null;

    // Dispatch mouse out and leave
    el.dispatchEvent(
      new MouseEvent("mouseout", {
        bubbles: true,
        relatedTarget: null,
      })
    );
    el.dispatchEvent(
      new MouseEvent("mouseleave", {
        bubbles: false,
        relatedTarget: null,
      })
    );
  }

  handleGestureMouse(gesturePayload: GesturePayload) {
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

    // hover
    if (gesturePayload.name === OPEN_PALM) {
      this.handleHover(clientX, clientY, handId);
    }

    // Not pinch --> pinch
    if (gesturePayload.name === PINCH && !prevIsPinching) {
      this.handStateMap[handId].pinchStartTime = Date.now();

      // Try to get the element under the current hand position
      let el = document.elementFromPoint(
        clientX,
        clientY
      ) as HTMLElement | null;

      // Fallback: if nothing under point, use the last hovered element
      if (!el) {
        el = this.handStateMap[handId].lastHovered as HTMLElement | null;
      } else {
        this.handleHover(clientX, clientY, handId);
      }

      if (el) {
        this.handStateMap[handId].downTarget = el;
        el.dispatchEvent(
          new MouseEvent("mousedown", {
            bubbles: true,
            clientX,
            clientY,
          })
        );
      }
    }

    // Pinch released
    if (gesturePayload.name !== PINCH && prevIsPinching) {
      const elapsed = Date.now() - state.pinchStartTime;

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
    // CLear if gesture is not open palm r pinch
    if (gesturePayload.name !== OPEN_PALM && gesturePayload.name !== PINCH) {
      this.clearHover(handId);
    }
  }

  /**
   * Helper to check if element is clickable
   * @param el element to check
   * @returns true if element is clickable, false otherwise
   */
  private isClickable(el: HTMLElement): boolean {
    const tag = el.tagName.toLowerCase();
    return (
      ["button", "a", "input", "select", "textarea", "label"].includes(tag) ||
      el.classList.contains("cursor-pointer") ||
      typeof (el as HTMLElement).onclick === "function" ||
      el.getAttribute("role") === "button"
    );
  }
}

// Export singleton instance
export const gestureToMouse = new GestureToMouse();
