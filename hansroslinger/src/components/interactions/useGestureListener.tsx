import { useEffect, useRef } from "react";
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

  // Simple debounce for stopping a stroke after a quiet period
  const emptyFrames = useRef(0);
  const EMPTY_LIMIT = 3; // frames without gestures before ending stroke

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

      // Clear all per-hand targets when we got nothing this frame
      HAND_IDS.forEach((handId) =>
        interactionManager.clearTargetForHand(handId),
      );
      return;
    }

    // We have gestures this frame
    emptyFrames.current = 0;

    // Handle clicking (ignore combined LEFT_RIGHT pseudo-id)
    gesturePayloads.forEach((payload) => {
      if (payload.id !== LEFT_RIGHT) {
        gestureToClick.handleGestureClick(payload);
      }
    });

    if (mode === "paint") {
      // Delegate the whole frame to the paint manager
      paintManager.processFrame(gesturePayloads);
    } else {
      // Interaction mode: map gestures to actions
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

    // Per-hand cleanup for hands that didn’t report this frame
    const receivedHands = new Set(gesturePayloads.map((g) => g.id));
    HAND_IDS.forEach((handId) => {
      if (!receivedHands.has(handId)) {
        interactionManager.clearTargetForHand(handId);
      }
    });
  }, [gesturePayloads, interactionManager, mode]);

  return null;
};
