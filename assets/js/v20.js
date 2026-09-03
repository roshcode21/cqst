(()=>{
'use strict';
const $=(s,c=document)=>c.querySelector(s);
const track=(name,data={})=>{try{window.umami&&window.umami.track(name,data)}catch(_){}};

/* Final V20 visual fix: on desktop the YQP icon must belong to the title lockup,
   not sit at the far edge of a stretched grid column. Keep the whole lockup
   right-aligned while letting the icon hug the title. */
function fixYqpHeader(){
  const style=document.createElement('style');
  style.id='v20-yqp-lockup-fix';
  style.textContent=`
    @media (min-width:721px){
      .v20 .v11-about .v11-section-head{
        width:max-content!important;
        max-width:100%!important;
        grid-template-columns:58px auto!important;
        column-gap:14px!important;
        padding:8px 10px 11px 10px!important;
        margin-left:auto!important;
      }
      .v20 .v11-about .v11-section-head>img{
        width:54px!important;
        height:54px!important;
        justify-self:end!important;
        align-self:center!important;
      }
      .v20 .v11-about .v11-section-head>div{
        width:auto!important;
        justify-items:end!important;
        min-width:0!important;
      }
    }
  `;
  document.head.append(style);
}

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

function init(){fixYqpHeader();initNewsletter();initTopic()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
