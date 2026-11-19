
/* ===== v4: real friends — unique usernames, player numbers, friend requests (Firebase) ===== */
(function(){try{
const O=window.__ON;if(!O)return;
const esc=t=>String(t==null?'':t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ms=v=>v&&v.toMillis?v.toMillis():(+v||0);
const FV=()=>firebase.firestore.FieldValue;
const NAME_OK=/^[A-Za-z0-9_]{3,16}$/;
const A1=['Brave','Swift','Lucky','Grim','Bold','Sly','Mighty','Wild','Frost','Ember','Shadow','Iron','Golden','Rusty','Sneaky','Jolly','Stormy','Mossy','Fiery','Silent'];
const A2=['Goblin','Knight','Wizard','Ogre','Dragon','Rogue','Hunter','Bat','Mage','Raven','Wolf','Pirate','Dicer','Golem','Troll','Witch','Archer','Imp','Viking','Ranger'];
const pick=a=>a[Math.floor(Math.random()*a.length)];
const randName=()=>{for(;;){const n=pick(A1)+pick(A2)+Math.floor(10+Math.random()*990);if(n.length<=16)return n}};
const randNum=()=>String(Math.floor(10000000+Math.random()*90000000));
let lastErr='',busyE=false,prof=null,uid=null,unsub=[],frU={},frIds=[],frP={},inc=[],out=[],hb=0;
const F=window.__FRON={get uid(){return uid},isOnline:p=>isOnline(p),get on(){return !!(prof&&O.state==='ready'&&O.user)},get prof(){return prof},get err(){return lastErr},retry:()=>ensure()};
const ON=()=>F.on;
const db=()=>O.db;
const isOnline=p=>p&&Date.now()-ms(p.seen)<3*60e3;
const rankName=()=>{try{let r=0;RK.forEach((x,i)=>{if((SV.rp||0)>=x[1])r=i});return RK[r][0]}catch(e){return 'Bronze'}};
const RKN=()=>{try{return RK.map(x=>x[0])}catch(e){return ['Bronze']}};
const okH=h=>{try{return HD[h]?h:'k'}catch(e){return 'k'}};
const stats=()=>{const w=SV.wins||0,pl=SV.played||0;return {h:okH(SV.pav||SV.mine),rk:rankName(),rp:SV.rp||0,w:w,l:Math.max(0,pl-w),lv:1+Math.floor(pl/3),g:String(SV.guild||'No guild').slice(0,24)}};
const toast=t=>{try{const n=document.createElement('div');n.className='m3note';n.textContent=t;document.body.appendChild(n);setTimeout(()=>n.remove(),2000)}catch(e){}};
const refresh=()=>{try{if(typeof tab!=='undefined'&&tab==='comm'&&typeof CMT!=='undefined'&&CMT==='fr'&&!document.querySelector('#menu .mpop')&&document.getElementById('menu').style.display!=='none')menu()}catch(e){}};

/* ---------- profile: create with a random unique name + number, keep stats fresh ---------- */
async function ensure(){const u=O.user;if(!u||busyE||prof)return;busyE=true;try{await ensure2(u)}finally{busyE=false}}
async function ensure2(u){uid=u.uid;const D=db(),ref=D.collection('profiles').doc(uid);
 let s;try{s=await ref.get()}catch(e){lastErr=(e&&e.code)||'load';console.log('profile load',e);return}
 if(s.exists&&s.data().name)prof=s.data();
 else{for(let i=0;i<8&&!prof;i++){const n=randName(),num=randNum(),p=Object.assign({name:n,nameLower:n.toLowerCase(),num:num,seen:FV().serverTimestamp()},stats());
   const b=D.batch();b.set(D.collection('names').doc(p.nameLower),{uid:uid});b.set(D.collection('nums').doc(num),{uid:uid});b.set(ref,p);
   try{await b.commit();prof=p;lastErr=''}catch(e){lastErr=(e&&e.code)||'create';console.log('name try',e&&e.code);if(lastErr!=='permission-denied'||i>=2)break}}
  if(!prof)return}
 if(O.user&&O.user.uid!==uid)return;
 const em=(u.email||'').toLowerCase();if(em)D.collection('emails').doc(em).set({uid:uid}).catch(e=>console.log('email idx',e&&e.code));
 if(SV.pname!==prof.name){SV.pname=prof.name;sv()}
 beat(1);listen();refresh()}
let lastSt='';
function beat(full){if(!ON())return;const st=stats(),k=JSON.stringify(st);const d=(full||k!==lastSt)?Object.assign({seen:FV().serverTimestamp()},st):{seen:FV().serverTimestamp()};lastSt=k;
 db().collection('profiles').doc(uid).set(d,{merge:true}).catch(e=>console.log('beat',e&&e.code))}
window.addEventListener('dc-saved',()=>{if(ON()){const k=JSON.stringify(stats());if(k!==lastSt)beat()}});

/* ---------- live lists: friends, incoming + outgoing requests ---------- */
function stop(){unsub.forEach(f=>{try{f()}catch(e){}});unsub=[];Object.values(frU).forEach(f=>{try{f()}catch(e){}});frU={};frIds=[];frP={};inc=[];out=[];clearInterval(hb);hb=0}
function listen(){stop();const D=db();
 unsub.push(D.collection('friends').doc(uid).collection('list').onSnapshot(q=>{frIds=q.docs.map(d=>d.id);
  Object.keys(frU).forEach(id=>{if(!frIds.includes(id)){frU[id]();delete frU[id];delete frP[id]}});
  frIds.forEach(id=>{if(!frU[id])frU[id]=D.collection('profiles').doc(id).onSnapshot(s=>{frP[id]=s.exists?s.data():null;refresh()},e=>console.log('fr prof',e&&e.code))});refresh()},e=>console.log('friends',e&&e.code)));
 unsub.push(D.collection('reqs').where('to','==',uid).onSnapshot(q=>{inc=q.docs.map(d=>Object.assign({id:d.id},d.data()));refresh()},e=>console.log('reqs in',e&&e.code)));
 unsub.push(D.collection('reqs').where('from','==',uid).onSnapshot(q=>{out=q.docs.map(d=>Object.assign({id:d.id},d.data()));refresh()},e=>console.log('reqs out',e&&e.code)));
 hb=setInterval(()=>{if(document.visibilityState==='visible')beat()},60e3)}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&ON())beat()});
window.addEventListener('dc-auth',()=>{stop();prof=null;uid=null;if(!O.user){try{SV.frReq=(SV.frReq||[]).filter(r=>!r.r);SV.frOut=(SV.frOut||[]).filter(o=>!o.r)}catch(e){}}});
window.addEventListener('dc-synced',()=>{if(O.user&&!prof)ensure()});
setInterval(()=>{if(O.user&&O.synced&&!prof&&O.state==='ready')ensure()},30e3);

/* ---------- what the existing friends page shows ---------- */
const friendObj=id=>{const p=frP[id]||{};const rks=RKN();return {id:id,n:NAME_OK.test(p.name||'')?p.name:'Player',h:okH(p.h),rk:rks.includes(p.rk)?p.rk:'Bronze',g:esc(p.g||'No guild'),w:+p.w||0,l:+p.l||0,wv:0,lv:+p.lv||1,num:/^\d{8}$/.test(p.num||'')?p.num:'',real:1,on:isOnline(p)}};
const _fr=window.__friends;
window.__friends=function(){if(!ON())return _fr?_fr():[];return frIds.filter(id=>frP[id]).map(friendObj).sort((a,b)=>b.on-a.on||a.n.localeCompare(b.n))};
const _isOn=window.__isOn;window.__isOn=id=>{if(ON()&&frP[id])return isOnline(frP[id]);return _isOn?_isOn(id):false};
const rkOk=r=>RKN().includes(r)?r:'Bronze';
function mapReqs(){SV.frReq=inc.map(r=>({id:r.id,n:NAME_OK.test(r.fromName||'')?r.fromName:'Player',h:okH(r.fromH),rk:rkOk(r.fromRk),r:1}));
 SV.frOut=out.map(o=>({n:NAME_OK.test(o.toName||'')?o.toName:'Player',t:Date.now(),r:1,id:o.id}))}
try{const _mi=mailInit;mailInit=function(){if(ON())SV.mday=Math.floor(Date.now()/864e5);return _mi.apply(this,arguments)}}catch(e){}
(function w(){if(typeof menu!=='function'){setTimeout(w,200);return}const _m=menu;menu=function(){
  if(ON())mapReqs();else{SV.frReq=(SV.frReq||[]).filter(r=>!r.r);SV.frOut=(SV.frOut||[]).filter(o=>!o.r)}
  const r=_m.apply(this,arguments);try{deco()}catch(e){console.log('fr deco',e)}return r}})();
function deco(){if(!ON()||typeof tab==='undefined'||tab!=='comm'||CMT!=='fr')return;const mb=document.getElementById('mb');if(!mb)return;
 mb.querySelectorAll('.fr3:not(.rq)').forEach(r=>{const g=r.querySelector('.fgf');if(g)g.remove();
  const st=r.querySelector('.fst'),m=st&&(st.getAttribute('onclick')||'').match(/fav\('([^']+)'\)/);if(!m||!frP[m[1]])return;
  const d=r.querySelector('.ond');if(d){const on=isOnline(frP[m[1]]);d.classList.toggle('on',on);d.classList.toggle('off',!on)}});
 try{const P=window.__POR||{};mb.querySelectorAll('.fr3.rq:not(.out) .fp').forEach((fp,i)=>{const r=SV.frReq[i];if(r&&P[r.h]&&!fp.querySelector('img'))fp.innerHTML='<img alt="" src="'+P[r.h]+'">'})}catch(e){}
 const dn=mb.querySelector('.dnt');if(dn)dn.innerHTML='Your username: <b>'+esc(prof.name)+'</b> · player number: <b>#'+esc(prof.num)+'</b>';
 if(!frIds.length){const l=mb.querySelector('.flst');if(l&&!l.querySelector('.fr0'))l.insertAdjacentHTML('beforeend','<div class="fr0" style="text-align:center;padding:14px 6px;font:600 12.5px system-ui;color:#e8d6b4">No friends yet — tap <b>＋ Add friend</b> and type their username, player number or email.</div>')}}

/* ---------- popups (same look as the game's) ---------- */
const pop=html=>{const M=document.getElementById('menu');let p=M.querySelector('.mpop');if(p)p.remove();p=document.createElement('div');p.className='mpop spop';p.innerHTML='<div class="uc">'+html+'</div>';p.onclick=e=>{if(e.target===p)p.remove()};M.appendChild(p);return p};
const shut=()=>{const p=document.querySelector('#menu .mpop');if(p)p.remove()};
const _addPop=window.frAddPop;
window.frAddPop=function(){if(!ON())return _addPop&&_addPop();
 const p=pop('<b class="st">Add a friend</b><p>Type their <b>username</b>, <b>player number</b> or <b>email</b>.</p><input id="frn" class="sin" maxlength="80" autocomplete="off" autocapitalize="off" placeholder="Username, number or email"><div id="frm" class="smsg"></div><div class="us2"><button class="opr" id="frgo" onclick="frSend()">Send request</button><button class="opr rm" onclick="soClose()">Cancel</button></div>');
 const i=p.querySelector('#frn');i.onkeydown=e=>{if(e.key==='Enter')frSend()};setTimeout(()=>{try{i.focus()}catch(e){}},50)};
const _send=window.frSend;
window.frSend=async function(){if(!ON())return _send&&_send();
 const i=document.getElementById('frn'),m=document.getElementById('frm'),b=document.getElementById('frgo');let q=(i&&i.value||'').trim();const say=t=>{if(m)m.textContent=t};
 if(!q){say('Type a username, number or email.');return}
 const D=db();let kind,key;
 if(q.includes('@')){kind='emails';key=q.toLowerCase()}
 else if(/^#?\s*[\d ]{8,10}$/.test(q)){kind='nums';key=q.replace(/[#\s]/g,'')}
 else{kind='names';key=q.toLowerCase();if(!NAME_OK.test(q)){say('Usernames use only letters, numbers and _');return}}
 if(b)b.disabled=true;say('Searching…');
 try{const s=await D.collection(kind).doc(key).get();
  if(!s.exists){say(kind==='emails'?'No player with that email.':kind==='nums'?'No player with that number.':'No player with that username.');return}
  const to=s.data().uid;
  if(to===uid){say('That’s you!');return}
  if(frIds.includes(to)){say((frP[to]&&frP[to].name||'They')+' is already your friend.');return}
  if(out.some(o=>o.to===to)){say('You already sent them a request.');return}
  const back=inc.find(r=>r.from===to);if(back){shut();return window.frAcc(back.id,1)}
  const tp=await D.collection('profiles').doc(to).get();const tn=tp.exists?tp.data().name:'';
  await D.collection('reqs').doc(uid+'_'+to).set({from:uid,to:to,fromName:prof.name,fromH:okH(SV.pav||SV.mine),fromRk:rankName(),toName:tn,t:FV().serverTimestamp()});
  shut();toast('Friend request sent to '+(tn||'player'));try{snd(660,.08,'triangle')}catch(e){}
 }catch(e){console.log('fr send',e&&e.code);say(e&&e.code==='unavailable'?'No internet connection.':'Something went wrong — try again.')}
 finally{if(b)b.disabled=false}};
const _acc=window.frAcc;
window.frAcc=async function(id,ok){if(!ON())return _acc&&_acc(id,ok);const r=inc.find(x=>x.id===id);if(!r)return;const D=db();
 try{const b=D.batch();if(ok){b.set(D.collection('friends').doc(uid).collection('list').doc(r.from),{t:FV().serverTimestamp()});b.set(D.collection('friends').doc(r.from).collection('list').doc(uid),{t:FV().serverTimestamp()})}
  b.delete(D.collection('reqs').doc(id));await b.commit();try{snd(ok?660:300,.08,'triangle')}catch(e){}if(ok)toast((r.fromName||'Player')+' is now your friend')}
 catch(e){console.log('fr acc',e&&e.code);toast('Something went wrong — try again')}};
const _can=window.frCancel;
window.frCancel=function(n){if(!ON())return _can&&_can(n);const o=out.find(x=>x.toName===n)||out.find(x=>!x.toName);if(!o)return;db().collection('reqs').doc(o.id).delete().catch(e=>{console.log('fr cancel',e&&e.code);toast('Something went wrong — try again')})};
const _del=window.frDel;
window.frDel=function(id){if(!ON()||!frIds.includes(id))return _del&&_del(id);const D=db(),b=D.batch();
 b.delete(D.collection('friends').doc(uid).collection('list').doc(id));b.delete(D.collection('friends').doc(id).collection('list').doc(uid));
 b.commit().then(()=>{SV.fav=(SV.fav||[]).filter(x=>x!==id);sv()}).catch(e=>{console.log('fr del',e&&e.code);toast('Something went wrong — try again')});shut()};
/* battle a real friend: live battles come in the next update */
const _fb=window.fbat;
window.fbat=function(id){if(!(ON()&&frIds.includes(id)))return _fb&&_fb.apply(this,arguments);const f=friendObj(id);
 if(window.__invite)return window.__invite(f,frP[id]||{});
 pop('<b class="st">Battle '+esc(f.n)+'</b><p>Live battles with friends are coming in the next update!</p><div class="us2"><button class="opr" onclick="soClose()">OK</button></div>')};
try{fbat=window.fbat}catch(e){}

/* ---------- profile popup: username rules + player number ---------- */
const _save=window.__pfSave;
window.__pfSave=async function(){let synced=null;try{synced=JSON.parse(localStorage.getItem('dc7_sync')||'null')}catch(e){}
 const i=document.getElementById('pfnm'),v=(i&&i.value||'').trim();
 const err=t=>{let e=document.querySelector('#menu .pfp .pner');if(!e){const r=document.querySelector('#menu .pfp .pnr');if(!r)return toast(t);r.insertAdjacentHTML('afterend','<div class="pner" style="font:700 11.5px system-ui;color:#ffb3a8;text-align:center;margin-top:-2px"></div>');e=document.querySelector('#menu .pfp .pner')}e.textContent=t};
 if(!ON()){if(O.user&&O.state==='ready'){ensure();return err('Setting up your online profile… try again in a moment'+(lastErr?' ('+lastErr+')':''))}
  if(synced&&synced.uid)return err('Connect to the internet to change your name.');return _save&&_save()}
 if(!NAME_OK.test(v))return err('3–16 letters, numbers or _ (no spaces).');
 if(v===prof.name){SV.pname=v;return _save&&_save()}
 const D=db(),lo=v.toLowerCase(),old=prof.nameLower;
 try{if(lo!==old){const s=await D.collection('names').doc(lo).get();if(s.exists&&s.data().uid!==uid)return err('That name is taken — try another.')}
  const b=D.batch();if(lo!==old){b.set(D.collection('names').doc(lo),{uid:uid});b.delete(D.collection('names').doc(old))}
  b.set(D.collection('profiles').doc(uid),{name:v,nameLower:lo},{merge:true});await b.commit();
  prof=Object.assign({},prof,{name:v,nameLower:lo});_save&&_save()}
 catch(e){console.log('rename',e&&e.code);err(e&&e.code==='permission-denied'?'That name is taken — try another.':'Something went wrong — try again.')}};
const numRow=()=>{if(!ON())return;const box=document.querySelector('#menu .mpop .pfp');if(!box||box.querySelector('.pnum'))return;
 const nm=box.querySelector('.pnm b'),me=nm&&nm.textContent===prof.name&&box.querySelector('.pics');
 let num='';if(me)num=prof.num;else if(nm){const f=frIds.map(friendObj).find(x=>x.n===nm.textContent);if(f)num=f.num}
 if(!num)return;const at=box.querySelector('.pnm')||box.querySelector('.pnr');if(!at)return;
 at.insertAdjacentHTML('afterend','<div class="pnum" style="display:flex;align-items:center;justify-content:center;gap:8px;font:700 12px system-ui;color:#e8d6b4">Player number <b style="font:400 15px \'Lilita One\',system-ui;color:#ffe08a;letter-spacing:.5px">#'+esc(num)+'</b>'+(me?'<button style="height:24px;padding:0 9px;border-radius:8px;border:1.5px solid #6b3f0a;background:linear-gradient(#f0cf7a,#c8962e);color:#3a2006;font:800 11px system-ui;cursor:pointer">Copy</button>':'')+'</div>');
 const cb=box.querySelector('.pnum button');if(cb)cb.onclick=()=>{try{navigator.clipboard.writeText(num).then(()=>{cb.textContent='Copied!'}).catch(()=>{cb.textContent='#'+num})}catch(e){}}};
try{new MutationObserver(numRow).observe(document.getElementById('menu'),{childList:true,subtree:true})}catch(e){}
}catch(e){console.warn('v4 friends',e)}})();
