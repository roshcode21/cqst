(()=>{
'use strict';
const $=(s,c=document)=>c.querySelector(s);const $$=(s,c=document)=>[...c.querySelectorAll(s)];

function hydrateBackgrounds(){
  $$('.lazy-bg[data-bg]').forEach(section=>{
    const src=section.dataset.bg;if(!src)return;
    section.style.setProperty('--scene-bg',`url("${src}")`);
    section.style.backgroundImage=`url("${src}")`;
    section.classList.add('is-bg-ready');
  });
}

function fixDialog(){
  const dialog=$('#topicDialog');const close=$('.v11-dialog-close',dialog);const open=$('#openTopicDialog');const footerOpen=$('#footerPropose');
  if(!dialog)return;
  const show=()=>{if(!dialog.open)dialog.showModal();};
  const hide=()=>{if(dialog.open)dialog.close('cancel');};
  close?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();hide();});
  open?.addEventListener('click',show);footerOpen?.addEventListener('click',show);
  dialog.addEventListener('click',e=>{if(e.target===dialog)hide();});
  dialog.addEventListener('cancel',()=>{});
}

function placeholderLinks(){
  $$('.placeholder-link').forEach(a=>a.addEventListener('click',e=>e.preventDefault()));
}

function animateChevrons(){
  const strips=$$('.v11-chevron-strip');if(!strips.length)return;
  let ticking=false;
  const draw=()=>{
    const vh=innerHeight;const center=vh/2;
    strips.forEach(strip=>{
      const r=strip.getBoundingClientRect();const c=r.top+r.height/2;
      const proximity=Math.max(0,1-Math.abs(c-center)/(vh*.78));
      const eased=1-Math.pow(1-proximity,3);
      const left=$('.v11-chev-left',strip),right=$('.v11-chev-right',strip),core=$('.v11-chev-core',strip);
      const spread=110-(eased*142); // lejos: abiertos; centro: se encuentran y cruzan ligeramente
      if(left)left.style.transform=`translateX(${-spread}px)`;
      if(right)right.style.transform=`translateX(${spread}px)`;
      if(core){core.style.transform=`rotate(${eased*135}deg) scale(${.82+eased*.36})`;core.style.opacity=String(.45+eased*.55);}
      strip.style.setProperty('--chev-energy',eased.toFixed(3));
    });
    ticking=false;
  };
  const request=()=>{if(!ticking){requestAnimationFrame(draw);ticking=true;}};
  addEventListener('scroll',request,{passive:true});addEventListener('resize',request,{passive:true});request();
}

function enhanceDynamicRows(){
  const decorate=()=>{
    $$('.v11-story').forEach(row=>{row.setAttribute('tabindex','0');row.classList.add('v12-link-row');});
    $$('.v11-reader-preview li').forEach(row=>{row.setAttribute('tabindex','0');row.classList.add('v12-link-row');});
  };
  decorate();
  const observer=new MutationObserver(decorate);
  ['#heroStories','#readerPreview'].forEach(sel=>{const el=$(sel);if(el)observer.observe(el,{childList:true,subtree:true});});
}

function sectionIconTone(){
  // El blend se decide por escena; no se fuerza un color de archivo.
  $$('.v11-section-head>img').forEach(img=>img.setAttribute('decoding','async'));
}

function init(){hydrateBackgrounds();fixDialog();placeholderLinks();animateChevrons();enhanceDynamicRows();sectionIconTone();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();