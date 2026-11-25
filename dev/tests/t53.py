import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    for w,h,n in [(412,892,'h1'),(360,740,'h2')]:
      pg=await b.new_page(viewport={'width':w,'height':h});await pg.route('https://www.gstatic.com/**',lambda r:r.abort())
      await pg.goto('http://localhost:8766/index.html');await pg.wait_for_timeout(3500)
      await pg.evaluate("()=>{window.__loadF=()=>1;document.getElementById('splash').style.display='none';SV.m1=1;SV.played=5;SV.mt=SV.mt||{};['main','comm','shop','coll','jour','bat','batl'].forEach(k=>SV.mt[k]=1);document.getElementById('menu').style.display='flex';tab='main';menu('main');m3h('k');m3b('forest');go('casual')}")
      await pg.wait_for_timeout(9000)
      await pg.evaluate("()=>{try{if(typeof RO!=='undefined'&&RO)doRoll()}catch(e){}}");await pg.wait_for_timeout(4000)
      await pg.evaluate("()=>{document.querySelectorAll('#tut3,#ov,.mpop').forEach(e=>e.style.display='none');document.querySelectorAll('.mpop,#ro,[id*=roll]').forEach(e=>e.remove());const H=document.getElementById('hand');const c=[...H.children];c.forEach(x=>H.appendChild(x.cloneNode(true)))}");await pg.wait_for_timeout(300)
      print(n,await pg.evaluate("()=>{const c=[...document.querySelectorAll('#hand .c')].map(e=>{const r=e.getBoundingClientRect();return Math.round(r.left)+','+Math.round(r.top)+' '+Math.round(r.width)+'x'+Math.round(r.height)});const r=document.getElementById('rs').getBoundingClientRect();return c.join(' | ')+' || menu btn top '+Math.round(r.top)}"))
      await pg.screenshot(path=n+'.png');await pg.close()
    await b.close()
asyncio.run(main())
