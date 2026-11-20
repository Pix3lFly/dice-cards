import asyncio,sys
from playwright.async_api import async_playwright
PAGES=[('shop',"tab='shop';menu('shop');const t=[...document.querySelectorAll('#mb [onclick]')].find(e=>/Gold/.test(e.textContent));t&&t.click()"),('coll',"tab='coll';menu('coll')")]
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    for w,h,tag in [(1366,620,'pc'),(390,844,'ph')]:
      pg=await b.new_page(viewport={'width':w,'height':h})
      await pg.route('https://www.gstatic.com/**',lambda r:r.abort())
      await pg.goto('http://localhost:8766/index.html');await pg.wait_for_timeout(3000)
      await pg.evaluate("()=>{document.getElementById('splash').style.display='none';SV.mt=SV.mt||{};['main','comm','shop','coll','jour','bat','batl'].forEach(k=>SV.mt[k]=1)}")
      for n,js in PAGES:
        await pg.evaluate("()=>{"+js+"}");await pg.wait_for_timeout(500)
        await pg.evaluate("()=>document.querySelectorAll('#tut3').forEach(x=>x.style.display='none')")
        await pg.screenshot(path=f'p_{n}_{tag}.png')
      if tag=='pc':
        pass
      await pg.close()
    await b.close()
asyncio.run(main())
