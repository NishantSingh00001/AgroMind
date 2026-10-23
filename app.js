'use strict';
/* ---------- APP config ---------- */
window.APP={
  id:'agro',name:'AgroMind',
  logo:'<span class="mk"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21V11M12 11c0-4 3-7 8-7 0 5-3 8-8 8zM12 14c0-3-2-6-7-6 0 4 3 6 7 6z"/></svg></span>',
  nav:[['index.html','home','Home'],['crops.html','leaf','Crops'],['planner.html','calendar','Planner'],['calculators.html','calc','Tools'],['field.html','cloud','Field'],['settings.html','settings','Settings']],
  accents:[['#86d95a','#d6a94e','#e8c45a'],['#5ad99a','#86d95a','#d6e85a'],['#d6a94e','#e5704a','#e8c45a'],['#7ad6c0','#86d95a','#9ad6e8']],
  cta:['crops.html','leaf','Explore crops'],
  heroKind:'terrain',
  icons:{leaf:'M4 20C4 11 11 4 20 4c0 9-7 16-16 16zM4 20c4-6 9-9 13-10',calendar:'M4 5h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zM3 9h18M8 3v4M16 3v4',calc:'M5 3h14a1 1 0 011 1v16a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1zM8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M16 15v2',cloud:'M7 18a4 4 0 01-.5-7.97A6 6 0 0118 9a3.5 3.5 0 01-.5 9z',drop:'M12 3C9 7 6 10 6 14a6 6 0 0012 0c0-4-3-7-6-11z',ruler:'M5 19L19 5l2 2L7 21zM9 11l2 2M13 7l2 2M5 15l2 2',sprout:'M12 20V9M12 9c0-3 2-5 6-5 0 3-2 6-6 5zM12 12c0-2-2-4-6-4 0 3 2 4 6 4z',basket:'M3 9h18l-2 11H5zM8 9l3-5M16 9l-3-5M9 13v4M15 13v4',flask:'M9 3h6M10 3v6l-5 9a1.5 1.5 0 001.3 2.2h11.4A1.5 1.5 0 0015 18L10 9M7 15h10'},
  ensureSeed(){if(!localStorage.getItem('agro_seeded')){localStorage.setItem('agro_seeded','1');save();}}
};
/* ---------- state ---------- */
const LS='agro_data';
function loadS(){try{return Object.assign({journal:[],plan:[],units:'metric',place:'',wx:null},JSON.parse(localStorage.getItem(LS)||'{}'));}catch(e){return{journal:[],plan:[],units:'metric'};}}
let S=loadS();function save(){localStorage.setItem(LS,JSON.stringify(S));}
const M=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
/* ---------- crop database (temperate defaults; ranges are general guidance) ---------- */
const CROPS=[
 {n:'Tomato',fam:'Solanaceae',season:'Warm',sp:45,row:75,dth:80,water:'High',sun:'Full',ph:[6.0,6.8],depth:0.6,sow:[2,3],trans:[4,5],harv:[7,8,9],comp:['Basil','Carrot','Marigold'],avoid:['Potato','Fennel'],note:'Stake or cage. Water evenly to prevent blossom-end rot.'},
 {n:'Lettuce',fam:'Asteraceae',season:'Cool',sp:25,row:30,dth:50,water:'Med',sun:'Partial',ph:[6.0,7.0],depth:0.3,sow:[2,3,8,9],trans:[3,4,9],harv:[5,6,10,11],comp:['Carrot','Radish','Cucumber'],avoid:['Parsley'],note:'Bolts in heat — succession-sow every 2 weeks.'},
 {n:'Carrot',fam:'Apiaceae',season:'Cool',sp:5,row:30,dth:75,water:'Med',sun:'Full',ph:[6.0,6.8],depth:1.0,sow:[3,4,5,6],trans:[],harv:[6,7,8,9],comp:['Onion','Leek','Tomato'],avoid:['Dill'],note:'Loose, stone-free soil for straight roots. Thin seedlings.'},
 {n:'Potato',fam:'Solanaceae',season:'Cool',sp:30,row:75,dth:100,water:'Med',sun:'Full',ph:[5.0,6.0],depth:10,sow:[3,4],trans:[],harv:[7,8,9],comp:['Beans','Corn','Cabbage'],avoid:['Tomato','Cucumber'],note:'Hill soil as plants grow to protect tubers from light.'},
 {n:'Spinach',fam:'Amaranthaceae',season:'Cool',sp:10,row:30,dth:45,water:'Med',sun:'Partial',ph:[6.5,7.5],depth:1.0,sow:[2,3,8,9],trans:[],harv:[4,5,10,11],comp:['Strawberry','Radish'],avoid:[],note:'Fast and cold-hardy. Harvest outer leaves first.'},
 {n:'Bean (bush)',fam:'Fabaceae',season:'Warm',sp:15,row:45,dth:60,water:'Med',sun:'Full',ph:[6.0,7.0],depth:3,sow:[5,6],trans:[],harv:[7,8],comp:['Corn','Squash','Carrot'],avoid:['Onion','Garlic'],note:'Fixes nitrogen. Do not soak seed before sowing.'},
 {n:'Cucumber',fam:'Cucurbitaceae',season:'Warm',sp:40,row:90,dth:60,water:'High',sun:'Full',ph:[6.0,7.0],depth:2,sow:[4,5],trans:[5,6],harv:[7,8,9],comp:['Bean','Corn','Radish'],avoid:['Potato','Sage'],note:'Trellis to save space and keep fruit clean.'},
 {n:'Pepper',fam:'Solanaceae',season:'Warm',sp:40,row:60,dth:90,water:'Med',sun:'Full',ph:[6.0,6.8],depth:0.6,sow:[2,3],trans:[5],harv:[8,9,10],comp:['Basil','Onion','Carrot'],avoid:['Fennel'],note:'Loves heat. Start indoors 8 weeks before last frost.'},
 {n:'Onion',fam:'Amaryllidaceae',season:'Cool',sp:10,row:30,dth:120,water:'Med',sun:'Full',ph:[6.0,7.0],depth:1.5,sow:[2,3],trans:[4],harv:[8,9],comp:['Carrot','Beet','Lettuce'],avoid:['Bean','Pea'],note:'Day-length sensitive — pick a type suited to your latitude.'},
 {n:'Kale',fam:'Brassicaceae',season:'Cool',sp:45,row:60,dth:60,water:'Med',sun:'Full',ph:[6.0,7.5],depth:1.0,sow:[3,4,7,8],trans:[5,8],harv:[6,7,10,11,12],comp:['Beet','Celery','Onion'],avoid:['Strawberry'],note:'Sweeter after a light frost. Very cold-hardy.'},
 {n:'Radish',fam:'Brassicaceae',season:'Cool',sp:5,row:15,dth:28,water:'Med',sun:'Full',ph:[6.0,7.0],depth:1.0,sow:[3,4,5,8,9],trans:[],harv:[4,5,6,9,10],comp:['Carrot','Cucumber','Lettuce'],avoid:['Hyssop'],note:'Fastest crop — great row marker between slow seeds.'},
 {n:'Zucchini',fam:'Cucurbitaceae',season:'Warm',sp:60,row:90,dth:55,water:'High',sun:'Full',ph:[6.0,7.5],depth:2,sow:[4,5],trans:[5,6],harv:[7,8,9],comp:['Corn','Bean','Nasturtium'],avoid:['Potato'],note:'Hugely productive — pick young and often.'},
 {n:'Beet',fam:'Amaranthaceae',season:'Cool',sp:10,row:30,dth:60,water:'Med',sun:'Full',ph:[6.0,7.0],depth:2,sow:[3,4,7,8],trans:[],harv:[6,7,10],comp:['Onion','Lettuce','Cabbage'],avoid:['Bean'],note:'Each seed is a cluster — thin for good roots.'},
 {n:'Pea',fam:'Fabaceae',season:'Cool',sp:5,row:45,dth:65,water:'Med',sun:'Full',ph:[6.0,7.5],depth:3,sow:[2,3,4],trans:[],harv:[5,6,7],comp:['Carrot','Radish','Corn'],avoid:['Onion','Garlic'],note:'Fixes nitrogen. Provide support for climbing types.'},
 {n:'Basil',fam:'Lamiaceae',season:'Warm',sp:25,row:30,dth:60,water:'Med',sun:'Full',ph:[6.0,7.5],depth:0.5,sow:[3,4],trans:[5],harv:[7,8,9],comp:['Tomato','Pepper'],avoid:['Rue'],note:'Pinch flowers to keep leaves coming. Frost-tender.'},
 {n:'Garlic',fam:'Amaryllidaceae',season:'Cool',sp:15,row:30,dth:240,water:'Low',sun:'Full',ph:[6.0,7.5],depth:5,sow:[10,11],trans:[],harv:[6,7],comp:['Tomato','Carrot','Beet'],avoid:['Bean','Pea'],note:'Plant cloves in autumn for a summer harvest.'}
];
/* ---------- unit helpers ---------- */
function metric(){return S.units!=='imperial';}
function spU(cm){return metric()?cm+' cm':(cm/2.54).toFixed(1)+' in';}
function tU(c){return metric()?Math.round(c)+'°C':Math.round(c*9/5+32)+'°F';}
/* ---------- calculators ---------- */
function calcSpacing(bedL,bedW,sp){const perRow=Math.floor(bedL*100/sp);const rows=Math.floor(bedW*100/sp);return Math.max(0,perRow)*Math.max(0,rows);}
function calcFert(area,targetN,pctN){return pctN>0?Math.round(area*targetN/(pctN/100)):0;}
function calcIrr(area,etc){return Math.round(area*etc);}
function calcYield(plants,per){return Math.round(plants*per);}
function calcSeed(area,perM2,germ){return Math.ceil(area*perM2/(germ/100));}
/* ---------- weather (open-meteo, free, no key) ---------- */
async function geocode(name){const r=await fetch('https://geocoding-api.open-meteo.com/v1/search?name='+encodeURIComponent(name)+'&count=1');const j=await r.json();if(!j.results||!j.results.length)throw new Error('not found');return j.results[0];}
async function weather(lat,lon){const r=await fetch('https://api.open-meteo.com/v1/forecast?latitude='+lat+'&longitude='+lon+'&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&forecast_days=7&timezone=auto');return r.json();}
const WC={0:'Clear',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',45:'Fog',48:'Rime fog',51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',71:'Light snow',73:'Snow',75:'Heavy snow',80:'Showers',81:'Showers',82:'Heavy showers',95:'Thunderstorm',96:'Storm w/ hail'};
function wcName(c){return WC[c]||'—';}
function advice(cur,daily){const out=[];const t=cur.temperature_2m;const rainSoon=daily.precipitation_sum.slice(0,2).reduce((a,b)=>a+b,0);
  if(t<2)out.push(['Frost risk','Protect tender crops; delay sowing warm-season seeds.']);
  if(t>30)out.push(['Heat stress','Water early morning; shade lettuce and greens.']);
  if(rainSoon>5)out.push(['Rain coming','Skip irrigation — ~'+rainSoon.toFixed(0)+'mm expected in 48h.']);
  else if(cur.precipitation===0&&t>18)out.push(['Watering','Dry & warm — water deeply at the roots this evening.']);
  if(t>=10&&t<=22)out.push(['Good window','Ideal for sowing/transplanting cool-season crops now.']);
  if(!out.length)out.push(['All clear','Conditions are moderate — a good day for general field work.']);
  return out;}
