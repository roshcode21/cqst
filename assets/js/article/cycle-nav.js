/* CQST — article/cycle-nav.js
   Preview dinámico del ciclo + dos microdestellos durante la lectura. */
(() => {
  "use strict";

  const { $, $$, track, reducedMotion, isLab, showToast } = window.CQST;

  const preview = {
    panel: $(".cycle-preview"),
    title: $("#previewTitle"),
    excerpt: $("#previewExcerpt"),
    author: $("#previewAuthor"),
    time: $("#previewTime"),
    audio: $("#previewAudioMeta"),
    read: $("#previewReadLink"),
    listen: $("#previewAudioLink")
  };

  let activeEntry = $(".cycle-entry.recommended");
  let transitionRunning = false;

  function applyEntry(entry) {
    const title = entry.dataset.previewTitle || "";
    const excerpt = entry.dataset.previewExcerpt || "";
    const placeholder = entry.dataset.previewPlaceholder === "true";

    preview.title.textContent = title;
    preview.excerpt.textContent = excerpt;
    preview.author.textContent = entry.dataset.previewAuthor || "";
    preview.time.textContent = entry.dataset.previewTime || "";
    preview.audio.textContent = entry.dataset.previewAudio || "";
    preview.read.href = entry.dataset.previewHref || "#";
    preview.listen.href = entry.dataset.previewAudioHref || "#";

    preview.panel?.classList.toggle("is-placeholder", placeholder);
    preview.title.classList.toggle("is-placeholder", placeholder);
    preview.excerpt.classList.toggle("is-empty", !excerpt);

    const stub = entry.dataset.previewStub === "true";
    preview.read.toggleAttribute("data-stub", stub);
    preview.listen.toggleAttribute("data-stub", stub);

    $$(".cycle-entry").forEach((item) => {
      item.classList.toggle("recommended", item === entry);
    });

    activeEntry = entry;
  }

  function render(entry, { animate = false } = {}) {
    if (!entry || !preview.title || entry === activeEntry || transitionRunning) return;

    if (animate && document.startViewTransition && !reducedMotion.matches) {
      transitionRunning = true;
      const transition = document.startViewTransition(() => applyEntry(entry));
      transition.finished.finally(() => { transitionRunning = false; });
      return;
    }

    applyEntry(entry);
  }

  $$(".cycle-entry[data-preview-title]").forEach((entry) => {
    entry.addEventListener("mouseenter", () => {
      if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
        render(entry, { animate: false });
      }
    });

    entry.addEventListener("focus", () => render(entry, { animate: false }));

    /* En touch, el primer tap selecciona el preview. Los CTA del panel navegan. */
    entry.addEventListener("click", (event) => {
      if (!matchMedia("(hover: none)").matches) return;
      if (entry.classList.contains("current") && !entry.hasAttribute("data-stub")) return;
      event.preventDefault();
      render(entry, { animate: true });
      track("cycle_preview_select", { voz: entry.dataset.previewAuthor || "voz" });
    });
  });

  [preview.read, preview.listen].forEach((link) => {
    link?.addEventListener("click", (event) => {
      if (isLab && link.hasAttribute("data-stub")) {
        event.preventDefault();
        showToast("Enlace de plantilla");
        return;
      }

      track("cycle_continue", {
        voz: preview.author?.textContent || "siguiente",
        modo: link === preview.listen ? "audio" : "lectura"
      });
    });
  });

  /* Dos destellos, no un sistema de partículas. */
  const register = $("#registerMark");
  const breaths = $$(".article-copy .breath");

  if (register && !reducedMotion.matches && breaths.length && "IntersectionObserver" in window) {
    let timer;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        register.dataset.tone = entry.target.dataset.registerTone || "purple";
        register.classList.add("flash");
        clearTimeout(timer);
        timer = setTimeout(() => register.classList.remove("flash"), 650);
      });
    }, {
      rootMargin: "-42% 0px -42% 0px",
      threshold: 0
    });

    breaths.forEach((paragraph, index) => {
      paragraph.dataset.registerTone = index === 0 ? "orange" : "purple";
      observer.observe(paragraph);
    });
  }

  $("#cyclePageLink")?.addEventListener("click", () => {
    track("cycle_page_open", { desde: "final_del_articulo" });
  });
})();