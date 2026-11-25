import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    for w,h,n in [(412,892,'p'),(360,740,'q'),(1366,620,'r')]:
      pg=await b.new_page(viewport={'width':w,'height':h});await pg.route('https://www.gstatic.com/**',lambda r:r.abort())
      pg.on('console',lambda m:print('LOG',m.text) if 'battle' in m.text else None)
      await pg.goto('http://localhost:8766/index.html');await pg.wait_for_timeout(3500)
      await pg.evaluate("()=>{document.getElementById('splash').style.display='none';SV.mt=SV.mt||{};['main','comm','shop','coll','jour','bat','batl'].forEach(k=>SV.mt[k]=1);SV.m1=1;document.getElementById('menu').style.display='flex';tab='main';menu('main')}");await pg.wait_for_timeout(800)
      await pg.screenshot(path=n+'0.png')
      if n=='p':
        await pg.click('.b4r .b4c >> nth=0');await pg.wait_for_timeout(500);await pg.screenshot(path=n+'1.png')
        await pg.click('.bs .b4c >> nth=0');await pg.wait_for_timeout(500);await pg.screenshot(path=n+'2.png')
        await pg.click('.bs .b4a.r');await pg.wait_for_timeout(400);await pg.click('.b4s .b4a.r >> nth=0');await pg.wait_for_timeout(400);await pg.screenshot(path=n+'3.png')
        print('state',await pg.evaluate("()=>[SV.mine,SV.base]"))
        await pg.click('.b4cu');await pg.wait_for_timeout(400);print('skin pop',await pg.evaluate("()=>!!document.querySelector('#menu .skw')"))
        await pg.evaluate("()=>document.querySelector('#menu .mpop').remove()")
        await pg.evaluate("()=>{window.__loadF=()=>1}");await pg.click('.b4m.ca');await pg.wait_for_timeout(1200);print('match started',await pg.evaluate("()=>getComputedStyle(document.getElementById('menu')).display"));await pg.screenshot(path='p4.png')
      else:
        await pg.evaluate("()=>{m3h('k');m3b('forest')}");await pg.wait_for_timeout(500);await pg.screenshot(path=n+'2.png')
      await pg.close()
    await b.close()
asyncio.run(main())