/* ---------- shared renderers ---------- */
function statRow(cells){return cells.map(([l,n])=>'<div class="bstat"><div class="n">'+n+'</div><div class="l">'+l+'</div></div>').join('');}
function marq(tags){return '<span>'+tags.map(t=>'<b>'+t+'</b>').join(' · ')+' · </span><span>'+tags.map(t=>'<b>'+t+'</b>').join(' · ')+' · </span>';}
function featGrid(items){return items.map(([h,ic,t,d],i)=>'<a class="fcell" href="'+h+'"><div class="fi">'+icon(ic,22)+'</div><div class="fx">0'+(i+1)+'</div><h3>'+t+'</h3><p>'+d+'</p><div class="go">Open '+icon('chevron',13)+'</div></a>').join('');}
const FEATURES='18-crop database · season · plant & row spacing · days to harvest · water need · sun need · soil pH range · sowing depth · companions · avoid-with · growing notes · search · season filter · crop detail · month planting calendar · sow/transplant/harvest windows · multi-crop plan · bed spacing calculator · plant-count · fertilizer-by-N · NPK split · irrigation (ET) · yield estimate · seed rate · compost ratio · live weather · 7-day forecast · frost warning · watering advice · planting-window advice · field journal · add/edit/delete plots · task status · metric/imperial units · JSON export/import · multi-page nav · light & dark · 4 accents · custom cursor · 3D terrain hero · ambient motion · scroll reveals · shortcuts · autosave · offline-first · responsive';
/* ---------- PAGES ---------- */
window.PAGES={
 index(){
   $('meta').innerHTML=statRow([['crops',CROPS.length],['tools','6'],['journal',S.journal.length],['free','$0']]);
   $('marq').innerHTML=marq(['crop database','planting calendar','spacing calculator','fertilizer · NPK','irrigation','yield','live weather','field journal','offline first']);
   $('fgrid').innerHTML=featGrid([['crops.html','leaf','Crops','A searchable library of 18 crops — spacing, season, pH, companions and notes.'],['planner.html','calendar','Planner','Month-by-month sow, transplant and harvest windows for your plan.'],['calculators.html','calc','Tools','Spacing, fertilizer, irrigation, yield, seed-rate and compost calculators.'],['field.html','cloud','Field & weather','Live forecast with planting advice, plus a field journal for your plots.'],['settings.html','settings','Settings','Units, theme, accent and data backup — all private to your browser.'],['crops.html','sprout','Start growing','Pick a crop and plan your season in minutes.']]);
   $('featlist').textContent='50+ features — '+FEATURES+'.';
   mountHero3D('hero3d','terrain');
 },
 crops(){
   const el=$('list');function draw(){const q=$('q').value.toLowerCase();const f=$('filter').value;
     let cs=CROPS.filter(c=>(!q||c.n.toLowerCase().includes(q)||c.fam.toLowerCase().includes(q))&&(f==='all'||c.season===f));
     $('cnt').textContent=cs.length+' crops';
     el.innerHTML=cs.map(c=>'<div class="cropcard"><div class="ct"><div class="cg">'+icon('leaf',22)+'</div><div><h3>'+c.n+'</h3><div class="fam">'+c.fam+' · '+c.season+'-season</div></div><button class="btn" style="margin-left:auto" data-n="'+c.n+'">Details</button></div><div class="attrs"><div class="at"><div class="l">Spacing</div><div class="v">'+spU(c.sp)+'</div></div><div class="at"><div class="l">Harvest</div><div class="v">'+c.dth+' days</div></div><div class="at"><div class="l">Water / Sun</div><div class="v">'+c.water+' · '+c.sun+'</div></div><div class="at"><div class="l">Soil pH</div><div class="v">'+c.ph[0]+'–'+c.ph[1]+'</div></div></div></div>').join('')||'<div class="empty">No crops match.</div>';
     el.querySelectorAll('.btn[data-n]').forEach(b=>b.onclick=()=>detail(b.dataset.n));}
   $('q').oninput=draw;$('filter').onchange=draw;draw();
 },
 planner(){
   const wrap=$('plan');const picks=new Set(S.plan&&S.plan.length?S.plan:['Tomato','Lettuce','Carrot','Kale']);
   $('pick').innerHTML=CROPS.map(c=>'<button class="seg-b chip'+(picks.has(c.n)?' on':'')+'" data-n="'+c.n+'" style="'+(picks.has(c.n)?'border-color:var(--glassbrd);color:var(--acc)':'')+'">'+c.n+'</button>').join('');
   function draw(){let rows='<div class="cal"><div></div>'+M.map(m=>'<div class="mh">'+m[0]+'</div>').join('');
     CROPS.filter(c=>picks.has(c.n)).forEach(c=>{rows+='<div class="cn">'+c.n+'</div>'+M.map((m,i)=>{let cls='cell';if(c.harv.includes(i+1))cls+=' harv';else if(c.trans.includes(i+1))cls+=' trans';else if(c.sow.includes(i+1))cls+=' sow';return '<div class="'+cls+'"></div>';}).join('');});
     rows+='</div>';wrap.innerHTML=rows;}
   $('pick').querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{const n=b.dataset.n;if(picks.has(n))picks.delete(n);else picks.add(n);b.classList.toggle('on');S.plan=[...picks];save();draw();});
   draw();
   /* spacing calc */
   function sc(){const L=+$('bl').value||0,W=+$('bw').value||0,c=CROPS.find(x=>x.n===$('bc').value);const p=calcSpacing(L,W,c.sp);$('scOut').innerHTML='<em>'+p+'</em> plants';$('scNote').textContent=c.n+' at '+spU(c.sp)+' spacing in a '+L+'×'+W+' m bed';}
   $('bc').innerHTML=CROPS.map(c=>'<option>'+c.n+'</option>').join('');['bl','bw','bc'].forEach(id=>$(id).oninput=$(id).onchange=sc);sc();
 },
 calculators(){
   function bind(ids,fn,out){ids.forEach(id=>{$(id).oninput=()=>fn();$(id).onchange=()=>fn();});fn();}
   bind(['f_area','f_n','f_pct'],()=>{$('f_out').innerHTML='<em>'+calcFert(+$('f_area').value||0,+$('f_n').value||0,+$('f_pct').value||0)+'</em> g';});
   bind(['i_area','i_etc'],()=>{$('i_out').innerHTML='<em>'+calcIrr(+$('i_area').value||0,+$('i_etc').value||0)+'</em> L/day';});
   bind(['y_pl','y_per'],()=>{$('y_out').innerHTML='<em>'+calcYield(+$('y_pl').value||0,+$('y_per').value||0)+'</em> units';});
   bind(['s_area','s_den','s_germ'],()=>{$('s_out').innerHTML='<em>'+calcSeed(+$('s_area').value||0,+$('s_den').value||0,+$('s_germ').value||1)+'</em> seeds';});
   bind(['c_green','c_brown'],()=>{const g=+$('c_green').value||0,b=+$('c_brown').value||0;const ratio=g?(b/g).toFixed(1):'0';const ok=b/Math.max(1,g)>=2&&b/Math.max(1,g)<=3;$('c_out').innerHTML='<em>'+ratio+':1</em> brown:green';$('c_note').textContent=ok?'Balanced — this pile should heat up well.':'Aim for 2–3 parts browns to 1 part greens.';});
   bind(['sp_l','sp_w','sp_s'],()=>{$('sp_out').innerHTML='<em>'+calcSpacing(+$('sp_l').value||0,+$('sp_w').value||0,+$('sp_s').value||1)+'</em> plants';});
 },
 field(){
   async function go(name){const box=$('wxbox');box.innerHTML='<div class="empty">Loading weather…</div>';
     try{const g=await geocode(name);const w=await weather(g.latitude,g.longitude);S.place=g.name+', '+(g.country_code||'');S.wx={g,w};save();renderWx(g,w);}
     catch(e){box.innerHTML='<div class="empty">Could not load weather for “'+esc(name)+'”. Check the name or your connection.</div>';}}
   function renderWx(g,w){const c=w.current,d=w.daily;const box=$('wxbox');
     box.innerHTML='<div class="wx"><div class="temp"><em>'+tU(c.temperature_2m)+'</em></div><div><div style="font-family:var(--disp);font-weight:700;font-size:20px">'+g.name+'</div><div style="color:var(--mut);font-size:13px">'+wcName(c.weather_code)+' · humidity '+c.relative_humidity_2m+'% · wind '+Math.round(c.wind_speed_10m)+' km/h</div></div></div>'+
       '<div class="fc" style="margin-top:20px">'+d.time.map((t,i)=>'<div class="d"><div class="dn">'+new Date(t).toLocaleDateString(undefined,{weekday:'short'})+'</div><div class="dt">'+tU(d.temperature_2m_max[i])+'</div><div class="dl">'+tU(d.temperature_2m_min[i])+' · '+Math.round(d.precipitation_sum[i])+'mm</div></div>').join('')+'</div>';
     const adv=advice(c,d);$('advice').innerHTML=adv.map(([t,x])=>'<div class="listrow" style="margin-bottom:10px"><div style="width:8px;height:8px;border-radius:50%;background:var(--acc);flex:none"></div><div><b>'+t+'</b><div style="color:var(--mut);font-size:13px;margin-top:2px">'+x+'</div></div></div>').join('');}
   $('wxgo').onclick=()=>{const v=$('wxin').value.trim();if(v)go(v);};$('wxin').addEventListener('keydown',e=>{if(e.key==='Enter')$('wxgo').click();});
   if(S.wx){renderWx(S.wx.g,S.wx.w);$('wxin').value=S.place;}
   /* journal */
   function jr(){const el=$('journal');el.innerHTML=S.journal.length?S.journal.map((e,i)=>'<div class="listrow" style="margin-bottom:10px"><div style="width:40px;height:40px;border-radius:11px;background:var(--panel);display:grid;place-items:center;color:var(--acc);flex:none">'+icon('sprout',20)+'</div><div style="flex:1"><b>'+esc(e.plot)+'</b> <span style="color:var(--mut)">· '+esc(e.crop)+'</span><div style="color:var(--mut);font-size:12.5px;margin-top:2px">'+esc(e.note||'')+' <span style="font-family:var(--mono);font-size:11px">'+e.status+'</span></div></div><button class="ghost" data-i="'+i+'">'+icon('trash',14)+'</button></div>').join(''):'<div class="empty">No plots logged yet.</div>';
     el.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{S.journal.splice(+b.dataset.i,1);save();jr();});}
   $('jadd').onclick=()=>{const plot=$('jplot').value.trim();if(!plot){toast('Name the plot');return;}S.journal.unshift({plot,crop:$('jcrop').value,status:$('jstatus').value,note:$('jnote').value.trim()});S.journal=S.journal.slice(0,60);save();['jplot','jnote'].forEach(x=>$(x).value='');jr();toast('Plot logged');};
   $('jcrop').innerHTML=CROPS.map(c=>'<option>'+c.n+'</option>').join('');
   jr();
 },
 settings(){
   $('themeToggle').classList.toggle('on',theme()==='light');$('themeToggle').onclick=()=>{toggleTheme();$('themeToggle').classList.toggle('on',theme()==='light');};
   $('accents2').innerHTML=APP.accents.map((a,i)=>'<button class="ad'+(i===accentIdx()?' on':'')+'" data-i="'+i+'" data-press style="width:24px;height:24px;background:linear-gradient(135deg,'+a[0]+','+a[1]+')"></button>').join('');
   $('accents2').querySelectorAll('.ad').forEach(b=>b.onclick=()=>setAccent(+b.dataset.i));
   $('unitToggle').classList.toggle('on',S.units==='imperial');$('unitToggle').onclick=()=>{S.units=S.units==='imperial'?'metric':'imperial';save();$('unitToggle').classList.toggle('on',S.units==='imperial');toast('Units: '+S.units);};
   $('exp').onclick=()=>dl('agromind-data.json','application/json',JSON.stringify(S,null,2));
   $('imp').onclick=()=>$('impf').click();$('impf').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{S=Object.assign(S,JSON.parse(r.result));save();toast('Data imported');}catch(x){toast('Bad file');}};r.readAsText(f);};
   $('reset').onclick=()=>{if(confirm('Clear journal and plan?')){S.journal=[];S.plan=[];save();toast('Cleared');}};
   $('featlist').textContent=FEATURES+'.';
 }
};
/* crop detail modal */
function detail(name){const c=CROPS.find(x=>x.n===name);if(!c)return;
  if(!$('cropScrim'))document.body.insertAdjacentHTML('beforeend','<div class="scrim" id="cropScrim"><div class="modal"><h3><span id="cmTitle"></span><button class="close" data-press onclick="closeAll()">'+icon('close')+'</button></h3><div id="cmBody"></div></div></div>');
  $('cmTitle').textContent=c.n;
  $('cmBody').innerHTML='<div style="color:var(--mut);font-family:var(--mono);font-size:12px;margin-bottom:14px">'+c.fam+' · '+c.season+'-season</div>'+
   '<div class="metrics"><div class="metric"><div class="n"><em>'+spU(c.sp)+'</em></div><div class="l">plant spacing</div></div><div class="metric"><div class="n"><em>'+spU(c.row)+'</em></div><div class="l">row spacing</div></div><div class="metric"><div class="n"><em>'+c.dth+'</em></div><div class="l">days to harvest</div></div><div class="metric"><div class="n"><em>'+spU(c.depth)+'</em></div><div class="l">sow depth</div></div><div class="metric"><div class="n"><em>'+c.ph[0]+'–'+c.ph[1]+'</em></div><div class="l">soil pH</div></div><div class="metric"><div class="n"><em>'+c.water+'</em></div><div class="l">water · '+c.sun+' sun</div></div></div>'+
   '<div class="fld"><label>Good companions</label><div class="chips">'+c.comp.map(x=>'<span class="chip">'+x+'</span>').join('')+'</div></div>'+
   (c.avoid.length?'<div class="fld"><label>Avoid planting with</label><div class="chips">'+c.avoid.map(x=>'<span class="chip" style="color:var(--rose)">'+x+'</span>').join('')+'</div></div>':'')+
   '<div class="fld"><label>Notes</label><p style="color:var(--ink2);line-height:1.6">'+c.note+'</p></div>';
  $('cropScrim').classList.add('on');
}
