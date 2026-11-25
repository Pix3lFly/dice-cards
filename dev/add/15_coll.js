/* V4 Collection on PC (landscape): the Heroes page is laid out as if the browser were zoomed to 80% (bigger hero, smaller upgrade boxes) */
(function w(){if(typeof menu!=='function'){setTimeout(w,300);return}
 const fix=()=>{try{const mb=document.getElementById('mb');if(!mb)return;const land=matchMedia('(orientation:landscape)').matches;
  const on=land&&mb.classList.contains('c3')&&!!mb.querySelector('.hv3,.dgd');
  if(!on){if(mb.dataset.z0){mb.style.zoom=mb.dataset.z0;mb.style.height=mb.dataset.h0;delete mb.dataset.z0;delete mb.dataset.h0}return}
  const z=parseFloat(mb.style.zoom||getComputedStyle(mb).zoom)||1,h=parseFloat(mb.style.height)||mb.getBoundingClientRect().height/z;
  if(mb.dataset.zv&&Math.abs(z-parseFloat(mb.dataset.zv))<.001)return;
  mb.dataset.z0=mb.style.zoom;mb.dataset.h0=mb.style.height;const nz=z*.8;mb.style.zoom=nz;mb.style.height=(h*z/nz)+'px';mb.dataset.zv=nz}catch(e){}};
 const _m=menu;menu=function(){const r=_m.apply(this,arguments);setTimeout(fix,0);setTimeout(fix,120);return r};
 addEventListener('resize',()=>setTimeout(fix,150));setInterval(fix,250)})();

/* V4 Collection → Bases: the real 3D base model turns slowly in the window (instead of the emoji badge) */
(function w(){if(typeof menu!=='function'||typeof BASES==='undefined'){setTimeout(w,400);return}
 let R=null,S,C,M=null,key=null,cv=null,raf=0,G=null;
 const keyOf=()=>{const n=(document.querySelector('#mb .bv3 .bnm3')||{}).textContent||'';return Object.keys(BASES).find(k=>n.toLowerCase().startsWith(String(BASES[k].n).toLowerCase()))};
 function init(){const T=window.THREE;if(!T)return false;if(R)return true;
  try{cv=document.createElement('canvas');cv.className='b3d';R=new T.WebGLRenderer({canvas:cv,alpha:true,antialias:true});R.setPixelRatio(Math.min(2,devicePixelRatio||1));
   S=new T.Scene();C=new T.PerspectiveCamera(30,1,.01,100);S.add(new T.AmbientLight(0xffffff,.9));const d=new T.DirectionalLight(0xffffff,.55);d.position.set(2,4,3);S.add(d);G=new T.Group();S.add(G);return true}catch(e){R=null;return false}}
 function setModel(k){const T=window.THREE,b=window.__BG&&window.__BG[k];if(!b)return false;if(key===k&&M)return true;
  if(M){G.remove(M);M=null}const g=b.geo;if(!g.attributes.normal)g.computeVertexNormals();g.computeBoundingBox();
  const mat=new T.MeshLambertMaterial({map:b.map||null,color:0xffffff});mat.emissive=new T.Color(0x555555);if(b.map)mat.emissiveMap=b.map;
  M=new T.Mesh(g,mat);const bb=g.boundingBox,c=bb.getCenter(new T.Vector3()),sz=bb.getSize(new T.Vector3());M.position.set(-c.x,-c.y,-c.z);
  G.add(M);const r=Math.max(sz.x,sz.z)*.62+sz.y*.2;C.position.set(0,r*1.05,r*2.1);C.lookAt(0,-sz.y*.05,0);key=k;return true}
 function loop(){raf=0;if(!cv||!cv.isConnected)return;const r=cv.getBoundingClientRect();if(r.width<2){raf=requestAnimationFrame(loop);return}
  const W=Math.round(r.width),H=Math.round(r.height);if(cv.width!==Math.round(W*R.getPixelRatio())||cv.height!==Math.round(H*R.getPixelRatio())){R.setSize(W,H,false);C.aspect=W/H;C.updateProjectionMatrix()}
  G.rotation.y=performance.now()/4000;try{R.render(S,C)}catch(e){}raf=requestAnimationFrame(loop)}
 function deco(){const st=document.querySelector('#mb .bv3 .bsh');if(!st)return;const k=keyOf(),A=window.__BT4||{};if(!k||!A[k]){st.classList.remove('b3on');return}
  let im=st.querySelector('img.b2d');if(!im){im=document.createElement('img');im.className='b2d';im.alt='';st.insertBefore(im,st.firstChild)}if(im.getAttribute('src')!==A[k])im.src=A[k];st.classList.add('b3on')}
 const _m=menu;menu=function(){const r=_m.apply(this,arguments);try{deco()}catch(e){console.log('b3d',e)}return r};setInterval(()=>{try{if(document.querySelector('#mb .bv3 .bsh:not(.b3on)'))deco()}catch(e){}},1000)})();
