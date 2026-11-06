/* Generatore di disegni "a mano" indipendente dai modelli del riconoscitore.
   Coordinate in quadretti, forma canonica come KINDS (piedini a ±2 sull'asse x), poi ruotata di r quarti. */
let sd=1;const R=()=>{sd=(sd*16807)%2147483647;return sd/2147483647};const seed=s=>{sd=s};
const U=(a,b)=>a+(b-a)*R(),ch=a=>a[Math.floor(R()*a.length)],pr=p=>R()<p;
const arc=(cx,cy,rx,ry,a0,a1,n=18)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return[cx+Math.cos(a)*rx,cy+Math.sin(a)*ry]});
const rev=s=>s.slice().reverse(),L=(...p)=>p;
function poly(pts,closed){const s=pts.slice();if(closed)s.push(pts[0]);return s}
function rotStart(pts){const k=Math.floor(R()*pts.length);return pts.slice(k).concat(pts.slice(0,k))}
function chiuso(pts){const p=rotStart(pts);const s=poly(p,true);const g=U(-.12,.15);const a=s[s.length-2],b=s[s.length-1];s[s.length-1]=[b[0]+(b[0]-a[0])*g,b[1]+(b[1]-a[1])*g];return pr(.5)?rev(s):s}
function cerchio(cx,cy,r,ry){const a0=U(0,6.28),dir=pr(.5)?1:-1,ext=U(-.25,.5);return arc(cx,cy,r,ry||r*U(.85,1.15),a0,a0+dir*(6.28+ext),26)}
const leads=(k,l=2)=>pr(.5)?[]:pr(.7)?[[[-l,0],[k?-k:-1,0]].map(p=>p.slice()),[[k||1,0],[l,0]]]:[];
function lead2(a,b){return pr(.5)?[]:[[[-2,0],[-a,0]],[[b,0],[2,0]]]}
const D={
 res(){const st=[];if(pr(.55)){const w=U(1.1,1.6),h=U(.4,.65);const box=[[-w,-h],[w,-h],[w,h],[-w,h]];if(pr(.75))st.push(chiuso(box));else{st.push([[-w,h],[-w,-h],[w,-h],[w,h]].map(p=>p.slice()));st.push([[w,h],[-w,h]])}st.push(...lead2(w,w))}
  else{const n=ch([3,4,5,6]),w=U(1.2,1.7),h=U(.45,.75),z=[];for(let i=0;i<=n*2;i++)z.push([-w+2*w*i/(n*2),i==0||i==n*2?0:(i%2?-h:h)]);if(pr(.4))st.push([[-2,0],...z,[2,0]]);else{st.push(z);st.push(...lead2(w,w))}}return st},
 pila(){const g=U(.18,.35),lo=U(1,1.6),co=lo*U(.35,.6),st=[[[g,-lo],[g,lo]],[[-g,-co],[-g,co]]];if(pr(.3))st.push([[g+2*g+.1,-lo],[g+2*g+.1,lo]],[[-3*g-.1,-co],[-3*g-.1,co]]);if(pr(.4))st.push([[-2,0],[-g,0]],[[g,0],[2,0]]);return pr(.5)?st:st.reverse()},
 cap(){const g=U(.18,.35),l=U(.9,1.5),st=[[[-g,-l],[-g,l*U(.92,1.08)]],[[g,-l],[g,l]]];if(pr(.5))st.push([[-2,0],[-g,0]],[[g,0],[2,0]]);return st.map(s=>pr(.5)?rev(s):s)},
 dio(){return diodo(false)},led(){return diodo(true)},
 lamp(){const r=U(.9,1.4),q=r*.7,st=[cerchio(0,0,r),[[-q,-q],[q,q]],[[q,-q],[-q,q]]];if(pr(.4))st.push([[-2,0],[-r,0]],[[r,0],[2,0]]);return st},
 mot(){const r=U(.9,1.4),q=r*.55;return[cerchio(0,0,r),[[-q,q],[-q*.8,-q],[0,q*.3],[q*.8,-q],[q,q]],...(pr(.4)?[[[-2,0],[-r,0]],[[r,0],[2,0]]]:[])]},
 volt(){const r=U(.9,1.4),q=r*.5;return[cerchio(0,0,r),[[-q,-q],[0,q],[q,-q]]]},
 amp(){const r=U(.9,1.4),q=r*.5;return[cerchio(0,0,r),pr(.5)?[[-q,q],[0,-q],[q,q]]:[[-q,q],[0,-q],[q,q]],[[-q*.5,q*.15],[q*.5,q*.15]]]},
 gen(){const r=U(.9,1.4),q=r*.6;return[cerchio(0,0,r),Array.from({length:15},(_,i)=>[-q+2*q*i/14,-Math.sin(i/14*6.28)*q*.6])]},
 sw(){const a=U(.8,1.1),ang=U(25,45)*Math.PI/180,l=2*a;const st=[[[-a,0],[-a+l*Math.cos(ang),-l*Math.sin(ang)]]];if(pr(.55))st.push([[-2,0],[-a,0]],[[a,0],[2,0]]);return pr(.5)?st:st.reverse()},
 btn(){const w=U(1,1.5),h=U(.9,1.4),st=[[[-w,0],[w,0]],[[0,0],[0,-h]]];if(pr(.6))st.push([[-w*.5,-h],[w*.5,-h]]);if(pr(.3))st.push([[-2,.5],[-w,.5]],[[w,.5],[2,.5]]);return st},
 ind(){const n=ch([3,4]),w=U(1.4,1.8),h=U(.5,.8),s=[];for(let i=0;i<n;i++){const c=-w+w/n+2*w/n*i;s.push(...arc(c,0,w/n,h,Math.PI,2*Math.PI,10).slice(i?1:0))}const st=[s];if(pr(.4))st[0]=[[-2,0],...s,[2,0]];return st},
 rel(){const w=U(1.1,1.6),h=U(.7,1.1),st=[chiuso([[-w,-h],[w,-h],[w,h],[-w,h]]),[[-w*1.1,h*1.1],[w*1.1,-h*1.1]]];return st},
 npn(){return trans(true)},pnp(){return trans(false)},
 and(){const h=U(1.2,1.6),x0=-1.6,x1=U(-.3,.1);const D1=[[x0,-h],[x1,-h],...arc(x1,0,h*U(.85,1.05),h,-Math.PI/2,Math.PI/2,14).slice(1),[x0,h]];const st=pr(.6)?[chiuso(D1)]:[D1,[[x0,h],[x0,-h]]];return st.concat(ingressi(x0,h,2.2))},
 or(){return orx(false,false)},nor(){return orx(true,false)},xor(){return orx(false,true)},
 nand(){const st=D.and();const h=st[0].reduce((m,p)=>Math.max(m,p[1]),0);const mx=st[0].reduce((m,p)=>Math.max(m,p[0]),-9);st.push(cerchio(mx+.3,0,.3));return st},
 not(){const h=U(1,1.4);const st=[chiuso([[-1.5,-h],[1,0],[-1.5,h]])];if(pr(.6))st.push(cerchio(1.32,0,.3));if(pr(.4))st.push([[-3,0],[-1.5,0]],[[1.6,0],[3,0]]);return st},
 gnd(){const w=U(.9,1.3),g=U(.3,.5),st=[[[-w,0],[w,0]],[[-w*.6,g],[w*.6,g]],[[-w*.2,2*g],[w*.2,2*g]]];if(pr(.5))st.unshift([[0,-1.2],[0,0]]);return st},
};
function diodo(led){const w=U(.7,1),h=U(.8,1.1);const st=[];const T=[[-w,-h],[w,0],[-w,h]];const m=R();if(m<.6)st.push(chiuso(T));else if(m<.85){st.push([[-w,-h],[w,0],[-w,h]]);st.push([[-w,h],[-w,-h]])}else{st.push([[-w,-h],[w,0]],[[w,0],[-w,h]],[[-w,h],[-w,-h]])}
 st.push([[w,-h],[w,h]]);if(pr(.4))st.push([[-2,0],[-w,0]],[[w,0],[2,0]]);
 if(led){const a=U(.5,.8);for(const ox of[-.1,.6]){const s=[[ox,-h*1.05],[ox+a,-h*1.05-a]];if(pr(.6))st.push(s);else if(pr(.5))st.push(s,[[ox+a-.3,-h*1.05-a],[ox+a,-h*1.05-a],[ox+a,-h*1.05-a+.3]]);else st.push([...s,[ox+a-.3,-h*1.05-a]])}}return st}
