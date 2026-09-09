/** Malformed percent escapes must not prevent the rest of the gallery loading. */
export const parsePhotoSetHash = (hash: string): string | null => {
  try {
    const value = decodeURIComponent(hash.replace(/^#/, ""));
    return /^photo-set-[a-z0-9_-]+$/i.test(value) ? value : null;
  } catch {
    return null;
  }
};

export const adjacentPhotoIndex = (index: number, count: number, direction: -1 | 1): number =>
  count > 0 ? Math.max(0, Math.min(count - 1, index + direction)) : -1;

/** Preserve vertical scrolling and ignore short or diagonal touch gestures. */
export const photoSwipeDirection = (deltaX: number, deltaY: number): -1 | 0 | 1 => {
  if (Math.abs(deltaX) < 56 || Math.abs(deltaX) <= Math.abs(deltaY) * 1.4) return 0;
  return deltaX < 0 ? 1 : -1;
};
