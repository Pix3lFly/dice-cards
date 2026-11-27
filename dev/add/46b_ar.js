/* ===== v4 (27 Nov): Arabic language option — Settings → Language. Text on screen is swapped for Arabic as it appears. ===== */
(function w(){if(typeof SV==='undefined'||!window.__ARD||!document.body){setTimeout(w,200);return}try{
 const D=window.__ARD;
 const NM={'Sir Aldric':'السير ألدريك','Count Vlad':'الكونت فلاد','Lady Wisp':'الليدي ويسب','Ignis':'إغنيس','Frostine':'فروستين','Sylva':'سيلفا'};
 const MON={Jan:'يناير',Feb:'فبراير',Mar:'مارس',Apr:'أبريل',May:'مايو',Jun:'يونيو',Jul:'يوليو',Aug:'أغسطس',Sep:'سبتمبر',Oct:'أكتوبر',Nov:'نوفمبر',Dec:'ديسمبر'};
 const nm=n=>NM[n]||n;
 /* a card or word from the dictionary, or as it is */
 const w1=t=>{const k=norm(t);if(D[k]){const ns=t.match(/\d+([.,]\d+)?/g)||[];let i=0;return D[k].replace(/#/g,()=>ns[i++]!=null?ns[i-1]:'#')}return nm(t)};
 /* sentences with a player's name or other changing words */
 const PAT=[
  [/^(.+) goes first!$/,m=>nm(m[1])+' يبدأ أولًا!'],
  [/^🛡️ (.+) goes first!$/,m=>'🛡️ '+nm(m[1])+' يبدأ أولًا!'],
  [/^(.+) won the roll-off and starts$/,m=>nm(m[1])+' فاز برمية البداية ويبدأ'],
  [/^You beat (.+)!$/,m=>'لقد هزمت '+nm(m[1])+'!'],
  [/^(.+) beat you!$/,m=>nm(m[1])+' هزمك!'],
  [/^(.+) plays (.+) → moves (\d+)$/,m=>nm(m[1])+' يلعب '+w1(m[2])+' ← يتحرك '+m[3]],
  [/^(.+) uses (.+)!$/,m=>nm(m[1])+' يستخدم '+w1(m[2])+'!'],
  [/^(.+) strikes!$/,m=>nm(m[1])+' يضرب!'],
  [/^(.+) takes (\d+) \((.+)\)$/,m=>nm(m[1])+' يتلقى '+m[2]+' ('+w1(m[3])+')'],
  [/^🏹 (.+) is entangled$/,m=>'🏹 '+nm(m[1])+' مُقيَّد'],
  [/^🌀 (.+) steps through the portal!$/,m=>'🌀 '+nm(m[1])+' يعبر البوابة!'],
  [/^(.+) buys a card$/,m=>nm(m[1])+' يشتري بطاقة'],
  [/^(.+) buys (\d+) cards? at the shop$/,m=>nm(m[1])+' يشتري '+m[2]+' بطاقة من المتجر'],
  [/^(.+) browses the shop$/,m=>nm(m[1])+' يتصفح المتجر'],
  [/^(.+) is too poor to shop$/,m=>nm(m[1])+' لا يملك ذهبًا كافيًا للتسوق'],
  [/^(.+) finds a free card$/,m=>nm(m[1])+' يجد بطاقة مجانية'],
  [/^(.+) is (JAILED|jailed)!?$/,m=>nm(m[1])+' في السجن!'],
  [/^(.+) is thrown into jail!$/,m=>nm(m[1])+' أُلقي في السجن!'],
  [/^(.+) is frozen!$/,m=>nm(m[1])+' مجمَّد!'],
  [/^(.+) is stunned!$/,m=>nm(m[1])+' مصعوق!'],
  [/^(.+) is terrified and hits themselves!$/,m=>nm(m[1])+' مرعوب ويضرب نفسه!'],
  [/^(.+) levels up! AP (.+)$/,m=>nm(m[1])+' يرتقي! الهجوم '+m[2]],
  [/^(.+) escapes jail with (.+)$/,m=>nm(m[1])+' يهرب من السجن بـ '+w1(m[2])],
  [/^(.+) fails to escape with (.+)$/,m=>nm(m[1])+' يفشل في الهروب بـ '+w1(m[2])],
  [/^(.+)'s shield absorbs the hit!$/,m=>'درع '+nm(m[1])+' يمتص الضربة!'],
  [/^\+(\d+) 🪙, \+(\d+) (.+) shards?$/,m=>'+'+m[1]+' 🪙، +'+m[2]+' شظية '+w1(m[3])],
  [/^\+(\d+) 🪙 for playing$/,m=>'+'+m[1]+' 🪙 مقابل اللعب'],
  [/^Report (.+)$/,m=>'الإبلاغ عن '+m[1]],
  [/^Block (.+)\?$/,m=>'حظر '+m[1]+'؟'],
  [/^(.+) is blocked$/,m=>m[1]+' محظور'],
  [/^(.+) is unblocked$/,m=>'تم إلغاء حظر '+m[1]],
  [/^Blocked players \((\d+)\)$/,m=>'اللاعبون المحظورون ('+m[1]+')'],
  [/^Thanks, (.+)!$/,m=>'شكرًا يا '+m[1]+'!'],
  [/^(.+) skins$/,m=>'أزياء '+nm(m[1])],
  [/^(.+) vs (.+) · (Casual|Ranked) battle$/,m=>nm(m[1])+' ضد '+nm(m[2])+' · '+(m[3]==='Casual'?'معركة ودية':'معركة مصنفة')],
  [/^(.+) · Lv(\d+)(.*)$/,m=>nm(m[1])+' · مستوى '+m[2]+m[3]],
  [/^Last online: (\d+) (\w{3}), (.+)$/,m=>'آخر ظهور: '+m[1]+' '+(MON[m[2]]||m[2])+'، '+m[3]],
  [/^Mail sent to (.+)$/,m=>'تم إرسال الرسالة إلى '+m[1]],
  [/^Friend request sent to (.+)$/,m=>'تم إرسال طلب صداقة إلى '+m[1]],
  [/^Join request sent to (.+)$/,m=>'تم إرسال طلب انضمام إلى '+m[1]],
  [/^(.+) is now your friend$/,m=>m[1]+' أصبح صديقك'],
  [/^(.+) is already your friend\.$/,m=>m[1]+' صديقك بالفعل.'],
  [/^(.+) joined your guild$/,m=>m[1]+' انضم إلى عشيرتك'],
  [/^(.+) declined your request$/,m=>m[1]+' رفض طلبك'],
  [/^(.+) sent you a gift! 🎁$/,m=>m[1]+' أرسل لك هدية! 🎁'],
  [/^⏳ Waiting for (.+)… (\d+)s$/,m=>'⏳ بانتظار '+m[1]+'… '+m[2]+'ث'],
  [/^📶 Connection lost — reconnecting… (\d+)s$/,m=>'📶 انقطع الاتصال — جارٍ إعادة الاتصال… '+m[1]+'ث'],
  [/^(.+) gave up — you win! 🏆$/,m=>m[1]+' استسلم — لقد فزت! 🏆'],
  [/^(.+) left the match — you win! 🏆$/,m=>m[1]+' غادر المباراة — لقد فزت! 🏆'],
  [/^Your gold: 🪙 (\d+) · hand (\d+)\/(\d+)$/,m=>'ذهبك: 🪙 '+m[1]+' · اليد '+m[2]+'/'+m[3]],
  [/^⏱ Time is up! Missed turns: (\d+)\/(\d+)$/,m=>'⏱ انتهى الوقت! الأدوار الفائتة: '+m[1]+'/'+m[2]],
  [/^⚠️ Missed turns: (\d+)\/(\d+) · forfeit at (\d+)$/,m=>'⚠️ الأدوار الفائتة: '+m[1]+'/'+m[2]+' · انسحاب عند '+m[3]],
  [/^(.+) wants to battle you!$/,m=>m[1]+' يريد تحديك!'],
  [/^(.+) is offline\.$/,m=>m[1]+' غير متصل.'],
  [/^(.+) is already in a game\. Try again later!$/,m=>m[1]+' في مباراة الآن. حاول لاحقًا!'],
  [/^No response from (.+)\. Try again later!$/,m=>'لا رد من '+m[1]+'. حاول لاحقًا!'],
  [/^(.+) won the roll!$/,m=>nm(m[1])+' فاز بالرمية!'],
  [/^You rolled (\d+)$/,m=>'رميت '+m[1]],
  [/^Monster defeated! \+(\d+) Gold, \+(.+)$/,m=>'هُزم الوحش! +'+m[1]+' ذهب، +'+w1(m[2])],
  [/^Monster won fight! -(.+)$/,m=>'الوحش فاز! -'+m[1]],
  [/^Burning tile! -(.+)$/,m=>'خانة مشتعلة! -'+m[1]],
  [/^Chest opened: \+(.+)$/,m=>'تم فتح الصندوق: +'+m[1]],
  [/^Quest done! \+(.+)$/,m=>'تمت المهمة! +'+m[1]],
  [/^You buy (.+)$/,m=>'اشتريت '+w1(m[1])],
  [/^You sell (.+)$/,m=>'بعت '+w1(m[1])],
  [/^You use (.+)$/,m=>'استخدمت '+w1(m[1])],
  [/^Enemy uses (.+)$/,m=>'الخصم يستخدم '+w1(m[1])],
  [/^(\d+)W · (\d+)L$/,m=>m[1]+' فوز · '+m[2]+' خسارة'],
  [/^Win (\d+) games? with this hero to unlock it$/,m=>'اربح '+m[1]+' مباريات بهذا البطل لفتحه']];
 const norm=h=>h.replace(/<(\/?)(b|i|em|strong|u|br)\b[^>]*>/gi,(m,a,t)=>'<'+a+t.toLowerCase()+'>').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim().replace(/\d+([.,]\d+)?/g,'#');
 const RL=t=>/[\u0600-\u06FF]/.test(t)?'\u200F'+t+'\u200F':t;
 const fill=(v,src)=>{const ns=src.match(/\d+([.,]\d+)?/g)||[];let i=0;return RL(v.replace(/#/g,()=>i<ns.length?ns[i++]:'#'))};
 const MISS=new Set();
 function trText(t){const k=norm(t);if(!k||!/[A-Za-z]{2}/.test(k))return null;if(D[k])return fill(D[k],t);if(MISS.has(k))return null;
  const raw=t.replace(/\s+/g,' ').trim();for(const [re,f] of PAT){const m=raw.match(re);if(m){try{return RL(f(m))}catch(e){}}}
  if(NM[raw])return RL(NM[raw]);
  if(MISS.size<5000)MISS.add(k);return null}
 const INL=/^(B|I|EM|STRONG|U|BR)$/,SKIP=/^(SCRIPT|STYLE|TEXTAREA|INPUT|CANVAS|svg|path)$/i;
 const skipEl=e=>e.closest&&e.closest('#ownp,.notr,[contenteditable]');
 function el(e){if(!e||e.nodeType!==1||SKIP.test(e.tagName)||skipEl(e))return;
  if(e.placeholder&&!e.__arp){const r=trText(e.placeholder);if(r){e.placeholder=r;e.__arp=1}}
  const ch=e.childNodes;let hasT=false,allInl=true,hasEl=false;
  for(const n of ch){if(n.nodeType===3){if(n.textContent.trim())hasT=true}else if(n.nodeType===1){if(!INL.test(n.tagName)||[...n.childNodes].some(m=>m.nodeType!==3)){allInl=false}else if(n.tagName!=='BR')hasEl=true}}
  if(hasT&&allInl&&hasEl){const h=e.innerHTML.replace(/<(\/?)(b|i|em|strong|u|br)\b[^>]*>/gi,(m,a,t)=>'<'+a+t.toLowerCase()+'>');const k=norm(h);
   if(D[k]){e.innerHTML=fill(D[k],h);return}}
  for(const n of [...ch]){if(n.nodeType===3){const t=n.textContent;if(!t.trim())continue;const r=trText(t);if(r!=null&&r!==t.trim()){const a=t.match(/^\s*/)[0],b=t.match(/\s*$/)[0];n.textContent=a+r+b}}
   else if(n.nodeType===1)el(n)}}
 const on=()=>SV.lang==='ar';
 let obs=null;
 function start(){document.documentElement.classList.add('ar4');document.documentElement.lang='ar';
  if(!document.getElementById('ar4css')){const st=document.createElement('style');st.id='ar4css';st.textContent=`html.ar4 body *{letter-spacing:0!important}html.ar4 #nm4 input{direction:ltr}
html.ar4 #log::before{content:'\\1F4DC  سجل الأدوار \\00B7  اضغط للتصغير'!important}
html.ar4 #hand .c.csel::after{content:'اضغط مرة أخرى للعب'!important}html.ar4 #v3tq::after{content:'الدرس التعليمي؟'!important}
html.ar4 .dt.claim::after{content:'اضغط للاستلام'!important}html.ar4 .s3 .arow .opr::before{content:'استلام'!important}`;document.head.appendChild(st)}
  el(document.body);if(obs)return;
  obs=new MutationObserver(ms=>{for(const m of ms){if(m.type==='characterData'){const p=m.target.parentElement;if(p){const t=m.target.textContent;if(t.trim()){const r=trText(t);if(r!=null&&r!==t.trim())m.target.textContent=r}}}
   else m.addedNodes.forEach(n=>{if(n.nodeType===1)el(n);else if(n.nodeType===3&&n.parentElement)el(n.parentElement)})}});
  obs.observe(document.body,{childList:true,subtree:true,characterData:true})}
 window.__setLang=v=>{SV.lang=v==='ar'?'ar':'en';try{sv()}catch(e){try{localStorage.setItem('dc7',JSON.stringify(SV))}catch(x){}}
  if(SV.lang==='ar')start();else setTimeout(()=>location.reload(),150)};
 window.__trAR=trText;
 if(on())start();
}catch(e){console.warn('v4 arabic',e)}})();
