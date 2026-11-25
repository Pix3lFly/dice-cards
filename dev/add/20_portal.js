/* V4: Pix's new 3D portal (Meshy, 25 Nov) on both portal corners (tiles 6 and 18).
   The old portal (floor + arch built by V3's "fixed portal layout") is hidden; the new model is placed like the new bases:
   its round platform sits on the corner tile, facing the middle island, at the same height and size as the base platforms.
   The hero's portal landing spot (window.__portSpot) is moved onto the round platform. */
(function(){try{
const PI=[6,18];let built={},spotFn=null;
const G3=()=>window.__3;
function ref(){const g=G3();let r=null;[0,12].forEach(i=>{const o=g.tiles&&g.tiles[i];if(!o||!o.g||r)return;o.g.traverse(m=>{if(!r&&m.isMesh&&m.userData.__nb)r={m,bt:o.__nbk}})});return r}
function TP(i){const g=G3(),V=g.V,t=g.tiles[i],v=new V.Vector3();t.g.updateMatrixWorld(true);t.g.getWorldPosition(v);return v}
function make(i,R){const g=G3(),V=g.V,S=g.S,B=window.__BG.portal2,Mt=window.__BGM.portal2;
 const mat=R.m.material.clone();if(mat.uniforms&&mat.uniforms.mp)mat.uniforms.mp.value=B.map;if(mat.uniforms&&mat.uniforms.ry)mat.uniforms.ry.value=-99;mat.userData.__ct=1;
 const m=new V.Mesh(B.geo,mat);m.castShadow=m.receiveShadow=true;m.userData.__mine=1;m.userData.__np4=i;
 // same size as the bases (they get ×1.2 on the board)
 const bs=R.m.userData.__bs||1.2,s=2.15/Mt.ext*bs*(window.__p4k||1.1);
 // platform height = the base platform height
 const RM=window.__BGM[R.bt];let py=null;if(RM){R.m.updateMatrixWorld(true);py=R.m.localToWorld(new V.Vector3(RM.px,RM.plat,RM.pz)).y}
 const w0=TP(i);if(py==null)py=w0.y+.06;{const l0=Math.hypot(w0.x,w0.z)||1,inn=window.__p4in!=null?window.__p4in:.38;w0.x-=w0.x/l0*inn;w0.z-=w0.z/l0*inn}
 const wa=TP((i+1)%24),wz=TP((i+23)%24),nl=v=>{const l=Math.hypot(v[0],v[1])||1;return[v[0]/l,v[1]/l]},A=nl([wa.x-w0.x,wa.z-w0.z]),Z=nl([wz.x-w0.x,wz.z-w0.z]);
 const rot=(v,r)=>[v[0]*Math.cos(r)+v[1]*Math.sin(r),-v[0]*Math.sin(r)+v[1]*Math.cos(r)];let best=null;
 for(const sx of[1,-1])for(const sw of[0,1]){const p1=sw?Mt.p2:Mt.p1,p2=sw?Mt.p1:Mt.p2,q2=[p2[0]*sx,p2[1]],q1=[p1[0]*sx,p1[1]];const r=Math.atan2(Z[0],Z[1])-Math.atan2(q2[0],q2[1]);const v1=rot(q1,r),sc=v1[0]*A[0]+v1[1]*A[1];if(!best||sc>best.sc+1e-6)best={sc,sx,r}}
 m.scale.set(s*best.sx,s,s);m.rotation.y=best.r;const l=rot([Mt.px*best.sx*s,Mt.pz*s],best.r);
 const wp=new V.Vector3(w0.x-l[0],py-Mt.plat*s,w0.z-l[1]);S.updateMatrixWorld(true);m.position.copy(S.worldToLocal(wp.clone()));
 // cartoon outline like the bases
 R.m.children.forEach(c=>{if(c.isMesh&&c.userData.__olc&&!m.userData.__ol){const ol=new V.Mesh(B.geo,c.material);ol.userData.__olc=1;ol.raycast=()=>{};m.add(ol);m.userData.__ol=1}});
 // spinning swirl inside the arch, seen from the front AND from the back
 try{if(window.__mkSwirl){const W=Mt.sw||[0,.06,-.32,.34,.37],cy=.12,w=W[3]*.92,h=.34;
  [[-.225,0],[-.385,Math.PI]].forEach(([z,ry])=>{const sw=window.__mkSwirl();if(!sw)return;sw.position.set(W[0],cy,z);sw.rotation.y=ry;sw.scale.set(w,h,1);sw.traverse(o=>{if(o.material){o.material.side=V.DoubleSide;o.material.depthWrite=false}});m.add(sw)})}}catch(e){ERR='swirl: '+(e&&e.message||e)}
 S.add(m);return {m,spot:new V.Vector3(w0.x,py,w0.z)}}
function hideOld(){const S=G3().S;S.children.forEach(c=>{if(c.userData&&c.userData.__port!=null&&c.visible)c.visible=false})}
let ST='start',ERR='',t0=Date.now(),warned=false,oldSpot=null;window.__p4=()=>ST+(ERR?' | '+ERR:'');
function tick(){const g=G3();
 if(!g||!g.S||!g.tiles){ST='no board';return}
 if(!window.__BG||!window.__BG.portal2){ST='portal model not loaded';return}
 if(!window.__BGM||!window.__BGM.portal2){ST='portal data missing';return}
 let tt=null;try{tt=T}catch(e){}if(!tt){ST='no tile list';return}if(tt[6]!=='portal'||tt[18]!=='portal'){ST='tiles 6/18 not portals: '+tt[6]+'/'+tt[18];return}
 if(window.__loadF&&window.__loadF()<1){ST='board loading';return}
 if(!g.tiles[6]||!g.tiles[6].g||!g.tiles[18]||!g.tiles[18].g){ST='portal tiles not built';return}
 const R=ref();if(!R){ST='no base model found';return}
 let ok=0;PI.forEach(i=>{const b=built[i];if(b&&b.m.parent===g.S){ok++;return}try{built[i]=make(i,R);ok++}catch(e){ERR='make '+i+': '+(e&&e.message||e)}});
 try{hideOld()}catch(e){ERR='hide: '+(e&&e.message||e)}
 ST='built '+ok+'/2';
 if(ok===2){if(!spotFn){oldSpot=window.__portSpot;spotFn=v=>{const b=built[v];return b?b.spot.clone():(oldSpot?oldSpot(v):null)}}if(window.__portSpot!==spotFn){if(window.__portSpot!==spotFn&&!oldSpot)oldSpot=window.__portSpot;window.__portSpot=spotFn}}}
setInterval(()=>{try{tick()}catch(e){ERR='tick: '+(e&&e.message||e)}
 try{if(!warned&&Date.now()-t0>20000&&G3()&&G3().S&&typeof P!=='undefined'&&P&&P[0]&&!/^built 2/.test(ST)){warned=true;console.log('Portal4: '+window.__p4())}}catch(e){}},400);
}catch(e){console.log('v4 portal',e)}})();
