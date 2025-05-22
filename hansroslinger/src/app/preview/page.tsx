"use client";

import { useEffect } from "react";
import CameraFeed from "./CameraFeed";
import KonvaOverlay from "@/components/KonvaOverlay";
import { InteractionManager } from "@/components/interactions/interactionManager";

const manager = new InteractionManager();

export default function Preview() {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "t") {
        const x = 351;
        const y = 262;

        manager.handleInput({
          type: "point",
          position: { x, y },
        });

        const vegaDiv = document.querySelector(".vega-embed");
        if (vegaDiv) {
          //const rect = vegaDiv.getBoundingClientRect();
          const clientX = x;
          const clientY = y;

          const topElem = document.elementFromPoint(clientX, clientY) ?? vegaDiv;

          const eventTypes = [
            "pointerenter",
            "pointerover",
            "pointermove",
            "mouseenter",
            "mouseover",
            "mousemove",
          ];

          eventTypes.forEach((eventType) => {
            const event = new PointerEvent(eventType, {
              bubbles: true,
              cancelable: true,
              pointerId: 1,
              pointerType: "mouse",
              clientX,
              clientY,
              isPrimary: true,
            });
            topElem.dispatchEvent(event);
          });

          console.log("[Dispatched pointer events] at", clientX, clientY, "on", topElem);
        }

        console.log("[Emulated Point] →", { x, y });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="relative w-full max-w-full ...">
      <CameraFeed />
      <KonvaOverlay />
    </div>
  );
}
