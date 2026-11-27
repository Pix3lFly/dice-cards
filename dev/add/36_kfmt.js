/* short numbers in the top bar: 9999 · 12.2k · 108k · 1.25M */
window.__kf=n=>{n=+n||0;const a=Math.abs(n),t=(v,d)=>(+v.toFixed(d)).toString();if(a<1e4)return String(n);if(a<1e5)return t(n/1e3,1)+'k';if(a<1e6)return Math.floor(n/1e3)+'k';if(a<1e7)return t(n/1e6,2)+'M';return t(n/1e6,1)+'M'};
