import asyncio,time,json
from playwright.async_api import async_playwright
MOCK=open('/home/claude/t/mockfb3.js').read()
async def mk(p,host,tag):
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    pg=await b.new_page(viewport={'width':390,'height':844})
    pg.on('pageerror',lambda e:print(tag,'PAGEERR',str(e)[:200]))
    pg.on('console',lambda m:print(tag,'LOG',m.text[:200]) if any(k in m.text for k in ['live','v4']) else None)
    async def route(r):await r.fulfill(status=200,content_type='text/javascript',body=MOCK if 'app-compat' in r.request.url else '')
    await pg.route('https://www.gstatic.com/**',route)
    await pg.goto(f'http://{host}:8766/index.html');await pg.wait_for_timeout(3500)
    return b,pg
async def reg(pg,mail):
    await pg.click('#splash .xau button >> nth=1');await pg.wait_for_timeout(200)
    await pg.fill('#acp input[type=email]',mail);await pg.fill('#acp input[type=password]','secret1');await pg.click('#acp .acm');await pg.wait_for_timeout(3000)
async def enter(pg):
    await pg.evaluate("()=>{window.__loadF=()=>1;SV.played=1}");await pg.click('#bgn',force=True);await pg.wait_for_timeout(800)
    await pg.evaluate("()=>{document.querySelectorAll('#menu .mpop').forEach(x=>x.remove());SV.mt=SV.mt||{};['main','comm','shop','coll','jour','bat','batl'].forEach(k=>SV.mt[k]=1);document.querySelectorAll('#tut3').forEach(x=>x.style.display='none');tab='comm';CMT='fr';menu()}")
ACT="""()=>{if(!P||over)return 'over:'+over;if(typeof RO!=='undefined'&&RO&&!RO.fin&&!RO.a&&!RO.spin){doRoll();return 'roll'}const tut=document.getElementById('tut3');if(tut)tut.style.display='none';
 const up=document.getElementById('upm');if(up&&up.style.display!=='none'){pk(Math.max(0,P[0].sk.findIndex(l=>l<3)));return 'pk'}
 if(FT){if(FT.shop)bl();else fp(-1);return 'ft'}
 if(cur===0&&!busy){const p=P[0];if(p.jail){escape(0);return 'esc'}const i=p.hand.findIndex(c=>!c.sp);if(i>=0){play(0,i);return 'play'}end();return 'end'}return 'wait'}"""
