/* ===== v4 (27 Nov): leaderboards — world and friends, by RP this season. Opened from the Rank road. ===== */
(function w(){if(typeof SV==='undefined'||typeof RK==='undefined'){setTimeout(w,500);return}try{
const pop=html=>{const M=document.getElementById('menu');let p=M.querySelector('.mpop');if(p)p.remove();p=document.createElement('div');p.className='mpop spop';p.innerHTML='<div class="uc">'+html+'</div>';p.onclick=e=>{if(e.target===p)p.remove()};M.appendChild(p);return p};
 const F=window.__FRON,SEA=14*864e5,sid=()=>Math.floor(Date.now()/SEA),U3=window.__U3||{};
 const rkI=rp=>{let r=0;RK.forEach((x,i)=>{if((rp||0)>=x[1])r=i});return r};
 const POR=()=>{try{return window.__POR||(typeof PORT!=='undefined'?PORT:{})}catch(e){return {}}};
 const pic=h=>{try{const P=POR();return P[h]||P.k||''}catch(e){return ''}};
 const esc=t=>String(t==null?'':t).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
 const hsh=t=>{let h=7;for(const c of String(t))h=(h*31+c.charCodeAt(0))%1000003;return h};
 const N1=['Luna','Grim','Pyra','Frost','Brix','Nyx','Thorne','Juno','Dax','Elwin','Fenna','Rook','Ivy','Kael','Saffi','Wren','Taro','Quill','Lyra','Moss','Edda','Finch','Vex','Tobin','Orrin','Zara','Milo','Kira','Bram','Nova'];
 /* computer players, so the board is never empty; they climb a little during the season */
 const ai=()=>{const s=sid(),f=Math.min(1,(Date.now()-s*SEA)/SEA),L=[];
  for(let i=0;i<60;i++){const k=hsh('lb'+s+'_'+i+'x'+i*7919),q=hsh('n'+i+'_'+s),top=Math.round(1650*Math.pow(1-i/60,1.6)),rp=Math.max(0,Math.round(top*(.55+.45*f))-k%40);
   L.push({id:'ai_lb'+i,n:N1[(q+i*7)%N1.length]+(10+(q*13+i*37)%90),h:'kvsfih'[(k>>3)%6],rp,ai:1})}return L};
 const me=()=>({id:'me',n:SV.pname||'You',h:SV.pav||SV.mine||'k',rp:SV.rp||0,me:1});
 const st=document.createElement('style');st.textContent=`
#menu .lb4{display:flex;flex-direction:column;max-height:min(78vh,640px)}
#menu .lb4 .lbt{display:flex;gap:6px;margin:6px 0 8px}
#menu .lb4 .lbt button{flex:1;height:34px;border-radius:10px;border:2px solid #4a2a08;background:linear-gradient(#6a5030,#4a361e);color:#f0dcb8;font:400 16px 'Lilita One',system-ui,sans-serif}
#menu .lb4 .lbt button.on{background:linear-gradient(#ffe27a,#f5a623);color:#4a2208;border-color:#7a3f08}
#menu .lb4 .lbs{font:600 12px system-ui;color:#e8d6b4;text-align:center;margin-bottom:6px}
#menu .lb4 .lbl{overflow:auto;flex:1;min-height:120px;display:flex;flex-direction:column;gap:5px;padding:2px}
#menu .lb4 .lbr{display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:10px;background:#00000038;border:1.5px solid #ffffff14}
#menu .lb4 .lbr.me{background:linear-gradient(90deg,#f5c24240,#f5c24214);border-color:#f5c242}
#menu .lb4 .lbr em{width:26px;text-align:center;font:400 17px 'Lilita One',system-ui,sans-serif;color:#fff;font-style:normal}
#menu .lb4 .lbr.t1 em{color:#ffd76a}#menu .lb4 .lbr.t2 em{color:#dfe6f0}#menu .lb4 .lbr.t3 em{color:#e8a066}
#menu .lb4 .lbr .av{width:34px;height:34px;border-radius:50%;overflow:hidden;border:2px solid #f2c25a;flex:none;background:#2a3a6a}
#menu .lb4 .lbr .av img{width:100%;height:100%;object-fit:cover}
#menu .lb4 .lbr b{flex:1;min-width:0;text-align:left;font:700 14px system-ui;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#menu .lb4 .lbr .rb{width:28px;height:28px;object-fit:contain;flex:none}
#menu .lb4 .lbr span{min-width:58px;text-align:right;font:400 15px 'Lilita One',system-ui,sans-serif;color:#ffd76a}
#menu .lb4 .lbme{margin-top:6px}
#menu .rr3 .rbt .lbb{margin-right:8px}`;document.head.appendChild(st);
 let TAB='w',CACHE=null;
 const row=(p,i)=>{const r=rkI(p.rp);return '<div class="lbr'+(p.me?' me':'')+(i<3?' t'+(i+1):'')+'"><em>'+(i+1)+'</em><div class="av"><img alt="" src="'+pic(p.h)+'"></div><b>'+esc(p.n)+(p.me?' (you)':'')+'</b><img class="rb" alt="" src="'+(U3['rk'+r]||'')+'"><span>'+(p.rp||0)+' RP</span></div>'};
 async function world(){const s=sid();let real=[];
  if(F&&F.on&&window.__ON&&__ON.db){if(CACHE&&Date.now()-CACHE.t<60e3)real=CACHE.L;else{try{const q=await __ON.db.collection('profiles').orderBy('rp','desc').limit(100).get();
   real=q.docs.map(d=>Object.assign({id:d.id},d.data())).filter(p=>p.name&&+p.ss===s&&d0(p)).map(p=>({id:p.id,n:p.name,h:p.h||'k',rp:+p.rp||0}));CACHE={t:Date.now(),L:real}}catch(e){console.log('leaderboard',e&&e.code)}}}
  const mid=F&&F.uid;real=real.filter(p=>p.id!==mid&&!(window.__isBlk&&__isBlk(p.id)));return real.concat(ai(),[me()])}
 const d0=p=>true;
 function friends(){const L=[me()];try{(window.__friends?__friends():[]).forEach(f=>{let rp=f.rp;if(rp==null||(f.real&&+f.ss!==sid())){const i=Math.max(0,RK.findIndex(x=>x[0]===f.rk));rp=f.real?(+f.ss===sid()?rp:0):(RK[i][1]+hsh(f.id)%Math.max(20,((RK[i+1]||[0,RK[i][1]+200])[1]-RK[i][1])))}L.push({id:f.id,n:f.n,h:f.h,rp:rp||0})})}catch(e){}return L}
 async function draw(){const p=document.querySelector('#menu .lb4 .lbl'),m=document.querySelector('#menu .lb4 .lbme');if(!p)return;p.innerHTML='<div class="lbs">Loading…</div>';
  const L=(TAB==='w'?await world():friends()).sort((a,b)=>(b.rp||0)-(a.rp||0));const top=TAB==='w'?L.slice(0,100):L,mi=L.findIndex(x=>x.me);
  if(!document.querySelector('#menu .lb4'))return;p.innerHTML=top.map(row).join('');
  if(m)m.innerHTML=TAB==='w'&&mi>=100?row(L[mi],mi):'';
  const mine=p.querySelector('.lbr.me');if(mine&&mi>4)mine.scrollIntoView({block:'center'})}
 const left=()=>{const ms=(sid()+1)*SEA-Date.now();return Math.floor(ms/864e5)+'d '+Math.floor(ms%864e5/36e5)+'h'};
 window.__lbOpen=t=>{if(t)TAB=t;pop('<div class="lb4"><b class="st">Leaderboard</b><div class="lbs">This season · ends in '+left()+'</div><div class="lbt"><button class="'+(TAB==='w'?'on':'')+'" onclick="__lbOpen(\'w\')">World</button><button class="'+(TAB==='f'?'on':'')+'" onclick="__lbOpen(\'f\')">Friends</button></div><div class="lbl"></div><div class="lbme"></div><div class="us2"><button class="opr rm" onclick="soClose();__rankRoad&&__rankRoad()">Back</button></div></div>');draw()};
 /* button in the Rank road */
 setInterval(()=>{try{const b=document.querySelector('#menu .mpop .rr3 .rbt');if(!b||b.querySelector('.lbb')||!document.querySelector('#menu .mpop .rr3 .rrl'))return;b.insertAdjacentHTML('afterbegin','<button class="lbb" onclick="__lbOpen()">Leaderboard</button>')}catch(e){}},300);
}catch(e){console.warn('v4 leaderboard',e)}})();
