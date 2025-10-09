"use client";

import { useEffect, useRef, useState } from "react";
import { setTrashZoneRect } from "./interactions/trashZone";

type TrashBinProps = {
  containerRef: React.RefObject<HTMLElement>;
};

const TRASH_SIZE = 120;

const TrashBin = ({ containerRef }: TrashBinProps) => {
  const binRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const updateRect = () => {
      if (!binRef.current || !containerRef.current) {
        setTrashZoneRect(null);
        setIsReady(false);
        return;
      }

      const containerRect = containerRef.current.getBoundingClientRect();
      const binRect = binRef.current.getBoundingClientRect();

      setTrashZoneRect({
        x: binRect.left - containerRect.left,
        y: binRect.top - containerRect.top,
        width: binRect.width,
        height: binRect.height,
      });
      setIsReady(true);
    };

    updateRect();
    const resizeObserver = new ResizeObserver(updateRect);
    if (binRef.current) resizeObserver.observe(binRef.current);
    window.addEventListener("resize", updateRect);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateRect);
      setTrashZoneRect(null);
    };
  }, [containerRef]);

  return (
    <div
      ref={binRef}
      data-interaction-skip="true"
      className="pointer-events-auto"
      style={{
        position: "absolute",
        bottom: 24,
        right: 24,
        width: TRASH_SIZE,
        height: TRASH_SIZE,
        borderRadius: 16,
        background: "rgba(255, 255, 255, 0.9)",
        border: "2px dashed rgba(239, 68, 68, 0.8)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#ef4444",
        gap: 8,
        boxShadow: isReady
          ? "0 10px 30px rgba(239, 68, 68, 0.25)"
          : "0 4px 12px rgba(0,0,0,0.1)",
        zIndex: 30,
      }}
    >
      <span role="img" aria-hidden>
        🗑️
      </span>
      <span style={{ fontSize: 12, fontWeight: 600 }}>Drag to delete</span>
    </div>
  );
};

export default TrashBin;
