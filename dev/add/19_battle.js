/* V4: new Battle page (Pix's mock-ups, 25 Nov). The V3 page is still drawn underneath (hidden) so every game rule,
   lock and button keeps working: hero / base taps call V3's m3h / m3b, the match buttons click V3's own buttons. */
(function w(){if(typeof menu!=='function'||typeof SV==='undefined'||!window.__BT4){setTimeout(w,300);return}try{
const A=window.__BT4,POR=()=>window.__POR||{},SKI=()=>window.__SKI||{};
const HK=()=>Object.keys(HD),BK=()=>Object.keys(BASES);
const BIC={forest:['🌿','#3fae3a','#145a16'],mine:['⛏️','#3a6fb8','#16305e'],fire:['🔥','#e8532a','#7a1a08'],ice:['❄️','#3aa8f0','#124a7e'],castle:['🏰','#4a5fd0','#1a2468'],electric:['⚡','#8a4ae0','#3a1470'],market:['🎪','#e04a4a','#6e1414']};
const esc=t=>String(t==null?'':t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let last='';
function state(mb){const hero=!!mb.querySelector('.prow .pb.sel'),base=!!mb.querySelector('.brow .pb.sel');return {hero,base}}
function skills(mb){return [...mb.querySelectorAll('.sk3>div')].map(d=>{const b=(d.querySelector('b')||{}).textContent||'',s=(d.querySelector('span')||{}).textContent||'';const m=b.trim().match(/^(\S+)\s+(.*)$/);return {i:m?m[1]:'',n:m?m[2]:b,d:s}})}
const skinOf=h=>{try{return (SV.skin&&SV.skin[h])||0}catch(e){return 0}};
const heroImg=h=>{const s=skinOf(h),S=SKI();return S['b'+s+h]||S['b0'+h]||POR()[h]||''};
const heroLogo=h=>{const s=skinOf(h),S=SKI();return (s&&S['l'+s+h])||POR()[h]||''};
const GARW='<svg class="b4ga" viewBox="0 0 44 30" aria-hidden="true"><defs><linearGradient id="b4gg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3b0"/><stop offset=".55" stop-color="#ffc63d"/><stop offset="1" stop-color="#e08a1c"/></linearGradient></defs><path d="M3 15 L19 2.5 V9.5 H41 V20.5 H19 V27.5 Z" fill="url(#b4gg)" stroke="#4a2a08" stroke-width="2.6" stroke-linejoin="round"/><path d="M8 14.5 L17 7.5 V12 H38" fill="none" stroke="#fff8d8" stroke-width="1.6" stroke-linecap="round" opacity=".8"/></svg>';
const GDWN='<svg class="b4gd" viewBox="0 0 40 34" aria-hidden="true"><path d="M3 3 H12 L20 11 L28 3 H37 L20 20 Z" fill="url(#b4gg)" stroke="#4a2a08" stroke-width="2.4" stroke-linejoin="round"/><path d="M3 15 H12 L20 23 L28 15 H37 L20 32 Z" fill="url(#b4gg)" stroke="#4a2a08" stroke-width="2.4" stroke-linejoin="round"/></svg>';
const CHV=d=>'<svg viewBox="0 0 20 30" aria-hidden="true"><path d="'+(d<0?'M14 4 L5 15 L14 26':'M6 4 L15 15 L6 26')+'" fill="none" stroke="#3a2006" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="'+(d<0?'M14 4 L5 15 L14 26':'M6 4 L15 15 L6 26')+'" fill="none" stroke="#ffc94a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const SHLD=e=>'<span class="b4sh"><svg viewBox="0 0 40 46" aria-hidden="true"><defs><linearGradient id="b4sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a5cf0"/><stop offset="1" stop-color="#3a1a8a"/></linearGradient></defs><path d="M20 2 L37 8 L35 28 Q31 39 20 44 Q9 39 5 28 L3 8 Z" fill="url(#b4sg)" stroke="#ffcf5a" stroke-width="3" stroke-linejoin="round"/></svg><i>'+e+'</i></span>';
const HANG='<svg viewBox="0 0 34 24" aria-hidden="true"><path d="M17 8 V6 A3.2 3.2 0 1 1 20.2 9.2 M17 8 L3 19 Q1.5 21 4 21 H30 Q32.5 21 31 19 Z" fill="none" stroke="#3a2006" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const SW='<svg viewBox="0 0 64 64" aria-hidden="true"><g stroke="#2a1406" stroke-width="3" stroke-linejoin="round"><path d="M10 6 L40 36 L36 40 L6 10 Z" fill="#e8eef8"/><path d="M54 6 L24 36 L28 40 L58 10 Z" fill="#e8eef8"/><path d="M33 38 L44 49 M31 33 L41 43" /><rect x="36" y="42" width="14" height="6" rx="2" transform="rotate(45 43 45)" fill="#ffc94a"/><rect x="14" y="42" width="14" height="6" rx="2" transform="rotate(-45 21 45)" fill="#ffc94a"/><circle cx="51" cy="53" r="5" fill="#ffc94a"/><circle cx="13" cy="53" r="5" fill="#ffc94a"/></g></svg>';
function build(){const mb=document.getElementById('mb');if(!mb||tab!=='main'||!mb.classList.contains('m3'))return off();
 const M=document.getElementById('menu');M.classList.add('bt4');mb.classList.add('b4on');
 const st=state(mb),h=SV.mine,b=SV.base,hk=HK(),bk=BK(),d=HD[h]||{},L=st.base?BL(b):1;
 const sk=st.hero?skills(mb):[];
 const g=mb.querySelector('.gbs'),lk=g?g.classList.contains('lk'):!st.base;
 const ds=bdesc(b,L).split(' · ');
 const title=(n,t,arr)=>'<div class="b4t"><img alt="'+t+'" src="'+A['u_t'+n]+'">'+(arr?GARW:'')+'</div>';
 const html='<div class="b4"><div class="b4in"><button class="b4q" title="How to play" onclick="var t=document.getElementById(\'v3tq\');if(t)t.click()">?</button>'+
  '<div class="b4p">'+title(1,'Choose Your Hero',!st.hero)+
  '<div class="b4r">'+hk.map(k=>'<button class="b4c'+(st.hero&&k===h?' on':'')+'" onclick="m3h(\''+k+'\')"><span class="b4cc"><img alt="" src="'+heroLogo(k)+'"></span><em>'+esc(HD[k].n)+'</em></button>').join('')+'</div>'+
  '<div class="b4s"><div class="b4st">'+
   (st.hero?'<img class="b4ped" alt="" src="'+A.ped+'"><img class="b4hero" alt="" src="'+heroImg(h)+'" onclick="m3pop(\'h\')">':'<img class="b4emp" alt="" src="'+A.eh+'">')+
   '<button class="b4a l" onclick="__b4h(-1)">'+CHV(-1)+'</button><button class="b4a r" onclick="__b4h(1)">'+CHV(1)+'</button></div>'+
   '<div class="b4i">'+(st.hero?'<div class="b4n">'+SHLD(d.e||'⚜')+'<b>'+esc(d.nm||d.n)+'</b><em>⚔ '+esc(d.n)+'</em></div>':'<div class="b4n emp">'+SHLD('?')+'<b>Select a Hero</b></div>')+
   '<div class="b4k'+(st.hero?'':' dim')+'">'+(st.hero&&sk.length?sk:[{i:'⚔️',n:'Skill',d:'—'},{i:'🛡️',n:'Skill',d:'—'},{i:'✨',n:'Skill',d:'—'}]).map(x=>'<div><i>'+x.i+'</i><b>'+esc(x.n)+'</b><span>'+esc(x.d)+'</span></div>').join('')+'</div>'+
   (st.hero?'<button class="b4cu" onclick="__skinPop()"><img alt="Customize" src="'+A.u_cus+'"></button>':'<img class="b4wt" alt="Choose a hero first" src="'+A.u_w1+'">')+
  '</div></div></div>'+
  '<div class="b4p bs'+(st.hero?'':' b4lk')+'">'+title(2,'Choose Your Base',st.hero&&!st.base)+
  '<div class="b4r">'+bk.map(k=>{const c=BIC[k]||['🏠','#888','#333'];return '<button class="b4c b'+(st.base&&k===b?' on':'')+'" onclick="m3b(\''+k+'\')"><span class="b4cc" style="background:radial-gradient(circle at 40% 32%,'+c[1]+','+c[2]+' 75%)"><i>'+c[0]+'</i></span><em>'+esc(BASES[k].n)+'</em></button>'}).join('')+'</div>'+
  '<div class="b4s"><div class="b4st bst">'+(st.base?'<img class="b4base" alt="" src="'+(A[b]||'')+'">':'<img class="b4emp b" alt="" src="'+A.eb+'">')+
   '<button class="b4a l" onclick="__b4b(-1)">'+CHV(-1)+'</button><button class="b4a r" onclick="__b4b(1)">'+CHV(1)+'</button></div>'+
   '<div class="b4i"><div class="b4bi">'+(st.base?'<div class="b4bn"><i>'+(BIC[b]||['🏠'])[0]+'</i><b>'+esc(BASES[b].n)+' Base</b><em>Lv '+L+'/5</em></div><div class="b4bl"><span><i>💚</i>'+esc(ds[0]||'')+'</span><span><i>💚</i>'+esc(ds[1]||'')+'</span></div>'
    :'<div class="b4bn"><i>🏝️</i><b>Select a Base</b></div><div class="b4bl dim"><span><i>🤍</i>Pass: —</span><span><i>🤍</i>Land: —</span></div>')+'</div>'+
   (st.base?'':'<img class="b4wt" alt="" src="'+(st.hero?A.u_w2:A.u_w1)+'">')+
  '</div></div></div>'+
  '<div class="b4g'+(lk?' b4lk':'')+'">'+'<button class="b4m" onclick="__b4go(0)"><img alt="Casual match" src="'+A.u_cas+'"></button><button class="b4m" onclick="__b4go(1)"><img alt="Ranked match" src="'+A.u_rnk+'"></button></div>'+
  '</div></div>';
 let el=mb.querySelector(':scope>.b4');if(el)el.outerHTML=html;else mb.insertAdjacentHTML('beforeend',html);fit()}
function off(){const M=document.getElementById('menu');if(M)M.classList.remove('bt4');const mb=document.getElementById('mb');if(mb){mb.classList.remove('b4on');const e=mb.querySelector(':scope>.b4');if(e)e.remove()}}
// scale the fixed-size design to the space between the top bar and the bottom menu
function fit(){const mb=document.getElementById('mb'),b=mb&&mb.querySelector(':scope>.b4'),i=b&&b.querySelector('.b4in');if(!i)return;
 const W=b.clientWidth,H=b.clientHeight,s=Math.min(W/390,H/750,1.6);i.style.zoom=s.toFixed(3)}
window.addEventListener('resize',()=>{try{fit()}catch(e){}});
window.__b4h=d=>{const k=HK();let i=k.indexOf(SV.mine);i=(i+d+k.length)%k.length;if(!document.querySelector('#mb .prow .pb.sel'))i=Math.max(0,d>0?0:k.length-1);m3h(k[i]);try{snd(600,.04,'triangle')}catch(e){}};
window.__b4b=d=>{if(!document.querySelector('#mb .prow .pb.sel'))return;const k=BK();let i=k.indexOf(SV.base);if(!document.querySelector('#mb .brow .pb.sel'))i=d>0?-1:k.length;i=(i+d+k.length)%k.length;m3b(k[i])};
window.__b4go=r=>{const g=document.querySelectorAll('#mb .gbs .gbt');const btn=g[r];if(btn)btn.click()};
const _m=menu;menu=function(){const x=_m.apply(this,arguments);try{if(typeof tab!=='undefined'&&tab==='main')build();else off()}catch(e){console.log('battle page',e)}return x};
setTimeout(()=>{try{if(tab==='main')build()}catch(e){}},300);

const css=document.createElement('style');css.textContent=`
#menu.bt4{background:#2a4a8a url(${A.bg}) 50% 30%/cover no-repeat!important}
#mb.b4on{overflow:hidden!important;display:flex!important;flex-direction:column!important;padding:0!important}
#mb.b4on>*:not(.b4){position:absolute!important;left:-9999px!important;top:0!important;width:360px!important;visibility:hidden!important;pointer-events:none!important}
#mb .b4{flex:1;min-height:0;width:100%;display:flex;justify-content:center;align-items:flex-start}
#mb .b4in{width:390px;height:750px;flex:none;display:flex;flex-direction:column;gap:14px;padding:32px 1px 30px;box-sizing:border-box;font-family:'Lilita One',system-ui,sans-serif}
#menu.bt4 #v3tq{z-index:6}
.b4 .b4p{flex:none;position:relative;border-radius:18px;padding:28px 10px 10px;background:linear-gradient(#25273a,#191a27);border:3px solid #e8b84e;
 box-shadow:inset 0 0 0 3px #191a27,inset 0 0 0 4.5px #b88a3a,inset 0 2px 12px #0009,0 0 0 2px #3a2208,0 8px 18px #000b}
.b4 .b4p::before,.b4 .b4p::after{content:"";position:absolute;bottom:5px;width:9px;height:9px;background:#e8b84e;transform:rotate(45deg);box-shadow:0 0 0 1.5px #3a2208}
.b4 .b4p::before{left:5px}.b4 .b4p::after{right:5px}
.b4 .b4t{position:absolute;left:6px;top:-24px;height:42px;display:flex;align-items:center;z-index:3}
.b4 .b4t img{height:42px;width:auto;filter:drop-shadow(0 3px 3px #0009)}
.b4 .b4ga{width:40px;height:28px;margin-left:6px;animation:b4ar .9s ease-in-out infinite}
@keyframes b4ar{50%{transform:translateX(-7px)}}
.b4 .b4r{display:flex;justify-content:space-between;gap:2px;padding:0 0 8px;border-bottom:1.5px solid #b88a3a66}
.b4 .b4c{display:flex;flex-direction:column;align-items:center;background:none;border:0;padding:0;cursor:pointer;flex:1;min-width:0}
.b4 .b4cc{width:52px;height:52px;border-radius:50%;box-sizing:border-box;border:3px solid #f2c75a;box-shadow:0 0 0 2px #3a2208,inset 0 0 0 2px #3a2208,0 4px 6px #000a;overflow:hidden;background:#222;display:flex;align-items:center;justify-content:center}
.b4 .b4cc img{width:100%;height:100%;object-fit:cover}.b4 .b4cc i{font-size:24px;font-style:normal;filter:drop-shadow(0 2px 1px #000a)}
.b4 .b4c.b .b4cc{width:46px;height:46px}
.b4 .b4c em{margin-top:-8px;position:relative;font-size:11px;line-height:15px;font-style:normal;color:#fff6e0;background:linear-gradient(#262838,#12131c);border:1.5px solid #e8b84e;border-radius:9px;padding:0 5px;white-space:nowrap;text-shadow:0 1px 0 #000}
.b4 .b4c.on .b4cc{border-color:#ffe08a;box-shadow:0 0 0 2px #7a3a06,0 0 10px 4px #ffae2a,0 0 22px 6px #ff8a1a88}
.b4 .b4c.on em{border-color:#ffd166;box-shadow:0 0 8px #ffae2a}
.b4 .b4s{display:flex;gap:8px;align-items:stretch;margin-top:8px;padding:6px;border-radius:14px;border:1.5px solid #b88a3a;background:linear-gradient(90deg,#2c2848,#1c1c2c 60%)}
.b4 .b4st{position:relative;flex:0 0 46%;height:192px;border-radius:10px;background:radial-gradient(ellipse at 45% 35%,#6a5aa0,#3a3264 55%,#262040 85%);overflow:hidden;
 -webkit-mask-image:linear-gradient(90deg,#000 80%,transparent);mask-image:linear-gradient(90deg,#000 80%,transparent)}
.b4 .b4st.bst{height:134px}
.b4 .b4emp{position:absolute;left:50%;bottom:0;transform:translateX(-50%);height:100%;max-width:100%;object-fit:contain}
.b4 .b4emp.b{height:96%;bottom:2%}
.b4 .b4ped{position:absolute;left:50%;bottom:2px;transform:translateX(-50%);width:98%;height:auto}
.b4 .b4hero{position:absolute;left:50%;bottom:16px;transform:translateX(-50%);height:88%;max-width:80%;object-fit:contain;filter:drop-shadow(0 5px 4px #000a);cursor:pointer;animation:b4f 3s ease-in-out infinite}
@keyframes b4f{50%{transform:translateX(-50%) translateY(-3px)}}
.b4 .b4base{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);height:94%;max-width:76%;object-fit:contain;filter:drop-shadow(0 6px 6px #000a)}
.b4 .b4a{position:absolute;top:50%;transform:translateY(-50%);z-index:2;width:28px;height:48px;border-radius:10px;border:2.5px solid #e8b84e;background:linear-gradient(#2c2a40,#0f0e18);cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 1.5px #3a2208,0 3px 6px #000a}
.b4 .b4a svg{width:14px;height:22px}
.b4 .b4a.l{left:4px}.b4 .b4a.r{right:4px}
.b4 .b4a:active{transform:translateY(-50%) scale(.94)}
.b4 .b4i{flex:1;min-width:0;display:flex;flex-direction:column;gap:7px;justify-content:center}
.b4 .b4n{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.b4 .b4sh{position:relative;width:32px;height:37px;flex:none;filter:drop-shadow(0 2px 2px #000a)}.b4 .b4sh svg{width:100%;height:100%}
.b4 .b4sh i{position:absolute;inset:0 0 3px;display:flex;align-items:center;justify-content:center;font-style:normal;font-size:15px;color:#ffcf5a}
.b4 .b4n b{font-weight:400;font-size:23px;line-height:1;color:#fff6e0;text-shadow:0 2px 0 #0b0b14,1px 0 0 #0b0b14,-1px 0 0 #0b0b14}
.b4 .b4n em{font-size:13px;font-style:normal;color:#fff6e0;background:linear-gradient(#262838,#12131c);border:2px solid #e8b84e;border-radius:12px;padding:1px 9px;text-shadow:0 1px 0 #000}
.b4 .b4k{display:grid;grid-template-columns:repeat(3,1fr);border:2px solid #e8b84e;border-radius:12px;background:linear-gradient(#1c1d2c,#101119);padding:6px 0;box-shadow:inset 0 0 8px #000a}
.b4 .b4k.dim{opacity:.55;filter:grayscale(.6)}
.b4 .b4k div{display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 3px;min-width:0}
.b4 .b4k div+div{border-left:1.5px solid #b88a3a88}
.b4 .b4k i{font-style:normal;font-size:20px;line-height:1.15;filter:drop-shadow(0 2px 1px #000)}
.b4 .b4k b{font-weight:400;font-size:15px;color:#fff6e0;text-shadow:0 1px 0 #000,1px 0 0 #000,-1px 0 0 #000}
.b4 .b4k span{font:600 10px/1.15 system-ui,sans-serif;color:#d6d4e4}
.b4 .b4cu{display:block;width:100%;padding:0;border:0;background:none;cursor:pointer;filter:drop-shadow(0 3px 3px #0009)}
.b4 .b4cu img{display:block;width:100%;height:auto}
.b4 .b4cu:active{transform:translateY(2px)}
.b4 .b4wt{display:block;width:100%;height:auto;filter:drop-shadow(0 2px 2px #0008)}
.b4 .b4bi{border:2px solid #e8b84e;border-radius:12px;background:linear-gradient(#1c1d2c,#101119);padding:7px 8px;display:flex;flex-direction:column;gap:5px;box-shadow:inset 0 0 8px #000a}
.b4 .b4bn{display:flex;align-items:center;gap:5px;border-bottom:1.5px solid #b88a3a88;padding-bottom:5px}
.b4 .b4bn i{font-style:normal;font-size:20px}.b4 .b4bn b{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;font-weight:400;font-size:14px;color:#fff6e0;white-space:nowrap;text-shadow:0 1px 0 #000,1px 0 0 #000,-1px 0 0 #000}
.b4 .b4bn em{flex:none;font-size:12.5px;font-style:normal;color:#ece0c4;white-space:nowrap}
.b4 .b4bl{display:flex;flex-direction:column;gap:3px}.b4 .b4bl span{display:flex;align-items:center;gap:6px;font-size:14px;color:#fff6e0;text-shadow:0 1px 0 #000}.b4 .b4bl i{font-style:normal;font-size:15px}
.b4 .b4bl.dim span{color:#a8a4b8}
.b4 .b4p.bs.b4lk .b4r{opacity:.5;filter:grayscale(.6)}
.b4 .b4g{position:relative;flex:none;display:flex;gap:4px;justify-content:center;margin-top:auto;padding:0 4px}
.b4 .b4go{position:absolute;left:0;right:0;top:-24px;display:flex;justify-content:space-between;padding:0 64px;pointer-events:none;z-index:3}
.b4 .b4gd{width:26px;height:22px;animation:b4dn .9s ease-in-out infinite}
@keyframes b4dn{50%{transform:translateY(5px)}}
.b4 .b4m{flex:1;min-width:0;padding:0;border:0;background:none;cursor:pointer;filter:drop-shadow(0 4px 5px #000b)}
.b4 .b4m img{display:block;width:100%;height:auto}
.b4 .b4m:active{transform:translateY(2px)}
.b4 .b4g.b4lk .b4m{filter:grayscale(.8) brightness(.7) drop-shadow(0 4px 5px #000b)}
#menu.bt4 #v3tq{visibility:hidden!important;pointer-events:none!important}
#mb .b4in{position:relative}
.b4 .b4q{position:absolute;right:6px;top:0;z-index:5;width:30px;height:30px;border-radius:50%;padding:0;border:2.5px solid #6b3f0a;background:radial-gradient(circle at 40% 32%,#fff3b0,#f2c24a 55%,#c07a14);box-shadow:inset 0 -2px 0 #9a5a10,0 0 0 1.5px #ffd76a,0 3px 5px #000a;font:400 19px/1 'Lilita One',system-ui,sans-serif;color:#3a2006;cursor:pointer}
.b4 .b4q:active{transform:translateY(1px)}
`;document.head.appendChild(css);
}catch(e){console.log('v4 battle',e)}})();
