/* V4: guild logos, "last online" lines, red notification dots */
(function(){try{
const esc=t=>String(t==null?'':t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------- guild logos: banner colour + emblem ---------- */
const LG=[['none',''],['hue-rotate(120deg)',''],['hue-rotate(250deg) saturate(1.3)',''],
 ['hue-rotate(160deg)','🐉'],['hue-rotate(320deg) saturate(1.2)','🔥'],['hue-rotate(195deg)','❄️'],['hue-rotate(60deg)','🎲'],['hue-rotate(275deg)','🌙'],
 ['hue-rotate(20deg) saturate(1.3)','⚔️'],['hue-rotate(95deg)','🐺'],['grayscale(.75) brightness(.9)','💀'],['hue-rotate(40deg) saturate(1.5)','👑'],
 ['hue-rotate(220deg)','⚡'],['hue-rotate(340deg)','🌹'],['hue-rotate(140deg) saturate(.8)','🍀'],['hue-rotate(300deg)','🦅']];
const logo=(i,cls)=>{const L=LG[((i%LG.length)+LG.length)%LG.length];return '<span class="gbn glg '+(cls||'')+'"><img alt="" src="'+U.m_guild+'" style="filter:'+L[0]+'">'+(L[1]?'<i>'+L[1]+'</i>':'')+'</span>'};
window.__glgH=function(name,i,cls){let k=i%3;try{if(SV.myGuild&&SV.myGuild.n===name&&SV.myGuild.lg!=null)k=SV.myGuild.lg}catch(e){}return logo(k,cls)};
window.__glgL=logo;window.__glgSel=0;
window.__glgPick=function(cur){window.__glgSel=cur||0;return '<div class="glp"><button type="button" class="gla" onclick="__glgStep(-1)">◀</button><span id="glgv">'+logo(window.__glgSel,'pk')+'</span><button type="button" class="gla" onclick="__glgStep(1)">▶</button></div><div class="glc" id="glgc">Logo '+(window.__glgSel+1)+' / '+LG.length+'</div>'};
window.__glgStep=function(d){window.__glgSel=(window.__glgSel+d+LG.length)%LG.length;const v=document.getElementById('glgv'),c=document.getElementById('glgc');if(v)v.innerHTML=logo(window.__glgSel,'pk');if(c)c.textContent='Logo '+(window.__glgSel+1)+' / '+LG.length;try{snd(600,.04,'triangle')}catch(e){}};

/* ---------- last online ---------- */
const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const fmt=t=>{const d=new Date(t),n=new Date(),hm=String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
 const day=x=>new Date(x.getFullYear(),x.getMonth(),x.getDate()).getTime(),dd=Math.round((day(n)-day(d))/864e5);
 return dd<=0?'today, '+hm:dd===1?'yesterday, '+hm:d.getDate()+' '+MON[d.getMonth()]+(d.getFullYear()!==n.getFullYear()?' '+d.getFullYear():'')+', '+hm};
const hsh=s=>{let h=7;for(const c of String(s))h=(h*31+c.charCodeAt(0))%100003;return h};
window.__lastOn=function(id,you,seen){try{
 if(you||id==='me')return '<i class="on">● Online now</i>';
 if(seen!=null){if(!seen)return 'Last online: —';if(Date.now()-seen<3*60e3)return '<i class="on">● Online now</i>';return 'Last online: '+fmt(seen)}
 if(window.__isOn&&window.__isOn(id))return '<i class="on">● Online now</i>';
 const sl=Math.floor(Date.now()/(20*60e3));const ago=(hsh(id+'L'+Math.floor(sl/9))%(60*52))+20;return 'Last online: '+fmt(sl*20*60e3-ago*60e3)}catch(e){return ''}};

/* ---------- red dots ---------- */
const mailNew=()=>{try{return window.__mailNew?window.__mailNew():0}catch(e){return 0}};
const lpend=()=>{try{return !!SV.lpend}catch(e){return false}};
const chestReady=()=>{try{const now=Date.now();return (SV.boxes||[]).some(x=>x&&x.s&&BX[x.r]&&x.s+BX[x.r][1]*6e4<=now)}catch(e){return false}};
const achReady=()=>{try{const L=window.__achV?window.__achV():ACH;return L.some(a=>!SV.ach[a[0]]&&a[3]()>=a[4])}catch(e){return false}};
let questReady=false;
const setDot=(el,on,cls)=>{if(!el)return;const d=el.querySelector(':scope > .v4d');if(on&&!d)el.insertAdjacentHTML('beforeend','<i class="v4d '+(cls||'')+'"></i>');if(!on&&d)d.remove()};
function dots(){try{
 const nv=[...document.querySelectorAll('#nv button')],nb=k=>nv.find(b=>(b.getAttribute('onclick')||'').includes("'"+k+"'"));
 const jb=nb('jour');questReady=!!(jb&&jb.querySelector('.qdot'));
 const rew=lpend()||chestReady()||questReady,ach=achReady(),ml=mailNew()>0,rq=(SV.frReq||[]).length>0;
 setDot(nb('comm'),ml||rq);setDot(jb,rew||ach);
 document.querySelectorAll('#mb .stabs .stb').forEach(b=>{const o=b.getAttribute('onclick')||'';
  if(/cmt\('ml'\)/.test(o))setDot(b,ml,'tb');else if(/cmt\('fr'\)/.test(o))setDot(b,rq,'tb');else if(/jt\('rew'\)/.test(o))setDot(b,rew,'tb');else if(/jt\('ach'\)/.test(o))setDot(b,ach,'tb')});
}catch(e){console.log('dots',e)}}
window.__v4dots=dots;
(function w(){if(typeof menu!=='function'||typeof SV==='undefined'){setTimeout(w,300);return}
 const _m=menu;menu=function(){const r=_m.apply(this,arguments);try{dots()}catch(e){}return r};setInterval(dots,4000);setTimeout(dots,500)})();

/* ---------- PC mouse wheel: if the thing under the mouse can't scroll, scroll the page's main list instead ---------- */
const canSc=(e,dy)=>{const s=getComputedStyle(e);if(!/(auto|scroll)/.test(s.overflowY))return false;if(e.scrollHeight<=e.clientHeight+1)return false;return dy>0?e.scrollTop+e.clientHeight<e.scrollHeight-1:e.scrollTop>0};
document.addEventListener('wheel',ev=>{try{if(ev.ctrlKey||!ev.deltaY)return;const M=document.getElementById('menu');if(!M||M.style.display==='none'||!M.contains(ev.target))return;
 const dy=ev.deltaY*(ev.deltaMode===1?40:ev.deltaMode===2?400:1);
 const root=ev.target.closest('.mpop')||document.getElementById('mb')||M;
 for(let e=ev.target;e&&e!==root.parentElement;e=e.parentElement){if(canSc(e,dy))return}
 const L=[...root.querySelectorAll('*')].concat([root]).filter(e=>canSc(e,dy)&&e.offsetParent!==null);if(!L.length)return;
 L.sort((a,b)=>b.clientHeight-a.clientHeight);L[0].scrollBy({top:dy,behavior:'auto'});ev.preventDefault()}catch(e){}},{passive:false});
}catch(e){console.warn('v4 ui',e)}})();
