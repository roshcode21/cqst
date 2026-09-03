(()=>{
'use strict';
const $=(s,c=document)=>c.querySelector(s);
const form=$('#v17TopicForm');
if(!form)return;
form.addEventListener('submit',e=>{
  e.preventDefault();
  e.stopImmediatePropagation();
  if(!form.reportValidity())return;
  const name=$('#v17Name')?.value.trim()||'';
  const email=$('#v17From')?.value.trim()||'';
  const topic=$('#v17TopicText')?.value.trim()||'';
  const subject=`CQST LAB · Propuesta de tema · ${topic.replace(/\s+/g,' ').slice(0,58)}`;
  const body=[
    'NUEVA PROPUESTA DE TEMA',
    'Cada quien su tema · laboratorio V18',
    '',
    `Nombre: ${name}`,
    `Correo: ${email}`,
    '',
    'TEMA',
    topic,
    '',
    `Página: ${location.href}`,
    `Responder a: ${email}`
  ].join('\n');
  const dialog=$('#topicDialog');
  if(dialog?.open)dialog.close('submit');
  location.href=`mailto:rodo.raudales@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
},true);
})();
