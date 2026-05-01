export const tabs = ['Home','Site Twin','Subsurface','AI Control','Equipment','Simulation','Reports'] as const;
export const layers = ['O₂ Layer','Temperature','Humidity','Pollutant','Microbial','Sensor Layout'] as const;
export const phases = ['Phase 1 Initial Assessment','Phase 2 Active Remediation','Phase 3 Stabilization','Phase 4 Post-Closure'] as const;
export const zones = [
{ id:'Zone A', o2:13.4, temperature:37.8, humidity:43.2, pH:7.2, degradation:0.72, stabilization:0.66, risk:'Low', status:'Normal'},
{ id:'Zone B', o2:8.7, temperature:45.2, humidity:41.3, pH:6.8, degradation:0.68, stabilization:0.62, risk:'Medium', status:'Aerating'},
{ id:'Zone C', o2:11.5, temperature:63.2, humidity:38.1, pH:7.5, degradation:0.54, stabilization:0.51, risk:'High', status:'Warning'},
{ id:'Zone D', o2:15.1, temperature:35.9, humidity:46.7, pH:7.1, degradation:0.75, stabilization:0.71, risk:'Low', status:'Normal'},
]
export const alerts = [
{title:'High Temperature in Zone C',desc:'Average 63.2 °C exceeds threshold.',time:'10:21 AM',zone:'Zone C'},
{title:'Low O₂ in Zone B',desc:'Average 8.7% is below target range.',time:'10:20 AM',zone:'Zone B'},
{title:'Leachate Level Rising in MW-12',desc:'Level increased by 15% in 24h.',time:'10:18 AM',zone:'Zone B'},
]
