import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    pg=await b.new_page(viewport={'width':390,'height':844})
    await pg.route('https://www.gstatic.com/**',lambda r:r.abort())
    await pg.goto('http://localhost:8766/index.html');await pg.wait_for_timeout(3000)
    T="()=>{const b=document.getElementById('rwp');return getComputedStyle(b).display+' | '+b.innerText.replace(/\\s+/g,' ')}"
    await pg.evaluate("()=>{document.getElementById('splash').style.display='none';SV.mt=SV.mt||{};['main','comm','shop','coll','jour','bat','batl'].forEach(k=>SV.mt[k]=1);SV.gems=500;SV.gold=100;SV.lpend=1;SV.streak=3;SV.boxes=[{r:3,s:Date.now()-9e9},{r:1,s:0},{r:0,s:Date.now()}];sv();tab='jour';menu('jour')}")
    await pg.wait_for_timeout(1200)
    print('claim tile:',await pg.evaluate("()=>{const t=document.querySelector('#mb .dt.claim');return t?t.innerText.replace(/\\s+/g,' '):'none'}"),'| journal dot:',await pg.evaluate("()=>document.querySelectorAll('.nvdot').length"))
    await pg.screenshot(path='v_claim.png')
    await pg.evaluate("()=>document.querySelector('#mb .dt.claim').click()");await pg.wait_for_timeout(800)
    print('claim popup:',await pg.evaluate(T),'gems',await pg.evaluate("()=>SV.gems"),'lpend',await pg.evaluate("()=>SV.lpend"))
    await pg.evaluate("()=>document.querySelector('#rwp .rok').click()");await pg.wait_for_timeout(500)
    await pg.evaluate("()=>ob2(0)");await pg.wait_for_timeout(900);print('open ready:',await pg.evaluate(T))
    await pg.evaluate("()=>document.querySelector('#rwp .rok').click()");await pg.wait_for_timeout(500)
    await pg.evaluate("()=>ob2(1)");await pg.wait_for_timeout(700);print('skip ask:',await pg.evaluate(T))
    await pg.screenshot(path='v_skip.png')
    await pg.evaluate("()=>document.querySelector('#rwp .ryes').click()");await pg.wait_for_timeout(900);print('after yes:',await pg.evaluate(T),'gems',await pg.evaluate("()=>SV.gems"))
    await pg.evaluate("()=>document.querySelector('#rwp .rok').click()");await pg.wait_for_timeout(400)
    print('popups at once:',await pg.evaluate("()=>document.querySelectorAll('#rwp').length"))
    await b.close()
asyncio.run(main())
