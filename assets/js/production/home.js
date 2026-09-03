(() => {
  'use strict';

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const savesData = Boolean(navigator.connection && navigator.connection.saveData);
  const isMobile = () => innerWidth <= 720;
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const lerp = (a, b, t) => a + (b - a) * t;
  const track = (name, data = {}) => {
    try {
      if (window.umami) window.umami.track(name, data);
    } catch (_) {}
  };

  function initPrototypeControls() {
    $$('[aria-disabled="true"][data-prototype="true"]').forEach(button => {
      button.addEventListener('click', event => event.preventDefault());
      button.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') event.preventDefault();
      });
    });
  }

  function initRailMeter() {
    const rail = $('#cycleRail');
    const meter = $('.cycle-rail__meter');
    const thumb = meter?.querySelector('i');
    if (!rail || !meter || !thumb) return;

    const draw = () => {
      if (!isMobile()) {
        meter.hidden = true;
        return;
      }

      meter.hidden = false;
      const maxScroll = Math.max(1, rail.scrollWidth - rail.clientWidth);
      const progress = clamp(rail.scrollLeft / maxScroll);
      const usable = Math.max(0, meter.clientWidth - thumb.getBoundingClientRect().width);
      thumb.style.transform = `translateX(${usable * progress}px)`;
    };

    rail.addEventListener('scroll', () => requestAnimationFrame(draw), { passive: true });
    addEventListener('resize', draw, { passive: true });
    requestAnimationFrame(draw);
  }

  function initPreviewMeter() {
    const preview = $('#readerPreview');
    const meter = $('.reader-preview__scroll');
    const thumb = meter?.querySelector('i');
    if (!preview || !meter || !thumb) return;

    const draw = () => {
      if (isMobile()) {
        meter.hidden = true;
        return;
      }

      meter.hidden = false;
      const ratio = clamp(preview.clientHeight / Math.max(preview.scrollHeight, 1), 0.08, 1);
      const trackHeight = meter.clientHeight;
      const thumbHeight = Math.max(34, trackHeight * ratio);
      const maxScroll = Math.max(1, preview.scrollHeight - preview.clientHeight);
      const progress = clamp(preview.scrollTop / maxScroll);
      const travel = Math.max(0, trackHeight - thumbHeight);

      thumb.style.height = `${thumbHeight}px`;
      thumb.style.transform = `translateY(${travel * progress}px)`;
      meter.classList.toggle('is-idle', ratio > 0.985);
    };

    preview.addEventListener('scroll', () => requestAnimationFrame(draw), { passive: true });
    addEventListener('resize', () => requestAnimationFrame(draw), { passive: true });
    requestAnimationFrame(draw);
  }

  function initKineticLogo() {
    const button = $('#kineticLogo');
    const image = $('#kineticLogoImage');
    if (!button || !image) return;

    const frames = ['Logo.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png']
      .map(name => `/assets/brand/kinetic/${name}`);

    let frame = 0;
    let paused = prefersReducedMotion || savesData;
    let userPaused = false;
    let timer = null;

    if (!savesData) {
      frames.slice(1).forEach(src => {
        const preload = new Image();
        preload.src = src;
      });
    }

    const run = () => {
      clearInterval(timer);
      if (paused) return;
      timer = setInterval(() => {
        frame = (frame + 1) % frames.length;
        image.src = frames[frame];
      }, 280);
    };

    const setPaused = value => {
      paused = value || prefersReducedMotion || savesData;
      button.setAttribute('aria-pressed', String(paused));
      button.setAttribute('aria-label', paused ? 'Reanudar logotipo cinético' : 'Pausar logotipo cinético');
      run();
    };

    if (prefersReducedMotion || savesData) return;

    run();
    button.addEventListener('mouseenter', () => { if (!userPaused) setPaused(true); });
    button.addEventListener('mouseleave', () => { if (!userPaused) setPaused(false); });
    button.addEventListener('focus', () => { if (!userPaused) setPaused(true); });
    button.addEventListener('blur', () => { if (!userPaused) setPaused(false); });
    button.addEventListener('click', () => {
      userPaused = !userPaused;
      setPaused(userPaused);
    });
  }

  function initDock() {
    const dock = $('#siteDock');
    const reader = $('#leer');
    const lastPixel = $('.last-pixel');
    if (!dock) return;

    const links = $$('.site-dock__nav a[href^="#"]', dock);
    const scenes = $$('.scene[data-tone]');
    let bottomState = false;
    let relocateTimer = 0;

    const setMobilePosition = wantBottom => {
      if (!isMobile()) {
        dock.classList.remove('is-mobile-bottom', 'is-relocating');
        bottomState = false;
        return;
      }

      if (wantBottom === bottomState) return;
      clearTimeout(relocateTimer);
      dock.classList.add('is-relocating');
      relocateTimer = setTimeout(() => {
        bottomState = wantBottom;
        dock.classList.toggle('is-mobile-bottom', wantBottom);
        requestAnimationFrame(() => dock.classList.remove('is-relocating'));
      }, 105);
    };

    const update = () => {
      const toneY = innerHeight * (isMobile() ? 0.48 : 0.28);
      let bestScene = null;
      let bestDistance = Infinity;

      for (const scene of scenes) {
        const rect = scene.getBoundingClientRect();
        if (rect.top <= toneY && rect.bottom >= toneY) {
          bestScene = scene;
          break;
        }
        const distance = Math.min(Math.abs(rect.top - toneY), Math.abs(rect.bottom - toneY));
        if (distance < bestDistance) {
          bestScene = scene;
          bestDistance = distance;
        }
      }

      if (bestScene) dock.dataset.tone = bestScene.dataset.tone || 'light';

      links.forEach(link => {
        const target = $(link.getAttribute('href'));
        if (!target) return link.classList.remove('is-current');
        const rect = target.getBoundingClientRect();
        link.classList.toggle('is-current', rect.top < innerHeight * 0.56 && rect.bottom > innerHeight * 0.30);
      });

      if (isMobile() && reader) setMobilePosition(reader.getBoundingClientRect().top <= 86);
      else setMobilePosition(false);

      if (lastPixel && isMobile() && bottomState) {
        const rect = lastPixel.getBoundingClientRect();
        dock.classList.toggle('is-footer-near', rect.top < innerHeight + 54 && rect.bottom > -20);
      } else {
        dock.classList.remove('is-footer-near');
      }
    };

    let ticking = false;
    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    addEventListener('scroll', requestUpdate, { passive: true });
    addEventListener('resize', requestUpdate, { passive: true });
    update();
  }

  function initOrbits() {
    const svg = $('#orbitLayer');
    if (!svg) return;

    const groups = $$('.orbit', svg).map(group => ({
      line: $('.orbit__line', group),
      dot: $('.orbit__dot', group)
    }));

    const desktop = {
      hero: [[31,45,29,.22,8],[34,48,24,.19,-13],[38,51,19,.17,27]],
      reader: [[61,44,29,.23,-7],[64,47,24,.19,15],[57,50,19,.17,-25]],
      etc: [[49,42,26,.22,7],[53,45,22,.19,-15],[46,48,17,.17,25]],
      chev1: [[50,47,24,.20,-5],[53,49,20,.18,17],[47,51,16,.16,-24]],
      about: [[38,36,27,.22,-8],[42,39,22,.19,18],[34,43,18,.16,-26]],
      chev2: [[50,47,24,.20,6],[53,49,20,.18,-16],[47,51,16,.16,24]],
      participate: [[60,43,28,.22,-8],[64,46,23,.19,16],[56,49,18,.16,-25]],
      footer: [[68,31,23,.21,8],[71,34,19,.18,-15],[64,37,15,.16,25]]
    };

    const mobile = {
      hero: [[55,66,47,.20,7],[51,69,39,.18,-14],[59,72,31,.16,27]],
      reader: [[57,62,45,.21,-7],[52,65,37,.18,15],[61,68,30,.16,-25]],
      etc: [[54,40,43,.21,7],[49,43,35,.18,-15],[59,46,28,.16,25]],
      chev1: [[50,50,40,.19,-5],[54,52,33,.17,17],[46,54,26,.15,-24]],
      about: [[55,31,42,.20,-8],[50,34,35,.18,18],[60,37,28,.15,-26]],
      chev2: [[50,50,40,.19,6],[54,52,33,.17,-16],[46,54,26,.15,24]],
      participate: [[56,44,43,.21,-8],[51,47,35,.18,16],[61,50,28,.15,-25]],
      footer: [[58,28,38,.20,8],[53,31,31,.17,-15],[63,34,25,.15,25]]
    };

    const nodes = $$('.scene[data-scene]');
    let sceneA = 'hero';
    let sceneB = 'reader';
    let sceneT = 0;

    const readScene = () => {
      const y = scrollY + innerHeight * 0.48;
      let index = 0;
      for (let i = 0; i < nodes.length; i += 1) {
        if (y >= nodes[i].offsetTop) index = i;
      }

      const a = nodes[index];
      const b = nodes[Math.min(index + 1, nodes.length - 1)];
      sceneA = a?.dataset.scene || 'hero';
      sceneB = b?.dataset.scene || sceneA;
      svg.dataset.tone = a?.dataset.tone || 'light';

      const start = a?.offsetTop || 0;
      const end = b === a ? start + (a?.offsetHeight || innerHeight) : (b?.offsetTop || start + innerHeight);
      sceneT = clamp((y - start) / Math.max(1, end - start));
    };

    const toPixels = values => {
      const radiusX = values[2] * innerWidth / 100;
      return [
        values[0] * innerWidth / 100,
        values[1] * innerHeight / 100,
        radiusX,
        radiusX * values[3],
        values[4]
      ];
    };

    const draw = now => {
      const source = isMobile() ? mobile : desktop;
      const from = source[sceneA] || source.hero;
      const to = source[sceneB] || from;

      groups.forEach((orbit, index) => {
        const a = toPixels(from[index]);
        const b = toPixels(to[index]);
        const values = a.map((value, position) => lerp(value, b[position], sceneT));
        const [cx, cy, rx, ry, rotation] = values;

        orbit.line.setAttribute('cx', cx);
        orbit.line.setAttribute('cy', cy);
        orbit.line.setAttribute('rx', rx);
        orbit.line.setAttribute('ry', ry);
        orbit.line.setAttribute('transform', `rotate(${rotation} ${cx} ${cy})`);

        const speed = [0.00020, 0.00016, 0.00024][index];
        const angle = prefersReducedMotion ? [0.7, 2.5, 4.2][index] : now * speed + [0, 2.1, 4.2][index];
        const x0 = rx * Math.cos(angle);
        const y0 = ry * Math.sin(angle);
        const radians = rotation * Math.PI / 180;

        orbit.dot.setAttribute('cx', cx + x0 * Math.cos(radians) - y0 * Math.sin(radians));
        orbit.dot.setAttribute('cy', cy + x0 * Math.sin(radians) + y0 * Math.cos(radians));
      });

      if (!prefersReducedMotion) requestAnimationFrame(draw);
    };

    readScene();
    requestAnimationFrame(draw);
    addEventListener('scroll', readScene, { passive: true });
    addEventListener('resize', readScene, { passive: true });
  }

  function initChevrons() {
    const strips = $$('.chevron-divider');
    if (!strips.length) return;

    const draw = () => {
      strips.forEach(strip => {
        const rect = strip.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const distance = Math.abs(center - innerHeight / 2);
        const progress = clamp(1 - distance / (innerHeight * 0.72));
        const eased = 0.5 - 0.5 * Math.cos(Math.PI * progress);
        const far = isMobile() ? 78 : 150;
        const near = isMobile() ? 9 : 16;
        const shift = lerp(far, near, eased);
        const scale = 0.96 + eased * 0.055;
        const left = $('.chevron-divider__field--left', strip);
        const right = $('.chevron-divider__field--right', strip);
        const spark = $('.chevron-divider__spark', strip);

        if (left) left.style.transform = `translate3d(${-shift}px,0,0) scaleX(${scale})`;
        if (right) right.style.transform = `translate3d(${shift}px,0,0) scaleX(${scale})`;
        if (spark) {
          spark.style.transform = `rotate(${-12 + eased * 102}deg) scale(${0.91 + eased * 0.15})`;
          spark.style.opacity = String(0.70 + eased * 0.30);
        }
      });
    };

    let ticking = false;
    const requestDraw = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        draw();
        ticking = false;
      });
    };

    addEventListener('scroll', requestDraw, { passive: true });
    addEventListener('resize', requestDraw, { passive: true });
    draw();
  }

  function initHorizontalStatus(track, status, live, label, pager) {
    if (!track || !status) return;

    const items = [...track.children].filter(element => element.matches('.article-card,.about-card'));
    const count = items.length;
    const text = $('span', status);
    const bar = $('i>b', status);
    const buttons = pager ? $$('button', pager) : [];

    const set = index => {
      const current = Math.max(0, Math.min(count - 1, index));
      if (text) text.textContent = `${String(current + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`;
      if (bar) bar.style.transform = `translateX(${current * 100}%)`;
      if (live) live.textContent = `${label} ${current + 1} de ${count}`;
      buttons.forEach((button, buttonIndex) => button.classList.toggle('is-active', buttonIndex === current));
    };

    const update = () => {
      if (!isMobile()) return set(0);
      const center = track.scrollLeft + track.clientWidth / 2;
      let best = 0;
      let distance = Infinity;

      items.forEach((item, index) => {
        const itemCenter = item.offsetLeft + item.offsetWidth / 2;
        const itemDistance = Math.abs(itemCenter - center);
        if (itemDistance < distance) {
          distance = itemDistance;
          best = index;
        }
      });

      set(best);
    };

    let ticking = false;
    track.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    }, { passive: true });

    buttons.forEach((button, index) => {
      button.addEventListener('click', () => {
        items[index]?.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'nearest',
          inline: 'start'
        });
      });
    });

    addEventListener('resize', update, { passive: true });
    update();
  }

  function initCarousels() {
    initHorizontalStatus($('#etcTrack'), $('.track-status--etc'), $('#etcLive'), 'Página');
    initHorizontalStatus($('#aboutTrack'), $('.track-status--about'), $('#aboutLive'), 'Tarjeta', $('.about-pager'));
  }

  async function submitFormspree(form) {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) {
      let message = 'No pudimos enviar el formulario.';
      try {
        const data = await response.json();
        if (Array.isArray(data?.errors) && data.errors[0]?.message) message = data.errors[0].message;
      } catch (_) {}
      throw new Error(message);
    }
  }

  function initNewsletter() {
    const form = $('#newsletterForm');
    const note = $('#newsletterNote');
    if (!form) return;

    const button = $('button[type="submit"]', form);
    const label = button?.textContent || 'Recibir CQST →';

    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      if (note) {
        note.textContent = '';
        note.classList.remove('is-success', 'is-error');
      }
      if (button) {
        button.disabled = true;
        button.textContent = 'Enviando…';
      }

      track('Newsletter · intención', { origen: 'home' });

      try {
        await submitFormspree(form);
        form.reset();
        if (note) {
          note.textContent = 'Listo. Te escribimos cuando haya algo que decir.';
          note.classList.add('is-success');
        }
        track('Newsletter · enviado', { origen: 'home' });
      } catch (_) {
        if (note) {
          note.textContent = 'No pudimos registrar tu correo. Intenta otra vez.';
          note.classList.add('is-error');
        }
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = label;
        }
      }
    });
  }

  function initTopicDialog() {
    const dialog = $('#topicDialog');
    const form = $('#topicForm');
    const close = $('.topic-dialog__close', dialog);
    const note = $('.topic-dialog__note', dialog);
    if (!dialog || !form) return;

    const openers = $$('[data-open-topic]');
    const button = $('button[type="submit"]', form);
    const label = button?.textContent || 'Enviar la idea →';

    const show = () => {
      if (dialog.open) return;
      dialog.showModal();
      track('Proponer · abrió formulario', { origen: 'home' });
      setTimeout(() => $('input[name="name"]', form)?.focus({ preventScroll: true }), 80);
    };

    const hide = event => {
      event?.preventDefault?.();
      event?.stopImmediatePropagation?.();
      if (dialog.open) dialog.close('cancel');
    };

    openers.forEach(opener => opener.addEventListener('click', show));
    close?.addEventListener('pointerup', hide, { passive: false, capture: true });
    close?.addEventListener('click', hide, true);
    dialog.addEventListener('cancel', event => {
      event.preventDefault();
      hide(event);
    });
    dialog.addEventListener('click', event => {
      if (event.target === dialog) hide(event);
    });

    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      if (note) {
        note.textContent = '';
        note.classList.remove('is-success', 'is-error');
      }
      if (button) {
        button.disabled = true;
        button.textContent = 'Enviando…';
      }

      track('Proponer · intención', { origen: 'home' });

      try {
        await submitFormspree(form);
        form.reset();
        if (note) {
          note.textContent = 'Llegó. Gracias por abrir el tema.';
          note.classList.add('is-success');
        }
        if (button) button.textContent = 'Enviado ✓';
        track('Proponer · enviado', { origen: 'home' });

        setTimeout(() => {
          if (dialog.open) dialog.close('success');
          if (button) {
            button.disabled = false;
            button.textContent = label;
          }
        }, 1250);
      } catch (_) {
        if (note) {
          note.textContent = 'No pudimos enviar el tema. Intenta otra vez.';
          note.classList.add('is-error');
        }
        if (button) {
          button.disabled = false;
          button.textContent = label;
        }
      }
    });
  }

  function initAnchorTracking() {
    $$('a[href^="#"]').forEach(link => {
      link.addEventListener('click', () => track('Navegación · home', { destino: link.getAttribute('href') }));
    });
  }

  function init() {
    initPrototypeControls();
    initRailMeter();
    initPreviewMeter();
    initKineticLogo();
    initDock();
    initOrbits();
    initChevrons();
    initCarousels();
    initNewsletter();
    initTopicDialog();
    initAnchorTracking();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
