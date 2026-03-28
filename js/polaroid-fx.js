/**
 * Short shake animation for polaroid cards (skipped when reduced motion is on).
 * @param {Element | null} el
 */
export function shakePolaroid(el) {
  if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  el.classList.remove("polaroid--shake");
  void el.offsetWidth;
  el.classList.add("polaroid--shake");
  el.addEventListener(
    "animationend",
    () => {
      el.classList.remove("polaroid--shake");
    },
    { once: true }
  );
}
