/* ===== v4 (26 Nov): Collection → Deck restyle (class dk4); wraps section titles for ribbons. Cards untouched. ===== */
(function w(){if(typeof menu!=='function'){setTimeout(w,400);return}
 const CO='<i class="cco tl"></i><i class="cco tr"></i><i class="cco bl"></i><i class="cco br"></i>';
 function deco(){const m=document.getElementById('mb');if(!m)return;const on=typeof tab!=='undefined'&&tab==='coll'&&!!m.querySelector('.dgd');m.classList.toggle('dk4',on);if(!on)return;
  const p=m.querySelector(':scope>.spn2');if(p&&!p.querySelector(':scope>.cco'))p.insertAdjacentHTML('beforeend',CO);
  m.querySelectorAll('.dkh,.dgh').forEach(h=>{if(h.querySelector(':scope>.rb4'))return;const t=h.firstChild;if(!t||t.nodeType!==3||!t.textContent.trim())return;const s=document.createElement('span');s.className='rb4';s.textContent=t.textContent.trim();h.replaceChild(s,t)})}
 const _m=menu;menu=function(){const r=_m.apply(this,arguments);try{deco()}catch(e){}return r};
 try{new MutationObserver(()=>{try{deco()}catch(e){}}).observe(document.getElementById('mb'),{childList:true,subtree:true})}catch(e){}
 setInterval(()=>{try{deco()}catch(e){}},700)})();
