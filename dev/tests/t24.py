import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox','--disable-features=OverlayScrollbar,OverlayScrollbars'],ignore_default_args=['--hide-scrollbars'])
    pg=await b.new_page(viewport={'width':1366,'height':620})
    await pg.route('https://www.gstatic.com/**',lambda r:r.abort())
    await pg.goto('http://localhost:8766/index.html');await pg.wait_for_timeout(3000)
    await pg.evaluate("()=>{document.getElementById('splash').style.display='none';SV.mt=SV.mt||{};['main','comm','shop','coll','jour','bat','batl'].forEach(k=>SV.mt[k]=1);tab='jour';JT='ach';menu('jour')}");await pg.wait_for_timeout(500)
    print(await pg.evaluate("()=>{const a=document.querySelector('#mb .alist'),s=getComputedStyle(a);return [a.scrollHeight,a.clientHeight,a.offsetWidth-a.clientWidth,s.overflowY,s.scrollbarWidth]}"))
    await pg.evaluate("()=>{document.querySelector('#mb .alist').scrollTop=200}")
    await pg.screenshot(path='u_achpc2.png',clip={'x':380,'y':140,'width':620,'height':260})
    await b.close()
asyncio.run(main())
