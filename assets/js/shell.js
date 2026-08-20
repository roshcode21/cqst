/* CQST V3 · shell.js
   Adapta el dock a la superficie visible y trata mobile como interfaz propia. */
(() => {
  "use strict";

  const html = document.documentElement;
  const toneSections = [...document.querySelectorAll("[data-shell-tone]")];
  const mobileDock = document.querySelector(".cqst-mobile-dock");
  let lastY = window.scrollY;
  let ticking = false;

  function currentTone() {
    if (!toneSections.length) return "paper";
    const probe = innerHeight < 760 ? innerHeight - 86 : 48;
    let winner = toneSections[0];
    toneSections.forEach((section) => {
      const r = section.getBoundingClientRect();
      if (r.top <= probe && r.bottom > probe) winner = section;
    });
    return winner.dataset.shellTone || "paper";
  }

  function updateTone() {
    html.dataset.shellTone = currentTone();
  }

  function updateMobileVisibility() {
    if (!mobileDock || innerWidth > 720) return;
    const y = window.scrollY;
    const delta = y - lastY;
    if (Math.abs(delta) > 8) {
      mobileDock.classList.toggle("is-hidden", delta > 0 && y > 180);
      lastY = y;
    }
  }

  function schedule() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateTone();
      updateMobileVisibility();
      ticking = false;
    });
  }

  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule);
  updateTone();

  /* Si aparece el teclado del móvil, quitamos el dock del camino. */
  if (window.visualViewport && mobileDock) {
    const initialHeight = visualViewport.height;
    visualViewport.addEventListener("resize", () => {
      const keyboardLikelyOpen = initialHeight - visualViewport.height > 140;
      mobileDock.classList.toggle("is-hidden", keyboardLikelyOpen);
    });
  }
})();
