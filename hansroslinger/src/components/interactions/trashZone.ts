"use client";

type TrashZoneRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

let trashZoneRect: TrashZoneRect | null = null;

export const setTrashZoneRect = (rect: TrashZoneRect | null) => {
  trashZoneRect = rect;
};

export const getTrashZoneRect = () => trashZoneRect;

export const isPointInTrashZone = (point: { x: number; y: number }) => {
  if (!trashZoneRect) return false;

  return (
    point.x >= trashZoneRect.x &&
    point.x <= trashZoneRect.x + trashZoneRect.width &&
    point.y >= trashZoneRect.y &&
    point.y <= trashZoneRect.y + trashZoneRect.height
  );
};
