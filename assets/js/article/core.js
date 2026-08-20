/* ==========================================================================
   CQST — article/core.js
   Estado común del artículo.

   Aquí viven progreso, Umami, compartir y navegación del drawer.
   ========================================================================== */
(() => {
  "use strict";

  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const body = document.body;
  const articleId = body.dataset.article || "article";
  const cycleId = body.dataset.cycle || "cycle";
  const isLab = body.dataset.lab === "true";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const EVENT_LABELS = {
    article_start: "Lectura · empezó",
    voice_complete: "Voz · completada",
    cycle_panel_open: "Ciclo · abrió índice",
    cycle_preview_select: "Ciclo · eligió voz",
    cycle_continue: "Ciclo · continuó",
    cycle_page_open: "Ciclo · abrió índice completo",
    note_open: "Notas · abrió una nota",
    notes_ledger_open: "Notas · abrió fuentes",
    article_share: "Compartir · usó",
    audio_start: "Audio · empezó",
    audio_progress: "Audio · progreso",
    audio_complete: "Audio · terminó",
    audio_speed_change: "Audio · cambió velocidad",
    lab_stub_click: "Lab · enlace de plantilla"
  };

  function track(name, data = {}) {
    const eventName = EVENT_LABELS[name] || name;
    const payload = { articulo: articleId, ciclo: cycleId, ...data };
    console.debug("[CQST]", eventName, payload);
    if (window.umami?.track) window.umami.track(eventName, payload);
  }

  const toast = $("#toast");
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1600);
  }

  function completeVoice(method) {
    const key = `cqst:voice:${cycleId}:${articleId}`;
    if (localStorage.getItem(key)) return;
    const modo = method === "audio" ? "audio" : "lectura";
    localStorage.setItem(key, JSON.stringify({ modo, completedAt: new Date().toISOString() }));
    track("voice_complete", { modo });
  }

  window.CQST = {
    $, $$, body, articleId, cycleId, isLab, reducedMotion,
    track, showToast, completeVoice
  };

  /* CIERRE V1 DE MARCA Y SOCIALES --------------------------------------- */
  const headerWordmark = $(".header-logo img");
  if (headerWordmark) {
    headerWordmark.src = "../../assets/brand/logo-article.svg?v=final3";
    headerWordmark.width = 2048;
    headerWordmark.height = 519;
  }

  $$('.voice-social[href*="threads.com"]').forEach((link) => link.remove());

  const facebookLink = $$(".site-footer-link").find((link) => /facebook/i.test(link.textContent));
  if (facebookLink) {
    facebookLink.href = "https://www.facebook.com/cadaquiensutema";
    facebookLink.target = "_blank";
    facebookLink.rel = "me noopener";
    facebookLink.removeAttribute("data-stub");
  }

  /* Mantener los mismos datos también en JSON-LD renderizado. */
  $$('script[type="application/ld+json"]').forEach((script) => {
    try {
      const data = JSON.parse(script.textContent);
      const graph = Array.isArray(data?.["@graph"]) ? data["@graph"] : [];

      graph.forEach((node) => {
        if (node?.["@type"] === "Person" && Array.isArray(node.sameAs)) {
          node.sameAs = node.sameAs.filter((url) => !/threads\.com/i.test(url));
        }
        if (node?.["@type"] === "Organization") {
          const sameAs = Array.isArray(node.sameAs) ? node.sameAs : [];
          const facebook = "https://www.facebook.com/cadaquiensutema";
          if (!sameAs.includes(facebook)) sameAs.push(facebook);
          node.sameAs = sameAs;
        }
      });

      script.textContent = JSON.stringify(data);
    } catch {}
  });

  /* LAB ------------------------------------------------------------------ */
  $$('[data-stub]').forEach((element) => {
    element.addEventListener("click", (event) => {
      if (!isLab || !element.hasAttribute("data-stub")) return;
      event.preventDefault();
      showToast("Enlace de plantilla");
      track("lab_stub_click", {
        elemento: element.textContent.trim().replace(/\s+/g, " ").slice(0, 80)
      });
    });
  });

  /* TIEMPO DE LECTURA ---------------------------------------------------- */
  const READING_WPM = 220;

  function visibleText(node) {
    if (!node) return "";
    const clone = node.cloneNode(true);
    clone.querySelectorAll("button, .inline-note, .sr-only").forEach((item) => item.remove());
    return clone.textContent.replace(/\s+/g, " ").trim();
  }

  const readingText = [
    visibleText($(".article-deck")),
    visibleText($(".article-copy"))
  ].filter(Boolean).join(" ");

  const words = readingText ? readingText.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(words / READING_WPM));
  if ($("#readTime")) $("#readTime").textContent = `${minutes} min de lectura`;

  /* PROGRESO ------------------------------------------------------------- */
  const progressFill = $("#readingProgressFill");
  const readStart = $("#readStart");
  const readEnd = $("#readEnd");
  const breaths = $$(".article-copy .breath");
  const beats = $$(".progress-beat");
  let started = false;
  let ended = false;
  let currentPct = 0;

  function documentY(element) {
    return window.scrollY + element.getBoundingClientRect().top;
  }

  function bounds() {
    const start = documentY(readStart) - window.innerHeight * .62;
    const end = documentY(readEnd) - window.innerHeight * .72;
    return { start, end: Math.max(start + 1, end) };
  }

  function placeBeats() {
    if (!readStart || !readEnd) return;
    const start = documentY(readStart);
    const end = Math.max(start + 1, documentY(readEnd));

    breaths.slice(0, beats.length).forEach((paragraph, index) => {
      const pct = Math.min(.96, Math.max(.04, (documentY(paragraph) - start) / (end - start)));
      beats[index].style.left = `${pct * 100}%`;
      beats[index].dataset.position = String(pct);
    });
  }

  function updateProgress() {
    if (!readStart || !readEnd || !progressFill) return;

    const range = bounds();
    currentPct = Math.max(0, Math.min(1, (window.scrollY - range.start) / (range.end - range.start)));
    progressFill.style.width = `${currentPct * 100}%`;

    beats.forEach((beat) => {
      beat.classList.toggle("is-passed", currentPct >= Number(beat.dataset.position || 2));
    });

    if (!started && currentPct > .015) {
      started = true;
      track("article_start");
    }

    if (!ended && currentPct >= .995) {
      ended = true;
      completeVoice("read");
    }
  }

  let ticking = false;
  function scheduleProgress() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateProgress();
      ticking = false;
    });
  }

  if (readStart && readEnd) {
    placeBeats();
    updateProgress();
    addEventListener("scroll", scheduleProgress, { passive: true });
    addEventListener("resize", () => {
      placeBeats();
      updateProgress();
    });
  }

  /* DRAWER DEL CICLO -----------------------------------------------------
     El drawer es local al ciclo. No intenta sustituir el menú global del sitio.
     La marca lleva a Inicio y el drawer permite volver al ciclo o compartir. */
  const cycleDialog = $("#cycleDialog");
  const cycleButton = $("#cycleMenuButton");
  const caret = $("#cycleMenuCaret");

  function openCycle() {
    if (!cycleDialog) return;
    cycleDialog.showModal();
    cycleButton?.setAttribute("aria-expanded", "true");
    if (caret) caret.textContent = "⌃";
    track("cycle_panel_open");
  }

  function closeCycle() {
    if (!cycleDialog?.open) return;
    cycleDialog.close();
    cycleButton?.setAttribute("aria-expanded", "false");
    if (caret) caret.textContent = "⌄";
  }

  cycleButton?.addEventListener("click", openCycle);
  $("#closeCycle")?.addEventListener("click", closeCycle);
  cycleDialog?.addEventListener("click", (event) => {
    if (event.target === cycleDialog) closeCycle();
  });

  /* SHARE ---------------------------------------------------------------- */
  async function shareArticle(source = "articulo") {
    const canonical = document.querySelector('link[rel="canonical"]')?.href || window.location.href;
    const data = {
      title: body.dataset.title || document.title,
      text: document.querySelector('meta[name="description"]')?.content || "",
      url: isLab ? window.location.href : canonical
    };

    if (navigator.share) {
      try {
        await navigator.share(data);
        track("article_share", { metodo: "nativo", desde: source });
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(data.url);
      showToast("Enlace copiado");
      track("article_share", { metodo: "copiar", desde: source });
    } catch {
      showToast("Copia el enlace desde tu navegador");
    }
  }

  $("#shareButton")?.addEventListener("click", () => shareArticle("esta_pieza"));
  $("#drawerShare")?.addEventListener("click", async () => {
    closeCycle();
    await shareArticle("menu_ciclo");
  });
})();