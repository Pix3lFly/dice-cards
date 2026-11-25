/* V4 hero skins (placeholder until the skin models arrive): a "Skins" button to the right of the hero on the Battle page;
   window with the 3 skins (Basic, Champion = 100 wins with this hero, Legendary = paid), current → arrow → chosen; Equip says "coming soon" */
(function w(){if(typeof menu!=='function'||typeof SV==='undefined'||typeof HD==='undefined'){setTimeout(w,400);return}try{
const POR=()=>window.__POR||{};
const SK=[{id:0,n:'Basic',d:'The classic look.'},{id:1,n:'Champion',d:'Win 100 games with this hero.'},{id:2,n:'Legendary',d:'Premium skin · $19.99'}];
const img=(h,i,b)=>i?((window.__SKI||{})[(b?'b':'l')+i+h]||''):(POR()[h]||'');
let sel=1;
const wins=h=>{try{return (SV.st&&SV.st.hw&&SV.st.hw[h])||0}catch(e){return 0}};
const owned=(h,i)=>i===0||(i===1&&wins(h)>=100);
function card(h,s,big){return '<div class="skc'+(big?' big':'')+'"><div class="skp'+(s.id?' bd':'')+'"><img alt="" src="'+img(h,s.id,1)+'">'+(s.id?'<i class="skq">'+(s.id===1?'🏆':'💎')+'</i>':'')+'</div><b>'+s.n+'</b></div>'}
window.__skinPop=function(){const h=SV.mine,eq=0,M=document.getElementById('menu');let p=M.querySelector('.mpop');if(p)p.remove();
 const s=SK[sel],ow=owned(h,sel),hw=wins(h);
 const st=sel===0?'<span class="sko">✓ Equipped</span>':sel===1?(ow?'<span class="sko">✓ Unlocked</span>':'<div class="skbar"><i style="width:'+Math.min(100,hw)+'%"></i><span>'+hw+' / 100 wins</span></div>'):'<span class="skpr">$19.99</span>';
 p=document.createElement('div');p.className='mpop spop';p.innerHTML='<div class="uc skw"><b class="st">'+(HD[h].nm||HD[h].n)+' skins</b>'+
  '<div class="skcmp">'+card(h,SK[eq],1)+'<div class="skar">➜</div>'+card(h,s,1)+'</div>'+
  '<div class="skd">'+s.d+'</div>'+st+
  '<div class="skl">'+SK.map(x=>'<button class="skt'+(x.id===sel?' on':'')+'" onclick="__skinSel('+x.id+')"><img alt="" class="'+(x.id?'lg':'')+'" src="'+img(h,x.id,0)+'"><span>'+x.n+'</span>'+(owned(h,x.id)?'':'<i>🔒</i>')+'</button>').join('')+'</div>'+
  '<div class="us2"><button class="opr rm" onclick="soClose()">Close</button><button class="opr" onclick="__skinEq()">'+(sel===2&&!ow?'Buy':'Equip')+'</button></div></div>';
 p.onclick=e=>{if(e.target===p)p.remove()};M.appendChild(p)};
window.__skinSel=i=>{sel=i;try{snd(600,.04,'triangle')}catch(e){}__skinPop()};
window.__skinEq=()=>{const n=document.createElement('div');n.className='m3note';n.textContent='Hero skins are coming soon!';document.body.appendChild(n);setTimeout(()=>n.remove(),1800)};
function deco(){if(typeof tab==='undefined'||tab!=='main')return;const stg=document.querySelector('#mb.m3 .stg');if(!stg||stg.querySelector('.skbtn'))return;
 if(!stg.querySelector('.hro'))return;stg.insertAdjacentHTML('beforeend','<button class="skbtn" onclick="event.stopPropagation();__skinPop()"><span>👕</span><b>Skins</b></button>')}
const _m=menu;menu=function(){const r=_m.apply(this,arguments);try{deco()}catch(e){}return r};setInterval(()=>{try{deco()}catch(e){}},1000);
const css=document.createElement('style');css.textContent=`
#mb.m3 .stg .skbtn{position:absolute;right:calc(50% - var(--iw,240px)*.62);top:42%;z-index:5;display:flex;flex-direction:column;align-items:center;gap:1px;width:56px;padding:6px 0 5px;border-radius:14px;border:2px solid #8a5f17;background:linear-gradient(#ffe38e,#e9ac2e 60%,#d08f1c);box-shadow:inset 0 2px 0 #fff3c4,0 3px 0 #5a3608,0 5px 10px #0007;cursor:pointer;animation:skP 2.4s ease-in-out infinite}
#mb.m3 .stg .skbtn span{font-size:22px;line-height:1}#mb.m3 .stg .skbtn b{font:400 13px 'Lilita One',system-ui,sans-serif;color:#3a2006}
#mb.m3 .stg .skbtn:active{transform:translateY(2px)}
@keyframes skP{50%{transform:translateY(-3px)}}
#menu .skw{width:min(88vw,360px);box-sizing:border-box}
#menu .skcmp{display:flex;align-items:center;justify-content:center;gap:8px;margin:8px 0 6px}
#menu .skc{display:flex;flex-direction:column;align-items:center;gap:4px}
#menu .skc .skp{position:relative;width:96px;height:96px;border-radius:18px;background:radial-gradient(circle at 50% 40%,#fff6d0,#e7b34a 60%,#8a5a1c);border:3px solid #f2c25a;box-shadow:0 0 0 2px #6b3f0a,0 6px 12px #0008;overflow:hidden}
#menu .skc .skp{width:112px;height:132px}
#menu .skc .skp img{width:100%;height:100%;object-fit:cover}
#menu .skc .skp.bd img{object-fit:contain;padding:6px 4px 2px;box-sizing:border-box;filter:drop-shadow(0 3px 3px #0007)}
#menu .skc .skq{position:absolute;right:4px;top:4px;font-style:normal;font-size:16px}
#menu .skc b{font:400 15px 'Lilita One',system-ui,sans-serif;color:#ffe08a}
#menu .skar{font:900 34px system-ui;color:#ffd23f;text-shadow:0 2px 0 #6b3f0a;animation:skA 1s ease-in-out infinite alternate}
@keyframes skA{to{transform:translateX(5px)}}
#menu .skd{font:600 13px system-ui,sans-serif;color:#fff2d8;margin:2px 0 6px}
#menu .sko{display:inline-block;font:800 13px system-ui;color:#8fe37a;margin-bottom:6px}
#menu .skpr{display:inline-block;font:400 18px 'Lilita One',system-ui,sans-serif;color:#7dff9a;margin-bottom:6px}
#menu .skbar{position:relative;height:18px;border-radius:9px;background:#1c120a;border:1.5px solid #8a6326;overflow:hidden;margin:0 10px 8px}
#menu .skbar i{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(#ffe38e,#e9ac2e)}
#menu .skbar span{position:relative;font:800 11px/16px system-ui;color:#fff;text-shadow:0 1px 2px #000}
#menu .skl{display:flex;gap:8px;justify-content:center;margin:4px 0 10px}
#menu .skt{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;width:74px;padding:5px 0;border-radius:12px;border:2px solid #8a6326;background:#2a1a0bcc;cursor:pointer}
#menu .skt.on{border-color:#ffd23f;box-shadow:0 0 0 2px #ffd23f55,0 0 10px #ffd23f88}
#menu .skt img{width:44px;height:44px;border-radius:10px;object-fit:cover}
#menu .skt img.lg{border-radius:50%}
#menu .skt span{font:400 12px 'Lilita One',system-ui,sans-serif;color:#fff2d8}
#menu .skt i{position:absolute;right:4px;top:3px;font-style:normal;font-size:12px}
`;document.head.appendChild(css);
}catch(e){console.log('v4 skins',e)}})();
