const el = document.querySelector("#footer-fun-fact");

if (el) {
  fetch("data/fun-facts.json")
    .then((r) => (r.ok ? r.json() : null))
    .then((arr) => {
      if (!Array.isArray(arr) || arr.length === 0) return;
      const line = arr[Math.floor(Math.random() * arr.length)];
      if (typeof line === "string" && line.trim()) {
        el.textContent = line.trim();
        el.hidden = false;
      }
    })
    .catch(() => {});
}
