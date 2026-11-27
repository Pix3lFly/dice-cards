/* V4: online guilds (Firestore). Everyone sees the same guilds; one always-open AI guild ("Moonblades") that grows slowly;
   up to 2 AI players join real guilds over time and leave when the guild is nearly full; tap a guild to see it before joining.
   Offline (no account / claude.ai page) the V3 guilds keep working as before. */
(function w(){if(typeof menu!=='function'||typeof SV==='undefined'||!window.__guW||!window.__FRON){setTimeout(w,300);return}try{
const OLD=window.__guW,OF={};['guJoin','guCancelReq','guLeave','guLeaveGo','guMem','guRole','guKickAsk','guKick','guApp','guSave','guTab','guSort','guCreate','__guApps'].forEach(k=>OF[k]=window[k]);
const FR=window.__FRON,ON=()=>!!(FR.on&&FR.uid),UID=()=>FR.uid,db=()=>window.__ON.db,FV=()=>firebase.firestore.FieldValue;
const esc=t=>String(t==null?'':t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const MAXM=30,ROOM=27,BOT='ai_moonblades',HS=['k','v','s','f','i','h'];
const RL={L:'Leader',c:'Co-leader',m:'Member'},RO={L:0,c:1,m:2};
const rkOf=rp=>{let r=0;RK.forEach((x,i)=>{if(rp>=x[1])r=i});return r};
const por=h=>{const P=window.__POR||{};return P[h]?'<img alt="" src="'+P[h]+'">':'<span class="sp">'+((HD[h]||{}).e||'')+'</span>'};
const logo=(i,cls)=>window.__glgL?window.__glgL(i||0,cls):'';
const note=t=>{const n=document.createElement('div');n.className='m3note';n.textContent=t;document.body.appendChild(n);setTimeout(()=>n.remove(),2200)};
const ding=f=>{try{snd(f||660,.08,'triangle')}catch(e){}};
const pop=html=>{const M=document.getElementById('menu');let p=M.querySelector('.mpop');if(p)p.remove();p=document.createElement('div');p.className='mpop spop';p.innerHTML='<div class="uc">'+html+'</div>';p.onclick=e=>{if(e.target===p)p.remove()};M.appendChild(p);return p};
const close=()=>{const p=document.getElementById('menu').querySelector('.mpop');if(p)p.remove()};
const onG=()=>typeof tab!=='undefined'&&tab==='comm'&&typeof CMT!=='undefined'&&CMT==='gu';
const redraw=()=>{try{if(onG()&&!document.querySelector('#menu .mpop')&&document.getElementById('menu').style.display!=='none')menu()}catch(e){}};
const myLv=()=>1+Math.floor((SV.played||0)/3);
const meEntry=role=>({n:(FR.prof&&FR.prof.name)||SV.pname||'Player',h:(HD[SV.pav||SV.mine]||/^[kvsfih][12]$/.test(SV.pav||''))?(SV.pav||SV.mine):'k',rp:SV.rp||0,lv:myLv(),w:SV.wins||0,gp:SV.gp||0,role:role||'m',s:Date.now()});
const lvlOf=gp=>Math.min(8,1+Math.floor(gp/500));
const MXG=(id,g)=>MAXM+(g&&lvlOf(total(id,g))>=7?10:0);
const reqTxt=g=>{const a=[];if(g.mw)a.push(g.mw+'+ wins');if(g.mr)a.push(RK[g.mr][0]+' rank+');return (g.type==='open'?'Open':g.type==='req'?'Request to join':'Invite only')+(a.length?' · '+a.join(' · '):' · no requirements')};
const meets=g=>(SV.wins||0)>=(g.mw||0)&&rkOf(SV.rp||0)>=(g.mr||0);

/* ---------- AI players (look like real accounts) ---------- */
const A1=['Brave','Swift','Lucky','Grim','Bold','Sly','Mighty','Wild','Frost','Ember','Shadow','Iron','Golden','Rusty','Sneaky','Jolly','Stormy','Mossy','Fiery','Silent'];
const A2=['Goblin','Knight','Wizard','Ogre','Dragon','Rogue','Hunter','Bat','Mage','Raven','Wolf','Pirate','Dicer','Golem','Troll','Witch','Archer','Imp','Viking','Ranger'];
const hs=s=>{let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)>>>0}return h};
const R=(s,a,b)=>a+hs(s)%(b-a+1);
const aiName=s=>{const n=A1[hs(s+'a')%20]+A2[hs(s+'b')%20]+R(s+'c',10,999);return n.length<=16?n:n.slice(0,16)};
const aiMake=(s,mw,mr,w0)=>{const w=w0!=null?w0:Math.max(mw||0,R(s+'w',4,140)),rp=Math.max(RK[mr||0][1],Math.min(1500,Math.floor(w*(4+hs(s+'r')%9)))) ;return {n:aiName(s),h:HS[hs(s+'h')%6],rp,lv:Math.max(1,Math.floor(w*1.5/3)+R(s+'l',1,4)),w,gp:0,role:'m',j:Date.now(),ai:1}};
// an AI player's wins / guild points keep growing slowly while it is in a guild
const aiNow=(id,m)=>{if(!m.j)return m;const d=Math.max(0,(Date.now()-(m.j||Date.now()))/864e5),r=.4+(hs(id+'p')%100)/100*1.2,x=Math.floor(d*r),y=Math.floor(d*(.05+(hs(id+'q')%100)/100*.2));return Object.assign({},m,{w:(m.w||0)+x,gp:(m.gp||0)+y*10,lv:(m.lv||1)+Math.floor(x/3)})};

/* the always-open AI guild: members are made up from the clock, so everyone sees the same ones without extra writes */
const D0=Date.UTC(2026,10,25),day=()=>(Date.now()-D0)/864e5;
const botAI=realN=>{const want=Math.min(16+Math.floor(Math.max(0,day())/2.5),ROOM),n=Math.max(0,Math.min(want,ROOM-realN)),out=[];
 for(let i=0;i<24&&out.length<n;i++){const id='ai_mb'+i,jd=i<16?-40+i*2:(i-16)*2.5;const b=aiMake(id,0,0,R(id+'w0',2,60));b.j=D0+jd*864e5;b.gp=R(id+'g0',1,9)*10;b.role=i===0?'L':i<3?'c':'m';out.push([id,aiNow(id,b)])}
 return out};
const BOTDOC={n:'Moonblades',nl:'moonblades',lg:7,msg:'Welcome travellers! Play daily and have fun. Everyone is welcome here.',type:'open',mw:0,mr:0,lead:'',bot:true,mem:{},apps:{},ai:{},aiT:0,t:D0};

/* ---------- data ---------- */
let LIST=null,LT=0,LBusy=false,G=null,GID=null,GU_=null,PW=null,PWID=null,PU=null,GT='ov',SORT='role',lastMe=0,AIT=0;
const gref=id=>db().collection('guilds').doc(id);
async function loadList(force){if(LBusy||(!force&&LIST&&Date.now()-LT<10e3))return;LBusy=true;
 try{const q=await db().collection('guilds').get();const L=[];q.forEach(d=>L.push(Object.assign({id:d.id},d.data())));
  if(!L.some(g=>g.id===BOT)){try{await gref(BOT).set(BOTDOC);L.push(Object.assign({id:BOT},BOTDOC))}catch(e){console.log('bot guild',e&&e.code)}}
  LIST=L;LT=Date.now()}catch(e){console.log('guild list',e&&e.code);LIST=LIST||[]}finally{LBusy=false}redraw()}
const realN=g=>Object.keys(g.mem||{}).length;
const members=(id,g)=>{const L=[];Object.entries(g.mem||{}).forEach(([k,m])=>L.push(Object.assign({id:k,you:k===UID()},m)));
 if(id===BOT||g.bot)botAI(realN(g)).forEach(([k,m])=>L.push(Object.assign({id:k},m)));
 else Object.entries(g.ai||{}).forEach(([k,m])=>L.push(Object.assign({id:k},aiNow(k,m))));
 L.forEach(m=>{if(m.you)Object.assign(m,meEntry(m.role))});return L};
const total=(id,g)=>members(id,g).reduce((a,m)=>a+(+m.gp||0),0);
const count=(id,g)=>members(id,g).length;
const myRole=()=>G&&G.mem&&G.mem[UID()]?G.mem[UID()].role:'m';
window.__glv=()=>ON()&&G&&SV.guild?lvlOf(total(GID,G)):0;

/* watch my guild (and a pending request) */
function watch(){const id=(ON()&&SV.gid)||null;if((GU_?GU_.id:null)===id)return;if(GU_&&GU_.u)GU_.u();
 G=null;GID=id;GU_=null;if(!id||!ON())return;let seen=false;
 const u=gref(id).onSnapshot(s=>{if(SV.gid!==id)return;
  if(!s.exists){if(seen||Date.now()-(SV.gjt||0)>3000){const n=SV.guild;SV.guild=null;SV.gid=null;G=null;sv();if(n)note(n+' was disbanded');redraw()}return}
  const d=s.data();if(!d.mem||!d.mem[UID()]){const wt=3000-(Date.now()-(SV.gjt||0));if(wt>0){setTimeout(()=>{if(GU_&&GU_.id===id){GU_.u();GU_=null;watch()}},wt+200);return}const n=d.n;SV.guild=null;SV.gid=null;G=null;sv();note('You are no longer in '+n);redraw();return}
  seen=true;G=d;if(SV.guild!==d.n){SV.guild=d.n;sv()}
  upMe();aiTick();redraw()},e=>console.log('guild watch',e&&e.code));
 GU_={id,u}}
function watchPend(){const p=SV.gpend2;if(!p||!ON()){if(PU){PU.u();PU=null}return}if(PU&&PU.id===p.gid)return;if(PU)PU.u();
 const u=gref(p.gid).onSnapshot(s=>{const q=SV.gpend2;if(!q||q.gid!==p.gid)return;const d=s.exists?s.data():null;
  if(d&&d.mem&&d.mem[UID()]){SV.gpend2=null;SV.guild=d.n;SV.gid=p.gid;SV.gjt=Date.now();SV.gp=0;GT='ov';sv();note('Your request was accepted! Welcome to '+d.n);ding(784);watch();redraw();return}
  if(d&&d.type==='open'&&d.apps&&d.apps[UID()]&&!q.go){q.go=1;gref(p.gid).update({['apps.'+UID()]:FV().delete(),['mem.'+UID()]:meEntry('m')}).catch(e=>{q.go=0;console.log('auto join',e&&e.code)});return}
  if(!d||!d.apps||!d.apps[UID()]){if(Date.now()-q.t<8000)return;SV.gpend2=null;sv();note(d?d.n+' declined your request':'That guild no longer exists');redraw()}},e=>console.log('pend watch',e&&e.code));
 PU={id:p.gid,u}}
// keep my own member line fresh (name, hero, rank, wins, guild points, last seen)
function upMe(force){if(!G||!GID||!ON())return;const cur=G.mem[UID()];if(!cur)return;const m=meEntry(cur.role);
 const same=['n','h','rp','lv','w','gp'].every(k=>cur[k]===m[k]);if(!force&&same&&Date.now()-(cur.s||0)<4*60e3)return;if(Date.now()-lastMe<20e3&&!force)return;lastMe=Date.now();
 gref(GID).update({['mem.'+UID()]:m}).catch(e=>console.log('guild me',e&&e.code))}
window.addEventListener('dc-saved',()=>upMe());
setInterval(()=>{if(document.visibilityState==='visible')upMe()},5*60e3);

/* AI players in real guilds: at most 2; join slowly (open guilds) or ask to join (request guilds, checked by leaders);
   one leaves when the guild is nearly full */
function aiTick(){if(!G||!GID||G.bot||GID===BOT||Date.now()-AIT<60e3)return;AIT=Date.now();
 const now=Date.now(),last=G.aiT||G.t||now,hrs=(now-last)/36e5;if(hrs<6)return;
 const ai=Object.keys(G.ai||{}),n=realN(G)+ai.length,up={aiT:now};
 if(n>=ROOM&&ai.length)up['ai.'+ai[hs(now+'x')%ai.length]]=FV().delete();
 else if(ai.length<2&&n<ROOM-1&&G.type!=='inv'&&Math.random()<Math.min(.6,hrs/48)){const id='ai_'+Math.floor(Math.random()*1e9).toString(36),p=aiMake(id,G.mw,G.mr);
  if(G.type==='open')up['ai.'+id]=p;else if(myRole()!=='m'&&Object.keys(G.apps||{}).length<6)up['apps.'+id]=p;}
 gref(GID).update(up).catch(e=>console.log('guild ai',e&&e.code))}

/* move an old offline guild to the online one */
let mig=false;
async function migrate(){if(mig||!ON())return;mig=true;try{
 if(SV.gpend){SV.gpend=null;sv()}
 if(SV.guild&&!SV.gid){const n=SV.guild,own=SV.myGuild&&SV.myGuild.n===n;
  if(n==='Moonblades'){await joinGo(BOT,1)}
  else if(own){const ok=await createGo(n,SV.myGuild.lg||0,SV.myGuild,1);if(!ok){SV.guild=null;sv()}}
  else{SV.guild=null;sv()}
  SV.myGuild=null;sv()}
 watch();watchPend()}finally{mig=false}}
setInterval(()=>{if(ON()){if(SV.guild&&!SV.gid)migrate();else{watch();watchPend()}}},3000);
window.addEventListener('dc-auth',()=>{if(GU_&&GU_.u)GU_.u();GU_=null;G=null;GID=null;if(PU){PU.u();PU=null}LIST=null});

/* ---------- actions ---------- */
async function joinGo(id,silent){const g=(LIST||[]).find(x=>x.id===id)||(await gref(id).get().then(s=>s.exists?s.data():null));if(!g){note('That guild no longer exists');return false}
 if(count(id,g)>=MXG(id,g)){note(g.n+' is full');return false}
 try{await gref(id).update({['mem.'+UID()]:meEntry('m')});SV.guild=g.n;SV.gid=id;SV.gjt=Date.now();SV.gp=0;SV.gpend2=null;GT='ov';sv();watch();if(!silent){note('Welcome to '+g.n+'!');ding(784)}LT=0;return true}
 catch(e){console.log('join',e&&e.code);note('Could not join — try again');return false}}
async function createGo(n,lg,old,silent){const nl=n.toLowerCase(),id='g'+Date.now().toString(36)+Math.floor(Math.random()*1e6).toString(36);
 const d={n,nl,lg:lg||0,msg:(old&&old.msg)||('Welcome to '+n+'!'),type:(old&&old.req&&old.req.type)||'req',mw:(old&&old.req&&old.req.mw)||0,mr:(old&&old.req&&old.req.mr)||0,lead:UID(),bot:false,mem:{[UID()]:meEntry('L')},apps:{},ai:{},aiT:Date.now(),t:Date.now()};
 const b=db().batch();b.set(db().collection('gnames').doc(nl),{gid:id,lead:UID()});b.set(gref(id),d);
 try{await b.commit();SV.guild=n;SV.gid=id;SV.gjt=Date.now();SV.gp=0;GT='ov';sv();watch();LT=0;return true}catch(e){console.log('create guild',e&&e.code);return false}}

window.guJoin=async function(id){if(!ON())return OF.guJoin.apply(this,arguments);if(SV.guild||SV.gpend2)return;close();
 let g=null;try{const s=await gref(id).get();g=s.exists?Object.assign({id},s.data()):null}catch(e){g=(LIST||[]).find(x=>x.id===id)}
 if(LIST){LIST=LIST.filter(x=>x.id!==id);if(g)LIST.push(g)}
 if(!g){note('That guild no longer exists');menu();return}
 if(g.type==='inv'){note(g.n+' is invite only now');menu();return}if(!meets(g)){note('You don’t meet '+g.n+'’s requirements');menu();return}
 if(g.type==='open'||g.bot){joinGo(id).then(()=>menu());return}
 gref(id).update({['apps.'+UID()]:Object.assign(meEntry('m'),{t:Date.now()})}).then(()=>{SV.gpend2={gid:id,n:g.n,t:Date.now()};sv();watchPend();menu();note('Join request sent to '+g.n);ding()}).catch(e=>{console.log('req',e&&e.code);note('Could not send the request')})};
window.guCancelReq=function(){if(!ON())return OF.guCancelReq.apply(this,arguments);const p=SV.gpend2;SV.gpend2=null;sv();if(PU){PU.u();PU=null}if(p)gref(p.gid).update({['apps.'+UID()]:FV().delete()}).catch(()=>{});menu()};
window.guLeave=function(){if(!ON()||!SV.gid)return OF.guLeave.apply(this,arguments);const L=myRole()==='L';
 pop(L?'<b class="st">Disband guild?</b><p>You are the leader of <b>'+esc(SV.guild)+'</b>. Leaving will disband the guild for everyone.</p><div class="us2"><button class="opr rm" onclick="guLeaveGo()">Yes, disband</button><button class="opr" onclick="soClose()">No</button></div>'
  :'<b class="st">Leave guild?</b><p>Are you sure you want to leave <b>'+esc(SV.guild)+'</b>?</p><div class="us2"><button class="opr rm" onclick="guLeaveGo()">Yes, leave</button><button class="opr" onclick="soClose()">No</button></div>')};
window.guLeaveGo=async function(){if(!ON()||!SV.gid)return OF.guLeaveGo.apply(this,arguments);const id=SV.gid,L=myRole()==='L',nl=G&&G.nl;close();
 try{if(L){const b=db().batch();b.delete(gref(id));if(nl)b.delete(db().collection('gnames').doc(nl));await b.commit()}else await gref(id).update({['mem.'+UID()]:FV().delete()})}catch(e){console.log('leave',e&&e.code);note('Could not leave — try again');return}
 if(GU_&&GU_.u)GU_.u();GU_=null;G=null;GID=null;SV.guild=null;SV.gid=null;SV.myGuild=null;GT='ov';sv();LT=0;menu()};
window.guTab=k=>{GT=k;menu()};window.guSort=k=>{SORT=k;menu()};
const mBy=id=>G&&members(GID,G).find(x=>x.id===id);
window.guMem2=function(id,gid){const g=gid?(PW||{}):G,M=gid?members(gid,g):members(GID,G),m=M.find(x=>x.id===id);if(!m)return;
 /* another guild's member (not my guild): the full player profile, with Add friend / Report / Block */
 if(gid&&gid!==GID&&window.__pfShow&&!m.you){const real=!!(g.mem&&g.mem[m.id]);
  if(real&&window.__pfUid){__pfUid(m.id,m.n,m.h);return}
  __pfShow({id:m.id,n:m.n,h:m.h,rp:m.rp,lv:m.lv,w:m.w,g:g.n||'No guild'});return}const lead=!gid&&myRole()==='L'&&!m.you&&!(GID===BOT);
 const acts=lead?'<div class="us2">'+(m.role==='c'?`<button class="opr" onclick="guRole('${id}','m')">Remove co-leader</button>`:`<button class="opr" onclick="guRole('${id}','c')">Make co-leader</button>`)+`<button class="opr rm" onclick="guKickAsk('${id}')">Remove from guild</button></div>`:'';
 pop(`<div class="gpf"><div class="fp">${por(m.h)}</div><div><b class="st">${esc(m.n)}${m.you?' (you)':''}</b><i class="rl r${m.role}">${RL[m.role]}</i></div></div><div class="gst"><div><small>Rank</small><b>${RK[rkOf(m.rp)][0]}</b><small>${m.rp} RP</small></div><div><small>Level</small><b>${m.lv}</b></div><div><small>Wins</small><b>${m.w}</b></div><div><small>Guild pts</small><b>${m.gp}</b></div><div><small>Hero</small><b>${esc((HD[m.h]||{}).n||'')}</b></div></div><p class="gsn">${lastOn(m)}</p>${acts}<div class="us2"><button class="opr rm" onclick="${gid?'guView(\''+gid+'\')':'soClose()'}">${gid?'Back':'Close'}</button></div>`)};
window.guMem=function(id){if(!ON()||!SV.gid)return OF.guMem.apply(this,arguments);return guMem2(id)};
window.guRole=function(id,r){if(!ON()||!SV.gid)return OF.guRole.apply(this,arguments);const m=mBy(id);if(!m)return;const k=(G.ai||{})[id]?'ai.':'mem.';
 gref(GID).update({[k+id+'.role']:r}).then(()=>{close();note(m.n+(r==='c'?' is now a co-leader':' is now a member'));ding()}).catch(e=>console.log('role',e&&e.code))};
window.guKickAsk=function(id){if(!ON()||!SV.gid)return OF.guKickAsk.apply(this,arguments);const m=mBy(id);if(!m)return;pop('<b class="st">Remove member?</b><p>Remove <b>'+esc(m.n)+'</b> from your guild?</p><div class="us2"><button class="opr rm" onclick="guKick(\''+id+'\')">Yes, remove</button><button class="opr" onclick="soClose()">No</button></div>')};
window.guKick=function(id){if(!ON()||!SV.gid)return OF.guKick.apply(this,arguments);const k=(G.ai||{})[id]?'ai.':'mem.';gref(GID).update({[k+id]:FV().delete()}).then(()=>{close()}).catch(e=>console.log('kick',e&&e.code))};
window.guApp=function(id,ok){if(!ON()||!SV.gid)return OF.guApp.apply(this,arguments);const p=(G.apps||{})[id];if(!p)return;const up={['apps.'+id]:FV().delete()};
 if(ok){if(count(GID,G)>=MXG(GID,G)){note('Your guild is full');return}const e=Object.assign({},p,{role:'m',j:Date.now()});delete e.t;if(/^ai_/.test(id)){e.gp=0;up['ai.'+id]=e}else{e.gp=0;up['mem.'+id]=e}}
 gref(GID).update(up).then(()=>{if(ok)note(p.n+' joined your guild');ding(ok?784:300)}).catch(e=>console.log('app',e&&e.code))};
window.guSave=function(){if(!ON()||!SV.gid)return OF.guSave.apply(this,arguments);const v=id=>(document.getElementById(id)||{}).value;
 const up={msg:(v('gmsg')||'').trim().slice(0,120),type:v('gtyp')||'req',mw:+v('gmw')||0,mr:+v('gmr')||0};if(window.__glgSel!=null)up.lg=window.__glgSel;
 gref(GID).update(up).then(()=>{note('Guild settings saved');ding()}).catch(e=>{console.log('gsave',e&&e.code);note('Could not save')})};
window.guCreate=async function(){if(!ON())return OF.guCreate.apply(this,arguments);const i=document.getElementById('gun'),m=document.getElementById('gum'),n=(i&&i.value||'').trim().replace(/\s+/g,' ');
 if(SV.gems<200||SV.gold<500||(SV.wins||0)<10)return;
 if(!/^[A-Za-z0-9 ]{3,18}$/.test(n)){m.textContent='Use 3–18 letters, numbers or spaces.';return}
 if(n.toLowerCase()==='moonblades'||(LIST||[]).some(g=>g.nl===n.toLowerCase())){m.textContent='That guild name is taken.';return}
 m.textContent='Creating…';const ok=await createGo(n,window.__glgSel||0);if(!ok){m.textContent='That guild name is taken.';return}
 SV.gems-=200;SV.gold-=500;sv();close();menu();ding(784)};
window.__guApps=()=>{if(!ON())return OF.__guApps?OF.__guApps():[];return G&&myRole()!=='m'?Object.keys(G.apps||{}):[]};

/* ---------- preview a guild before joining ---------- */
window.guView=function(id){const g=(LIST||[]).find(x=>x.id===id);if(!g)return;PW=g;PWID=id;const M=members(id,g).sort((a,b)=>RO[a.role]-RO[b.role]||b.gp-a.gp),n=M.length,tp=total(id,g),L=lvlOf(tp);
 const pend=SV.gpend2&&SV.gpend2.gid===id,ok=meets(g),full=n>=MXG(id,g),open=g.type==='open'||g.bot;
 const btn=SV.guild?'':pend?'<button class="opr rm" onclick="guCancelReq();soClose()">Cancel request</button>':full?'<button class="opr" disabled>Full</button>':g.type==='inv'?'<button class="opr" disabled>Invite only</button>':!ok?'<button class="opr" disabled>Locked</button>':SV.gpend2?'<button class="opr" disabled>'+(open?'Join':'Request')+'</button>':'<button class="opr" onclick="guJoin(\''+id+'\')">'+(open?'Join':'Request to join')+'</button>';
 pop('<div class="gvh">'+logo(g.lg,'big')+'<div><b class="st">'+esc(g.n)+'</b><small>Guild level '+L+' · '+n+' / '+MXG(id,g)+' members</small></div></div>'+
  '<div class="gmb gvm"><b>📜 Guild message</b><span>'+(g.msg?esc(g.msg):'<i>No message yet.</i>')+'</span><small class="'+(ok?'':'no')+'">'+reqTxt(g)+'</small></div>'+
  '<div class="gvl">'+M.map(m=>`<div class="gvr r${m.role}" onclick="guMem2('${m.id}','${id}')"><div class="fp">${por(m.h)}</div><b>${esc(m.n)}</b><i class="rl r${m.role}">${RL[m.role]}</i><em>${m.gp}</em></div>`).join('')+'</div>'+
  '<div class="us2"><button class="opr rm" onclick="soClose()">Close</button>'+btn+'</div>')};

/* ---------- pages ---------- */
let PC='';
const pills=()=>'<div class="gpl">'+[['ov','Overview'],['mem','Members'],...(myRole()!=='m'?[['man','Manage'+(Object.keys(G.apps||{}).length?' ('+Object.keys(G.apps).length+')':'')]]:[])].map(([k,l])=>`<button class="${GT===k?'on':''}" onclick="guTab('${k}')">${l}${k==='man'&&Object.keys(G.apps||{}).length?'<i class="v4d"></i>':''}</button>`).join('')+'</div>';
const head=t=>'<div class="spn2">'+PC+'<div class="shd"><div class="spl">'+esc(t)+'</div></div>';
const lastOn=m=>window.__lastOn?(m.ai||/^ai_/.test(m.id)?window.__lastOn(m.id):window.__lastOn(m.id,m.you,m.s||0)):'';
function listUI(){loadList();const L=(LIST||[]).slice().sort((a,b)=>(b.id===BOT)-(a.id===BOT)||count(b.id,b)-count(a.id,a));
 const rows=LIST?L.map(g=>{const n=count(g.id,g),ok=meets(g),pend=SV.gpend2&&SV.gpend2.gid===g.id,open=g.type==='open'||g.bot,full=n>=MXG(g.id,g);
  const btn=pend?'<button class="opr jn rm" onclick="event.stopPropagation();guCancelReq()">Cancel</button>':full?'<button class="opr jn" disabled>Full</button>':g.type==='inv'?'<button class="opr jn" disabled>Invite</button>':!ok?'<button class="opr jn" disabled>Locked</button>':SV.gpend2?'<button class="opr jn" disabled>'+(open?'Join':'Request')+'</button>':'<button class="opr jn" onclick="event.stopPropagation();guJoin(\''+g.id+'\')">'+(open?'Join':'Request')+'</button>';
  return `<div class="fr3 tall gvw" onclick="guView('${g.id}')">${logo(g.lg)}<div class="ff"><b>${esc(g.n)}</b><span>${n} / ${MXG(g.id,g)} members · level ${lvlOf(total(g.id,g))}${pend?' · request sent':''}</span><span class="grq ${ok?'':'no'}">${reqTxt(g)}</span></div>${btn}</div>`}).join(''):'<div class="dnt">Loading guilds…</div>';
 return '<div class="spn2">'+PC+'<div class="shd"><div class="spl">Guilds</div></div><div class="flst top">'+rows+'</div><div class="dnt">Tap a guild to see its members before you join.</div></div>'}
function ovUI(){const M=members(GID,G),tp=total(GID,G),L=lvlOf(tp),pr=L>=8?100:Math.min(100,(tp-(L-1)*500)/5);
 const msg='<div class="gmb"><b>📜 Guild message</b><span>'+(G.msg?esc(G.msg):'<i>No message yet.</i>')+'</span><small>'+reqTxt(G)+' · you are '+RL[myRole()]+'</small></div>';
 const pk=(typeof GPK!=='undefined'?GPK:[]).map(([lv,t,a])=>`<div class="fr3 pk ${L>=lv?'':'lk'}"><span class="pkl">${L>=lv?'✓':'🔒'}</span><div class="ff"><b>${t}</b><span>Unlocks at level ${lv}${a?'':' · coming soon'}</span></div></div>`).join('');
 return head(G.n)+pills()+'<div class="ghd">'+logo(G.lg,'big')+'<div class="ff"><div class="glr"><b>Guild level '+L+'</b><em class="gmc">'+M.length+' / '+MXG(GID,G)+' members</em></div><div class="gbar"><i style="width:'+pr+'%"></i></div><span>'+tp+' guild points · +10 per win'+(L>=8?'':' · next level at '+(L*500))+'</span></div></div>'+msg+'<div class="flst top">'+pk+'</div><button class="bt sm lv" onclick="guLeave()">Leave guild</button></div>'}
function memUI(){const L=members(GID,G),isOn=m=>m.you||(m.ai||/^ai_/.test(m.id)?(window.__isOn&&window.__isOn(m.id)):Date.now()-(m.s||0)<6*60e3)?1:0;
 const F={rank:(a,b)=>b.rp-a.rp,lv:(a,b)=>b.lv-a.lv,w:(a,b)=>b.w-a.w,gp:(a,b)=>b.gp-a.gp};
 L.sort((a,b)=>SORT==='role'?(RO[a.role]-RO[b.role])||(isOn(b)-isOn(a))||(b.rp-a.rp):(isOn(b)-isOn(a))||F[SORT](a,b));
 const so=[['role','Role'],['rank','Rank'],['lv','Level'],['w','Wins'],['gp','Guild pts']];
 return head(G.n)+pills()+'<div class="gso"><span>Sort:</span>'+so.map(([k,l])=>`<button class="${SORT===k?'on':''}" onclick="guSort('${k}')">${l}</button>`).join('')+'</div><div class="flst top gml">'+
  L.map((m,i)=>`<div class="fr3 gm g${m.role} ${m.you?'you':''}" onclick="guMem2('${m.id}')"><em class="gn">${i+1}</em><div class="fp" style="position:relative">${por(m.h)}<i class="ond ${isOn(m)?'on':'off'}"></i></div><div class="ff"><b>${esc(m.n)}${m.you?' <small>(you)</small>':''}</b> <i class="rl r${m.role}">${RL[m.role]}</i><span>${RK[rkOf(m.rp)][0]} · Lv ${m.lv} · ${m.w} wins</span><span class="lso">${lastOn(m)}</span></div><div class="gpv"><b>${m.gp}</b><small>guild pts</small></div></div>`).join('')+
  '</div><div class="dnt">'+L.length+' / '+MXG(GID,G)+' members · tap a member to see their profile</div></div>'}
function manUI(){const A=Object.entries(G.apps||{}),co=Object.entries(Object.assign({},G.mem,G.ai)).filter(([k,m])=>m.role==='c');
 const apps=A.length?A.map(([id,p])=>`<div class="fr3 rq"><div class="fp">${por(p.h)}</div><div class="ff"><b>${esc(p.n)}</b><span>${RK[rkOf(p.rp)][0]} · Lv ${p.lv} · ${p.w} wins</span></div><button class="opr jn" onclick="guApp('${id}',1)">Accept</button><button class="opr rm" onclick="guApp('${id}',0)">Deny</button></div>`).join(''):'<div class="dnt">No join requests right now.</div>';
 const sel=(id,opts,v)=>'<select id="'+id+'" class="gin">'+opts.map(([k,l])=>`<option value="${k}" ${String(k)===String(v)?'selected':''}>${l}</option>`).join('')+'</select>';
 const lead=myRole()==='L';
 return head(G.n)+pills()+'<div class="flst top gman"><div class="frh">Join requests'+(A.length?' · '+A.length:'')+'</div>'+apps+
  (lead?'<div class="frh">Guild logo</div><div class="gbx glbx">'+(window.__glgPick?window.__glgPick(G.lg||0):'')+'</div>'+
  '<div class="frh">Guild message</div><div class="gbx"><textarea id="gmsg" class="gin" maxlength="120" rows="2" placeholder="Write a message for your members">'+esc(G.msg||'')+'</textarea></div>'+
  '<div class="frh">Joining rules</div><div class="gbx"><label><span>Who can join</span>'+sel('gtyp',[['open','Open: anyone'],['req','Request to join'],['inv','Invite only']],G.type)+'</label>'+
  '<label><span>Minimum wins</span>'+sel('gmw',[0,5,10,25,50,100].map(x=>[x,x?x+'+ wins':'None']),G.mw)+'</label>'+
  '<label><span>Minimum rank</span>'+sel('gmr',RK.map((r,i)=>[i,i?r[0]+'+':'None']),G.mr)+'</label>'+
  '<button class="opr all" onclick="guSave()">Save changes</button></div>'+
  '<div class="frh">Co-leaders</div><div class="gbx"><p class="gsn">Co-leaders can accept or deny join requests. Make someone co-leader by tapping them in the <b>Members</b> list.</p>'+(co.length?co.map(([id,m])=>`<div class="gco">${esc(m.n)}<button class="opr rm" onclick="guRole('${id}','m')">Remove</button></div>`).join(''):'<div class="dnt">No co-leaders yet.</div>')+'</div>':'')+
  '</div></div>'}
window.__guW=function(_g,pc,u){if(!ON())return OLD.apply(this,arguments);PC=pc;
 if(SV.guild&&!SV.gid){migrate();return '<div class="spn2">'+pc+'<div class="shd"><div class="spl">Guilds</div></div><div class="dnt">Moving your guild online…</div></div>'}
 if(!SV.guild)return listUI();watch();
 if(!G)return head(SV.guild)+'<div class="dnt">Loading guild…</div></div>';
 if(GT==='man'&&myRole()==='m')GT='ov';
 return GT==='mem'?memUI():GT==='man'?manUI():ovUI()};

const css=document.createElement('style');css.textContent=`
.s3 .fr3.gvw{cursor:pointer}
#menu .gvh{display:flex;align-items:center;gap:10px;justify-content:center;margin-bottom:6px}
#menu .gvh .glg{width:52px}#menu .gvh .glg i{font-size:22px}
#menu .gvh .st{margin:0!important;padding-bottom:2px!important}#menu .gvh small{display:block;font:700 12px system-ui;color:#e8d6b4}
#menu .gvm{display:flex;flex-direction:column;gap:2px;margin:0 0 8px;padding:6px 9px;border-radius:9px;background:#f6e3b8;border:2px solid #8a5a1e;color:#4a2a08;font-size:13px;text-align:left}
#menu .gvm b{font:400 14px 'Lilita One',system-ui,sans-serif;color:#7a3e08}#menu .gvm small{font-size:11px;color:#2f7a1f;font-weight:700}#menu .gvm small.no{color:#a8321e}
#menu .gvl{display:flex;flex-direction:column;gap:4px;max-height:min(40svh,300px);overflow:auto;margin:0 0 8px;padding-right:2px}
#menu .gvr{display:flex;align-items:center;gap:7px;padding:4px 8px;border-radius:9px;background:linear-gradient(#4a9cf0,#2a6ccc);border:1.5px solid #17407e;cursor:pointer;text-align:left}
#menu .gvr.rL{background:linear-gradient(#ffe27a,#e9a72a);border-color:#7a4a08}#menu .gvr.rc{background:linear-gradient(#f6e6bd,#d2b277);border-color:#8a6a35}
#menu .gvr .fp{width:28px;height:28px;flex:none}#menu .gvr .fp img,#menu .gvr .fp .sp{width:100%;height:100%;border-radius:50%;display:block}
#menu .gvr b{flex:1;min-width:0;font:700 13px system-ui;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#menu .gvr.rL b,#menu .gvr.rc b{color:#3a2006}
#menu .gvr em{font:400 13px 'Lilita One',system-ui;color:#ffe08a;font-style:normal;min-width:30px;text-align:right}#menu .gvr.rL em,#menu .gvr.rc em{color:#5a2c04}
.s3 .gpl button{position:relative}.s3 .gpl button .v4d{position:absolute;right:6px;top:-3px}
`;document.head.appendChild(css);
}catch(e){console.log('v4 guild',e)}})();
