/* ===== v4 (27 Nov): Achievements — "Claim all" when rewards are waiting ===== */
(function w(){if(typeof SV==='undefined'||typeof ACH==='undefined'||typeof menu!=='function'){setTimeout(w,500);return}try{
 const st=document.createElement('style');st.textContent=`
#menu .acall{display:block;margin:6px auto 2px;padding:6px 18px;border-radius:11px;border:2px solid #7a4a0e;background:linear-gradient(#ffe9a6,#f5c242 50%,#d4901c);font:400 16px 'Lilita One',system-ui,sans-serif;color:#3a2006;box-shadow:inset 0 2px 0 #fff3c4,0 3px 0 #5a3608;cursor:pointer;animation:acp 1.2s ease-in-out infinite alternate}
@keyframes acp{to{filter:brightness(1.12)}}`;document.head.appendChild(st);
 const ready=()=>(window.__achV?__achV():ACH).filter(a=>{try{return !SV.ach[a[0]]&&a[3]()>=a[4]}catch(e){return false}});
 window.__achAll=()=>{let g=0,m=0,n=0;const cl=window.cla||(typeof cla==='function'?cla:null);if(!cl)return;
  for(let t=0;t<80;t++){const L=ready();if(!L.length)break;L.forEach(a=>{if(SV.ach[a[0]])return;const g0=SV.gold,m0=SV.gems;try{cl(a[0])}catch(e){}if(SV.ach[a[0]]){n++;g+=SV.gold-g0;m+=SV.gems-m0}})}
  try{menu()}catch(e){}
  if(n)try{const d=document.createElement('div');d.className='m3note';d.textContent='Claimed '+n+' rewards: +'+g+' gold'+(m?', +'+m+' gems':'');document.body.appendChild(d);setTimeout(()=>d.remove(),2600);window.__sfx&&__sfx.chest&&__sfx.chest()}catch(e){}};
 setInterval(()=>{try{if(typeof tab==='undefined'||tab!=='jour'||typeof JT==='undefined'||JT!=='ach')return;const h=document.querySelector('#mb .spn2 .shd');if(!h)return;
  const n=ready().length,b=h.parentElement.querySelector('.acall');if(n<1){if(b)b.remove();return}
  const t='Claim all ('+n+')';if(b){if(b.dataset.n!=n){b.dataset.n=n;b.textContent=t}return}
  h.insertAdjacentHTML('afterend','<button class="acall" data-n="'+n+'" onclick="__achAll()">'+t+'</button>')}catch(e){}},400);
}catch(e){console.warn('v4 claim all',e)}})();
