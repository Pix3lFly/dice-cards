/* ===== v4 (27 Nov): Shop → Gold & Gems: ask before trading gems for gold ===== */
(function w(){if(typeof SV==='undefined'||typeof window.gx!=='function'||typeof U==='undefined'){setTimeout(w,500);return}try{
 const pop=html=>{const M=document.getElementById('menu');let p=M.querySelector('.mpop');if(p)p.remove();p=document.createElement('div');p.className='mpop spop';p.innerHTML='<div class="uc">'+html+'</div>';p.onclick=e=>{if(e.target===p)p.remove()};M.appendChild(p);return p};
 const kf=n=>window.__kf?__kf(n):n;
 const st=document.createElement('style');st.textContent=`
#menu .gxa{display:flex;align-items:center;justify-content:center;gap:10px;margin:8px 0 12px;font:400 22px 'Lilita One',system-ui,sans-serif;color:#fff}
#menu .gxa span{display:flex;align-items:center;gap:5px;padding:4px 12px;border-radius:12px;background:#00000040;border:1.5px solid #ffffff22}
#menu .gxa img{width:26px;height:26px;object-fit:contain}
#menu .gxa i{font-style:normal;color:#ffd76a;font-size:20px}`;document.head.appendChild(st);
 const orig=window.gx;
 window.gx=function(gems,gold){const a=arguments,t=this;if((SV.gems||0)<gems)return orig.apply(t,a);
  window.__gxGo=()=>{try{soClose()}catch(e){}orig.apply(t,a)};
  pop('<b class="st">Buy gold?</b><p>Are you sure you want to buy <b>'+kf(gold)+' gold</b> for <b>'+gems+' gems</b>?</p><div class="gxa"><span><img alt="" src="'+U.gem+'">'+gems+'</span><i>→</i><span><img alt="" src="'+U.coin+'">'+kf(gold)+'</span></div><div class="us2"><button class="opr rm" onclick="soClose()">Cancel</button><button class="opr" onclick="__gxGo()">Buy</button></div>')};
 try{gx=window.gx}catch(e){}
}catch(e){console.warn('v4 gold ask',e)}})();
