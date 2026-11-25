
/* ===== v4: real friend battle invites — in a game / refused / no response (30 s) / accepted → 3-2-1 start ===== */
(function(){try{
const O=window.__ON,F=window.__FRON;if(!O||!F)return;
const esc=t=>String(t==null?'':t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const FV=()=>firebase.firestore.FieldValue,db=()=>O.db,ON=()=>F.on;
const ms=v=>v&&v.toMillis?v.toMillis():(+v||0);
const WAIT=30;
const POR=()=>window.__POR||{};
const okH=h=>{try{return HD[h]||(/^[kvsfih][12]$/.test(h)&&(window.__POR||{})[h])?h:'k'}catch(e){return 'k'}};
const rnk=()=>{try{let r=0;RK.forEach((x,i)=>{if((SV.rp||0)>=x[1])r=i});return RK[r][0]}catch(e){return ''}};
const vis=id=>{const e=document.getElementById(id);return !!e&&getComputedStyle(e).display!=='none'};
const inGame=()=>!vis('menu')&&!vis('splash');
const snd2=(f,d)=>{try{snd(f,d||.1,'triangle',.08)}catch(e){}};
/* same popup look as the game's matchmaking boxes */
const DICE='data:image/svg+xml;base64,'+btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 100"><g stroke="#3a2006" stroke-width="3" stroke-linejoin="round"><g transform="rotate(-14 40 56)"><rect x="12" y="28" width="56" height="56" rx="12" fill="#fff8ec"/><g fill="#d8342a" stroke="none"><circle cx="27" cy="43" r="5.5"/><circle cx="53" cy="69" r="5.5"/><circle cx="40" cy="56" r="5.5"/></g></g><g transform="rotate(12 82 46)"><rect x="56" y="18" width="52" height="52" rx="11" fill="#fff8ec"/><g fill="#d8342a" stroke="none"><circle cx="70" cy="32" r="5"/><circle cx="94" cy="32" r="5"/><circle cx="70" cy="56" r="5"/><circle cx="94" cy="56" r="5"/></g></g></g></svg>');
let TT=[],run=0;const clr=()=>{TT.forEach(clearTimeout);TT=[];run++};
const later=(ms,f)=>{const r=run;TT.push(setTimeout(()=>{if(r===run)f()},ms))};
const box=(title,body)=>{const M=document.getElementById('menu');let p=M.querySelector('.mpop');if(p)p.remove();p=document.createElement('div');p.className='mpop';p.innerHTML='<div class="uc pp3 mm3"><img class="em3" alt="" src="'+DICE+'"><b class="rb3">'+title+'</b>'+body+'</div>';M.appendChild(p);return p};
const close=()=>{clr();const p=document.querySelector('#menu .mpop');if(p)p.remove()};
const av=h=>'<div class="vs3"><div class="av en"><img alt="" src="'+(POR()[okH(h)]||'')+'"></div></div>';
const bar=()=>'<div class="ivb" style="height:8px;margin:8px 6px 2px;border-radius:5px;background:#2a1d12;overflow:hidden"><i style="display:block;height:100%;width:100%;background:linear-gradient(#ffe38e,#e9a52b);transition:width 1s linear"></i></div><div class="tm3 ivs">'+WAIT+'s</div>';
const runBar=(p,t0,onEnd)=>{const tk=()=>{const left=Math.max(0,WAIT-Math.floor((Date.now()-t0)/1000)),i=p.querySelector('.ivb i'),s=p.querySelector('.ivs');if(i)i.style.width=(100*left/WAIT)+'%';if(s)s.textContent=left+'s';if(left<=0){onEnd();return}later(250,tk)};tk()};
const vs=(foe,rk)=>'<div class="vs3"><div class="av"><img alt="" src="'+((window.__myPic&&__myPic())||POR()[SV.mine]||'')+'"></div><b>VS</b><div class="av en"><img alt="" src="'+(POR()[okH(foe.h)]||'')+'"></div></div><div class="nm3"><span>'+esc(SV.pname||'You')+'<small>'+esc(rnk())+'</small></span><span style="text-align:right">'+esc(foe.n)+'<small>'+esc(foe.rk||'')+'</small></span></div>';
/* the countdown + match start, exactly like the old "Request accepted!" */
const start=(foe,title,lv,md)=>{const p=box(title,vs(foe,foe.rk)+'<div class="cd3">3</div><p>Match starting…</p>');let n=3;
 const tick=()=>{const c=p.querySelector('.cd3');if(c)c.textContent=n;try{snd(n?880:1320,.06,'sine',.08)}catch(e){}
  if(n===0){close();window.__foe={n:foe.n,h:okH(foe.h)};window.__frM=1;if(lv){window.__LIVEP=lv;if(!SV.m1){SV.m1=1;try{sv()}catch(e){}}}window.__mmOK=1;try{go(md||'casual')}finally{window.__mmOK=0}return}n--;later(1000,tick)};tick()};
const result=(f,msg)=>{box('Battle request',av(f.h)+'<p class="bad">'+msg+'</p><div class="bts3"><button onclick="__ivClose()">OK</button></div>');snd2(330,.12)};
window.__ivClose=()=>close();

/* ---------- in-a-game flag on your profile ---------- */
let igW=null;
setInterval(()=>{if(!ON())return;const g=inGame();if(g===igW)return;igW=g;db().collection('profiles').doc(F.uid).set({ig:g,seen:FV().serverTimestamp()},{merge:true}).catch(e=>console.log('ig',e&&e.code))},1000);

/* ---------- sending an invite ---------- */
let mine=null; // {ref,unsub,f}
const stopMine=(st)=>{if(!mine)return;const m=mine;mine=null;try{m.unsub()}catch(e){}if(st)m.ref.set({st:st},{merge:true}).catch(()=>{})};
window.__ivCancel=()=>{stopMine('cancel');close()};
window.__invite=function(f,p){if(!ON())return;stopMine('cancel');clr();
 if(!F.isOnline(p)){result(f,'<b style="color:#ffb4a4">'+esc(f.n)+'</b> is offline.</p><p>Try again when they are online!');return}
 if(p.ig){result(f,'<b style="color:#ffb4a4">'+esc(f.n)+'</b> is already in a game.</p><p>Try again later!');return}
 const ref=db().collection('invites').doc(F.uid+'_'+f.id),k=Math.random().toString(36).slice(2,10),t0=Date.now();
 const pb=box('Battle request',av(f.h)+'<p>Asking <b>'+esc(f.n)+'</b> to battle…</p>'+bar()+'<div class="bts3"><button class="sec" onclick="__ivCancel()">Cancel</button></div>');
 const mid=F.uid+'_'+f.id+'_'+k;
 db().collection('matches').doc(mid).set({a:F.uid,b:f.id,t:FV().serverTimestamp()}).then(()=>ref.set({from:F.uid,to:f.id,fromName:SV.pname||'',fromH:okH(SV.mine),fromRk:rnk(),st:'wait',k:k,mid:mid,t:FV().serverTimestamp()})).then(()=>{
  const un=ref.onSnapshot(s=>{if(!mine||mine.k!==k)return;const d=s.data()||{};if(d.k!==k)return;
   if(d.st==='yes'){stopMine();clr();snd2(784);start({n:f.n,h:d.toH||f.h,rk:f.rk},'Request accepted!',{mid:mid,host:1,them:f.id,name:f.n})}
   else if(d.st==='no'){stopMine();clr();result(f,'<b style="color:#ffb4a4">'+esc(f.n)+'</b> refused your battle request.')}
   else if(d.st==='busy'){stopMine();clr();result(f,'<b style="color:#ffb4a4">'+esc(f.n)+'</b> is already in a game.</p><p>Try again later!')}},e=>console.log('invite watch',e&&e.code));
  mine={ref,unsub:un,f,k};
 }).catch(e=>{console.log('invite',e&&e.code);clr();result(f,'Could not send the request — try again.')});
 runBar(pb,t0,()=>{if(mine&&mine.k===k){stopMine('gone');result(f,'No response from <b style="color:#ffb4a4">'+esc(f.n)+'</b>.</p><p>Try again later!')}})};

/* ---------- receiving an invite ---------- */
let seenK={},cur=null,unIn=null;
function onInv(q){q.docs.forEach(s=>{const d=s.data()||{},id=s.id;
  if(cur&&cur.id===id&&cur.k===d.k&&d.st!=='wait'){const c=cur;cur=null;if(document.querySelector('#menu .mpop .ivr'))close();return}
  if(d.st!=='wait'||!d.k||seenK[d.k])return;
  const age=d.t?Date.now()-ms(d.t):0;if(age>(WAIT+5)*1000)return;
  seenK[d.k]=1;
  if(inGame()){s.ref.set({st:'busy'},{merge:true}).catch(()=>{});return}
  if(vis('splash'))return;
  show(s.ref,id,d,age)})}
function show(ref,id,d,age){clr();cur={id,k:d.k};const t0=Date.now()-Math.max(0,age||0),foe={n:d.fromName||'Player',h:d.fromH,rk:d.fromRk||''};
 const p=box('Battle request',av(foe.h)+'<p class="ivr"><b>'+esc(foe.n)+'</b> wants to battle you!</p>'+bar()+'<div class="bts3"><button onclick="__ivAns(1)">Accept</button><button class="sec" onclick="__ivAns(0)">Decline</button></div>');
 try{snd(660,.1,'triangle',.1);setTimeout(()=>snd(880,.12,'triangle',.1),120)}catch(e){}
 window.__ivAns=ok=>{if(!cur||cur.k!==d.k)return;cur=null;clr();
  if(ok){ref.set({st:'yes',toH:okH(SV.mine)},{merge:true}).then(()=>start(foe,'Battle accepted!',d.mid?{mid:d.mid,host:0,them:d.from,name:foe.n}:null)).catch(e=>{console.log('accept',e&&e.code);close()})}
  else{ref.set({st:'no'},{merge:true}).catch(()=>{});close()}};
 runBar(p,t0,()=>{if(cur&&cur.k===d.k){cur=null;close()}})}
window.addEventListener('dc-auth',()=>{stopMine();if(unIn){unIn();unIn=null}seenK={};cur=null});
setInterval(()=>{if(ON()&&!unIn){unIn=db().collection('invites').where('to','==',F.uid).onSnapshot(onInv,e=>{console.log('invites',e&&e.code);unIn=null})}},1000);

/* ---------- real matchmaking (25 Nov): Casual/Ranked search pairs two real players, else an AI opponent after ~10 s ----------
   mm/{uid} {uid,n,h,rk,mode,st:'wait'|'host'|'paired',k,mid,by,byN,byH,byRk,c,t}. The finder writes its own doc's mid,
   creates matches/{mid} (rules allow it because mm/{me}.mid == mid) and pairs the other doc in a transaction; it hosts. */
let MM=null;const MMW=10000;
const mmDoc=u=>db().collection('mm').doc(u);
window.__mmStop=()=>{if(!MM)return;const S=MM;MM=null;S.dead=1;try{S.un&&S.un()}catch(e){}clearTimeout(S.to);clearTimeout(S.pt);if(!S.done)mmDoc(F.uid).delete().catch(()=>{})};
window.__mmReal=function(m,baseLater,AI,baseClose){if(!ON()||window.__mmOff)return false;window.__mmStop();
 const k=Math.random().toString(36).slice(2,10),me=mmDoc(F.uid),S={k};MM=S;
 const found=(foe,lv)=>{if(MM!==S||S.done)return;S.done=1;try{S.un&&S.un()}catch(e){}clearTimeout(S.to);clearTimeout(S.pt);MM=null;
  setTimeout(()=>me.delete().catch(()=>{}),8000);try{baseClose&&baseClose()}catch(e){}clr();snd2(784);
  box('Opponent found!',vs(foe,foe.rk)+'<p style="margin-top:8px!important">Get ready…</p>');later(1600,()=>start(foe,'Opponent found!',lv,m))};
 const giveUp=()=>{if(MM!==S||S.done)return;window.__mmStop();AI()};
 const pair=async()=>{if(MM!==S||S.done)return;
  try{const q=await db().collection('mm').where('mode','==',m).get();if(MM!==S||S.done)return;
   const c=q.docs.map(d=>d.data()).filter(d=>d&&d.uid&&d.uid!==F.uid&&d.st==='wait'&&Date.now()-(+d.c||0)<20000).sort((a,b)=>(a.c||0)-(b.c||0))[0];
   if(c){const mid='mm_'+F.uid.slice(0,8)+'_'+c.uid.slice(0,8)+'_'+k;
    await me.set({st:'host',mid},{merge:true});
    let ok=false;try{await db().collection('matches').doc(mid).set({a:F.uid,b:c.uid,t:FV().serverTimestamp()});
     ok=await db().runTransaction(async tx=>{const r=mmDoc(c.uid),s=await tx.get(r),d=s.exists?s.data():null;if(!d||d.st!=='wait'||d.k!==c.k)return false;tx.update(r,{st:'paired',mid,by:F.uid,byN:SV.pname||'Player',byH:okH(SV.mine),byRk:rnk()});return true})}catch(e){console.log('mm pair',e&&e.code)}
    if(ok&&MM===S&&!S.done){found({n:c.n||'Player',h:c.h,rk:c.rk||''},{mid,host:1,them:c.uid,name:c.n||'Player'});return}
    db().collection('matches').doc(mid).delete().catch(()=>{});if(MM===S&&!S.done)await me.set({st:'wait',mid:''},{merge:true})}}
  catch(e){console.log('mm search',e&&e.code)}
  if(MM===S&&!S.done)S.pt=setTimeout(pair,1500+Math.random()*1500)};
 me.set({uid:F.uid,n:SV.pname||'Player',h:okH(SV.mine),rk:rnk(),mode:m,st:'wait',k,mid:'',c:Date.now(),t:FV().serverTimestamp()}).then(()=>{
  if(MM!==S)return;
  S.un=me.onSnapshot(s=>{const d=s.exists?s.data():null;if(!d||MM!==S||S.done)return;if(d.st==='paired'&&d.mid&&d.k===k&&d.by)found({n:d.byN||'Player',h:d.byH,rk:d.byRk||''},{mid:d.mid,host:0,them:d.by,name:d.byN||'Player'})},e=>console.log('mm watch',e&&e.code));
  S.pt=setTimeout(pair,400+Math.random()*900)}).catch(e=>{console.log('mm join',e&&e.code);giveUp()});
 S.to=setTimeout(giveUp,MMW);return true};
window.addEventListener('dc-auth',()=>window.__mmStop());
}catch(e){console.warn('v4 invite',e)}})();
