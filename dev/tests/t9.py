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
    await pg.evaluate("()=>{window.__loadF=()=>1;SV.m1=1;SV.played=1}");await pg.click('#bgn',force=True);await pg.wait_for_timeout(800)
    await pg.evaluate("()=>{document.querySelectorAll('#menu .mpop').forEach(x=>x.remove());SV.mt=SV.mt||{};['main','comm','shop','coll','jour','bat','batl'].forEach(k=>SV.mt[k]=1);document.querySelectorAll('#tut3').forEach(x=>x.style.display='none');tab='comm';CMT='fr';menu()}")
ACT="""()=>{if(!P||over)return 'over:'+over;const tut=document.getElementById('tut3');if(tut)tut.style.display='none';
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
    for k in range(6):
      await A.evaluate(ACT);await B.evaluate(ACT);await A.wait_for_timeout(1500)
    mode=__import__('sys').argv[1]
    if mode=='ff':
      await A.evaluate("()=>forfeit()");await A.wait_for_timeout(4000)
      print('A:',await A.evaluate("()=>document.getElementById('ovt').textContent+' | '+document.getElementById('ovr').textContent"))
      print('B:',await B.evaluate("()=>document.getElementById('ovt').textContent+' | '+document.getElementById('ovr').textContent"))
    else:
      t=time.time();await bb.close()
      for k in range(40):
        await A.wait_for_timeout(1000)
        o=await A.evaluate("()=>document.getElementById('ovt').textContent")
        if o:print('A after %.0fs:'%(time.time()-t),o,'|',await A.evaluate("()=>document.getElementById('ovr').textContent"));break
      await ba.close();return
    gold=await A.evaluate("()=>SV.gold+'/'+SV.played");print('A gold/played',gold)
    await ba.close();await bb.close()
asyncio.run(main())
