import { useEffect } from "react";
import { gestureToActionMap } from "./gestureMappings";
import { InteractionManager } from "./interactionManager";
import { useGestureStore } from "store/gestureSlice";
import { HAND_IDS } from "constants/application";

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
          handId: payload.id,
          action: action,
          coordinates: Object.values(payload.points),
        });
      }
    });

    // For each hand that does not have a detected gesture
    // Clear target for that hand
    // This is done to reset the bound visual for that hand (remove hover, reset drag offset, etc.)
    const receivedHands = new Set(gesturePayloads.map((gesture) => gesture.id));

    HAND_IDS.forEach((handId) => {
      if (!receivedHands.has(handId)) {
        interactionManager.clearTargetForHand(handId);
      }
    });
  }, [gesturePayloads, interactionManager]);

  return null;
};
