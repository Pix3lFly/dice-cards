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
function build(){const mb=document.getElementById('mb');if(!mb||tab!=='main'||!mb.classList.contains('m3'))return off();
 const M=document.getElementById('menu');M.classList.add('bt4');mb.classList.add('b4on');
 const st=state(mb),h=SV.mine,b=SV.base,hk=HK(),bk=BK(),d=HD[h]||{},L=st.base?BL(b):1;
 const sk=st.hero?skills(mb):[];
 const lk=(mb.querySelector('.gbs')||{}).classList?mb.querySelector('.gbs').classList.contains('lk'):!st.base;
 const ds=bdesc(b,L).split(' · ');
 const html='<div class="b4"><div class="b4in">'+
  '<div class="b4h"><span>⚔️</span><b>BATTLE</b></div>'+
  // hero panel
  '<div class="b4p"><div class="b4t"><i>1</i>Choose Your Hero</div>'+
  '<div class="b4r'+(st.hero?'':' glow')+'">'+hk.map(k=>'<button class="b4c'+(st.hero&&k===h?' on':'')+'" onclick="m3h(\''+k+'\')"><span class="b4cc"><img alt="" src="'+heroLogo(k)+'"></span><em>'+esc(HD[k].n)+'</em></button>').join('')+'</div>'+
  '<div class="b4s"><div class="b4st">'+
   (st.hero?'<img class="b4ped" alt="" src="'+A.ped+'"><img class="b4hero" alt="" src="'+heroImg(h)+'" onclick="m3pop(\'h\')">':'<img class="b4emp" alt="" src="'+A.eh+'">')+
   '<button class="b4a l" onclick="__b4h(-1)">‹</button><button class="b4a r" onclick="__b4h(1)">›</button></div>'+
   '<div class="b4i">'+(st.hero?'<div class="b4n"><span class="b4sh">'+(d.e||'🛡️')+'</span><b>'+esc(d.nm||d.n)+'</b><em>'+esc(d.n)+'</em></div>':'<div class="b4n emp"><span class="b4sh">?</span><b>Select a Hero</b></div>')+
   '<div class="b4k">'+(st.hero&&sk.length?sk:[{i:'❔',n:'—',d:''},{i:'❔',n:'—',d:''},{i:'❔',n:'—',d:''}]).map(x=>'<div><i>'+x.i+'</i><b>'+esc(x.n)+'</b><span>'+esc(x.d)+'</span></div>').join('')+'</div>'+
   (st.hero?'<button class="b4cu" onclick="__skinPop()"><span>👕</span>Customize</button>':'<div class="b4wt"><span>!</span>Choose a hero first</div>')+
  '</div></div></div>'+
  // base panel
  '<div class="b4p bs'+(st.hero?'':' b4lk')+'"><div class="b4t"><i>2</i>Choose Your Base</div>'+
  '<div class="b4r'+(st.hero&&!st.base?' glow':'')+'">'+bk.map(k=>{const c=BIC[k]||['🏠','#888','#333'];return '<button class="b4c b'+(st.base&&k===b?' on':'')+'" onclick="m3b(\''+k+'\')"><span class="b4cc" style="background:radial-gradient(circle at 40% 35%,'+c[1]+','+c[2]+')"><i>'+c[0]+'</i></span><em>'+esc(BASES[k].n)+'</em></button>'}).join('')+'</div>'+
  '<div class="b4s"><div class="b4st bst">'+(st.base?'<img class="b4base" alt="" src="'+(A[b]||'')+'">':'<img class="b4emp b" alt="" src="'+A.eb+'">')+
   '<button class="b4a l" onclick="__b4b(-1)">‹</button><button class="b4a r" onclick="__b4b(1)">›</button></div>'+
   '<div class="b4i"><div class="b4bi">'+(st.base?'<div class="b4bn"><i>'+(BIC[b]||['🏠'])[0]+'</i><b>'+esc(BASES[b].n)+' Base</b><em>Lv '+L+'/5</em></div><div class="b4bl"><span>💚 '+esc(ds[0]||'')+'</span><span>💚 '+esc(ds[1]||'')+'</span></div>'
    :'<div class="b4bn"><i>🏝️</i><b>Select a Base</b></div><div class="b4bl dim"><span>🤍 Pass: —</span><span>🤍 Land: —</span></div>')+'</div>'+
   (st.base?'':'<div class="b4wt"><span>!</span>'+(st.hero?'Choose a base first':'Choose a hero first')+'</div>')+
  '</div></div></div>'+
  // match buttons
  '<div class="b4g'+(lk?' b4lk':'')+'"><button class="b4m ca" onclick="__b4go(0)"><span>⚔️</span><b>CASUAL<br>MATCH</b></button><button class="b4m rk" onclick="__b4go(1)"><span>👑</span><b>RANKED<br>MATCH</b></button></div>'+
  '</div></div>';
 let el=mb.querySelector(':scope>.b4');if(el)el.outerHTML=html;else mb.insertAdjacentHTML('beforeend',html);fit()}
