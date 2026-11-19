import asyncio,time
from playwright.async_api import async_playwright
MOCK=open('/home/claude/t/mockfb3.js').read()
async def mk(p,host):
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    pg=await b.new_page(viewport={'width':390,'height':844})
    pg.on('pageerror',lambda e:print(host,'PAGEERR',e))
    pg.on('console',lambda m:print(host,'LOG',m.text) if any(k in m.text for k in ['invite','accept','ig ','v4']) else None)
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
pop=lambda pg: pg.evaluate("()=>{const p=document.querySelector('#menu .mpop');return p?p.innerText.replace(/\\s+/g,' ').trim():'(none)'}")
inmatch=lambda pg: pg.evaluate("()=>getComputedStyle(document.getElementById('menu')).display==='none'")
async def main():
  async with async_playwright() as p:
    ba,A=await mk(p,'localhost');bb,B=await mk(p,'127.0.0.1')
    await reg(A,'a@x.com');await reg(B,'b@x.com');await enter(A);await enter(B)
    bn=await B.evaluate("()=>__FRON.prof.num");print('B num',bn)
    await A.evaluate("()=>frAddPop()");await A.fill('#frn',bn);await A.evaluate("()=>frSend()");await A.wait_for_timeout(1500)
    await B.evaluate("()=>{menu();const r=SV.frReq[0];frAcc(r.id,1)}");await B.wait_for_timeout(2000)
    fb=await A.evaluate("()=>{menu();return __friends().map(f=>f.n+' on:'+f.on)}");print('A friends',fb)
    bid=await A.evaluate("()=>__friends()[0].id")
    # 1 refuse
    await A.evaluate("(id)=>fbat(id)",bid);await A.wait_for_timeout(1500)
    print('A waiting:',await pop(A));print('B popup:',await pop(B))
    await B.screenshot(path='i1.png');await A.screenshot(path='i0.png')
    await B.evaluate("()=>__ivAns(0)");await A.wait_for_timeout(1500)
    print('A after refuse:',await pop(A),'| B:',await pop(B))
    await A.evaluate("()=>__ivClose()")
    # 2 no response
    t=time.time();await A.evaluate("(id)=>fbat(id)",bid);await A.wait_for_timeout(1500);print('B popup2:',await pop(B))
    await A.wait_for_timeout(30000)
    print('A after 30s (%.0fs):'%(time.time()-t),await pop(A),'| B:',await pop(B))
    await A.screenshot(path='i2.png')
    await A.evaluate("()=>__ivClose()")
    # 3 B in a game
    await B.evaluate("()=>{document.querySelectorAll('#menu .mpop').forEach(x=>x.remove());go('train')}");await B.wait_for_timeout(3500)
    print('B in match:',await inmatch(B))
    await A.evaluate("()=>menu()");await A.evaluate("(id)=>fbat(id)",bid);await A.wait_for_timeout(800)
    print('A in-game check:',await pop(A))
    await A.evaluate("()=>__ivClose()")
    # back to menu for B
    await B.reload();await B.wait_for_timeout(4000);await enter(B);await B.wait_for_timeout(2500)
    # 4 accept
    await A.evaluate("()=>menu()");await A.evaluate("(id)=>fbat(id)",bid);await A.wait_for_timeout(1500)
    print('B popup4:',await pop(B))
    await B.evaluate("()=>__ivAns(1)");await A.wait_for_timeout(1200)
    print('A countdown:',await pop(A),'| B countdown:',await pop(B))
    await A.screenshot(path='i3.png')
    await A.wait_for_timeout(4500)
    print('A in match:',await inmatch(A),'B in match:',await inmatch(B))
    print('dbg A:',await A.evaluate("()=>['menu','bdLoad','intro','splash','ov','tut3'].map(id=>{const e=document.getElementById(id);return id+':'+(e?getComputedStyle(e).display:'-')}).join(' ')+' foe:'+JSON.stringify(window.__foe)+' mode:'+mode"))
    print('foes:',await A.evaluate("()=>P[1].name+'/'+P[1].h"),await B.evaluate("()=>P[1].name+'/'+P[1].h"))
    await ba.close();await bb.close()
asyncio.run(main())
