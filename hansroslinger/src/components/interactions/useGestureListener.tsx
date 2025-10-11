import { useEffect} from "react";
import { gestureToActionMap } from "./gestureMappings";
import { InteractionManager } from "./interactionManager";
import { useGestureStore } from "store/gestureSlice";
import { HAND_IDS, LEFT_RIGHT } from "constants/application";
import { useModeStore } from "store/modeSlice";
import { paintManager } from "./paintManager";
import { gestureToClick } from "./gestureToClick";

export const useGestureListener = (interactionManager: InteractionManager) => {
  const gesturePayloads = useGestureStore((s) => s.gesturePayloads);
  const mode = useModeStore((s) => s.mode);

  useEffect(() => {
    if (!gesturePayloads) return;

    // No gestures this frame
    if (gesturePayloads.length === 0) {
      if (mode === "paint") {
        if (++emptyFrames.current >= EMPTY_LIMIT) {
          paintManager.stopDrawing();
          emptyFrames.current = 0;
        }
      } else {
        interactionManager.handleClear();
      }

      // Clear per-hand targets
      HAND_IDS.forEach((handId) => interactionManager.clearTargetForHand(handId));
      return;
    }

    // Handle clicking
    gesturePayloads.forEach((payload) => {
      if (payload.id !== LEFT_RIGHT) gestureToClick.handleGestureClick(payload);
    });

    // We have gestures this frame
    emptyFrames.current = 0;

    // --- Paint mode ---
    if (mode === "paint") {
      // Delegate the entire frame to the PaintManager.
      paintManager.processFrame(gesturePayloads);
    } else {
      // Interaction mode: unchanged routing to InteractionManager.
      if (gesturePayloads.length === 0) {
        interactionManager.handleClear();
      } else {
        gesturePayloads.forEach((payload) => {
          const action = gestureToActionMap[payload.name];
          if (action) {
            interactionManager.handleAction({
              handId: payload.id,
              action,
              coordinates: Object.values(payload.points),
            });
          }
        });
      }
    }

    gesturePayloads.forEach((payload) => {
      const action = gestureToActionMap[payload.name];
      if (action) {
        interactionManager.handleAction({
          handId: payload.id,
          action,
          coordinates: Object.values(payload.points),
        });
      }
    });

    // Per-hand cleanup for non-reported hands (clear targets for hands with no gesture this frame.)
    const receivedHands = new Set(gesturePayloads.map((g) => g.id));
    HAND_IDS.forEach((handId) => {
      if (!receivedHands.has(handId)) {
        interactionManager.clearTargetForHand(handId);
      }
    });
  }, [gesturePayloads, interactionManager, mode]);

  return null;
};
