/* ===== v4 (27 Nov): Pix's 3D floating island (Meshy "Floating Island Diorama") as the centre island under the board.
   File m/island3.js (the .glb as base64) (texture seams kept, extra-fine triangles merged: 2.25M → 273k triangles, looks the same).
   The tiles sit on its grass rim, the dice lands on its orange ring in the middle.
   Settings → Centre island: 3D model (default) / Picture / 3D (old). Tuning: window.__ip ===== */
(function(){const P=window.__ip=Object.assign({sx:5.4,sy:5.52,sz:6.0,y:-3.38,ry:0,lit:0,k:1.8,wl:.45},window.__ip||{});
 const MODE=()=>{try{return localStorage.getItem('dc_isl')||'model'}catch(e){return 'model'}};
 window.__islMode=MODE;
 let G3=null,loading=false,failed=false;
 function load(G){if(loading||G3||failed)return;const L=G.V.GLTFLoader||window.THREE&&THREE.GLTFLoader;if(!L)return;loading=true;
  const go=()=>{try{const s=atob(window.__ISL3B64),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);window.__ISL3B64=null;
   new L().parse(u.buffer,'',g=>{const V=G.V;g.scene.traverse(o=>{if(!o.isMesh)return;const m=o.material,map=m&&m.map;
    if(map){map.encoding=V.LinearEncoding;map.anisotropy=4;map.needsUpdate=true}o.material=P.lit?new V.MeshLambertMaterial({map}):new V.MeshBasicMaterial({map,fog:false,toneMapped:false});{const C=o.material.color;['set','setRGB','setHex','setHSL','copy','multiplyScalar','lerp','offsetHSL','multiply','lerpColors'].forEach(f=>{C[f]=function(){return C}})}o.material.userData.__ct=1;o.material.userData.__pcel=1;o.userData.__nt=1;o.userData.__mine=1;o.frustumCulled=false;o.renderOrder=-4});
   /* the camera looks down steeply, so the rocky underside is drawn deeper (only below the water line) to show like the picture */
   g.scene.traverse(o=>{if(!o.isMesh)return;const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++){const y=p.getY(i);if(y<P.wl)p.setY(i,P.wl+(y-P.wl)*P.k)}p.needsUpdate=true;o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere()});
   G3=g.scene;G3.userData.__mine=1;G3.name='island3';loading=false;window.__isl3=G3},e=>{console.warn('island3 parse',e);failed=true;loading=false})}catch(e){console.warn('island3',e);failed=true;loading=false}};
  if(window.__ISL3B64){go();return}
  const sc=pre();sc.addEventListener('load',go);sc.addEventListener('error',()=>{failed=true;loading=false})}
 /* start downloading early, while the player is still in the menus */
 function pre(){let sc=document.getElementById('isl3js');if(!sc){sc=document.createElement('script');sc.id='isl3js';sc.src='m/island3.js?v=1';document.head.appendChild(sc)}return sc}
 setTimeout(()=>{if(MODE()==='model')pre()},4000);
 function tick(){try{if(window.__covered&&window.__covered())return;const G=window.__3;if(!G||!G.S||!G.V)return;const on=MODE()==='model';
  window.__pondImg=MODE()==='3d'?0:1;
  if(on&&!G3)load(G);window.__isl3on=!!(on&&G3);
  if(!G3)return;if(G3.parent!==G.S)G.S.add(G3);G3.visible=on;if(!on)return;
  G3.position.set(0,P.y,0);G3.scale.set(P.sx,P.sy,P.sz);G3.rotation.y=P.ry;
  /* the dice never sinks into the ring (top of the ring + half the dice) */
  window.__dieFloor=P.y+.671*P.sy+.52}catch(e){}}
 const loop=()=>{tick();requestAnimationFrame(loop)};requestAnimationFrame(loop);
})();
