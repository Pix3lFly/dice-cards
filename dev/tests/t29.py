import asyncio,sys
from playwright.async_api import async_playwright
H=int(sys.argv[1]) if len(sys.argv)>1 else 480
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    pages={'jour-rew':"tab='jour';JT='rew';menu('jour')",'ach':"tab='jour';JT='ach';menu('jour')",'shop-gold':"tab='shop';menu('shop');const t=[...document.querySelectorAll('#mb [onclick]')].find(e=>/Gold/.test(e.textContent));t&&t.click()",'coll':"tab='coll';menu('coll')",'shop':"tab='shop';menu('shop')",'main':"tab='main';menu('main')",'friends':"tab='comm';CMT='fr';menu('comm')",'guild':"tab='comm';CMT='gu';menu('comm')",'settings':"tab='comm';CMT='st';menu('comm')"}
    for k,js in pages.items():
      pg=await b.new_page(viewport={'width':1366,'height':H})
      await pg.route('https://www.gstatic.com/**',lambda r:r.abort())
      await pg.goto('http://localhost:8766/index.html');await pg.wait_for_timeout(2500)
      await pg.evaluate("()=>{document.getElementById('splash').style.display='none';SV.mt=SV.mt||{};['main','comm','shop','coll','jour','bat','batl'].forEach(k=>SV.mt[k]=1);"+js+"}");await pg.wait_for_timeout(600)
      sc=await pg.evaluate("()=>[...document.querySelectorAll('#menu *')].filter(e=>{const s=getComputedStyle(e);return (s.overflowY==='auto'||s.overflowY==='scroll')&&e.scrollHeight>e.clientHeight+2}).map(e=>e.id||e.className)")
      res=[]
      for y in (200,300,400):
        if y>H-40:continue
        await pg.mouse.move(683,y);b0=await pg.evaluate("()=>[...document.querySelectorAll('#menu *')].reduce((a,e)=>a+e.scrollTop,0)")
        await pg.mouse.wheel(0,120);await pg.wait_for_timeout(400)
        b1=await pg.evaluate("()=>[...document.querySelectorAll('#menu *')].reduce((a,e)=>a+e.scrollTop,0)")
        res.append(round(b1-b0))
      print(k,sc,res)
      await pg.close()
    await b.close()
asyncio.run(main())
