import asyncio,sys
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    pg=await b.new_page(viewport={'width':1366,'height':768})
    await pg.route('https://www.gstatic.com/**',lambda r:r.abort())
    await pg.goto('http://localhost:8766/index.html');await pg.wait_for_timeout(3000)
    await pg.evaluate("()=>{document.getElementById('splash').style.display='none';SV.mt=SV.mt||{};['main','comm','shop','coll','jour','bat','batl'].forEach(k=>SV.mt[k]=1)}")
    await pg.evaluate("()=>{tab='shop';menu('shop');const t=[...document.querySelectorAll('#mb [onclick]')].find(e=>/Gold/.test(e.textContent));t&&t.click()}");await pg.wait_for_timeout(500)
    print(await pg.evaluate("()=>[...document.querySelectorAll('#mb, #mb .spn2, #mb .spn2 > *, .gpk3 > .ogr, .ocd')].map(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return e.className+' h='+Math.round(r.height)+' minh='+s.minHeight+' flex='+s.flex}).join('\\n')"))
    print(await pg.evaluate("()=>matchMedia('(orientation:landscape)').matches"))
    await b.close()
asyncio.run(main())
