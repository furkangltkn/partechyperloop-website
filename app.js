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
 {src:'assets/event.jpg',caption:{"tr": "Karabük Üniversitesi Rektörümüz Prof. Dr. Fatih Kırışık standımızı ziyaret ederek takımımızla bir araya geldi.", "en": "Prof. Dr. Fatih Kırışık, Rector of Karabük University, visited our stand and met our team."},alt:{tr:'PARTECH standında prototip üzerine yapılan görüşmeler',en:'Conversations about the prototype at the PARTECH stand'}},
 {src:'assets/event-kacir.jpg',caption:{tr:'Sanayi ve Teknoloji Bakanı Mehmet Fatih Kacır, TEKNOFEST 2026’da takımımızı ziyaret etti. Ziyaret sırasında kendisine Hyperloop prototipimizi tanıttık.',en:'Mehmet Fatih Kacır, Minister of Industry and Technology, visited our team at TEKNOFEST 2026. We introduced him to our Hyperloop prototype during the visit.'},alt:{tr:'Tünel girişinde takım üyelerimizle Bakan Kacır',en:'Minister Kacır with our team members at the tunnel entrance'}},
 {src:'assets/event-team-2026-web.jpg',caption:{"tr": "T.C. Sanayi ve Teknoloji Bakan Yardımcısı Muhammet Kasım Gönüllü’yü TEKNOFEST 2026 Hyperloop Geliştirme Yarışması’ndaki standımızda ağırladık.", "en": "We welcomed Muhammet Kasım Gönüllü, Türkiye’s Deputy Minister of Industry and Technology, to our stand at the TEKNOFEST 2026 Hyperloop Development Competition."},alt:{tr:'PARTECH standı önünde takımımız ve ziyaretçiler',en:'Our team and visitors in front of the PARTECH stand'}},
 {src:'assets/event-prototype-visitors.jpg',caption:{"tr": "Millî Teknoloji Atölyemizde düzenlediğimiz gezide minik ziyaretçilerimiz Hyperloop prototipimizi yakından inceledi.", "en": "During a tour of our National Technology Workshop, our young visitors took a close look at the Hyperloop prototype."},alt:{tr:'Ziyaretçiler mavi Hyperloop prototipini inceliyor',en:'Visitors examining the blue Hyperloop prototype'}},
 {src:'assets/event-energy-station.jpg',caption:{"tr": "Atölye gezisinden bir başka karede, minik misafirlerimiz prototipimizin yanındaki enerji istasyonunda bir arada.", "en": "Another moment from the workshop tour shows our young visitors gathered at the energy station beside the prototype."},alt:{tr:'Enerji istasyonundaki öğrenciler ve prototip',en:'Students and the prototype at the energy station'}}
]};
const podPhotos=[...document.querySelectorAll('.pod-stage img')].map(img=>({src:img.getAttribute('src'),alt:img.alt}));
const competitionGallery={images:[
 {src:'assets/competition-group.jpg',alt:{tr:'Hyperloop yarışması alanında toplu fotoğraf',en:'Group photo at the Hyperloop competition'}},
 {src:'assets/competition-inspection.jpg',alt:{tr:'Kapsülün yapısal ve mekanik kontrolü sırasında PARTECH ekibi',en:'The PARTECH team during the structural and mechanical pod inspection'}},
 ...achievements.find(item=>item.year===2026).images.slice(1),
 {src:'assets/competition-tunnel-preparation.jpg',alt:{tr:'Tünel girişinde mavi Hyperloop prototipinin hazırlığı',en:'Preparing the blue Hyperloop prototype at the tunnel entrance'}}
]};
const articleGalleries=[eventGallery,{images:podPhotos},competitionGallery];
function carouselMarkup(item,i,modal=false,start=0,kind='achievement'){
 const ac=achievementCopy[language], img=item.images[start];
 const caption=kind==='article'?(language==='tr'?'Fotoğraflar':'Photos'):`${ac.gallery} / ${item.year}`;
 const previous=language==='tr'?'Önceki fotoğraf':'Previous photo', next=language==='tr'?'Sonraki fotoğraf':'Next photo';
 const controls=item.images.length>1?`<button class="carousel-arrow previous" data-slide="-1" aria-label="${previous}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg></button><button class="carousel-arrow next" data-slide="1" aria-label="${next}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg></button>`:'';
 const image=`<img src="${img.src}" alt="${escape(localized(img.alt))}" loading="${modal?'eager':'lazy'}">`;
 return `<div class="photo-carousel ${modal?'modal-carousel':''}" data-carousel="${i}" data-kind="${kind}" data-slide-index="${start}" role="region" aria-label="${caption}"><div class="carousel-stage">${modal?image:`<button class="carousel-open" data-${kind}="${i}" aria-label="${ac.photos} · ${kind==='article'?caption:item.year}">${image}</button>`}${controls}</div>${kind==='achievement'&&item.images.length>1?`<div class="carousel-thumbnails" role="group" aria-label="${ac.photos}">${item.images.map((photo,n)=>`<button type="button" data-photo-index="${n}" aria-label="${escape(localized(photo.alt))}" aria-pressed="${n===start}"><img src="${photo.src}" alt="" loading="lazy" decoding="async"><span>${String(n+1).padStart(2,'0')}</span></button>`).join('')}</div>`:''}<div class="carousel-caption"><span>${caption}</span><span class="carousel-status" aria-live="polite" aria-atomic="true">${start+1} / ${item.images.length}</span></div>${modal && img.caption ? `<p class="event-photo-caption">${escape(localized(img.caption))}</p>` : ''}</div>`;
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
function carouselItem(carousel){return carousel.dataset.kind==='article'?articleGalleries[Number(carousel.dataset.carousel)]:achievements[Number(carousel.dataset.carousel)];}
const preloadObserver=window.IntersectionObserver && new IntersectionObserver(entries=>{
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
  const stage=carousel.querySelector('.carousel-stage');
  stage.querySelectorAll('.carousel-outgoing').forEach(el=>el.remove());
  const previous=stage.querySelector('img');
  const outgoing=previous.cloneNode();
  previous.replaceWith(img);
  if(!motionPreference.matches && img.animate){
   outgoing.classList.add('carousel-outgoing');outgoing.alt='';outgoing.setAttribute('aria-hidden','true');
   stage.append(outgoing);

   img.animate([{opacity:0,transform:'scale(1.03)'},{opacity:1,transform:'scale(1)'}],{duration:420,easing:'cubic-bezier(.4,0,.2,1)'});
   outgoing.animate([{opacity:1},{opacity:0}],{duration:420,easing:'cubic-bezier(.4,0,.2,1)'}).finished.then(()=>outgoing.remove()).catch(()=>outgoing.remove());
  }
  carousel.querySelectorAll('[data-photo-index]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.photoIndex)===index)));
  const caption=carousel.querySelector('.event-photo-caption');
  if(caption)caption.textContent=localized(item.images[index].caption);
  carousel.dataset.slideIndex=index;
  carousel.querySelector('.carousel-status').textContent=`${index+1} / ${item.images.length}`;
 }catch{
  if(carousel.dataset.request===request){
   carousel.dataset.requestedIndex=carousel.dataset.slideIndex;
   carousel.querySelector('.carousel-status').textContent=language==='tr'?'Yüklenemedi · Tekrar deneyin':'Could not load · Try again';
  }
 }finally{if(carousel.dataset.request===request)carousel.removeAttribute('aria-busy');}
}
const yearNav=$('#year-navigation');
let seasonScenes=[];
function updateSeasons(){
 const threshold=innerHeight*.54;
 let selected=0;
 seasonScenes.forEach(({scene,frame},i)=>{
  const bounds=scene.getBoundingClientRect();
  if(bounds.top<=threshold)selected=i;
  if(bounds.bottom<0||bounds.top>innerHeight)return;
  if(motionPreference.matches)return;
  // Finish each reveal before its content reaches the reading area.
  const arrival=progress((innerHeight-bounds.top)/Math.max(1,innerHeight*.68));
  const ease=t=>1-(1-t)**3;
  const year=ease(progress(arrival*1.7));
  const sweep=progress((arrival-.10)/.78);
  const photo=sweep*sweep*(3-2*sweep);
  const copy=ease(progress((arrival-.22)/.78));
  const exit=progress((threshold-bounds.bottom)/threshold);
  frame.style.setProperty('--year-rise',(1-year)*75+'px');
  frame.style.setProperty('--year-track',(-.07+(1-year)*.15)+'em');
  frame.style.setProperty('--rule',year);
  frame.style.setProperty('--curtain',(1-photo)*100+'%');
  frame.style.setProperty('--edge-alpha',Math.min(1,photo*14,(1-photo)*14));
  frame.style.setProperty('--digit-offset',(1-photo)*-50+'%');
  frame.style.setProperty('--photo-rise',(1-photo)*36+'px');
  frame.style.setProperty('--copy-rise',(1-copy)*48+'px');
  frame.style.setProperty('--copy-alpha',copy);
  frame.style.setProperty('--exit-scale',1-exit*.08);
 });
 for(const [i,link] of [...yearNav.children].entries()){
  if(i===selected)link.setAttribute('aria-current','date');
  else link.removeAttribute('aria-current');
 }
 yearNav.style.setProperty('--season',selected);
}
function seasonDate(year,index){
 const digits=String(year);
 if(index===0)return `<time datetime="${year}">${year}</time>`;
 const previous=String(achievements[index-1].year);
 return `<time datetime="${year}"><span class="sr-only">${year}</span><span class="season-dial" aria-hidden="true">${digits.slice(0,-1)}<span class="digit-window"><span class="digit-strip"><span>${digits.at(-1)}</span><span>${previous.at(-1)}</span></span></span></span></time>`;
}
const systemIds=['mechanical','electronic','electromechanical','software-control'];
function render(){
 const t=copy[language];document.documentElement.lang=language;
 document.title=language==='en'?'PARTECH Hyperloop | Official Website':'PARTECH Hyperloop | Resmî Web Sitesi';
 document.querySelector('meta[name="description"]').content=language==='en'?'PARTECH Hyperloop official website: our Hyperloop prototype, engineering team, TEKNOFEST achievements and sponsors. Contact us at partechyperloop.com.':'PARTECH Hyperloop resmî web sitesi: Hyperloop prototipimiz, mühendislik ekibimiz, TEKNOFEST başarılarımız ve sponsorlarımız. İletişim: partechyperloop.com.';
 document.querySelectorAll('[data-t]').forEach(el=>{el.textContent=t[el.dataset.t]||'';});
 $('.desktop-nav').innerHTML=sections.map(id=>`<a href="#${id}">${t[id]}</a>`).join('');
 $('#language').innerHTML=language==='en'?'EN <span>/ TR</span>':'TR <span>/ EN</span>';
 $('#language').setAttribute('aria-label',language==='en'?'Türkçe diline geç':'Switch to English');
 $('.menu-toggle').setAttribute('aria-label',language==='en'?'Toggle navigation':'Menüyü aç veya kapat');
 $('#mega-menu').innerHTML=[['about',[['about','story'],['team','team'],['contact','join']]],['technology',[['technology','technology'],['achievements','achievements']]],['partners',[['partners','partners'],['contact','opportunities']]],['news',[['news','updates'],['contact','contact']]]].map(([label,links])=>`<div><strong>${t[label]}</strong>${links.map(([id,key])=>`<a href="#${id}">${t[key]}</a>`).join('')}</div>`).join('');
 $('.system-nav').setAttribute('aria-label',language==='tr'?'Prototip sistemleri':'Prototype systems');
 $('.system-links').innerHTML=t.disciplines.map(([title],i)=>
  `<a href="#system-${systemIds[i]}"><span>${escape(title)}</span><span class="system-arrow" aria-hidden="true">↘</span></a>`
 ).join('');
 $('#disciplines').innerHTML=t.disciplines.map(([title,text],i)=>`<article class="discipline" id="system-${systemIds[i]}" tabindex="-1"><h3>${title}</h3><p>${text}</p></article>`).join('');
 const ac=achievementCopy[language];
 $('#achievement-summary').innerHTML=`<strong>${ac.since}</strong><span>${ac.finals}</span>`;
 yearNav.innerHTML=achievements.map(({year})=>`<a href="#year-${year}">${year}</a>`).join('');
 $('#milestones').innerHTML=achievements.map((item,i)=>`<section id="year-${item.year}" class="season-scene" aria-labelledby="title-${item.year}"><div class="achievement-row ${item.images.length?'':'text-only'}"><div class="achievement-year">${seasonDate(item.year,i)}</div><article class="achievement-entry"><div class="achievement-copy"><p class="eyebrow">${item.event?escape(localized(item.event)):ac.event}</p><h3 id="title-${item.year}">${escape(localized(item.title))}</h3><p>${escape(localized(item.text))}</p>${item.images.length?`<button class="text-link" data-achievement="${i}">${ac.photos}<span class="photo-count">${String(item.images.length).padStart(2,'0')}</span><span class="sr-only"> · ${item.year}</span></button>`:''}</div>${item.images.length?carouselMarkup(item,i):''}</article></div></section>`).join('');
 seasonScenes=[...$('#milestones').children].map(scene=>({scene,frame:scene.firstElementChild}));
 $('#news-list').innerHTML=t.articles.map(([img,label,title,text],i)=>`<article class="card">${carouselMarkup(articleGalleries[i],i,false,0,'article')}<div class="card-content"><p class="eyebrow">${label}</p><h3>${title}</h3><p>${text}</p><button class="text-link" data-article="${i}">${t.readMore}<span class="sr-only">: ${title}</span></button></div></article>`).join('');
 const sponsorLogo=p=>`<li class="sponsor-logo${p.padded?' sponsor-padded':''}"><img src="${escape(safeUrl(p.logo))}" alt="${escape(p.name)}" loading="lazy" decoding="async"></li>`;
 $('#partner-list').innerHTML=`<ul class="sponsors-featured">${siteConfig.partners.filter(p=>p.featured).map(sponsorLogo).join('')}</ul><ul class="sponsors-grid">${siteConfig.partners.filter(p=>!p.featured).map(sponsorLogo).join('')}</ul>`;
 const email=siteConfig.contactEmail.trim();
 const mailIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>';
 const instagramIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>';
 $('#contact-box').innerHTML=email?`<div class="contact-email"><span class="contact-icon">${mailIcon}</span><div><h3>${t.emailUs}</h3><p>${t.contactPrompt}</p><a class="email-address" href="mailto:${escape(email)}">${escape(email)} <span aria-hidden="true">↗</span></a></div></div>`:`<p>${t.contactPending}</p>`;
 if(siteConfig.instagramUrl)$('#contact-box').insertAdjacentHTML('beforeend',`<a class="contact-social" href="${escape(safeUrl(siteConfig.instagramUrl))}" target="_blank" rel="noopener noreferrer"><span class="contact-icon">${instagramIcon}</span><span class="social-copy"><strong>${t.followUs}</strong><span>${t.followText}</span><span class="instagram-handle">@partechyperloop</span></span><span class="social-arrow" aria-hidden="true">↗</span></a>`);
 if(siteConfig.partnershipDeck)$('#contact-box').insertAdjacentHTML('beforeend',`<a class="button navy" href="${escape(safeUrl(siteConfig.partnershipDeck))}" download>${t.downloadDeck}</a>`);
 $('#year').textContent=new Date().getFullYear();
 preloadObserver?.disconnect();document.querySelectorAll('[data-carousel]').forEach(el=>preloadObserver?.observe(el));
}
$('#language').addEventListener('click',()=>{language=language==='en'?'tr':'en';try{localStorage.setItem('partech-language',language);}catch{}dialog.close();languageChanged=true;render();refreshMotion(true);invalidate();});
matchMedia('(min-width:1001px)').addEventListener('change',closeMenu);
$('.menu-toggle').addEventListener('click',()=>{const open=$('#mega-menu').hidden;$('#mega-menu').hidden=!open;$('.menu-toggle').setAttribute('aria-expanded',String(open));});
document.addEventListener('click',e=>{if(e.target.closest('#mega-menu a'))closeMenu();if(!e.target.closest('.header'))closeMenu();const button=e.target.closest('[data-article]');if(button){const i=Number(button.dataset.article);const [img,label,title,intro,body]=copy[language].articles[i];const start=Number(button.closest('.card')?.querySelector('[data-carousel]')?.dataset.slideIndex||0);dialog.classList.add('gallery-dialog');$('#dialog-content').innerHTML=`<p class="eyebrow">${label}</p><h2 id="dialog-title">${title}</h2>${carouselMarkup(articleGalleries[i],i,true,start,'article')}${articleGalleries[i] === eventGallery ? '' : `<p>${intro}</p>${body ? `<p>${body}</p>` : ''}`}`;dialog.showModal();}});
document.addEventListener('keydown',e=>{if(e.key==='Escape' && !$('#mega-menu').hidden){closeMenu();$('.menu-toggle').focus();}});
$('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
render();
const observer=window.IntersectionObserver && new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){document.querySelectorAll('.desktop-nav a').forEach(a=>{const active=a.hash==='#'+entry.target.id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}},{rootMargin:'-15% 0px -65% 0px',threshold:0});
sections.forEach(id=>observer?.observe(document.getElementById(id)));

// Native dialog keeps focus inside the gallery and supports Escape to close.
document.addEventListener('click',e=>{
 const thumbnail=e.target.closest('[data-photo-index]');
 if(thumbnail){const carousel=thumbnail.closest('[data-carousel]');const step=Number(thumbnail.dataset.photoIndex)-Number(carousel.dataset.requestedIndex??carousel.dataset.slideIndex);if(step)moveSlide(carousel,step);return;}
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

// Visible by default: enhancements run only after a supported viewport trigger.
const motionPreference = window.matchMedia?.('(prefers-reduced-motion: reduce)') ?? {matches:true};
const canMask = window.CSS?.supports('clip-path','inset(0)');
const header=$('.header'), hero=$('.hero'), banner=$('.team-banner'), pod=$('.pod-photo');
let revealObserver, layout, raf=0, dirty=true, lastChapter, languageChanged=false;
const progress=(n)=>Math.max(0,Math.min(1,n));
function reveal(el){
 if(el.matches('h1,h2')){
  const words=[...el.querySelectorAll('.word')];
  const tops=words.map(w=>w.offsetTop);
  let line=0;
  words.forEach((w,i)=>{if(i&&tops[i]!==tops[i-1])line++;w.style.setProperty('--line',line);});
 }
 el.classList.add('entering');
}
function refreshMotion(complete=false){
 revealObserver?.disconnect();
 const targets=[];
 function mark(selector,kind,threshold){
  document.querySelectorAll(selector).forEach((el,i)=>{
   el.classList.remove('entering');el.dataset.reveal=kind;el.dataset.threshold=threshold;
   el.style.setProperty('--order',kind==='sponsor'?i%3:kind==='news'?i:0);
   targets.push(el);
  });
 }
 mark('main h1,main h2','title',.2);
 mark('main .eyebrow','label',.2);
 mark('.hero-visual','hero',0);mark('.pod-photo picture','pod',.2);
 mark('.about-photo picture','about',.25);mark('.team-banner picture','banner',.3);

 mark('.card','news',.2);mark('.sponsor-logo','sponsor',.25);mark('.hero .actions,.hero-facts','entry',0);
 document.querySelectorAll('main h1,main h2').forEach(h=>{
  const title=h.textContent.trim();
  if(!title||h.querySelector('.word'))return;
  const frag=document.createDocumentFragment();
  title.split(/\s+/).forEach((word,i)=>{if(i)frag.append(' ');const wrap=document.createElement('span'),inner=document.createElement('span');
   wrap.className='word';inner.textContent=word;wrap.append(inner);frag.append(wrap);});h.replaceChildren(frag);
 });
 if(complete||languageChanged||motionPreference.matches||!canMask||!window.IntersectionObserver)return;
 revealObserver=new IntersectionObserver(entries=>{for(const entry of entries){
  if(!entry.isIntersecting||entry.intersectionRatio+.001<Number(entry.target.dataset.threshold))continue;
  revealObserver.unobserve(entry.target);
  if(entry.target.dataset.reveal==='hero'){
   const photo=entry.target.querySelector('img');(photo.decode?.()??Promise.resolve()).catch(()=>{}).then(()=>{
    if(!languageChanged&&!motionPreference.matches&&window.scrollY<innerHeight)reveal(entry.target);
   });
  }else reveal(entry.target);
 }},{threshold:[0,.15,.2,.25,.3]});
 targets.forEach(el=>revealObserver.observe(el));
}
function measure(){
 const y=scrollY,abs=el=>el.getBoundingClientRect().top+y;
 const chapters=[...document.querySelectorAll('.discipline')];
 layout={range:document.documentElement.scrollHeight-innerHeight, vh:innerHeight,mobile:innerWidth<=640,
 team:abs(banner),teamH:banner.offsetHeight,chapters,
 chapterPoints:chapters.map(el=>abs(el)+el.offsetHeight/2),
 about:abs($('.about-photo'))};
 lastChapter=-1;dirty=false;
}
function updateScrollMotion(){
 raf=0;if(dirty||!layout)measure();
 updateSeasons();
 const l=layout,y=scrollY, center=y+l.vh*.55, moving=!motionPreference.matches&&!l.mobile;
 header.style.setProperty('--page-progress',progress(y/(l.range||1)));header.classList.toggle('scrolled',y>24);
 hero.style.setProperty('--hero-shift',moving?Math.min(24,y*.05)+'px':'0px');
 hero.style.setProperty('--hero-scale',moving?1+.08*(1-progress(y/l.vh)):1);
 $('.about-photo').style.setProperty('--about-shift',moving?(progress((center-l.about)/l.vh)-.5)*12+'px':'0px');
 banner.style.setProperty('--team-scale',moving?1.08-.08*progress((y+l.vh-l.team)/(l.vh+l.teamH)):l.mobile?1.03:1);
 const chapter=l.chapterPoints.reduce((best,v,i,arr)=>Math.abs(v-center)<Math.abs(arr[best]-center)?i:best,0);
 if(chapter!==lastChapter){lastChapter=chapter;pod.dataset.chapter=String(chapter+1).padStart(2,'0');l.chapters.forEach((el,i)=>el.classList.toggle('is-current',i===chapter));}
}
function queueScrollMotion(){if(!raf)raf=requestAnimationFrame(updateScrollMotion);}
function invalidate(){dirty=true;queueScrollMotion();}
addEventListener('scroll',queueScrollMotion,{passive:true});addEventListener('resize',invalidate,{passive:true});
if(window.ResizeObserver)new ResizeObserver(invalidate).observe(document.body);
document.fonts?.ready.then(invalidate);
motionPreference.addEventListener?.('change',()=>{refreshMotion(true);invalidate();});
refreshMotion();updateScrollMotion();

function initPodGallery(){
 const slides=[...pod.querySelector('.pod-stage').children];
 const controls=pod.querySelector('.pod-controls');
 let index=0;
 for(const img of pod.querySelectorAll('.pod-stage img'))img.loading='eager';
 function labels(){
  const tr=document.documentElement.lang==='tr';
  controls.querySelector('[data-step="-1"]').setAttribute('aria-label',tr?'Önceki fotoğraf':'Previous photo');
  controls.querySelector('[data-step="1"]').setAttribute('aria-label',tr?'Sonraki fotoğraf':'Next photo');
 }
 function advance(step){
  const next=(index+step+slides.length)%slides.length;
  const img=slides[next].matches('picture')?slides[next].querySelector('img'):slides[next];
  if(!img.complete||!img.naturalWidth)return;
  slides[index].setAttribute('aria-hidden','true');
  index=next;
  slides[index].setAttribute('aria-hidden','false');
  controls.querySelector('.pod-count').textContent=(index+1)+' / '+slides.length;
 }
 controls.addEventListener('click',event=>{
  const button=event.target.closest('button');
  if(!button)return;
  advance(Number(button.dataset.step));
 });
 new MutationObserver(labels).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 labels();
 return advance;
}
const advancePod=initPodGallery();

// Preserve each section's responsive opening image when the slideshow loops.
const teamPhotoRotations=[
 ['.team-banner img', achievements[0].images[1]]
].map(([selector,alternate])=>{
 const img=$(selector);
 const source=img.closest('picture')?.querySelector('source');
 const original=img.cloneNode();
 let showingAlternate=false;
 return async function rotate(){
  const next=showingAlternate?original:await loadPhoto(alternate.src);
  if(document.hidden || motionPreference.matches)return;
  showingAlternate=!showingAlternate;
  if(source)source.media=showingAlternate?'not all':'all';
  img.src=next.src;
  if(next.srcset)img.srcset=next.srcset;
  else img.removeAttribute('srcset');
  img.alt=showingAlternate?localized(alternate.alt):original.alt;
  const caption=img.closest('figure')?.querySelector('figcaption');
  if(caption){
   caption.dataset.t=showingAlternate?'standCaption':'teamCaption';
   caption.textContent=copy[language][caption.dataset.t];
  }
 };
});
// Decode gallery frames ahead of the shared tick, including offscreen sections.
function prepareGalleryPhotos(){
 if(document.hidden || motionPreference.matches)return;
 for(const gallery of [...articleGalleries,...achievements]){
  for(const photo of gallery.images)loadPhoto(photo.src).catch(()=>{});
 }
}
prepareGalleryPhotos();
motionPreference.addEventListener?.('change',prepareGalleryPhotos);
document.addEventListener('visibilitychange',prepareGalleryPhotos);

setInterval(()=>{
 if(document.hidden || motionPreference.matches)return;
 advancePod(1);
 for(const rotate of teamPhotoRotations)rotate().catch(()=>{});
 for(const carousel of document.querySelectorAll('[data-carousel]')){
  if(dialog.contains(carousel) && !dialog.open)continue;
  if(carouselItem(carousel).images.length>1 && !carousel.hasAttribute('aria-busy'))moveSlide(carousel,1);
 }
},5000);
