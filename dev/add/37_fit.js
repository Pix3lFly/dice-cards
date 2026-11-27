/* ===== v4 (27 Nov): small/short phones — the menus are laid out on a slightly bigger virtual screen and zoomed down,
   so nothing is cut off. Phones 380×760 and bigger are unchanged. ===== */
(function(){const fit=()=>{try{const M=document.getElementById('menu');if(!M)return;const W=innerWidth,H=innerHeight,z=Math.min(1,W/380,H/760);
  if(z>=.999){if(M.dataset.fz){M.style.zoom='';M.style.width='';M.style.height='';M.style.right='';M.style.bottom='';delete M.dataset.fz}return}
  const k=z.toFixed(3);if(M.dataset.fz===k+W+'x'+H)return;M.dataset.fz=k+W+'x'+H;M.style.zoom=k;M.style.right='auto';M.style.bottom='auto';M.style.width=(W/z)+'px';M.style.height=(H/z)+'px'}catch(e){}};
 /* match screen too: lay out at least 380 wide, zoomed down */
 const fitG=()=>{try{const A=document.getElementById('app');if(!A)return;const W=innerWidth,H=innerHeight,z=Math.min(1,W/380,H/700);if(z>=.999){if(A.dataset.fz){A.style.zoom='';A.style.width='';A.style.height='';delete A.dataset.fz;dispatchEvent(new Event('resize'))}return}
  const k=z.toFixed(3)+'|'+W+'x'+H;if(A.dataset.fz===k)return;A.dataset.fz=k;A.style.zoom=z.toFixed(3);A.style.width=(W/z)+'px';A.style.height=(H/z)+'px';setTimeout(()=>dispatchEvent(new Event('resize')),50)}catch(e){}};
 const f2=()=>{fit();fitG()};addEventListener('resize',()=>{fit()});setInterval(fitG,1000);fitG();setInterval(fit,1000);fit()})();
