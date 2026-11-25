// Animated schematics, one per project. Each returns SVG markup (viewBox 0 0 320 180).
const A=(()=>{
const L='stroke="#8e9aa1" stroke-width="1.6" fill="none"';
const T=(x,y,s,a='start')=>`<text x="${x}" y="${y}" fill="#8e9aa1" font-size="9" font-family="Source Sans 3,system-ui,sans-serif" text-anchor="${a}">${s}</text>`;
const dot=(path,dur,begin=0,c='#ff6a55',r=2.4)=>`<circle r="${r}" fill="${c}"><animateMotion dur="${dur}s" begin="${begin}s" repeatCount="indefinite" path="${path}"/></circle>`;
const flow=(path,dur,n=3,c)=>Array.from({length:n},(_,i)=>dot(path,dur,-dur*i/n,c)).join('');
const draw=(d,dur,stroke,delay=0,w=1.8)=>`<path d="${d}" stroke="${stroke}" stroke-width="${w}" fill="none" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"><animate attributeName="stroke-dashoffset" values="1;0;0" keyTimes="0;.6;1" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/></path>`;
const fn=(f,x0,x1,n=120)=>{let d='';for(let i=0;i<=n;i++){const t=i/n,x=x0+(x1-x0)*t;d+=(i?'L':'M')+x.toFixed(1)+' '+f(t).toFixed(1)}return d};
const bus=(x,y,h=26)=>`<line x1="${x}" y1="${y-h/2}" x2="${x}" y2="${y+h/2}" stroke="#dfe5e8" stroke-width="4"/>`;
const gen=(x,y)=>`<circle cx="${x}" cy="${y}" r="11" ${L}/><path d="M${x-6} ${y}q3-6 6 0t6 0" ${L}/>`;
const lib={
steel(){ // network with N-1 overload that turns green
 const p1='M40 60 H150',p2='M150 60 H270',p3='M150 60 V130 H270',p4='M40 60 V130 H150';
 return `${gen(22,60)}${bus(40,60)}${bus(150,60)}${bus(270,60)}${bus(150,130)}${bus(270,130)}
 <path d="${p1}" ${L}/><path d="${p2}" ${L}/><path d="M150 130 H270" ${L}/><path d="M40 60 V130 H150" ${L}/>
 <path d="M270 60 V130" stroke-width="3" fill="none"><animate attributeName="stroke" values="#ff5a45;#ff5a45;#5fd38d;#5fd38d" keyTimes="0;.45;.5;1" dur="7s" repeatCount="indefinite"/></path>
 <rect x="276" y="122" width="34" height="16" rx="2" fill="#202629" stroke="#5c676d"/><path d="M282 134 l6-8 6 6 8-10" stroke="#dfe5e8" fill="none"/>
 ${flow(p1+' H270',3,4)}${flow(p4+' H270',4,3)}
 ${T(276,116,'Steel mill')}${T(44,40,'132 kV')}${T(178,98,'N-1 study')}
 <text x="200" y="160" font-size="10" font-family="Source Sans 3,sans-serif" fill="#ff6a55"><animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.45;.5;1" dur="7s" repeatCount="indefinite"/>Overload 112%</text>
 <text x="200" y="160" font-size="10" font-family="Source Sans 3,sans-serif" fill="#5fd38d" opacity="0"><animate attributeName="opacity" values="0;0;1;1" keyTimes="0;.45;.5;1" dur="7s" repeatCount="indefinite"/>Within limits ✓</text>`;},
stab(){ // rotor angle: stable vs pole slip
 const st=fn(t=>95-45*Math.exp(-3.2*t)*Math.sin(t*22),30,300);
 const un=fn(t=>95-Math.min(80,8*Math.exp(3.4*t)*Math.abs(Math.sin(t*9))+t*40),30,300);
 return `<path d="M30 20 V160 H305" ${L}/>${T(34,28,'Rotor angle')}${T(300,172,'time','end')}
 <line x1="30" y1="95" x2="305" y2="95" stroke="#3a4448" stroke-dasharray="3 3"/>
 ${draw(st,6,'#5fd38d')}${draw(un,6,'#ff5a45',0)}
 ${T(220,40,'326 ms: pole slip')}${T(220,150,'325 ms: stable')}
 <rect x="230" y="31" width="6" height="6" fill="#ff5a45" transform="translate(-12 0)"/><rect x="218" y="143" width="6" height="6" fill="#5fd38d"/>`;},
bess(){ // battery charge/discharge to grid
 let b='';for(let i=0;i<5;i++){const x=24+i*30;b+=`<rect x="${x}" y="70" width="24" height="60" rx="2" fill="#1b2124" stroke="#5c676d"/><rect x="${x+3}" width="18" fill="#5fd38d" opacity=".85"><animate attributeName="height" values="10;50;50;10;10" keyTimes="0;.4;.5;.9;1" dur="8s" repeatCount="indefinite"/><animate attributeName="y" values="117;77;77;117;117" keyTimes="0;.4;.5;.9;1" dur="8s" repeatCount="indefinite"/></rect>`}
 const p='M172 100 H214',q='M250 100 H300';
 return `${b}<path d="${p}" ${L}/><circle cx="224" cy="100" r="10" ${L}/><circle cx="238" cy="100" r="10" ${L}/><path d="${q}" ${L}/>
 <path d="M300 40 L290 150 M300 40 L310 150 M286 70 H314 M282 100 H318" ${L}/>
 <g><animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;.45;.5;.95;1" dur="8s" repeatCount="indefinite"/>${flow('M300 100 H250 M214 100 H172',2.2,3,'#ffb14a')}</g>
 <g opacity="0"><animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;.45;.5;.95;1" dur="8s" repeatCount="indefinite"/>${flow('M172 100 H214 M250 100 H300',2.2,3,'#ff6a55')}</g>
 ${T(24,58,'200 MW battery')}${T(216,128,'225 MVA')}${T(276,30,'Grid')}
 <text x="24" y="160" font-size="10" fill="#ffb14a" font-family="Source Sans 3,sans-serif">Charging<animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;.45;.5;.95;1" dur="8s" repeatCount="indefinite"/></text>
 <text x="24" y="160" font-size="10" fill="#ff6a55" font-family="Source Sans 3,sans-serif" opacity="0">Discharging<animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;.45;.5;.95;1" dur="8s" repeatCount="indefinite"/></text>`;},
net(){ // 8-bus line diagram
 const a='M34 50 H110 H200',b='M286 50 H200',c='M200 50 V110 H140 V150 H70',d='M140 110 H250 V150';
 return `${gen(22,50)}${gen(298,50)}${[[60,50],[110,50],[200,50],[250,50],[200,110],[140,110],[70,150],[250,150]].map(([x,y])=>bus(x,y,20)).join('')}
 <path d="${a}" ${L}/><path d="${b}" ${L}/><path d="${c}" ${L}/><path d="${d}" ${L}/>
 <path d="M70 150 l-8 12 h16z M250 150 l-8 12 h16z" fill="#8e9aa1"/>
 ${flow(a+' V110 H140 V150 H70',4,4)}${flow(b+' V110 H250 V150',3.6,3)}
 ${T(14,30,'11 kV')}${T(306,30,'6.6 kV','end')}${T(150,30,'132 kV')}
 <text x="210" y="96" font-size="9" fill="#dfe5e8" font-family="Source Sans 3,sans-serif">0.99<animate attributeName="opacity" values="1;.4;1" dur="2s" repeatCount="indefinite"/> p.u.</text>
 <rect x="248" y="156" width="0" height="0"/>${T(260,172,'+7.14 MVAr')}`;},
ride(){ // top view of two-axis ride
 const cab=(x)=>`<g transform="translate(${x} 0)"><circle r="26" fill="#1b2124" stroke="#dfe5e8" stroke-width="1.6"/><g>${[0,45,90,135,180,225,270,315].map(a=>`<circle cx="${17*Math.cos(a*Math.PI/180)}" cy="${17*Math.sin(a*Math.PI/180)}" r="3" fill="#ff6a55"/>`).join('')}<animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="3s" repeatCount="indefinite"/></g></g>`;
 return `<g transform="translate(160 92)"><circle r="78" fill="none" stroke="#3a4448" stroke-dasharray="4 4"/><g><rect x="-74" y="-6" width="148" height="12" rx="6" fill="#2a3236" stroke="#8e9aa1"/>${cab(-60)}${cab(60)}<circle r="8" fill="#8e9aa1"/><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="9s" repeatCount="indefinite"/></g></g>
 ${T(10,18,'Main platform 8.414 kW')}${T(310,18,'Cabins 1.601 kW','end')}${T(10,172,'4-quadrant drives, AFE 650 V DC bus')}`;},
rect(){ // 3-phase in, rectified out
 const ph=(k,c)=>`<path d="${fn(t=>52+22*Math.sin(t*Math.PI*8+k),0,320,200)}" stroke="${c}" stroke-width="1.6" fill="none"><animateTransform attributeName="transform" type="translate" from="0 0" to="-80 0" dur="2s" repeatCount="indefinite"/></path>`;
 const out=fn(t=>{let m=-1;for(let k=0;k<3;k++){m=Math.max(m,Math.abs(Math.sin(t*Math.PI*8+k*2.094)))}return 150-30*m},0,320,300);
 return `<clipPath id="rc"><rect x="20" y="20" width="120" height="70"/></clipPath><clipPath id="rc2"><rect x="180" y="100" width="120" height="70"/></clipPath>
 <g clip-path="url(#rc)">${ph(0,'#ff6a55')}${ph(2.094,'#ffb14a')}${ph(4.189,'#8ec5ff')}</g>
 <rect x="146" y="36" width="34" height="34" rx="3" fill="#1b2124" stroke="#8e9aa1"/><path d="M152 53 h22 M163 44 l8 9 -8 9z" stroke="#dfe5e8" fill="none"/>
 <path d="M180 53 H240 V100" ${L} stroke-dasharray="4 4"><animate attributeName="stroke-dashoffset" from="8" to="0" dur=".5s" repeatCount="indefinite"/></path>
 <g clip-path="url(#rc2)"><path d="${out}" stroke="#dfe5e8" stroke-width="1.8" fill="none" transform="translate(40 0)"><animateTransform attributeName="transform" type="translate" from="40 0" to="0 0" dur="2s" repeatCount="indefinite"/></path></g>
 ${T(20,14,'400 V, 3-phase in')}${T(300,96,'DC out, ~4% ripple','end')}${T(20,120,'3 stages · 4 outputs')}${T(20,134,'1500 V · 200–2000 V · 2×1100 V')}`;},
water(){ // four tanks with pumps
 let g='';const X=[30,100,170,240];
 X.forEach((x,i)=>{g+=`<rect x="${x}" y="60" width="50" height="80" rx="3" fill="#1b2124" stroke="#8e9aa1"/><rect x="${x+2}" width="46" fill="#4aa3e0" opacity=".8"><animate attributeName="height" values="20;70;70;20;20" keyTimes="0;.35;.6;.9;1" dur="8s" begin="${-i*2}s" repeatCount="indefinite"/><animate attributeName="y" values="118;68;68;118;118" keyTimes="0;.35;.6;.9;1" dur="8s" begin="${-i*2}s" repeatCount="indefinite"/></rect>${T(x+25,154,'T'+(i+1),'middle')}`;
 if(i<3)g+=`<path d="M${x+50} 128 H${x+70}" stroke="#4aa3e0" stroke-width="3" stroke-dasharray="4 4"><animate attributeName="stroke-dashoffset" from="8" to="0" dur=".6s" repeatCount="indefinite"/></path><g transform="translate(${x+60} 128)"><circle r="7" fill="#202629" stroke="#dfe5e8"/><path d="M0-5 V5 M-5 0 H5" stroke="#dfe5e8"><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1s" repeatCount="indefinite"/></path></g>`});
 return `${g}<rect x="30" y="16" width="118" height="30" rx="3" fill="#202629" stroke="#5c676d"/>${T(38,28,'pH')}<text x="38" y="41" font-size="11" fill="#dfe5e8" font-family="Source Sans 3,sans-serif">7.0<animate attributeName="opacity" values="1;.5;1" dur="1.5s" repeatCount="indefinite"/></text>${T(80,28,'Cl₂ dosing')}<circle cx="132" cy="36" r="4" fill="#5fd38d"><animate attributeName="opacity" values="1;.2;1" dur="1s" repeatCount="indefinite"/></circle>
 ${T(175,28,'S7-1500 ⇄ S7-1200')}${T(175,41,'PROFINET · OPC UA')}`;},
ctrl(){ // six step responses
 const ks=[[.9,0,'#5c676d'],[1.3,.15,'#6f7b81'],[2.2,0,'#ff6a55'],[1.6,0,'#8e9aa1'],[3.5,.35,'#a9b4b9'],[6,0,'#dfe5e8']];
 return `<path d="M30 20 V160 H305" ${L}/><path d="M30 150 H60 V50 H305" stroke="#3a4448" stroke-dasharray="3 3" fill="none"/>
 ${ks.map(([w,z,c],i)=>draw(fn(t=>{const x=t*4;const y=x<0.12?0:1-Math.exp(-w*(x-.12))*Math.cos(z*12*(x-.12));return 150-100*y},60,305),6,c,i*.2,c=='#ff6a55'?2.4:1.4)).join('')}
 ${T(34,28,'Pressure')}${T(196,40,'Direct synthesis: 0% overshoot')}<rect x="186" y="34" width="6" height="6" fill="#ff6a55"/>${T(300,172,'time','end')}`;},
cascade(){ // cascade loop block diagram with moving signals
 const box=(x,y,w,t)=>`<rect x="${x}" y="${y}" width="${w}" height="30" rx="3" fill="#202629" stroke="#8e9aa1"/><text x="${x+w/2}" y="${y+19}" fill="#dfe5e8" font-size="10" font-family="Source Sans 3,sans-serif" text-anchor="middle">${t}</text>`;
 const sum=(x,y)=>`<circle cx="${x}" cy="${y}" r="8" fill="none" stroke="#8e9aa1"/><path d="M${x-4} ${y}h8M${x} ${y-4}v8" stroke="#8e9aa1"/>`;
 const fwd='M14 60 H38 M54 60 H70 M130 60 H146 M162 60 H178 M238 60 H252 M296 60 H310';
 const outer='M300 60 V128 H46 V68',inner='M264 60 V100 H154 V68';
 return `${sum(46,60)}${box(70,45,60,'Outer PI')}${sum(154,60)}${box(178,45,60,'Inner PI')}${box(252,45,44,'Plant')}
 <path d="${fwd}" ${L}/><path d="${outer}" ${L}/><path d="${inner}" ${L}/>
 ${flow('M14 60 H310',4,5)}${flow(outer,4,3,'#8ec5ff')}${flow(inner,2.4,3,'#ffb14a')}
 ${T(14,52,'SP')}${T(176,94,'fast inner loop')}${T(60,146,'slow outer loop')}
 ${T(14,172,'PI/PID tuning · cascade · IMC · FOPDT model · sampling · PID forms')}`;},
tune(){ // ZN vs Cohen-Coon vs IMC on setpoint step then disturbance
 const r=(w,z,dist)=>fn(t=>{const x=t*6;let y=x<.3?0:1-Math.exp(-w*(x-.3))*Math.cos(z*(x-.3)*6);if(x>3.6)y-=dist*Math.exp(-1.6*(x-3.6))*Math.sin(Math.min(Math.PI,(x-3.6)*3));return 140-90*y},40,305);
 return `<path d="M40 20 V160 H305" ${L}/><path d="M40 140 H58 V50 H305" stroke="#3a4448" stroke-dasharray="3 3" fill="none"/>
 ${draw(r(1.8,.9,.5),7,'#6f7b81',0,1.4)}${draw(r(2.2,.7,.35),7,'#a9b4b9',.15,1.4)}${draw(r(1.5,0,.15),7,'#ff6a55',.3,2.4)}
 <line x1="208" y1="24" x2="208" y2="156" stroke="#3a4448"/>${T(212,32,'disturbance')}
 ${T(44,13,'Twin air pressure: 40 → 50%')}
 <rect x="230" y="128" width="6" height="6" fill="#ff6a55"/>${T(240,134,'IMC')}<rect x="230" y="140" width="6" height="6" fill="#a9b4b9"/>${T(240,146,'Cohen-Coon')}<rect x="230" y="152" width="6" height="6" fill="#6f7b81"/>${T(240,158,'Ziegler-Nichols')}`;},
msb(){ // building main switchboard: supply, CT metering, main switch, busbar, outgoing MCCBs
 const brk=(x)=>`<rect x="${x-7}" y="112" width="14" height="20" rx="2" fill="#202629" stroke="#8e9aa1"/><path d="M${x} 104 V112 M${x} 132 V160" stroke="#8e9aa1" stroke-width="1.6"/>`;
 const xs=[80,130,180,230,280];
 return `<path d="M20 30 H60" ${L}/>${T(20,22,'415 V supply')}
 ${[0,1,2].map(i=>`<circle cx="${70+i*14}" cy="30" r="6" fill="none" stroke="#ffb14a"><animate attributeName="stroke-opacity" values="1;.3;1" dur="1.2s" begin="${i*.2}s" repeatCount="indefinite"/></circle>`).join('')}${T(64,50,'CT metering')}
 <path d="M104 30 H130" ${L}/><rect x="130" y="20" width="26" height="20" rx="2" fill="#202629" stroke="#dfe5e8"/>${T(143,54,'Main switch','middle')}
 <path d="M156 30 H180 V60" ${L}/><rect x="252" y="16" width="44" height="22" rx="2" fill="#202629" stroke="#5c676d"/><text x="274" y="31" text-anchor="middle" font-size="10" fill="#5fd38d" font-family="Source Sans 3,sans-serif">kWh<animate attributeName="opacity" values="1;.4;1" dur="2s" repeatCount="indefinite"/></text>
 <line x1="60" y1="64" x2="300" y2="64" stroke="#dfe5e8" stroke-width="5"/><line x1="60" y1="72" x2="300" y2="72" stroke="#ffb14a" stroke-width="2"/><line x1="60" y1="78" x2="300" y2="78" stroke="#8ec5ff" stroke-width="2"/>
 ${T(300,92,'busbars L1 L2 L3','end')}
 ${xs.map(x=>`<path d="M${x} 64 V104" stroke="#8e9aa1" stroke-width="1.6"/>`+brk(x)).join('')}
 ${flow('M20 30 H180 V64 H80 V160',3.2,3)}${flow('M180 64 H280 V160',2.6,2)}${flow('M180 64 V160',2.2,2)}
 ${T(80,174,'Fire pumps','middle')}${T(130,174,'Units','middle')}${T(180,174,'Common','middle')}${T(230,174,'Lift / EV','middle')}${T(280,174,'Future PV','middle')}`;},
tank(){ // nonlinear tank with PI
 return `<rect x="40" y="40" width="70" height="110" rx="3" fill="#1b2124" stroke="#8e9aa1"/>
 <rect x="42" width="66" fill="#4aa3e0" opacity=".85"><animate attributeName="height" values="40;40;75;75;40" keyTimes="0;.1;.45;.6;1" dur="8s" calcMode="spline" keySplines="0 0 1 1;.2 .8 .3 1;0 0 1 1;.4 0 .6 1" repeatCount="indefinite"/><animate attributeName="y" values="108;108;73;73;108" keyTimes="0;.1;.45;.6;1" dur="8s" calcMode="spline" keySplines="0 0 1 1;.2 .8 .3 1;0 0 1 1;.4 0 .6 1" repeatCount="indefinite"/></rect>
 <path d="M10 30 H75 V40" stroke="#4aa3e0" stroke-width="3" fill="none" stroke-dasharray="4 4"><animate attributeName="stroke-dashoffset" from="8" to="0" dur=".5s" repeatCount="indefinite"/></path>
 <path d="M110 140 H150" stroke="#4aa3e0" stroke-width="3" fill="none" stroke-dasharray="4 4"><animate attributeName="stroke-dashoffset" from="8" to="0" dur=".7s" repeatCount="indefinite"/></path>
 <path d="M170 30 V150 H310" ${L}/>${draw(fn(t=>{const x=t*8;return x<1?120:120-50*(1-Math.exp(-(x-1)*1.1))},170,310),8,'#ff6a55')}
 <path d="M170 120 H185 V70 H310" stroke="#3a4448" stroke-dasharray="3 3" fill="none"/>
 ${T(10,22,'Fᵢ in')}${T(150,134,'c√h out','end')}${T(176,24,'Level, PI control')}${T(40,168,'K = 3.39, τ = 1.16 s at 50%')}`;},
solar(){ // sun arc and power curve
 const arc='M30 120 Q160 -60 290 120';
 return `<path d="${arc}" stroke="#3a4448" stroke-dasharray="3 4" fill="none"/>
 <g><circle r="11" fill="#ffb14a"/><circle r="17" fill="none" stroke="#ffb14a" opacity=".4"/><animateMotion dur="8s" repeatCount="indefinite" path="${arc}"/></g>
 <path d="M110 150 L150 120 H220 L180 150Z" fill="#1d3a57" stroke="#8ec5ff"/><path d="M126 138 H196 M142 126 L163 150 M165 126 L186 150" stroke="#8ec5ff" stroke-width=".7"/>
 ${draw(fn(t=>170-50*Math.sin(Math.PI*t)**1.5,30,290),8,'#ffb14a',0,2)}
 ${T(10,20,'20.1 kWp · Kalgoorlie Library')}${T(310,20,'1,537 kWh/kWp','end')}`;},
drone(){ // drone scanning crop grid
 let g='';const bad=[[2,1],[5,3],[8,0],[3,4],[7,2]];
 for(let r=0;r<5;r++)for(let c=0;c<10;c++){const b=bad.some(([x,y])=>x==c&&y==r);g+=`<rect x="${20+c*28}" y="${40+r*26}" width="24" height="22" rx="2" fill="#24402a">${b?`<animate attributeName="fill" values="#24402a;#24402a;#ff5a45;#ff5a45" keyTimes="0;${((r*10+(r%2?9-c:c))/50).toFixed(2)};${((r*10+(r%2?9-c:c))/50+.02).toFixed(2)};1" dur="10s" repeatCount="indefinite"/>`:''}</rect>`}
 let path='M32 51';for(let r=0;r<5;r++){const y=51+r*26;path+=(r?` V${y}`:'')+` H${r%2?32:284}`}
 return `${g}<g><path d="M-14-10 L14 10 M14-10 L-14 10" stroke="#dfe5e8" stroke-width="2"/>${[[-14,-10],[14,10],[14,-10],[-14,10]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6" fill="none" stroke="#dfe5e8"/>`).join('')}<rect x="-5" y="-5" width="10" height="10" fill="#ff6a55"/><animateMotion dur="10s" repeatCount="indefinite" path="${path}"/></g>
 ${T(20,26,'Aerial scan → disease map')}${T(300,26,'DINOv2 + ResNet50','end')}`;},
gantry(){ // pick and place
 const kt='0;.1;.2;.45;.55;.65;.9;1';
 return `<rect x="20" y="24" width="280" height="10" fill="#2a3236" stroke="#8e9aa1"/>
 <g><animateTransform attributeName="transform" type="translate" values="60 0;60 0;60 0;240 0;240 0;240 0;60 0;60 0" keyTimes="${kt}" dur="8s" repeatCount="indefinite"/>
  <rect x="-16" y="20" width="32" height="18" rx="2" fill="#3a4448" stroke="#dfe5e8"/>
  <g><animateTransform attributeName="transform" type="translate" values="0 0;0 58;0 0;0 0;0 58;0 0;0 0;0 0" keyTimes="${kt}" dur="8s" repeatCount="indefinite"/><rect x="-3" y="38" width="6" height="40" fill="#8e9aa1"/><path d="M-10 82 h20 l-4-4 h-12z" fill="#ff6a55"/></g></g>
 <ellipse rx="14" ry="5" fill="#f2f2ee"><animateMotion dur="8s" repeatCount="indefinite" keyPoints="0;0;.196;.804;1;1;1;0;0" keyTimes="0;.1;.2;.45;.55;.9;.93;.96;1" calcMode="linear" path="M60 140 V82 H240 V140"/><animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;.9;.93;.96;1" dur="8s" repeatCount="indefinite"/></ellipse>
 <rect x="220" y="145" width="40" height="8" fill="#5c676d"/><ellipse cx="240" cy="148" rx="14" ry="5" fill="#d8d8d2"/><rect x="40" y="145" width="40" height="8" fill="#5c676d"/>
 <g transform="translate(296 60)"><rect x="-6" y="0" width="12" height="36" rx="2" fill="#202629"/><circle cy="7" r="4" fill="#5fd38d"/><circle cy="18" r="4" fill="#ffb14a" opacity=".3"/><circle cy="29" r="4" fill="#ff5a45" opacity=".3"/></g>
 ${T(20,172,'S7-1500 · reed switches H0–H4, V0–V4')}${T(250,172,'stack','middle')}`;},
home(){ // smart home
 return `<path d="M60 90 L160 30 L260 90 V160 H60Z" fill="#1b2124" stroke="#8e9aa1" stroke-width="1.6"/>
 ${[[80,100],[200,100]].map(([x,y],i)=>`<rect x="${x}" y="${y}" width="40" height="30" fill="#ffd27a"><animate attributeName="opacity" values=".15;1;1;.4;.15" keyTimes="0;.2;.5;.8;1" dur="7s" begin="${-i*2}s" repeatCount="indefinite"/></rect>`).join('')}
 <rect x="145" y="110" width="30" height="50" fill="#2a3236" stroke="#8e9aa1"/><rect x="145" y="110" width="30" height="50" fill="#5c676d" transform-origin="145px 135px"><animateTransform attributeName="transform" type="scale" values="1 1;1 1;.25 1;.25 1;1 1" keyTimes="0;.3;.4;.75;.85" dur="7s" repeatCount="indefinite"/></rect>
 <g transform="translate(160 70)"><g><path d="M0 0 L-12 -3 L-12 3Z M0 0 L12 -3 L12 3Z M0 0 L-3 12 L3 12Z" fill="#8e9aa1"/><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1.2s" repeatCount="indefinite"/></g><circle r="2" fill="#dfe5e8"/></g>
 <circle cx="270" cy="130" r="4" fill="#ff6a55"/><circle cx="270" cy="130" r="4" fill="none" stroke="#ff6a55"><animate attributeName="r" values="4;22" dur="1.6s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="1.6s" repeatCount="indefinite"/></circle>
 ${T(10,20,'ESP32 · Raspberry Pi face lock')}${T(310,20,'Telegram alert','end')}${T(275,160,'PIR')}`;},
farm(){ // moisture-driven pump
 const on='0;0;1;1;0';const kt='0;.5;.52;.98;1';
 return `<rect x="20" y="40" width="16" height="110" rx="3" fill="#1b2124" stroke="#8e9aa1"/><rect x="22" width="12" fill="#c98f4a"><animate attributeName="height" values="70;35;35;70;70" keyTimes="0;.5;.52;.98;1" dur="8s" repeatCount="indefinite"/><animate attributeName="y" values="78;113;113;78;78" keyTimes="0;.5;.52;.98;1" dur="8s" repeatCount="indefinite"/></rect>${T(18,32,'Soil moisture')}
 <circle cx="110" cy="110" r="20" fill="#202629" stroke="#dfe5e8"/><g transform="translate(110 110)"><path d="M0-14 V14 M-14 0 H14" stroke="#dfe5e8"><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur=".6s" repeatCount="indefinite"/></path></g>${T(110,146,'15 hp, 3-phase','middle')}
 <rect x="70" y="40" width="80" height="34" rx="3" fill="#202629" stroke="#5c676d"/>${T(78,54,'ESP32 → VFD')}
 <text x="78" y="67" font-size="10" font-family="Source Sans 3,sans-serif" fill="#ff6a55">PUMP OFF<animate attributeName="opacity" values="1;1;0;0;1" keyTimes="${kt}" dur="8s" repeatCount="indefinite"/></text><text x="78" y="67" font-size="10" font-family="Source Sans 3,sans-serif" fill="#5fd38d" opacity="0">PUMP ON<animate attributeName="opacity" values="${on}" keyTimes="${kt}" dur="8s" repeatCount="indefinite"/></text>
 <g opacity="0"><animate attributeName="opacity" values="${on}" keyTimes="${kt}" dur="8s" repeatCount="indefinite"/><path d="M130 110 H300" stroke="#4aa3e0" stroke-width="5" stroke-dasharray="6 6"><animate attributeName="stroke-dashoffset" from="12" to="0" dur=".4s" repeatCount="indefinite"/></path></g>
 ${[0,1,2,3,4,5].map(i=>`<path d="M${170+i*22} 150 v-14 m0 4 l-5-5 m5 9 l5-6" stroke="#5fd38d" fill="none"/>`).join('')}${T(300,172,'MQTT → phone','end')}`;}
};
return (k)=>`<svg viewBox="0 0 320 180" role="img" aria-hidden="true">${lib[k]()}</svg>`;
})();
