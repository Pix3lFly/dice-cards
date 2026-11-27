import re,json,glob
def norm(h):
  h=re.sub(r'<(/?)(b|i|em|strong|u|br)\b[^>]*>',lambda m:'<'+m.group(1)+m.group(2).lower()+'>',h,flags=re.I)
  h=h.replace('&nbsp;',' ');h=re.sub(r'\s+',' ',h).strip()
  return re.sub(r'\d+([.,]\d+)?','#',h)
D={}
for f in sorted(glob.glob('/home/claude/ar/d*.tsv')):
  for ln in open(f,encoding='utf8'):
    ln=ln.rstrip('\n')
    if not ln.strip() or '\t' not in ln: continue
    k,v=ln.split('\t',1)
    k=norm(k.replace("\\'","'"));v=v.strip()
    if k and v: D[k]=v
js='/* Arabic words for the Arabic language option (built from /home/claude/ar/*.tsv) */\nwindow.__ARD='+json.dumps(D,ensure_ascii=False,separators=(',',':'))+';\n'
open('/home/claude/v4/add/46a_ardict.js','w',encoding='utf8').write(js)
print(len(D))
