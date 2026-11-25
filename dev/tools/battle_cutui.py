from PIL import Image, ImageDraw, ImageFilter
import numpy as np
from scipy import ndimage
from scipy.spatial import ConvexHull
M2=Image.open('/mnt/user-data/uploads/9e4b3989-image.png').convert('RGB')
M1=Image.open('/mnt/user-data/uploads/92146e08-image.png').convert('RGB')
def cut(src,box,kind,name,minsz=500,erode=1):
  ci=src.crop(box);a=np.asarray(ci).astype(int);R,G,B=a[...,0],a[...,1],a[...,2]
  if kind=='gold': m=(R>150)&(G>95)&(R-B>70)
  else: m=(a.max(axis=2)-a.min(axis=2)>40)|(a.max(axis=2)>150)
  lab,n=ndimage.label(m);sz=ndimage.sum(np.ones(m.shape),lab,range(1,n+1))
  mx=sz.max();keep=np.isin(lab,[i+1 for i,s in enumerate(sz) if s>=min(minsz,mx*.08)])
  ys,xs=np.nonzero(keep);pts=np.stack([xs,ys],1);h=ConvexHull(pts);poly=[tuple(pts[v]) for v in h.vertices]
  mk=Image.new('L',ci.size,0);ImageDraw.Draw(mk).polygon(poly,fill=255)
  if erode:mk=mk.filter(ImageFilter.MinFilter(3))
  mk=mk.filter(ImageFilter.GaussianBlur(.8));r=ci.convert('RGBA');r.putalpha(mk);r=r.crop(r.getbbox());r.save(name+'.png');return r
cut(M2,(130,1255,545,1405),'gold','u_cas',3000)
cut(M2,(548,1255,960,1405),'gold','u_rnk',3000)
cut(M2,(135,195,620,275),'gold','u_t1',400)
cut(M2,(135,795,620,870),'gold','u_t2',400)
cut(M2,(625,685,955,760),'gold','u_cus',800)
cut(M1,(598,668,985,735),'any','u_w1',800)
cut(M1,(590,1115,975,1180),'any','u_w2',800)
