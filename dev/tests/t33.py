import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    for w,h in [(360,710),(412,840),(1366,620)]:
      pg=await b.new_page(viewport={'width':w,'height':h})
      await pg.route('https://www.gstatic.com/**',lambda r:r.abort())
      await pg.goto('http://localhost:8766/index.html');await pg.wait_for_timeout(3500)
      await pg.evaluate("""()=>{const bs=document.querySelectorAll('#splash .xau button');bs.forEach(b=>b.disabled=false);bs[0].innerHTML='<i class="aic usr"></i>PixelFly';bs[0].classList.add('me');bs[1].innerHTML='<i class="aic out"></i>Log out';const t=document.querySelector('#splash .xsoon');t.textContent='Progress saved online';t.classList.add('ok')}""")
      await pg.wait_for_timeout(300);await pg.screenshot(path=f'sp2_{w}.png');await pg.close()
    await b.close()
asyncio.run(main())
