(()=>{
'use strict';
const $=(s,c=document)=>c.querySelector(s);
const track=(name,data={})=>{try{window.umami&&window.umami.track(name,data)}catch(_){}};

async function submitFormspree(form){
  const response=await fetch(form.action,{
    method:'POST',
    body:new FormData(form),
    headers:{Accept:'application/json'}
  });
  if(!response.ok){
    let message='No pudimos enviar el formulario.';
    try{
      const data=await response.json();
      if(Array.isArray(data?.errors)&&data.errors[0]?.message)message=data.errors[0].message;
    }catch(_){}
    throw new Error(message);
  }
  return response;
}

function initNewsletter(){
  const form=$('#v20Newsletter'),note=$('#v20NewsletterNote');
  if(!form)return;
  const button=$('button[type="submit"]',form);
  const label=button?.textContent||'Recibir CQST →';

  form.addEventListener('submit',async e=>{
    e.preventDefault();
    if(!form.reportValidity())return;
    if(note){note.textContent='';note.classList.remove('is-success','is-error')}
    if(button){button.disabled=true;button.textContent='Enviando…'}
    track('Newsletter · intención',{origen:'home-v20'});
    try{
      await submitFormspree(form);
      form.reset();
      if(note){note.textContent='Listo. Te escribimos cuando haya algo que decir.';note.classList.add('is-success')}
      track('Newsletter · enviado',{origen:'home-v20'});
    }catch(_){
      if(note){note.textContent='No pudimos registrar tu correo. Intenta otra vez.';note.classList.add('is-error')}
    }finally{
      if(button){button.disabled=false;button.textContent=label}
    }
  });
}

function initTopic(){
  const dialog=$('#topicDialog'),form=$('#v20TopicForm'),note=$('#v20TopicNote'),close=$('.v11-dialog-close',dialog);
  if(!dialog||!form)return;
  const button=$('button[type="submit"]',form);
  const label=button?.textContent||'Enviar la idea →';

  const closeDialog=e=>{
    e?.preventDefault?.();
    e?.stopImmediatePropagation?.();
    if(dialog.open)dialog.close('cancel');
  };
  close?.addEventListener('pointerup',closeDialog,true);
  close?.addEventListener('click',closeDialog,true);

  form.addEventListener('submit',async e=>{
    e.preventDefault();
    e.stopImmediatePropagation();
    if(!form.reportValidity())return;
    if(note){note.textContent='';note.classList.remove('is-success','is-error')}
    if(button){button.disabled=true;button.textContent='Enviando…'}
    track('Proponer · intención',{origen:'home-v20'});

    try{
      await submitFormspree(form);
      form.reset();
      if(note){note.textContent='Llegó. Gracias por abrir el tema.';note.classList.add('is-success')}
      if(button)button.textContent='Enviado ✓';
      track('Proponer · enviado',{origen:'home-v20'});
      setTimeout(()=>{if(dialog.open)dialog.close('success')},1250);
    }catch(_){
      if(note){note.textContent='No pudimos enviar el tema. Intenta otra vez.';note.classList.add('is-error')}
      if(button){button.disabled=false;button.textContent=label}
      return;
    }
    setTimeout(()=>{if(button){button.disabled=false;button.textContent=label}},1350);
  },true);
}

function init(){initNewsletter();initTopic()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
