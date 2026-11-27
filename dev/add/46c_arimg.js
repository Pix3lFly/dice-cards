/* ===== v4 (27 Nov): Arabic — some buttons and banners are pictures with English words painted in. In Arabic the words are covered
   with a plate in the picture's own colours (read from the picture) and the Arabic words are written on top. ===== */
(function w(){if(typeof SV==='undefined'||!document.body){setTimeout(w,300);return}try{
 const st=document.createElement('style');st.textContent=`
.arc4{position:absolute;display:flex;align-items:center;justify-content:center;text-align:center;pointer-events:none;z-index:3;overflow:hidden;line-height:1.05;white-space:nowrap;
 font-family:system-ui,'Noto Sans Arabic',Tahoma,sans-serif;font-weight:800;letter-spacing:0!important}
.arc4.two{white-space:pre-line}`;document.head.appendChild(st);
 const cache=new Map();
 const load=src=>{if(cache.has(src))return cache.get(src);const p=new Promise(res=>{const im=new Image();im.onload=()=>{try{const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const x=c.getContext('2d');x.drawImage(im,0,0);res({c,x,w:c.width,h:c.height})}catch(e){res(null)}};im.onerror=()=>res(null);im.src=src});cache.set(src,p);return p};
 /* colour of one edge of the area: the middle value of each channel, so the painted letters are left out */
 const edge=(D,x0,x1,y)=>{const R=[],G=[],B=[];const yy=Math.max(0,Math.min(D.h-1,Math.round(y)));const d=D.x.getImageData(Math.round(x0),yy,Math.max(1,Math.round(x1-x0)),1).data;
  for(let i=0;i<d.length;i+=4){if(d[i+3]<200)continue;R.push(d[i]);G.push(d[i+1]);B.push(d[i+2])}const m=a=>{if(!a.length)return 60;a.sort((p,q)=>p-q);return a[a.length>>1]};return 'rgb('+m(R)+','+m(G)+','+m(B)+')'};
 /* colour down one column of the picture (x), as gradient stops */
 const col=(D,x,y0,y1)=>{const st=[];for(let k=0;k<=6;k++){const y=y0+(y1-y0)*k/6;const d=D.x.getImageData(Math.max(0,Math.min(D.w-3,Math.round(x)-1)),Math.max(0,Math.min(D.h-1,Math.round(y))),3,1).data;st.push([d[0]+d[4]+d[8],d[1]+d[5]+d[9],d[2]+d[6]+d[10]].map(v=>Math.round(v/3)))}return st};
 /* cover the box f={x,y,w,h} (parts of the picture, 0..1) of the picture shown at r={x,y,w,h} inside host */
 async function cover(host,src,f,txt,o){o=o||{};if(!host||host.dataset.arc===txt)return;host.dataset.arc=txt;const D=await load(src);if(!D)return;
  [...host.querySelectorAll(':scope>.arc4')].forEach(e=>e.remove());
  if(getComputedStyle(host).position==='static')host.style.position='relative';
  const r=o.rect?o.rect():{x:o.img.offsetLeft,y:o.img.offsetTop,w:o.img.offsetWidth,h:o.img.offsetHeight};
  const a=col(D,(f.x-.012)*D.w,f.y*D.h,(f.y+f.h)*D.h),b=col(D,(f.x+f.w+.012)*D.w,f.y*D.h,(f.y+f.h)*D.h);
  const stops=a.map((c,k)=>'rgb('+c.map((v,j)=>Math.round((v+b[k][j])/2)).join(',')+') '+Math.round(k*100/6)+'%').join(',');
  const d=document.createElement('div');d.className='arc4'+(o.two?' two':'');d.textContent=txt;
  Object.assign(d.style,{left:r.x+f.x*r.w+'px',top:r.y+f.y*r.h+'px',width:f.w*r.w+'px',height:f.h*r.h+'px',background:'linear-gradient('+stops+')',borderRadius:(o.r||6)+'px',
   color:o.c||'#fff6dc',fontSize:(o.fs||13)+'px',textShadow:o.sh||'0 1px 0 #000a,0 0 2px #000a,0 0 1px #000'});
  host.appendChild(d)}
 const bgOf=e=>{const m=/url\("?(.*?)"?\)$/.exec(getComputedStyle(e).backgroundImage||'');return m?m[1]:''};
 const NAV={shop:'المتجر',coll:'الترسانة',main:'العب',comm:'اجتماعي',jour:'المهام'};
 function scan(){if(SV.lang!=='ar')return;
  /* bottom menu */
  document.querySelectorAll('#nv button').forEach(b=>{const k=(/m3go\('(\w+)'\)/.exec(b.getAttribute('onclick')||'')||[])[1];const t=NAV[k];if(!t)return;const src=bgOf(b);if(!src)return;
   const key=t+(b.classList.contains('on')?'1':'0');if(b.dataset.arc===key)return;b.dataset.arc='';cover(b,src,{x:.14,y:.63,w:.72,h:.24},t,{fs:13.5,r:5,rect:()=>{const W=b.clientWidth,H=b.clientHeight;return load(src)&&{x:0,y:0,w:W,h:H}}}).then(()=>{b.dataset.arc=key;const d=b.querySelector('.arc4');if(d)d.textContent=t})});
  /* section banners on the Play page */
  const tt=document.querySelectorAll('#mb .b4t');tt.forEach((h,i)=>{const im=h.querySelector('img');if(!im||!im.complete)return;cover(h,im.src,{x:.17,y:.17,w:.72,h:.64},i===0?'اختر بطلك':'اختر قاعدتك',{img:im,fs:17,c:'#fff3d0',r:3})});
  /* Casual / Ranked buttons */
  document.querySelectorAll('#mb button.b4m').forEach((b,i)=>{const im=b.querySelector('img');if(!im||!im.complete)return;const rk=/rank/i.test(b.getAttribute('onclick')||'')||i===1;
   cover(b,im.src,rk?{x:.415,y:.19,w:.49,h:.62}:{x:.44,y:.19,w:.46,h:.62},rk?'مباراة\nمصنفة':'مباراة\nودية',{img:im,two:1,fs:15,c:'#ffe9a8',r:3})});
  /* "Choose a hero first" plates */
  document.querySelectorAll('#mb img.b4wt').forEach(im=>{const h=im.parentElement;if(!h||!im.complete)return;const base=/base/i.test(im.getAttribute('src')||'')&&0;cover(h,im.src,{x:.235,y:.17,w:.69,h:.66},'اختر بطلًا أولًا',{img:im,fs:12.5,c:'#3a2006',sh:'none',r:4})});
 }
 setInterval(()=>{try{scan()}catch(e){}},500);
 window.__arcScan=scan;
}catch(e){console.warn('v4 arabic pictures',e)}})();
