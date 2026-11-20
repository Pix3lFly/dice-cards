import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    pg=await b.new_page(viewport={'width':390,'height':844})
    await pg.route('https://www.gstatic.com/**',lambda r:r.abort())
    await pg.goto('http://localhost:8766/index.html');await pg.wait_for_timeout(3000)
    await pg.evaluate("()=>{document.getElementById('splash').style.display='none';SV.mt=SV.mt||{};['main','comm','shop','coll','jour','bat','batl'].forEach(k=>SV.mt[k]=1)}")
    async def cls(js):
      await pg.evaluate("()=>{"+js+"}");await pg.wait_for_timeout(400)
      return await pg.evaluate("()=>[...document.querySelectorAll('#mb > *, #mb .spn2 > *')].map(e=>e.className+(getComputedStyle(e).overflowY!=='visible'?'[ov:'+getComputedStyle(e).overflowY+']':'')).join(' | ')")
    print('ACH:',await cls("tab='jour';menu('jour');const t=[...document.querySelectorAll('#mb [onclick]')].find(e=>/Achiev/.test(e.textContent));t&&t.click()"))
    print('COLL:',await cls("tab='coll';menu('coll')"))
    print('SHOP:',await cls("tab='shop';menu('shop');const t=[...document.querySelectorAll('#mb [onclick]')].find(e=>/Gold/.test(e.textContent));t&&t.click()"))
    print(await pg.evaluate("()=>{const a=document.querySelector('.ogr .ofc, .ogr > *'),g=document.querySelector('.gpk3 > *');const d=e=>e.outerHTML.replace(/src=\"[^\"]{60,}\"/g,'src=..').slice(0,600);return 'GOLD ITEM: '+d(a)+'\\nGEM ITEM: '+d(g)}"))
    await b.close()
asyncio.run(main())
