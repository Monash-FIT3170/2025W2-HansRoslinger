import { useVisualStore } from "store/visualsSlice";
import { VisualPosition } from "types/application";

/**
 * @param id visual id
 * @param pointerA
 * @param pointerB
 * @param pinchStartDistance
 * @param pinchStartSize
 */
export const handleResize = (
  id: string,
  pointerA: VisualPosition,
  pointerB: VisualPosition,
  pinchStartDistance: number,
  pinchStartSize: { width: number; height: number },
) => {
  const store = useVisualStore.getState();
  const visual = store.getVisual(id);
  if (!visual) return;

  const dx = pointerA.x - pointerB.x;
  const dy = pointerA.y - pointerB.y;
  const distance = Math.hypot(dx, dy);

  const scale = distance / pinchStartDistance;

  const minWidth = 50;
  const minHeight = minWidth / (pinchStartSize.width / pinchStartSize.height);

  let newWidth = Math.max(minWidth, pinchStartSize.width * scale);
  let newHeight = Math.max(minHeight, pinchStartSize.height * scale);

  const aspectRatio = pinchStartSize.width / pinchStartSize.height;
  if (newWidth / newHeight > aspectRatio) {
    newHeight = newWidth / aspectRatio;
  } else {
    newWidth = newHeight * aspectRatio;
  }

  store.setVisualSize(id, {
    width: newWidth,
    height: newHeight,
  });
};
