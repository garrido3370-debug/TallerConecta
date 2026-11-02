const target=document.querySelector('#contenido');
const id=new URLSearchParams(location.search).get('id');
const el=(tag,text,className)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(className)n.className=className;return n;};
const euro=c=>new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(c/100);
async function load(){
  try{
    if(!/^[a-f0-9]{40}$/.test(id||''))throw Error('El enlace no es válido.');
    const response=await fetch('/api/cliente/'+id);const record=await response.json();if(!response.ok)throw Error(record.error);
    target.replaceChildren();target.append(el('h2','Vehículo: '+record.matricula),el('p',record.descripcion),el('p','Importe total con IVA incluido','muted'),el('p',euro(record.precioCent),'price'));
    if(record.estado!=='pendiente'){
      target.append(el('p','Estado: '+(record.estado==='aprobado'?'APROBADO':'RECHAZADO'),'alert'));
      target.append(el('p','Decisión registrada: '+new Date(record.decididoEn).toLocaleString('es-ES'),'notice'));return;
    }
    target.append(el('p','¿Autorizas esta reparación adicional por el importe indicado?'));
    const buttons=el('div',undefined,'btns');
    for(const [value,label,cls] of [['aprobado','Aprobar presupuesto','btn approve'],['rechazado','Rechazar presupuesto','btn reject']]){
      const b=el('button',label,cls);b.type='button';b.onclick=async()=>{
        if(!confirm(`¿Confirmas que deseas ${value==='aprobado'?'APROBAR':'RECHAZAR'} el presupuesto de ${euro(record.precioCent)} (IVA incluido)?`))return;
        buttons.querySelectorAll('button').forEach(x=>x.disabled=true);
        try{const res=await fetch('/api/cliente/'+id+'/decision',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({estado:value})});const data=await res.json();if(!res.ok)throw Error(data.error||'No se pudo registrar');await load();}
        catch(err){target.append(el('p',err.message,'alert error'));buttons.querySelectorAll('button').forEach(x=>x.disabled=false);}
      };buttons.append(b);
    }
    target.append(buttons);
  }catch(err){target.replaceChildren(el('p',err.message,'alert error'));}
}
load();
