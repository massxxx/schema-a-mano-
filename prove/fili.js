const G=require('./disegni-a-mano.js'),VECCHIO=process.env.VECCHIO,M=require(VECCHIO?'./vecchio-ric.js':'../ric.js');
// un filo a mano: dritto o a L, con tremolio
function filo(x,y,dx,dy,L){const p=[[x,y]];if(L)p.push([x+dx,y]);p.push([x+dx,y+(L?dy:dy)]);if(!L){p[1]=[x+dx,y+dy]}const o=[];for(let i=1;i<p.length;i++){const a=p[i-1],b=p[i],n=Math.max(2,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.12));for(let k=0;k<n;k++)o.push([a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n])}o.push(p[p.length-1]);const tr=G.U(.02,.1),ph=G.U(0,6),fr=G.U(.1,.3),tilt=G.U(-.06,.06);return o.map(([X,Y],i)=>[X+Math.sin(i*fr+ph)*tr+(Y-y)*tilt,Y+Math.sin(i*fr*1.4+ph)*tr+(X-x)*tilt])}
let tot=0,okS=0,compErr=0;const tipi={};
for(let c=0;c<300;c++){G.seed(5000+c*131);let x=10,y=10,t=0;const st=[];const n=3+Math.floor(G.U(0,6));
 for(let i=0;i<n;i++){const L=G.pr(.35),len=()=>G.U(1.5,8)*(G.pr(.5)?1:-1);let dx,dy;if(L){dx=len();dy=len()}else if(G.pr(.5)){dx=len();dy=0}else{dx=0;dy=len()}
  // a volte si parte da un punto vicino (rami paralleli)
  if(G.pr(.25)){x+=G.pr(.5)?G.U(1,2):0;y+=G.pr(.5)?0:G.U(1,2)}
  st.push(filo(x,y,dx,dy,L));x+=dx;y+=dy}
 const R=VECCHIO?null:new M.Racc();let comps=[],fili=0;const ids={};
 const ap=a=>{if(a.annulla){const z=ids[a.annulla];if(z){comps=comps.filter(q=>q!=z.c);fili-=z.f}return}const q=a.comp?a.comp.alt[0].k:null;if(q)comps.push(q);fili+=a.fili.length;ids[a.id]={c:q,f:a.fili.length}};
 for(const s of st){t+=G.U(150,900)+s.length*6;for(const a of R.tratto(s,t))ap(a)}for(const a of R.scadi(t+9000))ap(a);
 tot++;if(!comps.length)okS++;else comps.forEach(q=>tipi[q]=(tipi[q]||0)+1)}
console.log('sequenze di fili senza simboli inventati',okS+'/'+tot,'simboli inventati',JSON.stringify(tipi));
