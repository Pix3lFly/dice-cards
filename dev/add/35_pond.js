/* ===== v4 (26 Nov): Pix's pond centre island (his picture): turquoise water with ripples, grassy lumpy rim,
   orange ridged cliffs with a pointed underside, round brick platform with the glowing gold ring, lily pads + lotus.
   Built in code (no Meshy). It replaces the toy centre-island model through window.__POND(V,S,m). ===== */
window.__POND=function(V,S,old){try{
 if(window.__pondOff)return;
 if(old)window.__pondHide(old);
  let shr=null;S.children.forEach(o=>{const u=o.userData||{};if(u.pf)o.visible=false;if(u.glb&&u.toonW===.01){window.__pondHide(o)}});
 if(window.__pondG&&window.__pondG.parent===S){if(old)window.__pondHide(old);return}
 const G=new V.Group();G.name='pond';
 const HS=2.62,se=a=>HS*Math.pow(Math.pow(Math.abs(Math.cos(a)),4)+Math.pow(Math.abs(Math.sin(a)),4),-.25);
 const R=(()=>{let s=7;return()=>(s=(s*16807)%2147483647)/2147483647})();
 const INK=0x1b120b;
 const OL=new Map();const ol=(mesh,w)=>{const k=Math.round(w*1000);let m=OL.get(k);if(!m){m=new V.MeshBasicMaterial({color:INK,side:V.BackSide,fog:false});m.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','vec3 transformed = position + normal * '+(k/1000).toFixed(3)+';')};m.customProgramCacheKey=()=>'pol'+k;OL.set(k,m)}
  const o=new V.Mesh(mesh.geometry,m);o.userData.__mine=1;mesh.add(o);return mesh};
 const grad=(()=>{const d=new Uint8Array([90,90,90,255,190,190,190,255,255,255,255,255]);const t=new V.DataTexture(d,3,1,V.RGBAFormat);t.minFilter=t.magFilter=V.NearestFilter;t.needsUpdate=true;return t})();
 const toon=(c,map)=>{const m=new V.MeshBasicMaterial({color:c,map:map||null,fog:false,vertexColors:true});m.userData.__pcel=1;m.userData.__ct=1;return m};
 const cv=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new V.CanvasTexture(c);t.anisotropy=4;return t};
 const TOP=.21;
 /* ---- water ---- */
 const wsh=new V.Shape();for(let k=0;k<=128;k++){const a=k/128*6.283,r=se(a)*1.26;k?wsh.lineTo(Math.cos(a)*r,Math.sin(a)*r):wsh.moveTo(Math.cos(a)*r,Math.sin(a)*r)}
 const wT=cv(512,512,(x,w,h)=>{x.fillStyle='#2a9b98';x.fillRect(0,0,w,h);for(let i=0;i<70;i++){const px=R()*w,py=R()*h,l=18+R()*30;x.strokeStyle=R()<.5?'rgba(215,250,245,.9)':'rgba(130,215,205,.85)';x.lineWidth=2.5+R()*2;x.lineCap='round';x.beginPath();x.moveTo(px,py);x.quadraticCurveTo(px+l*.5,py-6,px+l,py);x.stroke()}});
 wT.wrapS=wT.wrapT=V.RepeatWrapping;wT.repeat.set(1.4,1.4);
 const wg=new V.ShapeGeometry(wsh,64);wg.rotateX(-Math.PI/2);
 {const p=wg.attributes.position,uv=wg.attributes.uv;for(let i=0;i<p.count;i++)uv.setXY(i,p.getX(i)/6.6+.5,p.getZ(i)/6.6+.5)}
 const wM=new V.MeshBasicMaterial({map:wT,color:0xffffff,fog:false});const water=new V.Mesh(wg,wM);water.position.y=TOP-.02;water.receiveShadow=true;G.add(water);
 /* ---- grassy rim (lumpy ring) ---- */
 const rimM=toon(0xa9b827),rimTop=toon(0xc9d63a);
 const rim=new V.Shape(),hole=new V.Path();const N=160;
 for(let k=0;k<=N;k++){const a=k/N*6.283,b=se(a),ro=b*(1.13+.025*Math.sin(a*23)+.02*Math.sin(a*9)),x=Math.cos(a)*ro,y=Math.sin(a)*ro;k?rim.lineTo(x,y):rim.moveTo(x,y)}
 for(let k=0;k<=N;k++){const a=k/N*6.283,b=se(a),ri=b*(.95+.02*Math.sin(a*17+1)+.02*Math.sin(a*7)),x=Math.cos(a)*ri,y=Math.sin(a)*ri;k?hole.lineTo(x,y):hole.moveTo(x,y)}
 rim.holes.push(hole);
 const rg=new V.ExtrudeGeometry(rim,{depth:.16,bevelEnabled:true,bevelThickness:.07,bevelSize:.06,bevelSegments:3,curveSegments:2});rg.rotateX(-Math.PI/2);
 
 /* lumps on the rim */
 const lumpG=new V.SphereGeometry(1,12,8);
 /* ---- cliffs: orange ridged wall + pointed underside ---- */
 const clT=cv(512,128,(x,w,h)=>{const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#e59a4e');g.addColorStop(1,'#c0702e');x.fillStyle=g;x.fillRect(0,0,w,h);
  for(let i=0;i<64;i++){const px=i*w/64+R()*3;x.strokeStyle='rgba(60,30,10,.55)';x.lineWidth=2;x.beginPath();x.moveTo(px,0);x.lineTo(px+R()*4-2,h*(.55+R()*.45));x.stroke();x.fillStyle='rgba(255,210,150,.35)';x.fillRect(px+2,0,3,h*.5)}});
 clT.wrapS=V.RepeatWrapping;
 const cg=new V.CylinderGeometry(1,1,1,192,6,true),ca=cg.attributes.position;
 for(let i=0;i<ca.count;i++){const x=ca.getX(i),y=ca.getY(i),z=ca.getZ(i),a=Math.atan2(z,x),t=.5-y,col=Math.floor((a+Math.PI)/6.283*64),rid=1+.045*Math.abs(Math.sin((a+Math.PI)*32));
  const b=se(a)*1.16*rid*(1-t*.12);let yy=-t*.75;if(t>.9){const r=(Math.sin(col*12.9898)*43758.5)%1;yy-=Math.abs(r)*.28}ca.setXYZ(i,Math.cos(a)*b,yy,Math.sin(a)*b)}
 cg.computeVertexNormals();
 const cliff=new V.Mesh(cg,toon(0xffffff,clT));cliff.position.y=TOP-.1;cliff.castShadow=true;G.add(ol(cliff,.02));
 const ug=new V.ConeGeometry(1,1,96,4,true),ua=ug.attributes.position;
 for(let i=0;i<ua.count;i++){const x=ua.getX(i),y=ua.getY(i),z=ua.getZ(i),a=Math.atan2(z,x),t=.5-y,b=se(a)*.92*(1-t);ua.setXYZ(i,Math.cos(a)*b*(1+.04*Math.sin(a*9)),-t*1.45,Math.sin(a)*b)}
 ug.computeVertexNormals();ug.scale(1,1,1);
 const under=new V.Mesh(ug,toon(0xb4682a,null));under.position.y=TOP-.82;G.add(ol(under,.02));
 /* ---- central brick platform with the gold ring ---- */
 const brick=(rings,col)=>cv(512,128,(x,w,h)=>{x.fillStyle=col;x.fillRect(0,0,w,h);x.strokeStyle='rgba(90,50,25,.75)';x.lineWidth=3;for(let r=0;r<rings;r++){const y0=r*h/rings;x.beginPath();x.moveTo(0,y0);x.lineTo(w,y0);x.stroke();for(let c=0;c<16;c++){const px=(c+(r%2)*.5)*w/16;x.beginPath();x.moveTo(px,y0);x.lineTo(px,y0+h/rings);x.stroke()}}});
 const sideT=brick(2,'#d9a46a');sideT.wrapS=V.RepeatWrapping;sideT.repeat.set(3,1);
 const topT=cv(512,512,(x,w,h)=>{x.fillStyle='#e2b57a';x.fillRect(0,0,w,h);x.strokeStyle='rgba(110,62,28,.7)';x.lineWidth=4;const c=w/2;
  [250,205,160].forEach(r=>{x.beginPath();x.arc(c,c,r,0,6.283);x.stroke()});
  [[160,250,22],[205,250,20]].forEach(([r0,r1,n])=>{for(let k=0;k<n;k++){const a=k/n*6.283+(r0>170?.12:0);x.beginPath();x.moveTo(c+Math.cos(a)*r0,c+Math.sin(a)*r0);x.lineTo(c+Math.cos(a)*(r0===160?205:250),c+Math.sin(a)*(r0===160?205:250));x.stroke()}})});
 const step=(r0,r1,h,y,tt)=>{const g=new V.CylinderGeometry(r0,r1,h,48,1);const m=new V.Mesh(g,[toon(0xffffff,sideT),toon(0xffffff,tt||topT),toon(0xffffff,topT)]);m.position.y=y;m.castShadow=m.receiveShadow=true;PL.add(ol(m,.02));return m};
 const PL=new V.Group();G.add(PL);const G0=G;
 const PY=TOP;
 {const a=step(1.62,1.68,.14,PY+.07),b=step(1.42,1.48,.14,PY+.18);[a,b].forEach(m=>{PL.remove(m);G.add(m)})}
 /* stone wall ring: 8 chunky blocks with no gaps, like Pix's picture */
 const stT=cv(128,128,(x,w,h)=>{x.fillStyle='#fff';x.fillRect(0,0,w,h);x.fillStyle='rgba(120,80,40,.18)';for(let i=0;i<40;i++){x.beginPath();x.arc(R()*w,R()*h,2+R()*4,0,6.3);x.fill()}x.strokeStyle='rgba(90,55,25,.55)';x.lineWidth=3;x.beginPath();x.moveTo(0,h*.55);x.lineTo(w*.4,h*.5);x.stroke()});
 const wallC=[0xd9b688,0xc9a374,0xd2ad7e,0xc49c6c];
 for(let k=0;k<8;k++){const a0=k/8*6.283+.04,a1=(k+1)/8*6.283-.015,ri=.56,ro=.92,hh=.46+((k*5)%3)*.06;const sh=new V.Shape();
  for(let q=0;q<=6;q++){const a=a0+(a1-a0)*q/6;q?sh.lineTo(Math.cos(a)*ro,Math.sin(a)*ro):sh.moveTo(Math.cos(a)*ro,Math.sin(a)*ro)}for(let q=6;q>=0;q--){const a=a0+(a1-a0)*q/6;sh.lineTo(Math.cos(a)*ri,Math.sin(a)*ri)}
  const g=new V.ExtrudeGeometry(sh,{depth:hh,bevelEnabled:true,bevelThickness:.03,bevelSize:.025,bevelSegments:2});g.rotateX(-Math.PI/2);
  const b=new V.Mesh(g,toon(wallC[k%4],stT));b.position.y=PY+.25;b.castShadow=true;PL.add(ol(b,.018))}
 /* small white corner stones on the base, as in the picture */
 [[.25,.0],[2.6,.0]].forEach(([a])=>{const c=new V.Mesh(new V.BoxGeometry(.16,.12,.16),toon(0xf4efe4));c.position.set(Math.cos(a)*1.05,PY+.31,Math.sin(a)*1.05);c.rotation.y=-a;PL.add(ol(c,.02))});
 const inner=step(.58,.6,.3,PY+.45,null);
 const ringT=cv(256,256,(x,w,h)=>{const c=w/2,g=x.createRadialGradient(c,c,4,c,c,c);g.addColorStop(0,'#ff8a1e');g.addColorStop(.35,'#ffb020');g.addColorStop(.5,'#ffe25a');g.addColorStop(.62,'#ff9a1c');g.addColorStop(.78,'#ffd23c');g.addColorStop(.9,'#e07812');g.addColorStop(1,'#7a3a10');x.fillStyle=g;x.fillRect(0,0,w,h)});
 const disc=new V.Mesh(new V.CircleGeometry(.57,48),new V.MeshBasicMaterial({map:ringT,fog:false}));disc.rotation.x=-Math.PI/2;disc.position.y=PY+.605;PL.add(disc);
 G.userData.PL=PL;
 /* ---- lily pads + lotus ---- */
 const padT=cv(128,128,(x,w,h)=>{x.fillStyle='#7cc23c';x.beginPath();x.arc(64,64,60,.25,6.03);x.lineTo(64,64);x.fill();x.strokeStyle='#3a7a1c';x.lineWidth=5;x.beginPath();x.arc(64,64,60,.25,6.03);x.lineTo(64,64);x.closePath();x.stroke();x.strokeStyle='rgba(60,120,30,.7)';x.lineWidth=2;for(let k=1;k<9;k++){const a=.25+k*.64;x.beginPath();x.moveTo(64,64);x.lineTo(64+Math.cos(a)*52,64+Math.sin(a)*52);x.stroke()}});
 const padM=new V.MeshBasicMaterial({fog:false,map:padT,transparent:true,alphaTest:.4,side:V.DoubleSide});
 const petM=toon(0xf4a6c4),petM2=toon(0xffd6e4),yel=toon(0xffd84a);
 const lotus=(x,z,s)=>{const g=new V.Group();for(let k=0;k<8;k++){const p=new V.Mesh(new V.SphereGeometry(1,8,6),k%2?petM:petM2);p.scale.set(.055,.13,.035);const a=k/8*6.283;p.position.set(Math.cos(a)*.065,.09,Math.sin(a)*.065);p.rotation.set(Math.sin(a)*.5,0,-Math.cos(a)*.5);p.rotation.order='YXZ';g.add(ol(p,.25))}
  const c=new V.Mesh(new V.SphereGeometry(.045,8,6),yel);c.position.y=.1;g.add(c);g.position.set(x,TOP-.01,z);g.scale.setScalar(s);G.add(g)};
 [[2.0,.25,.5,1],[-1.75,-1.2,.48,0],[-.2,-2.1,.42,1],[-1.35,1.9,.5,1],[1.6,-1.7,.44,0]].forEach(([x,z,r,lo],i)=>{const p=new V.Mesh(new V.PlaneGeometry(r*2,r*2),padM);p.rotation.set(-Math.PI/2,0,i*1.3);p.position.set(x,TOP-.005,z);G.add(p);if(lo)lotus(x,z,r*3.8)});
 const L=new V.Vector3(.45,1,.55).normalize();
 const lock=m=>{if(!m||!m.color||m.__lk)return;m.__lk=1;const C=m.color;['set','setRGB','setHex','setHSL','copy','multiplyScalar','lerp','offsetHSL','multiply'].forEach(f=>{C[f]=function(){return C}})};
 G.traverse(c=>{if(!c.isMesh)return;(Array.isArray(c.material)?c.material:[c.material]).forEach(lock);c.userData.__mine=1;const g=c.geometry;if(!g||g.attributes.color||!g.attributes.normal)return;const n=g.attributes.normal,col=new Float32Array(n.count*3);
  for(let i=0;i<n.count;i++){const d=n.getX(i)*L.x+n.getY(i)*L.y+n.getZ(i)*L.z;const k=d>.55?1:d>.15?.86:.7;col[i*3]=col[i*3+1]=col[i*3+2]=k}g.setAttribute('color',new V.BufferAttribute(col,3))});
 S.add(G);window.__pondG=G;
}catch(e){console.warn('pond',e);if(old)old.visible=true}};

