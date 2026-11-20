/* v4: switch on V3's reward pop-ups (script v3_30: chest-opening reward window, "Skip the timer?" confirm,
   tap-to-claim daily login). It waits for a global `U`; the picture map only existed as window.__U. */
(function w(){if(!window.__U){setTimeout(w,200);return}if(typeof window.U==='undefined')window.U=window.__U})();
