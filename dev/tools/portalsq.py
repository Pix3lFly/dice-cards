# square portal tile = forest base's square island (cliffs + ground) + the new Meshy portal's arch/paving on top
import sys,json,struct,io,numpy as np
sys.path.insert(0,'.');import glbview
from PIL import Image
U='/mnt/user-data/uploads/DiceCardsModels/v4_bases/'
def nrm(path,J):
  b=open(path,'rb').read();jl=struct.unpack('<I',b[12:16])[0];o=20+jl;BIN=b[o+8:o+8+struct.unpack('<I',b[o:o+4])[0]]
  pr=J['meshes'][0]['primitives'][0];a=J['accessors'][pr['attributes']['NORMAL']];v=J['bufferViews'][a['bufferView']]
  return np.frombuffer(BIN,np.float32,a['count']*3,v.get('byteOffset',0)+a.get('byteOffset',0)).reshape(-1,3).copy()
Jp,Pp,UVp,Fp,Tp=glbview.load(U+'portal_square.glb');Np=nrm(U+'portal_square.glb',Jp)
Jf,Pf,UVf,Ff,Tf=glbview.load(U+'forest.glb');Nf=nrm(U+'forest.glb',Jf)
# portal: platform at (0,.29) facing +z; find its top height
cp=np.array([0,.29]);d=np.hypot(Pp[:,0]-cp[0],Pp[:,2]-cp[1]);platP=float(np.percentile(Pp[d<.09,1],90));print('portal plat',platP)
# keep portal faces that are not cliff (any vertex at/above ground - 0.03)
keepP=(Pp[Fp][:,:,1].max(1)>platP-.03)
# forest: platform at (-.342,.362), dir (-.707,.707); ground height
cf=np.array([-.342,.362]);platF=-.124
P2=Pf.copy();N2=Nf.copy()
# rotate forest so its platform direction (-.707,.707) becomes (0,1): rotate by -45deg around y
a=np.pi/4;R=np.array([[np.cos(a),0,np.sin(a)],[0,1,0],[-np.sin(a),0,np.cos(a)]])
def rot(v):return v@R.T
c3=rot(np.array([cf[0],0,cf[1]]));print('forest plat after rot',c3.round(3))
P2=rot(P2);N2=rot(N2)
# scale forest square to the portal diamond: portal half-width along x = .479 ; forest rotated half-width
k=.479/np.abs(P2[:,0]).max();print('scale',k)
P2*=k;c3=c3*k
# move forest platform onto the portal platform, ground just under the portal's
P2[:,0]+=cp[0]-c3[0];P2[:,2]+=cp[1]-c3[2];P2[:,1]+=(platP-.008)-platF*k
# forest: keep only the island (faces whose top is not above its ground) -> drops tree, rocks, lamps, flag
keepF=(P2[Ff][:,:,1].max(1)<platP+.004)
F2=Ff[keepF];F1=Fp[keepP]
# merge; atlas textures side by side
n1=len(Pp);P=np.vstack([Pp,P2]);N=np.vstack([Np,N2])
UV=np.vstack([np.c_[UVp[:,0]%1*.5,UVp[:,1]%1],np.c_[UVf[:,0]%1*.5+.5,UVf[:,1]%1]])
F=np.vstack([F1,F2+n1])
# drop unused vertices
used=np.unique(F);m=-np.ones(len(P),int);m[used]=np.arange(len(used));P,N,UV,F=P[used],N[used],UV[used],m[F]
T=Image.new('RGB',(4096,2048));T.paste(Tp.resize((2048,2048)),(0,0));T.paste(Tf.resize((2048,2048)),(2048,0))
# swirl: arch opening = purple texels in the upper part
uvc=UV[F].mean(1);Ta=np.asarray(T);col=Ta[np.clip((uvc[:,1]*2047).astype(int),0,2047),np.clip((uvc[:,0]*4095).astype(int),0,4095)].astype(int)
cent=P[F].mean(1);pur=(col[:,0]>110)&(col[:,2]>150)&(col[:,1]<110)&(cent[:,1]>platP+.06)&(np.abs(cent[:,0])<.2)&(cent[:,2]<.15)
pc=cent[pur];print('purple faces',pur.sum(),'centre',pc.mean(0).round(3),'x',pc[:,0].min().round(3),pc[:,0].max().round(3),'y',pc[:,1].min().round(3),pc[:,1].max().round(3),'z',pc[:,2].min().round(3),pc[:,2].max().round(3))
import pickle;pickle.dump(dict(P=P,N=N,UV=UV,F=F,sw=[float(x) for x in np.median(pc,0)],swx=float(np.percentile(pc[:,0],95)-np.percentile(pc[:,0],5)),swy=float(np.percentile(pc[:,1],95)-np.percentile(pc[:,1],5)),plat=platP),open('/tmp/psq.pkl','wb'))
T.save('/tmp/psq_tex.png')
print('verts',len(P),'faces',len(F))
