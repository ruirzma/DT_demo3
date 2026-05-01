export const pages = ['Home','Site Twin','Subsurface','AI Control','Equipment','Simulation','Reports'] as const;
export const layers = ['O₂ Layer','Temperature','Humidity','Pollutant','Microbial','Sensor Layout'] as const;
export const viewModes = ['3D View','Split View','Dashboard View'] as const;
export const phases = ['Phase 1 Initial Assessment','Phase 2 Active Remediation','Phase 3 Stabilization','Phase 4 Post-Closure'] as const;
export const scenarios = ['Baseline','Manual Control','AI-Assisted','AI-Optimized','Fault Scenario'] as const;

export const zones = [
{id:'Zone A',oxygen:13.4,temperature:37.8,humidity:43.2,pH:7.2,degradationRate:0.72,stabilizationIndex:0.66,pollutantConcentration:0.34,microbialActivity:0.69,risk:'Low',status:'Normal',activeWells:'10 / 12'},
{id:'Zone B',oxygen:8.7,temperature:45.2,humidity:41.3,pH:6.8,degradationRate:0.68,stabilizationIndex:0.62,pollutantConcentration:0.52,microbialActivity:0.58,risk:'Medium',status:'Aerating',activeWells:'12 / 14'},
{id:'Zone C',oxygen:11.5,temperature:63.2,humidity:38.1,pH:7.5,degradationRate:0.54,stabilizationIndex:0.51,pollutantConcentration:0.71,microbialActivity:0.44,risk:'High',status:'Warning',activeWells:'9 / 12'},
{id:'Zone D',oxygen:15.1,temperature:35.9,humidity:46.7,pH:7.1,degradationRate:0.75,stabilizationIndex:0.71,pollutantConcentration:0.28,microbialActivity:0.73,risk:'Low',status:'Normal',activeWells:'11 / 12'},
] as const;

export const sensors = Array.from({length:20}).map((_,i)=>({id:`S-${(i+1).toString().padStart(2,'0')}`,type:['oxygen','temperature','humidity','pH','gas','leachate'][i%6],zone:['Zone A','Zone B','Zone C','Zone D'][i%4],status:i%9===0?'warning':'online',value:+(8+Math.random()*60).toFixed(1),unit:i%6===1?'°C':'%',position:[(i%5)*1.8-3.5,0.9,Math.floor(i/5)*1.2-2] as [number,number,number],lastUpdate:'10:23:45'}));

export const equipment = [
{id:'EQ-01',name:'Control Cabinet Online',type:'cabinet',status:'online',zone:'Zone B',power:97,flowRate:0,position:[2.8,0.5,2.8]},
{id:'EQ-02',name:'Fan Unit 01 Running',type:'fan',status:'running',zone:'Zone B',power:82,flowRate:48,position:[2.2,0.5,2.1]},
{id:'EQ-03',name:'Fan Unit 02 Standby',type:'fan',status:'standby',zone:'Zone C',power:43,flowRate:24,position:[3.2,0.5,2.1]},
{id:'EQ-04',name:'Valve Group A Open',type:'valve',status:'open',zone:'Zone A',power:75,flowRate:31,position:[1.7,0.4,1.6]},
{id:'EQ-05',name:'Valve Group B Adjusting',type:'valve',status:'adjusting',zone:'Zone C',power:69,flowRate:28,position:[2.9,0.4,1.7]},
{id:'EQ-06',name:'Gateway Connected',type:'gateway',status:'connected',zone:'Zone B',power:99,flowRate:0,position:[3.4,1.0,3.4]},
] as const;

export const alerts = [
{title:'High Temperature in Zone C',desc:'Average 63.2 °C exceeds threshold.',time:'10:21 AM',zone:'Zone C'},
{title:'Low O₂ in Zone B',desc:'Average 8.7% is below target range.',time:'10:20 AM',zone:'Zone B'},
{title:'Leachate Level Rising in MW-12',desc:'Level increased by 15% in 24h.',time:'10:18 AM',zone:'Zone B'},
];

export const aiRecommendations = ['Increase aeration in Zone B by 12%','Inspect MW-12 leachate level','Reduce temperature risk in Zone C','Maintain current aeration in Zone A'];
