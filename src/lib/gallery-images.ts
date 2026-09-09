import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";

// Keep authors' public URLs and originals intact; Astro owns the generated,
// fingerprinted previews and their build cache.
const sources = import.meta.glob<{ default: ImageMetadata }>(
  "/public/images/gallery/**/*.{webp,jpg,jpeg,png,avif}",
  { eager: true }
);

export interface GalleryImage {
  src: string;
  srcset: string;
  width: number;
  height: number;
}

const previews = new Map<string, Promise<GalleryImage>>();

export const getGalleryImage = (publicPath: string): Promise<GalleryImage> => {
  const cached = previews.get(publicPath);
  if (cached) return cached;

  const pending = (async () => {
    const source = sources[`/public${publicPath}`]?.default;
    if (!source) throw new Error(`Gallery image not found: ${publicPath}`);

    const image = await getImage({
      src: source,
      widths: [480, 960, 1440],
      format: "webp",
      quality: 82
    });
    // Read the resolved metadata. Reading the original ESM proxy directly
    // would tell Astro to publish a second, unused copy of the source image.
    const metadata = image.options.src as ImageMetadata;
    const fallback = image.srcSet.values.find((candidate) => candidate.descriptor === "960w")
      ?? image.srcSet.values.at(-1);
    return {
      src: fallback?.url ?? image.src,
      srcset: image.srcSet.attribute,
      width: metadata.width,
      height: metadata.height
    };
  })();

  previews.set(publicPath, pending);
  return pending;
};
