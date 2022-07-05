import { getIntersection } from "./getIntersection";

export function polysIntersect(
  polygon: { x: number; y: number }[],
  roadBorder: { x: number; y: number }[]
) {
  for (let i = 0; i < polygon.length; i++) {
    for (let j = 0; j < roadBorder.length; j++) {
      const touch = getIntersection(
        polygon[i],
        polygon[(i + 1) % polygon.length],
        roadBorder[j],
        roadBorder[(j + 1) % roadBorder.length]
      );
      if (touch) {
        return true;
      }
    }
  }
  return false;
}
