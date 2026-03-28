/**
 * @typedef {{
 *   id: string,
 *   name: string,
 *   division: string,
 *   year: number,
 *   quote: string,
 *   photo: string,
 *   gallery: string[],
 *   nickname?: string,
 *   funFact?: string
 * }} Intern
 */

/** @type {Intern[] | null} */
let cache = null;

/**
 * Loads and caches interns.json. Must be awaited before using getters.
 * @returns {Promise<Intern[]>}
 */
export async function loadInterns() {
  if (cache) return cache;
  const res = await fetch("data/interns.json");
  if (!res.ok) {
    throw new Error("Gagal memuat data peserta magang.");
  }
  const data = await res.json();
  cache = Array.isArray(data) ? data : [];
  return cache;
}

/**
 * @param {string} id
 * @returns {Intern | undefined}
 */
export function getInternById(id) {
  if (!cache || !id) return undefined;
  return cache.find((p) => p.id === id);
}

/**
 * Unique years, newest first.
 * @returns {number[]}
 */
export function getYears() {
  if (!cache || cache.length === 0) return [];
  const years = [...new Set(cache.map((p) => p.year))];
  return years.sort((a, b) => b - a);
}

