/* V4 server clock (in <head>, runs first): Date.now() follows the web server's clock, not the phone's.
   Changing the phone/PC clock no longer moves daily rewards, chests, shop refreshes or quests. */
(function(){try{
 const N0=Date.now.bind(Date),P0=()=>performance.now();let base=null;
 try{const c=JSON.parse(localStorage.getItem('dc_srvoff')||'null');if(c&&typeof c.o==='number')base={t:N0()+c.o,p:P0(),guess:1}}catch(e){}
 const sync=()=>{const u=location.href.split('#')[0].split('?')[0]+'?clk='+Math.random().toString(36).slice(2);const p0=P0();
  return fetch(u,{method:'HEAD',cache:'no-store'}).then(r=>{const d=r.headers.get('date');const t=d&&Date.parse(d);if(!t)return;const p1=P0();
   base={t:t+500,p:(p0+p1)/2};window.__srvOK=1;try{localStorage.setItem('dc_srvoff',JSON.stringify({o:base.t-N0()+ (P0()-base.p)}))}catch(e){}}).catch(()=>{})};
 Date.now=function(){return base?Math.round(base.t+(P0()-base.p)):N0()};
 window.__clockSync=sync;sync();setInterval(sync,10*60e3);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync()});
}catch(e){}})();
