import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    c=await b.new_context(viewport={'width':390,'height':844},user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1')
    pg=await c.new_page()
    await pg.route('https://www.gstatic.com/**',lambda r:r.abort())
    await pg.goto('http://localhost:8766/index.html');await pg.wait_for_timeout(5500)
    await pg.screenshot(path='u_ins.png')
    print(await pg.evaluate("()=>!!document.getElementById('v4ins')"))
    await pg.click('#v4ins .n');await pg.wait_for_timeout(300)
    print(await pg.evaluate("()=>[!!document.getElementById('v4ins'),localStorage.getItem('dc_ins_no')!=null]"))
    await b.close()
asyncio.run(main())
