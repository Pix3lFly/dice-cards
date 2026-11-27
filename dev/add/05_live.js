
/* ===== v4: live friend matches — the player whose turn it is runs the rules on their phone and streams
   the match state + animations to the other phone (mirrored, so everyone sees themselves on their own side) ===== */
(function(){try{
const O=window.__ON,F=window.__FRON;if(!O||!F)return;
const FV=()=>firebase.firestore.FieldValue,db=()=>O.db;
const $$=id=>document.getElementById(id);
const SH=x=>typeof x==='number'?(x+12)%24:x;
let L=null;                       // the live session
window.__LIVE=()=>L;
const live=()=>!!(L&&L.started&&!L.done);
const myTurn=()=>live()&&cur===0;
const theirTurn=()=>live()&&cur!==0;

/* ---------- cards & state (de)serialising ---------- */
function serC(c){if(!c)return null;const o=c.id?{i:c.id}:{n:c.n};if(c.sp)o.sp=1;return o}
function deC(o){if(!o)return null;let t;
 if(o.i&&(t=CAT.find(c=>c.id===o.i)))return Object.assign({},t,{sp:1});
 if(o.n&&(t=DEF.find(c=>c.n===o.n)))return o.sp?Object.assign({},t,{sp:1}):t;
 if(o.n&&(t=CAT.find(c=>c.n===o.n)))return Object.assign({},t,{sp:1});
 return {n:o.n||'?',h:'',a:'🎲',f:()=>1+Math.floor(Math.random()*6)}}
const CA=['hand','deck','disc'];
const plain=v=>{if(v==null||typeof v==='number'||typeof v==='string'||typeof v==='boolean')return v;
 if(Array.isArray(v))return v.map(plain).filter(x=>x!==undefined);
 if(typeof v==='object'&&Object.getPrototypeOf(v)===Object.prototype){const o={};for(const k in v){const x=plain(v[k]);if(x!==undefined)o[k]=x}return o}return undefined};
function serP(p){const o={};for(const k in p){const v=p[k];if(typeof v==='function')continue;if(CA.includes(k))o[k]=(v||[]).map(serC);else{const x=plain(v);if(x!==undefined)o[k]=x}}return o}
function snap(){return{P:[serP(P[0]),serP(P[1])],T:T.slice(),round,SD,over:over?1:0,cur,logs:(logs||[]).slice(),
 vt:(window.__vt||[null,null]).slice(),burn:(window.__burn||[null,null]).map(b=>b&&b.tiles?{tiles:b.tiles.slice(),last:b.last}:null)}}
/* turn the other phone's view into mine: swap players, rotate the board half way round */
function mir(S){const mp=o=>{if(!o)return o;const p=Object.assign({},o);['pos','base','via','via2'].forEach(k=>{if(typeof p[k]==='number')p[k]=SH(p[k])});if(typeof p.wf==='number')p.wf=1-p.wf;return p};
 return{P:[mp(S.P[1]),mp(S.P[0])],T:S.T.map((_,i)=>S.T[(i+12)%24]),round:S.round,SD:S.SD,over:S.over,cur:1-S.cur,logs:S.logs,
  vt:[SH(S.vt[1]),SH(S.vt[0])],burn:[S.burn[1],S.burn[0]].map(b=>b?{tiles:b.tiles.map(SH),last:SH(b.last)}:null)}}
const EDGE=['via','via2','wf'],KEEP=['name'];
function apply(M,full){if(!P||!M)return;
 for(let k=0;k<2;k++){const s=M.P[k],d=P[k];if(!s||!d)continue;const bt0=d.bt;
  Object.keys(d).forEach(key=>{if(!(key in s)&&!EDGE.includes(key)&&!KEEP.includes(key)&&typeof d[key]!=='function')delete d[key]});
  for(const key in s){if(KEEP.includes(key))continue;
   if(EDGE.includes(key)){if(full&&s[key]!==L.edge[k][key]){L.edge[k][key]=s[key];d[key]=s[key]}continue}
   d[key]=CA.includes(key)?(s[key]||[]).map(deC):(s[key]==null?s[key]:JSON.parse(JSON.stringify(s[key])))}
  if(full&&d.bt!==bt0)try{window.__3&&__3.setTile&&__3.setTile(d.base)}catch(e){}}
 for(let i=0;i<24;i++)if(T[i]!==M.T[i])T[i]=M.T[i];
 round=M.round;SD=M.SD;if(M.logs)logs=M.logs.slice();
 if(window.__vt){window.__vt[0]=M.vt[0];window.__vt[1]=M.vt[1]}
 if(window.__burn)[0,1].forEach(k=>{const b=M.burn[k];window.__burn[k]=b?{tiles:b.tiles.slice(),last:b.last,gid:gid}:null});
 if(full){cur=M.cur;busy=1}
 try{render()}catch(e){}}

/* ---------- network ---------- */
const mref=()=>db().collection('matches').doc(L.mid);
const pad=n=>String(n).padStart(6,'0');
const items=d=>{if(d.it)return d.it;try{return JSON.parse(d.j||'[]')}catch(e){return []}};
function put(S,n,it,tries){S.pend[n]=1;let pr;try{pr=db().collection('matches').doc(S.mid).collection('m').doc(S.me+'_'+pad(n)).set({s:S.me,n:n,j:JSON.stringify(it)})}catch(e){pr=Promise.reject(e)}
 pr.then(()=>{delete S.pend[n]}).catch(e=>{console.log('live send',e&&e.code);if((tries||0)<40)setTimeout(()=>put(S,n,it,(tries||0)+1),1000);else delete S.pend[n]})}
function flush(){if(!L||!L.out.length)return;const it=L.out;L.out=[];put(L,L.seq++,it,0)}
const send=(it)=>{if(!L)return;it.t=Date.now();L.out.push(it)};
window.__lvEmo=i=>{if(!live())return false;send({k:'emo',i:i});flush();return true};
function listen(){const S=L;
 S.un.push(mref().collection('m').where('s','==',S.them).onSnapshot(q=>{if(L!==S)return;
  q.docChanges().forEach(ch=>{if(ch.type!=='added')return;const d=ch.doc.data();if(d&&typeof d.n==='number'&&!(d.n in S.got))S.got[d.n]=items(d)});
  while(S.got[S.nextN]){const it=S.got[S.nextN];delete S.got[S.nextN];S.nextN++;it.forEach(x=>queue(x))}},e=>console.log('live listen',e&&e.code)));
 S.un.push(mref().onSnapshot(s=>{if(L!==S)return;const d=s.data()||{},h=d['h_'+S.them];if(h!==S.hb){S.hb=h;S.seen=Date.now()}},e=>console.log('live hb',e&&e.code)))}

/* a missing update (gap in the numbers) is fetched again */
setInterval(()=>{const S=L;if(!S||S.done)return;const has=Object.keys(S.got).length;if(!has){S.gapT=0;return}if(!S.gapT){S.gapT=Date.now();return}if(Date.now()-S.gapT<2500)return;S.gapT=Date.now();
 const n=S.nextN;mref().collection('m').doc(S.them+'_'+pad(n)).get().then(d=>{if(L!==S||!d.exists||n!==S.nextN)return;S.got[n]=items(d.data()||{});while(S.got[S.nextN]){const it=S.got[S.nextN];delete S.got[S.nextN];S.nextN++;it.forEach(x=>queue(x))}}).catch(e=>console.log('live gap',e&&e.code))},1000);
/* replay the other phone's items at the same pace they happened there */
function queue(x){const S=L;if(!S)return;if(x&&x.k==='emo'){try{window.__emoShow&&__emoShow(1,x.i)}catch(e){}return}const now=Date.now();if(S.off==null)S.off=now-x.t+150;let due=x.t+S.off;if(due<S.lastDue)due=S.lastDue;S.lastDue=due;S.q.push({due,x})}
setInterval(()=>{const S=L;if(!S||!S.q.length)return;const now=Date.now();while(S.q.length&&S.q[0].due<=now&&L===S){const {x}=S.q.shift();try{run(x)}catch(e){console.log('live run',e)}}},30);

function run(x){const S=L;
 if(x.k==='ro'){S.roT[x.n]=x.v;try{if(RO&&!RO.fin)drawRO()}catch(e){}resolveRO();return}
 if(x.k==='hello'){if(!S.host||!S.wait)return;const p=Object.assign({},x.p);['pos','base'].forEach(k=>{if(typeof p[k]==='number')p[k]=SH(p[k])});
  const d=P[1];const nm=d.name;for(const k in p){if(KEEP.includes(k))continue;d[k]=CA.includes(k)?(p[k]||[]).map(deC):p[k]}d.name=nm;d.first=1;d.via=d.via2=d.wf=null;
  try{window.setModel&&setModel(1,d.h)}catch(e){}try{window.__3&&__3.setTile&&__3.setTile(12)}catch(e){}
  S.wait=0;S.ready=1;S.seen=Date.now();if(!vis('intro'))busy=0;render();return}
 if(S.host&&S.wait)return;
 if(x.k==='s'||x.k==='pass'){const M=mir(x.d);S.last=M;S.ready=1;apply(M,true);if(M.over&&!over){finish(P[1].hp<=0?1:P[0].hp<=0?0:null,'');return}
  if(x.k==='pass'&&!over){S.off=null;S.lastDue=0;startMyTurn()}return}
 if(x.k==='e'){replay(x.e,x.a);if(S.last)apply(S.last,false);return}
 if(x.k==='ff'){finish(1,(S.themName||'Your friend')+' gave up — you win! 🏆');return}
 if(x.k==='left'){finish(1,(S.themName||'Your friend')+' left the match — you win! 🏆');return}}

/* ---------- my turn ends → hand over; their turn ends → my turn starts ---------- */
let nextIn=null;
function startMyTurn(){if(!L)return;if(!L.host)round=Math.max(0,round-1);cur=1;busy=0;L.turnT=Date.now();nextIn();
 setTimeout(()=>{try{if(myTurn()&&P[0].pts>0&&P[0].sk.some(l=>l<3))ask()}catch(e){}},600)}
(function w(){if(typeof next!=='function'){setTimeout(w,200);return}nextIn=next;
 next=function(){if(!live())return nextIn.apply(this,arguments);if(over)return;
  if(cur!==0)return; // only my side's hand-over moves the turn on
  if(MON.pend&&Date.now()-MON.t<9000){setTimeout(gt(next),300);return}
  if(P[0].pts>0&&P[0].sk.some(l=>l<3)){ask();setTimeout(gt(next),400);return}
  FT=null;['fgt','upm'].forEach(k=>{const e=$$(k);if(e)e.style.display='none'});
  if(L.host&&round<1)round=1;
  cur=1;busy=1;send({k:'pass',d:Object.assign(snap(),{cur:0})});L.lastSent='';flush();render()}})();

/* ---------- the AI never plays in a live match; rules sleep on the phone that is watching ---------- */
const sleepy=(name,ret)=>{const f=window[name];if(typeof f!=='function'||f.__lz)return;const w=function(){if(theirTurn())return ret;if(live()&&name==='ai')return;if(live()&&name==='autoUp')return;return f.apply(this,arguments)};w.__lz=1;window[name]=w};
['hurt','heal','fres','jres','move','attack','play','escape','end','bk','shopv','draw','up','ask','ai','autoUp','pk','bs','bl','fp'].forEach(n=>sleepy(n));

/* ---------- record the animations of my turn ---------- */
let depth=0;const KIND={fl:'fl',toast:'to',roll:'ro',lab:'la',cast:'ca',atkFx:'ak',__monFx:'mf',__x2:'x2',lvl:'lv',mfight:'mo'};
const SKIPT=/^(Play another card!|Hey!)/;
function wrapV(name){const f=window[name];if(typeof f!=='function'||f.__lv)return;
 const w=function(){const a=[...arguments];
  if(depth===0&&myTurn()&&!(name==='fl'&&window.__atk)&&!(name==='toast'&&SKIPT.test(String(a[1]))))
   try{send({k:'e',e:KIND[name],a:JSON.parse(JSON.stringify(a.map(v=>typeof v==='function'?null:v)))})}catch(e){}
  depth++;try{return f.apply(this,arguments)}finally{depth--}};
 w.__lv=1;w.__o=f;window[name]=w}
const wrapAll=()=>Object.keys(KIND).forEach(wrapV);wrapAll();setInterval(wrapAll,1500);
const FLIPT=[[/^Attack player!$/,'Enemy attacks you!'],[/^Enemy attacks you!$/,'Attack player!'],[/^You use (.+)$/,'Enemy uses $1'],[/^Enemy uses (.+)$/,'You use $1']];
const flipT=t=>{t=String(t);for(const [r,s] of FLIPT)if(r.test(t))return t.replace(r,s);return t};
const inner=name=>{const f=window[name];return f&&f.__o?f.__o:f};
function replay(e,a){a=a||[];const o=i=>typeof i==='number'?1-i:i;
 const call=(n,args)=>{const f=inner(n);if(typeof f==='function')f.apply(null,args)};
 if(e==='fl')call('fl',[o(a[0]),a[1],a[2]]);
 else if(e==='to')call('toast',[o(a[0]),flipT(a[1]),a[2],a[3]]);
 else if(e==='ro')call('roll',[a[0]]);
 else if(e==='la')call('lab',[o(a[0]),a[1]]);
 else if(e==='ca')call('cast',[a[0],o(a[1]),o(a[2]),a[3]]);
 else if(e==='ak')call('atkFx',[o(a[0]),o(a[1]),a[2],(a[3]||[]).map(l=>[o(l[0]),l[1],l[2]])]);
 else if(e==='mf'){call('__monFx',[o(a[0]),a[1],a[2]]);if(window.__monBusy&&!window.__monBusy()){call('mfight',[o(a[0])]);call('__monFx',[o(a[0]),a[1],a[2]])}}
 else if(e==='x2')call('__x2',[]);
 else if(e==='lv')call('lvl',[o(a[0])]);
 else if(e==='mo')call('mfight',[o(a[0])])}

/* ---------- send my state while it is my turn ---------- */
setInterval(()=>{if(!L||!L.started)return;
 if(myTurn()||(over&&!L.sentOver)){const s=snap(),js=JSON.stringify(s);if(js!==L.lastSent){L.lastSent=js;send({k:'s',d:s})}if(over)L.sentOver=1}
 flush()},150);
/* heartbeat + "your friend left" */
/* (27 Nov) my connection is checked too: a heartbeat only counts when the server confirms it.
   While MY connection is down I never win by "they left"; after 25 s without connection I lose and a "left" message is queued for the other phone. */
const hb=()=>{const S=L;if(!S||!S.started||S.done||document.visibilityState==='hidden')return;mref().set({['h_'+S.me]:Date.now()},{merge:true}).then(()=>{S.okAt=Date.now()}).catch(()=>{})};
setInterval(hb,4000);
const banner=t=>{let b=document.getElementById('lvnet');if(!t){if(b)b.remove();return}if(!b){b=document.createElement('div');b.id='lvnet';document.body.appendChild(b);
  const st=document.getElementById('lvnetcss')||document.createElement('style');st.id='lvnetcss';st.textContent="#lvnet{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 132px);transform:translateX(-50%);z-index:60;pointer-events:none;padding:8px 16px;border-radius:14px;background:#1a1030e6;border:2px solid #ffcf5a;color:#fff2d8;font:400 15px 'Lilita One',system-ui,sans-serif;white-space:nowrap;box-shadow:0 4px 10px #000a}#lvnet.bad{border-color:#ff7a6a}";document.head.appendChild(st)}
  b.className=t[1]||'';b.textContent=t[0]};
setInterval(()=>{if(!live()||over){banner(null);return}const S=L,now=Date.now();if(S.okAt==null)S.okAt=now;
 const mineBad=!navigator.onLine||now-S.okAt>10000;
 if(mineBad){if(!S.badAt)S.badAt=now;const left=Math.max(0,25-Math.round((now-S.badAt)/1000));banner(['📶 Connection lost — reconnecting… '+left+'s','bad']);
  if(now-S.badAt>25000){send({k:'left'});flush();banner(null);finish(0,'Connection lost — match over 💀')}return}
 S.badAt=0;
 const gone=now-S.seen,lim=S.ready?25000:60000;
 if(S.ready&&gone>8000){banner(['⏳ Waiting for '+(S.themName||'your opponent')+'… '+Math.max(0,Math.round((lim-gone)/1000))+'s'])}else banner(null);
 if(gone>lim){banner(null);finish(1,(S.themName||'Your friend')+' left the match — you win! 🏆')}},1000);
addEventListener('online',()=>{if(live()&&!over)hb()});


/* ---------- roll-off: each player rolls their own die; the screen stays until both rolled and someone won ---------- */
const escH=t=>String(t==null?'':t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function resolveRO(){const S=L;if(!S||typeof RO==='undefined'||!RO||RO.fin||RO.spin)return;const n=S.roN,a=S.roMine[n],b=S.roT[n];if(!a)return;RO.a=a;RO.b=b||0;
 if(!b){drawRO();return}const nm=S.themName||P[1].name;
 if(a===b){if(S.tieN===n)return;S.tieN=n;drawRO(['Tie! Roll again','#ffd166']);
  setTimeout(()=>{if(L!==S||!RO||RO.fin)return;S.roN=n+1;RO.a=RO.b=0;drawRO();clearTimeout(RO.t);RO.t=setTimeout(gt(()=>{if(RO&&!RO.fin)doRoll()}),20000)},1500);return}
 RO.fin=1;const me=a>b;try{roll(me?a:b)}catch(e){}drawRO([me?'You go first!':nm+' goes first!',me?'#6fe39a':'#ff8a7e']);setTimeout(gt(()=>startSeq(me)),1600)}
(function w(){if(typeof doRoll!=='function'||typeof drawRO!=='function'||typeof startSeq!=='function'){setTimeout(w,300);return}
 const _dr=doRoll,_draw=drawRO;
 drawRO=function(msg){if(!live()||typeof RO==='undefined'||!RO)return _draw.apply(this,arguments);const S=L,nm=escH(S.themName||P[1].name),th=RO.b||S.roT[S.roN]||0;
  const blk=(pl,v,mine)=>'<div class="rob '+(mine?'me':'en')+'"><div style="font-size:34px">'+pl.av+'</div><b>'+(mine?'You':nm)+'</b><div class="rod">'+(v||'?')+'</div>'+(mine?'<button class="bt" '+(RO.spin||RO.a?'disabled':'')+' onclick="doRoll()">'+(RO.spin?'Rolling…':RO.a?'Rolled':'🎲 Roll')+'</button>':'<div style="height:34px;font-size:12px;opacity:.8;line-height:34px">'+(v?'Rolled':'Waiting for '+nm+'…')+'</div>')+'</div>';
  $$('intro').innerHTML='<div class="it" style="font-size:22px">🎲 Roll dice to see who goes first</div><div class="rrow">'+blk(P[0],RO.a,1)+blk(P[1],th,0)+'</div><div class="it" style="font-size:22px;margin-top:10px;min-height:30px;color:'+(msg?msg[1]:'#fff')+'">'+(msg?msg[0]:'')+'</div>'};
 doRoll=function(){if(!live())return _dr.apply(this,arguments);if(typeof RO==='undefined'||!RO||RO.fin||RO.spin||RO.a)return;RO.spin=1;clearTimeout(RO.t);try{snd(300,.08,'square')}catch(e){}
  let n=0;const g=gid,S=L,att=S.roN;const iv=setInterval(()=>{if(g!==gid||!RO||L!==S){clearInterval(iv);return}n++;RO.a=1+Math.floor(Math.random()*6);if(n<9){drawRO();return}
   clearInterval(iv);RO.spin=0;S.roMine[att]=RO.a;send({k:'ro',n:att,v:RO.a});flush();drawRO();resolveRO()},90)}})();

/* ---------- safety net: if my turn sits on "Resolving…" with nothing changing for 30 s, finish the turn ---------- */
setInterval(()=>{if(!myTurn()||over||vis('intro')||FT||vis('upm')||!busy){if(L)L.stT=Date.now();return}
 if(L.stJs!==L.lastSent){L.stJs=L.lastSent;L.stT=Date.now();return}
 if(Date.now()-L.stT>30000){L.stT=Date.now();console.log('live unstick');try{end()}catch(e){}}},2000);


/* ---------- a lost monster fight always hurts the fighter (the damage normally lands inside the 3D attack) ---------- */
const MON={pend:0,t:0,i:0,ml:1};
(function w(){if(typeof window.__monFx!=='function'||typeof hurt!=='function'){setTimeout(w,500);return}
 const _h=hurt;hurt=function(i,d,src){if(src==='monster'&&MON.pend&&i===MON.i)MON.pend=0;return _h.apply(this,arguments)};
 setInterval(()=>{const f=window.__monFx;if(typeof f!=='function'||f.__mon)return;const g=function(i,ML,ok){if(myTurn()&&!ok){MON.pend=1;MON.t=Date.now();MON.i=i;MON.ml=ML;const id=gid;
   setTimeout(()=>{if(MON.pend&&gid===id&&myTurn()&&!over){MON.pend=0;try{hurt(i,[2,4,6][ML-1]||2,'monster');burst&&burst(i,'#ff5a4f',22);render()}catch(e){console.log('mon dmg',e)}}},4500)}
  return f.apply(this,arguments)};g.__mon=1;g.__lv=f.__lv;g.__o=f.__o||f;window.__monFx=g},700)})();

/* ---------- leaving: Menu → Leave, or the app in the background for 20 s, ends the match for both ---------- */
(function w(){if(typeof leaveGame!=='function'){setTimeout(w,300);return}const _lg=leaveGame;
 leaveGame=function(){if(live()&&!over){send({k:'left'});flush();L.ended=1;const S=L;setTimeout(()=>{if(L===S)stop()},1200)}return _lg.apply(this,arguments)}})();
let hidAt=0;
document.addEventListener('visibilitychange',()=>{if(!live()||over)return;
 if(document.visibilityState==='hidden'){hidAt=Date.now();return}
 /* back within 15 s: carry on (the other phone waits up to 25 s). Longer: I lose, and the other phone is told right away */
 if(hidAt&&Date.now()-hidAt>15000){hidAt=0;send({k:'left'});flush();finish(0,'You left the match 💀');return}
 hidAt=0;L.okAt=Date.now();L.badAt=0;hb()});

/* ---------- start / end ---------- */
const vis=id=>{const e=$$(id);return !!e&&getComputedStyle(e).display!=='none'};
function stop(){if(!L)return;const S=L;S.done=1;try{flush()}catch(e){}S.un.forEach(f=>{try{f()}catch(e){}});S.un=[]}
function finish(win,txt){if(!L||over&&L.ended)return;L.ended=1;
 if(!over){gid++;FT=null;['fgt','upm','intro'].forEach(k=>{const e=$$(k);if(e)e.style.display='none'});over=1;busy=1;try{render()}catch(e){}
  const t=$$('ovt');if(t)t.textContent=txt||(win?'You win! 🏆':'You lose 💀');const ov=$$('ov');if(ov)ov.style.display='flex';try{fin(!!win)}catch(e){}}
 setTimeout(stop,1500)}
(function w(){if(typeof init!=='function'){setTimeout(w,200);return}const _i=init;
 init=function(){const pend=window.__LIVEP;window.__LIVEP=null;if(L)stop();L=null;const r=_i.apply(this,arguments);
  if(pend&&O.db){L={mid:pend.mid,host:pend.host,me:F.uid,them:pend.them,themName:pend.name,started:1,done:0,out:[],seq:0,got:{},nextN:0,q:[],off:null,lastDue:0,
    edge:[{},{}],un:[],pend:{},gapT:0,roN:0,roT:{},roMine:{},seen:Date.now(),hb:null,wait:pend.host?1:0,lastSent:'',last:null};listen();
   if(!pend.host){cur=1;busy=1;const p=serP(P[0]);p.first=1;send({k:'hello',p});flush();render()}}
  return r}})();
setInterval(()=>{if(L&&L.host&&L.wait&&cur===0){busy=1}},100);
/* end of match: no rewards for friend battles, tell the friend if I give up */
(function w(){if(typeof fin!=='function'||typeof forfeit!=='function'){setTimeout(w,300);return}
 const _f=fin;fin=function(win){if(L){const r=$$('ovr');if(r)r.textContent='Friend battle · no rewards';try{if(!over)over=1}catch(e){}L.ended=1;setTimeout(stop,2500);return}return _f.apply(this,arguments)};
 const _ff=forfeit;forfeit=function(){if(live()&&!over){send({k:'ff'});flush()}return _ff.apply(this,arguments)}})();
setInterval(()=>{if(L&&L.done&&vis('menu'))L=null;else if(live()&&!over&&vis('menu')&&!vis('intro')){send({k:'left'});flush();L.ended=1;const S=L;setTimeout(()=>{if(L===S)stop()},1200)}},1000);
}catch(e){console.warn('v4 live',e)}})();
