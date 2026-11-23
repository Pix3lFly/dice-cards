# Copy /home/claude/v4/index.html (artifact copy) into the repo with the app bits added.
import sys
src='/home/claude/v4/index.html'; dst='/home/claude/dice-cards/index.html'
head='<link rel="manifest" href="manifest.json"><meta name="theme-color" content="#2b6cc4"><meta name="mobile-web-app-capable" content="yes"><link rel="apple-touch-icon" href="icons/apple-180.png"><link rel="icon" type="image/png" href="icons/icon-192.png">'
tail='<script>if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});try{screen.orientation&&screen.orientation.lock&&screen.orientation.lock("portrait").catch(()=>{})}catch(e){}</script>'
s=open(src,encoding='utf-8').read()
assert s.startswith('<!DOCTYPE html><html><head>') and s.rstrip().endswith('</body></html>')
s=s.replace('<head>','<head>'+head,1)
i=s.rfind('</body>'); s=s[:i]+tail+s[i:]
open(dst,'w',encoding='utf-8').write(s); print('synced',len(s.encode()))
