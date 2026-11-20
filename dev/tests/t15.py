import asyncio
from playwright.async_api import async_playwright
async def run(p,w,h,tag,pop):
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    pg=await b.new_page(viewport={'width':w,'height':h})
    await pg.route('https://www.gstatic.com/**',lambda r:r.abort())
    await pg.goto('http://localhost:8766/index.html');await pg.wait_for_timeout(3000)
    await pg.evaluate("()=>{document.getElementById('splash').style.display='none';SV.mt=SV.mt||{};['main','comm','shop','coll','jour','bat','batl'].forEach(k=>SV.mt[k]=1);SV.gems=500;SV.boxes=[{r:3,s:Date.now()-9e9},{r:1,s:0},{r:0,s:Date.now()}];sv();tab='jour';menu('jour')}")
    await pg.wait_for_timeout(700);await pg.screenshot(path=f'k_{tag}.png')
    if pop:
      await pg.evaluate("()=>ob2(0)");await pg.wait_for_timeout(1200)
      print(tag,'open:',await pg.evaluate("()=>{const b=document.getElementById('rwp');return getComputedStyle(b).display+' | '+b.innerText.replace(/\\s+/g,' ')}"));await pg.screenshot(path=f'k_{tag}_pop.png')
      await pg.evaluate("()=>document.querySelector('#rwp .rok').click()");await pg.wait_for_timeout(400)
      g=await pg.evaluate("()=>SV.gems");await pg.evaluate("()=>ob2(1)");await pg.wait_for_timeout(1200)
      print(tag,'skip:',await pg.evaluate("()=>{const b=document.getElementById('rwp');return getComputedStyle(b).display+' | '+b.innerText.replace(/\\s+/g,' ')}"),'gems',g,'->',await pg.evaluate("()=>SV.gems"))
    await b.close()
async def main():
  async with async_playwright() as p:
    await run(p,390,844,'phone',True);await run(p,1366,620,'pc620',False);await run(p,360,640,'small',False)
asyncio.run(main())
