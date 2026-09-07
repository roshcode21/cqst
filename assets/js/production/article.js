(() => {
  'use strict';

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const clamp = value => Math.max(0, Math.min(1, value));

  function initReadingProgress() {
    const fill = $('[data-reading-progress]');
    const copy = $('.article-copy');
    if (!fill || !copy) return;

    let ticking = false;
    const draw = () => {
      const rect = copy.getBoundingClientRect();
      const start = scrollY + rect.top - innerHeight * 0.34;
      const end = start + copy.offsetHeight - innerHeight * 0.42;
      const progress = clamp((scrollY - start) / Math.max(1, end - start));
      fill.style.transform = `scaleX(${progress})`;
      ticking = false;
    };

    const requestDraw = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(draw);
    };

    addEventListener('scroll', requestDraw, { passive: true });
    addEventListener('resize', requestDraw, { passive: true });
    draw();
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

    const fillMargin = data => {
      if (!margin || !data) return;
      margin.innerHTML = `<p class="matrix">NOTA ${data.number}</p><strong>${data.title}</strong><p>${data.text}</p><a href="${data.link}" target="_blank" rel="noopener noreferrer">${data.source} ↗</a>`;
    };

    const fillDialog = data => {
      if (!dialog || !data) return;
      $('[data-note-number]', dialog).textContent = data.number;
      $('[data-note-title]', dialog).textContent = data.title;
      $('[data-note-text]', dialog).textContent = data.text;
      const link = $('[data-note-link]', dialog);
      link.href = data.link;
      link.textContent = `${data.source} ↗`;
    };

    $$('.note-ref').forEach(ref => {
      ref.addEventListener('click', event => {
        const data = noteData(ref.dataset.note);
        if (!data) return;

        if (innerWidth > 860 && margin) {
          event.preventDefault();
          fillMargin(data);
          ref.setAttribute('aria-current', 'true');
          $$('.note-ref').filter(item => item !== ref).forEach(item => item.removeAttribute('aria-current'));
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

  function initShare() {
    $$('[data-share]').forEach(button => {
      const original = button.innerHTML;
      button.addEventListener('click', async () => {
        const data = { title: document.title, text: $('meta[name="description"]')?.content || '', url: location.href };
        try {
          if (navigator.share) {
            await navigator.share(data);
          } else {
            await navigator.clipboard.writeText(location.href);
            button.textContent = 'Link copiado ✓';
            setTimeout(() => { button.innerHTML = original; }, 1800);
          }
        } catch (error) {
          if (error?.name !== 'AbortError') {
            button.textContent = 'Copia el link ↗';
            setTimeout(() => { button.innerHTML = original; }, 1800);
          }
        }
      });
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
        if (!response.ok) throw new Error('Formspree response was not OK');
        form.reset();
        if (note) note.textContent = 'Listo. Nos leemos por correo.';
        if (button) button.textContent = 'Recibido ✓';
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
    $$('a[data-preview-link][href="#"]').forEach(link => {
      link.addEventListener('click', event => event.preventDefault());
    });
  }

  initReadingProgress();
  initNotes();
  initShare();
  initNewsletter();
  initPreviewLinks();
})();
