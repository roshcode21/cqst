/* ==========================================================================
   CQST — home.js
   Home V0.2
   ========================================================================== */
(() => {
  "use strict";

  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const isLab = document.body.dataset.lab === "true";

  const track = (name, data = {}) => {
    console.debug("[CQST]", name, data);
    if (window.umami?.track) window.umami.track(name, data);
  };

  /* KINETIC --------------------------------------------------------------- */
  const kinetic = $("#kineticLogo");
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
  frames.forEach((src) => { const img = new Image(); img.decoding = "async"; img.src = src; });

  let frame = 0;
  let kineticTimer = null;
  const storedMotion = localStorage.getItem("cqst:motion");
  let motionEnabled = storedMotion === null ? !reducedMotion.matches : storedMotion === "on";
  const FRAME_MS = 265;

  function setFrame(index) {
    if (!kinetic) return;
    frame = (index + frames.length) % frames.length;
    kinetic.src = frames[frame];
  }
  function stopKinetic() {
    clearInterval(kineticTimer);
    kineticTimer = null;
  }
  function startKinetic() {
    stopKinetic();
    if (!kinetic || !motionEnabled || document.hidden) return;
    kineticTimer = setInterval(() => setFrame(frame + 1), FRAME_MS);
  }
  function syncMotionUI() {
    const toggle = $("#motionToggle");
    if (!toggle) return;
    toggle.setAttribute("aria-pressed", String(motionEnabled));
    const state = $("#motionState", toggle);
    if (state) state.textContent = motionEnabled ? "encendido" : "detenido";
  }
  function setMotion(value) {
    motionEnabled = Boolean(value);
    localStorage.setItem("cqst:motion", motionEnabled ? "on" : "off");
    syncMotionUI();
    motionEnabled ? startKinetic() : stopKinetic();
    track("Home · cambió movimiento", { estado: motionEnabled ? "encendido" : "detenido" });
  }
  $("#motionToggle")?.addEventListener("click", () => setMotion(!motionEnabled));
  reducedMotion.addEventListener?.("change", () => {
    if (storedMotion === null) setMotion(!reducedMotion.matches);
  });
  document.addEventListener("visibilitychange", () => document.hidden ? stopKinetic() : startKinetic());
  syncMotionUI();
  startKinetic();

  /* MENU ------------------------------------------------------------------ */
  const menu = $("#homeMenu");
  const menuButton = $("#menuButton");
  function openMenu() {
    if (!menu) return;
    menu.showModal();
    menuButton?.setAttribute("aria-expanded", "true");
    track("Home · abrió menú");
  }
  function closeMenu() {
    if (!menu?.open) return;
    menu.close();
    menuButton?.setAttribute("aria-expanded", "false");
  }
  menuButton?.addEventListener("click", openMenu);
  $("#menuClose")?.addEventListener("click", closeMenu);
  menu?.addEventListener("click", (event) => { if (event.target === menu) closeMenu(); });
  $$("a", menu || document.createElement("div")).forEach((a) => a.addEventListener("click", closeMenu));

  /* HEADER + HILO --------------------------------------------------------- */
  const header = $("#homeHeader");
  const hero = $("#homeHero");
  function updateChrome() {
    if (!header || !hero) return;
    const heroRect = hero.getBoundingClientRect();
    header.classList.toggle("is-branded", heroRect.bottom < innerHeight * .64);

    const x = Math.min(innerWidth - 10, Math.max(10, innerWidth / 2));
    const y = Math.min(innerHeight - 10, (header.getBoundingClientRect().bottom || 72) + 4);
    const toneElement = document.elementsFromPoint(x, y).find((el) => el instanceof Element && el.closest?.("[data-header-tone]"));
    const tone = toneElement?.closest?.("[data-header-tone]")?.dataset.headerTone || "light";
    header.classList.toggle("is-inverse", tone === "dark");

    const total = Math.max(1, heroRect.height - innerHeight * .25);
    const travelled = Math.max(0, Math.min(total, -heroRect.top));
    hero.style.setProperty("--hero-line", String(.22 + (travelled / total) * .78));
  }
  let raf = false;
  function scheduleChrome() {
    if (raf) return;
    raf = true;
    requestAnimationFrame(() => { updateChrome(); raf = false; });
  }
  addEventListener("scroll", scheduleChrome, { passive:true });
  addEventListener("resize", scheduleChrome);
  updateChrome();

  /* REVEALS --------------------------------------------------------------- */
  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold:.12 });
    $$('[data-reveal]').forEach((el) => observer.observe(el));
  } else {
    $$('[data-reveal]').forEach((el) => el.classList.add("is-visible"));
  }

  /* ESTADO DE VOCES ------------------------------------------------------- */
  const completionKeys = {
    rodolfo: "cqst:voice:empezar:la-fecha-la-ponemos-despues"
  };
  Object.entries(completionKeys).forEach(([voice,key]) => {
    if (localStorage.getItem(key)) $(`.home-voice[data-voice="${voice}"]`)?.classList.add("is-read");
  });

  /* SUSCRIPCIÓN LAB ------------------------------------------------------- */
  const signup = $("#signup");
  const signupForm = $("#signupForm");
  signupForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!signupForm.checkValidity()) { signupForm.reportValidity(); return; }
    track("Home · intención de suscripción");
    if (isLab) {
      showToast("Formulario de laboratorio · el correo todavía no se envió");
      signup?.classList.add("is-success");
      return;
    }
  });

  /* TOAST ----------------------------------------------------------------- */
  const toast = $("#homeToast");
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  $$('[data-home-stub]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showToast("Esta voz todavía no está publicada");
    });
  });
})();
