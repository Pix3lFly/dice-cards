/* ===== v4 (27 Nov): Sparky on the menus — a short hello the first time each page is opened, and a nap when the menu is left alone ===== */
(function w(){if(typeof menu!=='function'||typeof SV==='undefined'||!window.__MASC){setTimeout(w,500);return}try{
 const M=window.__MASC,NAME='Sparky';
 const TIP={shop:['cheer','Welcome to the <b>Shop</b>! New hero shards and base blueprints show up here a few times a day — spend gold or gems to grab them.'],
  coll:['think','This is your <b>Arsenal</b>. Use shards to power up your heroes’ gear, blueprints to level your bases, and build your <b>deck</b> of dice cards.'],
  comm:['star','<b>Social</b>! Add friends, send them gold gifts, join a <b>guild</b> for extra perks, and check your mail.'],
  jour:['hold','<b>Quests</b>! Claim your daily login gift, finish daily quests and unlock achievements for gold and gems.']};
 const st=document.createElement('style');st.textContent=`
#sp4{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(env(safe-area-inset-bottom,0px) + 112px);z-index:30;width:min(360px,92vw);display:flex;align-items:flex-end;gap:6px;animation:sp4in .45s cubic-bezier(.3,1.4,.5,1) both}
@keyframes sp4in{from{transform:translate(-50%,40px);opacity:0}}
#sp4 img{width:86px;flex:none;filter:drop-shadow(0 4px 4px #0009);animation:mscB 2.4s ease-in-out infinite}
#sp4 .bb{flex:1;background:linear-gradient(#26305a,#161c3a);border:2.5px solid #e8b84e;border-radius:14px;padding:8px 10px 8px;color:#fff;font:500 13px/1.35 system-ui,sans-serif;box-shadow:0 0 0 1.5px #3a2208,0 6px 12px #000b;position:relative}
#sp4 .bb:before{content:'';position:absolute;left:-10px;bottom:18px;border:8px solid transparent;border-right:10px solid #e8b84e;border-left:0}
#sp4 .bb i{display:block;font:400 14px 'Lilita One',system-ui,sans-serif;font-style:normal;color:#ff9a3c;margin-bottom:2px}
#sp4 .bb b{color:#ffd76a}
#sp4 .bb button{display:block;margin:6px 0 0 auto;padding:4px 16px;border-radius:10px;border:2px solid #7a4a0e;background:linear-gradient(#ffe9a6,#f5c242 50%,#d4901c);font:400 14px 'Lilita One',system-ui,sans-serif;color:#3a2006}
#sp4n{position:fixed;right:10px;bottom:calc(env(safe-area-inset-bottom,0px) + 104px);z-index:29;width:84px;pointer-events:auto;filter:drop-shadow(0 4px 4px #0009);animation:sp4in2 .6s ease-out both}
@keyframes sp4in2{from{opacity:0;transform:translateY(20px)}}
#sp4n img{width:100%;display:block}
#sp4n span{position:absolute;right:4px;top:-10px;font:400 18px 'Lilita One',system-ui,sans-serif;color:#cfe4ff;text-shadow:0 2px 0 #0008;animation:zz 2.2s ease-in-out infinite}
@keyframes zz{0%{opacity:0;transform:translate(0,6px) scale(.7)}40%{opacity:1}100%{opacity:0;transform:translate(10px,-16px) scale(1.15)}}`;document.head.appendChild(st);
 const guide=()=>[...document.body.children].some(e=>e.id!=='menu'&&e.id!=='app'&&e.offsetParent!==null&&/Tap to continue/i.test(e.textContent||''));
 const inMenu=()=>{const m=document.getElementById('menu');return m&&m.style.display==='flex'&&!document.querySelector('#menu .mpop,#tut3[style*="flex"],#v3wel[style*="flex"]')&&!guide()};
 const close=()=>{const e=document.getElementById('sp4');if(e)e.remove()};
 window.__sp4Close=close;
 const show=k=>{close();const t=TIP[k];if(!t)return;const d=document.createElement('div');d.id='sp4';d.innerHTML='<img alt="" src="'+(M[t[0]]||M.hold)+'"><div class="bb"><i>'+NAME+'</i>'+t[1]+'<button onclick="__sp4Close()">Got it!</button></div>';document.body.appendChild(d)};
 setInterval(()=>{try{if(!inMenu()||!SV.m1){close();return}SV.sp4=SV.sp4||{};const k=typeof tab!=='undefined'?tab:'';
  const cur=document.getElementById('sp4');if(cur&&cur.dataset.k&&cur.dataset.k!==k)close();
  if(TIP[k]&&!SV.sp4[k]&&!document.getElementById('sp4')){SV.sp4[k]=1;try{sv()}catch(e){}show(k);const e=document.getElementById('sp4');if(e)e.dataset.k=k}}catch(e){}},700);
 /* nap: 45 s with no touches on the menu */
 let last=Date.now();['pointerdown','keydown','wheel','touchstart'].forEach(ev=>addEventListener(ev,()=>{last=Date.now();const n=document.getElementById('sp4n');if(n)n.remove()},{passive:true,capture:true}));
 setInterval(()=>{try{const n=document.getElementById('sp4n');if(!inMenu()||document.getElementById('sp4')){if(n)n.remove();return}
  if(!n&&Date.now()-last>45000&&M.sleep){const d=document.createElement('div');d.id='sp4n';d.innerHTML='<img alt="" src="'+M.sleep+'"><span>z</span>';document.body.appendChild(d)}}catch(e){}},1000);
}catch(e){console.warn('v4 sparky menus',e)}})();
