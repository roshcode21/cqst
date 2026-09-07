(() => {
  const track = document.querySelector('[data-cycle-index-track]');
  if (!track) return;

  const items = [...track.querySelectorAll('[data-cycle-index-item]')];
  const current = document.querySelector('[data-cycle-index-current]');
  const meter = document.querySelector('[data-cycle-index-meter]');
  if (!items.length) return;

  const format = value => String(value).padStart(2, '0');

  const update = () => {
    const maxScroll = Math.max(1, track.scrollWidth - track.clientWidth);
    const progress = Math.min(1, Math.max(0, track.scrollLeft / maxScroll));
    if (meter) meter.style.setProperty('--cycle-index-progress', String(Math.max(1 / items.length, progress)));

    const center = track.scrollLeft + track.clientWidth * 0.45;
    let nearestIndex = 0;
    let nearestDistance = Infinity;

    items.forEach((item, index) => {
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const distance = Math.abs(itemCenter - center);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    if (current) current.textContent = format(nearestIndex + 1);
  };

  let frame = 0;
  const requestUpdate = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(update);
  };

  track.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  update();
})();
