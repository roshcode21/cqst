/* CQST — article/cycle-nav.js
   Preview dinámico del ciclo + dos microdestellos durante la lectura.

   Desktop: hover/focus previsualiza; el link puede navegar.
   Touch: tocar una pieza la selecciona; el CTA del preview navega.
*/
(() => {
  "use strict";
  const { $, $$, track, reducedMotion, isLab, showToast }=window.CQST;
  const preview={title:$("#previewTitle"),excerpt:$("#previewExcerpt"),author:$("#previewAuthor"),time:$("#previewTime"),audio:$("#previewAudioMeta"),read:$("#previewReadLink"),listen:$("#previewAudioLink")};
  const finePointer=()=>matchMedia("(hover: hover) and (pointer: fine)").matches;

  function render(entry){
    if(!entry||!preview.title)return;
    const update=()=>{
      preview.title.textContent=entry.dataset.previewTitle||"";
      preview.excerpt.textContent=entry.dataset.previewExcerpt||"";
      preview.author.textContent=entry.dataset.previewAuthor||"";
      preview.time.textContent=entry.dataset.previewTime||"";
      preview.audio.textContent=entry.dataset.previewAudio||"";
      preview.read.href=entry.dataset.previewHref||"#";
      preview.listen.href=entry.dataset.previewAudioHref||"#";
      const stub=entry.dataset.previewStub==="true";
      preview.read.toggleAttribute("data-stub",stub);
      preview.listen.toggleAttribute("data-stub",stub);
    };
    if(document.startViewTransition&&!reducedMotion.matches){document.startViewTransition(update);}else update();
    $$(".cycle-entry").forEach((item)=>item.classList.toggle("recommended",item===entry));
  }

  $$(".cycle-entry[data-preview-title]").forEach((entry)=>{
    entry.addEventListener("mouseenter",()=>{if(finePointer())render(entry);});
    entry.addEventListener("focus",()=>render(entry));
    entry.addEventListener("click",(event)=>{
      /* En touch, la lista es selector; Leer/Escuchar son las acciones. */
      if(!finePointer()){
        event.preventDefault();
        render(entry);
        track("cycle_preview_select",{target:entry.dataset.previewAuthor||"voice"});
      }
    });
  });

  [preview.read,preview.listen].forEach((link)=>{
    link?.addEventListener("click",(event)=>{
      if(isLab&&link.hasAttribute("data-stub")){
        event.preventDefault();
        showToast("Enlace de plantilla");
        return;
      }
      track("cycle_continue",{target:preview.author?.textContent||"next",mode:link===preview.listen?"audio":"read"});
    });
  });

  /* Dos destellos, no un sistema de partículas. */
  const register=$("#registerMark"),breaths=$$(".article-copy .breath");
  if(register&&!reducedMotion.matches&&breaths.length&&"IntersectionObserver" in window){
    let timer;
    const observer=new IntersectionObserver((entries)=>{
      entries.forEach((entry)=>{
        if(!entry.isIntersecting)return;
        register.dataset.tone=entry.target.dataset.registerTone||"purple";
        register.classList.add("flash");
        clearTimeout(timer);
        timer=setTimeout(()=>register.classList.remove("flash"),650);
      });
    },{rootMargin:"-42% 0px -42% 0px",threshold:0});
    breaths.forEach((paragraph,index)=>{
      paragraph.dataset.registerTone=index===0?"orange":"purple";
      observer.observe(paragraph);
    });
  }

  $("#cyclePageLink")?.addEventListener("click",()=>track("cycle_page_open",{source:"article_footer"}));
})();
