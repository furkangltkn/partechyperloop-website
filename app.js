import {copy,siteConfig} from './content.js';
import {achievements,achievementCopy} from './achievements.js';
const $ = s => document.querySelector(s);
let language = 'en';
try {language = localStorage.getItem('partech-language') === 'tr' ? 'tr' : 'en';} catch {}
const escape = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const localized = value => typeof value === 'object' ? value[language] || value.en || '' : value;
const safeUrl = value => {try {const u = new URL(value,location.href);return ['http:','https:'].includes(u.protocol)?u.href:'#';}catch{return '#';}};
const sections=['home','about','technology','achievements','partners','news'];
const dialog = $('#detail-dialog');
function closeMenu(){ $('#mega-menu').hidden=true;$('.menu-toggle').setAttribute('aria-expanded','false'); }
const eventGallery={images:[
 {src:'assets/event.jpg',alt:{tr:'PARTECH standında prototip üzerine yapılan görüşmeler',en:'Conversations about the prototype at the PARTECH stand'}},
 {src:'assets/event-team-2026-web.jpg',alt:{tr:'PARTECH standı önünde takımımız ve ziyaretçiler',en:'Our team and visitors in front of the PARTECH stand'}}
]};
function carouselMarkup(item,i,modal=false,start=0,kind='achievement'){
 const ac=achievementCopy[language], img=item.images[start];
 const caption=kind==='article'?(language==='tr'?'Etkinlik Fotoğrafları':'Event Photos'):`${ac.gallery} / ${item.year}`;
 const previous=language==='tr'?'Önceki fotoğraf':'Previous photo', next=language==='tr'?'Sonraki fotoğraf':'Next photo';
 const controls=item.images.length>1?`<button class="carousel-arrow previous" data-slide="-1" aria-label="${previous}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg></button><button class="carousel-arrow next" data-slide="1" aria-label="${next}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg></button>`:'';
 const image=`<img src="${img.src}" alt="${escape(localized(img.alt))}" loading="${modal?'eager':'lazy'}">`;
 return `<div class="photo-carousel ${modal?'modal-carousel':''}" data-carousel="${i}" data-kind="${kind}" data-slide-index="${start}" role="region" aria-label="${caption}"><div class="carousel-stage">${modal?image:`<button class="carousel-open" data-${kind}="${i}" aria-label="${ac.photos} · ${kind==='article'?caption:item.year}">${image}</button>`}${controls}</div><div class="carousel-caption"><span>${caption}</span><span class="carousel-status" aria-live="polite" aria-atomic="true">${start+1} / ${item.images.length}</span></div></div>`;
}
const photoCache=new Map();
function loadPhoto(src){
 if(!photoCache.has(src)){
  const image=new Image();image.decoding='async';
  const ready=new Promise((resolve,reject)=>{image.onload=()=>resolve(image);image.onerror=reject;});
  image.src=src;
  const promise=ready.then(async()=>{await image.decode();return image;}).catch(error=>{photoCache.delete(src);throw error;});
  photoCache.set(src,promise);
 }
 return photoCache.get(src);
}
function carouselItem(carousel){return carousel.dataset.kind==='article'?eventGallery:achievements[Number(carousel.dataset.carousel)];}
const preloadObserver=new IntersectionObserver(entries=>{
 for(const entry of entries)if(entry.isIntersecting){
  carouselItem(entry.target).images.forEach(photo=>{loadPhoto(photo.src).catch(()=>{});});
  preloadObserver.unobserve(entry.target);
 }
},{rootMargin:'350px'});
async function moveSlide(carousel,step){
 const item=carouselItem(carousel);
 const index=(Number(carousel.dataset.requestedIndex??carousel.dataset.slideIndex)+step+item.images.length)%item.images.length;
 carousel.dataset.requestedIndex=index;
 const request=String(Number(carousel.dataset.request||0)+1);carousel.dataset.request=request;
 carousel.setAttribute('aria-busy','true');
 try{
  const ready=await loadPhoto(item.images[index].src);
  if(carousel.dataset.request!==request||!carousel.isConnected)return;
  const img=ready.cloneNode();img.alt=localized(item.images[index].alt);img.loading='eager';
  carousel.querySelector('img').replaceWith(img);
  carousel.dataset.slideIndex=index;
  carousel.querySelector('.carousel-status').textContent=`${index+1} / ${item.images.length}`;
 }catch{
  if(carousel.dataset.request===request){
   carousel.dataset.requestedIndex=carousel.dataset.slideIndex;
   carousel.querySelector('.carousel-status').textContent=language==='tr'?'Yüklenemedi · Tekrar deneyin':'Could not load · Try again';
  }
 }finally{if(carousel.dataset.request===request)carousel.removeAttribute('aria-busy');}
}
function render(){
 const t=copy[language];document.documentElement.lang=language;
 document.title=language==='en'?'PARTECH Hyperloop — Engineering the Future of Mobility':'PARTECH Hyperloop — Ulaşımın Geleceğini Tasarlıyoruz';
 document.querySelector('meta[name="description"]').content=t.heroText;
 document.querySelectorAll('[data-t]').forEach(el=>{el.textContent=t[el.dataset.t]||'';});
 $('.desktop-nav').innerHTML=sections.map(id=>`<a href="#${id}">${t[id]}</a>`).join('');
 $('#language').innerHTML=language==='en'?'EN <span>/ TR</span>':'TR <span>/ EN</span>';
 $('#language').setAttribute('aria-label',language==='en'?'Türkçe diline geç':'Switch to English');
 $('.menu-toggle').setAttribute('aria-label',language==='en'?'Toggle navigation':'Menüyü aç veya kapat');
 $('#mega-menu').innerHTML=[['about',[['about','story'],['team','team'],['contact','join']]],['technology',[['technology','technology'],['achievements','achievements']]],['partners',[['partners','partners'],['contact','opportunities']]],['news',[['news','updates'],['contact','contact']]]].map(([label,links])=>`<div><strong>${t[label]}</strong>${links.map(([id,key])=>`<a href="#${id}">${t[key]}</a>`).join('')}</div>`).join('');
 $('#disciplines').innerHTML=t.disciplines.map(([title,text])=>`<article class="discipline"><h3>${title}</h3><p>${text}</p></article>`).join('');
 const ac=achievementCopy[language];
 $('#achievement-summary').innerHTML=`<strong>${ac.since}</strong><span>${ac.finals}</span>`;
 $('#milestones').innerHTML=achievements.map((item,i)=>`<li class="achievement-row ${item.images.length?'':'text-only'}"><div class="achievement-year"><time datetime="${item.year}">${item.year}</time></div><article class="achievement-entry"><div class="achievement-copy"><p class="eyebrow">${ac.event}</p><h3>${escape(localized(item.title))}</h3><p>${escape(localized(item.text))}</p><ul class="award-tags">${item.awards.map(a=>`<li>${escape(localized(a))}</li>`).join('')}</ul>${item.images.length?`<button class="text-link" data-achievement="${i}">${ac.photos}<span class="photo-count">${String(item.images.length).padStart(2,'0')}</span><span class="sr-only"> · ${item.year}</span></button>`:''}</div>${item.images.length?carouselMarkup(item,i):''}</article></li>`).join('');
 $('#news-list').innerHTML=t.articles.map(([img,label,title,text],i)=>`<article class="card">${i===0?carouselMarkup(eventGallery,i,false,0,'article'):`<img src="${img}" alt="${escape(title)}" loading="lazy" width="640" height="420">`}<div class="card-content"><p class="eyebrow">${label}</p><h3>${title}</h3><p>${text}</p><button class="text-link" data-article="${i}">${t.readMore}<span class="sr-only">: ${title}</span></button></div></article>`).join('');
 const sponsorLogo=p=>`<li class="sponsor-logo${p.padded?' sponsor-padded':''}"><img src="${escape(safeUrl(p.logo))}" alt="${escape(p.name)}" loading="lazy" decoding="async"></li>`;
 $('#partner-list').innerHTML=`<ul class="sponsors-featured">${siteConfig.partners.filter(p=>p.featured).map(sponsorLogo).join('')}</ul><ul class="sponsors-grid">${siteConfig.partners.filter(p=>!p.featured).map(sponsorLogo).join('')}</ul>`;
 const email=siteConfig.contactEmail.trim();
 const mailIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>';
 const instagramIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>';
 $('#contact-box').innerHTML=email?`<div class="contact-email"><span class="contact-icon">${mailIcon}</span><div><h3>${t.emailUs}</h3><p>${t.contactPrompt}</p><a class="email-address" href="mailto:${escape(email)}">${escape(email)} <span aria-hidden="true">↗</span></a></div></div>`:`<p>${t.contactPending}</p>`;
 if(siteConfig.instagramUrl)$('#contact-box').insertAdjacentHTML('beforeend',`<a class="contact-social" href="${escape(safeUrl(siteConfig.instagramUrl))}" target="_blank" rel="noopener noreferrer"><span class="contact-icon">${instagramIcon}</span><span class="social-copy"><strong>${t.followUs}</strong><span>${t.followText}</span><span class="instagram-handle">@partechyperloop</span></span><span class="social-arrow" aria-hidden="true">↗</span></a>`);
 if(siteConfig.partnershipDeck)$('#contact-box').insertAdjacentHTML('beforeend',`<a class="button navy" href="${escape(safeUrl(siteConfig.partnershipDeck))}" download>${t.downloadDeck}</a>`);
 $('#year').textContent=new Date().getFullYear();
 preloadObserver.disconnect();document.querySelectorAll('[data-carousel]').forEach(el=>preloadObserver.observe(el));
}
$('#language').addEventListener('click',()=>{language=language==='en'?'tr':'en';try{localStorage.setItem('partech-language',language);}catch{}dialog.close();render();});
$('.menu-toggle').addEventListener('click',()=>{const open=$('#mega-menu').hidden;$('#mega-menu').hidden=!open;$('.menu-toggle').setAttribute('aria-expanded',String(open));});
document.addEventListener('click',e=>{if(e.target.closest('#mega-menu a'))closeMenu();if(!e.target.closest('.header'))closeMenu();const button=e.target.closest('[data-article]');if(button){const i=Number(button.dataset.article);const [img,label,title,intro,body]=copy[language].articles[i];const start=Number(button.closest('.card')?.querySelector('[data-carousel]')?.dataset.slideIndex||0);dialog.classList.toggle('gallery-dialog',i===0);$('#dialog-content').innerHTML=`<p class="eyebrow">${label}</p><h2 id="dialog-title">${title}</h2>${i===0?carouselMarkup(eventGallery,i,true,start,'article'):`<img src="${img}" alt="${escape(title)}">`}<p>${intro}</p><p>${body}</p>`;dialog.showModal();}});
document.addEventListener('keydown',e=>{if(e.key==='Escape' && !$('#mega-menu').hidden){closeMenu();$('.menu-toggle').focus();}});
$('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
render();
const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){document.querySelectorAll('.desktop-nav a').forEach(a=>{const active=a.hash==='#'+entry.target.id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}},{rootMargin:'-15% 0px -65% 0px',threshold:0});
sections.forEach(id=>observer.observe(document.getElementById(id)));