function trans(n){const st=[[[-.5,-1.1],[-.5,1.1]],[[-.5,-.4],[1,-1.4]],[[-.5,.4],[1,1.4]]];if(pr(.6))st.push([[-2,0],[-.5,0]]);if(!n||pr(.5)){if(n)st.push([[.5,.9],[1,1.4],[.4,1.25]]);else st.push([[-.1,-.95],[-.5,-.4],[.1,-.55]])}if(pr(.5))st.push(cerchio(.2,0,1.5));if(pr(.3))st.push([[1,-1.4],[1,-2]],[[1,1.4],[1,2]]);return st}
function orx(neg,x){const h=U(1.2,1.6);const tip=1.4;const top=arc(-1.8+0,0,0,0,0,0,0);const up=[];for(let i=0;i<=10;i++){const t=i/10;up.push([-1.8+(tip+1.8)*t,-h*(1-t*t)])}const lo=up.map(([a,b])=>[a,-b]).reverse();const back=Array.from({length:9},(_,i)=>{const t=i/8;return[-1.8+Math.sin(t*Math.PI)*.6,h-2*h*t]});
 const st=[];if(pr(.6))st.push([...up,...lo.slice(1),...back.slice(1)]);else if(pr(.5))st.push([...up,...lo.slice(1)],back);else st.push(up,lo.reverse(),back);if(x)st.push(back.map(([a,b])=>[a-.55,b]));if(neg)st.push(cerchio(tip+.3,0,.3));return st.concat(ingressi(-1.4,h,2.2))}
