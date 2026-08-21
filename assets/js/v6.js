/* CQST V6 · visual-first interactions */
(() => {
  "use strict";

  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(hover:hover) and (pointer:fine)");
  const saveData = navigator.connection?.saveData === true;

  const track = (name, data = {}) => {
    if (window.umami?.track) window.umami.track(name, data);
    else console.debug("[CQST V6]", name, data);
  };

  /* KINETIC ------------------------------------------------------------- */
  const kinetic = $("#v6Kinetic");
  const kineticImage = $("#v6KineticImage");
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
  let frame = 0;
  let timer = null;
  let pinned = false;
  let hovering = false;

  if (!saveData) {
    frames.slice(1).forEach((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    });
  }

  const canRun = () => !saveData && !reduceMotion.matches && !pinned && !hovering && !document.hidden;

  const stop = () => {
    clearInterval(timer);
    timer = null;
  };

  const syncKinetic = () => {
    stop();
    if (!kineticImage) return;
    if (saveData || reduceMotion.matches) {
      frame = 0;
      kineticImage.src = frames[0];
      kinetic?.setAttribute("aria-pressed", "true");
      kinetic?.setAttribute("aria-label", "Logotipo cinético detenido");
      return;
    }
    const paused = pinned || hovering;
    kinetic?.setAttribute("aria-pressed", String(paused));
    kinetic?.setAttribute("aria-label", paused ? "Reanudar logotipo cinético" : "Pausar logotipo cinético");
    if (canRun()) {
      timer = setInterval(() => {
        frame = (frame + 1) % frames.length;
        kineticImage.src = frames[frame];
      }, FRAME_MS);
    }
  };

  kinetic?.addEventListener("pointerenter", () => {
    if (!finePointer.matches) return;
    hovering = true;
    syncKinetic();
  });
  kinetic?.addEventListener("pointerleave", () => {
    if (!finePointer.matches) return;
    hovering = false;
    syncKinetic();
  });
  kinetic?.addEventListener("focus", () => {
    hovering = true;
    syncKinetic();
  });
  kinetic?.addEventListener("blur", () => {
    hovering = false;
    syncKinetic();
  });
  kinetic?.addEventListener("click", () => {
    pinned = !pinned;
    track(pinned ? "Kinetic · pausó" : "Kinetic · reanudó", { dispositivo: finePointer.matches ? "desktop" : "touch" });
    syncKinetic();
  });
  document.addEventListener("visibilitychange", syncKinetic);
  reduceMotion.addEventListener?.("change", syncKinetic);
  syncKinetic();

  /* HERO CYCLE SWITCH --------------------------------------------------- */
  const cycleTabs = $$(".v6-cycle-tabs [data-cycle]");
  const cyclePanels = $$(".v6-cycle-panel[data-panel]");

  const switchCycle = (key) => {
    cycleTabs.forEach((tab) => tab.setAttribute("aria-selected", String(tab.dataset.cycle === key)));
    cyclePanels.forEach((panel) => {
      const active = panel.dataset.panel === key;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    track("Portada · cambió ciclo", { ciclo: key });
  };
  cycleTabs.forEach((tab) => tab.addEventListener("click", () => switchCycle(tab.dataset.cycle)));

  /* subtle console depth on pointer devices */
  const consolePanel = $("#v6CycleConsole");
  if (consolePanel && finePointer.matches && !reduceMotion.matches) {
    consolePanel.addEventListener("pointermove", (event) => {
      const r = consolePanel.getBoundingClientRect();
      const x = (event.clientX - r.left) / r.width - .5;
      const y = (event.clientY - r.top) / r.height - .5;
      consolePanel.style.transform = `perspective(1100px) rotateY(${x * 2.2}deg) rotateX(${y * -2.2}deg)`;
    });
    consolePanel.addEventListener("pointerleave", () => {
      consolePanel.style.transform = "";
    });
  }

  /* ATLAS SWITCH -------------------------------------------------------- */
  const atlasTabs = $$("[data-atlas]");
  const atlasPanels = $$("[data-atlas-panel]");
  const switchAtlas = (key) => {
    atlasTabs.forEach((tab) => tab.setAttribute("aria-selected", String(tab.dataset.atlas === key)));
    atlasPanels.forEach((panel) => {
      const active = panel.dataset.atlasPanel === key;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    track("Ciclos · cambió vista", { ciclo: key });
  };
  atlasTabs.forEach((tab) => tab.addEventListener("click", () => switchAtlas(tab.dataset.atlas)));

  /* NAV TONE ------------------------------------------------------------ */
  const nav = $("#v6Nav");
  const toneSections = $$('[data-nav-tone]');
  if (nav && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) nav.dataset.tone = visible[0].target.dataset.navTone || "light";
    }, { rootMargin: "-30% 0px -60% 0px", threshold: [0, .05, .2, .5] });
    toneSections.forEach((section) => observer.observe(section));
  }

  /* READ STATE ---------------------------------------------------------- */
  const readKeys = [
    "cqst:voice:empezar:la-fecha-la-ponemos-despues",
    "cqst:voice:empezar:digamos-que-empieza-aqui"
  ];
  if (!readKeys.some((key) => localStorage.getItem(key))) {
    $(".v6-story-row.is-read")?.classList.remove("is-read");
  }

  /* PLACEHOLDER TOAST --------------------------------------------------- */
  const toast = $("#v6Toast");
  let toastTimer;
  const showToast = (text) => {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1500);
  };
  $$('[data-placeholder]').forEach((link) => link.addEventListener("click", (event) => {
    event.preventDefault();
    showToast("Esta pieza todavía no está publicada.");
  }));

  /* TOPIC FORM ---------------------------------------------------------- */
  const topicInput = $("#v6TopicInput");
  const topicEcho = $("#v6TopicEcho");
  topicInput?.addEventListener("input", () => {
    topicEcho.textContent = topicInput.value.trim() || "tu tema";
  });
  $("#v6TopicForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = topicInput?.value.trim();
    if (!value) return;
    track("Participar · propuso tema", { longitud: value.length });
    const subject = encodeURIComponent("Tengo un tema para CQST");
    const body = encodeURIComponent(`Hola CQST,\n\nHay un tema que quiero poner sobre la mesa:\n\n${value}\n\n`);
    location.href = `mailto:hola@cadaquiensutema.com?subject=${subject}&body=${body}`;
  });

  /* NEWSLETTER LAB ------------------------------------------------------ */
  const newsForm = $("#v6NewsletterForm");
  const status = $("#v6Status");
  $("#v6Email")?.addEventListener("focus", () => track("Suscripción · enfocó correo", { origen: "V6" }), { once: true });
  newsForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = $("#v6Email")?.value.trim();
    if (!email) return;
    track("Suscripción · intentó suscribirse", { origen: "V6" });
    if (status) status.textContent = "El formulario está listo. En laboratorio todavía no guardamos el correo.";
  });
})();
