
/* ===== v4: online accounts + online saves (Firebase). Works in the phone app; the claude.ai page can't reach Firebase and stays offline. ===== */
(function(){try{
const CFG=window.__FBCFG,K='dc7',KT='dc7_lt',KS='dc7_sync',VER=['12.18.0','10.14.1'];
const _set=Storage.prototype.setItem;
const lg=k=>{try{return localStorage.getItem(k)}catch(e){return null}},ls=(k,v)=>{try{_set.call(localStorage,k,v)}catch(e){}};
const pj=t=>{try{return JSON.parse(t)}catch(e){return null}};
let known=false,auth=null,db=null,user=null,state=CFG?'loading':'none',upT=0,quiet=false,busy=false;
const O=window.__ON={get user(){return user},get state(){return state},get db(){return db},get auth(){return auth},push:()=>push(),status:m=>status(m)};
const emit=n=>{try{window.dispatchEvent(new Event(n))}catch(e){}};
const onSplash=()=>{const s=document.getElementById('splash');return !!s&&s.style.display!=='none'};

/* every game save also marks the time and queues an online save */
Storage.prototype.setItem=function(k,v){_set.call(this,k,v);try{if(k===K&&!quiet&&this===window.localStorage){_set.call(this,KT,String(Date.now()));queue()}}catch(e){}};
function queue(){if(!user||!db)return;clearTimeout(upT);upT=setTimeout(push,2500)}
function push(){clearTimeout(upT);upT=0;if(!user||!db)return Promise.resolve();const raw=lg(K);if(!raw)return Promise.resolve();
 const t=+lg(KT)||Date.now(),uid=user.uid,sv=pj(raw)||{};
 return db.collection('players').doc(uid).set({sv:raw,t:t,name:sv.pname||user.displayName||'',email:user.email||'',up:firebase.firestore.FieldValue.serverTimestamp()},{merge:true})
  .then(()=>{ls(KS,JSON.stringify({uid:uid,t:t}));status();emit('dc-saved')}).catch(e=>{console.log('online save',e);status('Online save failed — will retry')})}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&upT)push()});
window.addEventListener('online',()=>{if(user)push()});

/* load an online save into this phone */
function adopt(raw,t){const go=()=>{quiet=true;ls(K,raw);ls(KT,String(t));ls(KS,JSON.stringify({uid:user.uid,t:t}));quiet=false;location.reload()};
 if(onSplash())return go();
 panel('<h3>Online save</h3><p>Your online save is newer than this phone\'s. Load it now? The game restarts.</p><div class="acc"><button data-k="1"><b>Load it</b>Online save</button><button data-k="0"><b>Not now</b>Keep playing</button></div>',b=>{b.querySelectorAll('.acc button').forEach(x=>x.onclick=()=>{close();x.dataset.k==='1'?go():done(push())})})}
function sum(s){s=s||{};return 'Wins '+(s.wins||0)+' · Played '+(s.played||0)+'<br>🪙 '+(s.gold||0)+' · 💎 '+(s.gems||0)}
const done=p=>Promise.resolve(p).then(()=>{O.synced=1;emit('dc-synced')});
async function sync(){if(!user||!db)return;O.synced=0;busy=true;status();
 let snap;try{snap=await db.collection('players').doc(user.uid).get()}catch(e){console.log('online load',e);busy=false;status('Online save not reachable');return}
 busy=false;const raw=lg(K),lt=+lg(KT)||0,sy=pj(lg(KS)),d=snap.exists?snap.data():null;
 if(!d||!d.sv){ // new account: upload this phone's progress, unless it belongs to a different account
  if(sy&&sy.uid&&sy.uid!==user.uid){quiet=true;try{localStorage.removeItem(K);localStorage.removeItem(KT)}catch(e){}quiet=false;ls(KS,JSON.stringify({uid:user.uid,t:0}));location.reload();return}
  return done(push())}
 const ct=+d.t||0;
 if(d.sv===raw){ls(KS,JSON.stringify({uid:user.uid,t:ct}));status();return done()}
 if(sy&&sy.uid===user.uid){ // this phone already uses this account
  if(lt>sy.t&&lt>=ct)return done(push());
  if(ct>sy.t)return adopt(d.sv,ct);
  return done(push())}
 if(sy&&sy.uid)return adopt(d.sv,ct); // phone was on another account: take this account's save
 const loc=pj(raw);
 if(!loc||!(loc.played>0))return adopt(d.sv,ct); // nothing played on this phone yet
 panel('<h3>Pick your progress</h3><p>This account already has an online save. Which one do you want to keep?</p><div class="acc"><button data-k="c"><b>Online save</b>'+sum(pj(d.sv))+'</button><button data-k="p"><b>This phone</b>'+sum(loc)+'</button></div>',b=>{b.querySelectorAll('.acc button').forEach(x=>x.onclick=()=>{close();x.dataset.k==='c'?adopt(d.sv,ct):done(push())})},true)}

