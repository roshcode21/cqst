(() => {
  'use strict';

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const clamp01 = value => Math.max(0, Math.min(1, value));
  const article = $('.article-document');
  const copy = $('[data-reading-copy]');
  const progress = $('[data-reading-progress]');
  const progressShell = $('.reading-progress');
  const breathMarks = $$('[data-reading-breath]');
  const breathParagraphs = $$('.article-copy__breath');

  const analyticsContext = {
    articulo: article?.dataset.articleSlug || '',
    ciclo: article?.dataset.cycleSlug || '',
    voz: article?.dataset.voiceSlug || ''
  };
  const sent = new Set();

  function track(name, data = {}, once = false) {
    if (once && sent.has(name)) return;
    if (once) sent.add(name);
    const payload = { ...analyticsContext, ...data };
    if (window.umami?.track) window.umami.track(name, payload);
  }

  function documentY(element) {
    return window.scrollY + element.getBoundingClientRect().top;
  }

  function placeBreaths() {
    if (!copy || !breathMarks.length) return;
    const start = documentY(copy);
    const end = start + Math.max(1, copy.offsetHeight);

    breathMarks.forEach((mark, index) => {
      const paragraph = breathParagraphs[index];
      if (!paragraph) {
        mark.hidden = true;
        return;
      }
      mark.hidden = false;
      const pct = clamp01((documentY(paragraph) - start) / Math.max(1, end - start));
      mark.style.left = `${Math.max(.05, Math.min(.95, pct)) * 100}%`;
      mark.dataset.position = String(pct);
    });
  }

  function initReadingProgress() {
    if (!copy || !progress) return;
    let ticking = false;

    const draw = () => {
      const start = documentY(copy) - window.innerHeight * .36;
      const end = documentY(copy) + copy.offsetHeight - window.innerHeight * .58;
      const pct = clamp01((window.scrollY - start) / Math.max(1, end - start));
      progress.style.transform = `translateY(-50%) scaleX(${pct})`;
      progressShell?.classList.toggle('is-complete', pct >= .995);

      breathMarks.forEach(mark => {
        const point = Number(mark.dataset.position || 2);
        mark.classList.toggle('is-passed', pct >= point);
      });

      if (pct > .015) track('article_start', {}, true);
      if (pct >= .25) track('read_25', {}, true);
      if (pct >= .50) track('read_50', {}, true);
      if (pct >= .75) track('read_75', {}, true);
      if (pct >= .995) track('read_complete', {}, true);
      ticking = false;
    };

    const requestDraw = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(draw);
    };

    placeBreaths();
    draw();
    addEventListener('scroll', requestDraw, { passive: true });
    addEventListener('resize', () => {
      placeBreaths();
      requestDraw();
    }, { passive: true });
  }

  function noteData(id) {
    const source = $(`[data-note-source="${CSS.escape(id)}"]`);
    if (!source) return null;
    return {
      number: $('.article-notes__number', source)?.textContent?.trim() || '',
      title: $('h3', source)?.textContent?.trim() || '',
      text: $('p', source)?.textContent?.trim() || '',
      link: $('a', source)?.href || '',
      source: $('a', source)?.textContent?.replace('↗', '')?.trim() || ''
    };
  }

  function initNotes() {
    const margin = $('[data-margin-note]');
    const dialog = $('[data-note-dialog]');
    const close = $('[data-note-close]');

    function fillMargin(data) {
      if (!margin || !data) return;
      margin.innerHTML = '';
      const label = document.createElement('p');
      label.className = 'matrix';
      label.textContent = `NOTA ${data.number}`;
      const title = document.createElement('strong');
      title.textContent = data.title;
      const text = document.createElement('p');
      text.textContent = data.text;
      const link = document.createElement('a');
      link.href = data.link;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = `${data.source} ↗`;
      margin.append(label, title, text, link);
      margin.classList.add('is-active');
    }

    function fillDialog(data) {
      if (!dialog || !data) return;
      $('[data-note-number]', dialog).textContent = data.number;
      $('[data-note-title]', dialog).textContent = data.title;
      $('[data-note-text]', dialog).textContent = data.text;
      const link = $('[data-note-link]', dialog);
      link.href = data.link;
      link.textContent = `${data.source} ↗`;
    }

    $$('.note-ref').forEach(ref => {
      ref.addEventListener('click', event => {
        const data = noteData(ref.dataset.note);
        if (!data) return;
        track('note_open', { nota: ref.dataset.note || '' });

        if (window.innerWidth > 1120 && margin) {
          event.preventDefault();
          $$('.note-ref').forEach(item => item.removeAttribute('aria-current'));
          ref.setAttribute('aria-current', 'true');
          fillMargin(data);
          return;
        }

        if (dialog?.showModal) {
          event.preventDefault();
          fillDialog(data);
          dialog.showModal();
        }
      });
    });

    close?.addEventListener('click', () => dialog?.close());
    dialog?.addEventListener('click', event => {
      if (event.target === dialog) dialog.close();
    });
  }

  async function share(button) {
    const canonical = $('link[rel="canonical"]')?.href || window.location.href;
    const data = {
      title: document.title,
      text: $('meta[name="description"]')?.content || '',
      url: canonical
    };
    const original = button.innerHTML;

    try {
      if (navigator.share) {
        await navigator.share(data);
        track('share', { metodo: 'native' });
        return;
      }
      await navigator.clipboard.writeText(data.url);
      button.textContent = 'Copiado ✓';
      track('share', { metodo: 'clipboard' });
    } catch (error) {
      if (error?.name === 'AbortError') return;
      button.textContent = 'Copia el enlace ↗';
    } finally {
      setTimeout(() => { button.innerHTML = original; }, 1700);
    }
  }

  function initShare() {
    $$('[data-share]').forEach(button => button.addEventListener('click', () => share(button)));
  }

  function initContinuationTracking() {
    $$('[data-cycle-continue]').forEach(link => {
      link.addEventListener('click', () => track('cycle_continue', { destino: link.getAttribute('href') || '' }));
    });
  }

  function initNewsletter() {
    const form = $('[data-article-newsletter]');
    const note = $('[data-newsletter-note]');
    if (!form) return;

    form.addEventListener('submit', async event => {
      event.preventDefault();
      const button = $('button[type="submit"]', form);
      const original = button?.textContent || 'Recibir →';
      if (button) {
        button.disabled = true;
        button.textContent = 'Enviando…';
      }
      if (note) note.textContent = '';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (!response.ok) throw new Error('newsletter response');
        form.reset();
        if (note) note.textContent = 'Listo. Nos leemos por correo.';
        if (button) button.textContent = 'Recibido ✓';
        track('newsletter_signup', { origen: 'article' });
      } catch (_) {
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

  function initPreviewLinks() {
    $$('a[data-preview-link][href="#"]').forEach(link => link.addEventListener('click', event => event.preventDefault()));
  }

  track('article_view', {}, true);
  initReadingProgress();
  initNotes();
  initShare();
  initContinuationTracking();
  initNewsletter();
  initPreviewLinks();
})();
