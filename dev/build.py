# base.html (= locked V3 game) + add/*.js (each wrapped in its own <script>) + add/*.css -> index.html
import glob,os
s=open('/home/claude/v4/base.html',encoding='utf-8').read()
parts=[]
for f in sorted(glob.glob('/home/claude/v4/add/*')):
    t=open(f,encoding='utf-8').read(); n=os.path.basename(f).split('.')[0]
    parts.append(f'<style id="v4_{n}">{t}</style>' if f.endswith('.css') else f'<script id="v4_{n}">{t}</script>')
i=s.rfind('</body>'); s=s[:i]+''.join(parts)+s[i:]
open('/home/claude/v4/index.html','w',encoding='utf-8').write(s); print('built',len(s.encode()),[os.path.basename(f) for f in sorted(glob.glob('/home/claude/v4/add/*'))])
