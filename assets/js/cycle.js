/* CQST — cycle.js
   Solo comportamiento del índice de ciclo. Sin frameworks. */
(() => {
  "use strict";

  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  const isLab = document.body.dataset.lab === "true";

  /* En lab podemos diseñar destinos que todavía no tienen URL real. */
  document.querySelectorAll("[data-stub]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (isLab) event.preventDefault();
    });
  });

  /* Si una voz ya se completó en este navegador, el ciclo lo recuerda. */
  document.querySelectorAll("[data-completion-key]").forEach((item) => {
    const key = item.dataset.completionKey;
    if (key && localStorage.getItem(key)) item.classList.add("is-complete");
  });
})();