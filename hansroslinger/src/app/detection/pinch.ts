/**
 * Detects if the hand is making a pinch gesture.
 * @param worldLandmarks The 3D landmarks of a hand from Mediapipe.
 * @param threshold Distance threshold to consider it a pinch.
 * @returns true if pinching, false otherwise.
 */
export const isPinch = (
  worldLandmarks: { x: number; y: number; z: number }[],
  threshold = 0.07,
): boolean => {
  if (!worldLandmarks || worldLandmarks.length < 9) {
    console.log("huh");
    return false;
  }

  const thumbTip = worldLandmarks[4];
  const indexTip = worldLandmarks[8];

  const dx = thumbTip.x - indexTip.x;
  const dy = thumbTip.y - indexTip.y;
  const dz = thumbTip.z - indexTip.z;

  const distance = Math.hypot(dx, dy, dz);

  return distance < threshold;
};