function ingressi(x0,h,x){return pr(.4)?[[[-x-.6,-.9],[x0+.2,-.9]],[[-x-.6,.9],[x0+.2,.9]],[[1.6,0],[3,0]]]:[]}
/* deformazioni */
const NOR={lamp:1,mot:1,volt:1,amp:1,gen:1};
function deforma(st,r,k){if(NOR[k])r=0;const sc=U(.75,1.55),asp=U(.85,1.18),tilt=U(-.2,.2),ca=Math.cos(tilt),sa=Math.sin(tilt),tr=U(.02,.09);
 let o=st.map(s=>{if(s.length==2){const n=Math.max(2,Math.ceil(Math.hypot(s[1][0]-s[0][0],s[1][1]-s[0][1])/.2));s=Array.from({length:n+1},(_,i)=>[s[0][0]+(s[1][0]-s[0][0])*i/n,s[0][1]+(s[1][1]-s[0][1])*i/n])}
  const f=[];for(let i=1;i<s.length;i++){const a=s[i-1],b=s[i],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.12));for(let k=0;k<n;k++)f.push([a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n])}f.push(s[s.length-1]);
  const p1=U(0,6),p2=U(0,6),fr=U(.15,.4);return(pr(.5)&&s.length<5?f.reverse():f).map(([x,y],i)=>{x=x*sc*asp;y=y*sc;let X=x*ca-y*sa,Y=x*sa+y*ca;X+=Math.sin(i*fr+p1)*tr*sc+U(-.02,.02);Y+=Math.sin(i*fr*1.3+p2)*tr*sc+U(-.02,.02);for(let q=0;q<r;q++)[X,Y]=[-Y,X];return[X+30,Y+30]})});
 // ordine dei tratti un po' mescolato
 if(pr(.35)&&o.length>2){const i=1+Math.floor(R()*(o.length-1));const t=o[i];o.splice(i,1);o.splice(Math.floor(R()*o.length),0,t)}
 return o}
const KINDS2=Object.keys(D);
module.exports={D,deforma,seed,R,U,pr,KINDS2};