// Native dialog keeps focus inside the gallery and supports Escape to close.
document.addEventListener('click',e=>{
 const arrow=e.target.closest('[data-slide]');
 if(arrow){moveSlide(arrow.closest('[data-carousel]'),Number(arrow.dataset.slide));return;}
 const button=e.target.closest('[data-achievement]');
 if(!button)return;
 const i=Number(button.dataset.achievement), item=achievements[i];
 const carousel=button.closest('.achievement-entry').querySelector('[data-carousel]');
 const start=Number(carousel?.dataset.slideIndex||0);
 const ac=achievementCopy[language];
 dialog.classList.add('gallery-dialog');
 $('#dialog-content').innerHTML=`<p class="eyebrow">${item.year} · ${ac.gallery}</p><h2 id="dialog-title">${escape(localized(item.title))}</h2>${carouselMarkup(item,i,true,start)}`;
 dialog.showModal();
});
document.addEventListener('keydown',e=>{
 if(!['ArrowLeft','ArrowRight'].includes(e.key))return;
 const carousel=dialog.open&&dialog.classList.contains('gallery-dialog')?dialog.querySelector('[data-carousel]'):e.target.closest('[data-carousel]');
 if(carousel){e.preventDefault();moveSlide(carousel,e.key==='ArrowLeft'?-1:1);}
});
