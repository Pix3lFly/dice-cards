/* ===== v4 (27 Nov): Pix's 3D floating island (Meshy "Floating Island Diorama") as the centre island under the board.
   File m/island3.js (the .glb as base64) (texture seams kept, extra-fine triangles merged: 2.25M → 273k triangles, looks the same).
   The tiles sit on its grass rim, the dice lands on its orange ring in the middle.
   Settings → Centre island: 3D model (default) / Picture / 3D (old). Tuning: window.__ip ===== */
(function(){const P=window.__ip=Object.assign({sx:4.3,sy:3.4,sz:4.3,y:-1.33,ry:0,lit:0,k:4,wl:.45,sq:.95,D:2.1},window.__ip||{});
 const MODE=()=>{try{return localStorage.getItem('dc_isl')||'model'}catch(e){return 'model'}};
 window.__islMode=MODE;
 let G3=null,loading=false,failed=false;
 function load(G){if(loading||G3||failed)return;const L=G.V.GLTFLoader||window.THREE&&THREE.GLTFLoader;if(!L)return;loading=true;
  const go=()=>{try{const s=atob(window.__ISL3B64),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);window.__ISL3B64=null;
   new L().parse(u.buffer,'',g=>{const V=G.V;g.scene.traverse(o=>{if(!o.isMesh)return;const m=o.material,map=m&&m.map;
    if(map){map.encoding=V.LinearEncoding;map.anisotropy=4;map.needsUpdate=true}o.material=P.lit?new V.MeshLambertMaterial({map}):new V.MeshBasicMaterial({map,fog:false,toneMapped:false});{const C=o.material.color;['set','setRGB','setHex','setHSL','copy','multiplyScalar','lerp','offsetHSL','multiply','lerpColors'].forEach(f=>{C[f]=function(){return C}})}o.material.userData.__ct=1;o.material.userData.__pcel=1;o.userData.__nt=1;o.userData.__mine=1;o.frustumCulled=false;o.renderOrder=-4;
    /* drawn first like a backdrop: after it the depth is cleared, so tiles, bases and heroes always draw over it where they meet */
    o.onAfterRender=r=>{try{r.clearDepth()}catch(e){}};
    /* reference look: rocks a warmer brown (orange, saturated parts only; water, grass and the dais stay) */
    o.material.onBeforeCompile=sh=>{const wy=(P.y+P.wl*P.sy-.05).toFixed(3);
     sh.vertexShader='varying float vWy4;\n'+sh.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nvWy4=(modelMatrix*vec4(transformed,1.)).y;');
     sh.fragmentShader='varying float vWy4;\n'+sh.fragmentShader.replace('gl_FragColor = vec4( outgoingLight, diffuseColor.a );','{vec3 c=outgoingLight;float mx=max(c.r,max(c.g,c.b)),mn=min(c.r,min(c.g,c.b)),st=(mx-mn)/max(mx,.001);if(vWy4<'+wy+'&&c.r>c.g*1.12&&c.g>c.b*.9&&st>.3)outgoingLight=c*vec3(.84,.64,.5);}gl_FragColor = vec4( outgoingLight, diffuseColor.a );')};o.material.customProgramCacheKey=()=>'isl3grade2';o.material.needsUpdate=true});
   /* the underside below the water line: cliffs pulled down (×k near the top), easing into a broad bottom about D deep instead of a long spike */
   /* square board: the round island is pulled out to a square (outer part only, the middle dais stays round), so the pond fills the
      square inside the tiles and the rim runs under the tiles; size 1 = ±1 in x and z (scale = half width of the island) */
   g.scene.traverse(o=>{if(!o.isMesh)return;const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++){let u=p.getX(i)/.95,v=p.getZ(i)/.84;const r=Math.hypot(u,v),m=Math.max(Math.abs(u),Math.abs(v));
     if(r>1e-4){const t=Math.min(1,Math.max(0,(r-.45)/.35)),b=t*t*(3-2*t)*P.sq,f=1+(r/m-1)*b;u*=f;v*=f}p.setX(i,u);p.setZ(i,v)}});
   g.scene.traverse(o=>{if(!o.isMesh)return;const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++){const y=p.getY(i);if(y<P.wl)p.setY(i,P.wl-P.D*(1-Math.exp(-(P.wl-y)*P.k/P.D)))}p.needsUpdate=true;o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere()});
   /* dark ink outline around the island (same kind as the tiles': a back-face shell pushed out a few pixels on screen) */
   g.scene.traverse(o=>{if(!o.isMesh||o.userData.__olc)return;const om=new V.ShaderMaterial({side:V.BackSide,uniforms:{uW:{value:P.ow||.0045},uC:{value:new V.Color(window.__inkC||0x24140a)}},
     vertexShader:'uniform float uW;void main(){vec4 c=projectionMatrix*modelViewMatrix*vec4(position,1.0);vec3 n=normalize(normalMatrix*normal);vec2 q=(projectionMatrix*vec4(n,0.0)).xy;float l=length(q);if(l>1e-5)c.xy+=q/l*uW*c.w;gl_Position=c;}',
     fragmentShader:'uniform vec3 uC;void main(){gl_FragColor=vec4(uC,1.0);}'});om.userData.__ct=1;
    o.geometry.computeVertexNormals();const h=new V.Mesh(o.geometry,om);h.userData.__olc=1;h.userData.__mine=1;h.renderOrder=-5;h.frustumCulled=false;h.raycast=()=>{};o.add(h)});
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
