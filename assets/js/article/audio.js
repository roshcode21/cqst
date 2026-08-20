/* CQST — article/audio.js
   <audio> nativo + interfaz CQST. Sin autoplay. */
(() => {
  "use strict";
  const { $, track, showToast, completeVoice, isLab, body }=window.CQST;
  const entry=$("#audioEntry"),audio=$("#articleAudio"),mainButton=$("#audioMainButton"),icon=$("#audioIcon"),time=$("#audioTime"),dock=$("#audioDock"),dockPlay=$("#audioDockPlay"),range=$("#audioDockRange"),current=$("#audioDockCurrent"),duration=$("#audioDockDuration"),speed=$("#audioSpeed");
  const ready=entry?.dataset.audioReady==="true"; const speeds=[1,1.25,1.5,1.75,2]; let speedIndex=0; const quartiles=new Set();
  function fmt(seconds){if(!Number.isFinite(seconds)||seconds<0)return"—";const m=Math.floor(seconds/60),s=Math.floor(seconds%60).toString().padStart(2,"0");return`${m}:${s}`;}
  function setState(playing){const glyph=playing?"Ⅱ":"▶";if(icon)icon.textContent=glyph;if(dockPlay)dockPlay.textContent=glyph;entry?.setAttribute("data-state",playing?"playing":"paused");dock?.classList.toggle("is-open",playing||(audio?.currentTime||0)>0);}
  async function toggle(){if(!ready||!audio){if(isLab)showToast("Audio de plantilla: falta el MP3");return;}if(audio.paused){try{await audio.play();}catch{showToast("No se pudo iniciar el audio");}}else audio.pause();}
  mainButton?.addEventListener("click",toggle); dockPlay?.addEventListener("click",toggle);
  if(!audio||!ready){if(time)time.textContent="";return;}
  audio.addEventListener("loadedmetadata",()=>{const value=fmt(audio.duration);if(time)time.textContent=value;if(duration)duration.textContent=value;if(range)range.max=String(audio.duration||0);if("mediaSession" in navigator&&"MediaMetadata" in window){try{navigator.mediaSession.metadata=new MediaMetadata({title:body.dataset.title||document.title,artist:body.dataset.authorName||"Rodolfo Raudales",album:`Cada quien su tema · ${body.dataset.cycleName||"Empezar"}`,artwork:[{src:"../../assets/brand/icon-192.png",sizes:"192x192",type:"image/png"},{src:"../../assets/brand/icon-512.png",sizes:"512x512",type:"image/png"}]});}catch{}}});
  audio.addEventListener("play",()=>{setState(true);track("audio_start");}); audio.addEventListener("pause",()=>setState(false));
  audio.addEventListener("timeupdate",()=>{const total=audio.duration||0,now=audio.currentTime||0,ratio=total?now/total:0;if(current)current.textContent=fmt(now);if(range&&document.activeElement!==range)range.value=String(now);[[.25,"audio_25"],[.5,"audio_50"],[.75,"audio_75"]].forEach(([threshold,event])=>{if(ratio>=threshold&&!quartiles.has(event)){quartiles.add(event);track(event);}});});
  audio.addEventListener("ended",()=>{setState(false);track("audio_complete");completeVoice("audio");});
  range?.addEventListener("input",()=>{audio.currentTime=Number(range.value);});
  speed?.addEventListener("click",()=>{speedIndex=(speedIndex+1)%speeds.length;audio.playbackRate=speeds[speedIndex];speed.textContent=`${speeds[speedIndex]}×`;track("audio_speed_change",{speed:speeds[speedIndex]});});
  if("mediaSession" in navigator){try{navigator.mediaSession.setActionHandler("play",()=>audio.play());navigator.mediaSession.setActionHandler("pause",()=>audio.pause());navigator.mediaSession.setActionHandler("seekbackward",(details)=>{audio.currentTime=Math.max(0,audio.currentTime-(details.seekOffset||10));});navigator.mediaSession.setActionHandler("seekforward",(details)=>{audio.currentTime=Math.min(audio.duration||Infinity,audio.currentTime+(details.seekOffset||10));});}catch{}}
})();