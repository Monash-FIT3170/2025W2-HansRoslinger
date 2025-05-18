import { useVisualStore } from "store/visualsSlice";
import { VisualPosition } from "types/application";

export const handleDrag = (id: string, pointer: VisualPosition) => {
  const store = useVisualStore.getState();
  const visual = store.getVisual(id);
  if (!visual) return;

  store.setVisualPosition(id, pointer);
};
