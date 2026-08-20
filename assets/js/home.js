/* CQST V3 · home.js */
(() => {
  "use strict";

  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const isLab = document.body.dataset.lab === "true";
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(hover:hover) and (pointer:fine)");
  const saveData = navigator.connection?.saveData === true;

  const track = (name, data = {}) => {
    console.debug("[CQST]", name, data);
    if (window.umami?.track) window.umami.track(name, data);
  };

  /* LOGO CINÉTICO --------------------------------------------------------- */
  const kinetic = $("#kineticLogo");
  const stage = $("#kineticStage");
  const frames = [
    "assets/brand/kinetic/Logo.png",
    "assets/brand/kinetic/2.png",
    "assets/brand/kinetic/3.png",
    "assets/brand/kinetic/4.png",
    "assets/brand/kinetic/5.png",
    "assets/brand/kinetic/6.png",
    "assets/brand/kinetic/7.png",
    "assets/brand/kinetic/8.png",
    "assets/brand/kinetic/9.png"
  ];
  const FRAME_MS = 255;
  let frame = 0;
  let timer = null;
  let held = false;
  let heroVisible = true;

  frames.slice(1).forEach((src) => {
    const image = new Image();
    image.decoding = "async";
    image.src = src;
  });

  function canRun() {
    return kinetic && heroVisible && !held && !document.hidden && !reducedMotion.matches && !saveData;
  }

  function stop() {
    clearInterval(timer);
    timer = null;
  }

  function start() {
    stop();
    if (!canRun()) return;
    timer = setInterval(() => {
      frame = (frame + 1) % frames.length;
      kinetic.src = frames[frame];
    }, FRAME_MS);
  }

  function setHeld(value) {
    held = value;
    stage?.classList.toggle("is-held", held);
    if (held) stop(); else start();
  }

  if (finePointer.matches) {
    stage?.addEventListener("pointerenter", () => setHeld(true));
    stage?.addEventListener("pointerleave", () => setHeld(false));
  } else {
    stage?.addEventListener("click", () => setHeld(!held));
  }

  if (stage && "IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      heroVisible = Boolean(entry?.isIntersecting);
      if (heroVisible) start(); else stop();
    }, { threshold: .08 }).observe(stage);
  }

  document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());
  reducedMotion.addEventListener?.("change", () => reducedMotion.matches ? stop() : start());
  start();

  /* VOCES LEÍDAS --------------------------------------------------------- */
  const completionKey = "cqst:voice:empezar:la-fecha-la-ponemos-despues";
  if (localStorage.getItem(completionKey)) {
    $(".voice-sheet[data-voice='rodolfo']")?.classList.add("is-read");
  }

  /* DECK MÓVIL ----------------------------------------------------------- */
  const deck = $("#voiceDeck");
  const cards = $$(".voice-sheet", deck || document);
  const dots = $$(".voice-dot");

  function activeCardIndex() {
    if (!deck || !cards.length) return 0;
    const target = deck.scrollLeft + deck.clientWidth * .42;
    let index = 0;
    let best = Infinity;
    cards.forEach((card, i) => {
      const center = card.offsetLeft + card.offsetWidth / 2;
      const d = Math.abs(center - target);
      if (d < best) { best = d; index = i; }
    });
    return index;
  }

  let deckRAF = false;
  deck?.addEventListener("scroll", () => {
    if (deckRAF) return;
    deckRAF = true;
    requestAnimationFrame(() => {
      const active = activeCardIndex();
      dots.forEach((dot, i) => dot.classList.toggle("is-active", i === active));
      deckRAF = false;
    });
  }, { passive: true });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      cards[index]?.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", inline: "start", block: "nearest" });
    });
  });

  /* FORMULARIO DE LAB ---------------------------------------------------- */
  const signupPanel = $("#signupPanel");
  const signupForm = $("#signupFormV3");
  const toast = $("#homeToastV3");
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1900);
  }

  signupForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!signupForm.reportValidity()) return;
    signupPanel?.classList.add("is-success");
    track("Suscripción · intención", { origen: "portada" });
    if (isLab) showToast("Demo de formulario · todavía no guarda el correo");
  });

  $$('[data-home-stub]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showToast("Esta pieza todavía no está publicada");
    });
  });
})();
