(() => {
  'use strict';

  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const format = value => String(value).padStart(2, '0');

  function initCycleRail() {
    const rail = document.querySelector('.cycle-rail');
    const track = document.querySelector('[data-cycle-rail-track]');
    if (!rail || !track) return;

    const items = [...track.querySelectorAll('[data-cycle-rail-item]')];
    const current = document.querySelector('[data-cycle-rail-current]');
    const meter = document.querySelector('[data-cycle-rail-meter]');
    const previous = document.querySelector('[data-cycle-rail-prev]');
    const next = document.querySelector('[data-cycle-rail-next]');
    if (!items.length) return;

    const nearestIndex = () => {
      const center = track.scrollLeft + track.clientWidth * 0.45;
      let index = 0;
      let distance = Infinity;
      items.forEach((item, itemIndex) => {
        const itemCenter = item.offsetLeft + item.offsetWidth / 2;
        const itemDistance = Math.abs(itemCenter - center);
        if (itemDistance < distance) {
          distance = itemDistance;
          index = itemIndex;
        }
      });
      return index;
    };

    const update = () => {
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      const hasOverflow = maxScroll > 4;
      rail.classList.toggle('has-overflow', hasOverflow);

      const index = nearestIndex();
      if (current) current.textContent = format(index + 1);

      if (meter) {
        const progress = hasOverflow ? clamp(track.scrollLeft / Math.max(1, maxScroll)) : 1;
        const minimum = 1 / items.length;
        meter.style.setProperty('--cycle-rail-progress', String(Math.max(minimum, progress)));
      }

      if (previous) previous.disabled = !hasOverflow || track.scrollLeft <= 4;
      if (next) next.disabled = !hasOverflow || track.scrollLeft >= maxScroll - 4;
    };

    const move = direction => {
      const index = nearestIndex();
      const targetIndex = clamp(index + direction, 0, items.length - 1);
      items[targetIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    };

    let frame = 0;
    const requestUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    previous?.addEventListener('click', () => move(-1));
    next?.addEventListener('click', () => move(1));
    track.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    requestAnimationFrame(update);
  }

  function initPreviewLinks() {
    document.querySelectorAll('[data-preview-link="true"]').forEach(link => {
      link.addEventListener('click', event => event.preventDefault());
    });
  }

  function initNewsletter() {
    const form = document.querySelector('[data-cycle-newsletter]');
    const note = document.querySelector('[data-cycle-newsletter-note]');
    if (!form) return;

    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const button = form.querySelector('button[type="submit"]');
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
        if (!response.ok) throw new Error('Formspree rejected the request');

        form.reset();
        if (note) note.textContent = 'Listo. El próximo tema ya sabe dónde encontrarte.';
        if (button) button.textContent = 'Recibido ✓';
      } catch (_) {
        if (note) note.textContent = 'No salió. Intenta otra vez en un momento.';
        if (button) {
          button.disabled = false;
          button.textContent = original;
        }
        return;
      }

      window.setTimeout(() => {
        if (button) {
          button.disabled = false;
          button.textContent = original;
        }
      }, 2400);
    });
  }

  initCycleRail();
  initPreviewLinks();
  initNewsletter();
})();
