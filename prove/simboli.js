const G=require('./disegni-a-mano.js'),VECCHIO=process.env.VECCHIO,M=require(VECCHIO?'./vecchio-ric.js':'../ric.js');

// vecchia logica del gioco (tratto + fineGruppo), riprodotta per confronto
function Vecchio(){this.pend=[];this.T=null}
Vecchio.prototype.scadi=function(t){if(!this.pend.length||t<this.T)return[];const st=this.pend;this.pend=[];const s=M.sembraFilo(st[0]),b=M.bb(st.flat());const fili=st.map(M.sembraFilo),tutti=fili.every(f=>!f.chiuso&&f.angoli<=4&&!f.obliquo);const id=Math.random();
 if(st.length==1){if(s.obliquo&&s.L<7)return[{fili:[],comp:{alt:[{k:'sw',r:0},{k:'btn'}]},id}];if(!s.chiuso&&s.angoli<=3&&(s.L>=2.5||s.L<1.8))return[{fili:st,comp:null,id}]}
 if(tutti&&Math.max(b.w,b.h)>7.5)return[{fili:st,comp:null,id}];return[{fili:[],comp:{alt:M.riconosci(st)},id}]};
Vecchio.prototype.tratto=function(s,t){const A=[...this.scadi(t)];const f=M.sembraFilo(s),b=M.bb(s);
 if(this.pend.length){const p=M.bb(this.pend.flat());if(b.x0>p.x1+3||b.x1<p.x0-3||b.y0>p.y1+3||b.y1<p.y0-3){this.T=0;A.push(...this.scadi(t))}}
 if(f.diag>8&&f.angoli<=7){this.T=0;A.push(...this.scadi(t));return A.concat([{fili:[s],comp:null,id:Math.random()}])}
 if(f.L>=6.5&&!f.chiuso&&f.angoli<=4&&!this.pend.length)return A.concat([{fili:[s],comp:null,id:Math.random()}]);
 this.pend.push(s);this.T=t+750;return A};

const POL={pila:1,dio:1,led:1,npn:1,pnp:1,and:1,or:1,not:1,xor:1,nand:1,nor:1,gnd:1,sw:0,btn:1};
const NOROT={lamp:1,mot:1,volt:1,amp:1,gen:1};
const N=+process.argv[2]||40,solo=process.argv[3];
function prova(k,r,seed){G.seed(seed);const st=G.deforma(G.D[k](),r,k);const R=VECCHIO?new Vecchio():new M.Racc();let t=0,comps=[],fili=0;const ids={};
 for(const s of st){t+=G.U(120,1500)+s.length*8;for(const a of R.tratto(s,t))ap(a)}
 for(const a of R.scadi(t+5000))ap(a);
 function ap(a){if(a.annulla){const x=ids[a.annulla];if(x){comps=comps.filter(c=>c!=x.c);fili-=x.f}return}const c=a.comp?{k:a.comp.alt[0].k,r:a.comp.alt[0].r,alt:a.comp.alt.slice(0,4).map(q=>q.k)}:null;if(c)comps.push(c);fili+=a.fili.length;ids[a.id]={c,f:a.fili.length}}
 return{comps,fili,st}}
const tot={},per={};let ok=0,okr=0,n=0,t3=0;
for(const k of G.KINDS2){if(solo&&k!=solo)continue;const e={};let a=0,ar=0,c3=0,m=0;
 for(let i=(+process.env.DA||0);i<N;i++){const r=i%4;const p=prova(k,r,1000+i*7919+k.length*31);m++;
  const c=p.comps;let res=c.length==1?c[0].k:c.length==0?'(filo)':'('+c.length+':'+c.map(x=>x.k).join('+')+')';
  if(res==k){a++;const want=NOROT[k]?null:POL[k]?r:r%2;const got=POL[k]?c[0].r:c[0].r%2;if(want==null||got==want)ar++;else e['rot']=(e['rot']||0)+1}else e[res]=(e[res]||0)+1;
  if(c.length==1&&c[0].alt.includes(k))c3++}
 n+=m;ok+=a;okr+=ar;t3+=c3;console.log(k.padEnd(5),String(a).padStart(3)+'/'+m,'giro ok',String(ar).padStart(3),'tra le prime',String(c3).padStart(3),JSON.stringify(e))}
console.log('TOTALE tipo',(ok/n*100).toFixed(1)+'%','tipo+verso',(okr/n*100).toFixed(1)+'%','tra le scelte',(t3/n*100).toFixed(1)+'%');
