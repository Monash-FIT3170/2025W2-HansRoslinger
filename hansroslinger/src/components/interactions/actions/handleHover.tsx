import { useVisualStore } from "store/visualsSlice";

let lastHoveredId: string | null = null;

export const handleHover = (id: string | null, isHovered: boolean) => {
  const store = useVisualStore.getState();

  if (lastHoveredId && lastHoveredId !== id) {
    store.setVisualHover(lastHoveredId, false);
  }

  if (id && isHovered) {
    const visual = store.getVisual(id);
    if (visual) {
      store.setVisualHover(id, true);
      lastHoveredId = id;
    }
  }

  if (!id) {
    lastHoveredId = null;
  }
};
