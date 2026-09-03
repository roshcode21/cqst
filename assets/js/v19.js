(()=>{
'use strict';
const $=(s,c=document)=>c.querySelector(s);
const track=(name,data={})=>{try{window.umami&&window.umami.track(name,data)}catch(_){}};

/* NEWSLETTER — GitHub Pages + Formspree, no framework and no extra runtime. */
function initNewsletter(){
  const form=$('#v19Newsletter'),email=$('#v19Email'),note=$('#v19NewsletterNote');
  if(!form||!email)return;
  const button=$('button[type="submit"]',form);
  const normalLabel=button?.textContent||'Recibir CQST →';

  form.addEventListener('submit',async e=>{
    e.preventDefault();
    if(!form.reportValidity())return;

    if(note){note.textContent='';note.classList.remove('is-success','is-error')}
    if(button){button.disabled=true;button.textContent='Enviando…'}
    track('Newsletter · intención',{origen:'home-v19'});

    try{
      const response=await fetch(form.action,{
        method:'POST',
        body:new FormData(form),
        headers:{Accept:'application/json'}
      });
      if(!response.ok)throw new Error('formspree');
      form.reset();
      if(note){note.textContent='Listo. Te escribimos cuando haya algo que decir.';note.classList.add('is-success')}
      track('Newsletter · enviado',{origen:'home-v19'});
    }catch(_){
      if(note){note.textContent='No pudimos registrar tu correo. Intenta otra vez.';note.classList.add('is-error')}
    }finally{
      if(button){button.disabled=false;button.textContent=normalLabel}
    }
  });
}

/* TOPIC — LAB route. Capture phase replaces the old V17 mail handler cleanly. */
function initTopic(){
  const dialog=$('#topicDialog'),form=$('#v19TopicForm'),name=$('#v19Name'),email=$('#v19From'),topic=$('#v19TopicText'),close=$('.v11-dialog-close',dialog);
  if(!dialog||!form||!name||!email||!topic)return;

  const closeDialog=e=>{e?.preventDefault?.();e?.stopImmediatePropagation?.();if(dialog.open)dialog.close('cancel')};
  close?.addEventListener('pointerup',closeDialog,true);
  close?.addEventListener('click',closeDialog,true);

  form.addEventListener('submit',e=>{
    e.preventDefault();
    e.stopImmediatePropagation();
    if(!form.reportValidity())return;

    const sender=name.value.trim();
    const reply=email.value.trim();
    const idea=topic.value.trim();
    const excerpt=idea.replace(/\s+/g,' ').slice(0,62);
    const subject=`CQST LAB · Propuesta de tema · ${excerpt}${idea.length>62?'…':''}`;
    const body=[
      'NUEVA PROPUESTA DE TEMA',
      'Cada quien su tema · Home V19',
      '',
      'QUIÉN ENVÍA',
      `Nombre: ${sender}`,
      `Correo: ${reply}`,
      '',
      'TEMA',
      idea,
      '',
      'CONTEXTO',
      `Página: ${location.href}`,
      `Responder a: ${reply}`
    ].join('\n');

    track('Proponer · intención',{origen:'home-v19'});
    if(dialog.open)dialog.close('submit');
    location.href=`mailto:rodo.raudales@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  },true);
}

function init(){initNewsletter();initTopic()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
