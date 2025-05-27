"use client";

import { useEffect } from "react";
import CameraFeed from "./CameraFeed";
import KonvaOverlay from "@/components/KonvaOverlay";
import { InteractionManager } from "@/components/interactions/interactionManager";

const manager = new InteractionManager();

export default function Preview() {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "t") return;

      /* --------------------------------------------------------
       * 1. Chart-relative coordinates you want to test
       * ------------------------------------------------------ */
      // const x = 351;
      // const y = 262;

      const positions = [{ x: 351, y: 262 }];

      const { x, y } = positions[Math.floor(Math.random() * positions.length)];

      /* Tell your own app about the point interaction */
      manager.handleInput({ type: "point", position: { x, y } });

      /* --------------------------------------------------------
       * 2. Find the REAL interactive element (canvas)
       * ------------------------------------------------------ */
      const canvas = document.querySelector(".vega-embed canvas");
      if (!canvas) {
        console.warn("Vega canvas not found");
        return;
      }

      /* --------------------------------------------------------
       * 3. Translate to viewport coords for PointerEvent
       * ------------------------------------------------------ */
      //const rect = canvas.getBoundingClientRect();
      const clientX = x;
      const clientY = y;

      /* Whichever element sits under that point gets the events */
      const target = document.elementFromPoint(clientX, clientY) ?? canvas;

      /* --------------------------------------------------------
       * 4. Dispatch a full event chain
       * ------------------------------------------------------ */
      [
        "pointerenter",
        "pointerover",
        "pointermove",
        "mouseenter",
        "mouseover",
        "mousemove",
      ].forEach((type) =>
        target.dispatchEvent(
          new PointerEvent(type, {
            bubbles: true,
            cancelable: true,
            pointerId: 1,
            pointerType: "mouse",
            isPrimary: true,
            clientX,
            clientY,
          })
        )
      );

      console.log("[Synthetic pointer events]", { clientX, clientY, target });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="relative w-full max-w-full">
      <CameraFeed />
      <KonvaOverlay />
    </div>
  );
};

export default Preview;