function off(){const M=document.getElementById('menu');if(M)M.classList.remove('bt4');const mb=document.getElementById('mb');if(mb){mb.classList.remove('b4on');const e=mb.querySelector(':scope>.b4');if(e)e.remove()}}
// scale the fixed-size design to the space between the top bar and the bottom menu
function fit(){const mb=document.getElementById('mb'),b=mb&&mb.querySelector(':scope>.b4'),i=b&&b.querySelector('.b4in');if(!i)return;
 const W=b.clientWidth,H=b.clientHeight,s=Math.min(W/390,H/730,1.6);i.style.zoom=s.toFixed(3)}
window.addEventListener('resize',()=>{try{fit()}catch(e){}});
window.__b4h=d=>{const k=HK();let i=k.indexOf(SV.mine);i=(i+d+k.length)%k.length;if(!document.querySelector('#mb .prow .pb.sel'))i=Math.max(0,d>0?0:k.length-1);m3h(k[i]);try{snd(600,.04,'triangle')}catch(e){}};
window.__b4b=d=>{if(!document.querySelector('#mb .prow .pb.sel'))return;const k=BK();let i=k.indexOf(SV.base);if(!document.querySelector('#mb .brow .pb.sel'))i=d>0?-1:k.length;i=(i+d+k.length)%k.length;m3b(k[i])};
window.__b4go=r=>{const g=document.querySelectorAll('#mb .gbs .gbt');const btn=g[r];if(btn)btn.click()};
const _m=menu;menu=function(){const x=_m.apply(this,arguments);try{if(typeof tab!=='undefined'&&tab==='main')build();else off()}catch(e){console.log('battle page',e)}return x};
setTimeout(()=>{try{if(tab==='main')build()}catch(e){}},300);

