import { useEffect } from "react";
import { gestureToActionMap } from "./gestureMappings";
import { InteractionManager } from "./interactionManager";
import { useGestureStore } from "store/gestureSlice";

export const useGestureListener = (interactionManager: InteractionManager) => {
  const gesturePayloads = useGestureStore((state) => state.gesturePayloads);

  useEffect(() => {
    if (!gesturePayloads) return;

    // Clear when no payload
    if (gesturePayloads.length === 0) {
      interactionManager.handleClear();
    }

    gesturePayloads.forEach((payload) => {
      const action = gestureToActionMap[payload.name];
      if (action) {
        // change this to handle action when implemented
        interactionManager.handleAction({
          action: action,
          coordinates: Object.values(payload.points),
        });
      }
    });
  }, [gesturePayloads, interactionManager]);

  return null;
};