ST="""()=>P?{cur,busy,over,round,q:(window.__LIVE()&&__LIVE().q.length)||0,P:P.map(p=>({hp:p.hp,max:p.max,g:p.gold,pos:p.pos,lv:p.lv,ap:p.ap,jail:p.jail,h:p.hand.map(c=>c.n).join(','),d:p.deck.length,sk:p.sk.join('')})),T:T.join(',')}:null"""
def mirT(t):a=t.split(',');return ','.join(a[(i+12)%24] for i in range(24))
async def main():
  async with async_playwright() as p:
    ba,A=await mk(p,'localhost','A');bb,B=await mk(p,'127.0.0.1','B')
    await reg(A,'a@x.com');await reg(B,'b@x.com');await enter(A);await enter(B)
    bn=await B.evaluate("()=>__FRON.prof.num")
    await A.evaluate("()=>frAddPop()");await A.fill('#frn',bn);await A.evaluate("()=>frSend()");await A.wait_for_timeout(1500)
    await B.evaluate("()=>{menu();const r=SV.frReq[0];frAcc(r.id,1)}");await B.wait_for_timeout(2000)
    await A.evaluate("()=>menu()");bid=await A.evaluate("()=>__friends()[0].id")
    await A.evaluate("(id)=>fbat(id)",bid);await A.wait_for_timeout(1500);await B.evaluate("()=>__ivAns(1)")
    await A.wait_for_timeout(9000)
    print('live A',await A.evaluate("()=>{const l=__LIVE();return l&&{host:l.host,wait:l.wait}}"),'live B',await B.evaluate("()=>{const l=__LIVE();return l&&{host:l.host}}"))
    for k in range(40):
      await A.evaluate(ACT);await B.evaluate(ACT)
      ia=await A.evaluate("()=>document.getElementById('intro').innerText.replace(/\\s+/g,' ')");ib=await B.evaluate("()=>document.getElementById('intro').innerText.replace(/\\s+/g,' ')")
      if 'first!' in ia and 'first!' in ib:print('ROLL A:',ia[-60:]);print('ROLL B:',ib[-60:]);break
      await A.wait_for_timeout(300)
    t0=time.time();last=None;turns=0;mism=0;checks=0;nextq=t0+40
    def mp(x):y=dict(x);y['pos']=(y['pos']+12)%24;return y
    while time.time()-t0<1100:
      if time.time()>nextq:
        # quiet check: only finish open popups, let everything settle, then compare
        for k in range(14):
          await A.wait_for_timeout(700)
          sa=await A.evaluate(ST);sb=await B.evaluate(ST)
          busyA=await A.evaluate("()=>!!FT||document.getElementById('upm').style.display!=='none'");busyB=await B.evaluate("()=>!!FT||document.getElementById('upm').style.display!=='none'")
          if busyA:await A.evaluate(ACT)
          if busyB:await B.evaluate(ACT)
          if sa and sb and sa['q']==0 and sb['q']==0 and ((sa['cur']==0 and not sa['busy']) or (sb['cur']==0 and not sb['busy'])) and k>=8:break
        X,Y=(sa,sb)
        checks+=1
        ok=X['P'][0]==mp(Y['P'][1]) and X['P'][1]==mp(Y['P'][0]) and mirT(X['T'])==Y['T'] and X['round']==Y['round']
        print('CHECK',int(time.time()-t0),'s round',X['round'],Y['round'],'OK' if ok else 'MISMATCH')
        if X['round']==getattr(main,'lr',None):
          D="()=>({cur,busy,over,FT:FT&&Object.keys(FT),jail:P.map(p=>p.jail+'/'+p.skip+'/'+p.pts),L:__LIVE()&&{q:__LIVE().q.length,done:__LIVE().done,wait:__LIVE().wait,nextN:__LIVE().nextN,got:Object.keys(__LIVE().got),off:__LIVE().off,seq:__LIVE().seq,out:__LIVE().out.length},vt:window.__vt,intro:document.getElementById('intro').style.display,ov:document.getElementById('ov').style.display,upm:document.getElementById('upm').style.display,fgt:document.getElementById('fgt').style.display,st:document.getElementById('st').textContent,logs:logs.slice(-4)})"
          print('  A',json.dumps(await A.evaluate(D)));print('  B',json.dumps(await B.evaluate(D)));break
        main.lr=X['round']
        if not ok:
          mism+=1;print('   A',json.dumps(X['P']),'\n   B',json.dumps([mp(Y['P'][1]),mp(Y['P'][0])]),mirT(X['T'])==Y['T'])
        nextq=time.time()+40
      ra=await A.evaluate(ACT);rb=await B.evaluate(ACT)
      sa=await A.evaluate(ST);sb=await B.evaluate(ST)
      if sa and sb and sa['cur']!=last: last=sa['cur'];turns+=1
      if sa and sa['over'] or sb and sb['over']:
        print('OVER at',int(time.time()-t0),'s');await A.wait_for_timeout(4000);break
      await A.wait_for_timeout(500)
    sa=await A.evaluate(ST);sb=await B.evaluate(ST)
    print('turn changes',turns,'checks',checks,'mismatches',mism)
    print('A:',sa['round'],[ (x['hp'],x['g'],x['pos']) for x in sa['P']],'over',sa['over'])
    print('B:',sb['round'],[ (x['hp'],x['g'],x['pos']) for x in sb['P']],'over',sb['over'])
    print('ovt A:',await A.evaluate("()=>document.getElementById('ovt').textContent+' | '+document.getElementById('ovr').textContent"))
    print('ovt B:',await B.evaluate("()=>document.getElementById('ovt').textContent+' | '+document.getElementById('ovr').textContent"))
    await A.screenshot(path='l1.png');await B.screenshot(path='l2.png')
    await ba.close();await bb.close()
asyncio.run(main())
