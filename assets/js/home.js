/* ==========================================================================
   CQST — home.js
   Home V0.1

   Kinetic logo
   - Usa los 9 PNG reales de /assets/brand/kinetic/
   - Loop con descanso
   - Pausa al salir del viewport
   - Respeta prefers-reduced-motion

   Home state
   - La cabecera cambia al entrar a Empezar
   - El hilo azul responde al scroll del hero
   - Recuerda voces completadas desde localStorage
   ========================================================================== */
(() => {
  "use strict";

  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const kinetic = $("#kineticLogo");
  const kineticButton = $("#kineticControl");
  const hero = $("#homeHero");
  const current = $("#empezar");
  const header = $("#homeHeader");
  const toast = $("#homeToast");

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

  /* Precarga para que el cambio de tema no parpadee. */
  frames.forEach((src) => {
    const image = new Image();
    image.decoding = "async";
    image.src = src;
  });

  let frame = 0;
  let timer = null;
  let pausedByUser = false;
  let heroVisible = true;
  let runningSequence = false;

  const FRAME_MS = 135;
  const REST_MS = 1200;

  function setFrame(index) {
    if (!kinetic) return;
    frame = (index + frames.length) % frames.length;
    kinetic.src = frames[frame];
  }

  function setControlState() {
    if (!kineticButton) return;
    const paused = pausedByUser || reducedMotion.matches;
    kineticButton.textContent = paused ? "▶" : "Ⅱ";
    kineticButton.setAttribute("aria-pressed", String(pausedByUser));
    kineticButton.setAttribute("aria-label", paused ? "Reanudar animación del logo" : "Pausar animación del logo");
  }

  function clearKineticTimer() {
    if (timer) clearTimeout(timer);
    timer = null;
  }

  function canAnimate() {
    return kinetic && heroVisible && !pausedByUser && !reducedMotion.matches && !document.hidden;
  }

  function scheduleRest() {
    clearKineticTimer();
    if (!canAnimate()) return;
    timer = setTimeout(runSequence, REST_MS);
  }

  function runSequence() {
    if (!canAnimate() || runningSequence) return;
    runningSequence = true;
    let step = 0;

    function tick() {
      if (!canAnimate()) {
        runningSequence = false;
        return;
      }

      step += 1;
      setFrame((frame + 1) % frames.length);

      if (step < frames.length) {
        timer = setTimeout(tick, FRAME_MS);
      } else {
        runningSequence = false;
        scheduleRest();
      }
    }

    tick();
  }

  function startKinetic() {
    clearKineticTimer();
    runningSequence = false;
    if (reducedMotion.matches) {
      setFrame(0);
      setControlState();
      return;
    }
    scheduleRest();
    setControlState();
  }

  kineticButton?.addEventListener("click", () => {
    pausedByUser = !pausedByUser;
    setControlState();
    if (pausedByUser) {
      clearKineticTimer();
      runningSequence = false;
    } else {
      scheduleRest();
    }
  });

  reducedMotion.addEventListener?.("change", startKinetic);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearKineticTimer();
      runningSequence = false;
    } else if (canAnimate()) {
      scheduleRest();
    }
  });

  if (hero && "IntersectionObserver" in window) {
    const heroObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      heroVisible = Boolean(entry?.isIntersecting);
      if (heroVisible && canAnimate()) scheduleRest();
      else {
        clearKineticTimer();
        runningSequence = false;
      }
    }, { threshold: .08 });
    heroObserver.observe(hero);
  }

  startKinetic();

  /* Hilo azul del hero. */
  function updateHeroLine() {
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    const total = Math.max(1, rect.height - innerHeight * .35);
    const travelled = Math.max(0, Math.min(total, -rect.top));
    const progress = travelled / total;
    const value = .28 + progress * .72;
    hero.style.setProperty("--hero-line", value.toFixed(3));
  }

  let raf = false;
  addEventListener("scroll", () => {
    if (raf) return;
    raf = true;
    requestAnimationFrame(() => {
      updateHeroLine();
      raf = false;
    });
  }, { passive: true });
  updateHeroLine();

  /* Header blanco sobre azul cuando entramos al ciclo actual. */
  if (current && header && "IntersectionObserver" in window) {
    const currentObserver = new IntersectionObserver((entries) => {
      header.classList.toggle("is-blue", Boolean(entries[0]?.isIntersecting));
    }, { rootMargin: "-10% 0px -82% 0px", threshold: 0 });
    currentObserver.observe(current);
  }

  /* Estado local de lectura. */
  const completionKeys = {
    rodolfo: "cqst:voice:empezar:digamos-que-empieza-aqui"
  };

  Object.entries(completionKeys).forEach(([voice, key]) => {
    if (!localStorage.getItem(key)) return;
    $(`.home-voice[data-voice="${voice}"]`)?.classList.add("is-read");
  });

  /* Stubs del laboratorio. */
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1500);
  }

  $$('[data-home-stub]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showToast("Enlace de plantilla");
    });
  });
})();
