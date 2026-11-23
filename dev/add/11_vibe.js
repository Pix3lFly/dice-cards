/* V4 "vibrant cartoon" board pass (23 Nov). Every change has its own switch; set it to 0 to turn that change off.
   sat    – richer colours on the 3D board (saturation/contrast filter on the board canvas)
   bright – heroes lit brighter and softer (less dark shading on the new hero models)
   bob    – heroes "breathe" when standing still (small squash and stretch)
   ring   – glowing ring under each hero: blue = you, red = enemy (hidden while hopping) */
(function(){try{
const C=window.__VIBE=Object.assign({sat:1,bright:1,bob:1,ring:1},window.__VIBE||{});
(function wait(){const G=window.__3;if(!(G&&G.H&&G.V&&G.S&&window.__R)){setTimeout(wait,600);return}start(G)})();
function start(G){const V=G.V,R=window.__R;
 if(C.sat)try{R.domElement.style.filter='saturate(1.18) contrast(1.05) brightness(1.03)'}catch(e){}
 const LIFT=[196,212,226,238,248,255],done=new WeakSet();
 function brighten(m){if(done.has(m))return;done.add(m);m.traverse(o=>{if(!o.isMesh)return;(Array.isArray(o.material)?o.material:[o.material]).forEach(mt=>{const g=mt&&mt.gradientMap;if(!g||!g.image||!g.image.data||g.userData.__vb)return;const d=g.image.data;if(d.length!==LIFT.length)return;g.userData.__vb=1;for(let i=0;i<d.length;i++)d[i]=LIFT[i];g.needsUpdate=true})})}
 const RC=[0x4fc8ff,0xff5a5a],rings=[null,null];
 function ring(h,k,t){let r=rings[k];if(!r||r.parent!==h){const g=new V.Group();
   const a=new V.Mesh(new V.RingGeometry(.36,.5,40),new V.MeshBasicMaterial({color:RC[k],transparent:true,opacity:.6,depthWrite:false,side:V.DoubleSide,fog:false}));
   const b=new V.Mesh(new V.CircleGeometry(.36,40),new V.MeshBasicMaterial({color:RC[k],transparent:true,opacity:.16,depthWrite:false,side:V.DoubleSide,fog:false}));
   a.rotation.x=b.rotation.x=-Math.PI/2;a.renderOrder=b.renderOrder=2;g.add(b);g.add(a);g.position.y=.03;g.userData.__ring=1;h.add(g);rings[k]=r=g}
  const busy=!!(G.hop&&G.hop[k]);r.visible=!busy&&h.visible!==false;
  const p=.5+.5*Math.sin(t*3+k*1.3);r.children[1].material.opacity=.45+.3*p;r.children[0].material.opacity=.1+.1*p;const s=1+.04*p;r.scale.set(s,1,s)}
 const t0=performance.now();
 function tick(){const t=(performance.now()-t0)/1000;
  (G.H||[]).forEach((h,k)=>{if(!h||k>1)return;const m=h.userData&&h.userData.m;
   if(m&&C.bright)brighten(m);
   if(m&&C.bob&&!m.userData.rig){const inner=m.children&&m.children.find(c=>!c.userData.__ring);if(inner){if(!inner.userData.__bs)inner.userData.__bs=inner.scale.clone();const bs=inner.userData.__bs,busy=!!(G.hop&&G.hop[k]),s=busy?0:Math.sin(t*2.6+k*1.7);inner.scale.set(bs.x*(1-.022*s),bs.y*(1+.032*s),bs.z*(1-.022*s))}}
   if(C.ring)ring(h,k,t);else if(rings[k]){rings[k].visible=false}})}
 const rr=R.render.bind(R);R.render=function(a,b){if(a===G.S){try{tick()}catch(e){}}return rr(a,b)};
}
}catch(e){console.log('v4 vibe',e)}})();
