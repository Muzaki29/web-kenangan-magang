const audio = document.querySelector("#site-audio");
const toggle = document.querySelector("#music-dock-toggle");
const btnText = toggle?.querySelector(".music-dock__btn-text");
const btnIcon = toggle?.querySelector(".music-dock__btn-icon");
const errEl = document.querySelector("#music-dock-error");

function clearAudioError() {
  if (errEl) {
    errEl.textContent = "";
    errEl.hidden = true;
  }
}

function showAudioError(message) {
  if (errEl) {
    errEl.textContent = message;
    errEl.hidden = false;
  }
}

function mediaErrorHint() {
  if (!audio?.error) return "";
  const c = audio.error.code;
  if (c === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) return " (file tidak didukung / format salah)";
  if (c === MediaError.MEDIA_ERR_NETWORK) return " (gagal unduh — cek jaringan)";
  if (c === MediaError.MEDIA_ERR_DECODE) return " (gagal decode berkas)";
  return "";
}

function setPlayingUI(playing) {
  document.body.classList.toggle("music-playing", !!playing);
  if (!toggle) return;
  toggle.setAttribute("aria-pressed", playing ? "true" : "false");
  toggle.setAttribute(
    "aria-label",
    playing ? "Jeda lagu kenangan" : "Putar lagu kenangan"
  );
  if (btnText) btnText.textContent = playing ? "Jeda" : "Putar";
  if (btnIcon) btnIcon.textContent = playing ? "⏸" : "▶";
}

function syncUI() {
  if (audio) setPlayingUI(!audio.paused);
}

if (audio) {
  audio.addEventListener("error", () => {
    setPlayingUI(false);
    showAudioError(
      "Lagu gagal dimuat." +
        mediaErrorHint() +
        " Pastikan berkas audio/lagu-kenangan.mp3 ada, dan buka situs lewat http:// (Laragon/localhost), bukan dengan membuka file .html langsung."
    );
  });
  audio.addEventListener("canplaythrough", () => clearAudioError());
}

if (audio && toggle) {
  audio.addEventListener("play", () => setPlayingUI(true));
  audio.addEventListener("pause", () => setPlayingUI(false));
  audio.addEventListener("ended", () => setPlayingUI(false));

  /**
   * Jangan pakai async/await di sini: di Safari/iOS gesture "klik" harus
   * langsung memanggil play() supaya tidak ditolak kebijakan autoplay.
   */
  toggle.addEventListener("click", () => {
    clearAudioError();
    if (audio.paused) {
      const p = audio.play();
      if (p !== undefined) {
        p.catch(() => {
          setPlayingUI(false);
          showAudioError(
            "Tidak bisa memutar. Buka lewat alamat http:// (bukan file://). Di iPhone/iPad, tetap dalam satu tab dan klik Putar sekali lagi."
          );
        });
      }
    } else {
      audio.pause();
    }
  });

  syncUI();
}