/* build the pond even when the centre-island model was not ready when the board was made */
setInterval(()=>{try{const G=window.__3;if(!G||!G.V||!G.tiles||!G.S||window.__pondOff)return;const S=G.S;
 if(window.__pondG&&window.__pondG.parent===S){S.children.forEach(o=>{const u=o.userData||{};if(u.pf&&o.visible)o.visible=false;if(u.glb&&u.toonW===.01)window.__pondHide(o)});return}
 window.__POND(G.V,S,null)}catch(e){}},500);

/* keep only the stone shrine of the toy island model: everything farther than R from the centre is cut away */
window.__pondClip=function(V,m){if(!m||m.userData.__clip)return;m.userData.__clip=1;m.visible=true;const RR=(window.__shrineR||1.5).toFixed(3);
 m.traverse(c=>{if(!c.isMesh||!c.material)return;const one=x=>{const y=x.clone();const pv=x.onBeforeCompile,pk=x.customProgramCacheKey;
  y.onBeforeCompile=(sh,r)=>{if(pv)pv.call(x,sh,r);sh.vertexShader='varying vec3 vWPc;\n'+sh.vertexShader;const i=sh.vertexShader.lastIndexOf('}');sh.vertexShader=sh.vertexShader.slice(0,i)+'vWPc=(modelMatrix*vec4(transformed,1.)).xyz;\n}';
   sh.fragmentShader='varying vec3 vWPc;\n'+sh.fragmentShader.replace('void main() {','void main() {\nif(length(vWPc.xz)>'+RR+')discard;')};
  y.customProgramCacheKey=()=>(pk?pk.call(x):'')+'|pclip';y.needsUpdate=true;return y};
  c.material=Array.isArray(c.material)?c.material.map(one):one(c.material)})};

