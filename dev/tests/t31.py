import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    for w,h in [(360,780),(412,915),(1366,620)]:
      pg=await b.new_page(viewport={'width':w,'height':h})
      await pg.route('https://www.gstatic.com/**',lambda r:r.abort())
      await pg.goto('http://localhost:8766/index.html');await pg.wait_for_timeout(3500)
      await pg.screenshot(path=f'sp_{w}.png')
      await pg.close()
    pg=await b.new_page(viewport={'width':1366,'height':620})
    await pg.route('https://www.gstatic.com/**',lambda r:r.abort())
    await pg.goto('http://localhost:8766/index.html');await pg.wait_for_timeout(2500)
    await pg.evaluate("()=>{document.getElementById('splash').style.display='none';SV.mt=SV.mt||{};['main','comm','shop','coll','jour','bat','batl'].forEach(k=>SV.mt[k]=1);tab='jour';JT='ach';menu('jour')}");await pg.wait_for_timeout(500)
    r=await pg.evaluate("()=>{const r=document.querySelector('#mb .dq3').getBoundingClientRect();return [r.x+r.width/2,r.y+20]}")
    await pg.mouse.move(*r);await pg.mouse.wheel(0,200);await pg.wait_for_timeout(500)
    print('wheel over quests -> alist top',await pg.evaluate("()=>document.querySelector('#mb .alist').scrollTop"))
    await b.close()
asyncio.run(main())
