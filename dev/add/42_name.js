/* ===== v4 (27 Nov): new players pick their username with Sparky before anything else ===== */
(function w(){if(typeof SV==='undefined'||!window.__MASC||typeof menu!=='function'){setTimeout(w,400);return}try{
 const M=window.__MASC,OK=/^[A-Za-z0-9_]{3,16}$/;
 const st=document.createElement('style');st.textContent=`
#nm4{position:fixed;inset:0;z-index:60;background:#0a0e24c4;display:flex;align-items:center;justify-content:center;padding:16px;animation:nm4f .3s ease-out both}
#nm4.pt{background:none;pointer-events:none}
@keyframes nm4f{from{opacity:0}}
#nm4 .nm4b{position:relative;width:min(340px,92vw);background:linear-gradient(#26305a,#161c3a);border:3px solid #e8b84e;border-radius:18px;padding:64px 16px 16px;color:#fff;font:500 14px/1.4 system-ui,sans-serif;text-align:center;box-shadow:0 0 0 2px #3a2208,0 10px 24px #000c;animation:nm4i .5s cubic-bezier(.3,1.4,.5,1) both;pointer-events:auto}
@keyframes nm4i{from{transform:translateY(40px) scale(.9);opacity:0}}
#nm4 .nm4b>img{position:absolute;left:50%;top:-66px;width:118px;transform:translateX(-50%);filter:drop-shadow(0 5px 5px #000a);animation:mscB 2.4s ease-in-out infinite}
#nm4 i{display:block;font:400 19px 'Lilita One',system-ui,sans-serif;font-style:normal;color:#ff9a3c;margin-bottom:4px}
#nm4 p{margin:0 0 12px}#nm4 p b{color:#ffd76a}
#nm4 input{width:100%;box-sizing:border-box;height:46px;border-radius:12px;border:2.5px solid #8a5f17;background:#fff8e6;color:#3a2006;font:400 20px 'Lilita One',system-ui,sans-serif;text-align:center;outline:none}
#nm4 input:focus{border-color:#f5c242;box-shadow:0 0 0 3px #f5c24255}
#nm4 small{display:block;margin:6px 0 0;color:#b8c0e0;font-size:12px}
#nm4 .er{min-height:17px;margin-top:6px;color:#ffb3a8;font-weight:700;font-size:12.5px}
#nm4 button{margin-top:8px;width:100%;height:46px;border-radius:12px;border:2px solid #7a4a0e;background:linear-gradient(#ffe9a6,#f5c242 50%,#d4901c);font:400 19px 'Lilita One',system-ui,sans-serif;color:#3a2006;box-shadow:inset 0 2px 0 #fff3c4,0 3px 0 #5a3608;cursor:pointer}
#nm4 button:active{transform:translateY(2px)}#nm4 button:disabled{filter:grayscale(.6) brightness(.8)}
#nm4 .ring{position:fixed;border-radius:50%;border:3px solid #ffd76a;box-shadow:0 0 0 4px #ffd76a55,0 0 18px #ffd76a;animation:nm4r 1.1s ease-in-out infinite;pointer-events:none}
@keyframes nm4r{50%{transform:scale(1.12);opacity:.7}}
#nm4 .arw{position:fixed;width:0;height:0;border:13px solid transparent;border-bottom:20px solid #ffd76a;border-top:0;filter:drop-shadow(0 0 2px #6a4208) drop-shadow(0 3px 3px #000a);animation:nm4a 1s ease-in-out infinite;pointer-events:none}
@keyframes nm4a{50%{transform:translate(-5px,-7px)}}`;document.head.appendChild(st);
 const ON=window.__ON,vis=id=>{const e=document.getElementById(id);return !!e&&e.style.display!=='none'&&getComputedStyle(e).display!=='none'};
 const offline=()=>!ON||ON.state==='none'||ON.state==='off';
 const fresh=()=>SV.nm4==null&&!SV.pname&&!(SV.played>0);
 const pending=()=>SV.nm4===1||(fresh()&&offline());
 let menuAt=0;
 /* also keeps the page guide, install popup and Sparky tips waiting */
 window.__nmHold=()=>{if(document.getElementById('nm4')||pending())return true;
  if(!fresh()||!ON||!menuAt||Date.now()-menuAt>15000)return false;
  return ON.state==='loading'||(ON.state==='ready'&&!!ON.user&&!(window.__FRON&&__FRON.prof))};
 const esc=t=>String(t).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
 function ask(){const o=document.createElement('div');o.id='nm4';
  o.innerHTML='<div class="nm4b"><img alt="" src="'+(M.cheer||M.hold)+'"><i>Hi, I’m Sparky!</i><p>Welcome to <b>Dice Cards</b>! Before we start, what should other players call you?</p><input id="nm4i" maxlength="16" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Your username"><small>3–16 letters, numbers or _</small><div class="er"></div><button>Confirm</button></div>';
  document.body.appendChild(o);const i=o.querySelector('input'),er=o.querySelector('.er'),b=o.querySelector('button');
  setTimeout(()=>{try{i.focus()}catch(e){}},500);
  i.oninput=()=>{er.textContent=''};i.onkeydown=e=>{if(e.key==='Enter')go()};b.onclick=go;
  async function go(){const v=i.value.trim();
   if(!OK.test(v)){er.textContent='Use 3–16 letters, numbers or _ (no spaces).';return}
   if(window.__bad&&__bad(v)){er.textContent='Please keep it friendly — no bad words.';return}
   b.disabled=true;b.textContent='Saving…';let r='';
   try{r=window.__FRON&&__FRON.rename&&!offline()?await __FRON.rename(v):(SV.pname=v,'')}catch(e){r='Something went wrong — try again.'}
   b.disabled=false;b.textContent='Confirm';if(r){er.textContent=r;return}
   SV.nm4=2;try{sv()}catch(e){}try{window.__sfx&&__sfx.up&&__sfx.up()}catch(e){}
   try{if(typeof tab!=='undefined'&&tab==='main')menu()}catch(e){}thanks(v)}}
 function thanks(v){const o=document.getElementById('nm4');if(!o)return;o.classList.add('pt');
  o.innerHTML='<div class="nm4b" style="margin-top:90px"><img alt="" src="'+(M.star||M.cheer||M.hold)+'"><i>Thanks, '+esc(v)+'!</i><p>Want to change your name or your profile picture later? Just tap your <b>profile picture</b> up here in the top left.</p><button>Got it!</button></div>';
  const pf=document.querySelector('#menu #mt .pf3');
  if(pf){const r=pf.getBoundingClientRect();if(r.width){const g=document.createElement('div');g.className='ring';Object.assign(g.style,{left:r.left-5+'px',top:r.top-5+'px',width:r.width+10+'px',height:r.height+10+'px'});o.appendChild(g);
   const a=document.createElement('div');a.className='arw';Object.assign(a.style,{left:r.left+r.width/2-13+'px',top:r.bottom+8+'px'});o.appendChild(a)}}
  o.querySelector('button').onclick=()=>o.remove()}
 setInterval(()=>{try{const m=vis('menu')&&!vis('splash');if(m&&!menuAt)menuAt=Date.now();
  if(!m||document.getElementById('nm4')||document.getElementById('acp')||!pending())return;
  if(window.__sp4Close)__sp4Close();const ins=document.getElementById('v4ins');if(ins)ins.remove();ask()}catch(e){}},600);
}catch(e){console.warn('v4 name pick',e)}})();
