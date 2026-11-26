/* ===== v4 (26 Nov): Journal restyle (class jr4) ===== */
(function w(){if(typeof menu!=='function'){setTimeout(w,400);return}
 const CO='<i class="cco tl"></i><i class="cco tr"></i><i class="cco bl"></i><i class="cco br"></i>';
 function deco(){const m=document.getElementById('mb');if(!m)return;const on=typeof tab!=='undefined'&&tab==='jour';m.classList.toggle('jr4',on);if(!on)return;
  m.querySelectorAll(':scope>.spn2,:scope>.dq3,:scope>.csh').forEach(p=>{if(!p.querySelector(':scope>.cco'))p.insertAdjacentHTML('beforeend',CO)})}
 const _m=menu;menu=function(){const r=_m.apply(this,arguments);try{deco()}catch(e){}return r};setInterval(()=>{try{deco()}catch(e){}},700)})();
