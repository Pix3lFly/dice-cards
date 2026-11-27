/* V4: phone browser (not the installed app) → ask once whether to install the game */
(function(){try{
const H=location.hostname;if(/claude\.ai|claudeusercontent|anthropic/.test(H))return;
const sa=()=>matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches||navigator.standalone===true;
if(sa())return;
const ua=navigator.userAgent,ios=/iPhone|iPad|iPod/.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1),mob=ios||/Android|Mobile/.test(ua);
if(!mob)return;
const K='dc_ins_no';try{const t=+localStorage.getItem(K)||0;if(Date.now()-t<3*864e5)return}catch(e){}
const st=document.createElement('style');st.textContent=`
#v4ins{position:fixed;inset:0;z-index:5000;display:flex;align-items:center;justify-content:center;background:#000a;padding:18px;animation:v4inF .25s ease both}
@keyframes v4inF{from{opacity:0}}
#v4ins .ib{width:min(86vw,330px);box-sizing:border-box;text-align:center;padding:16px 16px 14px;border-radius:16px;background:linear-gradient(#8a5a33,#5a3a20);border:3px solid #f2c25a;box-shadow:0 0 0 2px #6b3f0a,inset 0 0 18px #0007,0 8px 24px #000a;color:#fff2d8;font:600 14px/1.4 system-ui,sans-serif;animation:v4inP .35s cubic-bezier(.2,1.4,.4,1) both}
@keyframes v4inP{from{transform:scale(.7);opacity:0}}
#v4ins img.ic{width:84px;height:84px;border-radius:20px;display:block;margin:-2px auto 6px;box-shadow:0 4px 10px #0009}
#v4ins .ittl{display:block;background:none;border:0;padding:0;font:400 22px 'Lilita One',system-ui,sans-serif;color:#ffe08a;text-shadow:0 2px 0 #4a2a08;margin-bottom:4px}
#v4ins p{margin:0 0 8px}
#v4ins ol{text-align:left;margin:6px 0 8px;padding:8px 10px 8px 28px;border-radius:10px;background:#1c120acc;border:1.5px solid #8a6326;font-size:13.5px}
#v4ins ol li{margin:3px 0}#v4ins ol b{color:#ffe08a}
#v4ins .ibt{display:flex;gap:10px;margin-top:10px}
#v4ins .ibt button{flex:1;height:42px;border-radius:12px;font:400 17px 'Lilita One',system-ui,sans-serif;cursor:pointer}
#v4ins .ibt .y{color:#3a2006;background:linear-gradient(#ffe38e,#e9ac2e 60%,#d08f1c);border:2px solid #8a5f17;box-shadow:inset 0 2px 0 #fff3c4,0 3px 0 #5a3608}
#v4ins .ibt .n{color:#fff2d8;background:linear-gradient(#a58a6a,#7a5f43);border:2px solid #4a3420;box-shadow:inset 0 2px 0 #c8b090,0 3px 0 #3a2410}
#v4ins .ibt button:active{transform:translateY(2px)}
`;document.head.appendChild(st);
const close=no=>{const o=document.getElementById('v4ins');if(o)o.remove();if(no)try{localStorage.setItem(K,String(Date.now()))}catch(e){}};
function show(){if(document.getElementById('v4ins')||sa())return;if(window.__nmHold&&__nmHold()||document.getElementById('nm4')){setTimeout(show,4000);return}const bip=window.__bip;
 const share='<svg width="15" height="17" viewBox="0 0 15 17" style="vertical-align:-3px"><path d="M7.5 1v10M3.5 5l4-4 4 4" stroke="#ffe08a" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.5 8H2v8h11V8h-2.5" stroke="#ffe08a" stroke-width="1.8" fill="none" stroke-linejoin="round"/></svg>';
 const steps=bip?'':ios?'<ol><li>Tap the <b>Share</b> button '+share+' in the browser bar</li><li>Pick <b>Add to Home Screen</b></li><li>Tap <b>Add</b></li></ol>':'<ol><li>Open the browser <b>menu</b> (<b>⋮</b> or <b>☰</b>)</li><li>Pick <b>Install app</b> or <b>Add to Home screen</b></li></ol>';
 const o=document.createElement('div');o.id='v4ins';o.innerHTML='<div class="ib"><img class="ic" alt="" src="icons/icon-192.png"><div class="ittl">Install Dice Cards?</div><p>Add the game to your phone’s home screen. It opens full screen, like a normal app.</p>'+steps+'<div class="ibt"><button class="n">Not now</button><button class="y">'+(bip?'Install':'OK')+'</button></div></div>';
 document.body.appendChild(o);
 o.querySelector('.n').onclick=()=>close(1);
 o.querySelector('.y').onclick=async()=>{if(!bip){close(1);return}close(0);try{bip.prompt();const c=await bip.userChoice;window.__bip=null;if(!c||c.outcome!=='accepted')try{localStorage.setItem(K,String(Date.now()))}catch(e){}}catch(e){console.log('install',e)}}}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();window.__bip=e});
window.addEventListener('appinstalled',()=>close(0));
window.__v4install=show;
setTimeout(show,window.__bip?1200:3500);
}catch(e){console.log('v4 install',e)}})();
