/* ===== v4 (26 Nov): Pix's hand-drawn pond picture used directly as the centre island.
   It is a flat picture that always faces the camera and sits BEHIND the board, so tiles, bases, items and heroes
   are drawn over it and the water fills the gaps. window.__pondImg=0 → the 3D pond (backup) instead.
   Tuning: __pp = {d: push-back distance, w: picture width (world units at the board centre), ax/ay: anchor (ring) in the picture, y: anchor height} ===== */
(function(){const P=window.__pp=Object.assign({d:7,w:11.2,ax:.478,ay:.468,y:.6},window.__pp||{});
 let M=null,ISL=null;
 const tick=()=>{try{const G=window.__3;if(!G||!G.S||!G.cam||!G.V||!window.__PONDIMG)return;const V=G.V,S=G.S,cam=G.cam,on=window.__pondImg!==0;
  if(!M){const tx=new V.TextureLoader().load(window.__PONDIMG,t=>{const im=t.image;M.userData.ar=im.height/im.width});tx.minFilter=V.LinearMipmapLinearFilter;tx.anisotropy=4;
   M=new V.Mesh(new V.PlaneGeometry(1,1),new V.MeshBasicMaterial({map:tx,transparent:true,alphaTest:.35,depthWrite:false,fog:false,toneMapped:false}));
   M.userData.ar=1001/1024;M.renderOrder=-5;M.frustumCulled=false;M.userData.__mine=1;S.add(M);window.__pondPic=M}
  if(M.parent!==S)S.add(M);
  M.visible=on;if(window.__pondG)window.__pondG.visible=!on;
  /* the old rocky underside of the centre island would show in front of the picture */
  if(!ISL){const b=new V.Box3(),sz=new V.Vector3();S.children.forEach(o=>{if(o===M||!o.isGroup)return;b.setFromObject(o);if(b.isEmpty())return;b.getSize(sz);if(sz.x>5.5&&sz.x<7.5&&sz.y>6&&b.max.y<0)ISL=o})}
  if(ISL)ISL.visible=!on;
  /* any other flat centre-island part (old grass/rock top) also hides behind... in front of the picture: hide while the picture is used */
  if(on&&!(tick.n=(tick.n||0)+1)%15==0||on&&tick.n<3){const b=new V.Box3(),sz=new V.Vector3(),c=new V.Vector3(),T=new Set((G.tiles||[]).map(o=>o&&o.g));
   S.children.forEach(o=>{if(o===M||o===window.__pondG||o===ISL||T.has(o)||!o.visible)return;if(o.isSprite||o.isPoints)return;b.setFromObject(o);if(b.isEmpty())return;b.getSize(sz);b.getCenter(c);
    if(sz.x>3&&sz.z>3&&sz.x<9&&b.max.y<.75&&Math.hypot(c.x,c.z)<1.5){o.visible=false;(window.__pondHid=window.__pondHid||[]).push(o)}})}
  if(!on&&window.__pondHid){window.__pondHid.forEach(o=>o.visible=true);window.__pondHid=null}
  if(!on)return;
  const A=new V.Vector3(0,P.y,0),dir=A.clone().sub(cam.position);const dist=dir.length();dir.normalize();
  const pos=A.clone().addScaledVector(dir,P.d),k=(dist+P.d)/dist;
  M.quaternion.copy(cam.quaternion);const w=P.w*k,h=w*M.userData.ar;M.scale.set(w,h,1);
  /* shift so the picture's gold ring (ax,ay) lands on the anchor */
  const right=new V.Vector3(1,0,0).applyQuaternion(cam.quaternion),up=new V.Vector3(0,1,0).applyQuaternion(cam.quaternion);
  pos.addScaledVector(right,(.5-P.ax)*w).addScaledVector(up,(P.ay-.5)*h);M.position.copy(pos)}catch(e){}};
 const loop=()=>{tick();requestAnimationFrame(loop)};requestAnimationFrame(loop)})();
/* Settings: pick the centre island (picture or the 3D backup); remembered on this phone */
try{if(localStorage.getItem('dc_pond3d')==='1')window.__pondImg=0}catch(e){}
setInterval(()=>{try{const b=document.querySelector('#mb .sset .sbub');if(!b||b.querySelector('.pondset'))return;const r=document.createElement('label');r.className='srow fr3 st pondset';
 r.innerHTML='<span>Centre island</span><select><option value="pic">Picture</option><option value="3d">3D</option></select>';const sel=r.querySelector('select');sel.value=window.__pondImg===0?'3d':'pic';
 sel.onchange=()=>{window.__pondImg=sel.value==='3d'?0:1;try{localStorage.setItem('dc_pond3d',sel.value==='3d'?'1':'0')}catch(e){}};
 const g=[...b.children].find(x=>/Graphics/.test(x.textContent));g?g.after(r):b.appendChild(r)}catch(e){}},500);
