import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer, XAxis } from 'recharts';
import DigitalTwinScene from './components/three/DigitalTwinScene';
import { aiRecommendations, alerts, equipment, layers, pages, phases, scenarios, sensors, viewModes, zones } from './data/mockData';
import './styles/globals.css';

const scenarioKpi={Baseline:{progress:58,risk:'Medium'},'Manual Control':{progress:61,risk:'Medium'},'AI-Assisted':{progress:64.2,risk:'Low'},'AI-Optimized':{progress:69.4,risk:'Low'},'Fault Scenario':{progress:47.8,risk:'High'}} as const;

export default function App(){
const [activePage,setActivePage]=useState<(typeof pages)[number]>('Home');
const [activeLayer,setActiveLayer]=useState<(typeof layers)[number]>('O₂ Layer');
const [viewMode,setViewMode]=useState<(typeof viewModes)[number]>('3D View');
const [selectedZone,setSelectedZone]=useState('Zone B'); const [selectedSensor,setSelectedSensor]=useState('S-02');
const [activePhase,setActivePhase]=useState<(typeof phases)[number]>(phases[1]); const [activeScenario,setActiveScenario]=useState<(typeof scenarios)[number]>('AI-Assisted');
const [operationMode,setOperationMode]=useState<'Manual Mode'|'AI Auto Mode'>('AI Auto Mode'); const [isPlaying,setIsPlaying]=useState(true); const [speed,setSpeed]=useState(1);
const [currentTime,setCurrentTime]=useState(10.4); const [appliedRecommendation,setAppliedRecommendation]=useState(false); const [toastMessage,setToastMessage]=useState('');
const [pulseSignal,setPulseSignal]=useState(false); const [chartSeed,setChartSeed]=useState(0);

const pushToast=(m:string)=>{setToastMessage(m);setTimeout(()=>setToastMessage(''),2200)};
useEffect(()=>{const i=setInterval(()=>{if(!isPlaying) return; setCurrentTime(t=>(t+0.02*speed)%24); setChartSeed(s=>s+1)},1200);return()=>clearInterval(i)},[isPlaying,speed]);
const chart=useMemo(()=>[{t:'00:00',v:10.2},{t:'06:00',v:11.4},{t:'12:00',v:12.2},{t:'18:00',v:11.8}].map((d,i)=>({...d,v:+(d.v+Math.sin((chartSeed+i)/2)*0.8).toFixed(2)})),[chartSeed]);
const zone=zones.find(z=>z.id===selectedZone)??zones[1]; const kpi=scenarioKpi[activeScenario];
const applyRec=()=>{setAppliedRecommendation(true);setPulseSignal(true);setTimeout(()=>setPulseSignal(false),1200);pushToast('AI recommendation applied successfully.');};

const rightPanel=()=>{
if(activePage==='Site Twin') return <div className='panelStack'><div className='card'><h3>Zone Overview</h3>{zones.map(z=><button key={z.id} className='rowBtn' onClick={()=>setSelectedZone(z.id)}>{z.id} · O₂ {z.oxygen}% · {z.status}</button>)}</div><div className='card'><h3>Sensor Distribution</h3><p>{sensors.length} nodes active across 4 zones.</p><p>Selected Sensor: {selectedSensor}</p></div></div>;
if(activePage==='Subsurface') return <div className='panelStack'><div className='card'><h3>Active Layer Metrics: {activeLayer}</h3><p>Depth range: 0m to -50m</p><p>Pollutant gradient: 0.71 peak at -30m</p></div><div className='card'><h3>Environmental Gradient Summary</h3><p>O₂ diffusion improving in Zone B.</p><p>Thermal hotspot remains in Zone C.</p></div></div>;
if(activePage==='AI Control') return <div className='panelStack'><div className='card'><h3>AI Model Status</h3><p>Confidence: 92%</p><p>Predicted O₂ (6h): 8.3%</p><p>Predicted degradation: 0.74 1/day</p></div><div className='card'><h3>Recommended Actions</h3>{aiRecommendations.map(r=><p key={r}>• {r}</p>)}<button onClick={applyRec}>Apply Recommendation</button></div></div>;
if(activePage==='Equipment') return <div className='panelStack'><div className='card'><h3>Equipment Status</h3>{equipment.map(e=><p key={e.id}>• {e.name}</p>)}</div><div className='card'><h3>Communication Health</h3><p>Gateway latency: 24 ms</p><p>Device packet success: 99.1%</p></div></div>;
if(activePage==='Simulation') return <div className='panelStack'><div className='card'><h3>Scenario Description</h3><p>{activeScenario}: {activeScenario==='Baseline'?'No intelligent control.':activeScenario==='Fault Scenario'?'Sensor and equipment faults simulated.':'Adaptive control active.'}</p></div><div className='card'><h3>Scenario KPI Comparison</h3><p>Progress: {kpi.progress}%</p><p>Risk: {kpi.risk}</p></div></div>;
if(activePage==='Reports') return <div className='panelStack'><div className='card'><h3>Reports</h3><p>Remediation Progress: 64.2%</p><p>Pollutant Reduction: 48.5%</p><p>Average Stabilization Index: 0.62</p><p>Energy Consumption: 1,284 kWh</p><p>System Uptime: 99.1%</p><p>Predicted Completion: 142 days</p><button onClick={()=>pushToast('Daily report exported.')}>Export Daily Report</button><button onClick={()=>pushToast('Weekly report exported.')}>Export Weekly Report</button><button onClick={()=>pushToast('Technical summary generated.')}>Generate Technical Summary</button></div></div>
return <div className='panelStack'><div className='card'><h3>System Status</h3><p className='ok'>All Systems Operational</p><p>Sensors: 187 / 190</p><p>Equipment: 32 / 32</p><p>Wells: 124 / 128</p></div><div className='card'><h3>AI Recommendation</h3><h4>Increase aeration in Zone B by 12%</h4><p>AI model predicts O₂ below optimal range within 6 hours</p><button onClick={applyRec}>{appliedRecommendation?'Applied':'Apply Recommendation'}</button><button>View Analysis</button></div><div className='card'><h3>Alerts</h3>{alerts.map(a=><div key={a.title} className='alert' onClick={()=>setSelectedZone(a.zone)}><b>{a.title}</b><p>{a.desc}</p></div>)}</div></div>
}

return <div className='app2'>
<header className='top'><div className='title'>AI-Driven Digital Twin for Aerobic Landfill Remediation and Rapid Stabilization</div><nav>{pages.map(p=><button key={p} className={activePage===p?'active':''} onClick={()=>setActivePage(p)}>{p}</button>)}</nav></header>
<section className='kpis'>{[['Sensor Online Rate','98.6%'],['Remediation Progress',`${kpi.progress}%`],['Average O₂','12.4%'],['Average Temperature','38.7 °C'],['Average Humidity','42.1%'],['Risk Score',kpi.risk]].map(k=><div key={k[0]} className='card'><p>{k[0]}</p><h2>{k[1]}</h2></div>)}</section>
<div className='mainGrid'>
<aside className='left'>{viewModes.map(v=><button key={v} className={viewMode===v?'active side':'side'} onClick={()=>setViewMode(v)}>{v}</button>)}{layers.map(l=><button key={l} className={activeLayer===l?'active side':'side'} onClick={()=>setActiveLayer(l)}>{l}</button>)}</aside>
<div className={viewMode==='Dashboard View'?'center small':'center'}>
<DigitalTwinScene activeLayer={activeLayer} activePage={activePage} selectedZone={selectedZone} onZoneSelect={setSelectedZone} onSensorSelect={setSelectedSensor} pulseSignal={pulseSignal}/>
<div className='zonecard'><b>{zone.id}</b><p>Status: {zone.status}</p><p>Avg O₂: {zone.oxygen}%</p><p>Temperature: {zone.temperature} °C</p><p>Humidity: {zone.humidity}%</p><p>Degradation Rate: {zone.degradationRate} 1/day</p><p>Stabilization Index: {zone.stabilizationIndex}</p><p>Active Wells: {zone.activeWells}</p></div>
{activePage==='AI Control' && <div className='overlay'>Sensor Input → Data Processing → AI Prediction → Strategy Generation → Control Execution → Feedback</div>}
{activePage==='Simulation' && <div className='overlay'>{scenarios.map(s=><button key={s} className={activeScenario===s?'active':''} onClick={()=>{setActiveScenario(s);pushToast(`Scenario switched to ${s}.`)}}>{s}</button>)}</div>}
</div>
<motion.aside key={activePage} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} className='right'>{rightPanel()}<div className='card charts'><h3>{activeLayer} Trends</h3><ResponsiveContainer width='100%' height={140}><AreaChart data={chart}><XAxis dataKey='t'/><Area type='monotone' dataKey='v' stroke='#00d9ff' fill='rgba(0,217,255,0.2)'/></AreaChart></ResponsiveContainer></div></motion.aside>
</div>
<footer className='bottom'><div><button onClick={()=>setIsPlaying(!isPlaying)}>{isPlaying?'Pause':'Play'}</button><select value={speed} onChange={e=>setSpeed(+e.target.value)}><option value={1}>1x</option><option value={2}>2x</option><option value={5}>5x</option></select></div><div>May 20, 2025 {String(Math.floor(currentTime)).padStart(2,'0')}:{String(Math.floor((currentTime%1)*60)).padStart(2,'0')} <input type='range' min={0} max={24} step={0.01} value={currentTime} onChange={e=>setCurrentTime(+e.target.value)} /></div><div>{phases.map(p=><button key={p} className={activePhase===p?'active':''} onClick={()=>{setActivePhase(p);pushToast(`Phase changed: ${p}`)}}>{p}</button>)}</div><div><button className={operationMode==='Manual Mode'?'active':''} onClick={()=>{setOperationMode('Manual Mode');pushToast('Manual mode activated.')}}>Manual Mode</button><button className={operationMode==='AI Auto Mode'?'active':''} onClick={()=>{setOperationMode('AI Auto Mode');pushToast('AI Auto mode activated.')}}>AI Auto Mode</button></div></footer>
{operationMode==='Manual Mode' && <div className='manual card'><p>Aeration Intensity</p><input type='range'/><p>Moisture Injection</p><input type='range'/><p>Monitoring Frequency</p><input type='range'/></div>}
<AnimatePresence>{toastMessage && <motion.div className='toast' initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}}>{toastMessage}</motion.div>}</AnimatePresence>
</div>
}
