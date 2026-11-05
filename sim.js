/* Schema a mano: componenti e simulatore (analisi nodale con Newton e passi nel tempo). */
const GATE3=[[-3,-1],[-3,1],[3,0]];
const KINDS={
 pila:{n:'Pila',pins:[[2,0],[-2,0]],v:{V:9},pol:1},res:{n:'Resistenza',pins:[[-2,0],[2,0]],v:{R:1000}},
 led:{n:'LED',pins:[[-2,0],[2,0]],v:{c:'rosso'},pol:1},dio:{n:'Diodo',pins:[[-2,0],[2,0]],v:{},pol:1},
 lamp:{n:'Lampadina',pins:[[-2,0],[2,0]],v:{Vn:9}},mot:{n:'Motore',pins:[[-2,0],[2,0]],v:{Vn:9}},
 sw:{n:'Interruttore',pins:[[-2,0],[2,0]],v:{on:0}},btn:{n:'Pulsante',pins:[[-2,0],[2,0]],v:{on:0}},
 cap:{n:'Condensatore',pins:[[-2,0],[2,0]],v:{C:100e-6}},ind:{n:'Induttore',pins:[[-2,0],[2,0]],v:{L:.1}},
 rel:{n:'Relè',pins:[[-2,-2],[-2,2],[2,-2],[2,2]],v:{}},
 npn:{n:'Transistor NPN',pins:[[-2,0],[1,-2],[1,2]],v:{},pol:1},pnp:{n:'Transistor PNP',pins:[[-2,0],[1,2],[1,-2]],v:{},pol:1},
 and:{n:'Porta AND',pins:GATE3,gate:1,v:{},pol:1},or:{n:'Porta OR',pins:GATE3,gate:1,v:{},pol:1},nand:{n:'Porta NAND',pins:GATE3,gate:1,v:{},pol:1},nor:{n:'Porta NOR',pins:GATE3,gate:1,v:{},pol:1},xor:{n:'Porta XOR',pins:GATE3,gate:1,v:{},pol:1},
 not:{n:'Porta NOT',pins:[[-3,0],[3,0]],gate:1,v:{},pol:1},
 gnd:{n:'Massa',pins:[[0,-1]],v:{}},volt:{n:'Voltmetro',pins:[[-2,0],[2,0]],v:{},pol:1},amp:{n:'Amperometro',pins:[[-2,0],[2,0]],v:{},pol:1},
 gen:{n:'Generatore',pins:[[2,0],[-2,0]],v:{Vp:5,f:50,w:'sin'}},
};
const LEDC={rosso:{Vf:1.9,col:'#e8362c'},verde:{Vf:2.2,col:'#27b34a'},giallo:{Vf:2.1,col:'#f2b90f'},blu:{Vf:3.1,col:'#2c6be8'}};
const rot=(p,r)=>{let[x,y]=p;for(let i=0;i<r;i++)[x,y]=[-y,x];return[x,y]};
const pinsOf=c=>KINDS[c.k].pins.map(p=>{const q=rot(c.flip?[p[0],-p[1]]:p,c.r||0);return[c.x+q[0],c.y+q[1]]});
const key=(x,y)=>x+','+y;
function nodi(ci){ // punti -> nodi, unendo fili e piedini
 const P=new Map(),par=[];const id=(x,y)=>{const k=key(x,y);if(!P.has(k)){P.set(k,par.length);par.push(par.length)}return P.get(k)};
 const fi=a=>{while(par[a]!=a)a=par[a]=par[par[a]];return a},un=(a,b)=>{par[fi(a)]=fi(b)};
 const pts=[];for(const c of ci.comps)for(const p of pinsOf(c))pts.push(p);for(const w of ci.wires){pts.push(w.a,w.b)}
 pts.forEach(p=>id(p[0],p[1]));
 for(const w of ci.wires){const A=id(...w.a);un(A,id(...w.b));
  const x0=Math.min(w.a[0],w.b[0]),x1=Math.max(w.a[0],w.b[0]),y0=Math.min(w.a[1],w.b[1]),y1=Math.max(w.a[1],w.b[1]);
  for(const p of pts)if(p[0]>=x0&&p[0]<=x1&&p[1]>=y0&&p[1]<=y1)un(A,id(p[0],p[1]));}
 const roots=new Map();const nodeOf=(x,y)=>{const r=fi(id(x,y));if(!roots.has(r))roots.set(r,roots.size);return roots.get(r)};
 pts.forEach(p=>nodeOf(p[0],p[1]));
 return{nodeOf,n:roots.size};
}
function compila(ci){const{nodeOf,n}=nodi(ci);const E=[];let gnd=-1;
 for(const c of ci.comps){const pn=pinsOf(c).map(p=>nodeOf(p[0],p[1]));if(c.k=='gnd'&&gnd<0)gnd=pn[0];E.push({c,pn,k:c.k,s:c.s||(c.s={}),i:[]})}
 if(gnd<0){const b=E.find(e=>e.k=='pila'||e.k=='gen');gnd=b?b.pn[1]:0}
 const map=[];let m=0;for(let i=0;i<n;i++)map[i]=i==gnd?-1:m++;
 for(const e of E)e.u=e.pn.map(p=>map[p]);
 return{E,N:m,gnd,map,nodeOf,V:new Float64Array(m),t:0,rr:0,ci};}
