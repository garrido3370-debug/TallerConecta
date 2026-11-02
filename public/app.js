const form = document.querySelector('#form');
const message = document.querySelector('#mensaje');
const list = document.querySelector('#lista');
const euro = cents => new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(cents/100);
const element = (tag, text, className) => { const e=document.createElement(tag); if(text!==undefined)e.textContent=text; if(className)e.className=className; return e; };
async function refresh() {
  try {
    const response=await fetch('/api/solicitudes'); if(!response.ok)throw Error('No se pudieron cargar las solicitudes');
    const records=await response.json(); list.replaceChildren();
    if(!records.length){list.append(element('p','Todavía no hay solicitudes.','muted'));return;}
    for(const r of records){
      const card=element('article',undefined,'item'); const top=element('div',undefined,'itemTop');
      top.append(element('strong',r.matricula),element('span',r.estado.toUpperCase(),'pill '+r.estado));card.append(top);
      card.append(element('p',r.descripcion),element('strong',euro(r.precioCent)+' · IVA incluido'));
      const link=new URL('/cliente?id='+encodeURIComponent(r.id),location.href).href;
      const actions=element('div',undefined,'btns');const copy=element('button','Copiar enlace','btn secondary'); copy.type='button';
      copy.onclick=async()=>{try{await navigator.clipboard.writeText(link);copy.textContent='Enlace copiado';}catch{window.prompt('Copia el enlace del cliente:',link);}};
      const a=element('a','Abrir vista cliente');a.href=link;a.target='_blank';a.rel='noopener';a.style.alignSelf='center';actions.append(copy,a);card.append(actions);
      if(r.decididoEn)card.append(element('p','Respondido: '+new Date(r.decididoEn).toLocaleString('es-ES'),'notice'));
      list.append(card);
    }
  }catch(e){list.replaceChildren(element('p',e.message,'alert error'));}
}
form.addEventListener('submit',async e=>{
  e.preventDefault();message.replaceChildren();
  const str=document.querySelector('#precio').value.replace(',','.'); const cents=Math.round(Number(str)*100);
  if(!Number.isSafeInteger(cents)||cents<1){message.append(element('p','Indica un precio válido.','alert error'));return;}
  try{
    const r=await fetch('/api/solicitudes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({matricula:document.querySelector('#matricula').value,descripcion:document.querySelector('#descripcion').value,precioCent:cents})});
    const data=await r.json();if(!r.ok)throw Error(data.error||'No se pudo crear');
    message.append(element('p','Solicitud creada. Copia el enlace desde la lista de la derecha.','alert'));form.reset();await refresh();
  }catch(err){message.append(element('p',err.message,'alert error'));}
});
document.querySelector('#refresh').addEventListener('click',refresh);refresh();
