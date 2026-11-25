import asyncio,time
exec(open('t5.py').read().split('async def main')[0])
async def main():
  async with async_playwright() as p:
    ba,A=await mk(p,'localhost');await reg(A,'solo@x.com');await enter(A);await A.wait_for_timeout(2000)
    t=time.time();await A.evaluate("()=>{document.querySelectorAll('#menu .mpop').forEach(x=>x.remove());go('rank')}")
    for i in range(16):
      await A.wait_for_timeout(1000);a=await pop(A)
      if 'Opponent found' in a: print('found after %.0fs'%(time.time()-t),a[:80]);break
    await A.wait_for_timeout(6000);print('in match:',await inmatch(A),'mode',await A.evaluate("()=>mode"),'live',await A.evaluate("()=>!!(window.__LIVE&&__LIVE())"))
    # cancel test
    await ba.close()
asyncio.run(main())
