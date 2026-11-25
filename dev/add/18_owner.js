/* V4: owner + moderator panel, bans, warnings, redeem codes, rankings, cheat alerts, guild editing, staff chat.
   Owners = the two UIDs below (the Firestore rules check the same UIDs, so nobody else can do owner things even by editing the page).
   Moderators = players with a mods/{uid} document (owners add / remove them). Every staff action goes to modlog. */
(function w(){if(typeof menu!=='function'||typeof SV==='undefined'||!window.__FRON||!window.__ON){setTimeout(w,300);return}try{
const OWN={'OXfHFDesUtZ3tgB6vFJJzYyFTlH2':'00000001','7q77Kz5M8Ad4hhlTvFbTOVvbVT43':'00000002'};
const CODE='1337';
const FR=window.__FRON,ON=()=>!!(FR.on&&FR.uid),UID=()=>FR.uid,db=()=>window.__ON.db,FV=()=>firebase.firestore.FieldValue;
const isOwner=u=>!!OWN[u||UID()];let MOD=false;const staff=()=>ON()&&(isOwner()||MOD);
window.__isOwnerUid=u=>!!OWN[u];
const esc=t=>String(t==null?'':t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const note=t=>{const n=document.createElement('div');n.className='m3note';n.textContent=t;document.body.appendChild(n);setTimeout(()=>n.remove(),2400)};
const ding=f=>{try{snd(f||660,.08,'triangle')}catch(e){}};
const ms=v=>v&&v.toMillis?v.toMillis():(+v||0);
const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const when=t=>{if(!t)return '—';const d=new Date(t);return d.getDate()+' '+MON[d.getMonth()]+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')};
const left=t=>{const m=Math.max(0,Math.round((t-Date.now())/6e4));return m>=2880?Math.round(m/1440)+' days':m>=120?Math.round(m/60)+' hours':m+' min'};
const myName=()=>(FR.prof&&FR.prof.name)||SV.pname||'Player';
const rid=()=>Date.now().toString(36)+Math.floor(Math.random()*1e8).toString(36);

/* ---------- upgrades count + play time (for rankings and cheat alerts) ---------- */
window.__upN=()=>{let n=0;try{Object.values(SV.gear||{}).forEach(a=>(a||[]).forEach(x=>n+=+x||0));Object.values(SV.blv||{}).forEach(x=>n+=Math.max(0,(+x||1)-1))}catch(e){}return n};
setInterval(()=>{if(document.visibilityState==='visible'){SV.pt=(SV.pt||0)+1}},60e3);

/* ---------- owner player number ---------- */
let numBusy=false;
async function ownerNum(){const u=UID(),want=OWN[u];if(!want||numBusy||!FR.prof||FR.prof.num===want)return;numBusy=true;
 try{const D=db(),r=D.collection('nums').doc(want),s=await r.get();const b=D.batch();if(!s.exists)b.set(r,{uid:u});b.set(D.collection('profiles').doc(u),{num:want},{merge:true});await b.commit();FR.prof.num=want}
 catch(e){console.log('owner num',e&&e.code)}finally{numBusy=false}}

/* ---------- moderator status ---------- */
let mU=null,mUid=null;function checkMod(){const u=ON()?UID():null;if(u===mUid)return;if(mU)mU();mU=null;mUid=u;MOD=false;if(!u)return;
 mU=db().collection('mods').doc(u).onSnapshot(s=>{const was=MOD;MOD=s.exists;if(was!==MOD){redraw();if(!MOD)__opClose()}},e=>console.log('mod watch',e&&e.code))}
const redraw=()=>{try{if(tab==='comm'&&CMT==='st'&&!document.querySelector('#menu .mpop'))menu()}catch(e){}};

/* ---------- bans: banned players see a full-screen notice ---------- */
let banU=null,banUid=null,BAN=null;
function watchBan(){const u=ON()?UID():null;if(u===banUid)return;if(banU)banU();banU=null;banUid=u;BAN=null;showBan();if(!u||isOwner(u))return;
 banU=db().collection('bans').doc(u).onSnapshot(s=>{BAN=s.exists?s.data():null;showBan()},e=>console.log('ban watch',e&&e.code))}
function showBan(){let o=document.getElementById('v4ban');const on=BAN&&(!BAN.until||BAN.until>Date.now());
 if(!on){if(o)o.remove();return}
 if(!o){o=document.createElement('div');o.id='v4ban';document.body.appendChild(o)}
 o.innerHTML='<div class="uc"><b class="st">⛔ Account banned</b><p>Your account has been banned'+(BAN.until?' until <b>'+when(BAN.until)+'</b>':'')+'.</p><p class="bnr">Reason: <b>'+esc(BAN.reason||'Breaking the game rules')+'</b></p><p class="bns">If you think this is a mistake, contact the Dice Cards team.</p><div class="us2"><button class="opr rm" onclick="__banOut()">Log out</button></div></div>'}
window.__banOut=()=>{try{window.__ON.auth.signOut()}catch(e){}location.reload()};
setInterval(()=>{if(BAN)showBan()},30e3);

/* ---------- warnings: pop up once ---------- */
let wU=null,wUid=null,WQ=[];
function watchWarn(){const u=ON()?UID():null;if(u===wUid)return;if(wU)wU();wU=null;wUid=u;if(!u)return;
 wU=db().collection('warns').where('uid','==',u).onSnapshot(q=>{WQ=q.docs.map(d=>Object.assign({id:d.id},d.data())).filter(x=>!x.seen);showWarn()},e=>console.log('warn watch',e&&e.code))}
function showWarn(){if(!WQ.length||document.getElementById('v4warn'))return;const x=WQ[0];const o=document.createElement('div');o.id='v4warn';
 o.innerHTML='<div class="uc"><b class="st">⚠️ Warning</b><p>The Dice Cards team has sent you a warning.</p><p class="bnr">Reason: <b>'+esc(x.reason||'')+'</b></p><p class="bns">Another warning and your account will be banned.</p><div class="us2"><button class="opr" onclick="__warnOk(\''+x.id+'\')">I understand</button></div></div>';document.body.appendChild(o);try{snd(220,.15,'square')}catch(e){}}
window.__warnOk=id=>{const o=document.getElementById('v4warn');if(o)o.remove();WQ=WQ.filter(x=>x.id!==id);db().collection('warns').doc(id).update({seen:true}).catch(e=>console.log('warn seen',e&&e.code));setTimeout(showWarn,400)};

setInterval(()=>{watchBan();watchWarn();checkMod();if(ON())ownerNum()},2500);

/* ---------- redeem codes (online codes first, then the game's built-in ones) ---------- */
const _rd=window.redeem;
window.redeem=async function(){const i=document.getElementById('rdc'),c=((i&&i.value)||'').trim().toUpperCase();
 const old=()=>{CTX='Redeem code '+c;try{return _rd.apply(this,arguments)}finally{CTX=''}};
 if(!ON()||!/^[A-Z0-9]{3,20}$/.test(c))return old();
 const say=t=>{const m=document.getElementById('rdm');if(m)m.textContent=t};say('Checking…');
 let d=null;try{const s=await db().collection('codes').doc(c).get();d=s.exists?s.data():null}catch(e){console.log('code',e&&e.code)}
 if(!d)return old();
 if(d.until&&d.until<Date.now()){say('That code has expired.');return}
 const r=db().collection('redeems').doc(c+'_'+UID());
 try{const s=await r.get();if(s.exists){say('You already used that code.');return}await r.set({code:c,uid:UID(),name:myName(),t:Date.now()})}catch(e){console.log('redeem',e&&e.code);say('Something went wrong — try again.');return}
 const got=[];if(d.gold){SV.gold+=d.gold;got.push(d.gold+' gold')}if(d.gems){SV.gems+=d.gems;got.push(d.gems+' gems')}
 if(d.sh){const H=Object.keys(HD);const h=H[Math.floor(Math.random()*H.length)];SV.sh[h]=(SV.sh[h]||0)+d.sh;got.push(d.sh+' '+(HD[h].n||'hero')+' shards')}
 if(d.bp){const B=Object.keys(BASES);const b=B[Math.floor(Math.random()*B.length)];SV.bs=SV.bs||{};SV.bs[b]=(SV.bs[b]||0)+d.bp;got.push(d.bp+' '+(BASES[b].n||'base')+' blueprints')}
 SV.codes=SV.codes||[];SV.codes.push(c);CTX='Redeem code '+c;try{localStorage.setItem('dc7',JSON.stringify(SV))}catch(e){}CTX='';menu();const m=document.getElementById('rdm');if(m)m.textContent='Code redeemed! '+got.join(' · ');ding(784)};

/* ---------- cheat alerts: big jumps in gold / gems / upgrades, with where they came from ---------- */
let CTX='',LAST=null,LOG=[],SAMP=[],ALT={};
const ctx=()=>{if(CTX)return CTX;try{const M=document.getElementById('menu'),inMenu=M&&M.style.display!=='none';
 const pt=(document.querySelector('#menu .mpop .uc b, #menu .mpop b')||{}).textContent||'',ov=document.getElementById('ov'),ovt=ov&&ov.style.display!=='none'?((ov.querySelector('h2,b')||{}).textContent||''):'';
 const T={shop:'Shop',coll:'Collection',main:'Battle',comm:'Community',jour:'Journal'}[tab]||tab;
 return (inMenu?T+(tab==='comm'?' › '+({fr:'Friends',gu:'Guild',ml:'Mail',st:'Settings'}[CMT]||''):''):'In a match'+(ovt?' › '+ovt.trim():''))+(pt?' › '+pt.trim().slice(0,40):'')}catch(e){return '?'}};
const snap=()=>({g:Math.floor(SV.gold||0),m:Math.floor(SV.gems||0),u:window.__upN()});
const LIM={g:[4000,'gold'],m:[150,'gems'],u:[12,'upgrades']};
function track(){if(!ON()||isOwner())return;const s=snap(),now=Date.now();
 if(LAST){const d={g:s.g-LAST.g,m:s.m-LAST.m,u:s.u-LAST.u};if(d.g||d.m||d.u){LOG.push({t:now,dg:d.g,dm:d.m,du:d.u,w:ctx()});if(LOG.length>40)LOG.shift()}}
 LAST=s;SAMP.push({t:now,...s});SAMP=SAMP.filter(x=>now-x.t<=10*60e3);
 Object.keys(LIM).forEach(k=>{const lo=SAMP.reduce((a,x)=>Math.min(a,x[k]),s[k]),gain=s[k]-lo;if(gain>=LIM[k][0]&&now-(ALT[k]||0)>30*60e3){ALT[k]=now;
  const rec=LOG.filter(x=>now-x.t<=10*60e3).slice(-20);
  db().collection('alerts').doc(rid()).set({uid:UID(),name:myName(),num:(FR.prof&&FR.prof.num)||'',kind:LIM[k][1],amt:gain,from:lo,to:s[k],t:now,log:JSON.stringify(rec)}).catch(e=>console.log('alert',e&&e.code))}})}
const _si=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){const r=_si.apply(this,arguments);if(k==='dc7'&&this===window.localStorage){try{track()}catch(e){}}return r};
window.addEventListener('dc-synced',()=>{LAST=null;SAMP=[];LOG=[]});

['tstMax','tstReset'].forEach(k=>{const f=window[k];if(typeof f==='function')window[k]=function(){CTX='Test tools › '+(k==='tstMax'?'Max account stats':'Reset account');try{return f.apply(this,arguments)}finally{CTX=''}}});
/* ---------- owners: free shop + real-money items ---------- */
const freeOn=()=>ON()&&isOwner()&&SV.ofree!==false;
['buy','bbuy','bup','__rfDo','ob2'].forEach(k=>{const f=window[k];if(typeof f!=='function')return;window[k]=function(){if(!freeOn())return f.apply(this,arguments);
 const g=SV.gold,m=SV.gems;SV.gold=1e9;SV.gems=1e9;let r;try{r=f.apply(this,arguments)}finally{SV.gold=g;SV.gems=m;try{localStorage.setItem('dc7',JSON.stringify(SV))}catch(e){}try{menu()}catch(e){}}return r}});
const _gb=window.__gemBuy;window.__gemBuy=function(i){if(!freeOn())return _gb.apply(this,arguments);const n=[100,550,1200][i]||0;SV.gems+=n;try{localStorage.setItem('dc7',JSON.stringify(SV))}catch(e){}menu();note('👑 Owner: +'+n+' gems (free)');ding(784)};

/* ---------- staff actions ---------- */
const logA=(act,uid,name,reason)=>db().collection('modlog').doc(rid()).set({by:UID(),byName:myName(),own:isOwner()?1:0,act,uid:uid||'',name:name||'',reason:reason||'',t:Date.now()}).catch(e=>console.log('modlog',e&&e.code));
async function findP(q){q=String(q||'').trim().replace(/^#/,'');if(!q)return null;const D=db();let u=null;
 try{if(/^\d{8}$/.test(q)){const s=await D.collection('nums').doc(q).get();if(s.exists)u=s.data().uid}
  else{const s=await D.collection('names').doc(q.toLowerCase()).get();if(s.exists)u=s.data().uid}
  if(!u)u=q;const p=await D.collection('profiles').doc(u).get();return p.exists?Object.assign({uid:u},p.data()):null}catch(e){console.log('find',e&&e.code);return null}}

/* ---------- the panel ---------- */
let PT='pl',P=null,PQ='',CU=null,RK2='gd',CACHE={};
const TABS=()=>[['pl','👤 Players'],['bw','⛔ Bans & warnings'],['gu','🛡 Guilds'],['ch','💬 Staff chat'],...(isOwner()?[['cd','🎟 Codes'],['rk','🏆 Rankings'],['al','🚨 Cheat alerts'],['md','🧑‍⚖️ Moderators'],['me','👑 My account']]:[])];
window.__opOpen=function(){if(!staff())return;if(isOwner()){askCode();return}openP()};
function askCode(){const o=shell();o.innerHTML='<div class="uc opk"><b class="st">👑 Owner panel</b><p>Enter your owner code</p><input id="opc" class="sin" type="password" inputmode="numeric" maxlength="8" autocomplete="off"><div id="opm" class="smsg"></div><div class="us2"><button class="opr rm" onclick="__opClose()">Cancel</button><button class="opr" onclick="__opCode()">Open</button></div></div>';
 const i=document.getElementById('opc');i.focus();i.onkeydown=e=>{if(e.key==='Enter')window.__opCode()}}
window.__opCode=()=>{const v=(document.getElementById('opc')||{}).value;if(v===CODE){ding(784);openP()}else{document.getElementById('opm').textContent='Wrong code.';try{snd(200,.1,'square')}catch(e){}}};
const shell=()=>{let o=document.getElementById('ownp');if(!o){o=document.createElement('div');o.id='ownp';document.body.appendChild(o)}return o};
window.__opX=()=>{if(BACK){const b=BACK;BACK=null;__opTab(b);return}__opClose()};
window.__opClose=()=>{PEND=null;BACK=null;const o=document.getElementById('ownp');if(o)o.remove();if(CU){CU();CU=null}};
let PEND=null;
function openP(){const o=shell();o.innerHTML='<div class="uc opw"><div class="oph"><b class="st">'+(isOwner()?'👑 Owner panel':'🛡 Moderator panel')+'</b><button class="opx" onclick="__opX()">✕</button></div><div class="opt"></div><div class="opb"></div></div>';tabs();if(PEND){const f=PEND;PEND=null;f();BACK=null}else show(PT)}
function tabs(){const t=document.querySelector('#ownp .opt');if(!t)return;const T=TABS();if(!T.some(x=>x[0]===PT))PT='pl';t.innerHTML=T.map(([k,l])=>'<button class="'+(PT===k?'on':'')+'" onclick="__opTab(\''+k+'\')">'+l+'</button>').join('')}
window.__opTab=k=>{BACK=null;PT=k;if(CU){CU();CU=null}tabs();show(k)};
const body=h=>{const b=document.querySelector('#ownp .opb');if(b)b.innerHTML=h;return b};
const busy=()=>body('<div class="dnt">Loading…</div>');
async function show(k){try{({pl:pPlayers,bw:pBW,gu:pGuilds,ch:pChat,cd:pCodes,rk:pRank,al:pAlerts,md:pMods,me:pMe}[k]||pPlayers)()}catch(e){console.log('panel',e);body('<div class="dnt">Something went wrong.</div>')}}

/* players */
function pPlayers(){body('<div class="opr2"><input id="opq" class="sin" placeholder="Name, player number or UID" value="'+esc(PQ)+'"><button class="opr" onclick="__opFind()">Find</button></div><div id="opres">'+(P?'':'<div class="dnt">Search for a player to warn, ban or make moderator.</div>')+'</div>');
 const i=document.getElementById('opq');i.onkeydown=e=>{if(e.key==='Enter')window.__opFind()};if(P)card(P)}
window.__opFind=async()=>{PQ=(document.getElementById('opq')||{}).value||'';const r=document.getElementById('opres');if(r)r.innerHTML='<div class="dnt">Searching…</div>';const p=await findP(PQ);P=p;if(!p){if(r)r.innerHTML='<div class="dnt">No player found.</div>';return}card(p)};
let BACK=null;
window.__opPlayer=async u=>{if(document.querySelector('#ownp .opw')&&PT!=='pl')BACK=PT;PT='pl';tabs();PQ=u;body('<div class="dnt">Loading…</div>');P=await findP(u);pPlayers()};
async function card(p){const r=document.getElementById('opres');if(!r)return;r.innerHTML='<div class="dnt">Loading…</div>';const D=db();let ban=null,warns=[],mod=false;
 try{const b=await D.collection('bans').doc(p.uid).get();ban=b.exists?b.data():null}catch(e){}
 try{const q=await D.collection('warns').where('uid','==',p.uid).get();warns=q.docs.map(d=>d.data()).sort((a,b)=>b.t-a.t)}catch(e){}
 try{const m=await D.collection('mods').doc(p.uid).get();mod=m.exists}catch(e){}
 const own=isOwner(p.uid),banned=ban&&(!ban.until||ban.until>Date.now()),seen=ms(p.seen);
 const st=(l,v)=>'<div><small>'+l+'</small><b>'+v+'</b></div>';
 r.innerHTML=(BACK?'<button class="opr sm" onclick="__opX()">◀ Back</button>':'')+'<div class="opc"><div class="opn"><b>'+esc(p.name||'Player')+(own?' 👑':mod?' 🛡':'')+'</b><span>#'+esc(p.num||'—')+' · '+(seen&&Date.now()-seen<3*60e3?'<i class="on">● online</i>':'last seen '+when(seen))+'</span><small class="uid">'+esc(p.uid)+'</small></div>'+
  '<div class="gst">'+st('Rank',esc(p.rk||'—'))+st('Level',p.lv||1)+st('Wins',(p.w||0)+' W · '+(p.l||0)+' L')+st('Gold',p.gd!=null?p.gd:'—')+st('Gems',p.gm!=null?p.gm:'—')+st('Upgrades',p.up!=null?p.up:'—')+st('Play time',p.pt!=null?Math.round(p.pt/60*10)/10+' h':'—')+st('Guild',esc(p.g||'—'))+st('Warnings',warns.length)+'</div>'+
  (banned?'<div class="opban">⛔ Banned'+(ban.until?' until '+when(ban.until):' forever')+' — '+esc(ban.reason||'')+' <small>by '+esc(ban.byName||'?')+'</small></div>':'')+
  (warns.length?'<div class="opwl">'+warns.map(x=>'<div>⚠️ '+esc(x.reason)+' <small>'+when(x.t)+' · '+esc(x.byName||'')+(x.seen?' · seen':' · not seen yet')+'</small></div>').join('')+'</div>':'')+
  (own||p.uid===UID()?'<div class="dnt">Owner account.</div>':'<div class="opa"><button class="opr" onclick="__opWarnAsk()">⚠️ Warn</button>'+(banned?'<button class="opr" onclick="__opUnban()">✅ Unban</button>':'<button class="opr rm" onclick="__opBanAsk()">⛔ Ban</button>')+(isOwner()?(mod?'<button class="opr rm" onclick="__opMod(0)">Remove moderator</button>':'<button class="opr" onclick="__opMod(1)">🛡 Make moderator</button>'):'')+'</div>')+'</div>';
 P.__w=warns.length}
const ask=(title,html,go)=>{const b=document.querySelector('#ownp .opb');if(!b)return;b.insertAdjacentHTML('beforeend','<div class="opdlg"><div class="uc"><b class="st">'+title+'</b>'+html+'<div id="opdm" class="smsg"></div><div class="us2"><button class="opr rm" onclick="this.closest(\'.opdlg\').remove()">Cancel</button><button class="opr" id="opgo">OK</button></div></div></div>');document.getElementById('opgo').onclick=go};
window.__opWarnAsk=()=>ask('Warn '+esc(P.name),(P.__w?'<p class="bns">This player already has '+P.__w+' warning'+(P.__w>1?'s':'')+'. You may want to ban instead.</p>':'')+'<p>The player sees this once, with “Another warning and your account will be banned.”</p><textarea id="opr" class="sin" rows="3" maxlength="200" placeholder="Reason"></textarea>',async()=>{
 const why=(document.getElementById('opr').value||'').trim();if(!why){document.getElementById('opdm').textContent='Write a reason.';return}
 try{await db().collection('warns').doc(rid()).set({uid:P.uid,name:P.name||'',reason:why,by:UID(),byName:myName(),t:Date.now(),seen:false});logA('warn',P.uid,P.name,why);note('Warning sent to '+P.name);card(P)}catch(e){console.log('warn',e&&e.code);document.getElementById('opdm').textContent='Could not send ('+(e&&e.code)+')'}});
window.__opBanAsk=()=>ask('Ban '+esc(P.name),'<label class="slb">How long<select id="opd" class="sin"><option value="1">1 day</option><option value="3">3 days</option><option value="7">7 days</option><option value="30">30 days</option><option value="0" selected>Forever</option></select></label><textarea id="opr" class="sin" rows="3" maxlength="200" placeholder="Reason"></textarea>',async()=>{
 const why=(document.getElementById('opr').value||'').trim(),d=+document.getElementById('opd').value;if(!why){document.getElementById('opdm').textContent='Write a reason.';return}
 try{await db().collection('bans').doc(P.uid).set({uid:P.uid,name:P.name||'',reason:why,by:UID(),byName:myName(),t:Date.now(),until:d?Date.now()+d*864e5:0});logA('ban'+(d?' '+d+'d':' forever'),P.uid,P.name,why);note(P.name+' is banned');card(P)}catch(e){console.log('ban',e&&e.code);document.getElementById('opdm').textContent='Could not ban ('+(e&&e.code)+')'}});
window.__opUnban=async()=>{try{await db().collection('bans').doc(P.uid).delete();logA('unban',P.uid,P.name,'');note(P.name+' is unbanned');card(P)}catch(e){note('Could not unban')}};
window.__opMod=async on=>{if(!isOwner())return;try{const r=db().collection('mods').doc(P.uid);if(on)await r.set({uid:P.uid,name:P.name||'',by:UID(),t:Date.now()});else await r.delete();logA(on?'made moderator':'removed moderator',P.uid,P.name,'');note(P.name+(on?' is now a moderator':' is no longer a moderator'));card(P)}catch(e){note('Could not change ('+(e&&e.code)+')')}};

/* bans & warnings lists */
async function pBW(){busy();const D=db();let B=[],W=[];try{B=(await D.collection('bans').get()).docs.map(d=>d.data())}catch(e){}try{W=(await D.collection('warns').get()).docs.map(d=>d.data())}catch(e){}
 B.sort((a,b)=>b.t-a.t);W.sort((a,b)=>b.t-a.t);
 body('<div class="frh">Bans · '+B.length+'</div>'+(B.length?B.map(b=>{const on=!b.until||b.until>Date.now();return '<div class="oprow '+(on?'':'old')+'" onclick="__opPlayer(\''+b.uid+'\')"><b>'+esc(b.name)+'</b><span>'+(on?(b.until?'⛔ '+left(b.until)+' left':'⛔ forever'):'ended')+' · '+esc(b.reason)+'</span><small>'+when(b.t)+' · by '+esc(b.byName)+'</small></div>'}).join(''):'<div class="dnt">No bans.</div>')+
  '<div class="frh">Warnings · '+W.length+'</div>'+(W.length?W.map(x=>'<div class="oprow" onclick="__opPlayer(\''+x.uid+'\')"><b>'+esc(x.name)+'</b><span>⚠️ '+esc(x.reason)+'</span><small>'+when(x.t)+' · by '+esc(x.byName)+(x.seen?' · seen':' · not seen yet')+'</small></div>').join(''):'<div class="dnt">No warnings.</div>'))}

/* guilds */
let GL=[];
async function pGuilds(){busy();try{GL=(await db().collection('guilds').get()).docs.map(d=>Object.assign({id:d.id},d.data()))}catch(e){GL=[]}
 GL.sort((a,b)=>a.n.localeCompare(b.n));
 body(GL.length?GL.map(g=>{const n=Object.keys(g.mem||{}).length,ai=Object.keys(g.ai||{}).length,ld=(g.mem||{})[g.lead];return '<div class="oprow" onclick="__opGuild(\''+g.id+'\')"><b>'+esc(g.n)+(g.bot?' <small>(AI guild)</small>':'')+'</b><span>'+n+' real player'+(n===1?'':'s')+(ai?' · '+ai+' AI':'')+(ld?' · leader '+esc(ld.n):'')+'</span><small>'+esc(g.msg||'')+'</small></div>'}).join(''):'<div class="dnt">No guilds.</div>')}
window.__opGuild=id=>{const g=GL.find(x=>x.id===id);if(!g)return;
 body('<button class="opr sm" onclick="__opTab(\'gu\')">◀ All guilds</button><div class="opc"><div class="opn"><b>'+esc(g.n)+'</b><small class="uid">'+esc(g.id)+'</small></div>'+
  '<label class="slb">Name<input id="ogn" class="sin" maxlength="18" value="'+esc(g.n)+'"></label><label class="slb">Message<textarea id="ogm" class="sin" rows="2" maxlength="120">'+esc(g.msg||'')+'</textarea></label><div id="ogx" class="smsg"></div>'+
  '<div class="opa"><button class="opr" onclick="__opGSave(\''+id+'\')">Save</button>'+(g.bot?'':'<button class="opr rm" onclick="__opGDel(\''+id+'\')">Delete guild</button>')+'</div>'+
  '<div class="frh">Members</div>'+Object.entries(g.mem||{}).map(([u,m])=>'<div class="oprow" onclick="__opPlayer(\''+u+'\')"><b>'+esc(m.n)+'</b><span>'+({L:'Leader',c:'Co-leader',m:'Member'}[m.role]||'')+' · '+(m.gp||0)+' guild pts</span></div>').join('')+'</div>')};
window.__opGSave=async id=>{const g=GL.find(x=>x.id===id),n=(document.getElementById('ogn').value||'').trim().replace(/\s+/g,' '),msg=(document.getElementById('ogm').value||'').trim().slice(0,120),m=document.getElementById('ogx');
 if(!/^[A-Za-z0-9 ]{3,18}$/.test(n)){m.textContent='Use 3–18 letters, numbers or spaces.';return}
 const D=db(),nl=n.toLowerCase(),b=D.batch(),up={msg};
 if(n!==g.n){if(nl!==g.nl){const s=await D.collection('gnames').doc(nl).get();if(s.exists||nl==='moonblades'){m.textContent='That guild name is taken.';return}b.set(D.collection('gnames').doc(nl),{gid:id,lead:g.lead||''});if(g.nl&&!g.bot)b.delete(D.collection('gnames').doc(g.nl))}up.n=n;up.nl=nl}
 b.update(D.collection('guilds').doc(id),up);
 try{await b.commit();if(up.n)logA('renamed guild',id,g.n+' → '+n,'');if(msg!==(g.msg||''))logA('edited guild message',id,n,msg);Object.assign(g,up);note('Guild saved');__opGuild(id)}catch(e){console.log('guild edit',e&&e.code);m.textContent='Could not save ('+(e&&e.code)+')'}};
window.__opGDel=id=>{const g=GL.find(x=>x.id===id);ask('Delete '+esc(g.n)+'?','<p>All members will be removed from the guild.</p>',async()=>{const D=db(),b=D.batch();b.delete(D.collection('guilds').doc(id));if(g.nl)b.delete(D.collection('gnames').doc(g.nl));
 try{await b.commit();logA('deleted guild',id,g.n,'');note('Guild deleted');pGuilds()}catch(e){document.getElementById('opdm').textContent='Could not delete ('+(e&&e.code)+')'}})};

/* staff chat */
function pChat(){body('<div class="opchat" id="opcl"><div class="dnt">Loading…</div></div><div class="opr2"><input id="opct" class="sin" maxlength="300" placeholder="Message to the team"><button class="opr" onclick="__opSay()">Send</button></div>');
 document.getElementById('opct').onkeydown=e=>{if(e.key==='Enter')window.__opSay()};
 CU=db().collection('modchat').onSnapshot(q=>{const L=q.docs.map(d=>d.data()).sort((a,b)=>a.t-b.t).slice(-80),el=document.getElementById('opcl');if(!el)return;
  el.innerHTML=L.length?L.map(x=>'<div class="'+(x.from===UID()?'me':'')+'"><b>'+esc(x.name)+(OWN[x.from]?' 👑':'')+'</b><span>'+esc(x.text)+'</span><small>'+when(x.t)+'</small></div>').join(''):'<div class="dnt">No messages yet.</div>';el.scrollTop=el.scrollHeight},e=>console.log('chat',e&&e.code))}
window.__opSay=()=>{const i=document.getElementById('opct'),t=(i.value||'').trim();if(!t)return;i.value='';db().collection('modchat').doc(rid()).set({from:UID(),name:myName(),text:t.slice(0,300),t:Date.now()}).catch(e=>note('Could not send ('+(e&&e.code)+')'))};

/* redeem codes (owner) */
async function pCodes(){busy();let C=[],R=[];try{C=(await db().collection('codes').get()).docs.map(d=>Object.assign({id:d.id},d.data()))}catch(e){}try{R=(await db().collection('redeems').get()).docs.map(d=>d.data())}catch(e){}
 C.sort((a,b)=>b.t-a.t);
 const n=k=>'<input id="'+k+'" class="sin" type="number" min="0" placeholder="0">';
 body('<div class="frh">New code</div><div class="opc"><label class="slb">Code<input id="occ" class="sin" maxlength="20" placeholder="e.g. HAPPY2026" style="text-transform:uppercase"></label>'+
  '<div class="opg"><label class="slb">Gold'+n('ocg')+'</label><label class="slb">Gems'+n('ocm')+'</label><label class="slb">Hero shards'+n('ocs')+'</label><label class="slb">Blueprints'+n('ocb')+'</label></div>'+
  '<label class="slb">Works for<select id="ocd" class="sin"><option value="1">1 hour</option><option value="24">1 day</option><option value="72">3 days</option><option value="168" selected>7 days</option><option value="720">30 days</option><option value="0">Forever</option></select></label><div id="ocx" class="smsg"></div><button class="opr" onclick="__opCode2()">Create code</button></div>'+
  '<div class="frh">Codes · '+C.length+'</div>'+(C.length?C.map(c=>{const on=!c.until||c.until>Date.now(),used=R.filter(r=>r.code===c.id).length,rw=[c.gold&&c.gold+' gold',c.gems&&c.gems+' gems',c.sh&&c.sh+' shards',c.bp&&c.bp+' blueprints'].filter(Boolean).join(' · ');
   return '<div class="oprow '+(on?'':'old')+'"><b>'+esc(c.id)+'</b><span>'+esc(rw||'no reward')+'</span><small>'+(on?(c.until?'ends in '+left(c.until):'never ends'):'expired')+' · used '+used+' time'+(used===1?'':'s')+'</small><button class="opr rm sm" onclick="event.stopPropagation();__opCodeDel(\''+c.id+'\')">Delete</button></div>'}).join(''):'<div class="dnt">No codes yet.</div>'))}
window.__opCode2=async()=>{const v=id=>(document.getElementById(id)||{}).value,c=(v('occ')||'').trim().toUpperCase(),m=document.getElementById('ocx'),num=id=>Math.max(0,Math.floor(+v(id)||0));
 if(!/^[A-Z0-9]{3,20}$/.test(c)){m.textContent='Use 3–20 letters or numbers.';return}const d={gold:num('ocg'),gems:num('ocm'),sh:num('ocs'),bp:num('ocb')};if(!d.gold&&!d.gems&&!d.sh&&!d.bp){m.textContent='Add at least one reward.';return}
 const h=+v('ocd');Object.assign(d,{until:h?Date.now()+h*36e5:0,by:UID(),t:Date.now()});
 try{const r=db().collection('codes').doc(c);if((await r.get()).exists){m.textContent='That code already exists.';return}await r.set(d);logA('created code',c,c,JSON.stringify({gold:d.gold,gems:d.gems,sh:d.sh,bp:d.bp,h}));note('Code '+c+' created');pCodes()}catch(e){m.textContent='Could not create ('+(e&&e.code)+')'}};
window.__opCodeDel=async c=>{try{await db().collection('codes').doc(c).delete();logA('deleted code',c,c,'');pCodes()}catch(e){note('Could not delete')}};

/* rankings (owner) */
const RKS=[['gd','Gold'],['gm','Gems'],['pt','Play time'],['up','Upgrades'],['w','Wins'],['rp','Rank points'],['lv','Level']];
async function pRank(){busy();let L=CACHE.prof;if(!L||Date.now()-CACHE.pt>60e3){try{L=(await db().collection('profiles').get()).docs.map(d=>Object.assign({uid:d.id},d.data()));CACHE.prof=L;CACHE.pt=Date.now()}catch(e){L=[]}}
 const k=RK2,S=L.filter(p=>p.name).sort((a,b)=>(+b[k]||0)-(+a[k]||0)).slice(0,50),fmt=p=>k==='pt'?(Math.round((+p.pt||0)/6)/10)+' h':(+p[k]||0);
 body('<div class="opsel">'+RKS.map(([x,l])=>'<button class="'+(k===x?'on':'')+'" onclick="__opRk(\''+x+'\')">'+l+'</button>').join('')+'</div><div class="dnt">'+L.length+' players · top 50</div>'+
  S.map((p,i)=>'<div class="oprow rk" onclick="__opPlayer(\''+p.uid+'\')"><em>'+(i+1)+'</em><b>'+esc(p.name)+(OWN[p.uid]?' 👑':'')+'</b><span>'+fmt(p)+'</span></div>').join(''))}
window.__opRk=k=>{RK2=k;pRank()};

/* cheat alerts (owner) */
async function pAlerts(){busy();let A=[];try{A=(await db().collection('alerts').get()).docs.map(d=>Object.assign({id:d.id},d.data()))}catch(e){}A.sort((a,b)=>b.t-a.t);
 body(A.length?'<div class="dnt">Shown when a player gains 4000+ gold, 150+ gems or 12+ upgrades within 10 minutes.</div>'+A.slice(0,100).map(a=>{let lg=[];try{lg=JSON.parse(a.log||'[]')}catch(e){}
  return '<div class="opc al"><div class="opn"><b onclick="__opPlayer(\''+a.uid+'\')">🚨 '+esc(a.name)+' <small>#'+esc(a.num||'')+'</small></b><span>+'+a.amt+' '+esc(a.kind)+' in 10 min ('+a.from+' → '+a.to+') · '+when(a.t)+'</span></div>'+
   '<details><summary>How it was received ('+lg.length+')</summary>'+lg.map(x=>'<div class="alg"><small>'+when(x.t)+'</small> '+[x.dg?(x.dg>0?'+':'')+x.dg+' gold':'',x.dm?(x.dm>0?'+':'')+x.dm+' gems':'',x.du?(x.du>0?'+':'')+x.du+' upgrades':''].filter(Boolean).join(', ')+' <i>'+esc(x.w)+'</i></div>').join('')+'</details>'+
   '<div class="opa"><button class="opr sm" onclick="__opPlayer(\''+a.uid+'\')">Open player</button><button class="opr rm sm" onclick="__opAlDel(\''+a.id+'\')">Dismiss</button></div></div>'}).join(''):'<div class="dnt">No cheat alerts. 🎉</div>')}
window.__opAlDel=async id=>{try{await db().collection('alerts').doc(id).delete();pAlerts()}catch(e){note('Could not dismiss')}};

/* moderators + their log (owner) */
async function pMods(){busy();let M=[],L=[];try{M=(await db().collection('mods').get()).docs.map(d=>d.data())}catch(e){}try{L=(await db().collection('modlog').get()).docs.map(d=>d.data())}catch(e){}L.sort((a,b)=>b.t-a.t);
 body('<div class="frh">Moderators · '+M.length+'</div>'+(M.length?M.map(m=>'<div class="oprow" onclick="__opPlayer(\''+m.uid+'\')"><b>🛡 '+esc(m.name)+'</b><span>since '+when(m.t)+' · '+L.filter(x=>x.by===m.uid).length+' actions</span></div>').join(''):'<div class="dnt">No moderators yet. Find a player in Players and press “Make moderator”.</div>')+
  '<div class="frh">Staff action log</div>'+(L.length?L.slice(0,150).map(x=>'<div class="oprow log"><b>'+esc(x.byName)+(x.own?' 👑':' 🛡')+'</b><span>'+esc(x.act)+(x.name?' · '+esc(x.name):'')+(x.reason?' — '+esc(x.reason):'')+'</span><small>'+when(x.t)+'</small></div>').join(''):'<div class="dnt">Nothing yet.</div>'))}

/* my account (owner) */
function pMe(){const f=SV.ofree!==false;
 body('<div class="opc"><div class="opn"><b>'+esc(myName())+' 👑</b><span>Owner number #'+OWN[UID()]+'</span></div>'+
  '<label class="fr3 st opsw"><b>Free shop for my account</b><input type="checkbox" class="sw" '+(f?'checked':'')+' onchange="SV.ofree=this.checked;try{localStorage.setItem(\'dc7\',JSON.stringify(SV))}catch(e){}"></label><p class="bns">When on, shop items, refreshes, chest skips and gem packs cost you nothing.</p></div>'+
  '<div class="frh">Give myself</div><div class="opa wrap"><button class="opr" onclick="__opGive(\'g\')">+10,000 gold</button><button class="opr" onclick="__opGive(\'m\')">+1,000 gems</button><button class="opr" onclick="__opGive(\'s\')">+100 shards (all heroes)</button><button class="opr" onclick="__opGive(\'b\')">+20 blueprints (all bases)</button></div>'+
  '<div class="frh">🧪 Test tools</div><div class="opa wrap"><button class="opr" onclick="__opMax()">Max account stats</button><button class="opr rm" onclick="__opReset()">Reset account</button></div>')}
window.__opGive=k=>{if(!isOwner())return;if(k==='g')SV.gold+=1e4;if(k==='m')SV.gems+=1e3;if(k==='s')Object.keys(HD).forEach(h=>SV.sh[h]=(SV.sh[h]||0)+100);if(k==='b'){SV.bs=SV.bs||{};Object.keys(BASES).forEach(b=>SV.bs[b]=(SV.bs[b]||0)+20)}
 try{localStorage.setItem('dc7',JSON.stringify(SV))}catch(e){}note('👑 Added');ding(784)};

/* ---------- test tools: removed from everyone's Settings, kept in the owner panel ---------- */
const _st=window.__stW;if(_st)window.__stW=function(){let h=_st.apply(this,arguments);try{const i=h.indexOf('<div class="ttl">🧪');if(i>=0){const k=h.indexOf('tstResetAsk',i),e=h.indexOf('</button></div></div>',k);if(k>0&&e>0)h=h.slice(0,i)+h.slice(e+'</button></div></div>'.length)}}catch(e){}return h};
window.__opMax=()=>{if(!isOwner())return;tstMax();note('Account stats maxed (test)')};
window.__opReset=()=>ask('Reset my account?','<p>This deletes <b>all</b> your progress and starts the game fresh. This can’t be undone.</p>',()=>{__opClose();tstReset()});
/* ---------- entry: Settings page button + Moderate button on profiles + owner badge ---------- */
const _m=menu;menu=function(){const r=_m.apply(this,arguments);try{entry()}catch(e){}return r};
function entry(){if(!staff()||tab!=='comm'||CMT!=='st')return;const l=document.querySelector('#mb .sset')||document.querySelector('#mb .flst');if(!l||l.querySelector('.opent'))return;
 l.insertAdjacentHTML('afterbegin','<button class="opent" onclick="__opOpen()"><span>'+(isOwner()?'👑':'🛡')+'</span><b>'+(isOwner()?'Owner panel':'Moderator panel')+'</b></button>')}
const _pf=window.__pfShow;if(_pf)window.__pfShow=function(o){const r=_pf.apply(this,arguments);try{const u=o&&(o.uid||o.id),box=document.querySelector('#menu .mpop .pfp');
 if(box&&u&&OWN[u]){const nm=box.querySelector('.pnm b');if(nm&&!nm.querySelector('.own'))nm.insertAdjacentHTML('beforeend',' <i class="own">👑 Owner</i>')}
 if(box&&u&&staff()&&u!==UID()&&!/^ai_|^p/.test(u)&&u.length>=20){const b=box.querySelector('.us2');if(b&&!b.querySelector('.opmb'))b.insertAdjacentHTML('beforeend','<button class="opr opmb" onclick="soClose();__opOpenP(\''+u+'\')">🛡 Moderate</button>')}}catch(e){}return r};
window.__opOpenP=u=>{if(!staff())return;PEND=()=>__opPlayer(u);if(isOwner())askCode();else openP()};

const css=document.createElement('style');css.textContent=`
#ownp,#v4ban,#v4warn{position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;background:#000b;padding:10px;box-sizing:border-box}
#v4ban{z-index:9500;background:#160a05f2}#v4warn{z-index:9400}
#v4ban .uc,#v4warn .uc,#ownp .opk{width:min(92vw,380px);text-align:center}
#v4ban p,#v4warn p,#ownp p{color:#fff2d8;font:600 14px system-ui;margin:6px 0}
#v4ban .bnr,#v4warn .bnr{background:#00000055;border:1px solid #c99436;border-radius:9px;padding:7px}
#ownp .bns,#v4ban .bns,#v4warn .bns{font-size:12px!important;color:#ffcbb8!important}
#ownp .sin,#v4ban .sin{box-sizing:border-box;width:100%;padding:8px 10px;border-radius:9px;border:1.5px solid #8a6326;background:#1c120a;color:#fff2d8;font:600 14px system-ui}
#ownp .smsg{min-height:16px;font:700 12px system-ui;color:#ffb3a8;margin:4px 0}
#ownp .us2,#v4ban .us2,#v4warn .us2{display:flex;gap:8px;justify-content:center;margin-top:8px}
#ownp .opr,#v4ban .opr,#v4warn .opr{min-height:36px;padding:0 14px;border-radius:10px;border:2px solid #6b3f0a;background:linear-gradient(#ffe08a,#e9a43a);color:#3a2006;font:400 15px 'Lilita One',system-ui,sans-serif;cursor:pointer;box-shadow:inset 0 1px 0 #fff6c8,0 2px 0 #4a2a06}
#ownp .opr.rm,#v4ban .opr.rm{background:linear-gradient(#e86a5a,#b03a2a);color:#fff;border-color:#5a1a10}
#ownp .opr.sm{min-height:28px;font-size:13px;padding:0 10px}
#ownp .opr:disabled{opacity:.5}
#ownp .opw{width:min(96vw,620px);height:min(92svh,820px);display:flex;flex-direction:column;padding:12px!important;overflow:hidden}
#ownp .oph{display:flex;align-items:center;justify-content:space-between;flex:none}#ownp .oph .st{margin:0!important;flex:1;text-align:center}
#ownp .opx{width:34px;height:34px;border-radius:50%;border:2px solid #6b3f0a;background:#e86a5a;color:#fff;font:900 16px system-ui;cursor:pointer;flex:none}
#ownp .opt{flex:none;display:flex;flex-wrap:wrap;justify-content:center;gap:5px;padding:6px 0 8px}
#ownp .opt button{flex:none;height:28px;padding:0 9px;border-radius:15px;border:1.5px solid #c99436;background:#2a1a0bcc;color:#fff2d8;font:700 12px system-ui;cursor:pointer;white-space:nowrap}
#ownp .opt button.on{background:linear-gradient(#ffe08a,#e9a43a);color:#3a2006;border-color:#6b3f0a}
#ownp .opb{flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column;gap:6px;position:relative;padding-right:2px}
#ownp .dnt{font:600 12.5px system-ui;color:#e8d6b4;text-align:center;padding:6px}
#ownp .frh{font:400 15px 'Lilita One',system-ui,sans-serif;color:#ffe08a;margin:6px 2px 0}
#ownp .opr2{display:flex;gap:6px;flex:none}#ownp .opr2 .sin{flex:1}
#ownp .opc{display:flex;flex-direction:column;gap:6px;padding:9px;border-radius:11px;background:#2a1a0bcc;border:1.5px solid #c99436}
#ownp .opn{display:flex;flex-direction:column;gap:1px}#ownp .opn b{font:400 18px 'Lilita One',system-ui,sans-serif;color:#ffe08a;cursor:pointer}
#ownp .opn span{font:600 12px system-ui;color:#e8d6b4}#ownp .opn .uid{font:600 10px monospace;color:#b8a888;word-break:break-all}
#ownp i.on{font-style:normal;color:#7dff7d}
#ownp .gst{display:grid;grid-template-columns:repeat(3,1fr);gap:5px}
#ownp .gst div{display:flex;flex-direction:column;align-items:center;padding:5px 2px;border-radius:8px;background:#00000044;border:1px solid #8a6326;text-align:center}
#ownp .gst small{font-size:10px;color:#e8d6b4}#ownp .gst b{font:400 14px 'Lilita One',system-ui;color:#ffe08a;word-break:break-word}
#ownp .opban{padding:7px;border-radius:9px;background:#7a1a10;border:1.5px solid #ff8a7a;color:#fff;font:700 13px system-ui}
#ownp .opwl{display:flex;flex-direction:column;gap:3px;font:600 12.5px system-ui;color:#ffe2b8}#ownp .opwl small{color:#c8b08a}
#ownp .opa{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}
#ownp .oprow{position:relative;display:flex;flex-direction:column;gap:1px;padding:7px 10px;border-radius:10px;background:linear-gradient(#4a9cf0,#2a6ccc);border:1.5px solid #17407e;cursor:pointer;text-align:left}
#ownp .oprow.old{filter:grayscale(.8) brightness(.8)}
#ownp .oprow b{font:700 14px system-ui;color:#fff}#ownp .oprow span{font:600 12px system-ui;color:#e6f1ff}#ownp .oprow small{font:600 10.5px system-ui;color:#c9defa}
#ownp .oprow .opr{position:absolute;right:8px;top:50%;transform:translateY(-50%)}
#ownp .oprow.rk{flex-direction:row;align-items:center;gap:8px}#ownp .oprow.rk em{font:400 15px 'Lilita One',system-ui;color:#ffe08a;font-style:normal;width:24px}#ownp .oprow.rk b{flex:1}#ownp .oprow.rk span{font:400 15px 'Lilita One',system-ui;color:#fff}
#ownp .oprow.log{cursor:default;background:linear-gradient(#5a4632,#3e2f20);border-color:#8a6326}
#ownp .opsel{display:flex;gap:4px;flex-wrap:wrap;justify-content:center}
#ownp .opsel button{height:28px;padding:0 10px;border-radius:14px;border:1.5px solid #c99436;background:#2a1a0bcc;color:#fff2d8;font:700 12px system-ui;cursor:pointer}
#ownp .opsel button.on{background:#ffd166;color:#3a2006}
#ownp .slb{display:flex;flex-direction:column;gap:3px;font:700 12px system-ui;color:#e8d6b4;text-align:left}
#ownp .opg{display:grid;grid-template-columns:1fr 1fr;gap:6px}
#ownp .opchat{flex:1;min-height:120px;overflow:auto;display:flex;flex-direction:column;gap:5px;padding:6px;border-radius:10px;background:#00000044;border:1px solid #8a6326}
#ownp .opchat>div{align-self:flex-start;max-width:85%;display:flex;flex-direction:column;padding:5px 9px;border-radius:10px;background:#f6e3b8;color:#3a2006}
#ownp .opchat>div.me{align-self:flex-end;background:#bfe3ff}
#ownp .opchat b{font:800 11.5px system-ui}#ownp .opchat span{font:600 13.5px system-ui;word-break:break-word}#ownp .opchat small{font:600 9.5px system-ui;opacity:.7}
#ownp .al details{font:600 12px system-ui;color:#e8d6b4}#ownp .al summary{cursor:pointer;color:#ffe08a}#ownp .alg{padding:2px 0;border-bottom:1px solid #ffffff18}#ownp .alg i{color:#9fd6ff;font-style:normal}
#ownp .opdlg{position:fixed;inset:0;z-index:2;display:flex;align-items:center;justify-content:center;background:#000a}
#ownp .opdlg .uc{width:min(92vw,380px)}
#ownp .opsw{display:flex;align-items:center;justify-content:space-between;color:#fff2d8}
#menu .opent{flex:none;display:flex;align-items:center;justify-content:center;gap:8px;min-height:44px;margin:0 0 6px;border-radius:12px;border:2px solid #6b3f0a;background:linear-gradient(#ffe38e,#e9ac2e 60%,#d08f1c);box-shadow:inset 0 2px 0 #fff3c4,0 3px 0 #5a3608;cursor:pointer}
#menu .opent span{font-size:20px}#menu .opent b{font:400 17px 'Lilita One',system-ui,sans-serif;color:#3a2006}
#menu .pnm .own{font-style:normal;font:800 11px system-ui;color:#3a2006;background:#ffd166;border-radius:8px;padding:1px 6px;vertical-align:middle}
`;document.head.appendChild(css);
}catch(e){console.log('v4 owner',e)}})();
