/* Riconoscimento dei simboli: $P (nuvola di punti) con regole per i casi simili. */
const NP=48;
const arco=(cx,cy,r,a0,a1,n=16)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return[cx+Math.cos(a)*r,cy+Math.sin(a)*r]});
const RET=(w,h)=>[[-w,-h],[w,-h],[w,h],[-w,h],[-w,-h]];
const orD=[[-1.8,-1.5],[-.2,-1.5],[1,-1],[2,0],[1,1],[-.2,1.5],[-1.8,1.5]],orL=[[-1.8,-1.5],[-1.2,-.8],[-1,0],[-1.2,.8],[-1.8,1.5]];
const andB=[[-1.5,-1.5],[0,-1.5],...arco(0,0,1.5,-Math.PI/2,Math.PI/2,10),[-1.5,1.5],[-1.5,-1.5]];
const TPL={
 res:[[RET(2,.7)],[RET(2,.7),[[-3,0],[-2,0]],[[2,0],[3,0]]],[[[-2.2,0],[-1.8,-.8],[-1,.8],[-.2,-.8],[.6,.8],[1.4,-.8],[1.8,0],[2.2,0]]],[[[-3.2,0],[-2,0],[-1.6,-.8],[-.8,.8],[0,-.8],[.8,.8],[1.6,-.8],[2,0],[3.2,0]]]],
 pila:[[[[.3,-1.6],[.3,1.6]],[[-.3,-.7],[-.3,.7]]],[[[-.9,-1.6],[-.9,1.6]],[[-.3,-.7],[-.3,.7]],[[.3,-1.6],[.3,1.6]],[[.9,-.7],[.9,.7]]].map(s=>s)],
 cap:[[[[-.3,-1.4],[-.3,1.4]],[[.3,-1.4],[.3,1.4]]],[[[-.4,-1.4],[-.4,1.4]],[[.4,-1.4],[.4,1.4]],[[-2,0],[-.4,0]],[[.4,0],[2,0]]]],
 dio:[[[[-1,-1.1],[1,0],[-1,1.1],[-1,-1.1]],[[1,-1.1],[1,1.1]]],[[[-1,-1.1],[1,0],[-1,1.1],[-1,-1.1]],[[1,-1.1],[1,1.1]],[[-2.4,0],[-1,0]],[[1,0],[2.4,0]]]],
 led:[[[[-1,-1.1],[1,0],[-1,1.1],[-1,-1.1]],[[1,-1.1],[1,1.1]],[[-.1,-1.2],[.7,-2.2]],[[.2,-2.2],[.7,-2.2],[.7,-1.7]],[[.9,-1.2],[1.7,-2.2]],[[1.2,-2.2],[1.7,-2.2],[1.7,-1.7]]],[[[-1,-1.1],[1,0],[-1,1.1],[-1,-1.1]],[[1,-1.1],[1,1.1]],[[-.1,-1.2],[.7,-2.2]],[[.9,-1.2],[1.7,-2.2]]]],
 btn:[[[[-1.6,0],[1.6,0]],[[0,0],[0,-1.5]]],[[[-1.8,.6],[-1.8,0],[1.8,0],[1.8,.6]],[[0,0],[0,-1.5]],[[-.6,-1.5],[.6,-1.5]]]],
 ind:[[Array.from({length:41},(_,i)=>{const u=i/40*4;return[-2+u,-Math.abs(Math.sin(u*Math.PI))*1.1]})]],
 rel:[[RET(1.6,1.1),[[-1.6,1.1],[1.6,-1.1]]],[RET(1.6,1.1),[[-2.2,1.5],[2.2,-1.5]]]],
 npn:[[[[-.5,-1.4],[-.5,1.4]],[[-.5,-.5],[1,-1.5]],[[-.5,.5],[1,1.5]],[[-2,0],[-.5,0]]]],
 gnd:[[[[-1.2,0],[1.2,0]],[[-.7,.5],[.7,.5]],[[-.25,1],[.25,1]]],[[[0,-1],[0,0]],[[-1.2,0],[1.2,0]],[[-.7,.5],[.7,.5]],[[-.25,1],[.25,1]]]],
 sw:[[[[-1,0],[.8,-.9]],[[-2,0],[-1,0]],[[1,0],[2,0]]],[[[-2,0],[-1,0],[.8,-.9]],[[1,0],[2,0]]]],
 and:[[andB]],or:[[orD,orL]],not:[[[[-1.5,-1.3],[1.2,0],[-1.5,1.3],[-1.5,-1.3]]]],xor:[[orD,orL,[[-2.3,-1.5],[-1.7,-.8],[-1.5,0],[-1.7,.8],[-2.3,1.5]]]],
};
const POLAR={sw:1,pila:1,dio:1,led:1,npn:1,and:1,or:1,not:1,xor:1,gnd:1};
const INT={X:[[[-1,-1],[1,1]],[[1,-1],[-1,1]]],M:[[[-1,1],[-.8,-1],[0,.3],[.8,-1],[1,1]]],V:[[[-1,-1],[0,1],[1,-1]]],A:[[[-.8,1],[0,-1],[.8,1]],[[-.5,.3],[.5,.3]]],T:[[[-1,.2],[-.5,-.6],[0,.2],[.5,.8],[1,-.2]]],
 B:[[[-.2,-1],[-.2,1]],[[-.2,-.3],[.8,-1]],[[-.2,.3],[.8,1]],[[-1,0],[-.2,0]]]};
function len(s){let d=0;for(let i=1;i<s.length;i++)d+=Math.hypot(s[i][0]-s[i-1][0],s[i][1]-s[i-1][1]);return d}
function ricampiona(st,n){const tot=st.reduce((a,s)=>a+Math.max(len(s),1e-6),0),q=[];
 st.forEach(s=>{const m=Math.max(2,Math.round(n*Math.max(len(s),1e-6)/tot)),L=len(s)/(m-1)||1e-6;let d=0,pp=s[0];q.push(s[0].slice(0,2));for(let i=1;i<s.length;i++){let a=pp,b=s[i],h=Math.hypot(b[0]-a[0],b[1]-a[1]);while(d+h>=L&&h>0){const k=(L-d)/h,p=[a[0]+k*(b[0]-a[0]),a[1]+k*(b[1]-a[1])];q.push(p);a=p;h=Math.hypot(b[0]-a[0],b[1]-a[1]);d=0}d+=h;pp=b}});
 return q}
