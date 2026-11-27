/* ===== v4 (27 Nov): Pix's floating-island tile (patches "island tile…", assets/tile_new.b64).
   The tile picture is shown as painted (like the centre island): no cel bands, no toy recolouring, no colour steps.
   Empty tiles keep a light tint so they still read differently. ===== */
(function(){if(!window.__TISL)return;
 const T=window.__tileLook=Object.assign({empty:0xe9dfcf},window.__tileLook||{});
 const fix=(m,e)=>{if(!m||!m.uniforms||m.userData.__tisl)return;const u=m.uniforms;m.userData.__tisl=1;
  if(u.sm)u.sm.value=0;if(u.ty)u.ty.value=0;if(u.ck)u.ck.value=0;if(u.cq)u.cq.value=255;if(u.ry)u.ry.value=-99;if(u.tn)u.tn.value.set(e?T.empty:0xffffff).multiplyScalar(1.0/0.95)};
 setInterval(()=>{try{const G=window.__3;if(!G||!G.tiles)return;G.tiles.forEach(o=>{if(!o||!o.cBlk)return;const m=o.cBlk.material;fix(m,o.t==='empty')})}catch(e){}},300);
})();
