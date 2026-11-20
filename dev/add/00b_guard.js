/* v4: keep the 3D board alive — if one animation frame throws, report the real message and keep the loop going */
(function(){try{
 const raf=window.requestAnimationFrame.bind(window),seen={},tries=new WeakMap();let inCb=0,asked=0;
 window.requestAnimationFrame=function(cb){if(typeof cb!=='function')return raf(cb);
  return raf(function(t){const was=asked;asked=0;inCb++;
   try{cb(t);tries.delete(cb)}catch(e){const m=String(e&&e.message||e).slice(0,140);
    if(!seen[m]){seen[m]=1;try{console.warn('3D frame: '+m+' | '+String(e&&e.stack||'').split('\n').slice(0,3).join(' / ').slice(0,260))}catch(x){}}
    const n=(tries.get(cb)||0)+1;tries.set(cb,n);if(!asked&&n<600)window.requestAnimationFrame(cb)}
   finally{inCb--;asked=was}})};
 const _r=window.requestAnimationFrame;window.requestAnimationFrame=function(cb){asked=1;return _r(cb)};
}catch(e){console.log('v4 guard',e)}})();
