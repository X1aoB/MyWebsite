export type GalleryAspect = "landscape" | "portrait" | "square";

/** Landscape covers take two grid columns; portrait and square covers take one. */
export const coverSpan = (aspect: GalleryAspect): 1 | 2 => (aspect === "landscape" ? 2 : 1);

/**
 * Orders items so a `columns`-wide grid fills each row before starting the next, keeping the
 * original (newest-first) order wherever an item fits. It is a stable, server-side version of
 * `grid-auto-flow: dense`, so keyboard order matches what is on screen at the widest layout.
 */
export const packRows = <T>(items: readonly T[], span: (item: T) => number, columns: number): T[] => {
  const pending = [...items];
  const ordered: T[] = [];
  let free = columns;
  while (pending.length > 0) {
    const index = pending.findIndex((item) => Math.min(span(item), columns) <= free);
    if (index === -1) {
      // Nothing left fits the rest of this row: leave the gap and start a new row.
      free = columns;
      continue;
    }
    const [item] = pending.splice(index, 1);
    ordered.push(item);
    free -= Math.min(span(item), columns);
    if (free === 0) free = columns;
  }
  return ordered;
};
