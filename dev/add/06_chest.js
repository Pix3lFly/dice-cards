/* v4: chest opening shows the reward popup (V3's popup never switched on: it waited for a global `U` that isn't there) */
(function w(){if(typeof ob2!=='function'||typeof SV==='undefined'||!window.__U||typeof window.__rwShow!=='function'){setTimeout(w,300);return}
 const U=window.__U,o=ob2;
 ob2=function(i,f){const x=SV.boxes[i],n=SV.boxes.length;let img=null;
  try{const el=document.querySelectorAll('.csg .cs')[i],im=el&&el.querySelector('img.ci');if(im)img=im.src}catch(e){}
  const g0=SV.gold,m0=SV.gems,s0=Object.assign({},SV.sh);const r=o.apply(this,arguments);
  try{if(x&&SV.boxes.length<n){const it=[];
    Object.keys(SV.sh).forEach(h=>{const d=(SV.sh[h]||0)-(s0[h]||0);if(d>0)it.push([(window.__POR&&window.__POR[h])||U.s_shard,'×'+d,HD[h].n+' shards'])});
    if(SV.gold>g0)it.push([U.coin,'+'+(SV.gold-g0),'Gold']);if(SV.gems>m0)it.push([U.gem,'+'+(SV.gems-m0),'Gems']);
    SV.msg='';try{sv();menu()}catch(e){}
    window.__rwShow(img,(BX[x.r]?BX[x.r][0]:'')+' chest opened!',it.length?it:[[U.s_shard,'—','']])}}catch(e){console.log('chest pop',e)}
  return r}})();
