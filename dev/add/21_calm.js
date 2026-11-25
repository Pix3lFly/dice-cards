/* V4: calmer board tiles (Pix 25 Nov): the coloured ring pattern under each item is smaller and fainter, and the pulsing tile glow is softer,
   so potions, monsters, chests etc. stand out. Revert: drop this file. */
(function(){const done=new WeakSet();setInterval(()=>{try{const G=window.__3;if(!G||!G.tiles)return;
 G.tiles.forEach((o,i)=>{if(!o||i===0||i===12||i===6||i===18)return;
  if(o.top){o.top.scale.setScalar(window.__calmS||.58);const m=o.top.material;if(m&&!done.has(m)){done.add(m);m.transparent=true;m.opacity=window.__calmO||.45;if(m.emissiveIntensity!=null)m.emissiveIntensity*=.5;m.needsUpdate=true}}
  if(o.go!=null&&o.__calmT!==o.t){o.__calmT=o.t;o.go*=.4}})}catch(e){}},300)})();
