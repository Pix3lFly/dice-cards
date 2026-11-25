import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    pg=await b.new_page(viewport={'width':412,'height':892});await pg.route('https://www.gstatic.com/**',lambda r:r.abort())
    await pg.goto('http://localhost:8766/index.html');await pg.wait_for_timeout(3500)
    await pg.evaluate("()=>{document.getElementById('splash').style.display='none';SV.m1=1;SV.mt=SV.mt||{};['main','comm','shop','coll','jour','bat','batl'].forEach(k=>SV.mt[k]=1);document.getElementById('menu').style.display='flex';tab='coll';menu('coll');cTab('hero')}");await pg.wait_for_timeout(800)
    await pg.screenshot(path='c1.png')
    await pg.evaluate("()=>{cTab('base')}");await pg.wait_for_timeout(1500);await pg.screenshot(path='c2.png')
    await b.close()
asyncio.run(main())
