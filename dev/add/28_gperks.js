/* ===== v4 (26 Nov): the guild perks that were "coming soon" now work (Pix: drop name change, max guild level 8)
   L2 loot box timers -10% · L6 deck points +1 (11) · L7 +10 members (in 17_guild) · L8 shard shop -20% ===== */
(function w(){if(typeof SV==='undefined'||typeof ob2!=='function'||typeof glv!=='function'){setTimeout(w,400);return}
 const gl=()=>{try{return SV.guild?glv():0}catch(e){return 0}};
 window.__dmx=()=>10+(gl()>=6?1:0);
 window.__sdc=o=>gl()>=8?Math.max(1,Math.ceil(o.c*.8)):o.c;
 /* loot box: when a timer starts in a level 2+ guild, it starts 10% of the way done */
 const _o=ob2;ob2=window.ob2=function(i){const x=SV.boxes&&SV.boxes[i],was=x&&x.s;const r=_o.apply(this,arguments);
  try{const y=SV.boxes[i];if(y===x&&y&&!was&&y.s&&gl()>=2&&typeof BX!=='undefined'){y.s-=BX[y.r][1]*6e4*.1;y.g2=1;sv();menu()}}catch(e){}return r};
})();