function norma(p){let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9,cx=0,cy=0;for(const[x,y]of p){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);cx+=x;cy+=y}cx/=p.length;cy/=p.length;const s=Math.max(x1-x0,y1-y0)||1;return p.map(([x,y])=>[(x-cx)/s,(y-cy)/s])}
function nube(st,n=NP){const q=ricampiona(st,n),o=[];for(let i=0;i<n;i++)o.push(q[Math.floor(i*q.length/n)]);return norma(o)}
function greedy(a,b){const n=a.length,st=Math.max(1,Math.floor(Math.sqrt(n))),f=(A,B,s)=>{const m=[];let sum=0;const nb=B.length;for(let i=0;i<n;i++){const j=(s+i)%n;let best=1e9,ix=-1;const pa=A[j];for(let k=0;k<nb;k++){if(m[k])continue;const d=Math.hypot(pa[0]-B[k][0],pa[1]-B[k][1]);if(d<best){best=d;ix=k}}if(ix>=0)m[ix]=1;sum+=(1-i/n)*best}return sum};let r=1e9;for(let i=0;i<n;i+=st)r=Math.min(r,f(a,b,i),f(b,a,i));return r}
function ruotaP(p,r){return p.map(q=>{let[x,y]=q;for(let i=0;i<r;i++)[x,y]=[-y,x];return[x,y]})}
const NUB=[];for(const k in TPL)TPL[k].forEach(strokes=>{const n=nube(strokes);for(let r=0;r<(POLAR[k]?4:2);r++)NUB.push({k,r,p:ruotaP(n,r)})});
const NUBI=Object.entries(INT).map(([k,s])=>({k,p:nube(s,32)}));
function bb(pts){let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const[x,y]of pts){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)}return{x0,x1,y0,y1,w:x1-x0,h:y1-y0,cx:(x0+x1)/2,cy:(y0+y1)/2}}
function cerchio(s){const b=bb(s),L=len(s),dg=Math.hypot(b.w,b.h);if(dg<.5)return null;const e=Math.hypot(s[0][0]-s[s.length-1][0],s[0][1]-s[s.length-1][1]);if(e>.35*Math.max(b.w,b.h))return null;const ar=b.w/(b.h||1e-3);if(ar<.65||ar>1.5)return null;let m=0,v=0;const ds=s.map(p=>Math.hypot(p[0]-b.cx,p[1]-b.cy));ds.forEach(d=>m+=d);m/=ds.length;ds.forEach(d=>v+=(d-m)**2);v=Math.sqrt(v/ds.length)/m;if(v>.12||Math.max(...ds)/Math.min(...ds)>1.34)return null;if(L/(Math.PI*2*m)>1.5)return null;return{x:b.cx,y:b.cy,r:m}}
function piccoloCerchioADestra(st,all){ // bollino di negazione: restituisce indice
 for(let i=0;i<st.length;i++){const s=st[i],b=bb(s),e=Math.hypot(s[0][0]-s[s.length-1][0],s[0][1]-s[s.length-1][1]),q=b.w/(b.h||1e-3);if(e<.5*Math.max(b.w,b.h)&&q>.55&&q<1.8&&len(s)>2*Math.max(b.w,b.h)&&Math.max(b.w,b.h)<.36*Math.max(all.w,all.h))return{i,c:{x:b.cx,y:b.cy,r:Math.max(b.w,b.h)/2}}}return null}
/* punti in celle. Restituisce alternative ordinate [{k,r,d}] */
function riconosciP(st){const all=bb(st.flat());const c=st.map(cerchio);
 const gr=c.findIndex(q=>q&&q.r*2>.6*Math.max(all.w,all.h));
 if(gr>=0&&(st.length>1||true)){const C=c[gr],alt=st.filter((_,i)=>i!=gr);
  if(!alt.length)return[{k:'lamp',r:0,d:.2},{k:'mot',r:0,d:.25},{k:'gen',r:0,d:.25},{k:'volt',r:0,d:.25},{k:'amp',r:0,d:.25}];
  const fuori=alt.flat().filter(p=>Math.hypot(p[0]-C.x,p[1]-C.y)>C.r*1.25).length/alt.flat().length;
  const isn=fuori>.25||alt.length>=3,ni=nube(alt,32),sc=NUBI.filter(t=>isn||t.k!='B').map(t=>({k:t.k,d:Math.min(...[0,1,2,3].filter(r=>t.k=='B'||r==0).map(r=>greedy(ni,ruotaP(t.p,r))))})).sort((a,b)=>a.d-b.d);
  const mapa={X:'lamp',M:'mot',V:'volt',A:'amp',T:'gen',B:'npn'};
  let ord=sc.map(s=>({k:mapa[s.k],r:0,d:s.d*.5}));
  if(isn)ord.sort((a,b)=>(b.k=='npn')-(a.k=='npn'));
  if(ord[0].k=='npn'){const t=NUB.filter(n=>n.k=='npn').map(n=>({r:n.r,d:greedy(nube(st.length>1?alt:st),n.p)})).sort((a,b)=>a.d-b.d);ord[0].r=t[0].r;ord=ord.concat([{k:'pnp',r:t[0].r,d:.6}])}
  return ord}
 const pc=st.length>1?piccoloCerchioADestra(st,all):null;let base=st,neg=false;if(pc){base=st.filter((_,i)=>i!=pc.i);neg=true}
 const p=nube(base);const sc=NUB.map(t=>({k:t.k,r:t.r,d:greedy(p,t.p)}));const best={};for(const s of sc){const q=s.k;if(!best[q]||s.d<best[q].d)best[q]=s}
 let o=Object.values(best).sort((a,b)=>a.d-b.d);
 if(neg){const f={and:'nand',or:'nor',not:'not'};const ga=o.filter(x=>f[x.k]).map(x=>({...x,k:f[x.k]}));ga[0].d*=.7;
  const dx=pc.c.x-bb(base.flat()).cx,dy=pc.c.y-bb(base.flat()).cy,r=Math.abs(dx)>Math.abs(dy)?(dx>0?0:2):(dy>0?1:3);ga.forEach(g=>g.r=r);o=[...ga,...o.filter(x=>!f[x.k])]}
 // pila o condensatore: due tratti paralleli
 const top=o.slice(0,3).map(x=>x.k);
 const pa=st.length==2?[bb(st[0]),bb(st[1])]:null,par=pa&&((pa[0].h>2*pa[0].w&&pa[1].h>2*pa[1].w)||(pa[0].w>2*pa[0].h&&pa[1].w>2*pa[1].h));
 if(par&&(top.includes('cap')||top.includes('pila'))){const a=len(st[0]),b=len(st[1]),qq=Math.max(a,b)/Math.min(a,b);const pref=qq>1.35?'pila':'cap';
  const A=bb(st[0]),B=bb(st[1]);const lungo=a>=b?A:B,corto=a>=b?B:A,oriz=A.w+B.w<A.h+B.h;
  o.sort((x,y)=>(y.k==pref)-(x.k==pref));if(pref=='pila'){const e=o[0];e.r=oriz?(lungo.cx>corto.cx?0:2):(lungo.cy>corto.cy?1:3)}else o[0].r=(A.w+B.w<A.h+B.h)?0:1}
 if(pa&&!par){const[h,v]=pa[0].w>pa[0].h?[pa[0],pa[1]]:[pa[1],pa[0]];if(h.w>2*h.h&&v.h>2*v.w&&v.cx>h.x0&&v.cx<h.x1){const e=o.find(x=>x.k=='btn');if(e){e.r=0;o.sort((a,b)=>(b.k=='btn')-(a.k=='btn'))}}else if(v.h>2*v.w&&h.w>2*h.h){}}
 // LED o diodo: frecce fuori dal corpo
 if(o[0].k=='dio'||o[0].k=='led'){const dd=o.find(x=>x.k=='dio'),ll=o.find(x=>x.k=='led');if(dd&&ll&&ll.d<dd.d)dd.r=ll.r;o.sort((a,b)=>(b.k=='dio')-(a.k=='dio'))}
 // ricciolo o zig-zag: l'induttore resta da un solo lato della corda
 if(st.length==1&&(o[0].k=='res'||o[0].k=='ind')&&o.slice(0,3).some(x=>x.k=='ind')){const s=st[0],a=s[0],b=s[s.length-1],L=Math.hypot(b[0]-a[0],b[1]-a[1])||1;let mn=0,mx=0;for(const p of s){const d=((b[0]-a[0])*(a[1]-p[1])-(a[0]-p[0])*(b[1]-a[1]))/L;mn=Math.min(mn,d);mx=Math.max(mx,d)}const pref=Math.min(-mn,mx)<.28*Math.max(-mn,mx)?'ind':'res';o.sort((x,y)=>(y.k==pref)-(x.k==pref))}
 return o}

