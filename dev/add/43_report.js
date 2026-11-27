/* ===== v4 (27 Nov): report a player (with a reason) and block a player ===== */
(function w(){if(typeof SV==='undefined'||!window.__pfShow||!window.__FRON){setTimeout(w,500);return}try{
const pop=html=>{const M=document.getElementById('menu');let p=M.querySelector('.mpop');if(p)p.remove();p=document.createElement('div');p.className='mpop spop';p.innerHTML='<div class="uc">'+html+'</div>';p.onclick=e=>{if(e.target===p)p.remove()};M.appendChild(p);return p};
 const F=window.__FRON,ON=()=>F.on,db=()=>window.__ON.db,FV=()=>firebase.firestore.FieldValue;
 const real=u=>!!u&&u.length>=20&&!/^ai_/.test(u);
 const esc=t=>String(t==null?'':t).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
 const note=t=>{try{const n=document.createElement('div');n.className='m3note';n.textContent=t;document.body.appendChild(n);setTimeout(()=>n.remove(),2200)}catch(e){}};
 const BL=()=>{SV.blk=SV.blk&&typeof SV.blk==='object'?SV.blk:{};return SV.blk};
 window.__isBlk=u=>!!(u&&BL()[u]);
 const REASONS=[['name','Offensive name'],['lang','Bad language in messages'],['cheat','Cheating'],['spam','Spam'],['other','Something else']];
 const st=document.createElement('style');st.textContent=`
#menu .pfp .pfrb{display:flex;gap:8px;justify-content:center;margin:2px 0 -2px}
#menu .pfp .pfrb button{flex:1;max-width:140px;height:30px;border-radius:9px;border:1.5px solid #5a2a14;background:linear-gradient(#7a3a24,#5a2614);color:#ffd9c8;font:400 14px 'Lilita One',system-ui,sans-serif;box-shadow:inset 0 1px 0 #b0604080,0 2px 0 #2a1008}
#menu .pfp .pfrb button.ub{background:linear-gradient(#5a6a7a,#3a4654);border-color:#26303a;color:#e8f0ff}
#menu .rpw .rpl{display:flex;flex-direction:column;gap:6px;margin:6px 0 8px;text-align:left}
#menu .rpw .rpl label{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:10px;background:#00000038;border:1.5px solid #ffffff1c;font:600 13.5px system-ui;color:#fff;cursor:pointer}
#menu .rpw .rpl label.on{border-color:#f5c242;background:#f5c24224}
#menu .rpw .rpl input{accent-color:#f5c242;width:17px;height:17px;margin:0}
#menu .rpw textarea{width:100%;box-sizing:border-box;border-radius:10px;padding:8px;font:500 13px system-ui;resize:none}
#menu .rpw .smsg{min-height:16px}
#menu .bkl .bkr{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:10px;background:#00000038;margin:5px 0;font:600 13.5px system-ui;color:#fff}
#menu .bkl .bkr b{flex:1;text-align:left}#menu .bkl .bkr button{height:28px;padding:0 10px;border-radius:8px;border:1.5px solid #26303a;background:linear-gradient(#6a7a8a,#46525e);color:#fff;font:400 13px 'Lilita One',system-ui}`;
 document.head.appendChild(st);
 /* buttons on other players' profiles */
 let CUR=null;
 const _pf=window.__pfShow;
 window.__pfShow=function(o){const r=_pf.apply(this,arguments);try{o=o||{};const ids=F.ids?F.ids():[];const u=o.uid||(ids.includes(o.id)?o.id:null)||(/^ai_/.test(o.id||'')?o.id:null);
  if(!u||u===F.uid)return r;CUR={u,n:o.n||'Player',num:o.num||''};const box=document.querySelector('#menu .mpop .pfp');if(!box||box.querySelector('.pfrb'))return r;
  const us=box.querySelector('.us2');const b=__isBlk(u)?'<button class="ub" onclick="__unblk()">Unblock</button>':'<button onclick="__blkAsk()">Block</button>';
  (us||box).insertAdjacentHTML(us?'beforebegin':'beforeend','<div class="pfrb"><button onclick="__rpAsk()">Report</button>'+b+'</div>')}catch(e){console.log('rp btn',e)}return r};
 /* report */
 let RS='';
 window.__rpAsk=()=>{const c=CUR;if(!c)return;RS='';
  pop('<div class="rpw"><b class="st">Report '+esc(c.n)+'</b><p>Why are you reporting this player?</p><div class="rpl">'+REASONS.map(([k,l])=>'<label data-k="'+k+'"><input type="radio" name="rpr" value="'+k+'">'+l+'</label>').join('')+'</div>'+
   '<textarea id="rptx" rows="2" maxlength="200" placeholder="More details (optional)"></textarea><div id="rpm" class="smsg"></div><div class="us2"><button class="opr rm" onclick="soClose()">Cancel</button><button class="opr" id="rpgo" onclick="__rpSend()">Send report</button></div></div>');
  document.querySelectorAll('#menu .rpl label').forEach(l=>l.onclick=()=>{RS=l.dataset.k;document.querySelectorAll('#menu .rpl label').forEach(x=>x.classList.toggle('on',x===l));const i=l.querySelector('input');if(i)i.checked=true})};
 window.__rpSend=async()=>{const c=CUR,m=document.getElementById('rpm'),say=t=>{if(m)m.textContent=t};if(!c)return;if(!RS){say('Pick a reason.');return}
  const tx=((document.getElementById('rptx')||{}).value||'').trim().slice(0,200),b=document.getElementById('rpgo');
  const done=()=>{try{soClose()}catch(e){}note('Thanks — our team will look into it.')};
  if(!real(c.u)||!ON()){SV.rpd=SV.rpd||{};SV.rpd[c.u]=Date.now();try{sv()}catch(e){}return done()}
  const day=Math.floor(Date.now()/864e5),id=F.uid+'_'+c.u+'_'+day;if(b)b.disabled=true;say('Sending…');
  try{await db().collection('reports').doc(id).set({from:F.uid,fromName:(F.prof&&F.prof.name)||SV.pname||'Player',uid:c.u,name:String(c.n).slice(0,16),num:String(c.num||''),reason:RS,text:tx,day:day,t:Date.now()});done()}
  catch(e){console.log('report',e&&e.code);if(b)b.disabled=false;say(e&&e.code==='permission-denied'?'You already reported this player today.':e&&e.code==='unavailable'?'No internet connection.':'Something went wrong — try again.')}};
 /* block */
 window.__blkAsk=()=>{const c=CUR;if(!c)return;
  pop('<b class="st">Block '+esc(c.n)+'?</b><p>They’ll be removed from your friends. You won’t get their friend requests, battle requests or mail, and you won’t be matched with them.</p><div class="us2"><button class="opr rm" onclick="soClose()">Cancel</button><button class="opr" onclick="__blkGo()">Block</button></div>')};
 window.__blkGo=()=>{const c=CUR;if(!c)return;BL()[c.u]={n:String(c.n).slice(0,16),t:Date.now()};try{sv()}catch(e){}
  try{const ids=F.ids?F.ids():[];if(ids.includes(c.u)||/^ai_/.test(c.u))window.frDel&&frDel(c.u)}catch(e){}
  try{const q=F.reqFrom&&F.reqFrom(c.u);if(q)window.frAcc&&frAcc(q.id,0)}catch(e){}
  try{soClose()}catch(e){}note(c.n+' is blocked');try{menu()}catch(e){}};
 window.__unblk=u=>{u=u||(CUR&&CUR.u);if(!u)return;const n=(BL()[u]||{}).n||'Player';delete BL()[u];try{sv()}catch(e){}note(n+' is unblocked');
  if(document.querySelector('#menu .bkl'))__blkList();else try{soClose()}catch(e){}};
 window.__blkList=()=>{const L=Object.entries(BL()).sort((a,b)=>b[1].t-a[1].t);
  pop('<div class="bkl"><b class="st">Blocked players</b>'+(L.length?L.map(([u,x])=>'<div class="bkr"><b>'+esc(x.n)+'</b><button onclick="__unblk(\''+esc(u)+'\')">Unblock</button></div>').join(''):'<p>No blocked players.</p>')+'<div class="us2"><button class="opr rm" onclick="soClose()">Close</button></div></div>')};
 /* link to the list under "Add a friend" */
 setInterval(()=>{try{const p=document.querySelector('#menu .mpop');if(!p||p.querySelector('.bklk'))return;if(!p.querySelector('#frn'))return;const n=Object.keys(BL()).length;if(!n)return;
  const us=p.querySelector('.us2');if(us)us.insertAdjacentHTML('beforebegin','<div class="bklk" style="text-align:center;margin:4px 0 2px"><a href="#" onclick="event.preventDefault();__blkList()" style="color:#ffd76a;font:700 12.5px system-ui">Blocked players ('+n+')</a></div>')}catch(e){}},500);
 /* incoming friend requests from blocked players are declined */
 setInterval(()=>{try{if(!ON()||!F.reqFrom)return;Object.keys(BL()).forEach(u=>{const q=F.reqFrom(u);if(q&&!q.__bk){q.__bk=1;window.frAcc&&frAcc(q.id,0)}})}catch(e){}},2000);
}catch(e){console.warn('v4 report',e)}})();
