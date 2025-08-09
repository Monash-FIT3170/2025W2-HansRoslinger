import { useVisualStore } from "store/visualsSlice";

export const handleHover = (id: string | null, isHovered: boolean) => {
  const store = useVisualStore.getState();

  if (id) {
    const visual = store.getVisual(id);
    if (visual) {
      store.setVisualHover(id, isHovered);
    }
  }

};