/* ---- riconoscimento per caratteristiche (prima del confronto con i modelli) ---- */
const rotPt=(p,r)=>{let[x,y]=p;for(let i=0;i<((r%4)+4)%4;i++)[x,y]=[-y,x];return[x,y]};
function cerchioL(s){const b=bb(s),D=Math.max(b.w,b.h);if(D<.4)return null;const ar=b.w/(b.h||1e-3);if(ar<.6||ar>1.65)return null;const L=len(s),per=Math.PI*(b.w+b.h)/2;if(L<.8*per||L>1.6*per)return null;
 const e=Math.hypot(s[0][0]-s[s.length-1][0],s[0][1]-s[s.length-1][1]);if(e>.45*D)return null;let m=0,v=0;const ds=s.map(([x,y])=>Math.hypot((x-b.cx)/(b.w/2||1e-3),(y-b.cy)/(b.h/2||1e-3)));ds.forEach(d=>m+=d);m/=ds.length;ds.forEach(d=>v+=(d-m)**2);v=Math.sqrt(v/ds.length);if(v>.16)return null;
 // copre tutto il giro
 const q=new Set(s.map(([x,y])=>Math.floor((Math.atan2(y-b.cy,x-b.cx)+Math.PI)/(Math.PI/6))));if(q.size<11)return null;{const p=rdp(s,.035*D);let m=0;for(let i=1;i<p.length;i++)m=Math.max(m,Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]));if(m/L>.2)return null}return{x:b.cx,y:b.cy,r:(b.w+b.h)/4,b}}
function spigolo(s,tol){const pp=rdp(s,tol);let mx=0;for(let i=1;i<pp.length-1;i++){const a1=Math.atan2(pp[i][1]-pp[i-1][1],pp[i][0]-pp[i-1][0]),a2=Math.atan2(pp[i+1][1]-pp[i][1],pp[i+1][0]-pp[i][0]);let d=Math.abs(a2-a1);if(d>Math.PI)d=2*Math.PI-d;mx=Math.max(mx,d)}return mx}
function vertici(s,tol){const p=rdp(s,tol);return p}
function dentroCerchio(C,altri){// lampada, motore, voltmetro, amperometro, generatore
 const dentro=altri.filter(s=>{let c=0;for(const[x,y]of s)if(Math.hypot(x-C.x,y-C.y)<C.r*1.05)c++;return c>.6*s.length});
 const ord=(k)=>{const t=['lamp','mot','volt','amp','gen'];return[k,...t.filter(x=>x!=k)].map(k=>({k,r:0,d:0}))};
 if(!dentro.length)return null;const tol=.14*C.r,I=dentro.map(s=>({s,f:sembraFilo(s),v:vertici(s,tol),b:bb(s)}));
 const diag=x=>{if(!x.f.dritto)return 0;const a=Math.abs(Math.atan2(x.s[x.s.length-1][1]-x.s[0][1],x.s[x.s.length-1][0]-x.s[0][0]))*180/Math.PI;const q=Math.min(a,180-a);return q>22&&q<68?Math.sign((x.s[x.s.length-1][1]-x.s[0][1])*(x.s[x.s.length-1][0]-x.s[0][0])):0};
 if(I.length>=2){const d=I.map(diag).filter(Boolean);if(d.includes(1)&&d.includes(-1))return ord('lamp')}
 // tratto principale: il più lungo
 const P=I.slice().sort((a,b)=>b.f.L-a.f.L)[0],v=P.v,b=P.b,ini=P.s[0],fin=P.s[P.s.length-1];
 const nv=v.length-2;// angoli
 const bassi=y=>y>b.cy+.2*b.h,alti=y=>y<b.cy-.2*b.h;
 // onda: estremi a metà altezza da parti opposte, senza spigoli netti
 const curvaDolce=()=>spigolo(P.s,.08*C.r)<1.45;const _cd=()=>{const pp=rdp(P.s,.04*C.r);let mx=0;for(let i=1;i<pp.length-1;i++){const a1=Math.atan2(pp[i][1]-pp[i-1][1],pp[i][0]-pp[i-1][0]),a2=Math.atan2(pp[i+1][1]-pp[i][1],pp[i+1][0]-pp[i][0]);let d=Math.abs(a2-a1);if(d>Math.PI)d=2*Math.PI-d;mx=Math.max(mx,d)}return mx<1.25};
 if(b.w>1.3*b.h&&!bassi(ini[1])==!bassi(fin[1])===false||false){}
 const yi=(ini[1]-b.cy)/(b.h||1),yf=(fin[1]-b.cy)/(b.h||1);
 if(b.w>1.2*b.h&&Math.abs(yi)<.36&&Math.abs(yf)<.36&&!(yi>.15&&yf>.15)&&!(yi<-.15&&yf<-.15))return ord('gen');
 if(nv>=3&&bassi(ini[1])&&bassi(fin[1]))return ord('mot');
 if(nv>=1&&nv<=2&&I.length==1){const piu=v.slice(1,-1).sort((p,q)=>p[1]-q[1]);if(bassi(piu[piu.length-1][1])&&alti(ini[1])&&alti(fin[1]))return ord('volt');if(alti(piu[0][1])&&bassi(ini[1])&&bassi(fin[1]))return ord('amp')}
 if(I.length>=2&&nv>=1){const top=v.slice(1,-1).sort((p,q)=>p[1]-q[1])[0];if(alti(top[1])&&bassi(ini[1])&&bassi(fin[1]))return ord('amp');const bot=v.slice(1,-1).sort((p,q)=>q[1]-p[1])[0];if(bassi(bot[1])&&alti(ini[1])&&alti(fin[1]))return ord('volt')}
 if(nv>=3)return ord('mot');
 return null}
