import sys,json,struct,io,numpy as np
from PIL import Image
sys.path.insert(0,'/home/claude/dice-cards/dev/tools');import glbview,baseconv
src=sys.argv[5]
J,P,UV,F,T=glbview.load(src)
b=open(src,'rb').read();jl=struct.unpack('<I',b[12:16])[0];o=20+jl;BIN=b[o+8:]
pr=J['meshes'][0]['primitives'][0];a=J['accessors'][pr['attributes']['NORMAL']];v=J['bufferViews'][a['bufferView']]
N=np.frombuffer(BIN,np.float32,a['count']*3,v.get('byteOffset',0)+a.get('byteOffset',0)).reshape(-1,3).astype(float)
T=Image.open(sys.argv[6]).convert('RGB')
import scipy.sparse as sp,scipy.sparse.csgraph as cg
nv=len(P);r=np.concatenate([F[:,0],F[:,1],F[:,2]]);c=np.concatenate([F[:,1],F[:,2],F[:,0]])
ncomp,chart=cg.connected_components(sp.coo_matrix((np.ones(len(r)),(r,c)),shape=(nv,nv)),directed=False)
print('charts',ncomp)
def cluster(g,gu):
  lo=P.min(0);ext=(P.max(0)-lo).max()
  q=np.floor((P-lo)/ext*g).astype(np.int64);qu=np.floor(UV*gu).astype(np.int64)
  key=((q[:,0]*(g+1)+q[:,1])*(g+1)+q[:,2])*(ncomp+1)+chart if gu==0 else ((q[:,0]*(g+1)+q[:,1])*(g+1)+q[:,2])*(gu+1)**2+qu[:,0]*(gu+1)+qu[:,1]
  uk,inv=np.unique(key,return_inverse=True);n=len(uk)
  cnt=np.bincount(inv,minlength=n).astype(float)[:,None]
  pk=(q[:,0]*(g+1)+q[:,1])*(g+1)+q[:,2];upk,pinv=np.unique(pk,return_inverse=True);pc=np.bincount(pinv).astype(float)[:,None]
  Pc=np.stack([np.bincount(pinv,P[:,i]) for i in range(3)],1)/pc
  Pn=np.zeros((n,3));Pn[inv]=Pc[pinv]
  Un=np.stack([np.bincount(inv,UV[:,i],n) for i in range(2)],1)/cnt
  Nn=np.stack([np.bincount(inv,N[:,i],n) for i in range(3)],1);Nn/=np.linalg.norm(Nn,axis=1,keepdims=True)+1e-9
  Fn=inv[F];ok=(Fn[:,0]!=Fn[:,1])&(Fn[:,1]!=Fn[:,2])&(Fn[:,0]!=Fn[:,2]);Fn=Fn[ok]
  Fs=np.sort(Fn,1);_,ui=np.unique(Fs,axis=0,return_index=True);Fn=Fn[np.sort(ui)]
  return Pn,Nn,Un,Fn
g=int(sys.argv[1]);gu=int(sys.argv[2]);out=sys.argv[3]
Pn,Nn,Un,Fn=cluster(g,gu)
glb=baseconv.glb(Pn.astype(np.float32),Nn.astype(np.float32),Un.astype(np.float32),Fn,T,q=int(sys.argv[4]) if len(sys.argv)>4 else 90,ts=int(sys.argv[7]))
open(out,'wb').write(glb);print('verts',len(Pn),'tris',len(Fn),'MB',round(len(glb)/1e6,2))
