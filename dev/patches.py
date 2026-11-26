# V4 build-time patches to the V3 code inside base.html (base.html itself and the locked V3 artifact stay untouched).
# Each patch: (name, old, new) - old must appear exactly once.
P = [
 # guild perks: drop the "Guild name change" reward
 ('guild perk name change', "[8,'Guild name change',0],", ""),
 # guild list: Cancel request button sized like the other row buttons
 ('guild cancel btn', '<button class="opr rm" onclick="guCancelReq()">Cancel</button>', '<button class="opr jn rm" onclick="guCancelReq()">Cancel</button>'),
 # guild list rows + overview header: the guild's logo
 ('guild list logo', '<img class="gbn" alt="" style="filter:${HU[i%3]}" src="${U.m_guild}">', '${window.__glgH?window.__glgH(g.n,i,""):""}',2),
 ('guild overview logo', "<img class=\"gbn big\" alt=\"\" style=\"filter:'+HU[gi%3]+'\" src=\"'+U.m_guild+'\">", "'+(window.__glgH?window.__glgH(g.n,gi,'big'):'')+'"),
 # guild create: logo picker under the name, saved with the guild
 ('guild create picker', "(all?'<input id=\"gun\" class=\"sin\" maxlength=\"18\" placeholder=\"Guild name\">':'')", "(all?'<input id=\"gun\" class=\"sin\" maxlength=\"18\" placeholder=\"Guild name\">'+(window.__glgPick?window.__glgPick(0):''):'')"),
 ('guild create save', "SV.myGuild={n};GU.push({n,m:1});", "SV.myGuild={n,lg:window.__glgSel||0};GU.push({n,m:1});"),
 # guild manage: logo picker section; Save stores it
 ('guild manage picker', "'<div class=\"frh\">Guild message</div><div class=\"gbx\">", "'<div class=\"frh\">Guild logo</div><div class=\"gbx glbx\">'+(window.__glgPick?window.__glgPick(g.lg||0):'')+'</div><div class=\"frh\">Guild message</div><div class=\"gbx\">"),
 ('guild manage save', "g.msg=(v('gmsg')||'').trim();", "g.msg=(v('gmsg')||'').trim();if(window.__glgSel!=null)g.lg=window.__glgSel;"),
 # guild members: role colours, leader → co-leaders → members when sorted by role, last online line
 ('guild member sort', "L.sort((a,b)=>(isOn(b.id)-isOn(a.id))||(F[SORT]||F.role)(a,b));", "L.sort((a,b)=>SORT==='role'?(RO[a.role]-RO[b.role])||(isOn(b.id)-isOn(a.id))||(b.rp-a.rp):(isOn(b.id)-isOn(a.id))||(F[SORT]||F.role)(a,b));"),
 ('guild member row', '<div class="fr3 gm ${m.you?\'you\':\'\'}" onclick="guMem(\'${m.id}\')">', '<div class="fr3 gm g${m.role} ${m.you?\'you\':\'\'}" onclick="guMem(\'${m.id}\')">'),
 ('guild member last online', "<span>${RK[rkOf(m.rp)][0]} · Lv ${m.lv} · ${m.w} wins</span></div><div class=\"gpv\">", "<span>${RK[rkOf(m.rp)][0]} · Lv ${m.lv} · ${m.w} wins</span><span class=\"lso\">${window.__lastOn?window.__lastOn(m.id,m.you):''}</span></div><div class=\"gpv\">"),
 # guild overview: members count next to the guild level
 ('guild overview count', "let h=_g();const I=info(SV.guild);", "let h=_g();const I=info(SV.guild);h=h.replace(/(<b>Guild level \\d+<\\/b>)/,'<div class=\"glr\">$1<em class=\"gmc\">'+members().length+' / '+MAXM+' members</em></div>');"),
 # friends list: last online line
 ('friends last online', "<span>W-L ${f.w}-${f.l} · vs you ${f.wv}-${f.lv}</span></div>", "<span>W-L ${f.w}-${f.l} · vs you ${f.wv}-${f.lv}</span><span class=\"lso\">${window.__lastOn?window.__lastOn(f.id,0,f.seen):''}</span></div>"),
 # board: "HP" in the health bars
 ('hp label', "<span>${p.hp}/${p.max}</span>", "<span>HP ${p.hp}/${p.max}</span>"),
 ('hp label live', "if(sp)sp.textContent=v+'/'+p.max", "if(sp)sp.textContent='HP '+v+'/'+p.max"),
 # rank road: show what each reward is, and a reward window after claiming
 ('rank road reward', "const st=i===0?'<em>Start</em>':SV.rku[i]?'<em>✔ Claimed</em>':i<=cur?'<button class=\"rcl\" onclick=\"__rkClaim('+i+')\">CLAIM</button>':'<span>'+r.gold+' 🪙 '+r.gems+' 💎</span>';",
  "const rw=r?'<span class=\"rrw\"><img alt=\"\" src=\"'+U.coin+'\">'+r.gold+'<img alt=\"\" src=\"'+U.gem+'\">'+r.gems+'</span>':'';const st=i===0?'<em>Start</em>':SV.rku[i]?rw+'<em>✔ Claimed</em>':i<=cur?rw+'<button class=\"rcl\" onclick=\"__rkClaim('+i+')\">CLAIM</button>':rw;"),
 ('rank claim popup', "if(SV.rkPend===i)SV.rkPend=0;try{__sfx&&__sfx('chest')}catch(e){}try{sv()}catch(e){}__rrClose();menu()};",
  "if(SV.rkPend===i)SV.rkPend=0;try{__sfx&&__sfx('chest')}catch(e){}try{sv()}catch(e){}__rrClose();menu();try{window.__rwShow&&window.__rwShow(bad(i),RK[i][0]+' reward!',[[U.coin,'+'+(r.gold||0),'Gold'],[U.gem,'+'+(r.gems||0),'Gems']])}catch(e){}};"),
 # mail: no simulated friend gifts when playing online (03_friends meant to switch these off, but mailInit can't be swapped from an add-on)
 ('no fake gifts online', "if(SV.mday!==day){SV.mday=day;shuf(FR)", "if(SV.mday!==day&&!(window.__FRON&&window.__FRON.on)){SV.mday=day;shuf(FR)"),
 # V4 heroes from Pix's character sheet: a 7th model file m/mdl6.js sets window.__H4 = {name:{g,t}}, merged over the V3 models
 ('model part 7', "var N=6,i=0,tries=0;", "var N=7,i=0,tries=0;"),
 ('model merge v4 heroes', "try{D=JSON.parse(el.textContent)}catch(e){}", "try{D=JSON.parse(el.textContent)}catch(e){}try{if(D&&window.__H4){Object.assign(D,window.__H4);window.__H4=null}}catch(e){}"),
 # new spectre (already glowing cyan): skip the old darken + pale-blue tint, keep a light glow
 ('spectre loader tint', "(k==='spectre'?o.material.color.setRGB(.46,.5,.62)", "(k==='spectre'&&!window.__H4S?o.material.color.setRGB(.46,.5,.62)"),
 ('spectre board tint', "m.userData.__spB=1;m.color.lerp(new G.V.Color(0xdff6ff),.6);if(m.emissive){m.emissive.setRGB(.22,.32,.38)}", "m.userData.__spB=1;if(window.__H4S){const sv=window.__specL||.55;m.color.setRGB(sv,sv,sv*1.04);if(m.emissive){m.emissive.setRGB(.1,.1,.1);if(m.map)m.emissiveMap=m.map}}else{m.color.lerp(new G.V.Color(0xdff6ff),.6);if(m.emissive){m.emissive.setRGB(.22,.32,.38)}}"),
 # sudden death: the big V4 banner instead of the small one
 ('sudden death banner', "try{window.__bigPop&&window.__bigPop('Sudden death!',false)}catch(e){}", "try{window.__sdPop?window.__sdPop():window.__bigPop&&window.__bigPop('Sudden death!',false)}catch(e){}"),
 # daily quests only on Journal → Rewards (not on Achievements)
 ('dq not on achievements', "if(tab==='jour'){const sp=document.querySelector('#mb .spn2');if(sp&&!document.querySelector('#mb .dq3'))", "if(tab==='jour'&&(()=>{try{return JT!=='ach'}catch(e){return true}})()){const sp=document.querySelector('#mb .spn2');if(sp&&!document.querySelector('#mb .dq3'))"),
 # journal tutorial: a step for daily quests
 ('journal tutorial dq', "{s:'rew',t:()=>$q('.csh'),m:'<b>Chests</b>", "{s:'rew',t:()=>$q('.dq3'),m:'<b>Daily quests</b>: 3 new quests every day. Play matches to finish them, then tap <b>CLAIM</b> for gold or gems. New quests come at midnight.'},\n   {s:'rew',t:()=>$q('.csh'),m:'<b>Chests</b>"),
 # board tutorial: Back / Next buttons instead of tap anywhere
 ('tutorial buttons', "'<small>Tap anywhere to continue</small></div>';try{window.__tutP&&window.__tutP(s.x,r,bx,ar)}catch(e){}}",
  "'<div class=\"tnv\"><button class=\"bt tbk\" '+(k?'':'disabled')+'>◀ Back</button><button class=\"bt tnx\">'+(k===STEPS.length-1?'Done ✓':'Next ▶')+'</button></div></div>';bx.querySelector('.tbk').onclick=e=>{e.stopPropagation();if(k>0){k--;show();try{snd(500,.05,'triangle')}catch(x){}}};bx.querySelector('.tnx').onclick=e=>{e.stopPropagation();k++;show();try{snd(600,.05,'triangle')}catch(x){}};try{window.__tutP&&window.__tutP(s.x,r,bx,ar)}catch(e){}}"),
 ('tutorial no tap', "T3.addEventListener('click',()=>{if(k>=STEPS.length)return;k++;show();try{snd(600,.05,'triangle')}catch(e){}});", ""),
 # online guilds: guild perks follow the guild's level (from all members' points) when online
 ('glv online', "glv=()=>Math.min(10,1+Math.floor((SV.gp||0)/100));", "glv=()=>(window.__glv&&window.__glv())||Math.min(10,1+Math.floor((SV.gp||0)/100));"),
 # hero pictures in menus (Collection etc.) = the same 2D art as the Battle page
 ('heroShot 2D', "function heroShot(h){if(SNAP[h])return SNAP[h];", "function heroShot(h){try{const S=window.__SKI||{},k=(SV.skin&&SV.skin[h])||0,a=S['b'+k+h]||S['b0'+h];if(a)return a}catch(e){}if(SNAP[h])return SNAP[h];"),
 # new 3D bases: the hero's base spot is the corner tile itself (the base's round platform sits there)
 ('base spot on corner', "const d=(i?.38:-.38)*1.14;w.x+=d;w.z+=d", "const d=(i?.38:-.38)*1.14*(window.__WBk!=null?window.__WBk:-.35);w.x+=d;w.z+=d"),
 # enemy base (tile 12): 20% larger like yours, and a little further into the corner
 ('enemy base size', "if(i===0){const BS=1.2;m.updateMatrix();const pp=new V.Vector3(Mt.px,Mt.plat,Mt.pz).applyMatrix4(m.matrix);m.scale.multiplyScalar(BS);m.position.sub(pp).multiplyScalar(BS).add(pp);m.userData.__bs=BS}",
  "if(i===0||i===12){const BS=1.2;m.updateMatrix();const pp=new V.Vector3(Mt.px,Mt.plat,Mt.pz).applyMatrix4(m.matrix);m.scale.multiplyScalar(BS);m.position.sub(pp).multiplyScalar(BS).add(pp);m.userData.__bs=BS;if(i===12){const k=window.__EBin!=null?window.__EBin:.05;m.position.x-=k;m.position.z-=k}}"),
 # Debug box: only the owners see it; everyone's messages are queued for the owner panel's Debug tab
 ('debug owners only', "L.push(m);let d=document.getElementById('dbgbox');", "L.push(m);try{(window.__dbgQ=window.__dbgQ||[]).push({m:m.slice(0,400),t:Date.now()});if(window.__dbgQ.length>60)window.__dbgQ.shift()}catch(e){}if(!(window.__dbgOK&&window.__dbgOK()))return;let d=document.getElementById('dbgbox');"),
 # camera a little further back so the bigger corner bases and portals stay on screen
 ('camera back', "window.__fitCR=base*1.12*wide}", "window.__fitCR=base*1.12*wide*(window.__fitK||1.1)}"),
 # 3D die: never crash on an odd roll value (0, NaN, negative) -> "NV[v] is not iterable"
 ('die roll safe', "roll=function(s){const v=(s-1)%6+1,", "roll=function(s){const v=((((Math.round(+s)||1)-1)%6)+6)%6+1,"),
 # shop: test gold button removed for players (owners have "Give myself" in the owner panel)
 ('shop test btn', "hint='<button class=\"bt sm\" onclick=\"SV.gold+=200;SV.gems+=10;sv();menu()\">Test: +200 gold, +10 gems</button>';", "hint='';"),
 # frozen (ice mage) shows FROZEN instead of STUNNED when the turn is skipped
 ('frozen 0', "v.skip=1;log('❄️ '+v.name+' is frozen in ice!')", "v.skip=1;v.frz=1;log('❄️ '+v.name+' is frozen in ice!')"),
 ('frozen 1', "if(cur===0&&p.skip){p.skip--;log('You are stunned!');", "if(cur===0&&p.skip){p.skip--;log(p.frz?'You are frozen!':'You are stunned!');p.frz=0;"),
 ('frozen 2', "if(p.skip){p.skip--;log(p.name+' is stunned!');end();return}", "if(p.skip){p.skip--;log(p.name+(p.frz?' is frozen!':' is stunned!'));p.frz=0;end();return}"),
 ('frozen 3', "if(t==='You are stunned!')window.__stunAt=Date.now();else if(cur===1&&/ is stunned!$/.test(String(t))){Q.push([0,'Enemy stunned!','#ffd23a',0,'tS']);pop()}", "if(t==='You are stunned!'||t==='You are frozen!'){window.__stunAt=Date.now();window.__stunF=t==='You are frozen!'}else if(cur===1&&/ is (stunned|frozen)!$/.test(String(t))){const fz=/frozen!$/.test(String(t));Q.push([0,fz?'Enemy frozen!':'Enemy stunned!',fz?'#9fe3ff':'#ffd23a',0,'tS']);pop()}"),
 ('frozen 4', "Q.push([0,'Stunned!','#ffd23a',0,'tS'])", "Q.push([0,window.__stunF?'Frozen!':'Stunned!',window.__stunF?'#9fe3ff':'#ffd23a',0,'tS'])"),
 # Blizzard freezes too
 ('blizzard 0', "log('📖 Blizzard: foe slowed and stunned');o.slow=3;o.skip=1", "log('📖 Blizzard: foe slowed and frozen');o.slow=3;o.skip=1;o.frz=1"),
 ('blizzard 1', "nm='Blizzard';o.slow=3;o.skip=1;cast('blizzard',i,1-i,[['Slowed','#9fe3ff'],['Stunned','#ffd166']])", "nm='Blizzard';o.slow=3;o.skip=1;o.frz=1;cast('blizzard',i,1-i,[['Slowed','#9fe3ff'],['Frozen','#9fe3ff']])"),
 # board tiles: smoother cartoon look (no colour banding, soft-shaded cliffs instead of facets). Revert: window.__TSM=0 or drop these 4
 ('tile smooth u', 'uniforms:{mp:{value:map},tn:{value:new V.Color(tn)},ry:{value:ry},ck:{value:1},cq:{value:6}},side:V.DoubleSide,', 'uniforms:{mp:{value:map},tn:{value:new V.Color(tn)},ry:{value:ry},ck:{value:1},cq:{value:6},sm:{value:0}},side:V.DoubleSide,'),
 ('tile smooth u2', "fragmentShader:'uniform sampler2D mp;uniform vec3 tn;uniform float ry;uniform float ck;uniform float cq;", "fragmentShader:'uniform sampler2D mp;uniform vec3 tn;uniform float ry;uniform float ck;uniform float cq;uniform float sm;"),
 ('tile smooth rock', 'if(rock){vec3 fn=normalize(cross(dFdx(vW),dFdy(vW)));float h=fract(sin(dot(floor(fn*3.),vec3(12.9,78.2,37.7)))*43758.5);float fd=dot(fn,normalize(vec3(.55,.35,.75)));float fs=fd>.45?1.08:fd>.0?.86:.64;vec3 rc=mix(vec3(.88,.55,.3),vec3(.8,.47,.24),h);', 'if(rock){vec3 fn=sm>.5?normalize(vN):normalize(cross(dFdx(vW),dFdy(vW)));float h=sm>.5?clamp(.45-vY*.9,0.,1.):fract(sin(dot(floor(fn*3.),vec3(12.9,78.2,37.7)))*43758.5);float fd=dot(fn,normalize(vec3(.55,.35,.75)));float fs=sm>.5?(fd>.3?1.1:fd>-.15?.92:.74):(fd>.45?1.08:fd>.0?.86:.64);vec3 rc=sm>.5?mix(vec3(.96,.64,.36),vec3(.74,.41,.21),h):mix(vec3(.88,.55,.3),vec3(.8,.47,.24),h);'),
 ('tile smooth on', 'tgM=mkTex(T.map,0xffffff,.06);tgMe=mkTex(T.map,0xcdb68a,.06);tgM.userData.__ct=tgMe.userData.__ct=1}', 'tgM=mkTex(T.map,0xffffff,.06);tgMe=mkTex(T.map,0xcdb68a,.06);tgM.userData.__ct=tgMe.userData.__ct=1;if(window.__TSM!==0)[tgM,tgMe].forEach(m=>{m.uniforms.sm.value=1;m.uniforms.cq.value=28;m.uniforms.ck.value=.75;if(window.__TNEW){m.uniforms.ry.value=-99;m.uniforms.ck.value=window.__tileCk||1;m.uniforms.cq.value=window.__tileCq||9;if(window.__TOY!==0&&m.uniforms.ty){m.uniforms.ty.value=1;m.uniforms.tb.value=window.__toyTb||.9;m.uniforms.yr.value.set(-.3,window.__tileCliffY||.24)}m.uniforms.tn.value.multiplyScalar(1.12)}})}'),
 # new tile: taller (chunky block) and a little wider (smaller gaps); top stays at the same height
 ('tile size', "top.scale.set(sx,sx,sx);top.position.y=.565-bb.max.y*sx;", "{const kw=window.__TNEW?(window.__tileW||.96):1,kh=window.__TNEW?(window.__TTOY?(window.__tileH||1.75):1.45):1;top.scale.set(sx*kw,sx*kh,sx*kw);top.position.y=.565-bb.max.y*sx*kh}"),
 # tiles: flat even light on the top (no dark triangle from the model's top faces)
 ('tile flat top', 'float s=mix(.95,d>.55?1.12:d>.1?.82:.58,ck);', 'float s=mix(.95,d>.55?1.12:d>.1?.82:.58,ck);if(sm>.5&&vN.y>.45)s=1.04;'),
  ('tile top solid', "vec3 c=texture2D(mp,vU).rgb*tn;bool gr", "vec3 c=texture2D(mp,vU).rgb*tn;if(sm>.5&&vN.y>(ty>.5?.55:.85)&&vY>.28)c=vec3(.975,.83,.59)*tn;bool gr"),
  ('turn min 1', "<div class=\"tn\">Turn<br>${round}", "<div class=\"tn\">Turn<br>${Math.max(1,round)}"),
  ('no cliff spikes on new tiles', "if(hs(i,7,7)>.35){const cl=new V.Mesh(cliffG,cliffM)", "if(!window.__TNEW&&hs(i,7,7)>.35){const cl=new V.Mesh(cliffG,cliffM)"),
  ('skin model', "MOD[h]=()=>mk(HM[h],2.62,'h')||f0()", "MOD[h]=()=>{let sk=null;try{sk=window.__skinKey?window.__skinKey(h):null}catch(e){}const HS=window.__heroS||.87;return (sk&&GM[sk]&&mk(sk,2.62*HS*(window.__skinS||1.1),'h'))||mk(HM[h],2.62*HS*(h==='s'?(window.__specS||.9):1),'h')||f0()}"),
  ('skin loader', "window.__mdlRun=function(){window.__mdlRun=null;if(V.GLTFLoader){", "window.__addGM=(k,d,cb)=>{try{const s=atob(d.g),u=new Uint8Array(s.length);for(let j=0;j<s.length;j++)u[j]=s.charCodeAt(j);const img=new Image(),tx=new V.Texture(img);tx.flipY=false;tx.encoding=V.LinearEncoding;img.onload=()=>{tx.needsUpdate=true};img.src='data:image/jpeg;base64,'+d.t;new V.GLTFLoader().parse(u.buffer,'',g=>{g.scene.traverse(o=>{if(o.isMesh&&o.material){o.material.map=tx;o.material.color&&o.material.color.setRGB(1,1,1);o.material.metalness=0;o.material.roughness=.85;o.material.needsUpdate=true}});GM[k]=g.scene;cb&&cb(1)},e=>{console.warn('skin model',k,e);cb&&cb(0)})}catch(e){console.warn('skin model',k,e);cb&&cb(0)}};window.__mdlRun=function(){window.__mdlRun=null;if(V.GLTFLoader){"),
  ('pfp only owned', "Object.keys(POR()).map(k=>", "Object.keys(POR()).filter(k=>!window.__pfOK||window.__pfOK(k)).map(k=>"),
  ('vs my pic', "<div class=\"vs3\"><div class=\"av\"><img alt=\"\" src=\"'+(POR()[SV.mine]||'')", "<div class=\"vs3\"><div class=\"av\"><img alt=\"\" src=\"'+((window.__myPic&&__myPic())||POR()[SV.mine]||'')"),
  ('rolloff pic', "const prt=p=>'<div class=\"rp\">'+(HD[p.h]?pimg(p.h)", "const prt=p=>'<div class=\"rp\">'+(HD[p.h]?((window.__plPic&&__plPic(p))?'<img alt=\"\" src=\"'+__plPic(p)+'\">':pimg(p.h))"),
  ('idle facing', 'else{const w=WB(vis[k]);h.position.set(w.x+o[0],.56+Math.sin(t*2+k)*.02,w.z+o[1])}', "else{const w=WB(vis[k]);h.position.set(w.x+o[0],.56+Math.sin(t*2+k)*.02,w.z+o[1]);if(window.__faceIdle===1&&!TP[k]){let ty;try{if(typeof cur!=='undefined'&&cur===k&&!over){const n=WB((vis[k]+1)%N);ty=Math.atan2(n.x-w.x,n.z-w.z)}else ty=Math.atan2(-w.x,-w.z)}catch(e){ty=Math.atan2(-w.x,-w.z)}const d=Math.atan2(Math.sin(ty-h.rotation.y),Math.cos(ty-h.rotation.y));h.rotation.y+=d*Math.min(1,dt*5)}}"),
  ('base cel', "mat.uniforms.ck.value=1.3;mat.uniforms.cq.value=5;", "mat.uniforms.ck.value=window.__baseCk||1.6;if(mat.uniforms.tb)mat.uniforms.tb.value=window.__baseTb||1.8;if(window.__TOY!==0&&mat.uniforms.ty){mat.uniforms.ty.value=1;mat.uniforms.yr.value.set(-.37,window.__baseCliffY||-.13)}mat.uniforms.cq.value=window.__baseCq||9;"),
  ('tile depth row', "top=new V.Mesh(window.__TG.geo,tgM);top.userData.__wd=1;", "top=new V.Mesh((()=>{const DF=window.__TDF||{13:1.12,14:1.0,15:1.22,16:1.1,17:1.17},f=window.__TNEW&&DF[i];if(!f)return window.__TG.geo;const g=window.__TG.geo.clone(),p=g.attributes.position,b=window.__TG.geo.boundingBox,cut=b.max.y-.07;for(let k=0;k<p.count;k++){const y=p.getY(k);if(y<cut)p.setY(k,cut-(cut-y)*f)}p.needsUpdate=true;g.computeBoundingBox();g.computeBoundingSphere();return g})(),tgM);top.userData.__wd=1;"),
  ('idle face centre', 'let ty=p.jail?toCam:head;const d0=ang(head,toCam);if(!p.jail&&Math.abs(d0)>Math.PI*.45)ty=head+d0*.5;', "let ty;if(p.jail)ty=toCam;else if(window.__faceV3===1){ty=head;const d0=ang(head,toCam);if(Math.abs(d0)>Math.PI*.45)ty=head+d0*.5}else if(typeof cur!=='undefined'&&cur===k&&!over)ty=head;else{const dc=G3.die&&G3.die.position;const cx=dc?dc.x:0,cz=dc?dc.z:0;ty=Math.atan2(cx-h.position.x,cz-h.position.z)}"),
  ('turn arrow cel', ' const mkA=c=>{const g=new V.Group(),m=new V.Mesh(new V.ConeGeometry(.13,.26,4),new V.MeshBasicMaterial({color:c,depthTest:false,transparent:true}));m.rotation.x=Math.PI;m.renderOrder=20;\n  const o=new V.Mesh(new V.ConeGeometry(.17,.33,4),new V.MeshBasicMaterial({color:0x1d1126,depthTest:false,transparent:true}));o.rotation.x=Math.PI;o.position.y=.01;o.renderOrder=19;g.add(o);g.add(m);g.visible=false;S.add(g);return g};', ' const mkA=c=>{const g=new V.Group(),gm=new V.DataTexture(new Uint8Array([120,120,200,200,255,255]),6,1,V.LuminanceFormat);gm.minFilter=gm.magFilter=V.NearestFilter;gm.generateMipmaps=false;gm.needsUpdate=true;\n  const geo=new V.ConeGeometry(.28,.58,4,1);geo.computeVertexNormals();\n  const m=new V.Mesh(geo,new V.MeshToonMaterial({color:c,gradientMap:gm,emissive:c,emissiveIntensity:.12,depthTest:false,transparent:true}));m.rotation.x=Math.PI;m.renderOrder=20;\n  const o=new V.Mesh(geo,new V.MeshBasicMaterial({color:0x1d1126,side:V.BackSide,depthTest:false,transparent:true}));o.rotation.x=Math.PI;o.scale.setScalar(1.2);o.renderOrder=19;\n  const hl=new V.Mesh(new V.ConeGeometry(.09,.2,4,1),new V.MeshBasicMaterial({color:0xffffff,depthTest:false,transparent:true}));hl.rotation.x=Math.PI;hl.position.set(-.07,.09,.07);hl.renderOrder=21;\n  g.add(o);g.add(m);g.add(hl);g.visible=false;S.add(g);return g};'),
  ('turn arrow height', 'a.position.set(h.position.x,h.position.y+3.0+Math.sin(t*4)*.08,h.position.z)', 'a.position.set(h.position.x,h.position.y+((P[k]&&P[k].skn)?3.05:2.8)+Math.sin(t*4)*.1,h.position.z)'),
  ('turn arrow colours', 'const A=[mkA(0x4fb3ff),mkA(0xff5a4f)]', 'const A=[mkA(0x2f8cff),mkA(0xff3b30)]'),
  ('new item art', 'const tex=(V,k)=>{if(T[k])return T[k];const t=new V.TextureLoader().load(D[k]);', "const tex=(V,k)=>{if(T[k])return T[k];const t=window.__celTex?window.__celTex(V,(window.__NSP&&window.__NSP[k.replace(/^shop[TRBL]$/,'shop')])||D[k]):new V.TextureLoader().load((window.__NSP&&window.__NSP[k.replace(/^shop[TRBL]$/,'shop')])||D[k]);"),
  ('new item size', 'h=H[kk]||.7', 'h=(H[kk]||.7)*(window.__NSP&&window.__NSP[kk]?(window.__nspK||1.2):1)*(window.__TOY!==0?1.08:1)'),
  ('new item centre', 'M[k]=new V.SpriteMaterial({map:tex(V,k),transparent:true,alphaTest:.15,depthWrite:true}));s=new V.Sprite(m);s.center.set(.5,.02)', 'M[k]=new V.SpriteMaterial({map:tex(V,k),transparent:true,alphaTest:.15,depthWrite:true}));s=new V.Sprite(m);s.center.set(.5,window.__NSP&&window.__NSP[k]?(window.__nspC||.12):(window.__sprC||.1))'),
  ('base tex smooth u', 'uniforms:{mp:{value:map},tn:{value:new V.Color(tn)},ry:{value:ry},ck:{value:1},cq:{value:6},sm:{value:0}}', 'uniforms:{mp:{value:map},tn:{value:new V.Color(tn)},ry:{value:ry},ck:{value:1},cq:{value:6},sm:{value:0},tb:{value:0}}'),
  ('base tex smooth d', 'uniform float sm;varying', 'uniform float sm;uniform float tb;varying'),
  ('base tex smooth s', 'vec3 c=texture2D(mp,vU).rgb*tn;if(sm>.5', 'vec3 c=texture2D(mp,vU,tb).rgb*tn;if(sm>.5'),
  ('tile side soft', 'float l=dot(c,vec3(.299,.587,.114));float d=dot(normalize(vN)', 'if(sm>.5&&vN.y<=.45)c=mix(c,vec3(.92,.64,.42),.3);float l=dot(c,vec3(.299,.587,.114));float d=dot(normalize(vN)'),
  ('tile outline thin', 'o.cBlk=top;outline(top);', 'o.cBlk=top;outline(top);try{const ol=top.children.find(c=>c.userData.__olc);if(ol&&window.__TTOY&&window.__toyOL!==1)ol.visible=false;if(ol){if(!window.__OUTT){window.__OUTT=mkOut(V);window.__OUTT.uniforms.uW.value=window.__tileOW||.0025;window.__OUTT.uniforms.uC.value.set(0x4a2c18)}ol.material=window.__OUTT}}catch(e){}'),
  ('cage smaller', 'cg.scale.setScalar(1.3);S.add(cg)', 'cg.scale.setScalar(1.3*(window.__cageS||.75));S.add(cg)'),
  ('toy u', 'sm:{value:0},tb:{value:0}}', 'sm:{value:0},tb:{value:0},ty:{value:0},yr:{value:new V.Vector2(-.3,.3)}}'),
  ('toy d', 'uniform float tb;varying', 'uniform float tb;uniform float ty;uniform vec2 yr;varying'),
  ('toy s', "c=floor(c*cq+.5)/cq;gl_FragColor=vec4(c*s,1.);}'});\n    tgM=mkTex", "if(ty>.5){if(gr)c*=vec3(.88,.8,.86);if(!gr&&vY<yr.y-.03){float gl=dot(c,vec3(.299,.587,.114));c=vec3(.6,.62,.66)*(.6+.75*gl);}if(vN.y>.3&&vN.y<.93)s*=1.1;if(vN.y<=.3){float a=clamp((vY-yr.x)/(yr.y-yr.x),0.,1.);s*=mix(.68,1.03,a*a*(3.-2.*a));}}c=floor(c*cq+.5)/cq;gl_FragColor=vec4(c*s,1.);}'});\n    tgM=mkTex"),
  ('toy island merge', 'if(D&&window.__H4){Object.assign(D,window.__H4);window.__H4=null}', 'if(D&&window.__H4){Object.assign(D,window.__H4);window.__H4=null}if(D&&window.__TOYM){Object.assign(D,window.__TOYM);window.__TOYI=1;window.__TOYM=null}'),
  ('toy island place', "if(GM.cisland){const m=mk('cisland',5.51);if(m){m.rotation.y=-Math.PI/2;const k=5.51/.9541;m.position.y+=.13-.4618*k;", "if(GM.cisland){const m=mk('cisland',5.51);if(m){const TI=window.__TOYI;m.rotation.y=TI?-.04:-Math.PI/2;const k=5.51/(TI?.951:.9541);m.position.y+=.13-(TI?.377:.4618)*k;"),
  ('cage fits hero', 'cg.position.set(h.position.x,cg.userData.y,h.position.z);cg.visible=cg.userData.y<4.8}}', 'cg.position.set(h.position.x,cg.userData.y,h.position.z);cg.visible=cg.userData.y<4.8;try{const mm=h.userData.m;if(mm&&cg.userData.fm!==mm){cg.userData.fm=mm;const b=new V.Box3().setFromObject(mm),hh=b.max.y-b.min.y;if(hh>0)cg.scale.setScalar(Math.max(1.3*(window.__cageS||.75),hh*1.1/1.55))}}catch(e){}}}'),
  ('mm real a', 'later(wait,()=>{clr();const foe={n:NM[', 'const AI=()=>{clr();const foe={n:NM['),
  ('mm real b', "later(1600,()=>start(m,foe,rnk(rp),'Opponent found!'))})};\n window.__mmCancel=()=>close();", "later(1600,()=>start(m,foe,rnk(rp),'Opponent found!'))};if(window.__mmReal&&window.__mmReal(m,later,AI,close))return;later(wait,AI)};\n window.__mmCancel=()=>{try{window.__mmStop&&window.__mmStop()}catch(e){}close()};"),
  ('portal jump spots', 'TP[k]={ph:0,t:0,a:WB(vis[k]),b:WB(p.via2)}', 'TP[k]={ph:0,t:0,a:(window.__portSpotL&&window.__portSpotL(k,vis[k]))||WB(vis[k]),b:(window.__portSpotL&&window.__portSpotL(k,p.via2))||WB(p.via2)}'),
  ('models parallel', "<script>(function(){var N=7,i=0,tries=0;function nx(){if(i>=N){var e=document.createElement('script');e.type='application/json';e.id='mdl';e.textContent=window.__MD.join('');window.__MD=null;document.body.appendChild(e);if(window.__mdlRun)window.__mdlRun();return}var s=document.createElement('script');s.src='m/mdl'+i+'.js?v=3'+(tries?'&r='+tries:'');window.__mdlI=i;s.onload=function(){if(window.__MD&&window.__MD[i]!=null){i++;tries=0;nx()}else retry()};s.onerror=retry;document.head.appendChild(s)}function retry(){tries++;if(tries>6)window.__mdlSlow=1;setTimeout(nx,Math.min(4000,800*tries))}nx()})();", "<script>(function(){var N=7,got=0,done=0;window.__MD=window.__MD||[];function fin(){if(done)return;for(var q=0;q<N;q++)if(window.__MD[q]==null)return;done=1;var e=document.createElement('script');e.type='application/json';e.id='mdl';e.textContent=window.__MD.join('');window.__MD=null;document.body.appendChild(e);if(window.__mdlRun)window.__mdlRun()}function one(i,tries){var s=document.createElement('script');s.src='m/mdl'+i+'.js?v=4'+(tries?'&r='+tries:'');s.onload=function(){if(window.__MD&&window.__MD[i]!=null)fin();else retry(i,tries)};s.onerror=function(){retry(i,tries)};document.head.appendChild(s)}function retry(i,tries){tries++;if(tries>6)window.__mdlSlow=1;setTimeout(function(){one(i,tries)},Math.min(4000,800*tries))}for(var k=0;k<N;k++)one(k,0)})();"),
  ('skip unused animated heroes', "const files=Object.values(HERO).concat(MON,['bat']);", "const files=window.__RIGHERO?Object.values(HERO).concat(MON,['bat']):['bat'];"),
  ('mail keeps 30', 'SV.mail=SV.mail.slice(0,8)}', 'SV.mail=SV.mail.filter((m,i)=>i<30||(m.g&&!m.c))}'),
  ('season frame line', '+sw(s)+\'<p class="rsz">A new season has started.', '+sw(s)+(window.__frLine?window.__frLine(s.rk):\'\')+\'<p class="rsz">A new season has started.'),
("collection hero logos follow equipped skin",
 """onclick="c3h('${k}')">${pimg(k)}</button>""",
 """onclick="c3h('${k}')">${window.__hLogo&&__hLogo(k)?'<img alt="" src="'+__hLogo(k)+'">':pimg(k)}</button>"""),
("guild perks: 7 perks, max level 8",
 "GPK=[[2,'Loot box timers -10%',0],[3,'+1 starting AP',1],[4,'+2 starting HP',1],[5,'+5 starting gold',1],[6,'Deck points +1',0],[7,'More guild members',0],[9,'Shard shop discount',0]],glv=()=>(window.__glv&&window.__glv())||Math.min(10,",
 "GPK=[[2,'Loot box timers -10%',1],[3,'+1 starting AP',1],[4,'+2 starting HP',1],[5,'+5 starting gold',1],[6,'Deck points +1',1],[7,'+10 guild members',1],[8,'Shard shop -20%',1]],glv=()=>(window.__glv&&window.__glv())||Math.min(8,"),
("deck max (tg)","else if(d.length<5&&dpts(d)+c.cost<=10&&","else if(d.length<5&&dpts(d)+c.cost<=(window.__dmx?__dmx():10)&&"),
("deck max (grid)","const on=d.includes(c.id),can=d.length<5&&pts+c.cost<=10&&","const on=d.includes(c.id),can=d.length<5&&pts+c.cost<=(window.__dmx?__dmx():10)&&"),
("deck max (why)","pts+sel.cost>10?'Not enough points left'","pts+sel.cost>(window.__dmx?__dmx():10)?'Not enough points left'"),
("deck max (pips)","[1,2,3,4,5,6,7,8,9,10].map(n=>'<i class=\"'+(n<=pts?'on':'')+'\"></i>').join('')+'<span>'+pts+' / 10 points","Array.from({length:(window.__dmx?__dmx():10)},(_,j)=>j+1).map(n=>'<i class=\"'+(n<=pts?'on':'')+'\"></i>').join('')+'<span>'+pts+' / '+(window.__dmx?__dmx():10)+' points"),
("shard discount (card)","<div class=\"ocd\">${pc}<div class=\"otop\"><div class=\"omed\">${pimg(o.h)}</div><div class=\"oqty\"><img alt=\"\" src=\"${U.s_gem}\"><b>×${o.q}</b></div></div><div class=\"onm\">${HD[o.h].n}</div>${price(o.c,o.gem,(o.gem?SV.gems:SV.gold)>=o.c,'buy('+i+')')}",
 "<div class=\"ocd\">${pc}${window.__sdc&&__sdc(o)<o.c?'<span class=\"gbn\">-20%</span>':''}<div class=\"otop\"><div class=\"omed\">${pimg(o.h)}</div><div class=\"oqty\"><img alt=\"\" src=\"${U.s_gem}\"><b>×${o.q}</b></div></div><div class=\"onm\">${HD[o.h].n}</div>${price(window.__sdc?__sdc(o):o.c,o.gem,(o.gem?SV.gems:SV.gold)>=(window.__sdc?__sdc(o):o.c),'buy('+i+')')}"),
("shard discount (buy)","function buy(i){const o=SV.offers[i],k=o.gem?'gems':'gold';if(SV[k]>=o.c){SV[k]-=o.c;","function buy(i){const o=SV.offers[i],k=o.gem?'gems':'gold',cc=window.__sdc?__sdc(o):o.c;if(SV[k]>=cc){SV[k]-=cc;"),
("nav labels (Pix 26 Nov)","[['shop','Shop'],['coll','Collection'],['main','Battle'],['comm','Community'],['jour','Journal']]","[['shop','Shop'],['coll','Arsenal'],['main','Play'],['comm','Social'],['jour','Quests']]"),
('rename (used to upgrade bas','(used to upgrade bases in Collection → Base)','(used to upgrade bases in Arsenal → Base)'),
('rename gear in Collection →','gear in Collection → Hero.','gear in Arsenal → Hero.'),
('rename bases in Collection ','bases in Collection → Base.','bases in Arsenal → Base.'),
("rename coll:{name:'Collecti","coll:{name:'Collection'","coll:{name:'Arsenal'"),
("rename comm:{name:'Communit","comm:{name:'Community'","comm:{name:'Social'"),
("rename jour:{name:'Journal'","jour:{name:'Journal'","jour:{name:'Quests'"),
("rename ['coll','🃏','Collect","['coll','🃏','Collection'],['main','⚔️','Main'],['comm','👥','Community'],['jour','📜','Journal']","['coll','🃏','Arsenal'],['main','⚔️','Play'],['comm','👥','Social'],['jour','📜','Quests']"),
('rename hero shards</b> here','hero shards</b> here. Use them in the <b>Collection</b> page','hero shards</b> here. Use them in the <b>Arsenal</b> page'),
('rename base blueprints</b> ','base blueprints</b> here. Use them in the <b>Collection</b> page','base blueprints</b> here. Use them in the <b>Arsenal</b> page'),
("cel bands soft edges (fire base blotches)","float qq=lf>.75?1.18:lf>.4?1.0:.8;","float qq=.8+.2*smoothstep(.3,.5,lf)+.18*smoothstep(.65,.85,lf);"),
("lava is not rock (fire base blotches)","c.r>c.g*1.2&&c.b<c.g&&vN.y<.55","c.r>c.g*1.2&&c.b<c.g&&vN.y<.55&&c.r<.62"),
]
import os
def tile_model(s):
    # new Meshy tile (25 Nov) replaces the V3 tile GLB; it keeps its own painted cliffs (no procedural rock)
    k='<script id="v3_22">(function(){const B=\'';i=s.find(k);assert i>0,'tile model';i+=len(k);j=s.find("'",i)
    TOY=True  # toy pass tile (25 Nov); False = previous Meshy tile
    nb=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'assets','tile_toy.b64' if TOY else 'tile.b64')).read().strip()
    s=s[:i]+nb+s[j:];return s.replace('<script id="v3_22">',('<script>window.__TNEW=1;window.__TTOY=1</script>' if TOY else '<script>window.__TNEW=1</script>')+'<script id="v3_22">',1)
def apply(s):
    s=tile_model(s)
    for t in P:
        n,o,w=t[:3];k=t[3] if len(t)>3 else 1
        c=s.count(o)
        assert c==k, f'patch "{n}": found {c} times'
        s=s.replace(o,w)
    return s