function transistor(st){// barra + due diagonali che partono dalla barra verso lo stesso lato
 const I=st.map(s=>({s,f:sembraFilo(s)}));const dr=I.filter(x=>x.f.dritto&&x.f.L>.5);
 for(const B of dr){const a=B.s[0],z=B.s[B.s.length-1],L=Math.hypot(z[0]-a[0],z[1]-a[1]);if(L<.8)continue;const u=[(z[0]-a[0])/L,(z[1]-a[1])/L],n=[-u[1],u[0]];
  const D=[];for(const X of dr){if(X==B)continue;const p=X.s[0],q=X.s[X.s.length-1];const loc=w=>[(w[0]-a[0])*u[0]+(w[1]-a[1])*u[1],(w[0]-a[0])*n[0]+(w[1]-a[1])*n[1]];
   let P=loc(p),Q=loc(q);if(Math.abs(P[1])>Math.abs(Q[1]))[P,Q]=[Q,P];const lx=Math.hypot(Q[0]-P[0],Q[1]-P[1]);if(lx<.5*L||lx>2.2*L)continue;
   if(Math.abs(P[1])>.3*L+.15||P[0]<-.15*L||P[0]>1.15*L)continue;const ang=Math.atan2(Math.abs(Q[1]-P[1]),Math.abs(Q[0]-P[0]))*180/Math.PI;if(ang<18||ang>72)continue;
   D.push({X,P,Q,lato:Math.sign(Q[1]),dir:Math.sign(Q[0]-P[0])})}
  for(let i=0;i<D.length;i++)for(let j=i+1;j<D.length;j++){const d1=D[i],d2=D[j];if(d1.lato!=d2.lato||d1.dir==d2.dir)continue;if(Math.abs(d1.P[0]-d2.P[0])<.2*L)continue;{const o1=d1.Q,o2=d2.Q;if(Math.abs(o1[0]-o2[0])<1.15*Math.abs(d1.P[0]-d2.P[0]))continue}
   {const gq=d=>d.X.s[Math.abs(d.P[1])<=Math.abs(d.Q[1])?d.X.s.length-1:0];const g1=d1.X.s,g2=d2.X.s,o1=[g1[0],g1[g1.length-1]],o2=[g2[0],g2[g2.length-1]];const est=d=>{const s=d.X.s,a0=s[0],a1=s[s.length-1];return Math.abs(d.P[1])<=Math.abs(d.Q[1])&&Math.hypot(a0[0]-a[0]-d.P[0]*u[0]-d.P[1]*n[0],a0[1]-a[1]-d.P[0]*u[1]-d.P[1]*n[1])<1e-6?a1:(Math.hypot(a1[0]-a[0]-d.Q[0]*u[0]-d.Q[1]*n[0],a1[1]-a[1]-d.Q[0]*u[1]-d.Q[1]*n[1])<1e-6?a1:a0)};const e1=est(d1),e2=est(d2),dd=Math.hypot(e1[0]-e2[0],e1[1]-e2[1]);
    const lato=st.some(s=>s!=B.s&&s!=g1&&s!=g2&&sembraFilo(s).L>.6*dd&&((Math.hypot(s[0][0]-e1[0],s[0][1]-e1[1])<.3*L&&Math.hypot(s[s.length-1][0]-e2[0],s[s.length-1][1]-e2[1])<.3*L)||(Math.hypot(s[0][0]-e2[0],s[0][1]-e2[1])<.3*L&&Math.hypot(s[s.length-1][0]-e1[0],s[s.length-1][1]-e1[1])<.3*L)));if(lato)continue}
   // direzione verso cui vanno le diagonali: lato*n
   const v=[n[0]*d1.lato,n[1]*d1.lato];const r=Math.abs(v[0])>=Math.abs(v[1])?(v[0]>0?0:2):(v[1]>0?1:3);
   // emettitore: freccia vicina a una diagonale
   const resto=I.filter(x=>x.s!=B.s&&x!=d1.X&&x!=d2.X&&x.f.L<.8*L);let em=null,pnp=false;
   for(const x of resto){const c=bb(x.s);const cc=[c.cx,c.cy];for(const d of[d1,d2]){const s=d.X.s;const pa=s[0],pb=s[s.length-1];const near=w=>Math.hypot(w[0]-cc[0],w[1]-cc[1]);const qbar=Math.abs(((pa[0]-a[0])*n[0]+(pa[1]-a[1])*n[1]))<Math.abs(((pb[0]-a[0])*n[0]+(pb[1]-a[1])*n[1]))?pa:pb,qout=qbar==pa?pb:pa;
     const dl=Math.abs((cc[0]-pa[0])*(pb[1]-pa[1])-(cc[1]-pa[1])*(pb[0]-pa[0]))/Math.hypot(pb[0]-pa[0],pb[1]-pa[1]);if(dl>.35*L)continue;em=d;pnp=near(qbar)<near(qout)}}
   let flip=false;if(em){const dd=em.dir;// in canonico: asse u diventa y. emettitore in basso per npn
    const cu=rotPt(u,-r);const giu=(cu[1]*dd)>0;flip=pnp?giu:!giu}
   const k=pnp?'pnp':'npn',o=pnp?'npn':'pnp';return[{k,r,flip,d:0},{k:o,r,flip,d:0}]}}
 return null}
