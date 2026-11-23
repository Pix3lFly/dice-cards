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
 # board tutorial: Back / Next buttons instead of tap anywhere
 ('tutorial buttons', "'<small>Tap anywhere to continue</small></div>';try{window.__tutP&&window.__tutP(s.x,r,bx,ar)}catch(e){}}",
  "'<div class=\"tnv\"><button class=\"bt tbk\" '+(k?'':'disabled')+'>◀ Back</button><button class=\"bt tnx\">'+(k===STEPS.length-1?'Done ✓':'Next ▶')+'</button></div></div>';bx.querySelector('.tbk').onclick=e=>{e.stopPropagation();if(k>0){k--;show();try{snd(500,.05,'triangle')}catch(x){}}};bx.querySelector('.tnx').onclick=e=>{e.stopPropagation();k++;show();try{snd(600,.05,'triangle')}catch(x){}};try{window.__tutP&&window.__tutP(s.x,r,bx,ar)}catch(e){}}"),
 ('tutorial no tap', "T3.addEventListener('click',()=>{if(k>=STEPS.length)return;k++;show();try{snd(600,.05,'triangle')}catch(e){}});", ""),
]
def apply(s):
    for t in P:
        n,o,w=t[:3];k=t[3] if len(t)>3 else 1
        c=s.count(o)
        assert c==k, f'patch "{n}": found {c} times'
        s=s.replace(o,w)
    return s
