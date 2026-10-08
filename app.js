import {copy,siteConfig} from './content.js';
const $ = s => document.querySelector(s);
let language = 'en';
try {language = localStorage.getItem('partech-language') === 'tr' ? 'tr' : 'en';} catch {}
const escape = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const localized = value => typeof value === 'object' ? value[language] || value.en || '' : value;
const safeUrl = value => {try {const u = new URL(value,location.href);return ['http:','https:'].includes(u.protocol)?u.href:'#';}catch{return '#';}};
const sections=['home','about','technology','achievements','partners','news'];
const preview = new URLSearchParams(location.search).get('preview') === '1';
const dialog = $('#detail-dialog');
function closeMenu(){ $('#mega-menu').hidden=true;$('.menu-toggle').setAttribute('aria-expanded','false'); }
function render(){
 const t=copy[language];document.documentElement.lang=language;
 document.title=language==='en'?'PARTECH Hyperloop — Engineering the Future of Mobility':'PARTECH Hyperloop — Ulaşımın Geleceğini Tasarlıyoruz';
 document.querySelector('meta[name="description"]').content=t.heroText;
 document.querySelectorAll('[data-t]').forEach(el=>{el.textContent=t[el.dataset.t]||'';});
 $('.desktop-nav').innerHTML=sections.map(id=>`<a href="#${id}">${t[id]}</a>`).join('');
 $('#language').innerHTML=language==='en'?'EN <span>/ TR</span>':'TR <span>/ EN</span>';
 $('#language').setAttribute('aria-label',language==='en'?'Türkçe diline geç':'Switch to English');
 $('.menu-toggle').setAttribute('aria-label',language==='en'?'Toggle navigation':'Menüyü aç veya kapat');
 $('#mega-menu').innerHTML=[['about',[['about','story'],['team','team'],['contact','join']]],['technology',[['technology','technology'],['achievements','achievements']]],['partners',[['partners','partners'],['opportunities','opportunities']]],['news',[['news','updates'],['contact','contact']]]].map(([label,links])=>`<div><strong>${t[label]}</strong>${links.map(([id,key])=>`<a href="#${id}">${t[key]}</a>`).join('')}</div>`).join('');
 $('#disciplines').innerHTML=t.disciplines.map(([title,text])=>`<article class="discipline"><h3>${title}</h3><p>${text}</p></article>`).join('');
 $('#milestones').innerHTML=t.milestones.map(([img,label,title,text])=>`<article class="card"><img src="${img}" alt="${escape(title)}" loading="lazy" width="640" height="420"><div class="card-content"><p class="eyebrow">${label}</p><h3>${title}</h3><p>${text}</p></div></article>`).join('');
 $('#news-list').innerHTML=t.articles.map(([img,label,title,text],i)=>`<article class="card"><img src="${img}" alt="${escape(title)}" loading="lazy" width="640" height="420"><div class="card-content"><p class="eyebrow">${label}</p><h3>${title}</h3><p>${text}</p><button class="text-link" data-article="${i}">${t.readMore}<span class="sr-only">: ${title}</span></button></div></article>`).join('');
 $('#opportunities').innerHTML=t.paths.map(([title,text])=>`<article><h3>${title}</h3><p>${text}</p></article>`).join('');
 $('.partner-preview').hidden=!preview || siteConfig.partners.length>0;
 $('#partner-logos').innerHTML=t.placeholderTypes.map(type=>`<div class="logo-placeholder"><span aria-hidden="true">P</span><strong>${t.placeholder}</strong><p>${type}</p></div>`).join('');
 $('#partner-examples').innerHTML=[1,2,3].map(i=>`<article class="partner-example"><span class="number">0${i}</span><div><h3>${t.placeholderTitle}</h3><p>${t.placeholderDescription}</p></div></article>`).join('');
 $('#partner-list').innerHTML=siteConfig.partners.map(p=>`<article class="partner-card">${p.logo?`<img src="${escape(safeUrl(p.logo))}" alt="${escape(p.name)}" loading="lazy">`:''}<h3>${escape(p.name)}</h3><p>${escape(localized(p.description))}</p><p>${escape(localized(p.contribution))}</p>${p.url?`<a class="text-link" href="${escape(safeUrl(p.url))}" target="_blank" rel="noopener noreferrer">${language==='tr'?'Web Sitesi':'Visit Website'}</a>`:''}</article>`).join('');
 const email=siteConfig.contactEmail.trim();
 $('#contact-box').innerHTML=email?`<p>${t.contactPrompt}</p><a class="button navy" href="mailto:${encodeURIComponent(email)}">${t.emailUs}</a><p style="margin-top:16px">${escape(email)}</p>`:`<p>${t.contactPending}</p><a class="text-link" href="#opportunities">${t.opportunities}</a>`;
 if(siteConfig.partnershipDeck)$('#contact-box').insertAdjacentHTML('beforeend',`<a class="button navy" href="${escape(safeUrl(siteConfig.partnershipDeck))}" download>${t.downloadDeck}</a>`);
 $('#year').textContent=new Date().getFullYear();
}
$('#language').addEventListener('click',()=>{language=language==='en'?'tr':'en';try{localStorage.setItem('partech-language',language);}catch{}dialog.close();render();});
$('.menu-toggle').addEventListener('click',()=>{const open=$('#mega-menu').hidden;$('#mega-menu').hidden=!open;$('.menu-toggle').setAttribute('aria-expanded',String(open));});
document.addEventListener('click',e=>{if(e.target.closest('#mega-menu a'))closeMenu();if(!e.target.closest('.header'))closeMenu();const button=e.target.closest('[data-article]');if(button){const [img,label,title,intro,body]=copy[language].articles[Number(button.dataset.article)];$('#dialog-content').innerHTML=`<img src="${img}" alt="${escape(title)}"><p class="eyebrow">${label}</p><h2 id="dialog-title">${title}</h2><p>${intro}</p><p>${body}</p>`;dialog.showModal();}});
document.addEventListener('keydown',e=>{if(e.key==='Escape' && !$('#mega-menu').hidden){closeMenu();$('.menu-toggle').focus();}});
$('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
render();
const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){document.querySelectorAll('.desktop-nav a').forEach(a=>{const active=a.hash==='#'+entry.target.id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}},{rootMargin:'-15% 0px -65% 0px',threshold:0});
sections.forEach(id=>observer.observe(document.getElementById(id)));
