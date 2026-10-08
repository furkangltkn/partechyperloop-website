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
 $('#milestones').innerHTML=achievements.map((item,i)=>`<li class="achievement-row ${item.images.length?'':'text-only'}"><div class="achievement-year"><time datetime="${item.year}">${item.year}</time></div><article class="achievement-entry"><div class="achievement-copy"><p class="eyebrow">${ac.event}</p><h3>${escape(localized(item.title))}</h3><p>${escape(localized(item.text))}</p><ul class="award-tags">${item.awards.map(a=>`<li>${escape(localized(a))}</li>`).join('')}</ul>${item.images.length?`<button class="text-link" data-achievement="${i}">${ac.photos}<span class="photo-count">${String(item.images.length).padStart(2,'0')}</span><span class="sr-only"> · ${item.year}</span></button>`:''}</div>${item.images.length?`<button class="achievement-photo" data-achievement="${i}" aria-label="${ac.photos} · ${item.year}"><img src="${item.images[0].src}" alt="${escape(localized(item.images[0].alt))}" width="1600" height="1200" loading="lazy"><span>${ac.gallery} / ${item.year}</span></button>`:''}</article></li>`).join('');
 $('#news-list').innerHTML=t.articles.map(([img,label,title,text],i)=>`<article class="card"><img src="${img}" alt="${escape(title)}" loading="lazy" width="640" height="420"><div class="card-content"><p class="eyebrow">${label}</p><h3>${title}</h3><p>${text}</p><button class="text-link" data-article="${i}">${t.readMore}<span class="sr-only">: ${title}</span></button></div></article>`).join('');
 const sponsorLogo=p=>`<li class="sponsor-logo${p.padded?' sponsor-padded':''}"><img src="${escape(safeUrl(p.logo))}" alt="${escape(p.name)}" loading="lazy" decoding="async"></li>`;
 $('#partner-list').innerHTML=`<ul class="sponsors-featured">${siteConfig.partners.filter(p=>p.featured).map(sponsorLogo).join('')}</ul><ul class="sponsors-grid">${siteConfig.partners.filter(p=>!p.featured).map(sponsorLogo).join('')}</ul>`;
 const email=siteConfig.contactEmail.trim();
 const mailIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>';
 const instagramIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>';
 $('#contact-box').innerHTML=email?`<div class="contact-email"><span class="contact-icon">${mailIcon}</span><div><h3>${t.emailUs}</h3><p>${t.contactPrompt}</p><a class="email-address" href="mailto:${escape(email)}">${escape(email)} <span aria-hidden="true">↗</span></a></div></div>`:`<p>${t.contactPending}</p>`;
 if(siteConfig.instagramUrl)$('#contact-box').insertAdjacentHTML('beforeend',`<a class="contact-social" href="${escape(safeUrl(siteConfig.instagramUrl))}" target="_blank" rel="noopener noreferrer"><span class="contact-icon">${instagramIcon}</span><span class="social-copy"><strong>${t.followUs}</strong><span>${t.followText}</span><span class="instagram-handle">@partechyperloop</span></span><span class="social-arrow" aria-hidden="true">↗</span></a>`);
 if(siteConfig.partnershipDeck)$('#contact-box').insertAdjacentHTML('beforeend',`<a class="button navy" href="${escape(safeUrl(siteConfig.partnershipDeck))}" download>${t.downloadDeck}</a>`);
 $('#year').textContent=new Date().getFullYear();
}
$('#language').addEventListener('click',()=>{language=language==='en'?'tr':'en';try{localStorage.setItem('partech-language',language);}catch{}dialog.close();render();});
$('.menu-toggle').addEventListener('click',()=>{const open=$('#mega-menu').hidden;$('#mega-menu').hidden=!open;$('.menu-toggle').setAttribute('aria-expanded',String(open));});
document.addEventListener('click',e=>{if(e.target.closest('#mega-menu a'))closeMenu();if(!e.target.closest('.header'))closeMenu();const button=e.target.closest('[data-article]');if(button){const [img,label,title,intro,body]=copy[language].articles[Number(button.dataset.article)];dialog.classList.remove('gallery-dialog');$('#dialog-content').innerHTML=`<img src="${img}" alt="${escape(title)}"><p class="eyebrow">${label}</p><h2 id="dialog-title">${title}</h2><p>${intro}</p><p>${body}</p>`;dialog.showModal();}});
document.addEventListener('keydown',e=>{if(e.key==='Escape' && !$('#mega-menu').hidden){closeMenu();$('.menu-toggle').focus();}});
$('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
render();
const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){document.querySelectorAll('.desktop-nav a').forEach(a=>{const active=a.hash==='#'+entry.target.id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}},{rootMargin:'-15% 0px -65% 0px',threshold:0});
sections.forEach(id=>observer.observe(document.getElementById(id)));

// Native dialog provides focus trapping and Escape-to-close for the photo archive.
document.addEventListener('click',e=>{
 const button=e.target.closest('[data-achievement]');
 if(!button)return;
 const item=achievements[Number(button.dataset.achievement)];
 const ac=achievementCopy[language];
 dialog.classList.add('gallery-dialog');
 $('#dialog-content').innerHTML=`<p class="eyebrow">${item.year} · ${ac.gallery}</p><h2 id="dialog-title">${escape(localized(item.title))}</h2><div class="achievement-gallery">${item.images.map((img,i)=>`<figure><img src="${img.src}" alt="${escape(localized(img.alt))}" width="1600" height="1200"><figcaption>${ac.photo} ${i+1} / ${item.images.length} · ${escape(localized(img.alt))}</figcaption></figure>`).join('')}</div>`;
 dialog.showModal();
});
