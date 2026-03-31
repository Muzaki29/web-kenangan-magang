import { loadInterns, getInternById } from "./data.js";
import { initModal, escapeHtml } from "./ui-modal.js";
import { shakePolaroid } from "./polaroid-fx.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const errorEl = document.querySelector("#detail-error");
const contentEl = document.querySelector("#detail-content");
const detailPhoto = document.querySelector("#detail-photo");
const detailName = document.querySelector("#detail-name");
const detailDivision = document.querySelector("#detail-division");
const detailYear = document.querySelector("#detail-year");
const detailQuote = document.querySelector("#detail-quote");
const galleryGrid = document.querySelector("#detail-gallery-grid");
const detailGallerySection = document.querySelector("#detail-gallery");

function showError(message) {
  if (errorEl) {
    errorEl.hidden = false;
    errorEl.textContent = message;
  }
  if (contentEl) contentEl.hidden = true;
}

async function init() {
  if (!id) {
    showError("Parameter id tidak ditemukan. Kembali ke direktori untuk memilih peserta.");
    return;
  }

  try {
    await loadInterns();
  } catch (e) {
    showError(
      e instanceof Error
        ? e.message
        : "Gagal memuat data. Buka situs lewat server HTTP (mis. Laragon)."
    );
    return;
  }

  const intern = getInternById(id);
  if (!intern) {
    showError("Peserta magang tidak ditemukan.");
    document.title = "Tidak ditemukan — Museum Penerangan";
    return;
  }

  document.title = `${intern.name} — Arsip Kenangan Magang`;

  if (errorEl) errorEl.hidden = true;
  if (contentEl) contentEl.hidden = false;

  if (detailPhoto) {
    detailPhoto.src = intern.photo;
    detailPhoto.alt = `Foto profil ${intern.name}`;
  }
  if (detailName) detailName.textContent = intern.name;
  if (detailDivision) detailDivision.textContent = intern.division;
  if (detailYear) detailYear.textContent = `Tahun ${intern.year}`;
  if (detailQuote) detailQuote.textContent = intern.quote;

  const modalApi = initModal("#photo-modal");
  const imgs = [...(intern.gallery || [])];
  if (detailGallerySection) {
    detailGallerySection.hidden = imgs.length === 0;
  }
  if (galleryGrid) {
    galleryGrid.innerHTML = "";
    imgs.forEach((src) => {
      const li = document.createElement("li");
      li.className = "polaroid";
      li.tabIndex = 0;
      li.setAttribute("role", "button");
      const inner = document.createElement("div");
      inner.className = "polaroid__inner";
      const img = document.createElement("img");
      img.src = src;
      img.alt = `Galeri ${intern.name}`;
      img.loading = "lazy";
      inner.appendChild(img);
      const cap = document.createElement("p");
      cap.className = "polaroid__caption";
      cap.innerHTML = `<strong>${escapeHtml(intern.name)}</strong>${intern.year ? ` · ${escapeHtml(String(intern.year))}` : ""}`;
      li.appendChild(inner);
      li.appendChild(cap);
      const open = () => {
        shakePolaroid(li);
        modalApi?.open({
          src,
          alt: img.alt,
          captionHtml: `<strong>${escapeHtml(intern.name)}</strong> · ${escapeHtml(String(intern.year))}`,
        });
      };
      li.addEventListener("click", open);
      li.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });
      galleryGrid.appendChild(li);
    });
  }
}

init();
