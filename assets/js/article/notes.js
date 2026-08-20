/* CQST — article/notes.js
   Preview en margen ancho; nota inline en pantallas estrechas. */
(() => {
  "use strict";
  const { $, $$, track } = window.CQST;
  const NOTES={
    fresh:{number:"01",title:"Efecto de nuevo comienzo",copy:"Ciertos hitos temporales pueden separar mentalmente un periodo de otro y, en determinados contextos, aumentar conductas orientadas a metas.",cite:"Dai, H., Milkman, K. L. & Riis, J. (2014). The Fresh Start Effect. Management Science, 60(10), 2563–2582."},
    memory:{number:"02",title:"Memoria autobiográfica",copy:"Recordar no equivale a reproducir una grabación intacta. La memoria integra reconstrucción, inferencias, información posterior y significado.",cite:"Fivush, R. & Grysman, A. (2023). Accuracy and reconstruction in autobiographical memory. WIREs Cognitive Science, 14(3), e1620."},
    hindsight:{number:"03",title:"Sesgo retrospectivo",copy:"Conocer el desenlace puede hacer que ese resultado parezca más previsible —o inevitable— de lo que parecía antes de ocurrir.",cite:"Fischhoff, B. (1975). Hindsight is not equal to foresight. Journal of Experimental Psychology: Human Perception and Performance, 1(3), 288–299."}
  };
  const margin=$("#marginNote"); let pinned=null; const wide=()=>matchMedia("(min-width: 1181px)").matches;
  function renderMargin(id){const note=NOTES[id];if(!margin||!note)return;$(".margin-note-count",margin).textContent=`Nota ${note.number}`;$("h2",margin).textContent=note.title;$("p",margin).textContent=note.copy;$("cite",margin).textContent=note.cite;margin.classList.add("is-visible");}
  function removeInline(){$$(".inline-note").forEach((item)=>item.remove());$$(".note-ref").forEach((ref)=>ref.setAttribute("aria-expanded","false"));}
  function openInline(button,id){const note=NOTES[id],paragraph=button.closest("p");if(!note||!paragraph)return;removeInline();const panel=document.createElement("aside");panel.className="inline-note is-open";panel.innerHTML=`<span class="inline-note-count">Nota ${note.number}</span><h2>${note.title}</h2><p>${note.copy}</p><cite>${note.cite}</cite>`;paragraph.insertAdjacentElement("afterend",panel);button.setAttribute("aria-expanded","true");}
  $$(".note-ref").forEach((button)=>{const id=button.dataset.note;button.addEventListener("mouseenter",()=>{if(wide()&&!pinned)renderMargin(id);});button.addEventListener("mouseleave",()=>{if(wide()&&!pinned)margin?.classList.remove("is-visible");});button.addEventListener("focus",()=>{if(wide()&&!pinned)renderMargin(id);});button.addEventListener("blur",()=>{if(wide()&&!pinned)margin?.classList.remove("is-visible");});button.addEventListener("click",()=>{track("note_open",{note:id});if(!wide()){const wasOpen=button.getAttribute("aria-expanded")==="true";removeInline();if(!wasOpen)openInline(button,id);return;}if(pinned===id){pinned=null;button.setAttribute("aria-expanded","false");margin?.classList.remove("is-visible");}else{pinned=id;$$(".note-ref").forEach((ref)=>ref.setAttribute("aria-expanded",String(ref===button)));renderMargin(id);}});});
  document.addEventListener("keydown",(event)=>{if(event.key!=="Escape")return;pinned=null;margin?.classList.remove("is-visible");removeInline();});
  $("#notesLedger")?.addEventListener("toggle",(event)=>{if(event.currentTarget.open)track("notes_ledger_open");});
})();