import { loadGalleryPhotos, shuffle } from "./gallery-data.js";
import { escapeHtml } from "./ui-modal.js";

const teaserGrid = document.querySelector("#teaser-grid");
const teaserError = document.querySelector("#teaser-error");
const heroMood = document.querySelector("#hero-mood");
const heroMoodBtn = document.querySelector("#hero-mood-btn");

const MOOD_LINES = [
  "Hari ini mode-nya: senyum tipis + nostalgia sedikit saja.",
  "Kalau kenangan bisa difotokopi, stok kertas kita mungkin sudah habis.",
  "Lagi bingung kangen momen yang mana? Coba tombol Kenangan acak di galeri.",
  "Magang di sini tuh ikut nulis bab kecil di cerita besar museum.",
  "Polaroid digital: nggak perlu dikocok, cukup diklik.",
  "Rumus klasik: kopi anget + tumpukan arsip + obrolan ringan.",
];

let moodIndex = Math.floor(Math.random() * MOOD_LINES.length);

function showMood(fade) {
  if (!heroMood) return;
  const line = MOOD_LINES[moodIndex];
  if (fade && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
    heroMood.classList.add("is-fading");
    setTimeout(() => {
      heroMood.textContent = line;
      heroMood.classList.remove("is-fading");
    }, 200);
  } else {
    heroMood.textContent = line;
  }
}

function nextMood() {
  moodIndex = (moodIndex + 1) % MOOD_LINES.length;
  showMood(true);
}

if (heroMood) {
  showMood(false);
  heroMoodBtn?.addEventListener("click", nextMood);
}

function teaserRand(min, max) {
  return min + Math.random() * (max - min);
}

async function init() {
  if (!teaserGrid) return;
  try {
    const photos = await loadGalleryPhotos();
    const picks = shuffle(photos).slice(0, 6);
    teaserGrid.innerHTML = "";
    if (teaserError) teaserError.hidden = true;
    const motionOk = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    for (const ph of picks) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.className = "scatter-polaroid teaser-scatter-polaroid";
      a.href = "gallery.html";
      if (motionOk) {
        a.style.setProperty("--scatter-r", `${teaserRand(-10, 10)}deg`);
        a.style.setProperty("--scatter-y", `${teaserRand(-6, 8)}px`);
        a.style.setProperty("--scatter-x", `${teaserRand(-6, 6)}px`);
      }
      a.innerHTML = `
        <div class="scatter-polaroid__inner">
          <img src="${escapeAttr(ph.src)}" alt="" width="200" height="250" loading="lazy" />
        </div>
        <p class="scatter-polaroid__caption">${escapeHtml(ph.caption || "Kenangan magang")}</p>
      `;
      const img = a.querySelector("img");
      if (img) img.alt = ph.caption || "Cuplikan galeri";
      li.appendChild(a);
      teaserGrid.appendChild(li);
    }
  } catch {
    if (teaserError) teaserError.hidden = false;
    if (teaserGrid) teaserGrid.innerHTML = "";
  }
}

function escapeAttr(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

init();
