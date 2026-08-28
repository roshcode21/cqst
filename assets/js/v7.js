(() => {
  "use strict";

  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(hover:hover) and (pointer:fine)");
  const saveData = navigator.connection?.saveData === true;

  const track = (name, data = {}) => {
    if (window.umami?.track) window.umami.track(name, data);
  };

  /* kinetic */
  const kinetic = $("#v7Kinetic");
  const kineticImage = $("#v7KineticImage");
  const frames = ["Logo.png","2.png","3.png","4.png","5.png","6.png","7.png","8.png","9.png"].map(f => `../assets/brand/kinetic/${f}`);
  let frame = 0;
  let timer = null;
  let pinned = false;
  let hoverPause = false;

  if (!saveData) {
    frames.slice(1).forEach(src => { const i = new Image(); i.decoding = "async"; i.src = src; });
  }

  const canRun = () => !reduceMotion.matches && !saveData && !pinned && !hoverPause && !document.hidden;
  const stop = () => { if (timer) clearInterval(timer); timer = null; };
  const sync = () => {
    stop();
    if (!kineticImage) return;
    if (reduceMotion.matches || saveData) {
      frame = 0;
      kineticImage.src = frames[0];
      return;
    }
    kinetic?.setAttribute("aria-pressed", String(pinned));
    if (canRun()) timer = setInterval(() => {
      frame = (frame + 1) % frames.length;
      kineticImage.src = frames[frame];
    }, 270);
  };

  kinetic?.addEventListener("pointerenter", () => { if (!finePointer.matches) return; hoverPause = true; sync(); });
  kinetic?.addEventListener("pointerleave", () => { if (!finePointer.matches) return; hoverPause = false; sync(); });
  kinetic?.addEventListener("click", () => { pinned = !pinned; track("Portada · kinetic", { estado: pinned ? "pausado" : "activo" }); sync(); });
  kinetic?.addEventListener("focus", () => { hoverPause = true; sync(); });
  kinetic?.addEventListener("blur", () => { hoverPause = false; sync(); });
  document.addEventListener("visibilitychange", sync);
  reduceMotion.addEventListener?.("change", sync);
  sync();

  /* tabs hero */
  $$('[data-cycle-tab]').forEach(btn => btn.addEventListener("click", () => {
    const key = btn.dataset.cycleTab;
    $$('[data-cycle-tab]').forEach(b => b.setAttribute("aria-selected", String(b === btn)));
    $$('[data-cycle-view]').forEach(v => {
      const active = v.dataset.cycleView === key;
      v.hidden = !active;
      v.classList.toggle("is-active", active);
    });
    track("Portada · cambió ciclo destacado", { ciclo: key });
  }));

  /* tabs reader */
  $$('[data-reader-tab]').forEach(btn => btn.addEventListener("click", () => {
    const key = btn.dataset.readerTab;
    $$('[data-reader-tab]').forEach(b => b.classList.toggle("is-active", b === btn));
    $$('[data-reader-panel]').forEach(p => {
      const active = p.dataset.readerPanel === key;
      p.hidden = !active;
      p.classList.toggle("is-active", active);
    });
    track("Leer × tema · cambió ciclo", { ciclo: key });
  }));

  /* read state */
  const rodolfo = $('[data-track="article-rodolfo"]');
  const keys = ["cqst:voice:empezar:la-fecha-la-ponemos-despues","cqst:voice:empezar:digamos-que-empieza-aqui"];
  if (rodolfo && !keys.some(k => localStorage.getItem(k))) rodolfo.classList.remove("is-read");
  rodolfo?.addEventListener("click", () => track("Portada · abrió artículo", { ciclo: "Empezar", voz: "Rodolfo Raudales" }));

  /* placeholders */
  const toast = $("#v7Toast");
  let toastTimer;
  const showToast = msg => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1600);
  };
  $$('[data-placeholder]').forEach(el => el.addEventListener("click", e => { e.preventDefault(); showToast("Esta pieza todavía no tiene URL publicada."); }));

  /* nav tone */
  const dock = $("#v7Dock");
  const toneSections = $$('[data-nav-tone]');
  if ("IntersectionObserver" in window && dock) {
    const toneObserver = new IntersectionObserver(entries => {
      const current = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (current) dock.dataset.tone = current.target.dataset.navTone || "light";
    }, { rootMargin:"-35% 0px -55% 0px", threshold:[0,.05,.2,.5] });
    toneSections.forEach(s => toneObserver.observe(s));
  }

  /* orbit recomposition */
  const orbitSystem = $("#orbitSystem");
  const orbitA = $(".orbit-a");
  const orbitB = $(".orbit-b");
  const orbitC = $(".orbit-c");
  const scenes = {
    hero: [
      {left:"5%", top:"30%", width:"28rem", height:"11rem", rotate:"12deg", opacity:"1"},
      {left:"28%", top:"28%", width:"21rem", height:"8rem", rotate:"-28deg", opacity:"1"},
      {left:"42%", top:"37%", width:"16rem", height:"6rem", rotate:"38deg", opacity:"1"}
    ],
    reader: [
      {left:"2%", top:"54%", width:"25rem", height:"9rem", rotate:"68deg", opacity:"1"},
      {left:"16%", top:"61%", width:"20rem", height:"7rem", rotate:"-8deg", opacity:".82"},
      {left:"42%", top:"56%", width:"14rem", height:"5rem", rotate:"94deg", opacity:".56"}
    ],
    etc: [
      {left:"7%", top:"72%", width:"24rem", height:"8rem", rotate:"25deg", opacity:".82"},
      {left:"45%", top:"75%", width:"17rem", height:"6rem", rotate:"-48deg", opacity:".42"},
      {left:"72%", top:"72%", width:"12rem", height:"4rem", rotate:"35deg", opacity:".28"}
    ],
    about: [
      {left:"6%", top:"82%", width:"22rem", height:"8rem", rotate:"78deg", opacity:".68"},
      {left:"26%", top:"84%", width:"17rem", height:"6rem", rotate:"8deg", opacity:".45"},
      {left:"62%", top:"83%", width:"13rem", height:"4.5rem", rotate:"112deg", opacity:".26"}
    ],
    participate: [
      {left:"4%", top:"91%", width:"18rem", height:"6rem", rotate:"18deg", opacity:".45"},
      {left:"46%", top:"91%", width:"15rem", height:"5rem", rotate:"-38deg", opacity:".3"},
      {left:"78%", top:"92%", width:"10rem", height:"4rem", rotate:"22deg", opacity:".22"}
    ]
  };

  function applyScene(name) {
    if (reduceMotion.matches || !orbitSystem) return;
    const scene = scenes[name];
    if (!scene) return;
    [orbitA, orbitB, orbitC].forEach((el, i) => {
      if (!el) return;
      const s = scene[i];
      Object.assign(el.style, { left:s.left, top:s.top, width:s.width, height:s.height, opacity:s.opacity, transform:`rotate(${s.rotate})` });
    });
  }

  if ("IntersectionObserver" in window) {
    const sceneObserver = new IntersectionObserver(entries => {
      const current = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (current) applyScene(current.target.dataset.orbitScene);
    }, { rootMargin:"-30% 0px -55% 0px", threshold:[0,.05,.25,.5] });
    $$('[data-orbit-scene]').forEach(s => sceneObserver.observe(s));
  }

  /* proposal */
  const topicForm = $("#v7TopicForm");
  const topic = $("#v7Topic");
  topicForm?.addEventListener("submit", e => {
    e.preventDefault();
    const value = topic?.value.trim();
    if (!value) return;
    track("Participar · propuso tema", { longitud:value.length });
    const subject = encodeURIComponent("Tengo un tema para CQST");
    const body = encodeURIComponent(`Hola CQST,\n\nHay un tema que me gustaría proponer:\n\n${value}\n\n`);
    location.href = `mailto:hola@cadaquiensutema.com?subject=${subject}&body=${body}`;
  });

  /* newsletter lab */
  const newsletterForm = $("#v7NewsletterForm");
  const newsletterStatus = $("#v7NewsletterStatus");
  $("#v7Email")?.addEventListener("focus", () => track("Suscripción · enfocó correo", { origen:"V7" }));
  newsletterForm?.addEventListener("submit", e => {
    e.preventDefault();
    const value = $("#v7Email")?.value.trim();
    if (!value) return;
    track("Suscripción · intentó suscribirse", { origen:"V7" });
    if (newsletterStatus) newsletterStatus.textContent = "Lab listo. Falta conectar el proveedor de correo.";
  });
})();
