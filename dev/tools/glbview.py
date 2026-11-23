import json,struct,sys,numpy as np,io
from PIL import Image
import matplotlib;matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.collections import PolyCollection
def load(p):
    b=open(p,'rb').read();assert b[:4]==b'glTF'
    jl=struct.unpack('<I',b[12:16])[0];J=json.loads(b[20:20+jl]);o=20+jl;bl=struct.unpack('<I',b[o:o+4])[0];BIN=b[o+8:o+8+bl]
    def acc(i):
        a=J['accessors'][i];v=J['bufferViews'][a['bufferView']];off=v.get('byteOffset',0)+a.get('byteOffset',0)
        n={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4,'MAT4':16}[a['type']];dt={5126:np.float32,5125:np.uint32,5123:np.uint16,5121:np.uint8}[a['componentType']]
        st=v.get('byteStride',0);sz=np.dtype(dt).itemsize*n
        if st and st!=sz:
            arr=np.array([np.frombuffer(BIN,dt,n,off+k*st) for k in range(a['count'])])
        else: arr=np.frombuffer(BIN,dt,a['count']*n,off).reshape(a['count'],n)
        return arr
    tex=None
    if J.get('images'):
        im=J['images'][0];v=J['bufferViews'][im['bufferView']];tex=Image.open(io.BytesIO(BIN[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']])).convert('RGB')
    P=[];UV=[];F=[];base=0
    for m in J['meshes']:
        for pr in m['primitives']:
            p=acc(pr['attributes']['POSITION']).astype(float);uv=acc(pr['attributes']['TEXCOORD_0']).astype(float) if 'TEXCOORD_0' in pr['attributes'] else np.zeros((len(p),2))
            f=acc(pr['indices']).reshape(-1,3).astype(int)+base;P.append(p);UV.append(uv);F.append(f);base+=len(p)
    return J,np.vstack(P),np.vstack(UV),np.vstack(F),tex
def render(p,out,yaws=(0,35,90,180)):
    J,P,UV,F,tex=load(p);T=np.asarray(tex) if tex is not None else None
    print('verts',len(P),'faces',len(F),'bbox',P.min(0).round(3),P.max(0).round(3),'anims',len(J.get('animations',[])),'skins',len(J.get('skins',[])),'tex',tex.size if tex else None)
    fig,axs=plt.subplots(1,len(yaws),figsize=(4*len(yaws),5),dpi=110)
    c=(P.min(0)+P.max(0))/2
    for ax,yw in zip(axs,yaws):
        a=np.radians(yw);R=np.array([[np.cos(a),0,np.sin(a)],[0,1,0],[-np.sin(a),0,np.cos(a)]]);Q=(P-c)@R.T
        tri=Q[F];z=tri[:,:,2].mean(1);order=np.argsort(z)
        n=np.cross(tri[:,1]-tri[:,0],tri[:,2]-tri[:,0]);nn=n/ (np.linalg.norm(n,axis=1,keepdims=True)+1e-9)
        sh=np.clip(0.55+0.45*(nn@np.array([0.3,0.5,0.8])/np.linalg.norm([0.3,0.5,0.8])),0.35,1)
        if T is not None:
            uv=UV[F].mean(1);x=np.clip((uv[:,0]%1)*(T.shape[1]-1),0,T.shape[1]-1).astype(int);y=np.clip((uv[:,1]%1)*(T.shape[0]-1),0,T.shape[0]-1).astype(int);col=T[y,x]/255.
        else: col=np.ones((len(F),3))*.8
        col=np.clip(col*sh[:,None],0,1)
        pc=PolyCollection(tri[order][:,:,:2],facecolors=col[order],edgecolors='none');ax.add_collection(pc)
        ax.set_xlim(Q[:,0].min(),Q[:,0].max());ax.set_ylim(Q[:,1].min(),Q[:,1].max());ax.set_aspect('equal');ax.axis('off');ax.set_title(f'yaw {yw}')
    plt.tight_layout();plt.savefig(out)
if __name__=='__main__':render(sys.argv[1],sys.argv[2])
