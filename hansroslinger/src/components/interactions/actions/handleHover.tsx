import { useVisualStore } from "store/visualsSlice";

export const handleHover = (id: string, isHovered: boolean) => {
  const store = useVisualStore.getState();
  const visual = store.getVisual(id);
  if (!visual) return;

  store.setVisualHover(id, isHovered);
};
