import asyncio
exec(open('t5.py').read().split('async def main')[0])
txt=lambda pg,q: pg.evaluate("(q)=>[...document.querySelectorAll(q)].map(x=>x.innerText.replace(/\\s+/g,' ').trim()).join(' || ')",q)
ST="()=>{document.querySelectorAll('#menu .mpop').forEach(x=>x.remove());tab='comm';CMT='st';menu()}"
async def main():
  async with async_playwright() as p:
    ba,A=await mk(p,'localhost');bb,B=await mk(p,'127.0.0.1')
    await reg(A,'owner1@x.com');await reg(B,'b@x.com');await enter(A);await enter(B);await A.wait_for_timeout(2500)
    await B.evaluate(ST);await B.wait_for_timeout(300);print('B test tools on settings:',await B.evaluate("()=>document.querySelector('#mb').innerText.includes('Test tools')"))
    await B.screenshot(path='q0.png')
    await A.evaluate(ST);await A.wait_for_timeout(300);print('A test tools on settings:',await A.evaluate("()=>document.querySelector('#mb').innerText.includes('Test tools')"))
    await A.click('#menu .opent');await A.fill('#opc','1337');await A.evaluate("()=>__opCode()");await A.wait_for_timeout(300)
    await A.screenshot(path='q1.png')
    # warn B so it shows in list, then open from list and close
    bn=await B.evaluate("()=>__FRON.prof.name");await A.fill('#opq',bn);await A.evaluate("()=>__opFind()");await A.wait_for_timeout(1200)
    await A.evaluate("()=>__opWarnAsk()");await A.fill('#opr','test');await A.click('#opgo');await A.wait_for_timeout(1200)
    await A.evaluate("()=>__opTab('bw')");await A.wait_for_timeout(1000);await A.click('#ownp .oprow >> nth=0');await A.wait_for_timeout(1200)
    print('in card, back btn:',await txt(A,'#opres > .opr.sm'));await A.click('#ownp .opx');await A.wait_for_timeout(1000)
    print('after X tab:',await txt(A,'#ownp .opt button.on'),'| panel open:',await A.evaluate("()=>!!document.getElementById('ownp')"))
    await A.click('#ownp .opx');print('second X closes:',await A.evaluate("()=>!document.getElementById('ownp')"))
    await A.click('#menu .opent');await A.fill('#opc','1337');await A.evaluate("()=>__opCode()");await A.evaluate("()=>__opTab('me')");await A.wait_for_timeout(300)
    await A.screenshot(path='q2.png');g=await A.evaluate("()=>SV.gold");await A.evaluate("()=>__opMax()");print('max:',g,'->',await A.evaluate("()=>SV.gold"))
    await ba.close();await bb.close()
asyncio.run(main())
