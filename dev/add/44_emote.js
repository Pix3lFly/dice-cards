/* ===== v4 (27 Nov): emotes in matches — quick Sparky reactions both players see ===== */
(function w(){if(typeof SV==='undefined'||!window.__MASC||!document.getElementById('rs')){setTimeout(w,500);return}try{
 const M=window.__MASC;
 const E=[['cheer','GG!'],['hold','Good luck!'],['star','Wow!'],['think','Hmm…'],['sleep','Hurry up!'],['hold','Oops!']];
 const st=document.createElement('style');st.textContent=`
html body #app #bot{padding-bottom:calc(env(safe-area-inset-bottom,0px) + 70px)!important}
#emb{position:fixed;z-index:46;width:44px;height:44px;border-radius:50%;padding:0;border:2.5px solid #6b3f0a;background:radial-gradient(circle at 40% 35%,#fff3b0,#f2b938 60%,#c98410);box-shadow:0 0 0 2px #ffe08a88,0 3px 6px #0009;display:none;cursor:pointer}
#emb img{width:130%;margin:-14% 0 0 -15%;pointer-events:none;filter:drop-shadow(0 1px 1px #0008)}
#emb.cd{filter:grayscale(.8) brightness(.8)}
#emp{position:fixed;z-index:47;display:none;grid-template-columns:repeat(3,1fr);gap:6px;padding:8px;border-radius:14px;background:linear-gradient(#26305a,#161c3a);border:2.5px solid #e8b84e;box-shadow:0 0 0 1.5px #3a2208,0 6px 14px #000b;animation:empi .2s ease-out both}
@keyframes empi{from{transform:translateY(10px);opacity:0}}
#emp button{width:78px;height:70px;border-radius:10px;border:1.5px solid #ffffff22;background:#00000040;padding:2px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer}
#emp button:active{transform:scale(.94)}
#emp img{height:44px;filter:drop-shadow(0 2px 2px #0008)}
#emp span{font:400 13px 'Lilita One',system-ui,sans-serif;color:#ffd76a;text-shadow:0 1px 0 #000a;white-space:nowrap}
.emo4{position:fixed;z-index:90;display:flex;align-items:center;gap:2px;pointer-events:none;animation:emoin .35s cubic-bezier(.3,1.5,.5,1) both}
.emo4.out{animation:emoout .3s ease-in both}
@keyframes emoin{from{transform:scale(.3);opacity:0}}@keyframes emoout{to{transform:scale(.6);opacity:0}}
.emo4 img{width:58px;filter:drop-shadow(0 3px 3px #000a)}
.emo4 b{background:#fff8e6;color:#3a2006;border:2.5px solid #8a5f17;border-radius:12px;padding:4px 10px;font:400 17px 'Lilita One',system-ui,sans-serif;box-shadow:0 3px 6px #0008;white-space:nowrap}`;document.head.appendChild(st);
 const b=document.createElement('button');b.id='emb';b.innerHTML='<img alt="" src="'+M.cheer+'">';document.body.appendChild(b);
 const p=document.createElement('div');p.id='emp';p.innerHTML=E.map((e,i)=>'<button data-i="'+i+'"><img alt="" src="'+(M[e[0]]||M.hold)+'"><span>'+e[1]+'</span></button>').join('');document.body.appendChild(p);
 const vis=e=>{if(!e)return false;const c=getComputedStyle(e),r=e.getBoundingClientRect();return c.display!=='none'&&c.visibility!=='hidden'&&r.width>0};
 const inMatch=()=>{try{const m=document.getElementById('menu');if(m&&m.style.display==='flex')return false;if(typeof mode!=='undefined'&&mode==='train')return false;
  if(typeof over!=='undefined'&&over)return false;if(!P||!P[1])return false;const t=document.getElementById('tut4');if(t&&getComputedStyle(t).display!=='none')return false;return vis(document.getElementById('rs'))}catch(e){return false}};
 let last=0,shown=[null,null],aiT=0;
 window.__emoShow=(k,i)=>{const e=E[i];if(!e)return;
  /* below everything at the top of the battle screen (cards, turn bar, turn text, ? button), on the player's side */
  let top=0;['hud','st','qb','tbar','turnb'].forEach(id=>{const x=document.getElementById(id);if(x){const r=x.getBoundingClientRect();if(r.height&&r.top<innerHeight*.4)top=Math.max(top,r.bottom)}});
  document.querySelectorAll('#app > *').forEach(x=>{const r=x.getBoundingClientRect(),c=getComputedStyle(x);if(r.height&&r.height<120&&r.top<innerHeight*.3&&c.display!=='none'&&c.visibility!=='hidden'&&x.id!=='gl'&&x.id!=='board')top=Math.max(top,r.bottom)});
  if(shown[k]){shown[k].remove();shown[k]=null}
  const d=document.createElement('div');d.className='emo4';d.innerHTML=(k?'<b>'+e[1]+'</b><img alt="" src="'+(M[e[0]]||M.hold)+'">':'<img alt="" src="'+(M[e[0]]||M.hold)+'"><b>'+e[1]+'</b>');
  document.body.appendChild(d);const dw=d.offsetWidth;d.style.top=(top+14)+'px';d.style.left=(k?innerWidth-dw-16:16)+'px';shown[k]=d;
  try{snd(k?740:880,.06,'triangle')}catch(e){}
  setTimeout(()=>{d.classList.add('out');setTimeout(()=>{d.remove();if(shown[k]===d)shown[k]=null},300)},2600)};
 const close=()=>{p.style.display='none'};
 b.onclick=e=>{e.stopPropagation();if(p.style.display==='grid'){close();return}const r=b.getBoundingClientRect();p.style.display='grid';p.style.left=Math.max(6,r.left)+'px';p.style.bottom=(innerHeight-r.top+8)+'px'};
 p.onclick=e=>{const x=e.target.closest('button');if(!x)return;e.stopPropagation();const now=Date.now();if(now-last<3000)return;last=now;const i=+x.dataset.i;close();
  __emoShow(0,i);b.classList.add('cd');setTimeout(()=>b.classList.remove('cd'),3000);
  if(window.__lvEmo&&__lvEmo(i))return;
  /* computer opponents answer now and then */
  if(Date.now()-aiT>8000&&Math.random()<.55){aiT=Date.now();const R={0:[0,2],1:[1,0],2:[3,2],3:[4,3],4:[3,5],5:[2,3]}[i]||[0];setTimeout(()=>{if(inMatch())__emoShow(1,R[Math.floor(Math.random()*R.length)])},1100+Math.random()*1600)}};
 document.addEventListener('pointerdown',e=>{if(p.style.display==='grid'&&!p.contains(e.target)&&e.target!==b)close()},true);
 setInterval(()=>{const ok=inMatch();if(!ok){b.style.display='none';close();return}const rs=document.getElementById('rs').getBoundingClientRect();
  b.style.display='block';b.style.left=(rs.right+8)+'px';b.style.top=(rs.top+(rs.height-44)/2)+'px'},400);
}catch(e){console.warn('v4 emotes',e)}})();