function frecce(st){// freccine dei LED: tratti corti fuori dal corpo
 const all=bb(st.flat()),D=Math.max(all.w,all.h);const cand=st.filter(s=>len(s)<.45*D*1.25&&Math.max(bb(s).w,bb(s).h)<.42*D);if(!cand.length||cand.length==st.length)return null;
 const corpo=st.filter(s=>!cand.includes(s)),cb=bb(corpo.flat()),e=.08*D;const fr=cand.filter(s=>s.filter(p=>p[0]<cb.x0-e||p[0]>cb.x1+e||p[1]<cb.y0-e||p[1]>cb.y1+e).length>.6*s.length);
 return fr.length?{fr,corpo:st.filter(s=>!fr.includes(s))}:null}
function unSoloLato(s){const a=s[0],b=s[s.length-1],L=Math.hypot(b[0]-a[0],b[1]-a[1])||1;let mn=0,mx=0,cr=0,seg=0;for(const p of s){const d=((b[0]-a[0])*(a[1]-p[1])-(a[0]-p[0])*(b[1]-a[1]))/L;mn=Math.min(mn,d);mx=Math.max(mx,d);const sg=d>.12*L/4?1:d<-.12*L/4?-1:0;if(sg&&sg!=seg){if(seg)cr++;seg=sg}}return{uno:Math.min(-mn,mx)<.3*Math.max(-mn,mx),cr,amp:Math.max(-mn,mx)/L}}
function porta(st){// porta logica: verso, e AND / OR / XOR / NOT
 const P=[];for(const s of st){const q=ricampiona([s],Math.max(8,Math.round(len(s)*6)));P.push(...q)}const all=bb(P);
 const C=P.map(p=>[p[0]-all.cx,p[1]-all.cy]),S=Math.max(all.w,all.h)||1;
 const cham=(A,B)=>{let s=0;for(const a of A){let m=1e9;for(const b of B){const d=(a[0]-b[0])**2+(a[1]-b[1])**2;if(d<m)m=d}s+=Math.sqrt(m)}return s/A.length/S};
 let best=null;
 for(let r=0;r<4;r++){const q=C.map(p=>rotPt(p,-r)),b=bb(q);const N=q.map(([x,y])=>[(x-b.x0)/(b.w||1),(y-b.cy)/(b.h||1)]);
  const ext=f=>{let a=9,z=-9;for(const p of N)if(f(p)){a=Math.min(a,p[1]);z=Math.max(z,p[1])}return z>a?z-a:0};
  const sc=ext(p=>p[0]<.2)-ext(p=>p[0]>.8);if(!best||sc>best.sc)best={r,sc,N}}
 const N=best.N;
 const dietro=N.filter(p=>Math.abs(p[1])<.2&&p[0]<.45).sort((a,b)=>a[0]-b[0]);let gap=0,gi=0;for(let i=1;i<dietro.length;i++){const g=dietro[i][0]-dietro[i-1][0];if(g>gap){gap=g;gi=i}}
 const cl1=dietro.slice(0,gi),cl2=dietro.slice(gi),span=c=>c.length?Math.max(...c.map(p=>p[1]))-Math.min(...c.map(p=>p[1])):0;
 const xor=gap>.06&&span(cl1)>.18&&span(cl2)>.18;
 const fr=N.filter(p=>Math.abs(Math.abs(p[1])-.25)<.05&&p[0]>.3),xf=fr.length?Math.max(...fr.map(p=>p[0])):1,depth=1-xf;
 const bm=N.filter(p=>Math.abs(p[1])<.12&&p[0]<.5),back=bm.length?Math.min(...bm.map(p=>p[0])):0;
 // punta aguzza davanti: triangolo (NOT)
 let punta=0;{const q=C.map(p=>rotPt(p,-best.r)),b=bb(q);for(const s of st){const ss=s.map(p=>rotPt([p[0]-all.cx,p[1]-all.cy],-best.r));const pp=rdp(ss,.05*S);for(let i=0;i<pp.length;i++){const x=(pp[i][0]-b.x0)/(b.w||1),y=(pp[i][1]-b.cy)/(b.h||1);if(x<.85||Math.abs(y)>.2)continue;let d;if(i>0&&i<pp.length-1){const a1=Math.atan2(pp[i][1]-pp[i-1][1],pp[i][0]-pp[i-1][0]),a2=Math.atan2(pp[i+1][1]-pp[i][1],pp[i+1][0]-pp[i][0]);d=Math.abs(a2-a1);if(d>Math.PI)d=2*Math.PI-d}else if(pp.length>3&&Math.hypot(pp[0][0]-pp[pp.length-1][0],pp[0][1]-pp[pp.length-1][1])<.15*S){const A=pp[pp.length-2],B=pp[1],a1=Math.atan2(pp[i][1]-A[1],pp[i][0]-A[0]),a2=Math.atan2(B[1]-pp[i][1],B[0]-pp[i][0]);d=Math.abs(a2-a1);if(d>Math.PI)d=2*Math.PI-d}else continue;punta=Math.max(punta,d)}}}
 let k;if(xor)k='xor';else if(back>.08)k='or';else k=(depth>.15||punta>1.5)?'not':'and';
 let r=best.r;
 return{k,r,depth,back,gap,punta,sc:best.sc}}
function barraDiodo(st){const all=bb(st.flat()),D=Math.max(all.w,all.h);
 for(const B of st){const f=sembraFilo(B);if(!f.dritto||f.L<.45*D)continue;const a=B[0],z=B[B.length-1],L=Math.hypot(z[0]-a[0],z[1]-a[1]),u=[(z[0]-a[0])/L,(z[1]-a[1])/L],n=[-u[1],u[0]];
  const al=st.filter(s=>s!=B).flat();if(al.length<5)continue;const loc=al.map(p=>[(p[0]-a[0])*u[0]+(p[1]-a[1])*u[1],(p[0]-a[0])*n[0]+(p[1]-a[1])*n[1]]);
  const pos=loc.filter(p=>p[1]>.12*L).length,neg=loc.filter(p=>p[1]<-.12*L).length;if(Math.min(pos,neg)>.08*loc.length)continue;const sg=pos>=neg?1:-1;
  const vic=loc.slice().sort((p,q)=>Math.abs(p[1])-Math.abs(q[1]))[0];if(Math.abs(vic[1])>.2*L||vic[0]<.3*L||vic[0]>.7*L)continue;
  const ex=Math.max(...loc.map(p=>p[0]))-Math.min(...loc.map(p=>p[0]));if(ex<.55*L)continue;
  // i punti vicini alla barra stanno solo nel mezzo (la punta), non lungo tutta la barra
  const lungo=loc.filter(p=>Math.abs(p[1])<.15*L);if(lungo.length&&Math.max(...lungo.map(p=>p[0]))-Math.min(...lungo.map(p=>p[0]))>.45*L)continue;
  const v=[-n[0]*sg,-n[1]*sg];return{r:Math.abs(v[0])>=Math.abs(v[1])?(v[0]>0?0:2):(v[1]>0?1:3)}}
 return null}
