/* ===== v4 (26 Nov): Community pages restyled (Pix's reference): class cm4 on #mb, section titles wrapped for ribbons ===== */
(function w(){if(typeof menu!=='function'){setTimeout(w,400);return}
 function deco(){const m=document.getElementById('mb');if(!m)return;const on=typeof tab!=='undefined'&&tab==='comm';m.classList.toggle('cm4',on);if(!on)return;
  const p=m.querySelector(':scope>.spn2');if(p&&!p.querySelector(':scope>.cco'))p.insertAdjacentHTML('beforeend','<i class="cco tl"></i><i class="cco tr"></i><i class="cco bl"></i><i class="cco br"></i>');
  m.querySelectorAll('.frh').forEach(h=>{if(h.querySelector('.frt'))return;h.innerHTML='<span class="frt">'+h.innerHTML+'</span>'})}
 const _m=menu;menu=function(){const r=_m.apply(this,arguments);try{deco()}catch(e){}return r};
 try{new MutationObserver(()=>{try{deco()}catch(e){}}).observe(document.getElementById('mb')||document.body,{childList:true})}catch(e){}
 setInterval(()=>{try{deco()}catch(e){}},700)})();
