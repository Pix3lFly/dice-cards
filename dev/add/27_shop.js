/* ===== v4 (26 Nov): Shop restyled to match Battle / Collection (navy panels, gold frames, ribbon titles) ===== */
(function w(){if(typeof menu!=='function'){setTimeout(w,400);return}
 const CO='<i class="cco tl"></i><i class="cco tr"></i><i class="cco bl"></i><i class="cco br"></i>';
 function deco(){const m=document.getElementById('mb');if(!m)return;const on=typeof tab!=='undefined'&&tab==='shop'&&!!m.querySelector('.stabs')&&!!m.querySelector('.ogr');m.classList.toggle('sh4',on);if(!on)return;
  const p=m.querySelector(':scope>.spn2');}
 const _m=menu;menu=function(){const r=_m.apply(this,arguments);try{deco()}catch(e){}return r};setInterval(()=>{try{deco()}catch(e){}},700)})();
