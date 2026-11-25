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
 ('spectre board tint', "m.userData.__spB=1;m.color.lerp(new G.V.Color(0xdff6ff),.6);if(m.emissive){m.emissive.setRGB(.22,.32,.38)}", "m.userData.__spB=1;if(window.__H4S){if(m.emissive)m.emissive.setRGB(.08,.16,.2)}else{m.color.lerp(new G.V.Color(0xdff6ff),.6);if(m.emissive){m.emissive.setRGB(.22,.32,.38)}}"),
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
 ('base spot on corner', "const d=(i?.38:-.38)*1.14;w.x+=d;w.z+=d", "const d=(i?.38:-.38)*1.14*(window.__WBk!=null?window.__WBk:0);w.x+=d;w.z+=d"),
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
 ('tile smooth on', 'tgM=mkTex(T.map,0xffffff,.06);tgMe=mkTex(T.map,0xcdb68a,.06);tgM.userData.__ct=tgMe.userData.__ct=1}', 'tgM=mkTex(T.map,0xffffff,.06);tgMe=mkTex(T.map,0xcdb68a,.06);tgM.userData.__ct=tgMe.userData.__ct=1;if(window.__TSM!==0)[tgM,tgMe].forEach(m=>{m.uniforms.sm.value=1;m.uniforms.cq.value=28;m.uniforms.ck.value=.75;if(window.__TNEW){m.uniforms.ry.value=-99;m.uniforms.ck.value=.45;m.uniforms.tn.value.multiplyScalar(1.12)}})}'),
]
import os
def tile_model(s):
    # new Meshy tile (25 Nov) replaces the V3 tile GLB; it keeps its own painted cliffs (no procedural rock)
    k='<script id="v3_22">(function(){const B=\'';i=s.find(k);assert i>0,'tile model';i+=len(k);j=s.find("'",i)
    nb=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'assets','tile.b64')).read().strip()
    s=s[:i]+nb+s[j:];return s.replace('<script id="v3_22">','<script>window.__TNEW=1</script><script id="v3_22">',1)
def apply(s):
    s=tile_model(s)
    for t in P:
        n,o,w=t[:3];k=t[3] if len(t)>3 else 1
        c=s.count(o)
        assert c==k, f'patch "{n}": found {c} times'
        s=s.replace(o,w)
    return s