/* title screen buttons + status line */
function status(msg){const bs=document.querySelectorAll('#splash .xau button'),tx=document.querySelector('#splash .xsoon');if(!bs.length)return;
 const on=state==='ready';
 bs.forEach(b=>{b.disabled=!on;b.classList.toggle('on',on);b.classList.remove('me')});
 if(on&&user){bs[0].textContent='✓ '+(user.displayName?user.displayName.split(' ')[0]:(user.email||'Account').split('@')[0]);bs[0].classList.add('me');if(bs[1])bs[1].textContent='Log out'}
 else{bs[0].textContent='Log in';if(bs[1])bs[1].textContent='Register'}
 const st=document.getElementById('bgn');if(st)st.classList.toggle('lk',needLogin());
 if(!tx)return;tx.classList.toggle('ok',!!(on&&user&&!msg&&!busy));
 tx.textContent=msg||(state==='none'?'Accounts are coming soon':state==='loading'?'Connecting…':state==='off'?(/claude\.ai|claudeusercontent/.test(location.hostname)?'Online accounts work in the phone app':'Offline — playing on this phone'):!known?'Connecting…':!user?'Log in or register to play':busy?'Checking your online save…':'Progress saved online')}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('#splash .xau button');if(!b||state!=='ready')return;e.preventDefault();e.stopPropagation();
 const i=[...document.querySelectorAll('#splash .xau button')].indexOf(b);
 if(user){if(i===1)push().then(()=>auth.signOut())}else form(i===1?'reg':'log')},true);
function needLogin(){return (state==='loading'||state==='ready')&&!(known&&user)}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('#bgn');if(!b||!needLogin())return;e.preventDefault();e.stopImmediatePropagation();
 if(state==='ready'&&known)form('log');else status('Connecting… try again in a moment')},true);
const iv=setInterval(()=>{if(!onSplash())return clearInterval(iv);status()},1500);

/* popup */
function close(){const p=document.getElementById('acp');if(p)p.remove()}
function panel(html,fn,noX){close();const p=document.createElement('div');p.id='acp';p.innerHTML='<div class="acb">'+(noX?'':'<button class="acx">✕</button>')+html+'</div>';document.body.appendChild(p);
 const x=p.querySelector('.acx');if(x)x.onclick=close;p.onclick=e=>{if(e.target===p&&!noX)close()};fn&&fn(p.firstChild)}
