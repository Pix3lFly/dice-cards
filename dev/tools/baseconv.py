# Meshy base GLB -> nbases.js entry (GLB with embedded 1024 JPEG) + board metadata.
# The round landing platform is placed on the corner tile; the model faces the middle island.
import sys,json,struct,io,base64,numpy as np
sys.path.insert(0,'/home/claude/dice-cards/dev/tools');import glbview
from PIL import Image
CW=0.38*1.14*2**.5   # distance from the base anchor (WB) to the corner tile (W)
def glb(P,N,UV,F,tex,q=85,ts=1024):
  t=tex.resize((ts,ts),Image.LANCZOS);bo=io.BytesIO();t.save(bo,'JPEG',quality=q);jpg=bo.getvalue()
  idx=F.astype(np.uint16 if len(P)<65536 else np.uint32).reshape(-1)
  parts=[];views=[];accs=[]
  def addb(data,target=None):
    off=sum(len(x) for x in parts);pad=(4-len(data)%4)%4;parts.append(data+b'\0'*pad)
    v={'buffer':0,'byteOffset':off,'byteLength':len(data)}
    if target:v['target']=target
    views.append(v);return len(views)-1
  def add(arr,target,typ,ct,mm=False):
    bv=addb(arr.tobytes(),target);a={'bufferView':bv,'componentType':ct,'count':len(arr) if arr.ndim>1 else arr.size,'type':typ}
    if mm:a['min']=arr.min(0).tolist();a['max']=arr.max(0).tolist()
    accs.append(a);return len(accs)-1
  ii=add(idx,34963,'SCALAR',5123 if idx.dtype==np.uint16 else 5125)
  at={'POSITION':add(P.astype(np.float32),34962,'VEC3',5126,True)}
  if N is not None:at['NORMAL']=add(N.astype(np.float32),34962,'VEC3',5126)
  at['TEXCOORD_0']=add(UV.astype(np.float32),34962,'VEC2',5126)
  ib=addb(jpg)
  G={'asset':{'version':'2.0'},'scene':0,'scenes':[{'nodes':[0]}],'nodes':[{'mesh':0}],'meshes':[{'primitives':[{'attributes':at,'indices':ii,'material':0}]}],
   'materials':[{'pbrMetallicRoughness':{'baseColorTexture':{'index':0},'metallicFactor':0,'roughnessFactor':.9}}],
   'textures':[{'source':0,'sampler':0}],'samplers':[{'magFilter':9729,'minFilter':9987}],'images':[{'bufferView':ib,'mimeType':'image/jpeg'}],
   'buffers':[{'byteLength':sum(len(x) for x in parts)}],'bufferViews':views,'accessors':accs}
  BIN=b''.join(parts);js=json.dumps(G,separators=(',',':')).encode();js+=b' '*((4-len(js)%4)%4)
  return b'glTF'+struct.pack('<II',2,12+8+len(js)+8+len(BIN))+struct.pack('<I',len(js))+b'JSON'+js+struct.pack('<I',len(BIN))+b'BIN\0'+BIN
def normals(J,BIN_P):pass
def conv(path,guess,rad,tile=.96,grow=1.6):
  J,P,UV,F,tex=glbview.load(path)
  if 'castle' in path:   # Pix: castle should look like grey stone, not pink
    hsv=np.asarray(tex.convert('HSV')).astype(float);rgb=np.asarray(tex).astype(float);H=hsv[...,0]*360/255;S=hsv[...,1]/255;V=hsv[...,2]/255
    pk=((H>238)|(H<28))&(S>.05)&(S<.7)&(V>.18);g=rgb.mean(2,keepdims=True)
    tex=Image.fromarray(np.where(pk[...,None],np.concatenate([g*1.10,g*1.02,g*.80],2),rgb).clip(0,255).astype(np.uint8))
  b=open(path,'rb').read();jl=struct.unpack('<I',b[12:16])[0];o=20+jl;BIN=b[o+8:o+8+struct.unpack('<I',b[o:o+4])[0]]
  N=None
  try:
    pr=J['meshes'][0]['primitives'][0]
    if len(J['meshes'])==1 and len(J['meshes'][0]['primitives'])==1 and 'NORMAL' in pr['attributes']:
      a=J['accessors'][pr['attributes']['NORMAL']];v=J['bufferViews'][a['bufferView']];N=np.frombuffer(BIN,np.float32,a['count']*3,v.get('byteOffset',0)+a.get('byteOffset',0)).reshape(-1,3)
  except Exception:N=None
  g=np.array(guess,float)
  # platform: flat cluster near the guess; its top height = plat
  d2=np.hypot(P[:,0]-g[0],P[:,2]-g[1]);near=P[d2<.09]
  plat=float(np.percentile(near[:,1],90))
  top=P[(d2<.14)&(np.abs(P[:,1]-plat)<.012)]
  c=top[:,[0,2]].mean(0) if len(top)>20 else g
  # facing: platform direction snapped to 45 degrees
  ang=np.arctan2(c[0],c[1]);ang=np.round(ang/(np.pi/4))*(np.pi/4);d=np.array([np.sin(ang),np.cos(ang)])
  rot=lambda v,a:np.array([v[0]*np.cos(a)-v[1]*np.sin(a),v[0]*np.sin(a)+v[1]*np.cos(a)])
  p1=rot(d,np.pi/4);p2=rot(d,-np.pi/4)
  xz=P[:,[0,2]];side=max(np.ptp(xz@p1),np.ptp(xz@p2))
  # grow just the round platform (and its stone rim) so it is one tile wide while the rest of the base stays smaller
  if grow>1:
    r=np.hypot(P[:,0]-c[0],P[:,2]-c[1]);m=(r<rad*1.12)&(P[:,1]>plat-.09)
    P=P.copy();P[m,0]=c[0]+(P[m,0]-c[0])*grow;P[m,2]=c[1]+(P[m,2]-c[1])*grow
  s=tile/(2*rad*grow);ext=float(2.15/s)
  px,pz=c   # the platform sits on the hero's spot (base anchor = corner tile)
  M={'plat':plat,'px':float(px),'pz':float(pz),'ext':ext,'ry':-99,'p1':[round(float(x),3) for x in p1],'p2':[round(float(x),3) for x in p2]}
  return glb(P,N,UV,F,tex),M,c,d
if __name__=='__main__':
  G={'forest':(-.33,.35),'mine':(0,.33),'fire':(.31,.34),'ice':(-.27,.33),'castle':(0,.33),'electric':(-.33,.35),'market':(-.33,.33)}
  RAD={'forest':.115,'mine':.12,'fire':.11,'ice':.10,'castle':.10,'electric':.12,'market':.11}
  out={};meta={}
  G['portal2']=(0,.29);RAD['portal2']=.10
  for k,gs in G.items():
    g,M,c,d=conv('/mnt/user-data/uploads/DiceCardsModels/v4_bases/%s.glb'%(k if k!='portal2' else 'portal'),gs,RAD[k]);out[k]=base64.b64encode(g).decode();meta[k]=M
    print(k,'plat %.3f'%M['plat'],'center',c.round(3),'dir',d.round(2),'ext %.3f'%M['ext'],'kB',len(g)//1024)
  json.dump({'D':out,'M':meta},open('/tmp/nb_new.json','w'))
