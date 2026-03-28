/**
 * Lightweight full-viewport confetti burst (canvas). Respects prefers-reduced-motion.
 * @param {number} durationMs
 */
export function burstConfetti(durationMs = 1500) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const w = window.innerWidth;
  const h = window.innerHeight;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.className = "confetti-canvas";
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText =
    "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:199;";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  const colors = ["#c9a227", "#8b2942", "#1a2744", "#faf6ef", "#e8d48b", "#5c5850"];
  const pieces = Array.from({ length: 52 }, () => ({
    x: Math.random() * w,
    y: -20 - Math.random() * h * 0.4,
    w: 5 + Math.random() * 9,
    h: 4 + Math.random() * 8,
    vx: -2.2 + Math.random() * 4.4,
    vy: 1.8 + Math.random() * 4.5,
    rot: Math.random() * Math.PI * 2,
    vr: -0.12 + Math.random() * 0.24,
    c: colors[(Math.random() * colors.length) | 0],
  }));

  const start = performance.now();

  function frame(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, w, h);
    for (const p of pieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.vy += 0.1;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (elapsed < durationMs) {
      requestAnimationFrame(frame);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(frame);
}
