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
 and:[[andB]],or:[[orD,orL]],not:[[[[-1.5,-1.3],[1.2,0],[-1.5,1.3],[-1.5,-1.3]]]],xor:[[orD,orL,[[-2.3,-1.5],[-1.7,-.8],[-1.5,0],[-1.7,.8],[-2.3,1.5]]]],
};
const POLAR={pila:1,dio:1,led:1,npn:1,and:1,or:1,not:1,xor:1,gnd:1};
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
function riconosci(st){const all=bb(st.flat());const c=st.map(cerchio);
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
 if(o[0].k=='dio'||o[0].k=='led'){const pref=st.length<=2?'dio':(st.slice(2).some(s=>{const q=bb(s),cor=bb(st[0]);return Math.min(Math.abs(q.cy-cor.cy)/(cor.h||1),Math.abs(q.cx-cor.cx)/(cor.w||1))>.32})?'led':'dio');o.sort((a,b)=>(b.k==pref)-(a.k==pref))}
 // ricciolo o zig-zag: l'induttore resta da un solo lato della corda
 if(st.length==1&&(o[0].k=='res'||o[0].k=='ind')&&o.slice(0,3).some(x=>x.k=='ind')){const s=st[0],a=s[0],b=s[s.length-1],L=Math.hypot(b[0]-a[0],b[1]-a[1])||1;let mn=0,mx=0;for(const p of s){const d=((b[0]-a[0])*(a[1]-p[1])-(a[0]-p[0])*(b[1]-a[1]))/L;mn=Math.min(mn,d);mx=Math.max(mx,d)}const pref=Math.min(-mn,mx)<.28*Math.max(-mn,mx)?'ind':'res';o.sort((x,y)=>(y.k==pref)-(x.k==pref))}
 return o}
/* stile del tratto */
function rdp(p,e){if(p.length<3)return p;const a=p[0],b=p[p.length-1],L=Math.hypot(b[0]-a[0],b[1]-a[1])||1e-6;let m=0,ix=0;for(let i=1;i<p.length-1;i++){const d=Math.abs((b[0]-a[0])*(a[1]-p[i][1])-(a[0]-p[i][0])*(b[1]-a[1]))/L;if(d>m){m=d;ix=i}}if(m<e){return[a,b]}const l=rdp(p.slice(0,ix+1),e),r=rdp(p.slice(ix),e);return l.slice(0,-1).concat(r)}
function sembraFilo(s){const L=len(s),b=bb(s),e=Math.hypot(s[0][0]-s[s.length-1][0],s[0][1]-s[s.length-1][1]);const pt=rdp(s,.45);const ang=Math.atan2(b.h,b.w)*180/Math.PI,dritto=e/L>.92;
 return{L,chiuso:e<.18*L&&L>3,angoli:pt.length-2,dritto,obliquo:dritto&&ang>14&&ang<72,diag:Math.hypot(b.w,b.h)}}
if(typeof module!='undefined')module.exports={riconosci,sembraFilo,TPL,INT,rdp,bb,arco,len};
