/* V4 early (right after the title screen is built): catch the browser's install prompt for 10_install.js. The title screen look itself is in <head> (H0_head.css). */
(function(){try{window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();window.__bip=e})}catch(e){}})();