function riconosciBase(st){const all=bb(st.flat()),D=Math.max(all.w,all.h);
 // 1. cerchio grande: strumenti, lampada, motore, generatore o transistor col cerchio
 const C=st.map(cerchioL);const g=C.findIndex(c=>c&&2*c.r>.55*D);
 if(g>=0){const altri=st.filter((_,i)=>i!=g);const tr=transistor(altri);if(tr)return tr;const q=dentroCerchio(C[g],altri);if(q)return q}
 const tr=transistor(st);if(tr)return tr;
 // rettangolo chiuso: resistenza, o relè se c'è una diagonale che lo taglia
 {const ret=st.map(s=>{const f=sembraFilo(s),b=bb(s),Dm=Math.max(b.w,b.h);if(!f.chiuso||Dm<.6*D)return null;const p=rdp(s,.1*Dm);if(p.length<5||p.length>7)return null;let ang=0;for(let i=1;i<p.length;i++){const a=Math.abs(Math.atan2(p[i][1]-p[i-1][1],p[i][0]-p[i-1][0])*180/Math.PI)%90;if(Math.min(a,90-a)<18)ang+=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1])}return ang>.85*f.L&&Math.max(b.w,b.h)>1.45*Math.min(b.w,b.h)?{b}:null});
  const ri=ret.findIndex(Boolean);if(ri>=0){const b=ret[ri].b,r=b.w>=b.h?0:1,altri=st.filter((_,i)=>i!=ri);const dg=altri.some(s=>{const f=sembraFilo(s),q=bb(s);return f.dritto&&f.L>.6*Math.min(b.w,b.h)*1.4&&q.w>.4*b.w&&q.h>.4*b.h});
   if(dg)return[{k:'rel',r:0,d:0},{k:'res',r,d:0}];if(altri.every(s=>sembraFilo(s).L<.8*Math.max(b.w,b.h)))return[{k:'res',r,d:0},{k:'rel',r:0,d:0}]}}
 // 2. un solo tratto aperto e allungato: induttore (archetti da un lato) o resistenza a zig-zag
 if(st.length==1){const s=st[0],f=sembraFilo(s),b=bb(s);if(!f.chiuso&&Math.max(b.w,b.h)>1.8*Math.min(b.w,b.h)&&f.L/Math.hypot(s[s.length-1][0]-s[0][0],s[s.length-1][1]-s[0][1])>1.25){const u=unSoloLato(s),r=b.w>=b.h?0:1;
  if(u.uno&&u.amp>.08)return[{k:'ind',r,d:0},{k:'res',r,d:0}];if(u.cr>=3)return[{k:'res',r,d:0},{k:'ind',r,d:0}]}}
 // 3. bollino della negazione
 const pc=st.length>1?piccoloCerchioADestra(st,all):null;
 if(pc){const base=st.filter((_,i)=>i!=pc.i),bb0=bb(base.flat()),dx=pc.c.x-bb0.cx,dy=pc.c.y-bb0.cy,r=Math.abs(dx)>Math.abs(dy)?(dx>0?0:2):(dy>0?1:3);
  const ps=porta(base);const k=ps.k=='or'||ps.k=='xor'?'nor':ps.k=='not'?'not':'nand';const alt=['nand','nor','not'].filter(x=>x!=k);return[{k,r,d:0},...alt.map(k=>({k,r,d:0}))]}
 // 4. freccine: LED
 const fz=frecce(st);if(fz){const o=riconosciP(fz.corpo);const dd=o.find(x=>x.k=='dio'||x.k=='led');if(dd&&o.indexOf(dd)<3)return[{k:'led',r:dd.r,d:0},{k:'dio',r:dd.r,d:0},...o.filter(x=>x.k!='dio'&&x.k!='led')]}
 const o=riconosciP(st);
 // diodo: una barra dritta toccata nel mezzo dalla punta del triangolo
 {const dd=barraDiodo(st);if(dd)return[{k:'dio',r:dd.r,d:0},{k:'led',r:dd.r,d:0},...o.filter(x=>x.k!='dio'&&x.k!='led')]}
 // il relè ha sempre la diagonale che taglia il rettangolo; senza, non è un relè
 if(o[0].k=='rel'&&!st.some(s=>{const f=sembraFilo(s);return f.dritto&&f.L>.5*D})){o.push(o.shift())}
 // forma da porta logica tra le prime scelte: si decide guardando il profilo
 const GATE=['and','or','xor','nand','nor','not'];if(!GATE.includes(o[0].k)&&o.slice(0,3).some(x=>GATE.includes(x.k))&&!['dio','led'].includes(o[0].k)){const ps=porta(st);if(ps.sc>.45)return[{k:ps.k,r:ps.r,d:0},...o.filter(x=>x.k!=ps.k)]}
 // 5. porte logiche: verso e tipo per caratteristiche
 if(GATE.includes(o[0].k)){const ps=porta(st);return[{k:ps.k,r:ps.r,d:0},...o.filter(x=>x.k!=ps.k)]}
 return o}


/* ---- la mano di chi disegna: esempi corretti a mano, salvati sul dispositivo ---- */
let MIEI=[];const FERMI={lamp:1,mot:1,volt:1,amp:1,gen:1};
function caricaMiei(a){MIEI=Array.isArray(a)?a.filter(x=>x&&x.k&&Array.isArray(x.p)&&x.p.length==NP):[]}
function impara(st,k,r){if(!st||!st.length)return MIEI;const p=nube(st);MIEI.push({k,r:r||0,n:st.length,p,t:Date.now()});const mie=MIEI.filter(x=>x.k==k);if(mie.length>6)MIEI.splice(MIEI.indexOf(mie[0]),1);if(MIEI.length>60)MIEI.shift();return MIEI}
const SOGLIA_MIA=1.05;
function mio(st,vicini){if(!MIEI.length)return null;const p=nube(st);let best=null,sec=null;
 for(const m of MIEI){if(Math.abs(m.n-st.length)>1)continue;for(let q=0;q<(FERMI[m.k]?1:4);q++){const d=greedy(p,ruotaP(m.p,q));const c={k:m.k,r:(m.r+q)%4,d};if(!best||d<best.d){if(best&&best.k!=c.k)sec=best;best=c}else if(c.k!=best.k&&(!sec||d<sec.d))sec=c}}
 if(!best||(sec&&sec.d-best.d<.12))return null;if(best.d>(vicini&&vicini.includes(best.k)?1.3:SOGLIA_MIA))return null;return{k:best.k,r:best.r,d:best.d,mio:1}}
