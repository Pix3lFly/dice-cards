// fake firebase compat: auth + a small firestore (docs, subcollections, where ==, batch, onSnapshot); data in sessionStorage
(function(){const S=k=>JSON.parse(sessionStorage.getItem('mock_'+k)||'null'),W=(k,v)=>sessionStorage.setItem('mock_'+k,JSON.stringify(v));
const users=()=>S('users')||{};let cbs=[],cur=S('cur');const fire=()=>cbs.forEach(f=>f(cur));const err=c=>Promise.reject({code:c});
const TS='__ts__';
const A={useDeviceLanguage(){},getRedirectResult(){return Promise.resolve(null)},onAuthStateChanged(f){cbs.push(f);setTimeout(()=>f(cur),10)},
 createUserWithEmailAndPassword(e,p){const u=users();if(u[e])return err('auth/email-already-in-use');if(p.length<6)return err('auth/weak-password');u[e]={p,uid:'u_'+e.replace(/\W/g,'')};W('users',u);cur={uid:u[e].uid,email:e,displayName:null};W('cur',cur);fire();return Promise.resolve({user:cur})},
 signInWithEmailAndPassword(e,p){const u=users();if(!u[e]||u[e].p!==p)return err('auth/invalid-credential');cur={uid:u[e].uid,email:e,displayName:null};W('cur',cur);fire();return Promise.resolve({user:cur})},
 signInWithPopup(){cur={uid:'g1',email:'pix@gmail.com',displayName:'Pix Fly'};W('cur',cur);fire();return Promise.resolve({user:cur})},
 sendPasswordResetEmail(){return Promise.resolve()},signOut(){cur=null;W('cur',null);fire();return Promise.resolve()}};
const all=()=>S('db')||{},save=d=>W('db',d);let L=[];window.__mockWrites=[];
const notify=()=>setTimeout(()=>L.slice().forEach(l=>l.run()),0);
const fix=v=>{const o={};for(const k in v){if(v[k]===TS)o[k]=Date.now();else o[k]=v[k]}return o};
const dsnap=(path,d)=>({id:path.split('/').pop(),ref:Doc(path),exists:!!d,data:()=>d?Object.assign({},d):undefined});
const guard=(d,path,data)=>{const [c]=path.split('/');if((c==='names'||c==='nums')&&d[path]&&d[path].uid!==cur.uid)throw {code:'permission-denied'};if(!cur)throw {code:'permission-denied'}};
const apply=(d,op)=>{if(op.t==='del'){delete d[op.p];return}guard(d,op.p,op.v);const v=fix(op.v);d[op.p]=op.m?Object.assign({},d[op.p]||{},v):v};
function Doc(p){return{id:p.split('/').pop(),path:p,
 get(){return Promise.resolve(dsnap(p,all()[p]))},
 set(v,o){try{const d=all();apply(d,{p,v,m:o&&o.merge});save(d);window.__mockWrites.push(p);notify();return Promise.resolve()}catch(e){return Promise.reject(e)}},
 update(v){return this.set(v,{merge:true})},
 delete(){const d=all();delete d[p];save(d);notify();return Promise.resolve()},
 collection(c){return Coll(p+'/'+c)},
 onSnapshot(cb){const l={run:()=>cb(dsnap(p,all()[p]))};L.push(l);setTimeout(l.run,0);return ()=>{L=L.filter(x=>x!==l)}}}}
function Q(p,f){const res=()=>{const d=all(),docs=Object.keys(d).filter(k=>k.startsWith(p+'/')&&k.split('/').length===p.split('/').length+1).filter(k=>!f||d[k][f[0]]===f[1]).map(k=>dsnap(k,d[k]));return {docs,size:docs.length,empty:!docs.length,forEach:fn=>docs.forEach(fn)}};
 return {where(a,op,b){return Q(p,[a,b])},get(){return Promise.resolve(res())},onSnapshot(cb){const l={run:()=>cb(res())};L.push(l);setTimeout(l.run,0);return ()=>{L=L.filter(x=>x!==l)}}}}
function Coll(p){return Object.assign(Q(p),{doc(id){return Doc(p+'/'+id)}})}
const DB={collection:c=>Coll(c),batch(){const ops=[];const b={set(r,v,o){ops.push({p:r.path,v,m:o&&o.merge});return b},update(r,v){ops.push({p:r.path,v,m:1});return b},delete(r){ops.push({p:r.path,t:'del'});return b},
 commit(){try{const d=all();ops.forEach(o=>apply(d,o));save(d);notify();return Promise.resolve()}catch(e){return Promise.reject(e)}}};return b}};
const auth=()=>A;auth.GoogleAuthProvider=function(){this.setCustomParameters=()=>{}};
const fs=()=>DB;fs.FieldValue={serverTimestamp:()=>TS};
window.firebase={initializeApp(){},auth,firestore:fs};})();
