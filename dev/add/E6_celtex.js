/* 25 Nov (Pix): board item sprites cel shaded — each picture is redrawn with 3 hard light bands and fewer colour steps.
   window.__celSpr=0 before load turns it off. */
window.__celTex=function(V,url){const t=new V.Texture();t.minFilter=V.LinearMipmapLinearFilter;t.anisotropy=4;const im=new Image();
 im.onload=()=>{try{if(window.__celSpr===0){t.image=im;t.needsUpdate=true;return}const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);
  const d=x.getImageData(0,0,c.width,c.height),p=d.data,Q=7;
  for(let i=0;i<p.length;i+=4){if(p[i+3]<8)continue;const r=p[i],g=p[i+1],b=p[i+2],l=(.299*r+.587*g+.114*b)/255,k=l<.3?.8:l<.62?.97:1.08;
   p[i]=Math.min(255,Math.round(r*k/255*Q)/Q*255);p[i+1]=Math.min(255,Math.round(g*k/255*Q)/Q*255);p[i+2]=Math.min(255,Math.round(b*k/255*Q)/Q*255)}
  x.putImageData(d,0,0);t.image=c}catch(e){t.image=im}t.needsUpdate=true};im.src=url;return t};