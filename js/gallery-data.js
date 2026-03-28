/** @typedef {{ src: string, caption: string }} GalleryPhoto */

/** @type {GalleryPhoto[] | null} */
let galleryCache = null;

/**
 * @returns {Promise<GalleryPhoto[]>}
 */
export async function loadGalleryPhotos() {
  if (galleryCache) return galleryCache;
  const res = await fetch("data/gallery-photos.json");
  if (!res.ok) throw new Error("Gagal memuat galeri foto.");
  const data = await res.json();
  galleryCache = Array.isArray(data) ? data : [];
  return galleryCache;
}

/**
 * Fisher–Yates shuffle (copy).
 * @template T
 * @param {T[]} arr
 * @returns {T[]}
 */
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
