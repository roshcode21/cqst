(()=>{
'use strict';
const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile=()=>innerWidth<=720;

/* V16 intentionally exaggerates the divider choreography. The chevrons begin
   far outside the center, rush inward, cross slightly, and the spark makes a
   full multi-turn response as the strip travels through the viewport. */
function amplifyChevrons(){
  const strips=$$('.v11-chevron-strip');
  if(!strips.length||reduce)return;
  let ticking=false;
  const draw=()=>{
    strips.forEach(strip=>{
      const r=strip.getBoundingClientRect();
      const center=r.top+r.height/2;
      const distance=Math.abs(center-innerHeight/2);
      const p=clamp(1-distance/(innerHeight*.72));
      const eased=1-Math.pow(1-p,4);
      const far=mobile()?Math.max(190,innerWidth*.58):Math.min(720,innerWidth*.46);
      const cross=mobile()?-18:-42;
      const shift=lerp(far,cross,eased);
      const scale=.78+eased*.42;
      const left=$('.v11-chev-left',strip),right=$('.v11-chev-right',strip),core=$('.v11-chev-core',strip);
      if(left)left.style.transform=`translate3d(${-shift}px,0,0) scaleX(${scale})`;
      if(right)right.style.transform=`translate3d(${shift}px,0,0) scaleX(${scale})`;
      if(core){
        core.style.transform=`rotate(${eased*540}deg) scale(${.72+eased*.58})`;
        core.style.opacity=String(.48+eased*.52);
      }
      strip.style.setProperty('--v16-energy',eased.toFixed(3));
    });
    ticking=false;
  };
  const request=()=>{if(!ticking){ticking=true;requestAnimationFrame(draw)}};
  addEventListener('scroll',request,{passive:true});
  addEventListener('resize',request,{passive:true});
  request();
}

/* The mobile dock is useful until the final signature appears. Let Last Pixel
   own the ending instead of covering it with navigation. */
function protectLastPixel(){
  const dock=$('#v15Dock'),last=$('.v11-last-pixel');
  if(!dock||!last)return;
  let ticking=false;
  const draw=()=>{
    if(!mobile()){
      dock.classList.remove('is-footer-near');
      ticking=false;
      return;
    }
    const r=last.getBoundingClientRect();
    const near=r.top<innerHeight+56 && r.bottom>-24;
    dock.classList.toggle('is-footer-near',near);
    ticking=false;
  };
  const request=()=>{if(!ticking){ticking=true;requestAnimationFrame(draw)}};
  addEventListener('scroll',request,{passive:true});
  addEventListener('resize',request,{passive:true});
  request();
}

function init(){amplifyChevrons();protectLastPixel()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();