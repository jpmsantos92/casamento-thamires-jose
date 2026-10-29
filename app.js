'use strict';
const config=window.WEDDING_CONFIG||{};
let opener=null;
document.querySelectorAll('[data-modal]').forEach(button=>button.addEventListener('click',()=>{opener=button;document.getElementById(button.dataset.modal).showModal();document.body.style.overflow='hidden';}));
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{const r=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))dialog.close();});dialog.addEventListener('close',()=>{document.body.style.overflow='';opener?.focus();});});
const guestFields=document.getElementById('guest-fields');
const addGuest=document.querySelector('.add-guest');
guestFields.addEventListener('input',()=>{addGuest.hidden=![...guestFields.querySelectorAll('input')].every(i=>i.value.trim());});
addGuest.addEventListener('click',()=>{const n=guestFields.children.length+1;const label=document.createElement('label');label.textContent=`Nome completo do convidado ${n} (opcional)`;const input=document.createElement('input');input.name=`guest${n}`;input.maxLength=150;input.placeholder='Nome e sobrenome';label.append(input);guestFields.append(label);input.focus();addGuest.hidden=true;});
function safeURL(value){try{const u=new URL(value,location.href);return u.protocol==='https:'?u.href:null;}catch{return null;}}
if(config.pixQrImage&&safeURL(config.pixQrImage)){const img=new Image();img.src=safeURL(config.pixQrImage);img.alt='QR Code para presentear os noivos via Pix';img.style.width='155px';document.querySelector('.qr-placeholder').replaceWith(img);}
if(config.pixCopyPaste){const button=document.createElement('button');button.className='primary';button.textContent='Copiar código Pix';button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(config.pixCopyPaste);button.textContent='Código copiado';}catch{button.textContent='Não foi possível copiar. Use o QR Code.';}});document.querySelector('.pix').after(button);}
if(config.creditCardUrl&&safeURL(config.creditCardUrl)){const button=document.querySelector('.credit button');button.disabled=false;button.addEventListener('click',()=>window.open(safeURL(config.creditCardUrl),'_blank','noopener'));document.querySelector('.credit small').textContent='Você será direcionado à página de pagamento.';}
for(const [id,type] of [['rsvp-form','rsvp'],['message-form','message']]){
const form=document.getElementById(id),status=form.querySelector('.form-status'),button=form.querySelector('.submit');
if(config.sheetsEndpoint&&safeURL(config.sheetsEndpoint)){button.disabled=false;status.textContent='';}
form.addEventListener('submit',async event=>{event.preventDefault();if(!config.sheetsEndpoint)return;const data=Object.fromEntries(new FormData(form));const payload=type==='rsvp'?{type,names:[...guestFields.querySelectorAll('input')].map(i=>i.value.trim()).filter(Boolean),phone:data.phone.trim()}:{type,name:data.name.trim(),message:data.message.trim()};if(type==='rsvp'&&!/^\+?[\d\s().-]{10,22}$/.test(payload.phone)){status.textContent='Confira o telefone e inclua o DDD.';return;}if(type==='message'&&(!payload.name||!payload.message)){status.textContent='Preencha seu nome e a mensagem.';return;}button.disabled=true;status.textContent='Enviando...';try{const response=await fetch(config.sheetsEndpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload),signal:AbortSignal.timeout(20000)});if(!response.ok)throw Error();const result=await response.json();if(result.ok!==true)throw Error();status.textContent=type==='rsvp'?'Presença confirmada! Esperamos você no nosso grande dia.':'Mensagem enviada! Obrigado pelo carinho.';form.reset();}catch{status.textContent='Não foi possível confirmar o envio. Tente novamente em instantes.';}finally{button.disabled=false;}});
}

// Reveal each content block once as it enters the viewport, without hiding
// content when JavaScript or motion effects are unavailable.
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const targets = document.querySelectorAll(
    '.celebration > p, .date, .when, .actions > button, .story-copy, .polaroids, ' +
    '.guide > header, .dress, .rules > article, .location-inner > *, ' +
    '.closing > p, .closing > h2, .closing > div'
  );
  const activeAnimations = new Set();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (reducedMotion.matches || entry.boundingClientRect.bottom <= 0) continue;
      const parent = entry.target.parentElement;
      const staggered = parent.matches('.actions, .rules, .location-inner') && window.innerWidth > 600;
      const delay = staggered ? Array.from(parent.children).indexOf(entry.target) * 90 : 0;
      const animation = entry.target.animate([
        { opacity: 0, transform: 'translateY(28px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 700, delay, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
      activeAnimations.add(animation);
      animation.finished.then(() => activeAnimations.delete(animation)).catch(() => activeAnimations.delete(animation));
    }
  }, { threshold: 0, rootMargin: '0px 0px -36px 0px' });
  targets.forEach(target => observer.observe(target));
  reducedMotion.addEventListener('change', event => {
    if (!event.matches) return;
    observer.disconnect();
    activeAnimations.forEach(animation => animation.cancel());
    activeAnimations.clear();
  });
})();
