/* CQST V4 · home prototype */
(() => {
  "use strict";

  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(hover:hover) and (pointer:fine)");

  const track = (name, data = {}) => {
    if (window.umami?.track) window.umami.track(name, data);
    else console.debug("[CQST V4]", name, data);
  };

  /* ---------------------------------------------------------------------
     Kinetic · 9 masters, misma velocidad, loop continuo
     --------------------------------------------------------------------- */
  const kineticButton = $("#v4Kinetic");
  const kineticImage = $("#v4KineticImage");
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

  const FRAME_MS = 250;
  let frameIndex = 0;
  let frameTimer = null;
  let pinnedPause = false;
  let hoverPause = false;

  frames.forEach((src) => {
    const image = new Image();
    image.decoding = "async";
    image.src = src;
  });

  const shouldRun = () => !reduceMotion.matches && !pinnedPause && !hoverPause && !document.hidden;

  function paintFrame() {
    if (!kineticImage || !shouldRun()) return;
    frameIndex = (frameIndex + 1) % frames.length;
    kineticImage.src = frames[frameIndex];
  }

  function stopKinetic() {
    if (frameTimer) clearInterval(frameTimer);
    frameTimer = null;
  }

  function syncKinetic() {
    stopKinetic();
    if (!kineticImage) return;

    if (reduceMotion.matches) {
      frameIndex = 0;
      kineticImage.src = frames[0];
      kineticButton?.setAttribute("aria-pressed", "true");
      kineticButton?.setAttribute("aria-label", "Logotipo cinético detenido por preferencia de movimiento reducido");
      return;
    }

    const paused = pinnedPause || hoverPause;
    kineticButton?.setAttribute("aria-pressed", String(paused));
    kineticButton?.setAttribute("aria-label", paused ? "Reanudar logotipo cinético" : "Pausar logotipo cinético");
    if (shouldRun()) frameTimer = setInterval(paintFrame, FRAME_MS);
  }

  kineticButton?.addEventListener("pointerenter", () => {
    if (!finePointer.matches) return;
    hoverPause = true;
    syncKinetic();
  });

  kineticButton?.addEventListener("pointerleave", () => {
    if (!finePointer.matches) return;
    hoverPause = false;
    syncKinetic();
  });

  kineticButton?.addEventListener("click", () => {
    if (finePointer.matches) {
      pinnedPause = !pinnedPause;
    } else {
      pinnedPause = !pinnedPause;
    }
    track(pinnedPause ? "Kinetic · pausó" : "Kinetic · reanudó", { origen: finePointer.matches ? "desktop" : "touch" });
    syncKinetic();
  });

  kineticButton?.addEventListener("focus", () => {
    if (reduceMotion.matches) return;
    hoverPause = true;
    syncKinetic();
  });
  kineticButton?.addEventListener("blur", () => {
    hoverPause = false;
    syncKinetic();
  });

  reduceMotion.addEventListener?.("change", syncKinetic);
  document.addEventListener("visibilitychange", syncKinetic);
  syncKinetic();

  /* ---------------------------------------------------------------------
     Navegación glass sensible al contexto
     --------------------------------------------------------------------- */
  const desktopNav = $("#v4Nav");
  const mobileNav = $("#v4MobileNav");
  const toneSections = $$('[data-nav-tone]');

  function setTone(tone) {
    desktopNav?.setAttribute("data-tone", tone);
    mobileNav?.setAttribute("data-tone", tone);
  }

  if ("IntersectionObserver" in window) {
    const toneObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setTone(visible[0].target.dataset.navTone || "light");
    }, { rootMargin: "-28% 0px -58% 0px", threshold: [0, .05, .2, .5] });
    toneSections.forEach((section) => toneObserver.observe(section));
  }

  const navMap = [
    ["portada", $("#portada")],
    ["ciclos", $("#ciclos")],
    ["por-dentro", $("#por-dentro")],
    ["proponer", $("#proponer")]
  ].filter(([, section]) => section);

  if ("IntersectionObserver" in window && mobileNav) {
    const activeObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      const activeSection = visible[0]?.target;
      if (!activeSection) return;
      const key = navMap.find(([, section]) => section === activeSection)?.[0];
      if (!key) return;
      $$('[data-mobile-nav]', mobileNav).forEach((link) => {
        if (link.dataset.mobileNav === key) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-24% 0px -58% 0px", threshold: [0, .05, .2, .45] });
    navMap.forEach(([, section]) => activeObserver.observe(section));
  }

  /* ---------------------------------------------------------------------
     Estado leído
     --------------------------------------------------------------------- */
  const rodolfoRow = $('[data-track-article="rodolfo"]');
  const completionKeys = [
    "cqst:voice:empezar:la-fecha-la-ponemos-despues",
    "cqst:voice:empezar:digamos-que-empieza-aqui"
  ];
  if (rodolfoRow && !completionKeys.some((key) => localStorage.getItem(key))) {
    rodolfoRow.classList.remove("is-read");
    rodolfoRow.querySelector(".v4-piece-state")?.removeAttribute("aria-label");
  }

  rodolfoRow?.addEventListener("click", () => track("Portada · abrió artículo", { voz: "Rodolfo Raudales", ciclo: "Empezar" }));
  $('.v4-current-head a[href="../empezar/"]')?.addEventListener("click", () => track("Portada · abrió ciclo", { ciclo: "Empezar" }));

  /* ---------------------------------------------------------------------
     Placeholders honestos
     --------------------------------------------------------------------- */
  const toast = $("#v4Toast");
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
      showToast("Esta pieza todavía no tiene URL publicada.");
    });
  });

  /* ---------------------------------------------------------------------
     Tema propuesto · texto vivo + mailto
     --------------------------------------------------------------------- */
  const topicForm = $("#topicForm");
  const topicInput = $("#topicInput");
  const topicEcho = $("#topicEcho");

  topicInput?.addEventListener("input", () => {
    const value = topicInput.value.trim();
    if (topicEcho) topicEcho.textContent = value || "tu tema";
  });

  topicForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const topic = topicInput?.value.trim();
    if (!topic) return;
    track("Portada · propuso tema", { longitud: topic.length });
    const subject = encodeURIComponent("Un tema para CQST");
    const body = encodeURIComponent(`Hola CQST,\n\nHay un tema que me gustaría poner en circulación:\n\n${topic}\n\n`);
    window.location.href = `mailto:hola@cadaquiensutema.com?subject=${subject}&body=${body}`;
  });

  /* ---------------------------------------------------------------------
     Newsletter · intención en Lab
     --------------------------------------------------------------------- */
  const newsletterForm = $("#newsletterForm");
  const newsletterStatus = $("#newsletterStatus");
  newsletterForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = $("#newsletterEmail")?.value.trim();
    if (!email) return;
    track("Portada · intentó suscribirse", { origen: "V4" });
    if (newsletterStatus) newsletterStatus.textContent = "La interfaz está lista. En este laboratorio todavía no guardamos el correo.";
  });

  /* Analytics de navegación interna */
  $('a[href="#por-dentro"]')?.addEventListener("click", () => track("Portada · abrió Por dentro"));
})();