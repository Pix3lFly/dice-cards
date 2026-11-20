import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    for w,h in [(1366,620),(390,844),(1366,768)]:
      pg=await b.new_page(viewport={'width':w,'height':h})
      await pg.route('https://www.gstatic.com/**',lambda r:r.abort())
      await pg.goto('http://localhost:8766/index.html');await pg.wait_for_timeout(3000)
      await pg.evaluate("()=>{document.getElementById('splash').style.display='none';SV.mt=SV.mt||{};['main','comm','shop','coll','jour','bat','batl'].forEach(k=>SV.mt[k]=1)}")
      await pg.evaluate("()=>{tab='jour';menu('jour');const t=[...document.querySelectorAll('#mb [onclick]')].find(e=>/Achiev/.test(e.textContent));t&&t.click()}");await pg.wait_for_timeout(500)
      await pg.screenshot(path=f'ach_{w}x{h}.png')
      await pg.evaluate("()=>{tab='shop';menu('shop');const t=[...document.querySelectorAll('#mb [onclick]')].find(e=>/Gold/.test(e.textContent));t&&t.click()}");await pg.wait_for_timeout(500)
      await pg.screenshot(path=f'shop_{w}x{h}.png')
      if w==390:
        print(await pg.evaluate("()=>{const g=document.querySelector('.gpk3');return g.outerHTML.replace(/src=\"[^\"]{60,}\"/g,'src=..').slice(0,900)}"))
        print(await pg.evaluate("()=>{const r=e=>{const s=getComputedStyle(e);return e.className+' pos:'+s.position+' '+s.bottom+' '+s.display+' '+s.justifyContent};return [...document.querySelectorAll('.ocd, .ocd .opr, .gpk3 > *, .gpk3 button')].slice(0,12).map(r).join('\\n')}"))
      await pg.close()
    await b.close()
asyncio.run(main())
