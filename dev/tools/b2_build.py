# Board 2 (Pix's whole-board model): decimate (UV-chart aware), then warp x/z so the 20 tile tops sit exactly on the game grid
import sys,numpy as np
sys.path.insert(0,'/home/claude/dice-cards/dev/tools');import glbview,baseconv
import scipy.sparse as sp,scipy.sparse.csgraph as cg,scipy.sparse.linalg as sla
src,g,out,ts,q=sys.argv[1],int(sys.argv[2]),sys.argv[3],int(sys.argv[4]),int(sys.argv[5])
J,P,UV,F,T=glbview.load(src)
nv=len(P);r=np.concatenate([F[:,0],F[:,1],F[:,2]]);c=np.concatenate([F[:,1],F[:,2],F[:,0]])
ncomp,chart=cg.connected_components(sp.coo_matrix((np.ones(len(r)),(r,c)),shape=(nv,nv)),directed=False)
lo=P.min(0);ext=(P.max(0)-lo).max()
q3=np.floor((P-lo)/ext*g).astype(np.int64)
pk=(q3[:,0]*(g+1)+q3[:,1])*(g+1)+q3[:,2];key=pk*(ncomp+1)+chart
uk,inv=np.unique(key,return_inverse=True);n=len(uk);cnt=np.bincount(inv,minlength=n).astype(float)[:,None]
upk,pinv=np.unique(pk,return_inverse=True);pc=np.bincount(pinv).astype(float)[:,None]
Pc=np.stack([np.bincount(pinv,P[:,i]) for i in range(3)],1)/pc
Pn=np.zeros((n,3));Pn[inv]=Pc[pinv]
Un=np.stack([np.bincount(inv,UV[:,i],n) for i in range(2)],1)/cnt
Fn=inv[F];ok=(Fn[:,0]!=Fn[:,1])&(Fn[:,1]!=Fn[:,2])&(Fn[:,0]!=Fn[:,2]);Fn=Fn[ok]
Fs=np.sort(Fn,1);_,ui=np.unique(Fs,axis=0,return_index=True);Fn=Fn[np.sort(ui)]
# ---- warp: each tile moves rigidly to its grid spot, the middle (dais + 4 pillars) stays, the rest is filled smoothly (harmonic field)
p=float(sys.argv[6]) if len(sys.argv)>6 else .245
al=[-.477,-.232,0,.232,.477];pr={'b':-.80,'f':.799,'l':-.795,'r':.795}
src_c=[];dst_c=[]
for k,a in enumerate(al):
  t=(k-2)*p
  src_c+= [(a,pr['b']),(a,pr['f']),(pr['l'],a),(pr['r'],a)]
  dst_c+= [(t,-3*p),(t,3*p),(-3*p,t),(3*p,t)]
src_c=np.array(src_c);dst_c=np.array(dst_c)
M=281;L=1.1;xs=np.linspace(-L,L,M);X,Z=np.meshgrid(xs,xs,indexing='ij')
fix=np.zeros((M,M),bool);val=np.zeros((M,M,2))
for s_,d_ in zip(src_c,dst_c):
  m=np.hypot(X-s_[0],Z-s_[1])<.112;fix|=m;val[m]=d_-s_
m=np.hypot(X,Z)<.53;fix|=m;val[m]=0
idx=np.arange(M*M).reshape(M,M);rows=[];cols=[];vals=[]
for di,dj in [(1,0),(-1,0),(0,1),(0,-1)]:
  a=idx[max(0,-di):M-max(0,di),max(0,-dj):M-max(0,dj)].ravel();b=idx[max(0,di):M-max(0,-di)+ (0 if di>=0 else 0),:][:0] if False else idx[max(0,di):M+min(0,di),max(0,dj):M+min(0,dj)].ravel()
  rows+=[a];cols+=[b]
rows=np.concatenate(rows);cols=np.concatenate(cols)
A=sp.coo_matrix((np.ones(len(rows)),(rows,cols)),shape=(M*M,M*M)).tocsr()
deg=np.asarray(A.sum(1)).ravel();Lp=sp.diags(deg)-A  # Neumann at the edge
f=fix.ravel();u=~f
D=np.zeros((M*M,2));D[f]=val.reshape(-1,2)[f]
Luu=Lp[u][:,u].tocsc();Luf=Lp[u][:,f]
for k in range(2):D[u,k]=sla.spsolve(Luu,-Luf@D[f,k])
D=D.reshape(M,M,2)
def samp(x,z):
  fi=(x+L)/(2*L)*(M-1);fj=(z+L)/(2*L)*(M-1);i0=np.clip(np.floor(fi).astype(int),0,M-2);j0=np.clip(np.floor(fj).astype(int),0,M-2);tx=np.clip(fi-i0,0,1)[:,None];tz=np.clip(fj-j0,0,1)[:,None]
  return D[i0,j0]*(1-tx)*(1-tz)+D[i0+1,j0]*tx*(1-tz)+D[i0,j0+1]*(1-tx)*tz+D[i0+1,j0+1]*tx*tz
d=samp(Pn[:,0],Pn[:,2]);Pn[:,0]+=d[:,0];Pn[:,2]+=d[:,1]
# model units → 1 grid step = 1 (the game scales by 1.38)
Pn[:,[0,2]]/=p;Pn[:,1]/=p
print('tile top y',.0762/p,'centre top y',.0989/p,'bbox',Pn.min(0).round(3),Pn.max(0).round(3))
glb=baseconv.glb(Pn.astype(np.float32),None,Un.astype(np.float32),Fn,T,q=q,ts=ts)
open(out,'wb').write(glb);print('verts',len(Pn),'tris',len(Fn),'MB',round(len(glb)/1e6,2))
