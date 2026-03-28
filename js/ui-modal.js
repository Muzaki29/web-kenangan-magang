/**
 * @param {string} rootSelector
 * @returns {{ open: (opts: { src: string, alt?: string, captionHtml?: string }) => void, close: () => void } | null}
 */
export function initModal(rootSelector = "#photo-modal") {
  const modal = document.querySelector(rootSelector);
  if (!modal) return null;

  const img = modal.querySelector("#modal-image");
  const caption = modal.querySelector("#modal-caption");
  const closeBtn = modal.querySelector(".modal__close");

  if (!img || !caption) return null;

  function close() {
    modal.classList.remove("is-open");
    modal.setAttribute("hidden", "");
    document.body.style.overflow = "";
  }

  /**
   * @param {{ src: string, alt?: string, captionHtml?: string }} opts
   */
  function open(opts) {
    img.src = opts.src;
    img.alt = opts.alt || "";
    caption.innerHTML = opts.captionHtml || "";
    modal.removeAttribute("hidden");
    requestAnimationFrame(() => modal.classList.add("is-open"));
    document.body.style.overflow = "hidden";
  }

  closeBtn?.addEventListener("click", close);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      close();
    }
  });

  return { open, close };
}

/**
 * @param {string} text
 * @returns {string}
 */
export function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
