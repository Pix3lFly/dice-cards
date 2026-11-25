/* ===== v4 (26 Nov): tutorial with Pix's dragon mascot ("Sparky")
   1) the existing "How to play" spotlight steps get the mascot beside each bubble + a Skip button;
   2) during the tutorial match (window.__tutM) Sparky pops up with short tips the first time things happen:
      your first turn, landing on a tile, a monster fight, the shop, a portal, the first hit on the enemy;
   3) the ? help screen gets "Replay tutorial" (the guide runs again in your next match). ===== */
(function w(){if(typeof SV==='undefined'||!document.getElementById('tut3')||!window.__MASC){setTimeout(w,500);return}try{
const M=window.__MASC,NAME='Sparky';
const $=id=>document.getElementById(id);
const POSE=['hold','think','hold','cheer','think','star','cheer','think','think','star'];
/* ---------- 1) mascot on the spotlight steps ---------- */
const T3=$('tut3');
function deco(){const bx=T3.querySelector('.bx .uc');if(!bx||bx.querySelector('.msh'))return;
 const st=bx.querySelector('.st');let n=0;if(st){const m=st.textContent.match(/(\d+)\/(\d+)/);if(m)n=+m[1]-1}
 const pose=st?POSE[n%POSE.length]:'star';
 bx.classList.add('mscb');const h=document.createElement('div');h.className='msh';h.innerHTML='<img class="msc" alt="" src="'+M[pose]+'"><div class="mst"><div class="mscn">'+NAME+'</div></div>';
 const ttl=st||bx.querySelector(':scope>b');if(ttl)h.querySelector('.mst').appendChild(ttl);bx.insertBefore(h,bx.firstChild);if(bx.querySelector('.tleg'))bx.classList.add('cmp');
 fit(bx.closest('.bx'))}
function fit(o){if(!o)return;requestAnimationFrame(()=>{const r=o.getBoundingClientRect(),ov=r.bottom-(innerHeight-10);if(ov>0)o.style.top=Math.max(8,r.top-ov)+'px'})}
function skip(){let g=0;(function step(){const s=T3.querySelector('#tutS');if(s){s.click();return}const nx=T3.querySelector('.tnx');if(nx&&g++<30){nx.click();setTimeout(step,0)}})()}
try{new MutationObserver(deco).observe(T3,{childList:true,subtree:true})}catch(e){}
setInterval(()=>{const w=$('v3wel');if(!w||w.style.display==='none')return;const u=w.querySelector('.uc');if(u&&!u.querySelector('.mscw'))u.insertAdjacentHTML('afterbegin','<img class="mscw" alt="" src="'+M.cheer+'">')},200);

/* ---------- 2) tips during the tutorial match ---------- */
const TP=document.createElement('div');TP.id='tut4';document.body.appendChild(TP);
let seen={},open=false,lastGid=null,startPos=null,ehp=null;
function rect(sel){const e=typeof sel==='string'?document.querySelector(sel):sel;if(!e)return null;const r=e.getBoundingClientRect();return r.width&&r.height?r:null}
function tip(key,pose,html,sel){if(seen[key]||open)return;seen[key]=1;open=true;const r=sel?rect(sel):null,pad=6;
 TP.innerHTML=(r?'<div class="sp" style="left:'+(r.left-pad)+'px;top:'+(r.top-pad)+'px;width:'+(r.width+pad*2)+'px;height:'+(r.height+pad*2)+'px"></div>':'<div class="sp none"></div>')+
  '<div class="bx" style="top:'+(r&&r.top>innerHeight*.5?Math.max(10,r.top-pad-200):(r?r.bottom+pad+12:innerHeight*.3))+'px"><div class="uc mscb"><div class="msh"><img class="msc" alt="" src="'+M[pose]+'"><div class="mst"><div class="mscn">'+NAME+'</div></div></div><p>'+html+'</p><div class="tnv"><button class="bt tok">Got it!</button></div></div></div>';
 TP.style.display='block';try{snd(784,.06,'triangle',.08);setTimeout(()=>snd(1047,.08,'triangle',.08),90)}catch(e){}
 const close=()=>{TP.style.display='none';TP.innerHTML='';open=false};
 TP.querySelector('.tok').onclick=e=>{e.stopPropagation();close()};
}
const vis=id=>{const e=$(id);return !!e&&getComputedStyle(e).display!=='none'};
setInterval(()=>{try{
 if(!window.__tutM||typeof P==='undefined'||!P||!P[0]||over){if(open&&!window.__tutM){TP.style.display='none';TP.innerHTML='';open=false}return}
 if(gid!==lastGid){lastGid=gid;seen={};startPos=P[0].pos;ehp=P[1].hp}
 if(open||vis('tut3')||vis('v3wel')||vis('intro')||vis('menu'))return;
 const me=cur===0;
 if(typeof FT!=='undefined'&&FT&&vis('fgt')){
  if(FT.shop){tip('shop','think','<b>The shop!</b> Spend your gold on a new card — or close it and keep your gold.','#fgt .uc');return}
  if(FT.jail){tip('jail','think','<b>You’re in jail!</b> Play a card: if the dice shows a <b>glowing number</b>, you break free.','#fgt .dfs');return}
  if(FT.ML){tip('mon','think','<b>Monster!</b> Pick a card to roll. Land on a <b>glowing number</b> to win gold, a card and a level up.','#fgt .dfs');return}}
 if(me&&!busy&&P[0].pos===startPos&&P[0].hand&&P[0].hand.length){tip('card','hold','<b>Your turn!</b> Tap a dice card, then tap it again to roll and move.','#hand');return}
 if(me&&!busy&&P[0].pos!==startPos){tip('tile','cheer','Nice move! Every tile does something — <b>tap any tile</b> on the board to see what it does.');return}
 if(T[P[0].pos]==='portal'&&!busy){tip('portal','star','<b>A portal!</b> It jumps you straight to the <b>other side</b> of the board.');return}
 if(P[1].hp<ehp&&!busy){tip('hit','star','<b>Great hit!</b> Bring the enemy’s HP down to <b>0</b> to win the match!','#hud .hc.e .bar');return}
}catch(e){}},400);

/* ---------- 3) replay from the ? help screen ---------- */
window.__tutReplay=function(){window.__tutNext=1;try{SV.tutAsked=1;sv()}catch(e){}const h=$('help');if(h)h.style.display='none';
 const n=document.createElement('div');n.className='m3note';n.textContent=NAME+' will guide you in your next match!';document.body.appendChild(n);setTimeout(()=>n.remove(),2200)};
setInterval(()=>{try{const h=$('help');if(!h||getComputedStyle(h).display==='none'||h.querySelector('.trp'))return;const box=h.querySelector('.uc')||h.firstElementChild;if(!box)return;
 const b=document.createElement('button');b.className='bt trp';b.innerHTML='<img alt="" src="'+M.cheer+'"> Replay tutorial';b.onclick=e=>{e.stopPropagation();window.__tutReplay()};box.appendChild(b)}catch(e){}},500);
try{const _in=intro;intro=function(){if(window.__tutNext){window.__tutNext=0;window.__tut=1;window.__tutM=1}return _in.apply(this,arguments)}}catch(e){}

const css=document.createElement('style');css.textContent=`
#v3wel .uc .mscw{display:block;width:96px;margin:14px auto -4px;position:relative;z-index:0;filter:drop-shadow(0 4px 4px #0009);animation:mscB 2.4s ease-in-out infinite}
#tut3 .uc.mscb,#tut4 .uc.mscb{overflow:hidden!important;text-align:left}
.mscb .msh{display:flex;align-items:center;gap:10px;margin:0 0 8px;padding-bottom:8px;border-bottom:1px solid #ffffff1f}
.mscb .msh .msc{width:64px;height:64px;object-fit:contain;flex:none;filter:drop-shadow(0 3px 3px #0008);animation:mscB 2.4s ease-in-out infinite;pointer-events:none}
.mscb .msh .mst{min-width:0}
.mscb .msh .mst>*{margin:0!important;text-align:left!important}
.mscb .msh .mst>b{display:block;font-size:20px}
@keyframes mscB{50%{transform:translateY(-3px) rotate(-2deg)}}
.mscb .mscn{font:400 15px 'Lilita One',system-ui,sans-serif;color:#ff9a3c;letter-spacing:.5px;margin-bottom:2px}
#tut3 .uc.mscb .tnv{margin-top:12px}
.mscb.cmp .msh{margin-bottom:4px;padding-bottom:4px}.mscb.cmp .msh .msc{width:44px;height:44px}
#tut3 .mscb .tleg span{white-space:normal;align-items:flex-start;text-align:left;justify-content:flex-start}#tut3 .mscb .tleg span em{overflow:visible;font-weight:500}
#tut4{position:fixed;inset:0;z-index:210;display:none;font-family:system-ui,sans-serif}
#tut4 .sp{position:fixed;border-radius:12px;box-shadow:0 0 0 9999px rgba(16,10,26,.62),0 0 0 3px #ffe9a0,0 0 18px 6px #ffd166;pointer-events:none}
#tut4 .sp.none{left:50%;top:50%;width:0;height:0;box-shadow:0 0 0 9999px rgba(16,10,26,.5)}
#tut4 .bx{position:fixed;left:50%;transform:translateX(-50%);width:min(88vw,360px);box-sizing:border-box;animation:t4In .35s cubic-bezier(.2,1.4,.4,1) both}
@keyframes t4In{from{opacity:0;transform:translateX(-50%) scale(.8)}}
#tut4 .uc{padding:12px 14px 10px!important}
#tut4 p{margin:0;font-size:14.5px;line-height:1.4;color:#fff2d8}
#tut4 p b{color:#ffe08a}
#tut4 .tnv,#tut3 .tnv{display:flex;gap:8px;justify-content:flex-end;margin-top:10px}
#help .trp{display:flex;align-items:center;gap:6px;margin:10px auto 0;padding:4px 14px 4px 6px}
#help .trp img{width:34px;height:34px;object-fit:contain}
`;document.head.appendChild(css);
}catch(e){console.warn('v4 tutorial',e)}})();