const G='<svg viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.7 6c4.5-4.2 6.9-10.3 6.9-17.7z"/><path fill="#FBBC05" d="M10.6 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.2 1.5-5 2.3-8.2 2.3-6.2 0-11.5-4.1-13.4-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z"/></svg>';
const ERR={'auth/invalid-email':'That email doesn\'t look right','auth/missing-password':'Type your password','auth/weak-password':'Password needs at least 6 characters','auth/email-already-in-use':'This email already has an account — log in instead','auth/invalid-credential':'Wrong email or password','auth/wrong-password':'Wrong email or password','auth/user-not-found':'No account with this email — register first','auth/too-many-requests':'Too many tries — wait a minute','auth/network-request-failed':'No internet connection','auth/popup-closed-by-user':'','auth/cancelled-popup-request':'','auth/user-disabled':'This account is blocked'};
const msgOf=e=>e&&ERR[e.code]!==undefined?ERR[e.code]:'Something went wrong — try again';
function form(m){const reg=m==='reg';
 panel('<h3>'+(reg?'Register':'Log in')+'</h3><button class="acg">'+G+'Continue with Google</button><div class="aco">or with email</div><input type="email" placeholder="Email" autocomplete="email"><input type="password" placeholder="Password'+(reg?' (6+ characters)':'')+'" autocomplete="'+(reg?'new-password':'current-password')+'"><button class="acm">'+(reg?'Create account':'Log in')+'</button><div class="acl">'+(reg?'<span></span><a data-a="log">Have an account? Log in</a>':'<a data-a="fg">Forgot password?</a><a data-a="reg">New? Register</a>')+'</div><div class="ace"></div>',b=>{
  const [em,pw]=b.querySelectorAll('input'),er=b.querySelector('.ace'),bt=b.querySelectorAll('.acg,.acm');
  const run=pr=>{er.textContent='';er.classList.remove('ok');bt.forEach(x=>x.disabled=true);return pr.then(()=>close()).catch(e=>{console.log('login',e);er.textContent=msgOf(e)}).finally(()=>bt.forEach(x=>x.disabled=false))};
  b.querySelector('.acg').onclick=()=>{const pv=new firebase.auth.GoogleAuthProvider();pv.setCustomParameters({prompt:'select_account'});
   run(auth.signInWithPopup(pv).catch(e=>{if(e&&(e.code==='auth/popup-blocked'||e.code==='auth/operation-not-supported-in-this-environment'))return auth.signInWithRedirect(pv);throw e}))};
  const go=()=>{const a=em.value.trim(),p=pw.value;if(!a){er.textContent='Type your email';return}run(reg?auth.createUserWithEmailAndPassword(a,p):auth.signInWithEmailAndPassword(a,p))};
  b.querySelector('.acm').onclick=go;pw.onkeydown=e=>{if(e.key==='Enter')go()};
  b.querySelectorAll('.acl a').forEach(a=>a.onclick=()=>{const k=a.dataset.a;if(k!=='fg')return form(k);
   const v=em.value.trim();if(!v){er.textContent='Type your email first, then tap Forgot password';return}
   auth.sendPasswordResetEmail(v).then(()=>{er.classList.add('ok');er.textContent='Check your email for a reset link'}).catch(e=>{er.classList.remove('ok');er.textContent=msgOf(e)})});
  setTimeout(()=>{try{em.focus()}catch(e){}},50)})}

/* start Firebase (scripts load only in the phone app; blocked on the claude.ai page) */
const load=(v,src)=>new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://www.gstatic.com/firebasejs/'+v+'/'+src;s.onload=ok;s.onerror=()=>{s.remove();no()};document.head.appendChild(s)});
const loadAll=v=>load(v,'firebase-app-compat.js').then(()=>Promise.all([load(v,'firebase-auth-compat.js'),load(v,'firebase-firestore-compat.js')]));
if(CFG){const to=setTimeout(()=>{if(state==='loading'){state='off';status()}},15000);
 loadAll(VER[0]).catch(()=>{try{delete window.firebase}catch(e){window.firebase=undefined}return loadAll(VER[1])}).then(()=>{
  clearTimeout(to);firebase.initializeApp(CFG);try{firebase.setLogLevel&&firebase.setLogLevel('error')}catch(e){}try{firebase.firestore.setLogLevel&&firebase.firestore.setLogLevel('error')}catch(e){}auth=firebase.auth();db=firebase.firestore();try{auth.useDeviceLanguage()}catch(e){}
  auth.getRedirectResult().catch(e=>console.log('redirect',e));
  state='ready';status();
  setTimeout(()=>{if(!known){known=true;status()}},10000);
  auth.onAuthStateChanged(u=>{known=true;user=u||null;close();status();emit('dc-auth');if(user)sync()})
 }).catch(e=>{clearTimeout(to);console.log('firebase load',e);state='off';status()})}
status();
}catch(e){console.warn('v4 online',e)}})();
