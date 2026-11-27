/* ===== v4 (27 Nov): end screen extras — rank bar filling (ranked), chest drops in, Sparky reacts ===== */
(function w(){if(typeof fin!=='function'||typeof SV==='undefined'||!document.getElementById('ov')){setTimeout(w,300);return}try{
 const st=document.createElement('style');st.textContent=`
#ov .ov3 .rk4{margin:10px auto 2px;width:min(300px,86%);text-align:left;opacity:0;animation:rk4in .4s ease-out forwards}
@keyframes rk4in{to{opacity:1}}
#ov .ov3 .rk4 .l{display:flex;justify-content:space-between;font:400 13px 'Lilita One',system-ui,sans-serif;color:#ffe9b8;margin-bottom:4px}
#ov .ov3 .rk4 .l em{font-style:normal;color:#cdb892}
#ov .ov3 .rk4 .b{position:relative;height:16px;border-radius:9px;background:#1a1006;border:2px solid #e8b84e;overflow:hidden;box-shadow:inset 0 2px 3px #000a}
#ov .ov3 .rk4 .b i{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(#ffe48a,#f2a72c);border-radius:6px;transition:width 1.1s cubic-bezier(.2,.8,.2,1)}
#ov .ov3 .rk4 .b i.g{background:linear-gradient(#b6ff9a,#3fbf4a)}
#ov .ov3 .rk4 .b i.r{background:linear-gradient(#ff9a8a,#d8403a)}
#ov .ov3 .rk4.up .l b{color:#9fe08a}
#ov .ov3 .rr3.ch4 img{animation:ch4drop .7s cubic-bezier(.3,1.6,.5,1) both;animation-delay:inherit}
@keyframes ch4drop{0%{transform:translateY(-90px) scale(1.4) rotate(-12deg);opacity:0}60%{opacity:1}100%{transform:none}}
#ov .ov3 .msc4{position:absolute;right:-6px;top:-34px;width:96px;z-index:3;pointer-events:none;filter:drop-shadow(0 4px 4px #0009);animation:msc4in .6s cubic-bezier(.3,1.5,.5,1) .5s both}
@keyframes msc4in{0%{transform:translateY(40px) scale(.4);opacity:0}100%{transform:none;opacity:1}}
#ov .ov3 .msc4.hop{animation:msc4in .6s cubic-bezier(.3,1.5,.5,1) .5s both,msc4hop .9s ease-in-out 1.2s infinite}
@keyframes msc4hop{50%{transform:translateY(-8px)}}
#ov .ov3{position:relative}`;document.head.appendChild(st);
 const rkOf=rp=>{let r=0;RK.forEach((x,i)=>{if(rp>=x[1])r=i});return r};
 const _fin=fin;fin=function(win){const m0=mode,rp0=SV.rp||0;const r=_fin.apply(this,arguments);
  try{const x=document.querySelector('#ov .ov3');if(!x)return r;
   /* chest row drops in */
   x.querySelectorAll('.rr3').forEach(row=>{if(/chest/i.test(row.textContent))row.classList.add('ch4')});
   /* Sparky */
   const M=window.__MASC;if(M){const im=document.createElement('img');im.alt='';im.className='msc4'+(win?' hop':'');im.src=win?(M.cheer||M.star):(M.think||M.hold);x.appendChild(im)}
   /* rank bar */
   if(m0==='rank'){const rp1=SV.rp||0,r0=rkOf(rp0),r1=rkOf(rp1),top=r1>=RK.length-1;
    const lo=RK[r1][1],hi=top?RK[r1][1]+400:RK[r1+1][1],pc=v=>Math.max(0,Math.min(100,100*(v-lo)/(hi-lo)));
    const box=document.createElement('div');box.className='rk4'+(r1>r0?' up':'');box.style.animationDelay='1s';
    box.innerHTML='<div class="l"><b>'+RK[r1][0]+(r1>r0?' — rank up!':'')+'</b><em>'+(top?rp1+' RP':(hi-rp1)+' RP to '+RK[r1+1][0])+'</em></div><div class="b"><i class="'+(rp1>=rp0?'g':'r')+'" style="width:'+(r1===r0?pc(rp0):0)+'%"></i></div>';
    const bt=x.querySelector('.bt3');x.insertBefore(box,bt);
    setTimeout(()=>{const i=box.querySelector('i');if(i)i.style.width=pc(rp1)+'%'},1300)}
  }catch(e){console.warn('end4',e)}
  return r};
}catch(e){console.warn('v4 end extras',e)}})();
