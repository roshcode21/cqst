(() => {
  'use strict';

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const clamp = value => Math.max(0, Math.min(1, value));
  const article = $('.article-document');
  const metadata = {
    articulo: article?.dataset.articleSlug || '',
    ciclo: article?.dataset.cycleSlug || '',
    voz: article?.dataset.voiceSlug || ''
  };

  function track(name, detail = {}) {
    const payload = { ...metadata, ...detail };
    if (window.umami?.track) window.umami.track(name, payload);
  }

  const toast = $('[data-article-toast]');
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 1800);
  }

  /* Header belongs to the artwork at the top, then becomes reading chrome. */
  function initHeader() {
    const bar = $('[data-reading-bar]');
    if (!bar) return;
    let ticking = false;
    const draw = () => {
      bar.classList.toggle('is-scrolled', scrollY > 42);
      ticking = false;
    };
    const requestDraw = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(draw);
    };
    addEventListener('scroll', requestDraw, { passive: true });
    draw();
  }

  /* Reading progress uses the two editorial breath paragraphs as landmarks. */
  function initReadingProgress() {
    const copy = $('[data-reading-copy]');
    const fill = $('[data-reading-progress]');
    const wrap = $('[data-reading-progress-wrap]');
    const markers = $$('[data-reading-breath]');
    const breaths = $$('.article-copy__breath', copy || document);
    if (!copy || !fill || !wrap) return;

    const reached = new Set();
    let started = false;
    let ticking = false;

    const documentY = node => scrollY + node.getBoundingClientRect().top;

    function placeMarkers() {
      const start = documentY(copy);
      const end = Math.max(start + 1, start + copy.offsetHeight);
      markers.forEach((marker, index) => {
        const paragraph = breaths[index];
        const fallback = index === 0 ? .36 : .7;
        const ratio = paragraph ? (documentY(paragraph) - start) / (end - start) : fallback;
        const safeRatio = Math.max(.08, Math.min(.92, ratio));
        marker.style.left = `${safeRatio * 100}%`;
        marker.dataset.position = String(safeRatio);
      });
    }

    function draw() {
      const rect = copy.getBoundingClientRect();
      const start = scrollY + rect.top - innerHeight * .34;
      const end = start + copy.offsetHeight - innerHeight * .42;
      const progress = clamp((scrollY - start) / Math.max(1, end - start));
      fill.style.transform = `translateY(-50%) scaleX(${progress})`;
      wrap.classList.toggle('is-complete', progress >= .995);

      markers.forEach(marker => {
        marker.classList.toggle('is-passed', progress >= Number(marker.dataset.position || 2));
      });

      if (!started && progress > .015) {
        started = true;
        track('article_start');
      }

      [25, 50, 75, 100].forEach(percent => {
        if (progress >= percent / 100 && !reached.has(percent)) {
          reached.add(percent);
          track(percent === 100 ? 'read_complete' : `read_${percent}`);
        }
      });
      ticking = false;
    }

    const requestDraw = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(draw);
    };

    placeMarkers();
    draw();
    addEventListener('scroll', requestDraw, { passive: true });
    addEventListener('resize', () => {
      placeMarkers();
      requestDraw();
    }, { passive: true });
  }

  /* Notes: hover previews on desktop, click pins. On narrow screens they open inline. */
  function initNotes() {
    const margin = $('[data-margin-note]');
    const readingInner = $('.article-reading__inner');
    const ledger = $('[data-notes-ledger]');
    const refs = $$('.note-ref');
    let pinned = null;

    const wide = () => matchMedia('(min-width:1181px)').matches;

    function noteData(id) {
      const source = $(`[data-note-source="${CSS.escape(id)}"]`);
      if (!source) return null;
      return {
        number: $('.article-notes__number', source)?.textContent?.trim() || '',
        title: $('h3', source)?.textContent?.trim() || '',
        text: $('p', source)?.textContent?.trim() || '',
        href: $('a', source)?.href || '',
        source: $('a', source)?.textContent?.replace('↗', '')?.trim() || ''
      };
    }

    function positionMargin(ref) {
      if (!margin || !readingInner || !ref) return;
      const innerTop = readingInner.getBoundingClientRect().top;
      const refTop = ref.getBoundingClientRect().top;
      const top = Math.max(0, refTop - innerTop - 10);
      margin.style.top = `${top}px`;
    }

    function renderMargin(ref, id) {
      const data = noteData(id);
      if (!margin || !data) return;
      $('[data-margin-number]', margin).textContent = `NOTA ${data.number}`;
      $('[data-margin-title]', margin).textContent = data.title;
      $('[data-margin-text]', margin).textContent = data.text;
      const link = $('[data-margin-link]', margin);
      link.href = data.href;
      link.textContent = `${data.source} ↗`;
      positionMargin(ref);
      margin.classList.add('is-visible');
      margin.setAttribute('aria-hidden', 'false');
    }

    function hideMargin() {
      margin?.classList.remove('is-visible');
      margin?.setAttribute('aria-hidden', 'true');
    }

    function removeInline() {
      $$('.inline-note').forEach(node => node.remove());
      refs.forEach(ref => ref.setAttribute('aria-expanded', 'false'));
    }

    function openInline(ref, id) {
      const data = noteData(id);
      const paragraph = ref.closest('p');
      if (!data || !paragraph) return;
      const panel = document.createElement('aside');
      panel.className = 'inline-note';
      panel.innerHTML = `<p class="matrix">NOTA ${data.number}</p><h2>${data.title}</h2><p>${data.text}</p><a href="${data.href}" target="_blank" rel="noopener noreferrer">${data.source} ↗</a>`;
      paragraph.insertAdjacentElement('afterend', panel);
      ref.setAttribute('aria-expanded', 'true');
    }

    refs.forEach(ref => {
      const id = ref.dataset.note;
      ref.setAttribute('aria-expanded', 'false');

      ref.addEventListener('mouseenter', () => {
        if (wide() && !pinned) renderMargin(ref, id);
      });
      ref.addEventListener('mouseleave', () => {
        if (wide() && !pinned) hideMargin();
      });
      ref.addEventListener('focus', () => {
        if (wide() && !pinned) renderMargin(ref, id);
      });
      ref.addEventListener('blur', () => {
        if (wide() && !pinned) hideMargin();
      });
      ref.addEventListener('click', event => {
        event.preventDefault();
        const data = noteData(id);
        track('note_open', { nota: data?.title || id });

        if (!wide()) {
          const wasOpen = ref.getAttribute('aria-expanded') === 'true';
          removeInline();
          if (!wasOpen) openInline(ref, id);
          return;
        }

        if (pinned === id) {
          pinned = null;
          ref.setAttribute('aria-expanded', 'false');
          hideMargin();
          return;
        }

        pinned = id;
        refs.forEach(item => item.setAttribute('aria-expanded', String(item === ref)));
        renderMargin(ref, id);
      });
    });

    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      pinned = null;
      hideMargin();
      removeInline();
    });

    ledger?.addEventListener('toggle', () => {
      if (ledger.open) track('notes_ledger_open');
    });
  }

  async function shareArticle(source = 'article') {
    const canonical = $('link[rel="canonical"]')?.href || location.href;
    const data = {
      title: document.title,
      text: $('meta[name="description"]')?.content || '',
      url: location.hostname.includes('raw.githack.com') ? location.href : canonical
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
        track('share', { metodo:'native', origen:source });
      } else {
        await navigator.clipboard.writeText(data.url);
        showToast('Enlace copiado');
        track('share', { metodo:'clipboard', origen:source });
      }
    } catch (error) {
      if (error?.name !== 'AbortError') showToast('Copia el enlace desde tu navegador');
    }
  }

  function initShare() {
    $$('[data-share]').forEach(button => button.addEventListener('click', () => shareArticle(button.closest('.article-cycle-drawer') ? 'drawer' : 'article')));
  }

  function initCycleDrawer() {
    const dialog = $('#articleCycleDrawer');
    const open = $('[data-cycle-menu]');
    const close = $('[data-cycle-close]');
    if (!dialog || !open) return;

    const closeDrawer = () => {
      if (!dialog.open) return;
      dialog.close();
      open.setAttribute('aria-expanded', 'false');
    };

    open.addEventListener('click', () => {
      dialog.showModal();
      open.setAttribute('aria-expanded', 'true');
      track('cycle_menu_open');
    });
    close?.addEventListener('click', closeDrawer);
    dialog.addEventListener('click', event => {
      if (event.target === dialog) closeDrawer();
    });
    dialog.addEventListener('close', () => open.setAttribute('aria-expanded', 'false'));
  }

  function initCycleBrowser() {
    const panel = $('[data-cycle-preview-panel]');
    const title = $('[data-cycle-preview-title]');
    const excerpt = $('[data-cycle-preview-excerpt]');
    const author = $('[data-cycle-preview-author]');
    const time = $('[data-cycle-preview-time]');
    const read = $('[data-cycle-preview-read]');
    const entries = $$('[data-cycle-preview]');
    if (!panel || !title || !read) return;

    function render(entry) {
      title.textContent = entry.dataset.previewTitle || '';
      excerpt.textContent = entry.dataset.previewExcerpt || 'Otra entrada al mismo tema, desde otra vida.';
      author.textContent = entry.dataset.previewAuthor || '';
      time.textContent = entry.dataset.previewTime || '';
      read.href = entry.dataset.previewHref || '#';
      read.toggleAttribute('data-preview-link', entry.dataset.previewOnly === 'true');
    }

    entries.forEach(entry => {
      entry.addEventListener('mouseenter', () => render(entry));
      entry.addEventListener('focus', () => render(entry));
      entry.addEventListener('click', event => {
        if (entry.dataset.previewOnly === 'true' || entry.classList.contains('is-current')) {
          event.preventDefault();
          render(entry);
        }
      });
    });

    read.addEventListener('click', event => {
      if (read.hasAttribute('data-preview-link') || read.getAttribute('href') === '#') {
        event.preventDefault();
        showToast('Enlace de maqueta');
        return;
      }
      track('cycle_continue');
    });

    $('.article-cycle-index__all')?.addEventListener('click', () => track('cycle_continue', { destino:'cycle' }));
  }

  function initPreviewLinks() {
    $$('[data-preview-link]').forEach(link => {
      if (link.hasAttribute('data-cycle-preview')) return;
      link.addEventListener('click', event => {
        if (link.getAttribute('href') === '#') {
          event.preventDefault();
          showToast('Enlace de maqueta');
        }
      });
    });
  }

  function initAudio() {
    const module = $('[data-audio-module]');
    const audio = $('[data-article-audio]');
    const toggle = $('[data-audio-toggle]');
    const icon = $('[data-audio-icon]');
    const duration = $('[data-audio-duration]');
    const meter = $('[data-audio-meter]');
    const dock = $('[data-audio-dock]');
    const dockToggle = $('[data-audio-dock-toggle]');
    const current = $('[data-audio-current]');
    const total = $('[data-audio-total]');
    const range = $('[data-audio-range]');
    const speed = $('[data-audio-speed]');
    if (!module || !audio || !toggle) return;

    const source = module.dataset.audioSrc || audio.getAttribute('src') || '';
    const speeds = [1,1.25,1.5,1.75,2];
    let speedIndex = 0;
    let ready = false;
    let started = false;

    const fmt = seconds => {
      if (!Number.isFinite(seconds) || seconds < 0) return '—:—';
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60).toString().padStart(2,'0');
      return `${minutes}:${secs}`;
    };

    function setState(playing) {
      const glyph = playing ? 'Ⅱ' : '▶';
      icon.textContent = glyph;
      if (dockToggle) dockToggle.textContent = glyph;
      module.classList.toggle('is-playing', playing);
      if (ready && dock) dock.classList.toggle('is-open', playing || audio.currentTime > 0);
    }

    async function playToggle() {
      if (!source || !ready) {
        showToast('El reproductor está listo para la grabación');
        return;
      }
      if (audio.paused) {
        try { await audio.play(); } catch { showToast('No se pudo iniciar el audio'); }
      } else {
        audio.pause();
      }
    }

    toggle.addEventListener('click', playToggle);
    dockToggle?.addEventListener('click', playToggle);

    if (!source) return;

    audio.addEventListener('loadedmetadata', () => {
      ready = true;
      duration.textContent = fmt(audio.duration);
      if (total) total.textContent = fmt(audio.duration);
      if (range) range.max = String(audio.duration || 0);
    });
    audio.addEventListener('play', () => {
      setState(true);
      if (!started) { started = true; track('audio_start'); }
    });
    audio.addEventListener('pause', () => setState(false));
    audio.addEventListener('ended', () => {
      setState(false);
      track('audio_complete');
    });
    audio.addEventListener('timeupdate', () => {
      const now = audio.currentTime || 0;
      const length = audio.duration || 0;
      if (current) current.textContent = fmt(now);
      if (range && document.activeElement !== range) range.value = String(now);
      if (meter && length) meter.style.transform = `scaleX(${Math.max(.16, now / length)})`;
    });
    range?.addEventListener('input', () => { if (ready) audio.currentTime = Number(range.value); });
    speed?.addEventListener('click', () => {
      if (!ready) return;
      speedIndex = (speedIndex + 1) % speeds.length;
      audio.playbackRate = speeds[speedIndex];
      speed.textContent = `${speeds[speedIndex]}×`;
      track('audio_speed', { velocidad:speeds[speedIndex] });
    });
    if (audio.readyState >= 1) {
      ready = true;
      duration.textContent = fmt(audio.duration);
    }
  }

  function initNewsletter() {
    const form = $('[data-article-newsletter]');
    const note = $('[data-newsletter-note]');
    if (!form) return;
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const button = $('button[type="submit"]', form);
      const original = button?.textContent || 'Recibir →';
      if (button) { button.disabled = true; button.textContent = 'Enviando…'; }
      if (note) note.textContent = '';
      try {
        const response = await fetch(form.action, { method:'POST', body:new FormData(form), headers:{Accept:'application/json'} });
        if (!response.ok) throw new Error('form');
        form.reset();
        if (note) note.textContent = 'Listo. Nos leemos por correo.';
        if (button) button.textContent = 'Recibido ✓';
        track('newsletter_signup');
      } catch {
        if (note) note.textContent = 'No se pudo enviar. Inténtalo otra vez.';
        if (button) button.textContent = original;
      } finally {
        if (button) {
          button.disabled = false;
          if (button.textContent === 'Recibido ✓') setTimeout(() => { button.textContent = original; }, 2200);
        }
      }
    });
  }

  track('article_view');
  initHeader();
  initReadingProgress();
  initNotes();
  initShare();
  initCycleDrawer();
  initCycleBrowser();
  initPreviewLinks();
  initAudio();
  initNewsletter();
})();
