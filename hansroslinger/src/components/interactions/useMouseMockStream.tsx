import { useEffect, useRef } from "react";
import { InteractionManager } from "./interactionManager";
import { useVisualStore } from "app/store/visualsSlice";
import { VisualProp } from "types/application";

const RESIZE_MARGIN = 36;

const isInTopRightCorner = (pos: { x: number; y: number }, visual: VisualProp) => {
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

export const useMouseMockStream = (manager: InteractionManager) => {
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const activeVisualId = useRef<string | null>(null);

  useEffect(() => {
    const getPointer = (e: MouseEvent) => {
      const canvas = document.querySelector("canvas");
      if (!canvas) return null;
      const bounds = canvas.getBoundingClientRect();
      return {
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      };
    };

    const onMouseDown = (e: MouseEvent) => {
      const pos = getPointer(e);
      if (!pos) return;

      const visuals = useVisualStore.getState().Visuals;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const target = Object.entries(visuals).find(([_, visual]) => {
        const { x, y } = visual.position;
        const { width, height } = visual.size;
        return (
          pos.x >= x && pos.x <= x + width &&
          pos.y >= y && pos.y <= y + height
        );
      });

      if (!target) return;

      const [id, visual] = target;
      activeVisualId.current = id;

      console.log("[MouseDown]", {
        shift: e.shiftKey,
        pos,
        visual: target?.[0],
        isCorner: isInTopRightCorner(pos, visual),
      });

      if (e.shiftKey && isInTopRightCorner(pos, visual)) {
        isResizing.current = true;
        console.log("[Resize Start]", id);
      } else {
        isDragging.current = true;
        console.log("[Drag Start]", id);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const pos = getPointer(e);
      if (!pos) return;

      manager.handleInput({ type: "hover", position: pos });

      if (isResizing.current && activeVisualId.current) {
        manager.handleInput({
          type: "resize",
          position: pos,
          targetId: activeVisualId.current,
        });
        console.log("[Resizing]", pos);
      } else if (isDragging.current && activeVisualId.current) {
        manager.handleInput({
          type: "move",
          position: pos,
          targetId: activeVisualId.current,
        });
        console.log("[Dragging]", pos);
      }
    };

    const onMouseUp = () => {
      isDragging.current = false;
      isResizing.current = false;
      activeVisualId.current = null;
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [manager]);
};
