import asyncio
exec(open('t5.py').read().split('async def main')[0])
txt=lambda pg,q: pg.evaluate("(q)=>[...document.querySelectorAll(q)].map(x=>x.innerText).join(' || ')",q)
G="()=>{document.querySelectorAll('#menu .mpop').forEach(x=>x.remove());tab='comm';CMT='gu';menu()}"
async def t2():
  async with async_playwright() as p:
    ba,A=await mk(p,'localhost');bb,B=await mk(p,'127.0.0.1')
    await reg(A,'c@x.com');await reg(B,'d@x.com');await enter(A);await enter(B)
    await A.evaluate("()=>tstMax()");await A.evaluate(G);await A.wait_for_timeout(1200)
    await A.evaluate("()=>guCreatePop()");await A.fill('#gun','Open Test');await A.evaluate("()=>guCreate()");await A.wait_for_timeout(1500)
    gid=await A.evaluate("()=>SV.gid")
    await B.evaluate(G);await B.wait_for_timeout(1500);await B.evaluate(G)   # B caches list while guild is 'req'
    await A.evaluate(G);await A.wait_for_timeout(500);await A.evaluate("()=>guTab('man')");await A.wait_for_timeout(300)
    await A.select_option('#gtyp','open');await A.evaluate("()=>guSave()");await A.wait_for_timeout(800)
    await B.evaluate("(g)=>guJoin(g)",gid);await B.wait_for_timeout(2000)
    print('stale list join ->',await B.evaluate("()=>[SV.guild,!!SV.gpend2]"))
    # pending request then guild switches to open
    await A.select_option('#gtyp','req') if await A.query_selector('#gtyp') else None
    await B.evaluate("()=>guLeaveGo()");await B.wait_for_timeout(1500)
    await A.evaluate(G);await A.wait_for_timeout(500);await A.evaluate("()=>guTab('man')");await A.wait_for_timeout(300);await A.select_option('#gtyp','req');await A.evaluate("()=>guSave()");await A.wait_for_timeout(800)
    await B.evaluate(G);await B.wait_for_timeout(1200);await B.evaluate("(g)=>guJoin(g)",gid);await B.wait_for_timeout(1500)
    print('requested:',await B.evaluate("()=>[SV.guild,!!SV.gpend2]"))
    await A.evaluate(G);await A.wait_for_timeout(500);await A.evaluate("()=>guTab('man')");await A.wait_for_timeout(300);await A.select_option('#gtyp','open');await A.evaluate("()=>guSave()");await A.wait_for_timeout(3000)
    print('after switch to open:',await B.evaluate("()=>[SV.guild,!!SV.gpend2]"))
    await ba.close();await bb.close()
asyncio.run(t2())
