/* CQST — article/audio.js
   <audio> nativo + interfaz CQST. Sin autoplay.

   AUDIO REAL
   Solo sube el MP3 a la ruta declarada en el <source> del artículo.
   Este archivo detecta la metadata automáticamente y activa el reproductor.
*/
(() => {
  "use strict";

  const { $, track, showToast, completeVoice, isLab, body } = window.CQST;

  const entry = $("#audioEntry");
  const audio = $("#articleAudio");
  const mainButton = $("#audioMainButton");
  const icon = $("#audioIcon");
  const time = $("#audioTime");
  const dock = $("#audioDock");
  const dockPlay = $("#audioDockPlay");
  const range = $("#audioDockRange");
  const current = $("#audioDockCurrent");
  const duration = $("#audioDockDuration");
  const speed = $("#audioSpeed");

  const speeds = [1, 1.25, 1.5, 1.75, 2];
  let speedIndex = 0;
  let ready = false;
  const quartiles = new Set();

  function fmt(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "—";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function setReady(value) {
    ready = value;
    entry?.setAttribute("data-audio-ready", value ? "true" : "false");
    mainButton?.setAttribute("aria-disabled", value ? "false" : "true");
    if (!value && time) time.textContent = "";
  }

  function setState(playing) {
    const glyph = playing ? "Ⅱ" : "▶";
    if (icon) icon.textContent = glyph;
    if (dockPlay) dockPlay.textContent = glyph;
    entry?.setAttribute("data-state", playing ? "playing" : "paused");
    dock?.classList.toggle("is-open", playing || (audio?.currentTime || 0) > 0);
  }

  async function toggle() {
    if (!audio || !ready) {
      if (isLab) showToast("El audio se activará al subir el MP3");
      return;
    }

    if (audio.paused) {
      try { await audio.play(); }
      catch { showToast("No se pudo iniciar el audio"); }
    } else {
      audio.pause();
    }
  }

  mainButton?.addEventListener("click", toggle);
  dockPlay?.addEventListener("click", toggle);

  if (!audio) return;

  audio.addEventListener("loadedmetadata", () => {
    setReady(true);
    const value = fmt(audio.duration);
    if (time) time.textContent = value;
    if (duration) duration.textContent = value;
    if (range) range.max = String(audio.duration || 0);

    if ("mediaSession" in navigator && "MediaMetadata" in window) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: body.dataset.title || document.title,
          artist: body.dataset.authorName || "Rodolfo Raudales",
          album: `Cada quien su tema · ${body.dataset.cycleName || "Empezar"}`,
          artwork: [
            { src: "../../assets/brand/icon-192.png", sizes: "192x192", type: "image/png" },
            { src: "../../assets/brand/icon-512.png", sizes: "512x512", type: "image/png" }
          ]
        });
      } catch {}
    }
  });

  audio.addEventListener("error", () => setReady(false));
  audio.addEventListener("emptied", () => setReady(false));

  audio.addEventListener("play", () => {
    setState(true);
    track("audio_start");
  });

  audio.addEventListener("pause", () => setState(false));

  audio.addEventListener("timeupdate", () => {
    const total = audio.duration || 0;
    const now = audio.currentTime || 0;
    const ratio = total ? now / total : 0;

    if (current) current.textContent = fmt(now);
    if (range && document.activeElement !== range) range.value = String(now);

    [25, 50, 75].forEach((percent) => {
      if (ratio >= percent / 100 && !quartiles.has(percent)) {
        quartiles.add(percent);
        track("audio_progress", { porcentaje: percent });
      }
    });
  });

  audio.addEventListener("ended", () => {
    setState(false);
    track("audio_complete");
    completeVoice("audio");
  });

  range?.addEventListener("input", () => {
    if (ready) audio.currentTime = Number(range.value);
  });

  speed?.addEventListener("click", () => {
    if (!ready) return;
    speedIndex = (speedIndex + 1) % speeds.length;
    audio.playbackRate = speeds[speedIndex];
    speed.textContent = `${speeds[speedIndex]}×`;
    track("audio_speed_change", { velocidad: speeds[speedIndex] });
  });

  if ("mediaSession" in navigator) {
    try {
      navigator.mediaSession.setActionHandler("play", () => audio.play());
      navigator.mediaSession.setActionHandler("pause", () => audio.pause());
      navigator.mediaSession.setActionHandler("seekbackward", details => {
        audio.currentTime = Math.max(0, audio.currentTime - (details.seekOffset || 10));
      });
      navigator.mediaSession.setActionHandler("seekforward", details => {
        audio.currentTime = Math.min(audio.duration || Infinity, audio.currentTime + (details.seekOffset || 10));
      });
    } catch {}
  }

  /* Si el archivo ya existe, preload=metadata disparará loadedmetadata.
     Si todavía no existe, el error se queda silencioso hasta que el MP3 se suba. */
  setReady(audio.readyState >= 1);
})();