window.__pondHide=function(m){if(!m)return;m.visible=false;try{Object.defineProperty(m,'visible',{get:()=>false,set(){},configurable:true})}catch(e){}};
/* stone pillars with pink gem tops replace the 4 white posts */
setInterval(()=>{try{const G=window.__3,P=window.__pondG;if(!G||!G.S||!P||P.userData.pil)return;const V=G.V,S=G.S,b=new V.Box3(),c=new V.Vector3();const found=[];
 S.children.forEach(o=>{if(!o.isGroup||o.children.length!==3||!o.visible)return;b.setFromObject(o);b.getCenter(c);if(Math.abs(Math.abs(c.x)-1.79)<.15&&Math.abs(Math.abs(c.z)-1.79)<.15)found.push([o,c.clone(),b.min.y])});
 if(found.length<4)return;P.userData.pil=1;
 const brickT=(()=>{const cvs=document.createElement('canvas');cvs.width=64;cvs.height=128;const x=cvs.getContext('2d');x.fillStyle='#ddb98a';x.fillRect(0,0,64,128);x.strokeStyle='rgba(110,65,30,.65)';x.lineWidth=3;for(let r=0;r<4;r++){x.beginPath();x.moveTo(0,r*32);x.lineTo(64,r*32);x.stroke();x.beginPath();x.moveTo(r%2?20:44,r*32);x.lineTo(r%2?20:44,r*32+32);x.stroke()}return new V.CanvasTexture(cvs)})();
 const mk=(col,map)=>new V.MeshBasicMaterial({color:col,map:map||null,fog:false});
 const olm=new V.MeshBasicMaterial({color:0x1b120b,side:V.BackSide,fog:false});
 const add=(mesh,s)=>{const o=new V.Mesh(mesh.geometry,olm);o.scale.setScalar(s);mesh.add(o);return mesh};
 found.forEach(([o,ct,y0])=>{window.__pondHide(o);const g=new V.Group();const py=.21;
  const base=add(new V.Mesh(new V.BoxGeometry(.4,.12,.4),mk(0xc49c6c)),1.08);base.position.y=py+.06;g.add(base);
  const col=add(new V.Mesh(new V.BoxGeometry(.28,.62,.28),[mk(0xffffff,brickT),mk(0xffffff,brickT),mk(0xe9c79a),mk(0xb98e5e),mk(0xffffff,brickT),mk(0xd2ae80,brickT)]),1.07);col.position.y=py+.43;g.add(col);
  const cap=add(new V.Mesh(new V.BoxGeometry(.38,.1,.38),mk(0xe2be8e)),1.08);cap.position.y=py+.79;g.add(cap);
  const gem=add(new V.Mesh(new V.ConeGeometry(.15,.13,4),mk(0xd85cc0)),1.12);gem.rotation.y=Math.PI/4;gem.position.y=py+.9;g.add(gem);
  const gt=new V.Mesh(new V.ConeGeometry(.08,.05,4),mk(0xf7a8e8));gt.rotation.y=Math.PI/4;gt.position.y=py+.95;g.add(gt);
  g.position.set(ct.x*.92,0,ct.z*.92);g.traverse(c=>{if(c.isMesh)c.userData.__mine=1});P.add(g)})}catch(e){}},600);
