(()=>{
'use strict';
const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const saveData=!!(navigator.connection&&navigator.connection.saveData);
const isMobile=()=>innerWidth<=720;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const track=(name,data={})=>{try{window.umami&&window.umami.track(name,data)}catch(_){}};

const placeholderStories=count=>Array.from({length:count},()=>({title:'[título aquí]',author:'Voz por confirmar',time:'',placeholder:true}));
const cycleData={
  empezar:{title:'Empezar',count:3,deck:'El principio cambia según quién lo cuenta.',href:'../empezar/',stories:[
    {title:'La fecha la ponemos después',author:'Rodolfo Raudales',time:'3 min',href:'../empezar/la-fecha-la-ponemos-despues/',read:true},
    {title:'No fue ese día',author:'Mariví Cerisola',time:'4 min'},
    {title:'[tu título aquí]',author:'Mel Castán',time:'',placeholder:true}
  ]},
  dinero:{title:'Dinero',count:4,deck:'Cuatro voces alrededor del mismo tema.',stories:placeholderStories(4)},
  casa:{title:'Casa',count:4,deck:'Un ciclo preparado para crecer dentro del índice.',stories:placeholderStories(4)},
  cuerpo:{title:'Cuerpo',count:3,deck:'Tres entradas distintas al mismo tema.',stories:placeholderStories(3)},
  tiempo:{title:'Tiempo',count:4,deck:'Cuatro voces, cuatro maneras de llegar.',stories:placeholderStories(4)},
  deseo:{title:'Deseo',count:3,deck:'Tres piezas dentro del mismo ciclo.',stories:placeholderStories(3)},
  duelo:{title:'Duelo',count:4,deck:'Cuatro voces dentro del mismo ciclo.',stories:placeholderStories(4)},
  fe:{title:'Fe',count:3,deck:'Tres voces dentro del mismo ciclo.',stories:placeholderStories(3)}
};
const order=Object.keys(cycleData);
const meta=s=>[s.author,s.time].filter(Boolean).join(' · ');

function renderCurrentCycle(){
  const c=cycleData.empezar;
  const title=$('#heroTitle'),deck=$('#heroDeck'),stories=$('#heroStories'),open=$('#heroOpen');
  if(title)title.textContent=c.title;
  if(deck)deck.textContent=c.deck;
  if(open)open.href=c.href;
  if(stories)stories.innerHTML=c.stories.map(s=>`${s.href?`<a class="v11-story${s.read?' is-read':''}${s.placeholder?' placeholder':''}" href="${s.href}">`:`<div class="v11-story${s.read?' is-read':''}${s.placeholder?' placeholder':''}">`}<i></i><span><strong>${s.title}</strong><small>${meta(s)}</small></span><b>↗</b>${s.href?'</a>':'</div>'}`).join('');
}

function initReader(){
  const rail=$('#readerRail'),preview=$('#readerPreview');
  if(!rail||!preview)return;
  rail.innerHTML='';
  order.forEach((key,i)=>{
    const c=cycleData[key],b=document.createElement('button');
    b.type='button';b.dataset.cycle=key;b.className=i===0?'active':'';
    b.innerHTML=`<strong>${c.title}</strong><small>${c.count} voces</small>`;
    rail.append(b);
  });
  const render=key=>{
    const c=cycleData[key];
    preview.classList.add('is-changing');
    setTimeout(()=>{
      preview.innerHTML=`<p class="count">${c.count} voces</p><h3>${c.title}</h3><p class="deck">${c.deck}</p><ul>${c.stories.map(s=>`<li class="${s.placeholder?'placeholder':''}">${s.href?`<a class="v15-reader-story" href="${s.href}">`:`<div class="v15-reader-story">`}<span><strong>${s.title}</strong><small>${meta(s)}</small></span><b>↗</b>${s.href?'</a>':'</div>'}</li>`).join('')}</ul>${c.href?`<a class="v11-reader-cta" href="${c.href}">Entrar a ${c.title} →</a>`:''}`;
      $$('[data-cycle]',rail).forEach(b=>b.classList.toggle('active',b.dataset.cycle===key));
      preview.classList.remove('is-changing');
      track('Leer por tema · cambió ciclo',{ciclo:c.title});
    },reduce?0:110);
  };
  rail.addEventListener('click',e=>{const b=e.target.closest('[data-cycle]');if(b)render(b.dataset.cycle)});
  render('empezar');
  initRailMeter(rail);
}

function initRailMeter(rail){
  const meter=$('.v15-rail-meter');const thumb=meter?.querySelector('i');
  if(!meter||!thumb)return;
  const draw=()=>{
    if(!isMobile()){meter.style.display='none';return}
    meter.style.display='block';
    const max=Math.max(1,rail.scrollWidth-rail.clientWidth);
    const p=clamp(rail.scrollLeft/max);
    const usable=Math.max(0,meter.clientWidth-thumb.getBoundingClientRect().width);
    thumb.style.transform=`translateX(${usable*p}px)`;
  };
  rail.addEventListener('scroll',()=>requestAnimationFrame(draw),{passive:true});
  addEventListener('resize',draw,{passive:true});
  requestAnimationFrame(draw);
}

function initKinetic(){
  const kinetic=$('#v11Kinetic'),img=$('#v11KineticImage');if(!kinetic||!img)return;
  const frames=['Logo.png','2.png','3.png','4.png','5.png','6.png','7.png','8.png','9.png'].map(n=>`../assets/brand/kinetic/${n}`);
  let frame=0,paused=reduce||saveData,userPaused=false,timer;
  if(!saveData)frames.slice(1).forEach(src=>{const i=new Image;i.src=src});
  const run=()=>{clearInterval(timer);if(paused)return;timer=setInterval(()=>{frame=(frame+1)%frames.length;img.src=frames[frame]},280)};
  const setPause=v=>{paused=v||reduce||saveData;kinetic.setAttribute('aria-pressed',String(paused));kinetic.setAttribute('aria-label',paused?'Reanudar logotipo cinético':'Pausar logotipo cinético');run()};
  if(!reduce&&!saveData){run();kinetic.addEventListener('mouseenter',()=>{if(!userPaused)setPause(true)});kinetic.addEventListener('mouseleave',()=>{if(!userPaused)setPause(false)});kinetic.addEventListener('focus',()=>{if(!userPaused)setPause(true)});kinetic.addEventListener('blur',()=>{if(!userPaused)setPause(false)});kinetic.addEventListener('click',()=>{userPaused=!userPaused;setPause(userPaused)})}
}

function initDock(){
  const dock=$('#v15Dock');if(!dock)return;
  const links=$$('nav a[href^="#"]',dock);
  const scenes=$$('.v11-scene[data-tone]');
  const update=()=>{
    dock.classList.toggle('is-bottom',isMobile());
    const y=innerHeight*(isMobile()?.5:.28);
    let best=null,bestDist=Infinity;
    for(const s of scenes){const r=s.getBoundingClientRect();if(r.top<=y&&r.bottom>=y){best=s;break}const d=Math.min(Math.abs(r.top-y),Math.abs(r.bottom-y));if(d<bestDist){best=s;bestDist=d}}
    if(best)dock.dataset.tone=best.dataset.tone||'light';
    links.forEach(a=>{const target=$(a.getAttribute('href'));if(!target){a.classList.remove('is-current');return}const r=target.getBoundingClientRect();a.classList.toggle('is-current',r.top<innerHeight*.52&&r.bottom>innerHeight*.34)});
  };
  addEventListener('scroll',()=>requestAnimationFrame(update),{passive:true});
  addEventListener('resize',update,{passive:true});update();
}

function initOrbits(){
  const svg=$('#v15OrbitLayer');if(!svg)return;
  const groups=$$('.orbit-set',svg).map(g=>({line:$('ellipse',g),dot:$('circle',g)}));
  const desktop={
    hero:[[31,45,29,.22,8],[34,48,24,.19,-13],[38,51,19,.17,27]],
    reader:[[61,44,29,.23,-7],[64,47,24,.19,15],[57,50,19,.17,-25]],
    etc:[[49,42,26,.22,7],[53,45,22,.19,-15],[46,48,17,.17,25]],
    chev1:[[50,47,24,.20,-5],[53,49,20,.18,17],[47,51,16,.16,-24]],
    about:[[38,36,27,.22,-8],[42,39,22,.19,18],[34,43,18,.16,-26]],
    chev2:[[50,47,24,.20,6],[53,49,20,.18,-16],[47,51,16,.16,24]],
    participate:[[60,43,28,.22,-8],[64,46,23,.19,16],[56,49,18,.16,-25]],
    footer:[[68,31,23,.21,8],[71,34,19,.18,-15],[64,37,15,.16,25]]
  };
  const mobile={
    hero:[[55,66,47,.20,7],[51,69,39,.18,-14],[59,72,31,.16,27]],
    reader:[[57,62,45,.21,-7],[52,65,37,.18,15],[61,68,30,.16,-25]],
    etc:[[54,40,43,.21,7],[49,43,35,.18,-15],[59,46,28,.16,25]],
    chev1:[[50,50,40,.19,-5],[54,52,33,.17,17],[46,54,26,.15,-24]],
    about:[[55,31,42,.20,-8],[50,34,35,.18,18],[60,37,28,.15,-26]],
    chev2:[[50,50,40,.19,6],[54,52,33,.17,-16],[46,54,26,.15,24]],
    participate:[[56,44,43,.21,-8],[51,47,35,.18,16],[61,50,28,.15,-25]],
    footer:[[58,28,38,.20,8],[53,31,31,.17,-15],[63,34,25,.15,25]]
  };
  const nodes=$$('.v11-scene[data-scene]');
  let sceneA='hero',sceneB='reader',sceneT=0,tone='light';
  const readScene=()=>{
    const y=scrollY+innerHeight*.48;let idx=0;
    for(let i=0;i<nodes.length;i++){if(y>=nodes[i].offsetTop)idx=i}
    const a=nodes[idx],b=nodes[Math.min(idx+1,nodes.length-1)];
    sceneA=a?.dataset.scene||'hero';sceneB=b?.dataset.scene||sceneA;tone=a?.dataset.tone||'light';svg.dataset.tone=tone;
    const start=a?.offsetTop||0,end=b===a?start+(a?.offsetHeight||innerHeight):(b?.offsetTop||start+innerHeight);
    sceneT=clamp((y-start)/Math.max(1,end-start));
  };
  const toPx=arr=>{const rx=arr[2]*innerWidth/100;return[arr[0]*innerWidth/100,arr[1]*innerHeight/100,rx,rx*arr[3],arr[4]]};
  const draw=now=>{
    const source=isMobile()?mobile:desktop,ta=source[sceneA]||source.hero,tb=source[sceneB]||ta;
    groups.forEach((o,i)=>{
      const A=toPx(ta[i]),B=toPx(tb[i]);const vals=A.map((v,j)=>lerp(v,B[j],sceneT));const [cx,cy,rx,ry,rot]=vals;
      o.line.setAttribute('cx',cx);o.line.setAttribute('cy',cy);o.line.setAttribute('rx',rx);o.line.setAttribute('ry',ry);o.line.setAttribute('transform',`rotate(${rot} ${cx} ${cy})`);
      const speed=[.00020,.00016,.00024][i];const ang=reduce?[.7,2.5,4.2][i]:now*speed+[0,2.1,4.2][i];
      const ca=Math.cos(ang),sa=Math.sin(ang),x0=rx*ca,y0=ry*sa,rad=rot*Math.PI/180;
      o.dot.setAttribute('cx',cx+x0*Math.cos(rad)-y0*Math.sin(rad));o.dot.setAttribute('cy',cy+x0*Math.sin(rad)+y0*Math.cos(rad));
    });
    if(!reduce)requestAnimationFrame(draw);
  };
  readScene();requestAnimationFrame(draw);
  addEventListener('scroll',readScene,{passive:true});addEventListener('resize',readScene,{passive:true});
}

function initChevrons(){
  const strips=$$('.v11-chevron-strip');if(!strips.length)return;
  const draw=()=>{
    strips.forEach(strip=>{
      const r=strip.getBoundingClientRect(),center=r.top+r.height/2,d=Math.abs(center-innerHeight/2),p=clamp(1-d/(innerHeight*.78));
      const eased=1-Math.pow(1-p,3),far=isMobile()?86:165,near=isMobile()?8:18,shift=lerp(far,near,eased);
      const left=$('.v11-chev-left',strip),right=$('.v11-chev-right',strip),core=$('.v11-chev-core',strip);
      if(left)left.style.transform=`translateX(${-shift}px) scaleX(${.94+eased*.10})`;
      if(right)right.style.transform=`translateX(${shift}px) scaleX(${.94+eased*.10})`;
      if(core){core.style.transform=`rotate(${eased*180}deg) scale(${.86+eased*.28})`;core.style.opacity=String(.62+eased*.38)}
    });
  };
  addEventListener('scroll',()=>requestAnimationFrame(draw),{passive:true});addEventListener('resize',draw,{passive:true});draw();
}

function initAboutPager(){
  const track=$('.v11-about-grid'),pager=$('.v15-about-pages');if(!track||!pager)return;
  const cards=$$('.v11-about-card',track),buttons=$$('button',pager);
  const set=i=>buttons.forEach((b,n)=>b.classList.toggle('is-active',n===i));
  const update=()=>{
    if(!isMobile()){set(0);return}
    const center=track.scrollLeft+track.clientWidth/2;let best=0,dist=Infinity;
    cards.forEach((c,i)=>{const cCenter=c.offsetLeft+c.offsetWidth/2,d=Math.abs(cCenter-center);if(d<dist){dist=d;best=i}});set(best);
  };
  buttons.forEach((b,i)=>b.addEventListener('click',()=>cards[i]?.scrollIntoView({behavior:reduce?'auto':'smooth',block:'nearest',inline:'center'})));
  track.addEventListener('scroll',()=>requestAnimationFrame(update),{passive:true});addEventListener('resize',update,{passive:true});update();
}

function initForms(){
  const newsletter=$('#v15Newsletter'),email=$('#v15Email'),note=$('#v15NewsletterNote');
  newsletter?.addEventListener('submit',e=>{e.preventDefault();track('Newsletter · intención',{origen:'home-v15'});if(note)note.textContent='Listo para conectar el envío de suscripción.'});
  email?.addEventListener('focus',()=>track('Newsletter · focus',{origen:'home-v15'}),{once:true});

  const dialog=$('#topicDialog'),open=$('#openTopicDialog'),footerOpen=$('#footerPropose'),close=$('.v11-dialog-close',dialog),form=$('#v15TopicForm'),name=$('#v15Name'),from=$('#v15From'),topic=$('#v15TopicText');
  if(!dialog)return;
  const show=()=>{if(!dialog.open){dialog.showModal();track('Proponer · abrió formulario',{origen:'home-v15'});setTimeout(()=>name?.focus(),50)}};
  const hide=()=>{if(dialog.open)dialog.close('cancel')};
  open?.addEventListener('click',show);footerOpen?.addEventListener('click',show);close?.addEventListener('click',e=>{e.preventDefault();hide()});
  dialog.addEventListener('click',e=>{if(e.target===dialog)hide()});
  form?.addEventListener('submit',e=>{
    e.preventDefault();
    if(!form.reportValidity())return;
    const body=`Nombre: ${name.value.trim()}\nCorreo: ${from.value.trim()}\n\nTema:\n${topic.value.trim()}`;
    track('Proponer · intención',{origen:'home-v15'});hide();
    location.href=`mailto:hola@cadaquiensutema.com?subject=${encodeURIComponent('Tengo un tema para CQST')}&body=${encodeURIComponent(body)}`;
  });
}

function initPlaceholderLinks(){
  $$('.placeholder-link').forEach(a=>a.addEventListener('click',e=>e.preventDefault()));
  $$('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>track('Navegación · home',{destino:a.getAttribute('href')})));
}

function init(){
  renderCurrentCycle();initReader();initKinetic();initDock();initOrbits();initChevrons();initAboutPager();initForms();initPlaceholderLinks();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();