const VT=.02585;
function pnj(v,Is,nVt){const vm=nVt*38;if(v>vm){const e=Math.exp(38);return[Is*e+Is*e/nVt*(v-vm),Is*e/nVt]}const e=Math.exp(v/nVt);return[Is*(e-1)+1e-12*v,Is/nVt*e+1e-12]}
function ledIs(Vf,n){return .01/Math.exp(Vf/(n*VT))}
function passoSim(S,dt){const{E,N}=S;const A=[];const V=S.V;
 const volt=u=>u<0?0:V[u];S.t+=dt;
 // porte: una per passo, in giro, per evitare corse
 const gs=E.filter(e=>KINDS[e.k].gate);if(gs.length){const g=gs[S.rr++%gs.length];aggiornaPorta(g,volt)}
 let conv=false;const old=new Float64Array(N);
 for(let it=0;it<40&&!conv;it++){old.set(V);
  for(let i=0;i<N;i++){A[i]=A[i]||new Float64Array(N+1);A[i].fill(0);A[i][i]=1e-9}
  const G=(a,b,g)=>{if(a>=0)A[a][a]+=g;if(b>=0)A[b][b]+=g;if(a>=0&&b>=0){A[a][b]-=g;A[b][a]-=g}};
  const I=(a,x)=>{if(a>=0)A[a][N]+=x};
  const NR=(u,cur,J)=>{ // correnti che ENTRANO nel componente dai terminali
   const n=u.length;for(let i=0;i<n;i++){if(u[i]<0)continue;let s=cur[i];for(let j=0;j<n;j++){if(u[j]>=0){A[u[i]][u[j]]+=J[i][j]}s-=J[i][j]*volt(u[j])}A[u[i]][N]-=s}};
  for(const e of E){const c=e.c,u=e.u,s=e.s;const[a,b]=u;switch(e.k){
   case'pila':{const g=2;G(a,b,g);I(a,c.v.V*g);I(b,-c.v.V*g);break}
   case'gen':{const t=S.t,w=2*Math.PI*c.v.f*t,x=c.v.w=='qua'?(Math.sin(w)>=0?1:-1):c.v.w=='qua0'?(Math.sin(w)>=0?1:0):Math.sin(w);const g=20,val=x*c.v.Vp;s.val=val;G(a,b,g);I(a,val*g);I(b,-val*g);break}
   case'res':G(a,b,1/c.v.R);break;
   case'lamp':{const R=s.rot?1e9:c.v.Vn*c.v.Vn/3;G(a,b,1/R);break}
   case'mot':{const g=1/8;const emf=(s.w||0)*(c.v.Vn/100);G(a,b,g);I(a,emf*g);I(b,-emf*g);break}
   case'sw':case'btn':G(a,b,c.v.on?100:1e-9);break;
   case'volt':G(a,b,1e-7);break;case'amp':G(a,b,100);break;
   case'cap':{const g=c.v.C/dt,v0=s.v||0;G(a,b,g);I(a,g*v0);I(b,-g*v0);break}
   case'ind':{const g=dt/c.v.L,i0=s.i||0;G(a,b,g);I(a,-i0);I(b,i0);break}
   case'rel':{const L=.08,R=200,g=1/(R+L/dt),i0=s.i||0;const e0=i0*L/dt;G(u[0],u[1],g);I(u[0],-e0*g);I(u[1],e0*g);G(u[2],u[3],s.on?100:1e-9);break}
   case'led':case'dio':{if(s.rot){G(a,b,1e-9);break}const n=e.k=='led'?1.9:1.6,Vf=e.k=='led'?LEDC[c.v.c].Vf:.7,Is=ledIs(Vf,n),nVt=n*VT;let vd=volt(a)-volt(b);const pv=Math.max(s.vd==null?0:s.vd,Vf*.75);if(vd>pv+.25)vd=pv+.25;s.vd=vd;const[id,gd]=pnj(vd,Is,nVt);const r=id-gd*vd;G(a,b,gd);I(a,-r);I(b,r);break}
   case'npn':case'pnp':{const sg=e.k=='npn'?1:-1,Is=1e-14,bf=120,br=2,[ub,uc,ue]=u;let vbe=sg*(volt(ub)-volt(ue)),vbc=sg*(volt(ub)-volt(uc));const p1=Math.max(s.vbe==null?0:s.vbe,.5),p2=Math.max(s.vbc==null?0:s.vbc,.5);if(vbe>p1+.2)vbe=p1+.2;if(vbc>p2+.2)vbc=p2+.2;s.vbe=vbe;s.vbc=vbc;
    const[ie,ge]=pnj(vbe,Is,VT),[ic,gc]=pnj(vbc,Is,VT);const Ib=ie/bf+ic/br,Ic=ie-ic-ic/br;
    const gbe=ge/bf,gbc=gc/br;const dIc_be=ge,dIc_bc=-gc-gbc;
    // correnti entranti da b,c,e; J rispetto a vb,vc,ve
    const Jb=[gbe+gbc,-gbc,-gbe],Jc=[dIc_be+dIc_bc,-dIc_bc,-dIc_be],Je=[-(Jb[0]+Jc[0]),-(Jb[1]+Jc[1]),-(Jb[2]+Jc[2])];
    const curB=sg*Ib,curC=sg*Ic,curE=-(curB+curC);
    NR([ub,uc,ue],[curB,curC,curE],[Jb,Jc,Je]);break}
   default:if(KINDS[e.k].gate){const out=u[u.length-1],g=1/60;G(out,-1,g);I(out,(s.o?5:0)*g);for(let i=0;i<u.length-1;i++)G(u[i],-1,1e-6)}
  }}
  // Gauss con pivot
  for(let i=0;i<N;i++){let p=i;for(let r=i+1;r<N;r++)if(Math.abs(A[r][i])>Math.abs(A[p][i]))p=r;if(p!=i){const t=A[i];A[i]=A[p];A[p]=t}
   const d=A[i][i]||1e-30;for(let r=i+1;r<N;r++){const f=A[r][i]/d;if(f){for(let c=i;c<=N;c++)A[r][c]-=f*A[i][c]}}}
  for(let i=N-1;i>=0;i--){let s=A[i][N];for(let c=i+1;c<N;c++)s-=A[i][c]*V[c];V[i]=s/(A[i][i]||1e-30)}
  conv=true;for(let i=0;i<N;i++)if(!isFinite(V[i])){V[i]=0}else if(Math.abs(V[i]-old[i])>1e-4)conv=false;
 }
 // aggiorna stati e correnti
 S.corto=false;S.avvisi=S.avvisi||{};
 for(const e of E){const c=e.c,u=e.u,s=e.s;const a=u[0],b=u[1],va=volt(a),vb=b===undefined?0:volt(b),vd=va-vb;let I=0;switch(e.k){
  case'pila':I=(c.v.V-vd)*2;if(I>c.v.V*1.5)S.corto=true;break;
  case'gen':{I=(s.val-vd)*20;break}
  case'res':I=vd/c.v.R;s.p=vd*I;break;
  case'lamp':{I=s.rot?0:vd/(c.v.Vn*c.v.Vn/3);s.lum=Math.min(1.3,Math.abs(vd)/c.v.Vn);if(Math.abs(vd)>c.v.Vn*1.6){s.heat=(s.heat||0)+dt;if(s.heat>.2)s.rot=1}break}
  case'mot':{const em=(s.w||0)*(c.v.Vn/100);I=(vd-em)/8;s.w=(s.w||0)+(I*8/(c.v.Vn/100)-(s.w||0))*Math.min(1,dt/.4);s.ang=(s.ang||0)+(s.w||0)*dt*.25;s.lum=Math.abs(s.w||0)/100;break}
  case'sw':case'btn':I=vd*(c.v.on?100:1e-9);break;
  case'volt':s.m=vd;break;case'amp':I=vd*100;s.m=I;break;
  case'cap':I=c.v.C/dt*(vd-(s.v||0));s.v=vd;break;
  case'ind':I=(s.i||0)+dt/c.v.L*vd;s.i=I;break;
  case'rel':{const L=.08,R=200;const i0=s.i||0;I=(vd+i0*L/dt)/(R+L/dt);s.i=I;const q=Math.abs(I)*1000;if(!s.on&&q>25){s.dly=(s.dly||0)+dt;if(s.dly>.012){s.on=1;s.dly=0;S.clic=1}}else if(s.on&&q<10){s.dly=(s.dly||0)+dt;if(s.dly>.012){s.on=0;s.dly=0;S.clic=1}}else s.dly=0;break}
  case'led':case'dio':{if(s.rot){I=0;s.lum=0;break}const n=e.k=='led'?1.9:1.6,Vf=e.k=='led'?LEDC[c.v.c].Vf:.7;I=pnj(vd,ledIs(Vf,n),n*VT)[0];if(e.k=='led'){s.lum=Math.min(1,I/.02);if(I>.05){s.heat=(s.heat||0)+dt;if(s.heat>.12){s.rot=1;S.brucia=c}}}break}
  case'npn':case'pnp':{const sg=e.k=='npn'?1:-1,vbe=sg*(volt(u[0])-volt(u[2])),vbc=sg*(volt(u[0])-volt(u[1]));const Is=1e-14,ie=pnj(Math.min(vbe,1),Is,VT)[0],ic=pnj(Math.min(vbc,1),Is,VT)[0];I=ie-ic;s.ib=ie/120+ic/2;break}
  default:if(KINDS[e.k].gate){const ou=u[u.length-1],v=volt(ou);I=((s.o?5:0)-v)/60;s.lum=s.o?1:0}
 }e.I=I;
  const q=KINDS[e.k].pins.length;if(e.k=='pila'||e.k=='gen')e.pI=[I,-I];else if(e.k=='npn'||e.k=='pnp'){const sg=e.k=='npn'?1:-1,ib=sg*(s.ib||0),ic=sg*I;e.pI=[-ib,-ic,ib+ic]}else if(e.k=='rel'){const ik=(s.on?100:1e-9)*(volt(u[2])-volt(u[3]));e.pI=[-I,I,-ik,ik]}else if(KINDS[e.k].gate){e.pI=new Array(q).fill(0);e.pI[q-1]=I}else if(q==2)e.pI=[-I,I];else e.pI=[0];}
}
function aggiornaPorta(g,volt){const u=g.u,hi=i=>u[i]>=0?volt(u[i])>2.5:false,a=hi(0),b=u.length>2?hi(1):false;let o;switch(g.k){case'and':o=a&&b;break;case'or':o=a||b;break;case'nand':o=!(a&&b);break;case'nor':o=!(a||b);break;case'xor':o=a!=b;break;default:o=!a}g.s.o=o?1:0}
function azzera(ci){for(const c of ci.comps)delete c.s}
/* prova a regime: imposta interruttori, lascia assestare e legge */
function regime(S,t=.6,dt=.002){const n=Math.ceil(t/dt);for(let i=0;i<n;i++)passoSim(S,dt)}
if(typeof module!='undefined')module.exports={KINDS,LEDC,compila,passoSim,regime,azzera,pinsOf,nodi,key,rot};
