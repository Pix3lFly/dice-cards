import asyncio
exec(open('t5.py').read().split('async def main')[0])
txt=lambda pg,q: pg.evaluate("(q)=>[...document.querySelectorAll(q)].map(x=>x.innerText.replace(/\\s+/g,' ').trim()).join(' || ')",q)
ST="()=>{document.querySelectorAll('#menu .mpop').forEach(x=>x.remove());tab='comm';CMT='st';menu()}"
async def main():
  async with async_playwright() as p:
    ba,A=await mk(p,'localhost');bb,B=await mk(p,'127.0.0.1')
    await reg(A,'owner1@x.com');await reg(B,'b@x.com');await enter(A);await enter(B);await A.wait_for_timeout(2500)
    await B.evaluate("()=>{document.getElementById('dbgbox')&&document.getElementById('dbgbox').remove();console.warn('test problem on player phone')}");await B.wait_for_timeout(500)
    print('player box:',await B.evaluate("()=>!!document.getElementById('dbgbox')"))
    await A.evaluate("()=>{console.warn('owner sees this')}");await A.wait_for_timeout(300);print('owner box:',await A.evaluate("()=>!!document.getElementById('dbgbox')"))
    await B.wait_for_timeout(16000)
    await A.evaluate(ST);await A.wait_for_timeout(300);await A.click('#menu .opent');await A.fill('#opc','1337');await A.evaluate("()=>__opCode()");await A.evaluate("()=>__opTab('dbg')");await A.wait_for_timeout(1500)
    print('tabs:',await txt(A,'#ownp .opt button'));print('debug:',(await txt(A,'#ownp .opb'))[:400]);await A.screenshot(path='dbg.png')
    await ba.close();await bb.close()
asyncio.run(main())
