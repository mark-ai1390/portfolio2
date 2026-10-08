export type Point = { x: number; y: number };

export const clampZoom = (zoom: number) => Math.max(1, Math.min(6, zoom));

// Preserve the image coordinate under the pointer when its scale changes.
export function zoomScroll(scroll: Point, pointer: Point, before: number, after: number): Point {
  return {
    x: (scroll.x + pointer.x) * after / before - pointer.x,
    y: (scroll.y + pointer.y) * after / before - pointer.y,
  };
}

export function pinchPoints(points: Point[]) {
  const [a, b] = points;
  return { center: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, distance: Math.hypot(a.x - b.x, a.y - b.y) };
}
