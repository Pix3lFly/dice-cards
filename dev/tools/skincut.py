from PIL import Image, ImageDraw, ImageChops
import numpy as np, base64, io, json
U='/mnt/user-data/uploads/'
F={'l1':'0c670ef7','l2':'ae8dd55e','b1':'b71a7040','b2':'f1831ec4'}
K=['k','v','s','f','i','h']
out={}
for t,f in F.items():
  im=Image.open(U+f+'-image.png').convert('RGB');a=np.asarray(im).astype(int)
  for r in range(2):
    for c in range(3):
      x0,y0=c*512,r*512;cell=a[y0:y0+512,x0:x0+512]
      nw=(cell.min(axis=2)<235)
      ys,xs=np.where(nw);bx=(xs.min(),ys.min(),xs.max()+1,ys.max()+1)
      ci=im.crop((x0,y0,x0+512,y0+512))
      if t[0]=='l':
        cx,cy=(bx[0]+bx[2])/2,(bx[1]+bx[3])/2;R=max(bx[2]-bx[0],bx[3]-bx[1])/2
        sq=ci.crop((int(cx-R),int(cy-R),int(cx+R),int(cy+R))).resize((128,128),Image.LANCZOS).convert('RGBA')
        m=Image.new('L',(640,640),0);ImageDraw.Draw(m).ellipse((22,22,618,618),fill=255);sq.putalpha(m.resize((128,128),Image.LANCZOS))
        res=sq
      else:
        # transparent bg: flood fill near-white from borders
        rgba=ci.convert('RGBA');w=np.asarray(rgba).copy()
        wh=(cell.min(axis=2)>238)
        from scipy import ndimage
        lab,_=ndimage.label(wh);edge=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
        bg=np.isin(lab,list(edge));bg=ndimage.binary_dilation(bg,iterations=1)&(cell.min(axis=2)>215)
        alpha=np.where(bg,0,255).astype(np.uint8)
        alpha=np.asarray(Image.fromarray(alpha).filter(__import__('PIL.ImageFilter',fromlist=['x']).GaussianBlur(.7))).copy()
        fg=alpha>20;lb,n=ndimage.label(fg)
        for q in range(1,n+1):
          m=lb==q
          if m.sum()<1500 and (m[-3:].any() or m[:3].any() or m[:,:3].any() or m[:,-3:].any()): alpha[m]=0
        w[...,3]=alpha;res=Image.fromarray(w)
        bb=res.getbbox();res=res.crop(bb);s=240/max(res.size);res=res.resize((max(1,int(res.size[0]*s)),max(1,int(res.size[1]*s))),Image.LANCZOS)
      k=K[r*3+c];res.save(f'{t}_{k}.png')
      b=io.BytesIO();res.save(b,'WEBP',quality=78);out[f'{t}{k}']='data:image/webp;base64,'+base64.b64encode(b.getvalue()).decode()
json.dump(out,open('sk.json','w'))
print(sum(len(v) for v in out.values())//1024,'KB')
