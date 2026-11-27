/* ===== v4 (27 Nov): Pix's floating-island tile (patches "island tile…", assets/tile_new.b64).
   The tile picture is shown as painted (like the centre island): no cel bands, no toy recolouring, no colour steps.
   Empty tiles keep a light tint so they still read differently. ===== */
(function(){if(!window.__TISL)return;
 const T=window.__tileLook=Object.assign({empty:0xe9dfcf},window.__tileLook||{});
 const fix=(m,e)=>{if(!m||!m.uniforms||m.userData.__tisl)return;const u=m.uniforms;m.userData.__tisl=1;
  if(u.sm)u.sm.value=0;if(u.ty)u.ty.value=0;if(u.ck)u.ck.value=0;if(u.cq)u.cq.value=255;if(u.ry)u.ry.value=-99;if(u.tn)u.tn.value.set(e?T.empty:0xffffff).multiplyScalar(1.0/0.95);
  /* reference look: cream tile tops, warmer brown rocks (grass stays as painted) */
  const fs=m.fragmentShader,end='c=floor(c*cq+.5)/cq;gl_FragColor=vec4(c*s,1.);}';
  if(fs.indexOf(end)>0){m.fragmentShader='vec3 gr4(vec3 c,float ny){float mx=max(c.r,max(c.g,c.b)),mn=min(c.r,min(c.g,c.b)),st=(mx-mn)/max(mx,.001);bool gr=c.g>c.r*.92&&c.g>c.b*1.3;if(gr)return c;if(ny>.72&&mx>.5)return mix(c,vec3(.99,.92,.77)*(.55+.5*mx),.82);if(ny<.6&&c.r>c.g*1.12&&st>.3)return c*vec3(.84,.64,.5);return c;}\n'+fs.replace(end,'c=floor(c*cq+.5)/cq;gl_FragColor=vec4(gr4(c*s,vN.y),1.);}');m.needsUpdate=true}};
 /* longer rock cone under every tile: everything below the grass rim is stretched down (once, before the board is built) */
 const K=window.__tileRock||1.3,CUT=.62;
 (function st(){const g=window.__TG&&window.__TG.geo;if(!g){setTimeout(st,150);return}if(g.userData.__rock)return;g.userData.__rock=1;const p=g.attributes.position;for(let i=0;i<p.count;i++){const y=p.getY(i);if(y<CUT)p.setY(i,CUT+(y-CUT)*K)}p.needsUpdate=true;g.computeBoundingBox();g.computeBoundingSphere();try{g.computeVertexNormals&&0}catch(e){}})();
 setInterval(()=>{try{if(window.__OUTT&&!window.__OUTT.__ink){window.__OUTT.__ink=1;window.__OUTT.uniforms.uC.value.set(window.__inkC||0x24140a)}const G=window.__3;if(!G||!G.tiles)return;G.tiles.forEach((o,i)=>{if(!o||!o.cBlk)return;const m=o.cBlk.material;fix(m,o.t==='empty');
  /* back row (top of the screen, 5 normal tiles): drawn before the island, so the island covers them where it is in front */
  if(!o.cBlk.userData.__back&&G.W&&i%6!==0){const w=G.W(i);if(w&&w.z<-3){o.cBlk.userData.__back=1;o.cBlk.traverse(c=>{c.renderOrder=-6})}}})}catch(e){}},300);
})();
