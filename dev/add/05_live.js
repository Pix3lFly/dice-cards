
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
function serP(p){const o={};for(const k in p){const v=p[k];if(typeof v==='function')continue;if(CA.includes(k))o[k]=(v||[]).map(serC);else o[k]=v==null?v:JSON.parse(JSON.stringify(v))}return o}
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
function put(S,n,it,tries){S.pend[n]=1;db().collection('matches').doc(S.mid).collection('m').doc(S.me+'_'+pad(n)).set({s:S.me,n:n,it:it})
 .then(()=>{delete S.pend[n]}).catch(e=>{console.log('live send',e&&e.code);if((tries||0)<40)setTimeout(()=>put(S,n,it,(tries||0)+1),1000);else delete S.pend[n]})}
function flush(){if(!L||!L.out.length)return;const it=L.out;L.out=[];put(L,L.seq++,it,0)}
const send=(it)=>{if(!L)return;it.t=Date.now();L.out.push(it)};
function listen(){const S=L;
 S.un.push(mref().collection('m').where('s','==',S.them).onSnapshot(q=>{if(L!==S)return;
  q.docChanges().forEach(ch=>{if(ch.type!=='added')return;const d=ch.doc.data();if(d&&typeof d.n==='number'&&!(d.n in S.got))S.got[d.n]=d.it||[]});
  while(S.got[S.nextN]){const it=S.got[S.nextN];delete S.got[S.nextN];S.nextN++;it.forEach(x=>queue(x))}},e=>console.log('live listen',e&&e.code)));
 S.un.push(mref().onSnapshot(s=>{if(L!==S)return;const d=s.data()||{},h=d['h_'+S.them];if(h!==S.hb){S.hb=h;S.seen=Date.now()}},e=>console.log('live hb',e&&e.code)))}

/* a missing update (gap in the numbers) is fetched again */
setInterval(()=>{const S=L;if(!S||S.done)return;const has=Object.keys(S.got).length;if(!has){S.gapT=0;return}if(!S.gapT){S.gapT=Date.now();return}if(Date.now()-S.gapT<2500)return;S.gapT=Date.now();
 const n=S.nextN;mref().collection('m').doc(S.them+'_'+pad(n)).get().then(d=>{if(L!==S||!d.exists||n!==S.nextN)return;S.got[n]=(d.data()||{}).it||[];while(S.got[S.nextN]){const it=S.got[S.nextN];delete S.got[S.nextN];S.nextN++;it.forEach(x=>queue(x))}}).catch(e=>console.log('live gap',e&&e.code))},1000);
/* replay the other phone's items at the same pace they happened there */
function queue(x){const S=L;if(!S)return;const now=Date.now();if(S.off==null)S.off=now-x.t+150;let due=x.t+S.off;if(due<S.lastDue)due=S.lastDue;S.lastDue=due;S.q.push({due,x})}
setInterval(()=>{const S=L;if(!S||!S.q.length)return;const now=Date.now();while(S.q.length&&S.q[0].due<=now&&L===S){const {x}=S.q.shift();try{run(x)}catch(e){console.log('live run',e)}}},30);

function run(x){const S=L;
 if(x.k==='hello'){if(!S.host||!S.wait)return;const p=Object.assign({},x.p);['pos','base'].forEach(k=>{if(typeof p[k]==='number')p[k]=SH(p[k])});
  const d=P[1];const nm=d.name;for(const k in p){if(KEEP.includes(k))continue;d[k]=CA.includes(k)?(p[k]||[]).map(deC):p[k]}d.name=nm;d.first=1;d.via=d.via2=d.wf=null;
  try{window.setModel&&setModel(1,d.h)}catch(e){}try{window.__3&&__3.setTile&&__3.setTile(12)}catch(e){}
  S.wait=0;S.ready=1;S.seen=Date.now();if(!vis('intro'))busy=0;render();return}
 if(S.host&&S.wait)return;
 if(x.k==='s'||x.k==='pass'){const M=mir(x.d);S.last=M;S.ready=1;apply(M,true);if(M.over&&!over){finish(P[1].hp<=0?1:P[0].hp<=0?0:null,'');return}
  if(x.k==='pass'&&!over){S.off=null;S.lastDue=0;startMyTurn()}return}
 if(x.k==='e'){replay(x.e,x.a);if(S.last)apply(S.last,false);return}
 if(x.k==='ff'){finish(1,(S.themName||'Your friend')+' gave up — you win! 🏆');return}}

/* ---------- my turn ends → hand over; their turn ends → my turn starts ---------- */
let nextIn=null;
function startMyTurn(){if(!L)return;if(!L.host)round=Math.max(0,round-1);cur=1;busy=0;L.turnT=Date.now();nextIn();
 setTimeout(()=>{try{if(myTurn()&&P[0].pts>0&&P[0].sk.some(l=>l<3))ask()}catch(e){}},600)}
(function w(){if(typeof next!=='function'){setTimeout(w,200);return}nextIn=next;
 next=function(){if(!live())return nextIn.apply(this,arguments);if(over)return;
  if(cur!==0)return; // only my side's hand-over moves the turn on
  if(P[0].pts>0&&P[0].sk.some(l=>l<3)){ask();setTimeout(gt(next),400);return}
  FT=null;['fgt','upm'].forEach(k=>{const e=$$(k);if(e)e.style.display='none'});
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
 else if(e==='mf')call('__monFx',[o(a[0]),a[1],a[2]]);
 else if(e==='x2')call('__x2',[]);
 else if(e==='lv')call('lvl',[o(a[0])]);
 else if(e==='mo')call('mfight',[o(a[0])])}

/* ---------- send my state while it is my turn ---------- */
setInterval(()=>{if(!L||!L.started)return;
 if(myTurn()||(over&&!L.sentOver)){const s=snap(),js=JSON.stringify(s);if(js!==L.lastSent){L.lastSent=js;send({k:'s',d:s})}if(over)L.sentOver=1}
 flush()},150);
/* heartbeat + "your friend left" */
setInterval(()=>{if(!L||!L.started||L.done)return;mref().set({['h_'+L.me]:Date.now()},{merge:true}).catch(()=>{})},4000);
setInterval(()=>{if(!live()||over)return;if(Date.now()-L.seen>(L.ready?20000:60000))finish(1,(L.themName||'Your friend')+' left the match — you win! 🏆')},2000);

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
    edge:[{},{}],un:[],pend:{},gapT:0,seen:Date.now(),hb:null,wait:pend.host?1:0,lastSent:'',last:null};listen();
   if(!pend.host){cur=1;busy=1;const p=serP(P[0]);p.first=1;send({k:'hello',p});flush();render()}}
  return r}})();
setInterval(()=>{if(L&&L.host&&L.wait&&cur===0){busy=1}},100);
/* end of match: no rewards for friend battles, tell the friend if I give up */
(function w(){if(typeof fin!=='function'||typeof forfeit!=='function'){setTimeout(w,300);return}
 const _f=fin;fin=function(win){if(L){const r=$$('ovr');if(r)r.textContent='Friend battle · no rewards';try{if(!over)over=1}catch(e){}L.ended=1;setTimeout(stop,2500);return}return _f.apply(this,arguments)};
 const _ff=forfeit;forfeit=function(){if(live()&&!over){send({k:'ff'});flush()}return _ff.apply(this,arguments)}})();
setInterval(()=>{if(L&&L.done&&vis('menu'))L=null},1000);
}catch(e){console.warn('v4 live',e)}})();
