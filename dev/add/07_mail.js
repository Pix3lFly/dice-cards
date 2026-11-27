/* V4: open mail + reply, real mail between friends (mail/{to}/in/{id}), profile buttons (Add friend / Send mail) */
(function(){try{
const F=()=>window.__FRON||{},ON=()=>!!F().on,UID=()=>F().uid,D=()=>window.__ON&&window.__ON.db;
const esc=t=>String(t==null?'':t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pop=html=>{const M=document.getElementById('menu');let p=M.querySelector('.mpop');if(p)p.remove();p=document.createElement('div');p.className='mpop spop';p.innerHTML='<div class="uc">'+html+'</div>';p.onclick=e=>{if(e.target===p)p.remove()};M.appendChild(p);return p};
const shut=()=>{const p=document.querySelector('#menu .mpop');if(p)p.remove()};
const note=t=>{try{const n=document.createElement('div');n.className='m3note';n.textContent=t;document.body.appendChild(n);setTimeout(()=>n.remove(),1800)}catch(e){}};
const POR=()=>window.__POR||{};
const ago=ms=>{if(!ms)return '';const s=(Date.now()-ms)/1e3;if(s<60)return 'just now';if(s<3600)return Math.floor(s/60)+' min ago';if(s<86400)return Math.floor(s/3600)+' h ago';
 const d=new Date(ms);return d.getDate()+' '+['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()]};
const inMail=()=>{try{return tab==='comm'&&CMT==='ml'}catch(e){return false}};
const redraw=()=>{try{if(inMail()&&!document.querySelector('#menu .mpop'))menu()}catch(e){}};

/* ---------- real mail from friends ---------- */
let RM=[],unsub=null,who=null;
const ts=d=>{const t=d.t;if(t&&t.toMillis)return t.toMillis();if(typeof t==='number')return t;return +d.c||Date.now()};
function listen(){const u=ON()?UID():null;if(u===who)return;who=u;if(unsub){try{unsub()}catch(e){}unsub=null}RM=[];
 if(!u||!D())return;
 unsub=D().collection('mail').doc(u).collection('in').onSnapshot(q=>{
  RM=q.docs.map(x=>{const d=x.data()||{};return {id:'u_'+x.id,doc:x.id,from:String(d.from||''),f:String(d.fromName||'Player').slice(0,16),h:d.fromH,t:String(d.text||'').slice(0,200),ts:ts(d),read:!!d.read,real:1}}).sort((a,b)=>b.ts-a.ts);
  /* keep the 40 newest */
  RM.slice(40).forEach(m=>{try{D().collection('mail').doc(u).collection('in').doc(m.doc).delete()}catch(e){}});RM=RM.slice(0,40);
  redraw()},e=>console.log('mail',e&&e.code))}
setInterval(listen,1000);window.addEventListener('dc-auth',()=>setTimeout(listen,50));

const sysMail=()=>{try{mailInit()}catch(e){}return SV.mail||[]};
const all=()=>RM.concat(sysMail());
const find=id=>all().find(m=>m.id===id);
const hasR=m=>!!(m.r&&((m.r.gold||0)+(m.r.gems||0)));
const isNew=m=>m.real?!m.read:(hasR(m)&&!m.c);
window.__mailNew=()=>all().filter(isNew).length;

/* ---------- the Mail page ---------- */
const mailUI=function(PC4){const L=all().map((m,i)=>[m,i]).sort((a,b)=>((!hasR(b[0])&&isNew(b[0]))-(!hasR(a[0])&&isNew(a[0])))||a[1]-b[1]).map(x=>x[0]),un=L.filter(isNew).length,uc=sysMail().filter(m=>hasR(m)&&!m.c).length;
 const row=m=>{const rw=hasR(m)?'<span class="rwd">'+(m.r.gold?'<img alt="" src="'+U.coin+'">'+m.r.gold:'')+(m.r.gems?' <img alt="" src="'+U.gem+'">'+m.r.gems:'')+'</span>':'';
  const pic=m.real&&POR()[m.h]?'<div class="fp mlp"><img alt="" src="'+POR()[m.h]+'"></div>':'<img class="mic" alt="" src="'+U.m_mail+'">';
  const right=hasR(m)?(m.c?'<em class="cl">✓ Claimed</em>':'<button class="opr jn" onclick="event.stopPropagation();mlClaim(\''+m.id+'\')">Claim</button>'):(isNew(m)?'<em class="mnew">New</em>':'<em class="cl mopn">Open</em>');
  return '<div class="fr3 mrow '+(isNew(m)?'':'lk')+'" onclick="mlOpen(\''+m.id+'\')">'+pic+'<div class="ff"><b>'+esc(m.f)+'</b><span class="wr">'+esc(m.t.length>60?m.t.slice(0,58)+'…':m.t)+'</span>'+rw+'</div>'+right+'</div>'};
 return '<div class="spn2">'+PC4+'<div class="shd"><div class="spl">Mail'+(un?' · '+un+' new':'')+'</div></div><div class="flst top"><div class="frtop"><button class="opr addf" onclick="mlSendPop()">✉ Send mail</button></div><div class="frh lst">Received</div>'+(L.length?L.map(row).join(''):'<div class="dnt">No mail yet.</div>')+'</div>'+(uc>1?'<button class="opr all" onclick="mclaim()">Claim all ('+uc+')</button>':(!uc&&sysMail().some(m=>hasR(m)&&m.c))?'<button class="opr all" onclick="mlDelGifts()">Delete all gift mails</button>':'')+'</div>'};

/* the base page code can't be swapped (block-scoped), so redraw the Mail panel after each menu() */
const _m=menu;menu=function(){const r=_m.apply(this,arguments);try{if(inMail()){const sp=document.querySelector('#mb .spn2');if(sp&&sp.querySelector('.flst')){const kp=sp.querySelector('.flst').scrollTop;sp.outerHTML=mailUI([...sp.querySelectorAll(':scope > .pc')].map(e=>e.outerHTML).join(''));const nl=document.querySelector('#mb .flst');if(nl&&kp)nl.scrollTop=kp}}}catch(e){console.log('mail ui',e)}return r};
/* ---------- open a message ---------- */
window.mlOpen=function(id){const m=find(id);if(!m)return;
 if(m.real&&!m.read){m.read=true;try{D().collection('mail').doc(UID()).collection('in').doc(m.doc).update({read:true}).catch(e=>console.log('mail read',e&&e.code))}catch(e){}}
 const fr=m.real&&ON()&&(F().ids?F().ids():[]).includes(m.from),sys=!m.real;
 const pic=m.real&&POR()[m.h]?'<img alt="" src="'+POR()[m.h]+'">':'<img alt="" src="'+U.m_mail+'" style="border-radius:0;background:none;border:0">';
 const rw=hasR(m)?'<div class="mlr"><span class="rwd">'+(m.r.gold?'<img alt="" src="'+U.coin+'">'+m.r.gold:'')+(m.r.gems?' <img alt="" src="'+U.gem+'">'+m.r.gems:'')+'</span>'+(m.c?'<em class="cl">✓ Claimed</em>':'<button class="opr jn" onclick="mlClaim(\''+m.id+'\',1)">Claim</button>')+'</div>':'';
 const why=sys?'<div class="mlw">This is a game message — you can’t reply.</div>':(!fr?'<div class="mlw">You can only reply to friends.</div>':'');
 pop('<div class="mlv"><b class="st">Mail</b><div class="mlh'+(m.real?' tp':'')+'"'+(m.real?' onclick="mlWho(\''+m.id+'\')"':'')+'><span class="mla">'+pic+'</span><span class="mln"><b>'+esc(m.f)+'</b><small>'+(sys?'Game message':ago(m.ts))+'</small></span></div>'+
  '<div class="mlt">'+esc(m.t)+'</div>'+rw+why+((m.real||!hasR(m)||m.c)?'<button class="mldl" onclick="mlDel(\''+m.id+'\')">🗑 Delete mail</button>':'')+
  '<div class="us2"><button class="opr" '+(fr?'onclick="mlReply(\''+m.id+'\')"':'disabled')+'>↩ Reply</button><button class="opr rm" onclick="soClose()">Close</button></div></div>');
 try{const row=[...document.querySelectorAll('#menu .mrow')].find(r=>(r.getAttribute('onclick')||'').includes("'"+id+"'"));const e=row&&row.querySelector('.mnew');if(e){e.className='cl mopn';e.textContent='Open';row.classList.add('lk')}}catch(e){}};
window.mlDel=function(id){const m=find(id);if(!m)return;
 if(m.real){RM=RM.filter(x=>x.id!==id);try{D().collection('mail').doc(UID()).collection('in').doc(m.doc).delete().catch(e=>console.log('mail del',e&&e.code))}catch(e){}}
 else{if(hasR(m)&&!m.c)return;SV.mail=(SV.mail||[]).filter(x=>x.id!==id);try{sv()}catch(e){}}
 shut();note('Mail deleted');try{menu()}catch(e){}};
window.mlClaim=function(id,reopen){const m=find(id);if(!m||m.real||m.c)return;try{mclaim(id)}catch(e){}try{snd(880,.08,'triangle')}catch(e){}if(reopen)mlOpen(id)};
window.mlDelGifts=function(){SV.mail=(SV.mail||[]).filter(m=>!(hasR(m)&&m.c));try{sv()}catch(e){}try{snd(520,.06,'triangle')}catch(e){}try{menu()}catch(e){}};
window.mlReply=function(id){const m=find(id);if(!m)return;shut();mlSendPop(m.from,'')};
window.mlWho=function(id){const m=find(id);if(!m||!m.real)return;showUid(m.from,m.f,m.h)};

/* ---------- compose: preselect a friend, send through Firestore when online ---------- */
const _sp=window.mlSendPop;
window.mlSendPop=function(to){const r=_sp.apply(this,arguments);try{if(to){const s=document.getElementById('mlto');if(s&&[...s.options].some(o=>o.value===to))s.value=to;const t=document.getElementById('mltx');if(t)setTimeout(()=>{try{t.focus()}catch(e){}},50)}}catch(e){}return r};
const _send=window.mlSend;let sending=false;
window.mlSend=async function(){if(!ON())return _send&&_send.apply(this,arguments);if(sending)return;
 const to=document.getElementById('mlto'),tx=document.getElementById('mltx'),m=document.getElementById('mlm'),say=t=>{if(m)m.textContent=t};
 const id=to&&to.value,t=(tx&&tx.value||'').trim(),fr=(window.__friends?window.__friends():[]).find(x=>x.id===id);
 if(!fr){say('Pick a friend.');return}if(!t){say('Write a message first.');return}
 const P=F().prof||{},u=UID(),mid=Date.now().toString(36)+Math.random().toString(36).slice(2,8);
 sending=true;say('Sending…');const b=document.querySelector('#menu .mpop .us2 .opr:not(.rm)');if(b)b.disabled=true;
 try{await D().collection('mail').doc(id).collection('in').doc(u+'_'+mid).set({from:u,fromName:P.name||'Player',fromH:F().okH?F().okH(SV.pav||SV.mine):'k',text:t.slice(0,200),t:firebase.firestore.FieldValue.serverTimestamp(),c:Date.now(),read:false});
  SV.sent=SV.sent||[];SV.sent.push({to:fr.n,t:t,at:Date.now()});SV.sent=SV.sent.slice(-30);try{sv()}catch(e){}
  shut();note('Mail sent to '+fr.n);try{snd(660,.08,'triangle')}catch(e){}}
 catch(e){console.log('mail send',e&&e.code);say(e&&e.code==='unavailable'?'No internet connection.':e&&e.code==='permission-denied'?'You can only send mail to friends.':'Something went wrong — try again.')}
 finally{sending=false;if(b)b.disabled=false}};

/* ---------- other players' profiles: Add friend / Send mail ---------- */
window.__pfUid=(u,n,h)=>showUid(u,n,h);
async function showUid(u,n,h){if(!u)return;if(u===UID())return;
 const ids=F().ids?F().ids():[];if(ids.includes(u)){const f=F().fobj(u);return window.__pfShow({id:u,n:f.n,h:f.h,rk:f.rk,w:f.w,l:f.l,g:f.g,lv:f.lv,uid:u})}
 let p={};try{const s=await D().collection('profiles').doc(u).get();if(s.exists)p=s.data()||{}}catch(e){console.log('mail who',e&&e.code)}
 window.__pfShow({id:u,uid:u,n:p.name||n||'Player',h:(F().okH?F().okH(p.h||h):h)||'k',rk:p.rk||'Bronze',w:+p.w||0,l:+p.l||0,g:p.g||'No guild',lv:+p.lv||1})}
const _pf=window.__pfShow;
if(_pf)window.__pfShow=function(o){const r=_pf.apply(this,arguments);try{addBtn(o||{})}catch(e){console.log('pf btn',e)}return r};
function addBtn(o){if(!ON())return;const box=document.querySelector('#menu .mpop .pfp .us2');if(!box||box.querySelector('.pfa'))return;
 const ids=F().ids?F().ids():[],req=(SV.frReq||[]).find(x=>x.id===o.id&&x.r);let html='';
 if(ids.includes(o.id))html='<button class="opr pfa" onclick="soClose();mlSendPop(\''+o.id+'\')">✉ Send mail</button>';
 else if(req)html='<button class="opr pfa" onclick="soClose();frAcc(\''+o.id+'\',1)">＋ Add friend</button>';
 else if(o.uid&&o.uid!==UID())html=F().sentTo&&F().sentTo(o.uid)?'<button class="opr pfa" disabled>Request sent</button>':'<button class="opr pfa" onclick="__pfAdd(this,\''+o.uid+'\')">＋ Add friend</button>';
 if(html)box.insertAdjacentHTML('afterbegin',html)}
window.__pfAdd=async function(b,u){if(b)b.disabled=true;const ok=F().reqTo?await F().reqTo(u):false;if(b){b.textContent=ok?'Request sent':'＋ Add friend';b.disabled=!!ok}};
}catch(e){console.warn('v4 mail',e)}})();
