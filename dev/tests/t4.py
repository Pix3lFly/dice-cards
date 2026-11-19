import asyncio,json
from playwright.async_api import async_playwright
MOCK=open('/home/claude/t/mockfb2.js').read()
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    pg=await b.new_page(viewport={'width':390,'height':844})
    logs=[];pg.on('console',lambda m:logs.append(m.text) if ('fr' in m.text or 'v4' in m.text or 'name' in m.text or 'beat' in m.text or 'profile' in m.text) else None)
    pg.on('pageerror',lambda e:logs.append('PAGEERR '+str(e)))
    async def route(r):await r.fulfill(status=200,content_type='text/javascript',body=MOCK if 'app-compat' in r.request.url else '')
    await pg.route('https://www.gstatic.com/**',route)
    E=pg.evaluate
    async def fresh():
      await E("()=>{try{firebase.auth().signOut()}catch(e){}localStorage.clear()}");await pg.reload();await pg.wait_for_timeout(3500)
    async def reg(mail):
      await pg.click('#splash .xau button >> nth=1');await pg.wait_for_timeout(200)
      await pg.fill('#acp input[type=email]',mail);await pg.fill('#acp input[type=password]','secret1');await pg.click('#acp .acm');await pg.wait_for_timeout(2500)
    async def login(mail):
      await pg.click('#splash .xau button >> nth=0');await pg.wait_for_timeout(200)
      await pg.fill('#acp input[type=email]',mail);await pg.fill('#acp input[type=password]','secret1');await pg.click('#acp .acm');await pg.wait_for_timeout(4000)
    async def friends():
      await pg.click('#bgn',force=True);await pg.wait_for_timeout(800)
      await E("()=>{document.querySelectorAll('#menu .mpop').forEach(x=>x.remove());SV.mt=SV.mt||{};['main','comm','shop','coll','jour','bat','batl'].forEach(k=>SV.mt[k]=1);document.querySelectorAll('#tut3').forEach(x=>x.style.display='none');tab='comm';CMT='fr';menu()}");await pg.wait_for_timeout(400)
      return await E("()=>[...document.querySelectorAll('#mb .fr3, #mb .frh, #mb .fr0, #mb .dnt')].map(x=>x.className+': '+x.textContent.replace(/\\s+/g,' ').trim()).join('\\n')")
    db=lambda: E("()=>Object.keys(JSON.parse(sessionStorage.getItem('mock_db')))")
    await pg.goto('http://localhost:8765/index.html');await pg.wait_for_timeout(3000)
    await reg('a@x.com')
    A=await E("()=>({pname:SV.pname,prof:__FRON.prof})");print('A:',A['pname'],A['prof'] and A['prof']['num'])
    print('db:',await db())
    print('A friends page:\n'+await friends())
    await pg.screenshot(path='f1.png')
    # B
    await fresh();await reg('b@x.com')
    B=await E("()=>({pname:SV.pname,prof:__FRON.prof})");print('B:',B['pname'],B['prof']['num'])
    await friends()
    for q in ['nosuchname','12345678',A['prof']['num'],A['pname'],'b@x.com']:
      await E("()=>frAddPop()");await pg.wait_for_timeout(100);await pg.fill('#frn',q);await E("()=>frSend()");await pg.wait_for_timeout(600)
      print(' add',q,'->',await E("()=>{const m=document.getElementById('frm');return m?m.textContent:'(closed) '+([...document.querySelectorAll('.m3note')].map(x=>x.textContent).join('|'))}"))
      await E("()=>soClose()")
    print('B page:\n'+await E("()=>{menu();return [...document.querySelectorAll('#mb .fr3, #mb .frh')].map(x=>x.textContent.replace(/\\s+/g,' ').trim()).join('\\n')}"))
    # A accepts
    await fresh();await login('a@x.com')
    print('A after login pname:',await E("()=>SV.pname"))
    print('A page with request:\n'+await friends())
    await pg.screenshot(path='f2.png')
    await E("()=>{const r=SV.frReq[0];frAcc(r.id,1)}");await pg.wait_for_timeout(1200)
    print('A after accept:\n'+await E("()=>{menu();return [...document.querySelectorAll('#mb .fr3, #mb .frh')].map(x=>x.textContent.replace(/\\s+/g,' ').trim()).join('\\n')}"))
    await pg.screenshot(path='f3.png')
    # rename taken / ok
    await E("()=>{__pfOpen();__pfEdit()}");await pg.wait_for_timeout(200)
    await pg.fill('#pfnm',B['pname'].upper());await E("()=>__pfSave()");await pg.wait_for_timeout(500)
    print('rename to B name:',await E("()=>(document.querySelector('.pner')||{}).textContent"))
    await pg.fill('#pfnm','bad name!');await E("()=>__pfSave()");await pg.wait_for_timeout(300)
    print('rename bad:',await E("()=>(document.querySelector('.pner')||{}).textContent"))
    await pg.fill('#pfnm','DiceKing_7');await E("()=>__pfSave()");await pg.wait_for_timeout(700)
    print('rename ok:',await E("()=>SV.pname+' prof:'+__FRON.prof.name+' num row:'+(document.querySelector('.pnum')||{}).textContent"))
    await pg.screenshot(path='f4.png')
    print('names:',[k for k in await db() if k.startswith('names/')])
    # friend profile shows number; battle button message
    await E("()=>soClose()")
    fid=await E("()=>__friends()[0].id");await E("(id)=>fbat(id)",fid);await pg.wait_for_timeout(300)
    print('battle:',await E("()=>document.querySelector('#menu .mpop').textContent"))
    await E("()=>soClose()")
    # B sees friend + renamed A ; B removes
    await fresh();await login('b@x.com');print('B page:\n'+await friends())
    await E("()=>frDel(__friends()[0].id)");await pg.wait_for_timeout(800)
    print('B after remove:',await E("()=>{menu();return __friends().length}"),[k for k in await db() if k.startswith('friends/')])
    print('\n'.join(logs[-15:]))
    await b.close()
asyncio.run(main())
