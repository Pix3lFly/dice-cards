import asyncio,time
exec(open('t5.py').read().split('async def main')[0])
txt=lambda pg,q: pg.evaluate("(q)=>[...document.querySelectorAll(q)].map(x=>x.innerText.replace(/\\s+/g,' ').trim()).join(' || ')",q)
FRP="()=>{document.querySelectorAll('#menu .mpop').forEach(x=>x.remove());tab='comm';CMT='fr';menu()}"
async def main():
  async with async_playwright() as p:
    ba,A=await mk(p,'localhost');bb,B=await mk(p,'127.0.0.1')
    await reg(A,'a@x.com');await reg(B,'b@x.com');await enter(A);await enter(B)
    await A.wait_for_timeout(2500)
    await A.evaluate(FRP);await A.wait_for_timeout(1500);await A.evaluate(FRP);await A.wait_for_timeout(500)
    print('A suggestions:',await txt(A,'#mb .sg3'))
    await A.screenshot(path='/tmp/s1.png')
    # add AI suggestion + real suggestion
    await A.evaluate("()=>{const b=[...document.querySelectorAll('#mb .sg3 button')];b[b.length-1].click()}");await A.wait_for_timeout(800)
    bn=await B.evaluate("()=>__FRON.prof.num")
    await A.evaluate("()=>frAddPop()");await A.fill('#frn',bn);await A.evaluate("()=>frSend()");await A.wait_for_timeout(1500)
    await B.evaluate("()=>{menu();const r=SV.frReq[0];frAcc(r.id,1)}");await B.wait_for_timeout(2500)
    await A.evaluate(FRP);await A.wait_for_timeout(800)
    print('A friends:',await A.evaluate("()=>__friends().map(f=>f.n+(f.ai?'(AI)':''))"))
    print('A gift bar:',await txt(A,'#mb .gf3'))
    bid=await A.evaluate("()=>__friends().find(f=>!f.ai).id")
    await A.evaluate("(id)=>__giftTo(id)",bid);await A.wait_for_timeout(1200)
    aid=await A.evaluate("()=>__friends().find(f=>f.ai).id");await A.evaluate("(id)=>__giftTo(id)",aid);await A.wait_for_timeout(500)
    await A.evaluate(FRP);await A.wait_for_timeout(500);print('A bar after sends:',await txt(A,'#mb .gf3'))
    await A.screenshot(path='/tmp/s2.png')
    await B.evaluate(FRP);await B.wait_for_timeout(2500);await B.evaluate(FRP);await B.wait_for_timeout(500);print('B bar:',await txt(B,'#mb .gf3'))
    g0=await B.evaluate("()=>SV.gold");await B.evaluate("()=>__giftClaim()");await B.wait_for_timeout(1500);print('B gold',g0,'->',await B.evaluate("()=>SV.gold"),await txt(B,'#mb .gf3'))
    g0=await A.evaluate("()=>SV.gold");await A.evaluate("()=>__giftClaim()");await A.wait_for_timeout(1000);print('A gold (AI gift)',g0,'->',await A.evaluate("()=>SV.gold"))
    # matchmaking: both search casual
    await A.evaluate("()=>{document.querySelectorAll('#menu .mpop').forEach(x=>x.remove());go('casual')}");await A.wait_for_timeout(700)
    await B.evaluate("()=>{document.querySelectorAll('#menu .mpop').forEach(x=>x.remove());go('casual')}")
    for i in range(8):
      await A.wait_for_timeout(1000)
      a=await pop(A);b=await pop(B)
      if 'Opponent found' in a or 'Opponent found' in b or i==7: print(i,'A:',a[:90],'| B:',b[:90]);
      if 'Opponent found' in a and 'Opponent found' in b: break
    await A.wait_for_timeout(7000)
    print('in match A,B:',await inmatch(A),await inmatch(B),'live:',await A.evaluate("()=>{const L=window.__LIVE&&__LIVE();return L?JSON.stringify({host:L.host,them:!!L.them}):null}"),await B.evaluate("()=>{const L=window.__LIVE&&__LIVE();return L?JSON.stringify({host:L.host,them:!!L.them}):null}"))
    print('names:',await A.evaluate("()=>[P[0].name,P[1].name]"),await B.evaluate("()=>[P[0].name,P[1].name]"))
    print('A recent:',await A.evaluate("()=>JSON.stringify(SV.recent)"))
    await ba.close();await bb.close()
asyncio.run(main())
