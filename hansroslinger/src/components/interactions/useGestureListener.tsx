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

  // Debounce & hysteresis
  const emptyFrames = useRef(0);
  const toolState = useRef<{ current: "draw" | "erase"; vote: number }>({
    current: "draw",
    vote: 0,
  });
  const EMPTY_LIMIT = 3;        // frames with no gesture before ending stroke
  const SWITCH_HYSTERESIS = 2;  // frames required to switch tool (draw <-> erase)

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
      // Priority: if any closed_fist present, prefer erase; else prefer pinch (draw)
      const fist = gesturePayloads.find((p) => p.name === "closed_fist");
      const pinch = gesturePayloads.find((p) => p.name === "pinch");
      const targetTool: "draw" | "erase" = fist ? "erase" : pinch ? "draw" : toolState.current.current;

      // Hysteresis to avoid flicker between tools
      if (targetTool !== toolState.current.current) {
        toolState.current.vote += 1;
        if (toolState.current.vote >= SWITCH_HYSTERESIS) {
          toolState.current.current = targetTool;
          toolState.current.vote = 0;
        }
      } else {
        toolState.current.vote = 0;
      }

      // Execute only the stabilized tool for this frame
      if (toolState.current.current === "erase" && fist) {
        // If multiple fists appear, handle them (usually one)
        gesturePayloads.forEach((payload) => {
          switch (payload.name) {
            case "closed_fist":
              paintManager.handleClosedFist(payload);
              break;
            default:
              // ignore other gestures in paint mode this frame
          }
        });
        return; // do not also draw this frame
      }

      if (toolState.current.current === "draw" && pinch) {
        gesturePayloads.forEach((payload) => {
          switch (payload.name) {
            case "pinch":
              paintManager.handlePinch(payload);
              break;
            default:
              // ignore other gestures in paint mode this frame
          }
        });
        return;
      }
      // No relevant paint gesture this frame (ignore others)
      return;
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

    // Per-hand cleanup for non-reported hands
    const receivedHands = new Set(gesturePayloads.map((g) => g.id));
    HAND_IDS.forEach((handId) => {
      if (!receivedHands.has(handId)) interactionManager.clearTargetForHand(handId);
    });
  }, [gesturePayloads, interactionManager, mode]);

  return null;
};
