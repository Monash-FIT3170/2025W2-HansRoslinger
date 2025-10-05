import { useVisualStore } from "store/visualsSlice";

// Store the last state for undo
export let undoState: {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
} | null = null;

// Save the current state of a visual for undo
export const saveUndoState = (id: string): void => {
  const visual = useVisualStore.getState().getVisual(id);
  if (!visual) return;
  undoState = {
    id: visual.assetId,
    position: { ...visual.position },
    size: { ...visual.size },
  };
};

// Handle the undo action
export const handleUndo = (): void => {
  console.log("Handling undo action");
  if (!undoState) {
    console.log("No undo state available.");
    return;
  }

  const { id, position, size } = undoState;
  console.log("Undo state saved:", id);
  console.log("Undo visual size:", size);

  const store = useVisualStore.getState();
  const visual = store.getVisual(id);
  if (!visual) {
    console.warn(`Visual with id ${id} not found.`);
    return;
  }

  // Restore the position of the visual
  store.setVisualPosition(id, position);
  store.setVisualSize(id, size);

  // Clear the undo state after applying it
  undoState = null;
};
