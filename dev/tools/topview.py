import sys,numpy as np;sys.path.insert(0,'/home/claude/dice-cards/dev/tools');import glbview
from PIL import Image,ImageDraw
J,P,UV,F,T=glbview.load(sys.argv[1]);T=np.asarray(T);H,Wd=T.shape[:2]
S=900;sc=S/8.0
# rasterize triangles top-down: use triangle centroids at high density via barycentric samples
c=np.zeros((S,S,3),np.uint8)+255;zb=np.full((S,S),-1e9)
for w in [(1/3,1/3,1/3),(.6,.2,.2),(.2,.6,.2),(.2,.2,.6),(.45,.45,.1),(.1,.45,.45),(.45,.1,.45)]:
  p=P[F[:,0]]*w[0]+P[F[:,1]]*w[1]+P[F[:,2]]*w[2];uv=UV[F[:,0]]*w[0]+UV[F[:,1]]*w[1]+UV[F[:,2]]*w[2]
  col=T[np.clip((uv[:,1]*H).astype(int),0,H-1),np.clip((uv[:,0]*Wd).astype(int),0,Wd-1)]
  i=np.clip(((p[:,0]+4)*sc).astype(int),0,S-1);j=np.clip(((p[:,2]+4)*sc).astype(int),0,S-1)
  o=np.argsort(p[:,1]);i,j,col,y=i[o],j[o],col[o],p[o,1]
  m=y>zb[j,i];c[j[m],i[m]]=col[m];zb[j[m],i[m]]=y[m]
im=Image.fromarray(c);d=ImageDraw.Draw(im)
for a in range(-3,4):
  for b in [-3,3]:
    for (x,z) in [(a,b),(b,a)]:
      X=(x+4)*sc;Z=(z+4)*sc;d.ellipse((X-4,Z-4,X+4,Z+4),fill=(255,0,0));d.ellipse((X-.42*sc,Z-.42*sc,X+.42*sc,Z+.42*sc),outline=(255,0,0))
im.save(sys.argv[2])
