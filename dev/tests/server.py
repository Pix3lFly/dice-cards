import http.server,json,os,sys
os.chdir('/home/claude/t/site')
STORE={}
import threading
LOCK=threading.Lock()
class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a):pass
    def do_GET(self):
        if self.path.startswith('/__mock'):
            b=json.dumps(STORE).encode();self.send_response(200);self.send_header('Content-Type','application/json');self.end_headers();self.wfile.write(b);return
        return super().do_GET()
    def do_POST(self):
        if self.path.startswith('/__mock'):
            n=int(self.headers['Content-Length']);d=json.loads(self.rfile.read(n))
            with LOCK:
                if 'ops' in d:
                    db=STORE.setdefault('db',{})
                    for o in d['ops']:
                        if o.get('del'):db.pop(o['p'],None)
                        else:
                            if o.get('m'):cur=dict(db.get(o['p'],{}));cur.update(o['v']);db[o['p']]=cur
                            else:db[o['p']]=o['v']
                else:STORE[d['k']]=d['v']
            self.send_response(200);self.end_headers();self.wfile.write(b'ok');return
http.server.ThreadingHTTPServer(('0.0.0.0',8766),H).serve_forever()
