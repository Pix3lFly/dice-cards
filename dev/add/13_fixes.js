/* V4 25 Nov board fixes:
   1. win/lose window waits until the last hit has landed (the HP bar shows 0)
   2. Sudden death: big banner + "the board has changed" line
   3. landing marker on portal tiles sits on top of the portal floor (it was inside it and flickered) */
(function(){try{
/* 1 */
(function w(){const ov=document.getElementById('ov');if(!ov){setTimeout(w,300);return}
 let shownAt=0,timer=null;
 const quit=()=>{try{return /forfeit|left the match|gave up|You left/i.test((document.getElementById('ovt')||{}).textContent||'')}catch(e){return false}};
 const hpZero=()=>[...document.querySelectorAll('.hc .bar span')].some(s=>/(^|\s)0\//.test(s.textContent));
 const release=()=>{ov.classList.remove('v4wait');clearInterval(timer);timer=null};
 new MutationObserver(()=>{const vis=ov.style.display==='flex';
  if(!vis){release();shownAt=0;return}
  if(shownAt)return;shownAt=Date.now();
  if(quit())return;
  ov.classList.add('v4wait');
  timer=setInterval(()=>{if(hpZero()){clearInterval(timer);timer=null;setTimeout(()=>ov.classList.remove('v4wait'),1100)}else if(Date.now()-shownAt>9000)release()},100)
 }).observe(ov,{attributes:true,attributeFilter:['style']});
 const st=document.createElement('style');st.textContent='#ov.v4wait{visibility:hidden!important;pointer-events:none!important}';document.head.appendChild(st)})();

/* 2 */
window.__sdPop=function(){try{
 let d=document.getElementById('v4sd');if(d)d.remove();d=document.createElement('div');d.id='v4sd';
 d.innerHTML='<b>SUDDEN DEATH!</b><span>The board has changed — only Attack, Trap and level-3 Magic Book tiles from now on!</span>';
 document.body.appendChild(d);setTimeout(()=>d.classList.add('out'),3200);setTimeout(()=>d.remove(),3800)}catch(e){}};
(function(){const st=document.createElement('style');st.textContent=`
#v4sd{position:fixed;left:0;right:0;top:34%;z-index:40;display:flex;flex-direction:column;align-items:center;gap:10px;pointer-events:none;animation:v4sdIn .5s cubic-bezier(.2,1.5,.4,1) both;transition:opacity .5s}
#v4sd.out{opacity:0}
#v4sd b{font:400 clamp(46px,15vw,92px)/.95 'Lilita One',system-ui,sans-serif;letter-spacing:1px;color:#ff4a3a;-webkit-text-stroke:3px #2a0606;paint-order:stroke fill;text-shadow:0 5px 0 #2a0606,0 0 26px #ff3a2acc;transform:rotate(-4deg);text-align:center}
#v4sd span{max-width:min(88vw,420px);text-align:center;font:400 clamp(15px,4.4vw,20px)/1.25 'Lilita One',system-ui,sans-serif;color:#fff2d8;background:#2a0606dd;border:2px solid #ff6a4a;border-radius:12px;padding:8px 14px;box-shadow:0 4px 12px #000a}
@keyframes v4sdIn{from{transform:scale(2.2);opacity:0}}`;document.head.appendChild(st)})();

/* 3 */
(function w(){const G=window.__3;if(!(G&&G.tiles&&G.V&&window.__portSpot)){setTimeout(w,800);return}const V=G.V;
 setInterval(()=>{try{[6,18].forEach(i=>{const o=G.tiles[i];if(!o||!o.g)return;const m=o.g.children.find(c=>c.userData&&c.userData.__mine);if(!m||!m.visible)return;
  const sp=window.__portSpot(i);if(!sp)return;const wp=new V.Vector3();m.getWorldPosition(wp);const loc=o.g.worldToLocal(new V.Vector3(wp.x,sp.y+.05,wp.z));
  if(Math.abs(m.position.y-loc.y)>.01)m.position.y=loc.y})}catch(e){}},200)})();
}catch(e){console.log('v4 fixes',e)}})();
