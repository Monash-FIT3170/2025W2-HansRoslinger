import { useEffect } from "react";
import { gestureToActionMap } from "./gestureMappings";
import { InteractionManager } from "./interactionManager";
import { useGestureStore } from "store/gestureSlice";
import { HAND_IDS, LEFT_RIGHT } from "constants/application";
import { useModeStore } from "store/modeSlice";
import { paintManager } from "./paintManager";
import { gestureToClick } from "./gestureToClick";

export const useGestureListener = (interactionManager: InteractionManager) => {
  const gesturePayloads = useGestureStore((state) => state.gesturePayloads);
  const mode = useModeStore((s) => s.mode);

  useEffect(() => {
    if (!gesturePayloads) return;

    // Clear when no payload
    if (gesturePayloads.length === 0) {
      if (mode === "paint") {
        paintManager.stopDrawing();
      } else {
        interactionManager.handleClear();
      }
    }

    // Handle clicking
    gesturePayloads.forEach((payload) => {
      if (payload.id !== LEFT_RIGHT) gestureToClick.handleGestureClick(payload);
    });

    // Handle gestures based on mode
    if (mode === "paint") {
      // Paint mode: route gestures to paintManager
      gesturePayloads.forEach((payload) => {
        console.log(
          `[GestureListener] Paint mode: routing ${payload.name} to paintManager`,
        );

        switch (payload.name) {
          case "pinch":
            paintManager.handlePinch(payload);
            break;

          case "closed_fist": 
            paintManager.handleClosedFist(payload);
            break;

          default:
            console.log(
              `[GestureListener] Paint mode: unhandled gesture ${payload.name}`,
            );
        }
      });
    } else {
      // Interact mode: forward gestures to InteractionManager
      gesturePayloads.forEach((payload) => {
        const action = gestureToActionMap[payload.name];
        if (action) {
          interactionManager.handleAction({
            handId: payload.id,
            action: action,
            coordinates: Object.values(payload.points),
          });
        }
      });
    }

    // For each hand that does not have a detected gesture
    // Clear target for that hand
    // This is done to reset the bound visual for that hand (remove hover, reset drag offset, etc.)
    const receivedHands = new Set(gesturePayloads.map((gesture) => gesture.id));

    HAND_IDS.forEach((handId) => {
      if (!receivedHands.has(handId)) {
        interactionManager.clearTargetForHand(handId);
      }
    });
  }, [gesturePayloads, interactionManager, mode]);

  return null;
};
