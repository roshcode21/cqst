/* ==========================================================================
   CQST — article/core.js
   Estado, analítica, progreso, compartir y panel del ciclo.
   ========================================================================== */
(() => {
  "use strict";
  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");
  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
  const body=document.body;
  const articleId=body.dataset.article||"article";
  const cycleId=body.dataset.cycle||"cycle";
  const isLab=body.dataset.lab==="true";
  const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)");
  function track(name,data={}){ if(window.umami?.track) window.umami.track(name,{article:articleId,cycle:cycleId,...data}); }
  const toast=$("#toast"); let toastTimer;
  function showToast(message){ if(!toast)return; toast.textContent=message; toast.classList.add("show"); clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove("show"),1600); }
  function completeVoice(method){ const key=`cqst:voice:${cycleId}:${articleId}`; if(localStorage.getItem(key))return; localStorage.setItem(key,JSON.stringify({method,completedAt:new Date().toISOString()})); track("voice_complete",{method}); }
  window.CQST={$, $$, body, articleId, cycleId, isLab, reducedMotion, track, showToast, completeVoice};

  /* LAB: destinos futuros ya tienen diseño, pero nunca copy de “próximamente”. */
  $$('[data-stub]').forEach((element)=>{ element.addEventListener("click",(event)=>{ if(!isLab||!element.hasAttribute("data-stub"))return; event.preventDefault(); showToast("Enlace de plantilla"); track("lab_stub_click",{label:element.textContent.trim().replace(/\s+/g," ").slice(0,80)}); }); });

  /* Tiempo de lectura: deck + cuerpo, sin notas ni controles. */
  const READING_WPM=220;
  function visibleText(node){ if(!node)return""; const clone=node.cloneNode(true); clone.querySelectorAll("button, .inline-note, .sr-only").forEach((item)=>item.remove()); return clone.textContent.replace(/\s+/g," ").trim(); }
  const readingText=[visibleText($(".article-deck")),visibleText($(".article-copy"))].filter(Boolean).join(" ");
  const words=readingText?readingText.split(/\s+/).length:0;
  const minutes=Math.max(1,Math.ceil(words/READING_WPM));
  if($("#readTime")) $("#readTime").textContent=`${minutes} min de lectura`;

  /* Progreso: primera frase/deck → última línea. */
  const progressFill=$("#readingProgressFill"),readStart=$("#readStart"),readEnd=$("#readEnd");
  const breaths=$$(".article-copy .breath"),beats=$$(".progress-beat"); let started=false,ended=false,currentPct=0;
  function documentY(element){ return window.scrollY+element.getBoundingClientRect().top; }
  function bounds(){ const start=documentY(readStart)-window.innerHeight*.62; const end=documentY(readEnd)-window.innerHeight*.72; return{start,end:Math.max(start+1,end)}; }
  function placeBeats(){ if(!readStart||!readEnd)return; const start=documentY(readStart),end=Math.max(start+1,documentY(readEnd)); breaths.slice(0,beats.length).forEach((paragraph,index)=>{ const pct=Math.min(.96,Math.max(.04,(documentY(paragraph)-start)/(end-start))); beats[index].style.left=`${pct*100}%`; beats[index].dataset.position=String(pct); }); }
  function updateProgress(){ if(!readStart||!readEnd||!progressFill)return; const range=bounds(); currentPct=Math.max(0,Math.min(1,(window.scrollY-range.start)/(range.end-range.start))); progressFill.style.width=`${currentPct*100}%`; beats.forEach((beat)=>beat.classList.toggle("is-passed",currentPct>=Number(beat.dataset.position||2))); if(!started&&currentPct>.015){started=true;track("article_start");} if(!ended&&currentPct>=.995){ended=true;track("article_end_reached");completeVoice("read");} }
  let ticking=false;
  function scheduleProgress(){ if(ticking)return; ticking=true; requestAnimationFrame(()=>{updateProgress();ticking=false;}); }
  if(readStart&&readEnd){ placeBeats();updateProgress();addEventListener("scroll",scheduleProgress,{passive:true});addEventListener("resize",()=>{placeBeats();updateProgress();}); }

  /* Drawer de ciclo. */
  const cycleDialog=$("#cycleDialog"),cycleButton=$("#cycleMenuButton"),caret=$("#cycleMenuCaret");
  function openCycle(){ if(!cycleDialog)return; cycleDialog.showModal(); cycleButton?.setAttribute("aria-expanded","true"); if(caret)caret.textContent="⌃"; track("cycle_panel_open"); }
  function closeCycle(){ if(!cycleDialog?.open)return; cycleDialog.close(); cycleButton?.setAttribute("aria-expanded","false"); if(caret)caret.textContent="⌄"; }
  cycleButton?.addEventListener("click",openCycle); $("#closeCycle")?.addEventListener("click",closeCycle); cycleDialog?.addEventListener("click",(event)=>{if(event.target===cycleDialog)closeCycle();});

  /* Share: hoja nativa cuando existe; clipboard de respaldo. */
  $("#shareButton")?.addEventListener("click",async()=>{ const data={title:document.title.replace(" — Cada quien su tema",""),text:document.querySelector('meta[name="description"]')?.content||"",url:window.location.href}; if(navigator.share){ try{await navigator.share(data);track("article_share",{method:"native"});return;}catch(error){if(error?.name==="AbortError")return;} } try{await navigator.clipboard.writeText(window.location.href);showToast("Enlace copiado");track("article_share",{method:"copy"});}catch{showToast("Copia el enlace desde tu navegador");} });
})();