const css=document.createElement('style');css.textContent=`
#menu.bt4{background:#2a4a8a url(${A.bg}) 50% 30%/cover no-repeat!important}
#menu.bt4::before,#menu.bt4::after{opacity:0!important}
#mb.b4on{overflow:hidden!important;display:flex!important;flex-direction:column!important;padding:0!important}
#mb.b4on>*:not(.b4){position:absolute!important;left:-9999px!important;top:0!important;width:360px!important;visibility:hidden!important;pointer-events:none!important}
#mb .b4{flex:1;min-height:0;width:100%;display:flex;justify-content:center;align-items:flex-start}
#mb .b4in{width:390px;height:730px;flex:none;display:flex;flex-direction:column;gap:7px;padding:4px 8px 6px;box-sizing:border-box;font-family:system-ui,sans-serif}
#menu.bt4 #v3tq{z-index:6}
.b4h{flex:none;align-self:center;display:flex;align-items:center;gap:6px;height:44px;padding:0 26px;border-radius:12px;background:linear-gradient(#3a2f4a,#1c1626);border:3px solid #e6b54a;box-shadow:inset 0 0 0 2px #6b4a14,0 0 0 2px #3a2006,0 4px 10px #0008;position:relative}
.b4h::before,.b4h::after{content:"";position:absolute;top:50%;width:24px;height:30px;transform:translateY(-50%);background:linear-gradient(#ffe38e,#d08f1c);clip-path:polygon(0 50%,100% 0,70% 50%,100% 100%)}
.b4h::before{left:-20px}.b4h::after{right:-20px;transform:translateY(-50%) scaleX(-1)}
.b4h span{font-size:24px}.b4h b{font:400 28px 'Lilita One',system-ui,sans-serif;color:#fff2d0;letter-spacing:1px;text-shadow:0 2px 0 #3a2006,0 0 8px #ffd16688}
.b4p{flex:none;position:relative;border-radius:16px;padding:22px 8px 8px;background:linear-gradient(#2a2a44f2,#1a1a2cf2);border:3px solid #e6b54a;box-shadow:inset 0 0 0 2px #6b4a14,0 0 0 2px #3a2006,0 6px 14px #000a;margin-top:12px}
.b4t{position:absolute;left:10px;top:-16px;display:flex;align-items:center;gap:7px;height:32px;padding:0 22px 0 4px;background:linear-gradient(#3a3a5a,#202036);border:2px solid #e6b54a;border-radius:16px 6px 6px 16px;font:400 19px 'Lilita One',system-ui,sans-serif;color:#fff2d0;text-shadow:0 2px 0 #000;box-shadow:0 3px 6px #0009;clip-path:polygon(0 0,92% 0,100% 50%,92% 100%,0 100%)}
.b4t i{display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#fff3b0,#e9a43a 70%,#a8620e);border:2px solid #5a3608;color:#3a2006;font:400 16px 'Lilita One',system-ui;font-style:normal;text-shadow:none}
.b4r{display:flex;justify-content:space-between;gap:2px;padding:2px 2px 6px;border-bottom:1.5px solid #e6b54a55;border-radius:10px}
.b4r.glow{animation:b4g 1.3s ease-in-out infinite}
@keyframes b4g{50%{box-shadow:0 0 0 2px #ffd166,0 0 16px #ffd166aa}}
.b4c{display:flex;flex-direction:column;align-items:center;gap:0;background:none;border:0;padding:0;cursor:pointer;flex:1;min-width:0}
.b4cc{display:block;width:50px;height:50px;border-radius:50%;border:3px solid #e6b54a;box-shadow:0 0 0 2px #3a2006,0 3px 5px #0008;overflow:hidden;background:#222;display:flex;align-items:center;justify-content:center}
.b4cc img{width:100%;height:100%;object-fit:cover}.b4cc i{font-size:24px;font-style:normal;filter:drop-shadow(0 2px 1px #0008)}
.b4c.b .b4cc{width:44px;height:44px}
.b4c em{margin-top:-7px;position:relative;font:400 10px/1.35 'Lilita One',system-ui,sans-serif;font-style:normal;color:#fff2d0;background:#1c1626;border:1.5px solid #e6b54a;border-radius:8px;padding:0 3px;white-space:nowrap;box-sizing:border-box}
.b4c.on .b4cc{border-color:#ffe38e;box-shadow:0 0 0 2px #3a2006,0 0 14px 4px #ffbf3a}
.b4c.on em{background:linear-gradient(#ffd166,#c97a14);color:#3a2006;border-color:#fff3b0}
.b4s{display:flex;gap:6px;align-items:stretch;margin-top:6px}
.b4st{position:relative;flex:0 0 47%;height:200px;border-radius:12px;background:radial-gradient(ellipse at 50% 40%,#5a4a8a,#2a2446 70%,#201c34);overflow:hidden}
.b4st.bst{height:150px}
.b4emp{position:absolute;left:50%;bottom:0;transform:translateX(-50%);height:100%;max-width:100%;object-fit:contain}
.b4emp.b{height:96%;bottom:2%}
.b4ped{position:absolute;left:50%;bottom:2px;transform:translateX(-50%);width:96%;height:auto}
.b4hero{position:absolute;left:50%;bottom:14px;transform:translateX(-50%);height:88%;max-width:86%;object-fit:contain;filter:drop-shadow(0 4px 4px #0009);cursor:pointer;animation:b4f 3s ease-in-out infinite}
@keyframes b4f{50%{transform:translateX(-50%) translateY(-3px)}}
.b4base{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);height:92%;max-width:80%;object-fit:contain;filter:drop-shadow(0 6px 6px #000a)}
.b4a{position:absolute;top:50%;transform:translateY(-50%);z-index:2;width:26px;height:44px;border-radius:9px;border:2px solid #e6b54a;background:linear-gradient(#2a2440,#120f20);color:#ffd166;font:900 24px/1 system-ui;cursor:pointer;padding:0 0 3px;box-shadow:0 2px 5px #0009}
.b4a.l{left:3px}.b4a.r{right:3px}
.b4i{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px;justify-content:center}
.b4n{display:flex;align-items:center;gap:5px;flex-wrap:wrap}
.b4sh{display:flex;align-items:center;justify-content:center;width:30px;height:34px;flex:none;background:linear-gradient(#7a4ae0,#3a1a8a);clip-path:polygon(50% 0,100% 18%,92% 70%,50% 100%,8% 70%,0 18%);font-size:16px;color:#ffd166;font-weight:900}
.b4n b{font:400 20px 'Lilita One',system-ui,sans-serif;color:#fff2d0;text-shadow:0 2px 0 #000;line-height:1.05}
.b4n em{font:400 12px 'Lilita One',system-ui,sans-serif;font-style:normal;color:#fff2d0;background:#1c1626;border:1.5px solid #e6b54a;border-radius:9px;padding:1px 8px}
.b4n.emp .b4sh{background:#2a2440;border:0;color:#e6b54a}
.b4k{display:grid;grid-template-columns:repeat(3,1fr);border:2px solid #e6b54a;border-radius:10px;background:#141222cc;padding:4px 0}
.b4k div{display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 2px;min-width:0}
.b4k div+div{border-left:1px solid #e6b54a55}
.b4k i{font-style:normal;font-size:18px;line-height:1.2}.b4k b{font:400 13px 'Lilita One',system-ui,sans-serif;color:#fff2d0}
.b4k span{font:600 9.5px/1.15 system-ui,sans-serif;color:#d8cfe8}
.b4cu{display:flex;align-items:center;justify-content:center;gap:6px;height:38px;border-radius:10px;border:2px solid #8a5f17;background:linear-gradient(#ffe38e,#e9ac2e 60%,#d08f1c);box-shadow:inset 0 2px 0 #fff3c4,0 3px 0 #5a3608,0 5px 8px #0008;font:400 18px 'Lilita One',system-ui,sans-serif;color:#3a2006;cursor:pointer}
.b4cu span{font-size:18px}
.b4wt{display:flex;align-items:center;justify-content:center;gap:7px;height:34px;border-radius:10px;border:2px solid #b89a6a;background:linear-gradient(#cdb89a,#9a8466);font:400 15px 'Lilita One',system-ui,sans-serif;color:#3a2006}
.b4wt span{display:flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:radial-gradient(#ffe38e,#e9a43a);border:2px solid #3a2006;font:900 14px system-ui}
.b4bi{border:2px solid #e6b54a;border-radius:10px;background:#141222cc;padding:6px 8px;display:flex;flex-direction:column;gap:4px}
.b4bn{display:flex;align-items:center;gap:6px;border-bottom:1px solid #e6b54a55;padding-bottom:3px}
.b4bn i{font-style:normal;font-size:20px}.b4bn b{flex:1;font:400 15px 'Lilita One',system-ui,sans-serif;color:#fff2d0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.b4bn em{font:400 13px 'Lilita One',system-ui;font-style:normal;color:#e8dcc0;white-space:nowrap}
.b4bl{display:flex;flex-direction:column;gap:3px}.b4bl span{font:700 12.5px system-ui;color:#fff2d0}.b4bl.dim span{color:#a8a0b8}
.b4p.bs.b4lk .b4r{opacity:.55;filter:grayscale(.5)}
.b4g{flex:none;display:flex;gap:10px;justify-content:center;margin-top:auto;padding-top:4px}
.b4m{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;height:74px;border:0;cursor:pointer;padding:0 10px;clip-path:polygon(9% 0,91% 0,100% 50%,91% 100%,9% 100%,0 50%);position:relative}
.b4m::before{content:"";position:absolute;inset:4px;clip-path:polygon(9% 0,91% 0,100% 50%,91% 100%,9% 100%,0 50%);z-index:0}
.b4m.ca{background:linear-gradient(#ffe38e,#c88a1c)}.b4m.ca::before{background:linear-gradient(#4a9cf0,#1f5cc0 60%,#163f8e)}
.b4m.rk{background:linear-gradient(#ffe38e,#c88a1c)}.b4m.rk::before{background:linear-gradient(#e8504a,#a81c22 60%,#70101a)}
.b4m span,.b4m b{position:relative;z-index:1}
.b4m span{font-size:30px;filter:drop-shadow(0 2px 1px #0008)}
.b4m b{font:400 20px/1 'Lilita One',system-ui,sans-serif;color:#ffe38e;text-align:left;text-shadow:0 2px 0 #2a1406,0 0 6px #0006;letter-spacing:.5px}
.b4m:active{transform:translateY(2px)}
.b4g.b4lk .b4m{filter:grayscale(.7) brightness(.75)}
`;document.head.appendChild(css);
}catch(e){console.log('v4 battle',e)}})();
