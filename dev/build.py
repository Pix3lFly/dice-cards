# base.html (= locked V3 game) + add/*.js (each wrapped in its own <script>) + add/*.css -> index.html
import glob,os
s=open('/home/claude/v4/base.html',encoding='utf-8').read()
import sys;sys.path.insert(0,'/home/claude/v4');import patches;s=patches.apply(s)
parts=[]
early=[];head=[]
for f in sorted(glob.glob('/home/claude/v4/add/*')):
    if os.path.basename(f).startswith('H') and f.endswith('.js'):
        head.append('<script id="v4_'+os.path.basename(f).split('.')[0]+'">'+open(f,encoding='utf-8').read()+'</script>');continue
    if os.path.basename(f).startswith('H'):
        head.append('<style id="v4_'+os.path.basename(f).split('.')[0]+'">'+open(f,encoding='utf-8').read()+'</style>');continue
    if os.path.basename(f).startswith('E'):
        early.append('<script id="v4_'+os.path.basename(f).split('.')[0]+'">'+open(f,encoding='utf-8').read()+'</script>');continue
    t=open(f,encoding='utf-8').read(); n=os.path.basename(f).split('.')[0]
    parts.append(f'<style id="v4_{n}">{t}</style>' if f.endswith('.css') else f'<script id="v4_{n}">{t}</script>')
k=s.index("sp.classList.add('nw')");k=s.index('</script>',k)+9;s=s[:k]+''.join(early)+s[k:]
h=s.index('<head>')+6;s=s[:h]+''.join(head)+s[h:]
i=s.rfind('</body>'); s=s[:i]+''.join(parts)+s[i:]
open('/home/claude/v4/index.html','w',encoding='utf-8').write(s); print('built',len(s.encode()),[os.path.basename(f) for f in sorted(glob.glob('/home/claude/v4/add/*'))])
