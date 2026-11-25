# toy pass (25 Nov): new Meshy tile + centre island -> game data
import sys,json,struct,base64,numpy as np
sys.path.insert(0,'.');import glbview,baseconv,glbconv
U='/mnt/user-data/uploads/DiceCardsModels/toy/'
def nrm(path):
  b=open(path,'rb').read();jl=struct.unpack('<I',b[12:16])[0];J=json.loads(b[20:20+jl]);o=20+jl;BIN=b[o+8:o+8+struct.unpack('<I',b[o:o+4])[0]]
  pr=J['meshes'][0]['primitives'][0];a=J['accessors'][pr['attributes']['NORMAL']];v=J['bufferViews'][a['bufferView']]
  return np.frombuffer(BIN,np.float32,a['count']*3,v.get('byteOffset',0)+a.get('byteOffset',0)).reshape(-1,3).copy()
# tile: centre on x/z, top at y=.305 like the old tile (shader thresholds use it)
J,P,UV,F,T=glbview.load(U+'tile_toy.glb');N=nrm(U+'tile_toy.glb');P=P.copy()
c=(P.min(0)+P.max(0))/2;P[:,0]-=c[0];P[:,2]-=c[2];P[:,1]+=.305-P[:,1].max()
T=T.resize((1024,1024))
g=baseconv.glb(P.astype(np.float32),N.astype(np.float32),UV.astype(np.float32),F,T)
open('/home/claude/v4/assets/tile_toy.b64','w').write(base64.b64encode(g).decode());print('tile kB',len(g)//1024,P.min(0).round(3),P.max(0).round(3))
e=glbconv.conv(U+'cisland_toy.glb')
open('/home/claude/v4/add/E5_toyisland.js','w').write("/* toy pass (25 Nov): Pix's cartoon centre island (Meshy task 01a213ef-ecaa-7292-8de1-99cd43817c94), merged into the model list as 'cisland' */\nwindow.__TOYM={cisland:%s};"%json.dumps(e))
print('island kB',(len(e['g'])+len(e['t']))//1024)
