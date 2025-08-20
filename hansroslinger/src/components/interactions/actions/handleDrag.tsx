import { useVisualStore } from "store/visualsSlice";

export const handleDrag = (
  id: string,
  pointer: { x: number; y: number },
  offset: { x: number; y: number },
) => {
  const store = useVisualStore.getState();
  const visual = store.getVisual(id);
  if (!visual) return;

  const newPosition = {
    x: pointer.x - offset.x,
    y: pointer.y - offset.y,
  };

  store.setVisualPosition(id, newPosition);
};

export const handleDragStartEnd = (id: string, dragStart: boolean) => {
  const store = useVisualStore.getState();
  const visual = store.getVisual(id);
  if (!visual) return;

  store.setVisualDragging(id, dragStart);
};
