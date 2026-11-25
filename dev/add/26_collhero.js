/* ===== v4 (26 Nov): Collection → Heroes restyled to match the Battle page (Pix's mockup):
   navy panels with gold frames, castle-landscape hero window, the equipped skin's art standing on the stone pedestal. ===== */
(function w(){if(typeof menu!=='function'||typeof SV==='undefined'||!window.__BT4){setTimeout(w,400);return}try{
const A=window.__BT4;let BG='';
function bg(){if(BG)return BG;const m=getComputedStyle(document.getElementById('menu')).backgroundImage.match(/url\([^)]*\)/g);if(m)BG=m[m.length-1];return BG}
function fit(im){try{if(!im.naturalWidth)return;const c=document.createElement('canvas'),W=c.width=Math.min(im.naturalWidth,200),H=c.height=Math.round(im.naturalHeight*W/im.naturalWidth),x=c.getContext('2d',{willReadFrequently:true});x.drawImage(im,0,0,W,H);
 const d=x.getImageData(0,0,W,H).data;let y=H-1;for(;y>0;y--){let h=0;for(let i=0;i<W;i++)if(d[(y*W+i)*4+3]>60){h=1;break}if(h)break}
 im.style.setProperty('--fy',((H-1-y)/H*100).toFixed(1)+'%');im.style.visibility='visible'}catch(e){im.style.visibility='visible'}}
const CO='<i class="cco tl"></i><i class="cco tr"></i><i class="cco bl"></i><i class="cco br"></i>';
function corners(el){if(el&&!el.querySelector(':scope>.cco'))el.insertAdjacentHTML('beforeend',CO)}
function deco(){const pn=document.querySelector('#mb .spn2.hv3');if(!pn){const m=document.getElementById('mb');if(m)m.classList.remove('ch4');return}const st=pn.querySelector('.hst');if(!st)return;
 document.getElementById('mb').classList.add('ch4');
 const b=bg();if(b&&!st.dataset.bg){st.style.setProperty('background-image',b,'important');st.dataset.bg=1}
 if(!st.querySelector('.chped')&&A.ped){const p=document.createElement('img');p.className='chped';p.alt='';p.src=A.ped;st.insertBefore(p,st.firstChild)}
 const src=window.__hImg&&__hImg(SV.mine);if(!src)return;let im=st.querySelector('img.chh');
 if(!im){im=document.createElement('img');im.className='chh';im.alt='';im.style.visibility='hidden';im.onload=()=>fit(im);im.onclick=()=>{try{m3pop('h')}catch(e){}};st.insertBefore(im,st.querySelector('.hcl'))}
 if(im.getAttribute('src')!==src){im.style.visibility='hidden';im.src=src}st.classList.add('ch4on');corners(st);corners(pn.querySelector('.sk3'))}
const _m=menu;menu=function(){const r=_m.apply(this,arguments);try{deco()}catch(e){}setTimeout(()=>{try{deco()}catch(e){}},60);return r};
setInterval(()=>{try{const m=document.getElementById('mb');if(m&&!m.querySelector('.spn2.hv3'))m.classList.remove('ch4');else deco()}catch(e){}},700);
}catch(e){console.warn('v4 coll hero',e)}})();
