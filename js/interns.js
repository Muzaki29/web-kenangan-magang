import { loadInterns, getYears } from "./data.js";
import { escapeHtml } from "./ui-modal.js";

const grid = document.querySelector("#intern-grid");
const yearFilter = document.querySelector("#year-filter");
const errorEl = document.querySelector("#interns-error");

function showError(message) {
  if (errorEl) {
    errorEl.hidden = false;
    errorEl.textContent = message;
  }
  if (grid) grid.innerHTML = "";
}

function renderCards(interns, year) {
  if (!grid) return;
  const list = year === "all" ? interns : interns.filter((p) => String(p.year) === year);
  grid.innerHTML = "";
  if (list.length === 0) {
    grid.innerHTML =
      '<li class="empty-state" style="grid-column: 1 / -1;">Tidak ada peserta untuk tahun ini.</li>';
    return;
  }
  for (const p of list) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.className = "intern-card";
    a.href = `intern.html?id=${encodeURIComponent(p.id)}`;
    const nick =
      typeof p.nickname === "string" && p.nickname.trim()
        ? `<p class="intern-card__nick">${escapeHtml(p.nickname.trim())}</p>`
        : "";
    const fun =
      typeof p.funFact === "string" && p.funFact.trim()
        ? `<p class="intern-card__fun">${escapeHtml(p.funFact.trim())}</p>`
        : "";
    a.innerHTML = `
      <div class="intern-card__photo">
        <img src="${escapeAttr(p.photo)}" alt="" width="400" height="300" loading="lazy" />
      </div>
      <div class="intern-card__body">
        <h2 class="intern-card__name">${escapeHtml(p.name)}</h2>
        ${nick}
        <p class="intern-card__meta">${escapeHtml(p.division)}</p>
        ${fun}
        <span class="intern-card__year">Angkatan ${escapeHtml(String(p.year))}</span>
      </div>
    `;
    const img = a.querySelector("img");
    if (img) img.alt = `Foto profil ${p.name}`;
    li.appendChild(a);
    grid.appendChild(li);
  }
}

function escapeAttr(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

async function init() {
  if (!grid || !yearFilter) return;
  try {
    const interns = await loadInterns();
    const years = getYears();
    yearFilter.innerHTML = '<option value="all">Semua</option>';
    for (const y of years) {
      const opt = document.createElement("option");
      opt.value = String(y);
      opt.textContent = String(y);
      yearFilter.appendChild(opt);
    }
    renderCards(interns, yearFilter.value);
    yearFilter.addEventListener("change", () => {
      renderCards(interns, yearFilter.value);
    });
  } catch (e) {
    showError(
      e instanceof Error
        ? e.message
        : "Gagal memuat data. Buka situs lewat server HTTP (mis. Laragon), bukan file://."
    );
  }
}

init();
