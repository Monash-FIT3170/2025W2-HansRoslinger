import { useEffect, useRef } from "react";
import { InteractionManager } from "./interactionManager";
import { useVisualStore } from "store/visualsSlice";
import { Visual } from "types/application";

const RESIZE_MARGIN = 36;

/**
 * Determines whether the pointer is within the top-right corner of a visual.
 * NOTE: This is used for the resize functionality without any gesture based interaction. Will be refactored accordingly later
 */
const isInTopRightCorner = (pos: { x: number; y: number }, visual: Visual) => {
  const vx = visual.position.x;
  const vy = visual.position.y;
  const vw = visual.size.width;

  return (
    pos.x >= vx + vw - RESIZE_MARGIN &&
    pos.x <= vx + vw &&
    pos.y >= vy &&
    pos.y <= vy + RESIZE_MARGIN
  );
};

/**
 * Finds and return the highest index visual on a specified position
 */
const findVisualUnderPointer = (
  pos: { x: number; y: number },
  visuals: Visual[],
) => {
  return [...visuals].reverse().find((v) => {
    const { x, y } = v.position;
    const { width, height } = v.size;
    return (
      pos.x >= x && pos.x <= x + width && pos.y >= y && pos.y <= y + height
    );
  });
};

/**
 * Sets up mock interaction stream using the native mouse events.
 * Handles drag, resize, and hover interactions for visuals.
 */
export const useMouseMockStream = (manager: InteractionManager) => {
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const activeVisualId = useRef<string | null>(null);
  const hoveredVisualId = useRef<string | null>(null);
  const dragOffset = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    /**
     * Converts screen coordinates to canvas-relative pointer coordinates.
     */
    const getPointer = (e: MouseEvent) => {
      const canvas = document.querySelector("canvas");
      if (!canvas) return null;
      const bounds = canvas.getBoundingClientRect();

      return {
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      };
    };

    /**
     * Triggered on mouse down — identifies the visual under the pointer,
     * and enters drag or resize mode depending on Shift key and hit area.
     */
    const onMouseDown = (e: MouseEvent) => {
      const pos = getPointer(e);
      if (!pos) return;

      const visuals = useVisualStore.getState().visuals;

      // Find the visual under the pointer
      const visual = findVisualUnderPointer(pos, visuals);

      if (!visual) return;

      activeVisualId.current = visual.assetId;

      const isCorner = isInTopRightCorner(pos, visual);
      console.log("[MouseDown]", {
        shift: e.shiftKey,
        pos,
        visual: visual.assetId,
        isCorner,
      });

      if (e.shiftKey && isCorner) {
        isResizing.current = true;
        console.log("[Resize Start]", visual.assetId);
      } else {
        // Calculate the offset between the top-left position of the visual and the position of the mouse pointer
        dragOffset.current = {
          x: pos.x - visual.position.x,
          y: pos.y - visual.position.y,
        };
        isDragging.current = true;
        console.log("[Drag Start]", visual.assetId);
      }
    };

    /**
     * Triggered on mouse move — sends interaction updates to the manager.
     */
    const onMouseMove = (e: MouseEvent) => {
      const pos = getPointer(e);
      if (!pos) return;

      manager.handleInput({ type: "hover", position: pos });

      const visuals = useVisualStore.getState().visuals;

      // Check which visual (if any) is currently under the pointer
      const hoveredVisual = findVisualUnderPointer(pos, visuals);

      // Only send hover events if the hovered visual changed
      if (hoveredVisual?.assetId !== hoveredVisualId.current) {
        if (hoveredVisualId.current) {
          manager.handleInput({
            type: "hover",
            position: pos,
            targetId: hoveredVisualId.current,
            isHovered: false,
          });
        }

        if (hoveredVisual) {
          manager.handleInput({
            type: "hover",
            position: pos,
            targetId: hoveredVisual.assetId,
            isHovered: true,
          });
        }

        hoveredVisualId.current = hoveredVisual?.assetId ?? null;
      }

      if (isResizing.current && activeVisualId.current) {
        manager.handleInput({
          type: "resize",
          position: pos,
          targetId: activeVisualId.current,
        });
        console.log("[Resizing]", pos);
      } else if (
        isDragging.current &&
        activeVisualId.current &&
        dragOffset.current
      ) {
        //Calculate the new top-left position of the visual relative to the position of the mouse pointer
        const adjustedPosition = {
          x: pos.x - dragOffset.current.x,
          y: pos.y - dragOffset.current.y,
        };

        manager.handleInput({
          type: "move",
          position: adjustedPosition,
          targetId: activeVisualId.current,
        });

        console.log("[Dragging]", pos);
      }
    };

    /**
     * Resets interaction state when the mouse is released.
     */
    const onMouseUp = () => {
      isDragging.current = false;
      isResizing.current = false;
      activeVisualId.current = null;
      dragOffset.current = null;
    };

    // Register global mouse listeners
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [manager]);
};