function riconosci(st){const o=riconosciBase(st),m=mio(st,o.slice(0,3).map(x=>x.k));return m?[m,...o.filter(x=>x.k!=m.k)]:o}

/* stile del tratto */
function rdp(p,e){if(p.length<3)return p;const a=p[0],b=p[p.length-1],L=Math.hypot(b[0]-a[0],b[1]-a[1])||1e-6;let m=0,ix=0;for(let i=1;i<p.length-1;i++){const d=Math.abs((b[0]-a[0])*(a[1]-p[i][1])-(a[0]-p[i][0])*(b[1]-a[1]))/L;if(d>m){m=d;ix=i}}if(m<e){return[a,b]}const l=rdp(p.slice(0,ix+1),e),r=rdp(p.slice(ix),e);return l.slice(0,-1).concat(r)}
function sembraFilo(s){const L=len(s),b=bb(s),e=Math.hypot(s[0][0]-s[s.length-1][0],s[0][1]-s[s.length-1][1]);const pt=rdp(s,.45);const ang=Math.atan2(b.h,b.w)*180/Math.PI,dritto=e/L>.92;
 return{L,chiuso:e<.18*L&&L>3,angoli:pt.length-2,dritto,obliquo:dritto&&ang>14&&ang<72,diag:Math.hypot(b.w,b.h)}}


/* ---- dal tratto al componente: decide fili e simboli, in modo provabile ---- */
function info(s){const f=sembraFilo(s);const pts=rdp(s,Math.max(.3,.06*f.diag));let ok=0,tot=0;for(let i=1;i<pts.length;i++){const dx=pts[i][0]-pts[i-1][0],dy=pts[i][1]-pts[i-1][1],l=Math.hypot(dx,dy);tot+=l;let a=Math.abs(Math.atan2(dy,dx)*180/Math.PI)%90;if(Math.min(a,90-a)<20)ok+=l}
 let inv=0;for(let i=2;i<pts.length;i++){const a1=Math.atan2(pts[i-1][1]-pts[i-2][1],pts[i-1][0]-pts[i-2][0]),a2=Math.atan2(pts[i][1]-pts[i-1][1],pts[i][0]-pts[i-1][0]);let d=Math.abs(a2-a1);if(d>Math.PI)d=2*Math.PI-d;if(d>2.36)inv++}
 f.M=!f.chiuso&&tot>0&&ok/tot>.88&&f.L<1.3*tot&&inv==0;f.b=bb(s);f.or=f.b.w>=f.b.h?0:1;return f}
const vicinoB=(a,b,m)=>!(a.x0>b.x1+m||a.x1<b.x0-m||a.y0>b.y1+m||a.y1<b.y0-m);
function estremi(s){return[s[0],s[s.length-1]]}
function chiusaInsieme(st){if(st.length<2)return false;const E=st.flatMap((s,i)=>estremi(s).map(p=>({p,i})));const b=bb(st.flat()),tol=Math.max(.45,.12*Math.max(b.w,b.h));return E.every(e=>E.some(q=>q.i!=e.i&&Math.hypot(q.p[0]-e.p[0],q.p[1]-e.p[1])<tol))}
function soloDritti(st,I){// tutti tratti a squadra: pila, condensatore, massa, pulsante, resistenza a rettangolo; altrimenti fili
 const b=bb(st.flat()),mx=Math.max(b.w,b.h),mn=Math.min(b.w,b.h);
 if(chiusaInsieme(st)&&mx<=7&&mn<=.6*mx&&mn>.25)return{k:'res',r:b.w>=b.h?0:1};
 // segmenti paralleli corti (piatti): orientamento dominante
 const seg=I.map((f,i)=>({i,f,o:f.or,l:Math.max(f.b.w,f.b.h),c:f.or?f.b.cx:f.b.cy,m:f.or?f.b.cy:f.b.cx}));
 for(const o of[0,1]){const P=seg.filter(s=>s.o==o&&s.l<=6.5&&s.l>=.15);if(P.length<2)continue;
  const resto=seg.filter(s=>!P.includes(s));
  // i piatti si sovrappongono nella direzione della loro lunghezza ed sono vicini
  P.sort((a,b)=>a.c-b.c);const gap=P[P.length-1].c-P[0].c,lmax=Math.max(...P.map(p=>p.l));const mid=P.map(p=>p.m),sp=Math.max(...mid)-Math.min(...mid);
  if(gap>(P.length>2?.9*lmax*(P.length-1):Math.max(.9,.6*lmax))||sp>.3*lmax)continue;
  {const E=P.flatMap(p=>[st[p.i][0],st[p.i][st[p.i].length-1]].map(q=>({q,i:p.i})));if(E.some(a=>E.some(b=>b.i!=a.i&&Math.hypot(a.q[0]-b.q[0],a.q[1]-b.q[1])<.2)))continue}
  // il resto deve essere fatto di piedini: perpendicolari, sull'asse
  const ok=resto.every(s=>s.o!=o&&Math.abs(s.m-(P[0].m))<.6*lmax+.4);if(!ok)continue;
  const c0=P[0].c,c1=P[P.length-1].c,tra=resto.some(s=>{const a=o==0?s.f.b.y0:s.f.b.x0,z=o==0?s.f.b.y1:s.f.b.x1;return Math.min(z,c1)-Math.max(a,c0)>.4*(c1-c0)});if(tra)continue;
  const ax=o==0?'y':'x';// o=0: piatti orizzontali -> componente verticale
  if(P.length>=3){const ls=P.map(p=>p.l);const dec=ls.every((l,i)=>!i||l<ls[i-1]*.85),inc=ls.every((l,i)=>!i||l>ls[i-1]*1.18);
   if((dec||inc)&&ls[0]!=ls[ls.length-1]&&Math.max(...ls)/Math.min(...ls)>1.6){// massa: piatti che si accorciano
    const verso=dec?1:-1;return{k:'gnd',r:o==0?(verso>0?0:2):(verso>0?3:1)}}}
  const A=P[0],B=P[P.length-1];// i due piatti esterni... per pila prendo i due più lunghi a confronto
  const q=Math.max(A.l,B.l)/Math.min(A.l,B.l);
  if(q>1.3){const lungo=A.l>B.l?A:B,corto=lungo==A?B:A;// + dalla parte del piatto lungo
   const pos=lungo.c>corto.c;return{k:'pila',r:o==1?(pos?0:2):(pos?1:3)}}
  return{k:'cap',r:o==1?0:1}}
 // pulsante: una barra con un gambo che parte dal mezzo
 for(const s of seg){const per=seg.filter(q=>q!=s&&q.o!=s.o);for(const g of per){const gb=g.f.b,sb=s.f.b;const mezzo=s.o==0?Math.abs(gb.cx-sb.cx)<.3*s.l:Math.abs(gb.cy-sb.cy)<.3*s.l;const tocca=s.o==0?Math.min(Math.abs(gb.y0-sb.cy),Math.abs(gb.y1-sb.cy))<.45:Math.min(Math.abs(gb.x0-sb.cx),Math.abs(gb.x1-sb.cx))<.45;
  const cap=seg.some(c=>c!=s&&c!=g&&c.o==s.o&&c.l<s.l&&(s.o==0?Math.abs(c.f.b.cy-(Math.abs(gb.y0-sb.cy)<Math.abs(gb.y1-sb.cy)?gb.y1:gb.y0))<.4:Math.abs(c.f.b.cx-(Math.abs(gb.x0-sb.cx)<Math.abs(gb.x1-sb.cx)?gb.x1:gb.x0))<.4));
  if(mezzo&&tocca&&s.l<=(cap?4.8:4)&&g.l<(cap?1.2:.9)*s.l&&g.l>.3*s.l){const su=s.o==0?(gb.cy<sb.cy):(gb.cx<sb.cx);return{k:'btn',r:s.o==0?(su?0:2):(su?3:1)}}}}
 return null}
