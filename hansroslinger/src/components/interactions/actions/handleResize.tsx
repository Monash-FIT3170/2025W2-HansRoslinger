import { useVisualStore } from "store/visualsSlice";
import { VisualPosition } from "types/application";

export const handleResize = (id: string, pointer: VisualPosition) => {
  const store = useVisualStore.getState();
  const visual = store.getVisual(id);
  if (!visual) return;

  const anchor = visual.position;

  // Calculate difference from anchor to pointer
  const dx = pointer.x - anchor.x;
  const dy = pointer.y - anchor.y;

  // Use diagonal distance (uniform scaling)
  const uniformDelta = Math.max(50, Math.max(dx, dy));

  store.setVisualSize(id, {
    width: uniformDelta,
    height: uniformDelta,
  });
};
