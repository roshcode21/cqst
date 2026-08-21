/* CQST V5 · home prototype */
(() => {
  "use strict";

  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(hover:hover) and (pointer:fine)");
  const saveData = Boolean(navigator.connection?.saveData);

  const track = (name, data = {}) => {
    if (window.umami?.track) window.umami.track(name, data);
    else console.debug("[CQST V5]", name, data);
  };

  /* KINETIC ------------------------------------------------------------- */
  const kinetic = $("#v5Kinetic");
  const kineticImage = $("#v5KineticImage");
  const frames = [
    "../assets/brand/kinetic/Logo.png",
    "../assets/brand/kinetic/2.png",
    "../assets/brand/kinetic/3.png",
    "../assets/brand/kinetic/4.png",
    "../assets/brand/kinetic/5.png",
    "../assets/brand/kinetic/6.png",
    "../assets/brand/kinetic/7.png",
    "../assets/brand/kinetic/8.png",
    "../assets/brand/kinetic/9.png"
  ];
  const FRAME_MS = 260;
  let frameIndex = 0;
  let timer = null;
  let pinned = false;
  let hoverPause = false;

  if (!saveData) {
    frames.slice(1).forEach((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    });
  }

  const canRun = () => !reducedMotion.matches && !saveData && !document.hidden && !pinned && !hoverPause;

  function stopKinetic() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function nextFrame() {
    if (!kineticImage || !canRun()) return;
    frameIndex = (frameIndex + 1) % frames.length;
    kineticImage.src = frames[frameIndex];
  }

  function syncKinetic() {
    stopKinetic();
    if (!kinetic || !kineticImage) return;

    if (reducedMotion.matches || saveData) {
      frameIndex = 0;
      kineticImage.src = frames[0];
      kinetic.setAttribute("aria-pressed", "true");
      kinetic.setAttribute("aria-label", saveData ? "Logotipo cinético detenido para ahorrar datos" : "Logotipo cinético detenido por preferencia de movimiento reducido");
      return;
    }

    const paused = pinned || hoverPause;
    kinetic.setAttribute("aria-pressed", String(paused));
    kinetic.setAttribute("aria-label", paused ? "Reanudar logotipo cinético" : "Pausar logotipo cinético");
    if (canRun()) timer = setInterval(nextFrame, FRAME_MS);
  }

  kinetic?.addEventListener("pointerenter", () => {
    if (!finePointer.matches || pinned) return;
    hoverPause = true;
    syncKinetic();
  });
  kinetic?.addEventListener("pointerleave", () => {
    if (!finePointer.matches || pinned) return;
    hoverPause = false;
    syncKinetic();
  });
  kinetic?.addEventListener("focus", () => {
    if (pinned) return;
    hoverPause = true;
    syncKinetic();
  });
  kinetic?.addEventListener("blur", () => {
    if (pinned) return;
    hoverPause = false;
    syncKinetic();
  });
  kinetic?.addEventListener("click", () => {
    if (reducedMotion.matches || saveData) return;
    pinned = !pinned;
    hoverPause = false;
    track(pinned ? "Portada V5 · pausó kinetic" : "Portada V5 · reanudó kinetic", { dispositivo: finePointer.matches ? "puntero" : "touch" });
    syncKinetic();
  });
  reducedMotion.addEventListener?.("change", syncKinetic);
  document.addEventListener("visibilitychange", syncKinetic);
  syncKinetic();

  /* GLASS SHELL --------------------------------------------------------- */
  const desktopNav = $("#v5Nav");
  const mobileNav = $("#v5MobileNav");
  const toneSections = $$('[data-nav-tone]');

  const setTone = (tone) => {
    desktopNav?.setAttribute("data-tone", tone);
    mobileNav?.setAttribute("data-tone", tone);
  };

  if ("IntersectionObserver" in window) {
    const toneObserver = new IntersectionObserver((entries) => {
      const winner = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (winner) setTone(winner.target.dataset.navTone || "light");
    }, { rootMargin: "-26% 0px -61% 0px", threshold: [0, .08, .2, .45] });
    toneSections.forEach((section) => toneObserver.observe(section));
  }

  const navSections = [
    ["portada", $("#portada")],
    ["ciclos", $("#ciclos")],
    ["por-dentro", $("#por-dentro")],
    ["proponer", $("#proponer")]
  ].filter(([, element]) => element);

  if ("IntersectionObserver" in window && mobileNav) {
    const activeObserver = new IntersectionObserver((entries) => {
      const winner = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!winner) return;
      const key = navSections.find(([, element]) => element === winner.target)?.[0];
      if (!key) return;
      $$('[data-mobile-key]', mobileNav).forEach((link) => {
        if (link.dataset.mobileKey === key) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-27% 0px -59% 0px", threshold: [0, .05, .2, .45] });
    navSections.forEach(([, element]) => activeObserver.observe(element));
  }

  /* Read state ---------------------------------------------------------- */
  const rodolfo = $('[data-track="article-rodolfo"]');
  const completionKeys = [
    "cqst:voice:empezar:la-fecha-la-ponemos-despues",
    "cqst:voice:empezar:digamos-que-empieza-aqui"
  ];
  if (rodolfo && !completionKeys.some((key) => localStorage.getItem(key))) {
    rodolfo.classList.remove("is-read");
    rodolfo.querySelector(".v5-story-satellite")?.removeAttribute("aria-label");
  }

  rodolfo?.addEventListener("click", () => track("Portada V5 · abrió artículo", { ciclo: "Empezar", voz: "Rodolfo Raudales" }));
  $('[data-track="cycle-empezar"]')?.addEventListener("click", () => track("Portada V5 · abrió ciclo", { ciclo: "Empezar" }));

  /* Lab placeholders --------------------------------------------------- */
  const toast = $("#v5Toast");
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1700);
  }

  $$('[data-placeholder]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showToast("Esta pieza todavía no tiene una URL publicada.");
    });
  });

  /* Topic proposal ----------------------------------------------------- */
  const topicForm = $("#v5TopicForm");
  const topicInput = $("#v5TopicInput");
  const topicEcho = $("#v5TopicEcho");

  topicInput?.addEventListener("focus", () => track("Portada V5 · empezó propuesta de tema"), { once: true });
  topicInput?.addEventListener("input", () => {
    const value = topicInput.value.trim();
    if (topicEcho) topicEcho.textContent = value || "¿qué tema?";
  });

  topicForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const topic = topicInput?.value.trim();
    if (!topic) return;
    track("Portada V5 · propuso tema", { caracteres: topic.length });
    const subject = encodeURIComponent("Tengo un tema para CQST");
    const body = encodeURIComponent(`Hola CQST,\n\nHay un tema que me gustaría compartir:\n\n${topic}\n\nLo sigo pensando porque...\n\n`);
    window.location.href = `mailto:hola@cadaquiensutema.com?subject=${subject}&body=${body}`;
  });

  /* Newsletter lab ----------------------------------------------------- */
  const newsletterForm = $("#v5NewsletterForm");
  const newsletterEmail = $("#v5NewsletterEmail");
  const newsletterStatus = $("#v5NewsletterStatus");

  newsletterEmail?.addEventListener("focus", () => track("Portada V5 · enfocó suscripción"), { once: true });
  newsletterForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = newsletterEmail?.value.trim();
    if (!email) return;
    track("Portada V5 · intentó suscribirse", { origen: "home-v5" });
    if (newsletterStatus) newsletterStatus.textContent = "La interfaz está lista. En este laboratorio todavía no guardamos el correo.";
  });

  /* Internal navigation analytics ------------------------------------ */
  $$('a[href="#ciclos"]').forEach((link) => link.addEventListener("click", () => track("Portada V5 · navegó a ciclos")));
  $$('a[href="#por-dentro"]').forEach((link) => link.addEventListener("click", () => track("Portada V5 · navegó a Por dentro")));
  $$('a[href="#proponer"]').forEach((link) => link.addEventListener("click", () => track("Portada V5 · navegó a Proponer")));
})();