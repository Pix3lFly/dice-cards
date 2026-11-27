/* ===== v4 (26 Nov): Pix's hand-drawn pond picture used directly as the centre island.
   It is a flat picture that always faces the camera and sits BEHIND the board, so tiles, bases, items and heroes
   are drawn over it and the water fills the gaps. window.__pondImg=0 → the 3D pond (backup) instead.
   Tuning: __pp = {d: push-back distance, w: picture width (world units at the board centre), ax/ay: anchor (ring) in the picture, y: anchor height} ===== */
(function(){const P=window.__pp=Object.assign({d:7,w:12.32,sy:1,ax:.478,ay:.34,y:.6},window.__pp||{});
 let M=null,ISL=null;
 /* speed (27 Nov): the board is hidden behind full screen menus, so nothing to update there; the clean-up scans run while the scene is changing, then only every few seconds */
 const _m=document.getElementById('menu'),_sp=document.getElementById('splash');
 window.__covered=()=>(_m&&_m.style.display==='flex')||(_sp&&_sp.style.display!=='none'&&_sp.offsetWidth>0);
 let _sig='',_quiet=0;
 const tick=()=>{try{if(window.__covered())return;const G=window.__3;if(G&&G.S){const sg=G.S.children.length+'_'+((G.tiles||[]).length)+'_'+(typeof gid!=='undefined'?gid:0);if(sg!==_sig){_sig=sg;_quiet=0}else _quiet++}
  const scan=_quiet<900||_quiet%300<3;if(!G||!G.S||!G.cam||!G.V||!window.__PONDIMG)return;const V=G.V,S=G.S,cam=G.cam,on=window.__pondImg!==0;
  if(!M){const tx=new V.TextureLoader().load(window.__PONDIMG,t=>{const im=t.image;M.userData.ar=im.height/im.width});tx.minFilter=V.LinearMipmapLinearFilter;tx.anisotropy=4;
   M=new V.Mesh(new V.PlaneGeometry(1,1),new V.MeshBasicMaterial({map:tx,transparent:true,alphaTest:.35,depthWrite:false,fog:false,toneMapped:false}));
   M.userData.ar=1001/1024;{const C=M.material.color;['set','setRGB','setHex','setHSL','copy','multiplyScalar','lerp','offsetHSL','multiply','lerpColors'].forEach(f=>{C[f]=function(){return C}});M.material.userData.__ct=1;M.material.userData.__pcel=1;M.userData.__nt=1}M.renderOrder=-5;M.frustumCulled=false;M.userData.__mine=1;S.add(M);window.__pondPic=M}
  if(M.parent!==S)S.add(M);
  M.visible=on;if(window.__pondG)window.__pondG.visible=!on;
  /* the old rocky underside of the centre island would show in front of the picture */
  if(!ISL){const b=new V.Box3(),sz=new V.Vector3();S.children.forEach(o=>{if(o===M||!o.isGroup)return;b.setFromObject(o);if(b.isEmpty())return;b.getSize(sz);if(sz.x>5.5&&sz.x<7.5&&sz.y>6&&b.max.y<0)ISL=o})}
  if(ISL)ISL.visible=!on;
  /* any other flat centre-island part (old grass/rock top) also hides behind... in front of the picture: hide while the picture is used */
  if(on&&scan&&((tick.n=(tick.n||0)+1)%15==0||tick.n<3)){const b=new V.Box3(),sz=new V.Vector3(),c=new V.Vector3(),T=new Set((G.tiles||[]).map(o=>o&&o.g));
   S.children.forEach(o=>{if(o===M||o===window.__pondG||o===ISL||T.has(o)||!o.visible)return;if(o.isSprite||o.isPoints)return;b.setFromObject(o);if(b.isEmpty())return;b.getSize(sz);b.getCenter(c);
    if(sz.x>3&&sz.z>3&&sz.x<9&&b.max.y<.75&&Math.hypot(c.x,c.z)<1.5){o.visible=false;(window.__pondHid=window.__pondHid||[]).push(o)}})}
  /* leftover outline lines of the old centre platform (the gold squares) */
  if(on&&scan&&tick.n%15==1){const b=new V.Box3(),c=new V.Vector3(),T=new Set((G.tiles||[]).map(o=>o&&o.g));
   S.traverse(o=>{if(!o.isMesh||!o.visible)return;const gp=o.geometry&&o.geometry.parameters,bar=o.geometry&&o.geometry.type==='BoxGeometry'&&gp&&Math.min(gp.width,gp.height,gp.depth)<.1&&Math.max(gp.width,gp.depth)>1.2;if(!(o.userData.__olc||o.userData.ol||bar))return;let p=o.parent;while(p&&p!==S){if(T.has(p)||p===window.__pondG||p===M)return;p=p.parent}
    b.setFromObject(o);if(b.isEmpty())return;b.getCenter(c);if(Math.hypot(c.x,c.z)<2.2&&b.max.y<.8&&b.min.y>-1){window.__pondHide(o);if(o.parent&&o.parent!==S&&o.parent.isMesh)window.__pondHide(o.parent)}})}
  /* catch-all: any other flat mesh lying over the middle (phones built the old centre differently) */
  if(on&&scan&&tick.n%15==2){const b=new V.Box3(),c=new V.Vector3(),sz=new V.Vector3(),T=new Set((G.tiles||[]).map(o=>o&&o.g)),H=new Set(G.H||[]);
   S.traverse(o=>{if(!(o.isMesh||o.isLine||o.isLineSegments)||!o.visible||o===M)return;let p=o;while(p&&p!==S){if(T.has(p)||H.has(p)||p===G.die||p===window.__pondG||p===M||p.isSprite)return;p=p.parent}
    const g=o.geometry&&o.geometry.type;if(g==='OctahedronGeometry')return;b.setFromObject(o);if(b.isEmpty())return;b.getCenter(c);b.getSize(sz);
    if(Math.hypot(c.x,c.z)<2.4&&b.min.y>-1.3&&b.max.y<1.15&&Math.max(sz.x,sz.z)>.6)window.__pondHide(o)})}
  if(!on&&window.__pondHid){window.__pondHid.forEach(o=>o.visible=true);window.__pondHid=null}
  if(!on){try{if(G.die){G.die.position.x=0;G.die.position.z=0}}catch(e){}return}
  const A=new V.Vector3(0,P.y,0),dir=A.clone().sub(cam.position);const dist=dir.length();dir.normalize();
  const pos=A.clone().addScaledVector(dir,P.d),k=(dist+P.d)/dist;
  M.quaternion.copy(cam.quaternion);const w=P.w*k,h=w*M.userData.ar*(P.sy||1);M.scale.set(w,h,1);
  /* shift so the picture's gold ring (ax,ay) lands on the anchor */
  const right=new V.Vector3(1,0,0).applyQuaternion(cam.quaternion),up=new V.Vector3(0,1,0).applyQuaternion(cam.quaternion);
  pos.addScaledVector(right,(.5-P.ax)*w).addScaledVector(up,(P.ay-.5)*h);M.position.copy(pos);
  /* the dice lands just above the picture's gold ring: slide it (x/z only, the game only moves y) */
  try{const d=G.die;if(d){if(window.__dieOff){const og=window.__dieOff;if(d.parent===og){S.add(d)}og.position.set(0,0,0)}
   const ring=new V.Vector3(P.ax-.5,.5-(P.ry||.468),0);M.updateMatrixWorld(true);ring.applyMatrix4(M.matrixWorld).project(cam);const ty=ring.y+(P.dUp==null?.07:P.dUp);
   const yy=d.position.y;if(window.__dieMin==null||yy<window.__dieMin)window.__dieMin=yy;const f=new V.Vector3(cam.position.x,0,cam.position.z).normalize(),Y=P.dY||(window.__dieMin+.06),v=new V.Vector3();let lo=-3,hi=3;
   for(let it=0;it<22;it++){const m=(lo+hi)/2;v.set(f.x*m,Y,f.z*m).project(cam);if(v.y>ty)lo=m;else hi=m}const t=(lo+hi)/2;d.position.x=f.x*t;d.position.z=f.z*t}}catch(e){}}catch(e){}};
 const loop=()=>{tick();requestAnimationFrame(loop)};requestAnimationFrame(loop)})();
/* Settings: pick the centre island (picture or the 3D backup); remembered on this phone */
try{if(localStorage.getItem('dc_pond3d')==='1')window.__pondImg=0}catch(e){}
setInterval(()=>{try{const b=document.querySelector('#mb .sset .sbub');if(!b||b.querySelector('.pondset'))return;const r=document.createElement('label');r.className='srow fr3 st pondset';
 r.innerHTML='<span>Centre island</span><select><option value="pic">Picture</option><option value="3d">3D</option></select>';const sel=r.querySelector('select');sel.value=window.__pondImg===0?'3d':'pic';
 sel.onchange=()=>{window.__pondImg=sel.value==='3d'?0:1;try{localStorage.setItem('dc_pond3d',sel.value==='3d'?'1':'0')}catch(e){}};
 const g=[...b.children].find(x=>/Graphics|الرسومات/.test(x.textContent));g?g.after(r):b.appendChild(r)}catch(e){}},500);
