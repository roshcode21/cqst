(()=>{
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const dock=$('#v11Dock');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData=!!(navigator.connection&&navigator.connection.saveData);
  const track=(name,data={})=>{try{window.umami&&window.umami.track(name,data)}catch(_){}};

  const placeholderStories=(count)=>Array.from({length:count},()=>({title:'[título aquí]',meta:'Voz por confirmar',placeholder:true}));
  const cycleData={
    empezar:{title:'Empezar',count:3,deck:'El principio cambia según quién lo cuenta.',href:'../empezar/',stories:[
      {title:'La fecha la ponemos después',meta:'Rodolfo Raudales · 3 min',href:'../empezar/la-fecha-la-ponemos-despues/',read:true},
      {title:'No fue ese día',meta:'Mariví Cerisola · 4 min'},
      {title:'[tu título aquí]',meta:'Mel Castán',placeholder:true}
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

  const storyHTML=s=>`${s.href?`<a class="v11-story${s.read?' is-read':''}${s.placeholder?' placeholder':''}" href="${s.href}">`:`<div class="v11-story${s.read?' is-read':''}${s.placeholder?' placeholder':''}">`}<i></i><strong>${s.title}</strong><small>${s.meta}</small><b>↗</b>${s.href?'</a>':'</div>'}`;

  const heroTabs=$('#heroCycleTabs'), heroTitle=$('#heroTitle'), heroDeck=$('#heroDeck'), heroStories=$('#heroStories'), heroOpen=$('#heroOpen');
  order.forEach((key,i)=>{const c=cycleData[key],b=document.createElement('button');b.type='button';b.textContent=c.title;b.dataset.cycle=key;b.setAttribute('aria-selected',i===0?'true':'false');heroTabs.append(b)});
  const renderHero=key=>{const c=cycleData[key];heroTitle.textContent=c.title;heroDeck.textContent=c.deck;heroStories.innerHTML=c.stories.map(storyHTML).join('');heroOpen.hidden=!c.href;if(c.href)heroOpen.href=c.href;$$('[data-cycle]',heroTabs).forEach(b=>b.setAttribute('aria-selected',String(b.dataset.cycle===key)));track('Home · ciclo destacado',{ciclo:c.title})};
  heroTabs.addEventListener('click',e=>{const b=e.target.closest('[data-cycle]');if(b)renderHero(b.dataset.cycle)});renderHero('empezar');

  const rail=$('#readerRail'), preview=$('#readerPreview');
  order.forEach((key,i)=>{const c=cycleData[key],b=document.createElement('button');b.type='button';b.dataset.cycle=key;b.className=i===0?'active':'';b.innerHTML=`<strong>${c.title}</strong><small>${c.count} voces</small>`;rail.append(b)});
  const renderReader=key=>{const c=cycleData[key];preview.classList.add('is-changing');setTimeout(()=>{preview.innerHTML=`<p class="count">${c.count} voces</p><h3>${c.title}</h3><p class="deck">${c.deck}</p><ul>${c.stories.map(s=>`<li class="${s.placeholder?'placeholder':''}">${s.href?`<a href="${s.href}"><strong>${s.title}</strong></a>`:`<strong>${s.title}</strong>`}<span>${s.meta}</span></li>`).join('')}</ul>${c.href?`<a class="v11-reader-cta" href="${c.href}">Entrar a ${c.title} →</a>`:''}`;$$('[data-cycle]',rail).forEach(b=>b.classList.toggle('active',b.dataset.cycle===key));preview.classList.remove('is-changing');track('Leer por tema · cambió ciclo',{ciclo:c.title})},reduce?0:120)};
  rail.addEventListener('click',e=>{const b=e.target.closest('[data-cycle]');if(b)renderReader(b.dataset.cycle)});renderReader('empezar');

  const kinetic=$('#v11Kinetic'), kineticImg=$('#v11KineticImage');
  const frames=['Logo.png','2.png','3.png','4.png','5.png','6.png','7.png','8.png','9.png'].map(n=>`../assets/brand/kinetic/${n}`);
  let frame=0, paused=reduce||saveData, userPaused=false, timer;
  if(!saveData)frames.slice(1).forEach(src=>{const i=new Image;i.src=src});
  const runKinetic=()=>{clearInterval(timer);if(paused)return;timer=setInterval(()=>{frame=(frame+1)%frames.length;kineticImg.src=frames[frame]},280)};
  const setPause=v=>{paused=v||reduce||saveData;kinetic.setAttribute('aria-pressed',String(paused));kinetic.setAttribute('aria-label',paused?'Reanudar logotipo cinético':'Pausar logotipo cinético');runKinetic()};
  if(!reduce&&!saveData){runKinetic();kinetic.addEventListener('mouseenter',()=>{if(!userPaused)setPause(true)});kinetic.addEventListener('mouseleave',()=>{if(!userPaused)setPause(false)});kinetic.addEventListener('focus',()=>{if(!userPaused)setPause(true)});kinetic.addEventListener('blur',()=>{if(!userPaused)setPause(false)});kinetic.addEventListener('click',()=>{userPaused=!userPaused;setPause(userPaused)})}

  const bgObs=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,src=el.dataset.bg;if(src){el.style.setProperty('--scene-bg',`url("${src}")`);el.classList.add('is-bg-ready');delete el.dataset.bg}bgObs.unobserve(el)}),{rootMargin:'700px 0px'});
  $$('.lazy-bg').forEach(el=>bgObs.observe(el));

  const scenes=$$('.v11-scene[data-tone]');
  let currentTone='light';
  const setDockTone=t=>{if(t===currentTone)return;currentTone=t;dock.dataset.tone=t};
  const sceneAtCenter=()=>{const y=innerHeight*.28;let best=null,bestDist=Infinity;for(const s of scenes){const r=s.getBoundingClientRect();if(r.top<=y&&r.bottom>=y){best=s;break}const d=Math.min(Math.abs(r.top-y),Math.abs(r.bottom-y));if(d<bestDist){best=s;bestDist=d}}if(best)setDockTone(best.dataset.tone||'light');if(innerWidth<=720)dock.classList.toggle('is-bottom',scrollY>innerHeight*.32)};

  const svg=$('#v11OrbitLayer');
  const groups=$$('.orbit-set',svg).map(g=>({g,line:$('ellipse',g),dot:$('circle',g)}));
  const targets={
    hero:[[29,42,25,12,9],[32,43,21,9,-17],[35,46,17,7,30]],
    reader:[[44,38,25,11,-5],[47,43,21,8,18],[42,47,17,6,-28]],
    etc:[[49,38,24,10,8],[53,43,20,8,-16],[47,47,16,6,26]],
    chev1:[[50,43,23,9,-7],[53,46,19,7,17],[47,49,15,5,-26]],
    about:[[34,38,24,10,-10],[38,43,20,8,20],[31,47,16,6,-28]],
    chev2:[[48,42,23,9,8],[52,46,19,7,-17],[45,49,15,5,27]],
    participate:[[54,39,25,10,-9],[58,44,20,8,18],[50,48,16,6,-27]],
    footer:[[64,30,21,9,8],[67,34,17,7,-16],[60,37,14,5,26]]
  };
  const sceneNodes=$$('.v11-scene[data-scene]');
  const lerp=(a,b,t)=>a+(b-a)*t, clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  let sceneA='hero',sceneB='reader',sceneT=0;
  const readOrbitScene=()=>{const y=scrollY+innerHeight*.48;let idx=0;for(let i=0;i<sceneNodes.length;i++){if(y>=sceneNodes[i].offsetTop)idx=i}const a=sceneNodes[idx],b=sceneNodes[Math.min(idx+1,sceneNodes.length-1)];sceneA=a?.dataset.scene||'hero';sceneB=b?.dataset.scene||sceneA;const start=a?.offsetTop||0,end=b===a?start+(a?.offsetHeight||innerHeight):(b?.offsetTop||start+innerHeight);sceneT=clamp((y-start)/Math.max(1,end-start))};
  const targetToPx=(arr)=>[arr[0]*innerWidth/100,arr[1]*innerHeight/100,arr[2]*innerWidth/100,arr[3]*innerHeight/100,arr[4]];
  const renderOrbit=now=>{const ta=targets[sceneA]||targets.hero,tb=targets[sceneB]||ta;groups.forEach((o,i)=>{const A=targetToPx(ta[i]),B=targetToPx(tb[i]);let [cx,cy,rx,ry,rot]=A.map((v,j)=>lerp(v,B[j],sceneT));if(innerWidth<720){rx*=.63;ry*=.76;cx=lerp(cx,innerWidth*.48,.18);cy=lerp(cy,innerHeight*.48,.12)}o.line.setAttribute('cx',cx);o.line.setAttribute('cy',cy);o.line.setAttribute('rx',rx);o.line.setAttribute('ry',ry);o.line.setAttribute('transform',`rotate(${rot} ${cx} ${cy})`);const speed=[.00022,.00017,.00027][i];const ang=reduce?[.6,2.4,4.1][i]:now*speed+[0,2.1,4.2][i];const ca=Math.cos(ang),sa=Math.sin(ang),x0=rx*ca,y0=ry*sa,rad=rot*Math.PI/180;const x=cx+x0*Math.cos(rad)-y0*Math.sin(rad),y=cy+x0*Math.sin(rad)+y0*Math.cos(rad);o.dot.setAttribute('cx',x);o.dot.setAttribute('cy',y)});if(!reduce)requestAnimationFrame(renderOrbit)};
  readOrbitScene();requestAnimationFrame(renderOrbit);

  const chevronUpdate=()=>{$$('.v11-chevron-strip').forEach(strip=>{const r=strip.getBoundingClientRect(),center=r.top+r.height/2,d=Math.abs(center-innerHeight/2),p=clamp(1-d/(innerHeight*.7));const shift=110-(p*105),scale=.9+(p*.22),rot=p*90;strip.style.setProperty('--chev-shift',`${shift}px`);strip.style.setProperty('--chev-scale',scale.toFixed(3));strip.style.setProperty('--chev-rot',rot.toFixed(1))})};

  let ticking=false;const onScroll=()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{readOrbitScene();sceneAtCenter();chevronUpdate();ticking=false})};
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',()=>{readOrbitScene();sceneAtCenter();chevronUpdate()});sceneAtCenter();chevronUpdate();

  $('#v11Newsletter')?.addEventListener('submit',e=>{e.preventDefault();track('Newsletter · intención',{origen:'home-v11'});$('#v11NewsletterNote').textContent='Listo para conectar el envío de suscripción.'});
  $('#v11Email')?.addEventListener('focus',()=>track('Newsletter · focus',{origen:'home-v11'}),{once:true});

  const dialog=$('#topicDialog'),openDialog=$('#openTopicDialog'),topicForm=$('#v11TopicForm'),topicText=$('#v11TopicText');
  openDialog?.addEventListener('click',()=>{track('Proponer · abrió formulario',{origen:'home-v11'});dialog.showModal();setTimeout(()=>topicText.focus(),40)});
  topicForm?.addEventListener('submit',e=>{const value=topicText.value.trim();if(!value){e.preventDefault();topicText.focus();return}e.preventDefault();track('Proponer · intención',{origen:'home-v11'});dialog.close();location.href=`mailto:hola@cadaquiensutema.com?subject=${encodeURIComponent('Tengo un tema para CQST')}&body=${encodeURIComponent(value)}`});

  $$('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>track('Navegación · home',{destino:a.getAttribute('href')})));
})();
