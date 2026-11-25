/* V4 shop: shards + blueprints refresh by themselves twice a day (00:00 and 12:00 Cairo time, server clock),
   timer on the page; paid refresh = confirm window, 3 per day, 2 → 6 → 15 gems */
(function w(){if(typeof SV==='undefined'||typeof menu!=='function'){setTimeout(w,300);return}try{
const HALF=12*36e5,CAI=2*36e5,COST=[2,6,15];
const slot=()=>Math.floor((Date.now()+CAI)/HALF),day=()=>Math.floor((Date.now()+CAI)/864e5);
const left=()=>{const ms=(slot()+1)*HALF-CAI-Date.now(),h=Math.floor(ms/36e5),m=Math.floor(ms%36e5/6e4);return h+'h '+String(m).padStart(2,'0')+'m'};
const used=()=>SV.rfD===day()?(SV.rfN||0):0;
function auto(){if(SV.shSlot===slot())return false;const first=SV.shSlot==null;SV.shSlot=slot();if(!first){try{(0,eval)('mkOffers()')}catch(e){}SV.boffers=null}try{sv()}catch(e){}return true}
auto();
const esc=t=>String(t);
function pop(html){const M=document.getElementById('menu');let p=M.querySelector('.mpop');if(p)p.remove();p=document.createElement('div');p.className='mpop spop';p.innerHTML='<div class="uc">'+html+'</div>';p.onclick=e=>{if(e.target===p)p.remove()};M.appendChild(p);return p}
window.__rfAsk=function(kind){const n=used();
 if(n>=3){pop('<b class="st">Refresh shop</b><div class="rfx">You have used all <b>3</b> refreshes today.<br>The shop refreshes by itself in <b>'+left()+'</b>.</div><div class="us2"><button class="opr" onclick="soClose()">OK</button></div>');return}
 const c=COST[n],ok=SV.gems>=c;
 pop('<b class="st">Refresh '+(kind==='bp'?'blueprints':'hero shards')+'?</b><div class="rfx">New offers right now for <b class="rfc"><img alt="" src="'+U.gem+'">'+c+'</b> gems.<br>Refreshes left today: <b>'+(3-n)+' / 3</b>'+(n<2?'<br><small>Next refresh costs '+COST[n+1]+' gems.</small>':'<br><small>This is your last refresh today.</small>')+(ok?'':'<br><span class="rfno">Not enough gems.</span>')+'<br><small>Free refresh in '+left()+'.</small></div><div class="us2"><button class="opr rm" onclick="soClose()">Cancel</button><button class="opr" '+(ok?'':'disabled')+' onclick="__rfDo(\''+kind+'\')">Refresh</button></div>')};
window.__rfDo=function(kind){const n=used(),c=COST[n];if(n>=3||SV.gems<c)return;SV.gems-=c;SV.rfD=day();SV.rfN=n+1;
 if(kind==='bp'){try{(0,eval)('mkBO()')}catch(e){SV.boffers=null}}else{try{(0,eval)('mkOffers()')}catch(e){}}
 try{sv()}catch(e){}try{soClose()}catch(e){}try{snd(700,.06,'triangle')}catch(e){}menu()};
function deco(){const rf=[...document.querySelectorAll('#mb .srf')];rf.forEach(b=>{const o=b.getAttribute('onclick')||'';const kind=/mkBO/.test(o)?'bp':/mkOffers/.test(o)?'sh':b.dataset.k;if(!kind)return;
  b.dataset.k=kind;b.removeAttribute('onclick');b.onclick=e=>{e.stopPropagation();__rfAsk(kind)};const n=used();b.disabled=false;b.classList.toggle('rf0',n>=3);
  const p=b.querySelector('b');if(p)p.innerHTML=n>=3?'0 left':'<img alt="" src="'+U.gem+'">'+COST[n];
  const host=b.parentElement;if(host&&!host.querySelector('.rft'))b.insertAdjacentHTML('afterend','<span class="rft">⏱ New offers in '+left()+'</span>')})}
const _m=menu;menu=function(){if(auto()){}const r=_m.apply(this,arguments);try{deco()}catch(e){console.log('shop',e)}return r};
setInterval(()=>{try{if(auto()&&typeof tab!=='undefined'&&tab==='shop'&&!document.querySelector('#menu .mpop'))menu();document.querySelectorAll('#mb .rft').forEach(t=>t.textContent='⏱ New offers in '+left())}catch(e){}},30000);
const st=document.createElement('style');st.textContent=`
#menu .rfx{font:600 14px/1.45 system-ui,sans-serif;color:#fff2d8;margin:6px 0 10px}
#menu .rfx small{color:#e8d6b4cc;font-size:12px}
#menu .rfc{display:inline-flex;align-items:center;gap:3px;color:#9fe0ff}#menu .rfc img{height:16px}
#menu .rfno{color:#ff9a8a;font-weight:800}
#mb .srf.rf0{filter:grayscale(.7);opacity:.75}
#mb .rft{display:inline-block;font:700 11px system-ui,sans-serif;color:#fff2d8;background:#2a1a0bcc;border:1px solid #c99436;border-radius:9px;padding:2px 7px;margin-left:6px;white-space:nowrap;vertical-align:middle}
`;document.head.appendChild(st);
}catch(e){console.log('v4 shop',e)}})();
