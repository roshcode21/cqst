(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const articleId = document.body.dataset.article || 'article';
  const cycleId = document.body.dataset.cycle || 'cycle';
  const authorId = document.body.dataset.author || 'author';

  const track = (name, data = {}) => {
    const payload = { article: articleId, cycle: cycleId, author: authorId, ...data };
    console.debug('[CQST analytics]', name, payload);
    if (window.umami?.track) window.umami.track(name, payload);
  };

  /* Lab stub links: final visual/interaction state without fake “coming soon” copy. */
  $$('a[data-stub]').forEach(link => {
    link.addEventListener('click', e => e.preventDefault());
  });

  /* Dynamic read time. */
  const copy = $('.article-copy');
  const readTime = $('#readTime');
  if (copy && readTime) {
    const words = (copy.innerText.match(/\S+/g) || []).length;
    const minutes = Math.max(1, Math.ceil(words / 220));
    readTime.textContent = `${minutes} min de lectura`;
    readTime.dataset.words = String(words);
  }

  /* Reading progress: only body copy, not mast, notes or cycle bridge. */
  const startSentinel = $('#readStart');
  const endSentinel = $('#readEnd');
  const finalParagraph = $('.article-closing');
  const progress = $('#headerProgress');
  let started = false;
  let ended = localStorage.getItem(`cqst:voice:${articleId}`) === 'complete';

  function readingBounds() {
    if (!startSentinel || !endSentinel) return null;
    const startDoc = scrollY + startSentinel.getBoundingClientRect().top;
    const endDoc = scrollY + endSentinel.getBoundingClientRect().top;
    const h = innerHeight;
    // The eye usually works below the browser chrome and above the very bottom edge.
    // Start when the first line enters the upper reading zone; finish when the final line enters the lower reading zone.
    return {
      start: startDoc - h * 0.30,
      finish: endDoc - h * 0.76
    };
  }

  function updateProgress() {
    if (!progress) return;
    const b = readingBounds();
    if (!b) return;
    let p = (scrollY - b.start) / Math.max(1, b.finish - b.start);
    p = Math.max(0, Math.min(1, p));
    if (finalParagraph) {
      const r = finalParagraph.getBoundingClientRect();
      if (r.bottom <= innerHeight * 0.88) p = 1;
    }
    progress.style.width = `${p * 100}%`;
    if (!started && p > .01) {
      started = true;
      track('article_start');
    }
    if (!ended && p >= .999) completeVoice('read');
  }

  addEventListener('scroll', updateProgress, { passive: true });
  addEventListener('resize', updateProgress);
  requestAnimationFrame(updateProgress);

  function completeVoice(mode) {
    if (!ended) {
      ended = true;
      localStorage.setItem(`cqst:voice:${articleId}`, 'complete');
      localStorage.setItem(`cqst:voice:${articleId}:mode`, mode);
      track('voice_complete', { mode });
      track('article_end_reached', { mode });
    }
    $$('.current-voice-state').forEach(el => {
      el.classList.add('done');
      el.textContent = 'Rodolfo ✓';
    });
  }

  /* Cycle drawer. */
  const cycleDialog = $('#cycleDialog');
  const cycleToggle = $('#cycleToggle');
  const cycleSign = $('.sign', cycleToggle || document);
  const closeCycle = $('#closeCycle');
  function openCycle() {
    if (!cycleDialog) return;
    cycleDialog.showModal();
    cycleToggle?.setAttribute('aria-expanded', 'true');
    if (cycleSign) cycleSign.textContent = '−';
    track('cycle_panel_open');
  }
  function closeCycleDialog() {
    if (!cycleDialog?.open) return;
    cycleDialog.close();
    cycleToggle?.setAttribute('aria-expanded', 'false');
    if (cycleSign) cycleSign.textContent = '+';
  }
  cycleToggle?.addEventListener('click', openCycle);
  closeCycle?.addEventListener('click', closeCycleDialog);
  cycleDialog?.addEventListener('click', e => { if (e.target === cycleDialog) closeCycleDialog(); });
  $('#chooseVoice')?.addEventListener('click', openCycle);

  /* Notes al margen. */
  const notes = {
    fresh: {
      count: '01',
      title: 'Efecto de nuevo comienzo',
      copy: 'Ciertos hitos temporales pueden separar mentalmente un periodo de otro y, en determinados contextos, aumentar conductas orientadas a metas.',
      cite: 'Dai, Milkman & Riis, 2014',
      url: 'https://doi.org/10.1287/mnsc.2014.1901'
    },
    memory: {
      count: '02',
      title: 'Memoria autobiográfica',
      copy: 'Recordar no equivale a reproducir una grabación intacta. La memoria autobiográfica integra reconstrucción, inferencias, información posterior y el significado que un episodio adquiere con el tiempo.',
      cite: 'Fivush & Grysman, 2023',
      url: 'https://doi.org/10.1002/wcs.1620'
    },
    hindsight: {
      count: '03',
      title: 'Sesgo retrospectivo',
      copy: 'Una vez que conocemos el desenlace, tendemos a percibirlo como más previsible —o incluso más inevitable— de lo que parecía antes de que ocurriera.',
      cite: 'Fischhoff, 1975',
      url: 'https://doi.org/10.1037/0096-1523.1.3.288'
    }
  };

  const margin = $('#marginNote');
  let pinnedNote = null;
  function renderMargin(key) {
    const n = notes[key];
    if (!margin || !n) return;
    $('.margin-note-count', margin).textContent = `Nota ${n.count}`;
    $('h2', margin).textContent = n.title;
    $('p', margin).textContent = n.copy;
    $('cite', margin).innerHTML = `<a href="${n.url}" target="_blank" rel="noopener">${n.cite} <span aria-hidden="true">↗</span></a>`;
    margin.classList.add('is-visible');
  }
  function hideMargin() {
    if (!pinnedNote) margin?.classList.remove('is-visible');
  }

  function renderInline(button, key) {
    const n = notes[key];
    const paragraph = button.closest('p');
    if (!paragraph || !n) return;
    let box = paragraph.nextElementSibling;
    const already = box?.classList.contains('inline-note');
    if (!already) {
      box = document.createElement('aside');
      box.className = 'inline-note';
      paragraph.insertAdjacentElement('afterend', box);
    }
    const willOpen = !box.classList.contains('is-open');
    $$('.inline-note.is-open').forEach(el => { if (el !== box) el.classList.remove('is-open'); });
    $$('.note-ref[aria-expanded="true"]').forEach(el => { if (el !== button) el.setAttribute('aria-expanded', 'false'); });
    if (willOpen) {
      box.innerHTML = `<span class="note-count">Nota ${n.count}</span><h2>${n.title}</h2><p>${n.copy}</p><cite><a class="notes-link" href="${n.url}" target="_blank" rel="noopener">${n.cite} <span aria-hidden="true">↗</span></a></cite>`;
      box.classList.add('is-open');
      button.setAttribute('aria-expanded', 'true');
    } else {
      box.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
    }
  }

  const desktopNotes = () => matchMedia('(min-width:1051px)').matches;
  $$('.note-ref').forEach(button => {
    const key = button.dataset.note;
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('pointerenter', () => { if (desktopNotes() && !pinnedNote) renderMargin(key); });
    button.addEventListener('pointerleave', () => { if (desktopNotes()) hideMargin(); });
    button.addEventListener('focus', () => { if (desktopNotes() && !pinnedNote) renderMargin(key); });
    button.addEventListener('blur', () => { if (desktopNotes()) hideMargin(); });
    button.addEventListener('click', () => {
      track('note_open', { note: key });
      if (desktopNotes()) {
        if (pinnedNote === key) {
          pinnedNote = null;
          margin?.classList.remove('is-visible');
          button.setAttribute('aria-expanded', 'false');
        } else {
          pinnedNote = key;
          $$('.note-ref').forEach(el => el.setAttribute('aria-expanded', String(el === button)));
          renderMargin(key);
        }
      } else {
        renderInline(button, key);
      }
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && pinnedNote) {
      pinnedNote = null;
      margin?.classList.remove('is-visible');
      $$('.note-ref').forEach(el => el.setAttribute('aria-expanded', 'false'));
    }
  });
  $('#notesLedger')?.addEventListener('toggle', e => {
    if (e.currentTarget.open) track('sources_open');
  });

  /* Share: native on capable devices, clipboard fallback. */
  const toast = $('#toast');
  let toastTimer;
  function showToast(text) {
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = text;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1700);
  }
  $('#shareButton')?.addEventListener('click', async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, url: location.href });
        track('article_share', { method: 'native' });
        return;
      } catch (err) {
        if (err?.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(location.href);
      showToast('Enlace copiado');
      track('article_share', { method: 'copy' });
    } catch {
      showToast('Copia el enlace desde tu navegador');
    }
  });

  /* Audio rail + persistent dock. Supply the final MP3 through data-audio-src on #articleAudio. */
  const audio = $('#articleAudio');
  const audioRail = $('#audioRail');
  const audioTrigger = $('#audioTrigger');
  const railPlay = $('#audioPlay');
  const audioDuration = $('#audioDuration');
  const dock = $('#audioDock');
  const dockPlay = $('#dockPlay');
  const dockRange = $('#dockRange');
  const dockCurrent = $('#dockCurrent');
  const dockDuration = $('#dockDuration');
  const speedButton = $('#speedButton');
  const source = audio?.dataset.audioSrc?.trim();
  const speedSteps = [1, 1.25, 1.5, .75];
  let speedIndex = 0;
  const milestones = new Set();

  function fmt(seconds) {
    if (!Number.isFinite(seconds)) return '—';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
  function setPlayUI(playing) {
    const glyph = playing ? 'Ⅱ' : '▶';
    if (railPlay) railPlay.textContent = glyph;
    if (dockPlay) dockPlay.textContent = glyph;
    audioRail?.setAttribute('data-state', playing ? 'playing' : 'paused');
  }
  function revealDock() {
    dock?.classList.add('is-visible');
    document.body.classList.add('has-audio-dock');
  }
  function prepareAudio() {
    if (!audio || !source) return false;
    if (!audio.src) audio.src = source;
    return true;
  }
  async function toggleAudio() {
    if (!prepareAudio()) {
      showToast('Audio sin archivo en este laboratorio');
      track('audio_click_without_source');
      return;
    }
    revealDock();
    if (audio.paused) {
      try { await audio.play(); } catch { showToast('No se pudo iniciar el audio'); }
    } else audio.pause();
  }
  audioTrigger?.addEventListener('click', toggleAudio);
  dockPlay?.addEventListener('click', toggleAudio);

  audio?.addEventListener('loadedmetadata', () => {
    const d = fmt(audio.duration);
    if (audioDuration) audioDuration.textContent = d;
    if (dockDuration) dockDuration.textContent = d;
    if (dockRange) dockRange.max = String(audio.duration || 0);
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: document.querySelector('h1')?.textContent?.trim() || document.title,
          artist: 'Rodolfo Raudales',
          album: 'Cada quien su tema — Empezar'
        });
      } catch {}
    }
  });
  audio?.addEventListener('play', () => { setPlayUI(true); revealDock(); track('audio_start'); });
  audio?.addEventListener('pause', () => setPlayUI(false));
  audio?.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    if (dockRange && document.activeElement !== dockRange) dockRange.value = String(audio.currentTime);
    if (dockCurrent) dockCurrent.textContent = fmt(audio.currentTime);
    const pct = audio.currentTime / audio.duration;
    [[.25,'audio_25'],[.5,'audio_50'],[.75,'audio_75']].forEach(([threshold,event]) => {
      if (pct >= threshold && !milestones.has(event)) { milestones.add(event); track(event); }
    });
  });
  audio?.addEventListener('ended', () => {
    setPlayUI(false);
    track('audio_complete');
    completeVoice('audio');
  });
  dockRange?.addEventListener('input', () => { if (audio) audio.currentTime = Number(dockRange.value); });
  speedButton?.addEventListener('click', () => {
    if (!audio) return;
    speedIndex = (speedIndex + 1) % speedSteps.length;
    audio.playbackRate = speedSteps[speedIndex];
    speedButton.textContent = `${speedSteps[speedIndex]}×`;
    track('audio_speed_change', { speed: speedSteps[speedIndex] });
  });

  if ('mediaSession' in navigator && audio) {
    try {
      navigator.mediaSession.setActionHandler('play', () => audio.play());
      navigator.mediaSession.setActionHandler('pause', () => audio.pause());
      navigator.mediaSession.setActionHandler('seekbackward', details => { audio.currentTime = Math.max(0, audio.currentTime - (details.seekOffset || 10)); });
      navigator.mediaSession.setActionHandler('seekforward', details => { audio.currentTime = Math.min(audio.duration || Infinity, audio.currentTime + (details.seekOffset || 10)); });
    } catch {}
  }

  /* Curated cycle continuation. */
  $('#nextPrimary')?.addEventListener('click', () => track('cycle_continue', { to: 'marivi', mode: 'read' }));
  $('#nextAudio')?.addEventListener('click', () => track('cycle_continue', { to: 'marivi', mode: 'audio' }));
  $('#chooseVoice')?.addEventListener('click', () => track('cycle_choose_voice'));
})();
