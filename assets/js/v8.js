(()=>{
  const root=document.documentElement;
  const dock=document.getElementById('v8Dock');
  const toast=document.getElementById('v8Toast');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData=navigator.connection&&navigator.connection.saveData;

  const track=(name,data={})=>{try{window.umami&&window.umami.track(name,data)}catch(_){}};
  const showToast=(msg)=>{if(!toast)return;toast.textContent=msg;toast.classList.add('is-visible');clearTimeout(showToast.t);showToast.t=setTimeout(()=>toast.classList.remove('is-visible'),2600)};

  const cycleData={
    empezar:{title:'Empezar',count:3,deck:'El principio cambia según quién lo cuenta.',href:'../empezar/',stories:[
      {title:'La fecha la ponemos después',meta:'Rodolfo Raudales · 3 min',href:'../empezar/la-fecha-la-ponemos-despues/',read:true},
      {title:'No fue ese día',meta:'Mariví Cerisola · 4 min'},
      {title:'[tu título aquí]',meta:'Mel Castán',placeholder:true}
    ]},
    dinero:{title:'Dinero',count:4,deck:'Cuatro voces alrededor de una palabra que cambia según quién la cuenta.',stories:new Array(4).fill(0).map((_,i)=>({title:'[título de la pieza]',meta:`voz ${i+1} · por confirmar`,placeholder:true}))},
    casa:{title:'Casa',count:4,deck:'Plantilla de ciclo para probar cómo crece la revista.',stories:new Array(4).fill(0).map((_,i)=>({title:'[título de la pieza]',meta:`voz ${i+1} · por confirmar`,placeholder:true}))},
    cuerpo:{title:'Cuerpo',count:3,deck:'Plantilla de ciclo para probar cómo crece la revista.',stories:new Array(3).fill(0).map((_,i)=>({title:'[título de la pieza]',meta:`voz ${i+1} · por confirmar`,placeholder:true}))},
    tiempo:{title:'Tiempo',count:4,deck:'Plantilla de ciclo para probar cómo crece la revista.',stories:new Array(4).fill(0).map((_,i)=>({title:'[título de la pieza]',meta:`voz ${i+1} · por confirmar`,placeholder:true}))},
    deseo:{title:'Deseo',count:3,deck:'Plantilla de ciclo para probar cómo crece la revista.',stories:new Array(3).fill(0).map((_,i)=>({title:'[título de la pieza]',meta:`voz ${i+1} · por confirmar`,placeholder:true}))},
    duelo:{title:'Duelo',count:4,deck:'Plantilla de ciclo para probar cómo crece la revista.',stories:new Array(4).fill(0).map((_,i)=>({title:'[título de la pieza]',meta:`voz ${i+1} · por confirmar`,placeholder:true}))},
    fe:{title:'Fe',count:3,deck:'Plantilla de ciclo para probar cómo crece la revista.',stories:new Array(3).fill(0).map((_,i)=>({title:'[título de la pieza]',meta:`voz ${i+1} · por confirmar`,placeholder:true}))}
  };

  const heroTitle=document.getElementById('heroCycleTitle');
  const heroDeck=document.getElementById('heroCycleDeck');
  const heroLink=document.getElementById('heroCycleLink');
  const heroStories=document.getElementById('heroStories');
  const renderHero=(key)=>{
    const c=cycleData[key]; if(!c)return;
    heroTitle.textContent=c.title; heroDeck.textContent=c.deck;
    if(c.href){heroLink.hidden=false;heroLink.href=c.href}else{heroLink.hidden=true}
    heroStories.innerHTML=c.stories.map(s=>`${s.href?`<a class="v8-story-row${s.read?' is-read':''}${s.placeholder?' is-placeholder':''}" href="${s.href}">`:`<div class="v8-story-row${s.read?' is-read':''}${s.placeholder?' is-placeholder':''}">`}<i></i><strong>${s.title}</strong><small>${s.meta}</small><b>↗</b>${s.href?'</a>':'</div>'}`).join('');
    track('Home · cambió ciclo destacado',{ciclo:c.title});
  };
  document.querySelectorAll('#heroCycleStrip [data-cycle]').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('#heroCycleStrip [data-cycle]').forEach(b=>b.setAttribute('aria-selected','false'));
    btn.setAttribute('aria-selected','true');renderHero(btn.dataset.cycle);
  }));
  renderHero('empezar');

  const readerStage=document.getElementById('readerStage');
  const renderReader=(key)=>{
    const c=cycleData[key];if(!c)return;
    readerStage.innerHTML=`<h3>${c.title}</h3><p class="v8-reader-deck">${c.deck}</p><ul class="v8-reader-list">${c.stories.map(s=>`<li class="${s.placeholder?'is-placeholder':''}">${s.href?`<a href="${s.href}"><strong>${s.title}</strong><span>${s.meta}</span></a>`:`<strong>${s.title}</strong><span>${s.meta}</span>`}</li>`).join('')}</ul>`;
    document.querySelectorAll('#readerRail [data-cycle]').forEach(b=>b.classList.toggle('is-active',b.dataset.cycle===key));
    track('Leer por tema · cambió ciclo',{ciclo:c.title});
  };
  document.querySelectorAll('#readerRail [data-cycle]').forEach(btn=>btn.addEventListener('click',()=>renderReader(btn.dataset.cycle)));
  renderReader('empezar');

  /* kinetic: constant loop, pause on hover/focus/tap */
  const kinetic=document.getElementById('v8Kinetic');
  const kineticImg=document.getElementById('v8KineticImage');
  const frames=['Logo.png','2.png','3.png','4.png','5.png','6.png','7.png','8.png','9.png'].map(n=>`../assets/brand/kinetic/${n}`);
  let frame=0,paused=reduce||saveData,timer=null,userPaused=false;
  if(!saveData)frames.slice(1).forEach(src=>{const i=new Image;i.src=src});
  const syncKinetic=()=>{clearInterval(timer);if(paused)return;timer=setInterval(()=>{frame=(frame+1)%frames.length;kineticImg.src=frames[frame]},260)};
  const setPause=(v)=>{paused=v||reduce||saveData;kinetic.setAttribute('aria-pressed',String(paused));kinetic.setAttribute('aria-label',paused?'Reanudar logotipo cinético':'Pausar logotipo cinético');syncKinetic()};
  if(!reduce&&!saveData){syncKinetic();kinetic.addEventListener('mouseenter',()=>{if(!userPaused)setPause(true)});kinetic.addEventListener('mouseleave',()=>{if(!userPaused)setPause(false)});kinetic.addEventListener('focus',()=>{if(!userPaused)setPause(true)});kinetic.addEventListener('blur',()=>{if(!userPaused)setPause(false)});kinetic.addEventListener('click',()=>{userPaused=!userPaused;setPause(userPaused)})}

  /* orbit engine: fixed in viewport, positions interpolate with page sections */
  const orbitLayer=document.getElementById('v8OrbitLayer');
  const orbits=[...orbitLayer.querySelectorAll('.v8-orbit')];
  const scenes=[...document.querySelectorAll('[data-scene]')];
  const targets={
    hero:[[6,24,14],[29,31,-26],[47,39,38]],
    reader:[[2,26,-18],[16,44,32],[67,22,-38]],
    etc:[[4,22,20],[34,55,-24],[72,66,16]],
    about:[[8,22,-16],[42,45,27],[72,30,-31]],
    participate:[[4,70,18],[52,30,-28],[78,67,26]]
  };
  const colors={hero:'#0017ff',reader:'#0017ff',etc:'#fff8dc',about:'#5a19ff',participate:'#fff8dc'};
  let ticking=false;
  const lerp=(a,b,t)=>a+(b-a)*t;
  const orbitUpdate=()=>{
    ticking=false;
    const y=scrollY+innerHeight*.48;
    let idx=0;
    for(let i=0;i<scenes.length;i++){if(y>=scenes[i].offsetTop)idx=i}
    const cur=scenes[idx],next=scenes[Math.min(idx+1,scenes.length-1)];
    const name=cur.dataset.scene, nextName=next.dataset.scene;
    const start=cur.offsetTop,end=next===cur?start+cur.offsetHeight:next.offsetTop;
    const p=Math.max(0,Math.min(1,(y-start)/Math.max(1,end-start)));
    const a=targets[name]||targets.hero,b=targets[nextName]||a;
    orbits.forEach((o,i)=>{
      const x=lerp(a[i][0],b[i][0],p),yy=lerp(a[i][1],b[i][1],p),r=lerp(a[i][2],b[i][2],p);
      o.style.setProperty('--ox',`${x}vw`);o.style.setProperty('--oy',`${yy}vh`);o.style.setProperty('--or',`${r}deg`);o.style.setProperty('--orbit',colors[name]||'#0017ff');
    });
    dock.dataset.tone=cur.dataset.tone||'light';
  };
  addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(orbitUpdate)}},{passive:true});
  addEventListener('resize',orbitUpdate);orbitUpdate();

  /* chevrons react when crossing viewport center */
  const chevObserver=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('is-compressed',e.isIntersecting)),{threshold:.65});
  document.querySelectorAll('.v8-chevron').forEach(el=>chevObserver.observe(el));

  /* forms */
  const newsletter=document.getElementById('v8NewsletterForm');
  newsletter?.addEventListener('submit',e=>{e.preventDefault();track('Newsletter · intención',{origen:'home-v8'});document.getElementById('v8NewsletterStatus').textContent='Listo para conectar el formulario de suscripción.';showToast('Suscripción en modo laboratorio')});
  document.getElementById('v8Email')?.addEventListener('focus',()=>track('Newsletter · focus',{origen:'home-v8'}),{once:true});
  const topic=document.getElementById('v8TopicForm');
  topic?.addEventListener('submit',e=>{e.preventDefault();const text=document.getElementById('v8Topic').value.trim();if(!text)return;track('Proponer · intención',{origen:'home-v8'});location.href=`mailto:hola@cadaquiensutema.com?subject=${encodeURIComponent('Tengo un tema para CQST')}&body=${encodeURIComponent(text)}`});

  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>track('Navegación · home',{destino:a.getAttribute('href')})));
})();