function decidi(st){const I=st.map(info);
 if(st.length==1){const f=I[0];if(!f.chiuso&&f.dritto&&!f.M&&f.L<4.5&&f.L>.8)return{fili:[],comp:{alt:[{k:'sw',r:f.b.w>=f.b.h?0:1},{k:'btn',r:0}],st}};if(f.M||(!f.chiuso&&f.dritto&&f.L>=4.5))return{fili:st,comp:null}}
 if(I.every(f=>f.M)){const B=bb(st.flat());const q=(Math.max(B.w,B.h)<=6&&I.filter(f=>f.L>=4).length<=1)?soloDritti(st,I):null;if(q){const m=mio(st);const a=m&&m.k!=q.k?[m,q]:[q];return{fili:[],comp:{alt:[...a,...riconosci(st).filter(x=>!a.some(y=>y.k==x.k))],st}}}{const m=mio(st);if(m)return{fili:[],comp:{alt:[m,...riconosciBase(st).filter(x=>x.k!=m.k)],st}}}return{fili:st,comp:null}}
 // piedini e fili attaccati: tratti a squadra fuori dal nucleo del simbolo
 const nuc=bb(st.filter((s,i)=>!I[i].M).flat());const e={x0:nuc.x0-.35,x1:nuc.x1+.35,y0:nuc.y0-.35,y1:nuc.y1+.35};
 const fuori=(s)=>s.filter(p=>p[0]<e.x0||p[0]>e.x1||p[1]<e.y0||p[1]>e.y1).length/s.length;
 const dentroE=(p,m)=>p[0]>=nuc.x0-m&&p[0]<=nuc.x1+m&&p[1]>=nuc.y0-m&&p[1]<=nuc.y1+m;
 const piede=(s)=>{const a=s[0],z=s[s.length-1],m=s[Math.floor(s.length/2)],L=len(s),q=Math.max(.4,.5*L);return!dentroE(m,0)&&((dentroE(a,.45)&&!dentroE(z,q))||(dentroE(z,.45)&&!dentroE(a,q)))};
 const fili=[],core=[];st.forEach((s,i)=>{const f=I[i];if(f.M&&(fuori(s)>.6||(f.dritto&&piede(s)))){if(f.L>=3.5)fili.push(s)}else core.push(s)});
 // un tratto obliquo con i piedini: interruttore
 if(core.length==1){const f=info(core[0]);if(!f.chiuso&&f.dritto&&f.L<4.5)return{fili,comp:{alt:[{k:'sw',r:f.b.w>=f.b.h?0:1},{k:'btn',r:0}],st:core}}}
 return{fili,comp:{alt:riconosci(core),st:core}}}
/* raccoglie i tratti nel tempo. t = momento in cui il dito si alza, in millisecondi. Restituisce azioni da eseguire. */
const ATTESA=750,RIPENSA=2300;
function Racc(){this.pend=[];this.rec=[];this.T=null;this.tl=0}
Racc.prototype.scadi=function(t){if(!this.pend.length||this.T==null||t<this.T)return[];const st=this.pend;this.pend=[];this.T=null;const d=decidi(st);d.id=Math.random();this.rec.push({st,t:this.tl,b:bb(st.flat()),id:d.id});if(this.rec.length>4)this.rec.shift();return[d]};
Racc.prototype.tratto=function(s,t){const A=[...this.scadi(t)],f=info(s),b=f.b;this.tl=t;
 const m=(x,y)=>Math.max(.9,.45*Math.max(x.w,x.h,y.w,y.h));
 if(!this.pend.length){// ripensa le ultime decisioni vicine: il simbolo forse non era finito
  this.rec=this.rec.filter(r=>t-r.t<RIPENSA);const pres=[];let zona=b,cambio=true;while(cambio){cambio=false;for(const r of this.rec)if(!pres.includes(r)&&vicinoB(zona,r.b,m(zona,r.b))){const z=bb([...pres.flatMap(q=>q.st).flat(),...r.st.flat(),...s]);if(Math.max(z.w,z.h)>9)continue;pres.push(r);zona=z;cambio=true}}
  const lungo=(f.M&&f.L>=4.5)||f.diag>9;
  if(pres.length&&!(lungo&&pres.every(r=>r.st.every(q=>info(q).M&&info(q).L>=4.5)))){for(const r of pres)A.push({annulla:r.id});this.rec=this.rec.filter(r=>!pres.includes(r));this.pend=pres.sort((a,b)=>a.t-b.t).flatMap(r=>r.st)}}
 else{const p=bb(this.pend.flat());if(!vicinoB(b,p,2.5)){this.T=0;A.push(...this.scadi(t))}}
 if(!this.pend.length&&((f.M&&f.L>=4.5)||(f.diag>9&&!f.chiuso)||f.diag>12)){const id=Math.random();A.push({fili:[s],comp:null,id});this.rec.push({st:[s],t,b,id});if(this.rec.length>4)this.rec.shift();return A}
 this.pend.push(s);this.T=t+(this.pend.length>=10?0:ATTESA);if(this.pend.length>=10)A.push(...this.scadi(t));return A};

if(typeof module!='undefined')module.exports={mio,set SOGLIA(v){},impara,caricaMiei,get MIEI(){return MIEI},nube,decidi,Racc,info,riconosci,frecce,barraDiodo,riconosciP,transistor,porta,cerchioL,spigolo,dentroCerchio,sembraFilo,TPL,INT,rdp,bb,arco,len};
