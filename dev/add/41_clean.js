/* ===== v4 (27 Nov): no bad words in player names, guild names and guild messages ===== */
(function(){try{
 /* words blocked anywhere inside a word (unambiguous) */
 const T1=['fuck','fuk','fck','shit','bitch','cunt','pussy','whore','slut','nigger','nigga','niger','faggot','retard','asshole','arsehole','motherf','dildo','blowjob','handjob','porn','penis','vagina','wanker','twat','hitler','bastard','jizz','cocksuck','dickhead','bollock','clit','testicle','pedo','paedo','molest','isis','skank','bimbo','hentai','orgasm','masturb','ejacul','erection','nazi'];
 /* words blocked only as a whole word (they hide inside normal words: class, title, grape, peacock…) */
 const T2=['ass','asses','arse','cum','cumming','tit','tits','titty','titties','cock','cocks','dick','dicks','sex','sexy','sexx','anal','anus','fag','fags','rape','raped','rapist','nude','nudes','naked','boob','boobs','horny','kys','hoe','hoes','piss','prick','spunk','semen','thot','milf','xxx','kkk','gay','homo','lesbo','tranny','coon','chink','spic','kike','wetback','gook','damn','crap','bullshit','stfu','wtf','milf','incel','suicide','killyourself'];
 /* Egyptian / Arabic (Franco letters) */
 const F1=['kosom','ksom','kosomak','sharmot','sharmout','charmot','metnak','mtnak','mitnak','khawal','5awal','khwal','wes5a','weskha','wis5a','manyak','manyok','ma3ras','m3ras','a7a','zebby','zbi'];
 const F2=['kos','kus','zeb','zob','teez','tiz','ars','3ars','ibnwes5a','nik','neek'];
 /* Arabic script */
 const A1=['شرموط','شرموطه','متناك','منيوك','منيك','قحب','كسمك','كسامك','كس امك','ابن الوسخه','وسخه','عرص','معرص','لبوه','زبي','زبك','طيزك','نياك','لوطي','سكس','سافل'];
 const A2=['كس','زب','طيز','احا','خرا','زق','نيك','خول'];
 const LEET={'0':'o','1':'i','!':'i','|':'i','3':'e','4':'a','@':'a','5':'s','$':'s','7':'t','+':'t','8':'b','9':'g','6':'g','2':'z'};
 const sq=w=>w.replace(/(.)\1+/g,'$1');
 const T1s=T1.map(sq).filter(w=>w.length>=3);
 const arN=t=>t.replace(/[ً-ٰٟـ]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي');
 function bad(s){s=String(s||'');if(!s.trim())return false;
  const sp=s.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/([A-Za-z])([0-9])(?=[A-Za-z]{2})/g,'$1$2');
  const low=sp.toLowerCase();
  /* Franco Arabic: before leet so 3 / 5 / 7 stay letters */
  const fr=low.replace(/[^a-z0-9]+/g,' ').trim().split(' ');const frj=low.replace(/[^a-z0-9]/g,'');
  if(F1.some(w=>frj.includes(w))||fr.some(t=>F2.includes(t)))return true;
  /* Arabic script */
  const ar=arN(s);if(/[؀-ۿ]/.test(ar)){const at=ar.replace(/[^؀-ۿ ]+/g,' ').split(/\s+/).filter(Boolean);
   const aj=at.join(' '),an=at.join('');
   if(A1.some(w=>aj.includes(w)||an.includes(w.replace(/ /g,''))))return true;
   if(at.some(t=>A2.includes(t)||A2.includes(t.replace(/^(و|ف|يا|ال)/,''))))return true}
  /* English with leetspeak */
  const lt=(low+' '+s.toLowerCase()).replace(/[0-9!|@$+]/g,c=>LEET[c]||c);
  /* words: split on anything that's not a letter; join runs of single letters (f u c k / f.u.c.k) */
  let toks=lt.split(/[^a-z]+/).filter(Boolean),out=[],run='';
  toks.forEach(t=>{if(t.length===1)run+=t;else{if(run){out.push(run);run=''}out.push(t)}});if(run)out.push(run);
  for(const t of out){const q=sq(t);
   if(T1.some(w=>t.includes(w))||T1s.some(w=>q.includes(w)))return true;
   if(T2.includes(t)||T2.includes(q)||(t.endsWith('s')&&T2.includes(t.slice(0,-1))))return true}
  /* words split by dots, dashes, underscores inside one chunk: f-u-c-k, f_u_c_k */
  for(const c of lt.split(/\s+/)){const j=c.replace(/[^a-z]/g,'');if(j.length>=4&&/[^a-z]/.test(c)&&(T1.some(w=>j.includes(w))||T1s.some(w=>sq(j).includes(w))))return true}
  return false}
 window.__bad=bad;
 const MSG='Please keep it friendly — no bad words.';
 const val=id=>{const e=document.getElementById(id);return e?e.value:''};
 const note=t=>{try{const n=document.createElement('div');n.className='m3note';n.textContent=t;document.body.appendChild(n);setTimeout(()=>n.remove(),2200)}catch(e){}};
 const pfErr=t=>{let e=document.querySelector('#menu .pfp .pner');if(!e){const r=document.querySelector('#menu .pfp .pnr');if(!r)return note(t);r.insertAdjacentHTML('afterend','<div class="pner" style="font:700 11.5px system-ui;color:#ffb3a8;text-align:center;margin-top:-2px"></div>');e=document.querySelector('#menu .pfp .pner')}e.textContent=t};
 const G={__pfSave:()=>bad(val('pfnm'))&&(pfErr(MSG),1),
  guCreate:()=>bad(val('gun'))&&((document.getElementById('gum')||{}).textContent=MSG,1),
  guSave:()=>bad(val('gmsg'))&&(note(MSG),1),
  mlSend:()=>bad(val('mltx'))&&((document.getElementById('mlm')||{}).textContent=MSG,1)};
 /* keep the check on top even when other files replace these functions later */
 setInterval(()=>{for(const k in G){const f=window[k];if(typeof f!=='function'||f.__cl)continue;const w=function(){if(G[k]())return;return f.apply(this,arguments)};w.__cl=1;window[k]=w}},500);
}catch(e){console.warn('v4 clean',e)}})();
