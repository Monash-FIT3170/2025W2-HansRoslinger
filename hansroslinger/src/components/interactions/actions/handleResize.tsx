import { useVisualStore } from "store/visualsSlice";
import { VisualPosition } from "types/application";

export const handleResize = (id: string, pointer: VisualPosition) => {
  const store = useVisualStore.getState();
  const visual = store.getVisual(id);
  if (!visual) return;

  const anchor = visual.position;

  // Calculate aspect ratio with original size
  const aspectRatio = visual.size.width / visual.size.height;

  // Calculate difference from anchor to pointer
  const dx = pointer.x - anchor.x;
  const dy = pointer.y - anchor.y;

  // Use the larger of dx or dy to determine scale
  let newWidth = dx;
  let newHeight = dy;

  // Find which of dx or dy that has been enlarged more
  if (dx / dy > aspectRatio) {
    // Width is leading (enlarged more than height), use this value to calculate height based on ratio
    newHeight = newWidth / aspectRatio;
  } else {
    // Height is leading, use this to calculate width based on ratio
    newWidth = newHeight * aspectRatio;
  }

  // Define minimum size
  // Minimum width is defined and minimum height will be calculated using the ratio
  const minWidth = 50;
  const minHeight = minWidth / aspectRatio;

  // get the max between the minimum size and the new calculated size
  newWidth = Math.max(minWidth, newWidth);
  newHeight = Math.max(minHeight, newHeight);

  store.setVisualSize(id, {
    width: newWidth,
    height: newHeight,
  });
};
