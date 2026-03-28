import { loadGalleryPhotos, shuffle } from "./gallery-data.js";
import { initModal, escapeHtml } from "./ui-modal.js";
import { shakePolaroid } from "./polaroid-fx.js";
import { burstConfetti } from "./confetti.js";

const grid = document.querySelector("#photo-grid");
const errorEl = document.querySelector("#gallery-error");
const btnRandom = document.querySelector("#btn-random");

const modal = initModal("#photo-modal");

/** @type {{ src: string, caption: string }[]} */
let items = [];

function showError(message) {
  if (errorEl) {
    errorEl.hidden = false;
    errorEl.textContent = message;
  }
  if (grid) grid.innerHTML = "";
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function renderGrid() {
  if (!grid || !modal) return;
  grid.innerHTML = "";
  items.forEach((item, i) => {
    const li = document.createElement("li");
    li.className = "scatter-polaroid";
    li.tabIndex = 0;
    li.setAttribute("role", "button");

    if (!prefersReducedMotion()) {
      li.style.setProperty("--scatter-r", `${rand(-16, 16)}deg`);
      li.style.setProperty("--scatter-y", `${rand(-10, 14)}px`);
      li.style.setProperty("--scatter-x", `${rand(-12, 12)}px`);
      li.style.zIndex = String(10 + ((i * 7) % 18));
    } else {
      li.style.setProperty("--scatter-r", "0deg");
      li.style.setProperty("--scatter-y", "0px");
      li.style.setProperty("--scatter-x", "0px");
    }

    const inner = document.createElement("div");
    inner.className = "scatter-polaroid__inner";
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.caption || "Kenangan magang bersama";
    img.loading = "lazy";
    inner.appendChild(img);
    const cap = document.createElement("p");
    cap.className = "scatter-polaroid__caption";
    cap.textContent = item.caption || "Kenangan magang";
    li.appendChild(inner);
    li.appendChild(cap);

    const open = () => {
      shakePolaroid(li);
      modal.open({
        src: item.src,
        alt: img.alt,
        captionHtml: escapeHtml(item.caption || "Kenangan magang"),
      });
    };
    li.addEventListener("click", open);
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
    grid.appendChild(li);
  });
}

if (!modal) {
  showError("Komponen modal tidak ditemukan.");
}

function randomMemory() {
  if (!modal || items.length === 0) return;
  const pick = items[Math.floor(Math.random() * items.length)];
  burstConfetti();
  modal.open({
    src: pick.src,
    alt: pick.caption || "Kenangan acak",
    captionHtml: escapeHtml(pick.caption || "Kenangan magang"),
  });
}

async function init() {
  try {
    const photos = await loadGalleryPhotos();
    if (!modal) return;
    if (photos.length === 0) {
      showError("Belum ada foto di galeri.");
      return;
    }
    items = shuffle(photos);
    if (errorEl) errorEl.hidden = true;
    renderGrid();
    btnRandom?.addEventListener("click", randomMemory);
  } catch (e) {
    showError(
      e instanceof Error
        ? e.message
        : "Gagal memuat data. Buka situs lewat server HTTP (mis. Laragon)."
    );
  }
}

init();
