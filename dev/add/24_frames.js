/* ===== v4 (25 Nov): profile frames (season rewards), Edit-profile window, Legendary skins for gems, new sounds =====
   Frames: SV.frames = rank indexes earned (best rank of a finished season), SV.frame = equipped (-1 / undefined = plain gold).
   Owners/moderators have every frame. Shown on the top-left avatar, the profile popup and the edit window.
   Legendary skin: LEG_GEMS gems (window.__legGems) — Pix: ask before release whether to switch back to real money. */
(function w(){if(typeof menu!=='function'||typeof SV==='undefined'||typeof RK==='undefined'||!window.__skinPop){setTimeout(w,500);return}try{
const LEG_GEMS=()=>window.__legGems||1500;
const POR=()=>window.__POR||{};
const note=t=>{try{const n=document.createElement('div');n.className='m3note';n.textContent=t;document.body.appendChild(n);setTimeout(()=>n.remove(),2200)}catch(e){}};
const S=(f,d,ty,v)=>{try{snd(f,d,ty||'triangle',v||.1)}catch(e){}};
const seq=(fs,gap,d,v,ty)=>fs.forEach((f,i)=>setTimeout(()=>S(f,d,ty,v),i*gap));
const staff=()=>{try{return !!(window.__isStaff&&window.__isStaff())}catch(e){return false}};

/* ---------- sounds ---------- */
const SFX=window.__sfx4={
 gift:()=>seq([880,1175,1568],90,.12,.1),               // a gift mail arrives / is claimed
 quest:()=>seq([660,880,1047,1319],80,.14,.12),          // daily skin quest done
 equip:()=>{seq([523,784],70,.08,.1,'square');setTimeout(()=>seq([1047,1568],60,.18,.09),160)}, // skin equipped
 sd:()=>{seq([196,185,175,165],170,.32,.16,'sawtooth');setTimeout(()=>S(98,.9,'sawtooth',.14),700)}, // sudden death
 frame:()=>seq([784,988,1319],70,.14,.11)};
/* hook the toasts the other add-ons already show */
try{new MutationObserver(ms=>{ms.forEach(m=>m.addedNodes.forEach(n=>{if(!n.classList||!n.classList.contains('m3note'))return;const t=n.textContent||'';
 if(/^Quest done!/.test(t))SFX.quest();else if(/skin equipped!$/.test(t))SFX.equip();else if(/^\+\d+ gold from/.test(t))SFX.gift()}))}).observe(document.body,{childList:true})}catch(e){}
try{const o=window.__sdPop;if(o&&!o.__s){const f=function(){SFX.sd();return o.apply(this,arguments)};f.__s=1;window.__sdPop=f}}catch(e){}
/* new gift mails: chime once when they show up */
let gN=-1;setInterval(()=>{try{const n=(SV.mail||[]).filter(m=>m.g&&!m.c).length;if(gN>=0&&n>gN)SFX.gift();gN=n}catch(e){}},1500);
try{const o=window.mclaim;if(o&&!o.__s){const f=function(id){const had=(SV.mail||[]).some(m=>m.g&&!m.c&&(!id||m.id===id));const r=o.apply(this,arguments);if(had)SFX.gift();return r};f.__s=1;f.__g=o.__g;window.mclaim=f;try{mclaim=f}catch(e){}}}catch(e){}

/* ---------- Legendary skin for gems ---------- */
const _eq=window.__skinEq;
window.__skinEq=function(){try{const h=SV.mine,sel=document.querySelector('#menu .skt.on');const i=sel?[...sel.parentNode.children].indexOf(sel):-1;
 if(i===2&&!(window.__skinOwned&&window.__skinOwned(h,2))){const c=LEG_GEMS();
  if((SV.gems||0)<c){note('You need '+c+' gems for this skin');return}
  const M=document.getElementById('menu');const q=document.createElement('div');q.className='mpop spop lgq';
  q.innerHTML='<div class="uc"><b class="st">Buy Legendary skin?</b><p style="margin:8px 0">Unlock the Legendary '+((HD[h]||{}).n||'')+' skin for <b style="color:#9fe3ff">'+c+' 💎</b>.</p><div class="us2"><button class="opr rm" onclick="this.closest(\'.lgq\').remove()">Cancel</button><button class="opr" onclick="__legBuy()">Buy</button></div></div>';
  q.onclick=e=>{if(e.target===q)q.remove()};M.appendChild(q);return}}catch(e){}
 return _eq&&_eq.apply(this,arguments)};
window.__legBuy=function(){const h=SV.mine,c=LEG_GEMS();const q=document.querySelector('#menu .lgq');if(q)q.remove();if((SV.gems||0)<c){note('Not enough gems');return}
 SV.gems-=c;SV.skb=SV.skb||{};SV.skb[h]=1;try{sv()}catch(e){}seq([784,988,1175,1568],80,.14,.12);note('Legendary skin unlocked!');try{menu()}catch(e){}try{window.__skinPop()}catch(e){}};
/* price on the skin window: "$19.99" → gems */
try{new MutationObserver(()=>{document.querySelectorAll('#menu .skpr').forEach(e=>{const t=LEG_GEMS()+' 💎';if(e.textContent!==t)e.textContent=t});
 document.querySelectorAll('#menu .skd').forEach(e=>{if(/\$\d/.test(e.textContent))e.textContent='Premium skin · '+LEG_GEMS()+' gems'})}).observe(document.getElementById('menu'),{childList:true,subtree:true})}catch(e){}

/* ---------- frames ---------- */
const FC=[ // ring colours per rank: [outer, mid, inner, glow]
 ['#7a4a22','#c98a4a','#f0c08a','#c98a4a66'],   // Bronze
 ['#5a6270','#c9d2de','#ffffff','#c9d2de88'],   // Silver
 ['#8a5a10','#ffd05a','#fff2b0','#ffd05a99'],   // Gold
 ['#1f6a6a','#5ee0d0','#d8fffa','#5ee0d099'],   // Platinum
 ['#1a3f8a','#6ab8ff','#e0f2ff','#6ab8ffaa'],   // Diamond
 ['#4a1a7a','#b46aff','#f0dcff','#b46affaa'],   // Master
 ['#7a1010','#ff5a3a','#ffd27a','#ff5a3abb']];  // Grandmaster
const owned=()=>{if(staff())return RK.map((x,i)=>i);const a=Array.isArray(SV.frames)?SV.frames.slice():[];return a.filter((v,i)=>a.indexOf(v)===i).sort((a,b)=>a-b)};
const cur=()=>{const f=SV.frame;return typeof f==='number'&&owned().includes(f)?f:-1};
const ring=f=>{if(f<0)return '';const c=FC[f]||FC[2];return 'border-color:'+c[1]+'!important;box-shadow:0 0 0 2px '+c[0]+',0 0 0 4px '+c[2]+',0 0 12px 3px '+c[3]+'!important'};
window.__frStyle=ring;
/* season reward: the best-rank frame */
window.__frLine=rk=>'<p style="margin:2px 0 6px;font:700 12.5px system-ui;color:#ffe9b8">+ <b style="color:'+(FC[rk]||FC[0])[1]+'">'+RK[rk][0]+' frame</b> for your profile picture</p>';
(function ws(){const o=window.__seaClaim;if(typeof o!=='function'||o.__f){setTimeout(ws,800);return}const f=function(){try{const s=SV.seaPend;if(s&&typeof s.rk==='number'){SV.frames=Array.isArray(SV.frames)?SV.frames:[];if(!SV.frames.includes(s.rk))SV.frames.push(s.rk);SFX.frame()}}catch(e){}return o.apply(this,arguments)};f.__f=1;window.__seaClaim=f;setTimeout(ws,3000)})();
/* apply the frame to the avatar spots */
function paint(){try{const f=cur(),st=ring(f);
 document.querySelectorAll('.pf3,#menu .pfp .pav,#menu .pfe .pav').forEach(e=>{if(e.dataset.fr!==String(f)){e.dataset.fr=String(f);e.setAttribute('style',(e.getAttribute('style')||'').replace(/border-color:[^;]*;box-shadow:[^;]*;?/g,'')+st)}})}catch(e){}}
setInterval(paint,600);try{new MutationObserver(paint).observe(document.getElementById('menu'),{childList:true,subtree:true})}catch(e){}

/* ---------- Edit profile window: picture + frame ---------- */
let ET='pic';
window.__pfEditPic=function(t){if(t)ET=t;const M=document.getElementById('menu');let p=M.querySelector('.mpop');if(p)p.remove();
 const k0=SV.pav&&POR()[SV.pav]?SV.pav:SV.mine,f=cur(),av=POR()[k0]||'';
 const pics=Object.keys(POR()).filter(k=>!window.__pfOK||window.__pfOK(k)).map(k=>'<button class="'+(k0===k?'on':'')+'" onclick="__pfPick(\''+k+'\')"><img alt="" src="'+POR()[k]+'"></button>').join('');
 const own=owned();const frs=[-1].concat(RK.map((x,i)=>i)).map(i=>{const ok=i<0||own.includes(i),c=i<0?['#6b3f0a','#ffd05a','#fff2b0','#ffd05a66']:FC[i];
  return '<button class="fro'+(f===i?' on':'')+(ok?'':' lk')+'" '+(ok?'onclick="__pfFrame('+i+')"':'')+'><span style="border-color:'+c[1]+';box-shadow:0 0 0 2px '+c[0]+',0 0 0 4px '+c[2]+'"><img alt="" src="'+av+'"></span><small>'+(i<0?'Classic':RK[i][0])+'</small>'+(ok?'':'<i>🔒</i>')+'</button>'}).join('');
 p=document.createElement('div');p.className='mpop spop';
 p.innerHTML='<div class="uc pfe"><b class="st">Edit profile</b><div class="pav" style="'+ring(f)+'"><img alt="" src="'+av+'"></div>'+
  '<div class="pft"><button class="'+(ET==='pic'?'on':'')+'" onclick="__pfEditPic(\'pic\')">Picture</button><button class="'+(ET==='fr'?'on':'')+'" onclick="__pfEditPic(\'fr\')">Frame</button></div>'+
  (ET==='pic'?'<div class="pics">'+pics+'</div><div class="pfn">Unlock more pictures with hero skins.</div>':'<div class="frs">'+frs+'</div><div class="pfn">Earn frames by finishing a ranked season — your best rank\'s frame is yours to keep.</div>')+
  '<div class="us2"><button class="opr rm" onclick="__pfOpen&&__pfOpen()">Back</button></div></div>';
 p.onclick=e=>{if(e.target===p)p.remove()};M.appendChild(p);paint()};
window.__pfPick=k=>{SV.pav=k;try{sv()}catch(e){}S(880,.06);try{menu()}catch(e){}window.__pfEditPic()};
window.__pfFrame=i=>{SV.frame=i;try{sv()}catch(e){}SFX.frame();try{menu()}catch(e){}window.__pfEditPic()};
/* profile popup: picture list replaced by an Edit button beside the photo */
function deco(){const box=document.querySelector('#menu .mpop .pfp');if(!box||!box.querySelector('.pnm, .pnr'))return;const me=box.querySelector('.pics');if(!me)return;
 const sel=box.querySelector('.psel');if(sel)sel.remove();me.remove();
 const pav=box.querySelector('.pav');if(pav&&!box.querySelector('.pedt')){const w2=document.createElement('div');w2.className='pavw';pav.parentNode.insertBefore(w2,pav);w2.appendChild(pav);
  const b=document.createElement('button');b.className='pedt';b.innerHTML='✏️';b.title='Edit picture and frame';b.onclick=e=>{e.stopPropagation();window.__pfEditPic('pic')};w2.appendChild(b)}paint()}
try{new MutationObserver(deco).observe(document.getElementById('menu'),{childList:true,subtree:true})}catch(e){}

const css=document.createElement('style');css.textContent=`
#menu .pfp .pavw{position:relative;width:max-content;margin:0 auto}
#menu .pfp .pedt{position:absolute;right:-8px;bottom:-2px;width:30px;height:30px;border-radius:50%;border:2px solid #6b3f0a;background:linear-gradient(#ffe38e,#e9ac2e);box-shadow:0 2px 0 #5a3608,0 3px 6px #0008;font-size:14px;line-height:1;padding:0;cursor:pointer}
#menu .pfe{width:min(88vw,360px);box-sizing:border-box;text-align:center}
#menu .pfe .pav{width:84px;height:84px;margin:6px auto 8px;border-radius:50%;border:3px solid #ffd05a;box-shadow:0 0 0 2px #6b3f0a,0 0 14px #ffd05a66;overflow:hidden;background:#1e140b}
#menu .pfe .pav img{width:100%;height:100%;display:block;object-fit:cover}
#menu .pfe .pft{display:flex;gap:6px;justify-content:center;margin:2px 0 8px}
#menu .pfe .pft button{flex:1;max-width:130px;height:32px;border-radius:10px;border:2px solid #8a6326;background:#2a1a0bcc;color:#f3e2bf;font:400 15px 'Lilita One',system-ui,sans-serif;cursor:pointer}
#menu .pfe .pft button.on{border-color:#ffd23f;background:linear-gradient(#ffe38e,#e9ac2e);color:#3a2006}
#menu .pfe .pics{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;max-height:42vh;overflow:auto;padding:4px}
#menu .pfe .pics button{width:48px;height:48px;padding:0;border-radius:50%;border:2px solid #6b4a22;background:#1e140b;overflow:hidden;cursor:pointer}
#menu .pfe .pics button.on{border-color:#ffd05a;box-shadow:0 0 8px #ffd05a}
#menu .pfe .pics img{width:100%;height:100%;display:block}
#menu .pfe .frs{display:grid;grid-template-columns:repeat(4,1fr);gap:8px 4px;padding:4px}
#menu .pfe .fro{position:relative;display:flex;flex-direction:column;align-items:center;gap:5px;padding:4px 0;border:0;border-radius:10px;background:none;cursor:pointer}
#menu .pfe .fro span{width:46px;height:46px;border-radius:50%;border:3px solid;overflow:hidden;background:#1e140b}
#menu .pfe .fro span img{width:100%;height:100%;display:block;object-fit:cover}
#menu .pfe .fro small{font:700 10.5px system-ui;color:#f3e2bf}
#menu .pfe .fro.on{background:#ffd23f33;box-shadow:inset 0 0 0 2px #ffd23f}
#menu .pfe .fro.lk span{filter:grayscale(1) brightness(.55)}
#menu .pfe .fro i{position:absolute;top:18px;font-style:normal;font-size:16px}
#menu .pfe .pfn{font:600 11.5px system-ui;color:#e8d6b4;margin:6px 4px 8px}
`;document.head.appendChild(css);
}catch(e){console.warn('v4 frames',e)}})();
