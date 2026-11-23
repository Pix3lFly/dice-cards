# Meshy GLB -> game entry {g: GLB base64 (no texture), t: JPEG base64}
import json,struct,sys,io,base64,numpy as np
from PIL import Image
sys.path.insert(0,'/home/claude/tools');import glbview
def conv(p,texsize=1024,q=86):
    b=open(p,'rb').read();jl=struct.unpack('<I',b[12:16])[0];J=json.loads(b[20:20+jl]);o=20+jl;bl=struct.unpack('<I',b[o:o+4])[0];BIN=b[o+8:o+8+bl]
    _,P,UV,F,tex=glbview.load(p)
    # normals
    N=[]
    for m in J['meshes']:
        for pr in m['primitives']:
            if 'NORMAL' in pr['attributes']:
                a=J['accessors'][pr['attributes']['NORMAL']];v=J['bufferViews'][a['bufferView']];off=v.get('byteOffset',0)+a.get('byteOffset',0)
                N.append(np.frombuffer(BIN,np.float32,a['count']*3,off).reshape(-1,3))
    N=np.vstack(N) if N else None
    P=P.astype(np.float32);UV=UV.astype(np.float32)
    idx=F.astype(np.uint16 if len(P)<65536 else np.uint32).reshape(-1)
    parts=[];views=[];accs=[];attrs={}
    def add(arr,target,typ,ct,mm=False):
        data=arr.tobytes();off=sum(len(x) for x in parts)
        pad=(4-len(data)%4)%4;parts.append(data+b'\0'*pad)
        views.append({'buffer':0,'byteOffset':off,'byteLength':len(data),**({'target':target} if target else {})})
        a={'bufferView':len(views)-1,'componentType':ct,'count':len(arr) if arr.ndim>1 else arr.size,'type':typ}
        if mm:a['min']=arr.min(0).tolist();a['max']=arr.max(0).tolist()
        accs.append(a);return len(accs)-1
    ii=add(idx,34963,'SCALAR',5123 if idx.dtype==np.uint16 else 5125)
    attrs['POSITION']=add(P,34962,'VEC3',5126,True)
    if N is not None and len(N)==len(P):attrs['NORMAL']=add(N.astype(np.float32),34962,'VEC3',5126)
    attrs['TEXCOORD_0']=add(UV,34962,'VEC2',5126)
    BINo=b''.join(parts)
    G={'asset':{'version':'2.0'},'scene':0,'scenes':[{'nodes':[0]}],'nodes':[{'mesh':0}],'meshes':[{'primitives':[{'attributes':attrs,'indices':ii,'material':0}]}],
       'materials':[{'pbrMetallicRoughness':{'baseColorFactor':[1,1,1,1],'metallicFactor':0,'roughnessFactor':.85}}],
       'buffers':[{'byteLength':len(BINo)}],'bufferViews':views,'accessors':accs}
    js=json.dumps(G,separators=(',',':')).encode();js+=b' '*((4-len(js)%4)%4)
    glb=b'glTF'+struct.pack('<II',2,12+8+len(js)+8+len(BINo))+struct.pack('<I',len(js))+b'JSON'+js+struct.pack('<I',len(BINo))+b'BIN\0'+BINo
    t=tex.resize((texsize,texsize),Image.LANCZOS);bo=io.BytesIO();t.save(bo,'JPEG',quality=q)
    return {'g':base64.b64encode(glb).decode(),'t':base64.b64encode(bo.getvalue()).decode()}
if __name__=='__main__':
    e=conv(sys.argv[1]);print(len(e['g']),len(e['t']));json.dump(e,open(sys.argv[2],'w'))
