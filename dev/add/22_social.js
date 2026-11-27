/* ===== v4 (25 Nov): gifts, AI friends, friend suggestions, recent opponents (online friends page) =====
   Gifts: 25 gold each; send up to 5 a day (one per friend), claim up to 5 a day — in Mail.
   Real friends: Firestore gifts/{to}/in/{from}_{day} {from,fromName,fromH,day,t}; it is moved into SV.mail (id gf_…, g:1) and deleted.
   AI friends (SV.aiFr): local only — added from suggestions or recent opponents; each sends you one gift a day.
   Suggestions show when you have 2 friends or fewer: recently-seen real players + AI players.
   Recent opponents: last 6 opponents (SV.recent), real ones carry their uid. */
(function w(){if(typeof menu!=='function'||typeof SV==='undefined'||!window.__FRON||!window.__ON){setTimeout(w,400);return}try{
const O=window.__ON,F=window.__FRON,ON=()=>F.on,db=()=>O.db,FV=()=>firebase.firestore.FieldValue;
const GOLD=25,MAXS=5,MAXC=5;
const esc=t=>String(t==null?'':t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const day=()=>Math.floor(Date.now()/864e5);
const okH=h=>{try{return HD[h]||(/^[kvsfih][12]$/.test(h)&&(window.__POR||{})[h])?h:'k'}catch(e){return 'k'}};
const POR=()=>window.__POR||{};
const pic=h=>POR()[okH(h)]?'<img alt="" src="'+POR()[okH(h)]+'">':'';
const toast=t=>{try{const n=document.createElement('div');n.className='m3note';n.textContent=t;document.body.appendChild(n);setTimeout(()=>n.remove(),2000)}catch(e){}};
const ding=f=>{try{snd(f||784,.08,'triangle')}catch(e){}};
const RKS=()=>{try{return RK.map(x=>x[0])}catch(e){return ['Bronze']}};
const gs=()=>{const d=day();if(!SV.gft||SV.gft.d!==d)SV.gft={d,to:[],got:0};return SV.gft};
const save=()=>{try{sv()}catch(e){}};
const redraw=()=>{try{if(typeof tab!=='undefined'&&tab==='comm'&&typeof CMT!=='undefined'&&CMT==='fr'&&!document.querySelector('#menu .mpop')&&document.getElementById('menu').style.display!=='none')menu()}catch(e){}};

/* ---------- AI players ---------- */
const N1=['Luna','Grim','Pyra','Frost','Brix','Nyx','Thorne','Juno','Dax','Elwin','Fenna','Rook','Ivy','Kael','Saffi','Wren','Taro','Quill','Lyra','Moss','Edda','Finch','Vex','Tobin'];
const hsh=t=>{let h=7;for(const c of String(t))h=(h*31+c.charCodeAt(0))%1000003;return h};
const aiMake=(seed,n,h)=>{const k=hsh(seed),rk=RKS();const lv=1+k%18;return {id:'ai_'+(n||N1[k%N1.length]+(10+(k>>5)%90)).replace(/\W/g,''),n:n||N1[k%N1.length]+(10+(k>>5)%90),h:okH(h||'kvsfih'[k%6]),rk:rk[Math.min(rk.length-1,(k>>3)%4)],lv,w:5+k%60,l:3+(k>>2)%40}};
const aiList=()=>{SV.aiFr=Array.isArray(SV.aiFr)?SV.aiFr:[];return SV.aiFr};
const aiObj=a=>({id:a.id,n:a.n,h:okH(a.h),rk:a.rk||'Bronze',g:'No guild',w:a.w||0,l:a.l||0,wv:0,lv:a.lv||1,num:'',real:0,ai:1,on:((hsh(a.id)+Math.floor(Date.now()/9e5))%3)!==0,seen:Date.now()-((hsh(a.id)%50)*6e4)});
const isAI=id=>/^ai_/.test(String(id||''));
const aiAdd=a=>{const L=aiList();if(L.some(x=>x.id===a.id))return;L.push({id:a.id,n:a.n,h:a.h,rk:a.rk,lv:a.lv,w:a.w,l:a.l,t:Date.now()});save();toast(a.n+' is now your friend');ding(660)};
/* AI friends appear in the friends list (online) */
const _fr=window.__friends;
window.__friends=function(){const L=_fr?_fr():[];if(!ON())return L;return L.concat(aiList().map(aiObj))};
/* removing / battling an AI friend */
const _del=window.frDel;window.frDel=function(id){if(isAI(id)){SV.aiFr=aiList().filter(x=>x.id!==id);save();const p=document.querySelector('#menu .mpop');if(p)p.remove();redraw();return}return _del&&_del.apply(this,arguments)};
const _fb=window.fbat;window.fbat=function(id){if(isAI(id)){const a=aiList().find(x=>x.id===id);if(!a)return;window.__foe={n:a.n,h:okH(a.h)};window.__frM=1;window.__mmOK=1;try{go('casual')}finally{window.__mmOK=0}return}return _fb&&_fb.apply(this,arguments)};
try{fbat=window.fbat;frDel=window.frDel}catch(e){}

/* ---------- gifts ---------- */
let inbox=[],unIn=null,inUid=null;
function listen(){if(!ON()){if(unIn){unIn();unIn=null;inUid=null;inbox=[]}return}if(unIn&&inUid===F.uid)return;if(unIn)unIn();inUid=F.uid;
 unIn=db().collection('gifts').doc(F.uid).collection('in').onSnapshot(q=>{inbox=q.docs.map(d=>Object.assign({id:d.id,ref:d.ref},d.data()));if(inbox.length)pull()},e=>{console.log('gifts',e&&e.code);unIn=null})}
setInterval(listen,1500);
/* gifts arrive as Mail (like the AI mails): moved into SV.mail with a 25-gold reward, claimed there */
const pull=()=>{try{if(typeof mailInit==='function')mailInit()}catch(e){}SV.mail=SV.mail||[];let n=0;const d=day();
 inbox.forEach(x=>{const id='gf_'+x.id;if(!SV.mail.some(m=>m.id===id)){SV.mail.unshift({id,f:String(x.fromName||'Player').slice(0,16),t:'sent you a gift! 🎁',r:{gold:GOLD},g:1});n++}try{x.ref.delete()}catch(e){}});
 SV.aiGd=SV.aiGd||{};aiList().forEach(a=>{if(SV.aiGd[a.id]===d)return;SV.aiGd[a.id]=d;SV.mail.unshift({id:'ga_'+a.id+'_'+d,f:a.n,t:'sent you a gift! 🎁',r:{gold:GOLD},g:1});n++});
 if(n){save();try{if(typeof tab!=='undefined'&&tab==='comm'&&!document.querySelector('#menu .mpop'))menu()}catch(e){}}};
window.__giftPull=pull;
setInterval(()=>{if(ON()&&(inbox.length||aiList().some(a=>(SV.aiGd||{})[a.id]!==day())))pull()},2000);
window.__giftTo=async function(id){const g=gs();if(g.to.includes(id))return;if(g.to.length>=MAXS){toast('You can send '+MAXS+' gifts a day');return}
 if(isAI(id)){g.to.push(id);save();ding();toast('Gift sent!');redraw();return}
 try{await db().collection('gifts').doc(id).collection('in').doc(F.uid+'_'+g.d).set({from:F.uid,fromName:SV.pname||(F.prof&&F.prof.name)||'Player',fromH:okH(SV.pav||SV.mine),day:g.d,t:FV().serverTimestamp()});
  g.to.push(id);save();ding();toast('Gift sent!');redraw()}catch(e){console.log('gift',e&&e.code);toast(e&&e.code==='unavailable'?'No internet connection':'Could not send the gift')}};
/* claiming in Mail: at most 5 gift mails a day */
(function wc(){if(typeof window.mclaim!=='function'){setTimeout(wc,500);return}const o=window.mclaim;if(o.__g)return;
 const f=function(id){const g=gs();let blocked=0;const L=(SV.mail||[]).filter(m=>!m.c&&(!id||m.id===id));
  L.forEach(m=>{if(!m.g)return;if(g.got>=MAXC){m.__hold=1;blocked++}else{g.got++}});
  const keep=(SV.mail||[]).filter(m=>m.__hold);keep.forEach(m=>{m.c=1});const r=o.apply(this,arguments);keep.forEach(m=>{m.c=0;delete m.__hold});
  if(blocked)toast('You can claim '+MAXC+' gifts a day — the rest wait for tomorrow');save();return r};f.__g=1;window.mclaim=f;try{mclaim=f}catch(e){}})();
/* ---------- recent opponents ---------- */
try{const _i=init;init=function(){const lv=window.__LIVEP;const r=_i.apply(this,arguments);try{if((mode==='casual'||mode==='rank')&&P&&P[1]&&P[1].name){
  SV.recent=Array.isArray(SV.recent)?SV.recent:[];const o={n:String(P[1].name).slice(0,16),h:okH(P[1].h),t:Date.now()};if(lv&&lv.them)o.uid=lv.them;
  SV.recent=[o].concat(SV.recent.filter(x=>x.n!==o.n)).slice(0,6);save()}}catch(e){}return r}}catch(e){}

/* ---------- suggestions ---------- */
let sug=[],sugT=0;
async function loadSug(){if(!ON()||Date.now()-sugT<60e3)return;sugT=Date.now();
 try{let q=db().collection('profiles');q=q.orderBy?q.orderBy('seen','desc'):q;q=q.limit?q.limit(15):q;const s=await q.get();const ids=(F.ids?F.ids():[]);
  sug=s.docs.filter(d=>d.id!==F.uid&&!ids.includes(d.id)&&d.data()&&/^[A-Za-z0-9_]{3,16}$/.test(d.data().name||'')).slice(0,4).map(d=>({uid:d.id,n:d.data().name,h:okH(d.data().h),rk:d.data().rk||'Bronze'}));redraw()}catch(e){console.log('suggest',e&&e.code)}}
const aiSug=()=>{const k=day(),L=aiList().map(a=>a.id),out=[];for(let i=0;out.length<3&&i<12;i++){const a=aiMake('s'+k+'_'+i);if(!L.includes(a.id)&&!out.some(x=>x.id===a.id))out.push(a)}return out};
const SG={};
/* open the profile of a suggested player or a recent opponent */
window.__sgPf=function(key){const x=SG[key];if(!x)return;if(x.uid){if(window.__pfUid)__pfUid(x.uid);return}const a=x.a;if(!a||!window.__pfShow)return;__pfShow({id:a.id,n:a.n,h:a.h,rk:a.rk,w:a.w,l:a.l,lv:a.lv});
 try{const us=document.querySelector('#menu .mpop .pfp .us2');if(us&&!aiList().some(f=>f.id===a.id))us.insertAdjacentHTML('afterbegin','<button class="opr pfa" onclick="soClose();__sgAdd(\''+key+'\')">＋ Add friend</button>')}catch(e){}};
window.__sgAdd=function(key){const x=SG[key];if(!x)return;if(x.uid){if(F.reqTo)F.reqTo(x.uid).then(()=>redraw());return}aiAdd(x.a);redraw()};
const row=(key,x,sub,btn)=>'<div class="fr3 sg3"><div class="fp" onclick="__sgPf(\''+key+'\')">'+pic(x.h)+'</div><div class="ff" onclick="__sgPf(\''+key+'\')"><b>'+esc(x.n)+'</b> <small>'+esc(x.rk||'')+'</small><span>'+sub+'</span></div>'+btn+'</div>';
function deco(){if(!ON()||typeof tab==='undefined'||tab!=='comm'||typeof CMT==='undefined'||CMT!=='fr')return;const mb=document.getElementById('mb');if(!mb)return;const lst=mb.querySelector('.flst');if(!lst||lst.querySelector('.gf3'))return;
 const g=gs();
 lst.insertAdjacentHTML('afterbegin','<div class="gf3"><span>🎁 Gifts sent <b>'+g.to.length+'/'+MAXS+'</b> · claimed <b>'+g.got+'/'+MAXC+'</b> · gifts arrive in Mail</span></div>');
 /* gift button on every friend row (real + AI) */
 lst.querySelectorAll('.fr3:not(.rq):not(.sg3)').forEach(r=>{const st=r.querySelector('.fst'),m=st&&(st.getAttribute('onclick')||'').match(/fav\('([^']+)'\)/);if(!m||r.querySelector('.fgx'))return;const id=m[1],sent=g.to.includes(id),full=g.to.length>=MAXS;
  const b=document.createElement('button');b.className='fgf fgx';b.disabled=sent||(full&&!sent);b.innerHTML='<img alt="" src="'+((typeof U!=='undefined'&&U.coin)||'')+'"><small>'+(sent?'Sent':'Gift')+'</small>';b.onclick=e=>{e.stopPropagation();window.__giftTo(id)};
  const fb=r.querySelector('.fbt');if(fb)r.insertBefore(b,fb);else r.appendChild(b);
  if(isAI(id)){const lso=r.querySelector('.lso');if(lso)lso.textContent='AI player'}});
 /* recent opponents */
 const ids=F.ids?F.ids():[],an=aiList().map(a=>a.n);const R=(Array.isArray(SV.recent)?SV.recent:[]).filter(x=>!(x.uid&&(ids.includes(x.uid)||x.uid===F.uid))&&!(!x.uid&&an.includes(x.n))).slice(0,3);let h='';
 if(R.length){h+='<div class="frh lst sgh">Recent opponents</div>'+R.map((x,i)=>{const k='r'+i;SG[k]=x.uid?{uid:x.uid}:{a:aiMake('r_'+x.n,x.n,x.h)};const pend=x.uid&&F.sentTo&&F.sentTo(x.uid);
   const ago=Math.max(1,Math.round((Date.now()-(x.t||0))/6e4)),when=ago<60?ago+' min ago':ago<1440?Math.round(ago/60)+' h ago':Math.round(ago/1440)+' d ago';
   return row(k,x,'Played '+when,pend?'<button class="opr jn" disabled>Sent</button>':'<button class="opr jn" onclick="__sgAdd(\''+k+'\')">＋ Add</button>')}).join('')}
 /* suggestions (2 friends or fewer) */
 const nf=(F.ids?F.ids().length:0)+aiList().length;
 if(nf<=2){loadSug();const fids=F.ids?F.ids():[];const S2=sug.filter(x=>!fids.includes(x.uid)).slice(0,3).map(x=>({k:'u'+x.uid,x})).concat(aiSug().map(a=>({k:'a'+a.id,x:a,a}))).slice(0,3);
  if(S2.length){h+='<div class="frh lst sgh">Suggested players</div>'+S2.map(o=>{SG[o.k]=o.a?{a:o.a}:{uid:o.x.uid};const pend=o.x.uid&&F.sentTo&&F.sentTo(o.x.uid);
   return row(o.k,o.x,o.a?'Lv '+o.x.lv+' · W-L '+o.x.w+'-'+o.x.l:'Played recently',pend?'<button class="opr jn" disabled>Sent</button>':'<button class="opr jn" onclick="__sgAdd(\''+o.k+'\')">＋ Add</button>')}).join('')}}
 if(h){const f0=lst.querySelector('.fr0');lst.insertAdjacentHTML('beforeend',h)}}
const _m=menu;menu=function(){const r=_m.apply(this,arguments);try{deco()}catch(e){console.log('social deco',e)}return r};
const css=document.createElement('style');css.textContent=`
#menu .gf3{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin:0 0 6px;padding:7px 10px;border-radius:12px;background:#2a1a0bcc;border:1.5px solid #8a6326;font:700 12.5px system-ui;color:#f3e2bf}
#menu .gf3 b{color:#ffe08a}
#menu .gf3 .gcl{height:30px;padding:0 12px;font-size:13px;animation:gcP 1.4s ease-in-out infinite}
@keyframes gcP{50%{transform:scale(1.06)}}
#menu .sgh{margin-top:10px}
#menu .fr3.sg3 .opr.jn{min-width:70px}
`;document.head.appendChild(css);
}catch(e){console.warn('v4 social',e)}})();
