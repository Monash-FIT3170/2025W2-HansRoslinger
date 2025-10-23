import { containerStore } from "store/containerSlice";
import { useVisualStore } from "store/visualsSlice";
import { VisualPosition } from "types/application";

// To reduce resize sensitivity. The scale will be multiply by the factor
const RESIZE_FACTOR = 0.3;

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
  pinchStartSize: { width: number; height: number }
) => {
  const store = useVisualStore.getState();
  const visual = store.getVisual(id);
  if (!visual) return;

  const dx = pointerA.x - pointerB.x;
  const dy = pointerA.y - pointerB.y;
  const distance = Math.hypot(dx, dy);

  const scale = (distance / pinchStartDistance) * RESIZE_FACTOR;

  const minWidth = 100;
  const minHeight = minWidth / (pinchStartSize.width / pinchStartSize.height);

  let newWidth = Math.max(minWidth, pinchStartSize.width * scale);
  let newHeight = Math.max(minHeight, pinchStartSize.height * scale);

  const aspectRatio = pinchStartSize.width / pinchStartSize.height;
  if (newWidth / newHeight > aspectRatio) {
    newHeight = newWidth / aspectRatio;
  } else {
    newWidth = newHeight * aspectRatio;
  }

  const container = containerStore.getState().container;
  if (container) {
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Max heights implied by each container dimension:
    // - From height bound: cannot exceed container height
    const maxHeightByContainerHeight = containerHeight;

    // - From width bound: width <= containerWidth & height <= containerWidth / aspectRatio
    const maxHeightByContainerWidth = containerWidth / aspectRatio;

    // Final height is the minimum of:
    //   1) the height computed from the gesture,
    //   2) the max height allowed by container height,
    //   3) the max height allowed by container width (via aspect ratio)
    const clampedHeight = Math.min(
      newHeight,
      maxHeightByContainerHeight,
      maxHeightByContainerWidth
    );

    // Recompute width from clamped height to keep the ratio exact
    newHeight = clampedHeight;
    newWidth = clampedHeight * aspectRatio;
  }

  store.setVisualSize(id, {
    width: newWidth,
    height: newHeight,
  });
};
