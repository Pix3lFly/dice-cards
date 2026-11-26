/* ===== v4 (26 Nov): long card titles (e.g. "ARCANE TOME") are squeezed to fit the card instead of being cut off ===== */
(function(){const fit=()=>{try{document.querySelectorAll('#hand .c>b').forEach(b=>{const w=b.clientWidth;if(!w)return;const key=b.textContent+'|'+w;if(b.dataset.fit===key)return;
 let s=b.querySelector(':scope>.cft');if(!s){s=document.createElement('span');s.className='cft';s.textContent=b.textContent;b.textContent='';b.appendChild(s)}
 s.style.transform='';const nw=s.scrollWidth||s.getBoundingClientRect().width;const k=nw>w-2?(w-2)/nw:1;s.style.transform=k<1?'scaleX('+k.toFixed(3)+')':'';b.dataset.fit=key})}catch(e){}};
 setInterval(fit,250)})();
