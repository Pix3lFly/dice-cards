/* ===== v4 (27 Nov): sound pass — a sound for each tile when a hero lands on it, and a fuller victory / defeat fanfare ===== */
(function w(){if(typeof snd!=='function'||!window.__sfx||typeof SV==='undefined'){setTimeout(w,400);return}try{
 const ctx=()=>{try{if(!AC)AC=new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();return AC}catch(e){return null}};
 const vol=()=>{try{return (SV.vol==null?1:SV.vol)*(SV.set&&SV.set.sfx!=null?SV.set.sfx:1)}catch(e){return 1}};
 /* tone with pitch slide */
 const tone=(f0,f1,d,ty,v,at)=>{const c=ctx();if(!c||!vol())return;const t=c.currentTime+(at||0),o=c.createOscillator(),g=c.createGain();o.type=ty||'sine';o.frequency.setValueAtTime(f0,t);if(f1&&f1!==f0)o.frequency.exponentialRampToValueAtTime(f1,t+d);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime((v||.15)*vol(),t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+d+.05)};
 /* filtered noise burst */
 const noise=(d,fq,q,v,at,type)=>{const c=ctx();if(!c||!vol())return;const t=c.currentTime+(at||0),n=Math.floor(c.sampleRate*d),b=c.createBuffer(1,n,c.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*(1-i/n);
  const s=c.createBufferSource();s.buffer=b;const f=c.createBiquadFilter();f.type=type||'bandpass';f.frequency.value=fq;f.Q.value=q||1;const g=c.createGain();g.gain.value=(v||.2)*vol();s.connect(f);f.connect(g);g.connect(c.destination);s.start(t)};
 const TS={
  atk:()=>{noise(.18,3200,2,.22);tone(1800,900,.12,'square',.05);tone(140,70,.18,'sine',.25,.02)},
  heal:()=>{[660,880,1175,1568].forEach((f,k)=>tone(f,f*1.01,.22,'triangle',.09,k*.06))},
  gold:()=>{tone(1975,1975,.09,'square',.06);tone(2637,2637,.22,'square',.06,.08)},
  trap:()=>{noise(.08,1800,3,.3);tone(220,60,.25,'sawtooth',.12,.02)},
  mon:()=>{tone(110,70,.5,'sawtooth',.12);noise(.4,300,1,.12)},
  book:()=>{[523,659,784,1047,1319].forEach((f,k)=>tone(f,f*1.02,.3,'sine',.07,k*.05));noise(.35,6000,1,.05,0,'highpass')},
  shop:()=>{tone(1568,1568,.35,'triangle',.1);tone(2093,2093,.4,'triangle',.08,.12)},
  portal:()=>{tone(200,1400,.45,'sine',.1);noise(.45,900,.7,.12)},
  free:()=>{noise(.06,4000,1.5,.15);tone(880,1320,.12,'triangle',.08,.04)},
  base:()=>{[523,659,784].forEach((f,k)=>tone(f,f,.25,'triangle',.09,k*.08))},
  empty:()=>{tone(180,150,.08,'sine',.07)}};
 window.__tileSnd=TS;
 /* play the sound of the tile a hero has just arrived on */
 const last=[null,null];let g0=null;
 setInterval(()=>{try{if(typeof P==='undefined'||!P||!P[0]||typeof T==='undefined'||!T)return;if(g0!==gid){g0=gid;last[0]=P[0].pos;last[1]=P[1].pos;return}
  [0,1].forEach(k=>{const p=P[k];if(!p||p.pos===last[k])return;if(window.__arr&&!window.__arr(k))return;last[k]=p.pos;if(over)return;const t=T[p.pos]||'empty',f=TS[t]||TS.empty;f()})}catch(e){}},90);
 /* fuller victory / defeat */
 const chord=(fs,at,d,v,ty)=>fs.forEach(f=>tone(f,f,d,ty||'triangle',v,at));
 window.__sfx.win=()=>{const N=[[523,659,784],[587,740,880],[659,831,988]];N.forEach((c,k)=>chord(c,k*.16,.2,.07));chord([784,988,1175,1568],.5,1.1,.08);tone(1568,1568,.9,'square',.03,.5);
  [0,.16,.32,.5].forEach(a=>noise(.12,180,1,.22,a,'lowpass'));noise(.6,7000,1,.05,.5,'highpass')};
 window.__sfx.lose=()=>{chord([392,494,587],0,.35,.07);chord([370,440,523],.35,.35,.07);chord([311,392,466],.7,1.1,.07,'sine');tone(98,73,1.2,'sine',.18,.7)};
}catch(e){console.warn('v4 sound',e)}})();
