import { useEffect, useMemo, useState } from 'react';
import { Bell, HelpCircle, Search, UserCircle2 } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, XAxis } from 'recharts';
import { alerts, layers, phases, tabs, zones } from './data/mockData';
import DigitalTwinScene from './components/three/DigitalTwinScene';

const base=[{t:'00:00',v:11},{t:'06:00',v:10},{t:'12:00',v:13},{t:'18:00',v:12}];
export default function App(){
  const [tab,setTab]=useState<(typeof tabs)[number]>('Home'); const [layer,setLayer]=useState<(typeof layers)[number]>('O₂ Layer');
  const [selected,setSelected]=useState('Zone B'); const [mode,setMode]=useState('AI Auto Mode'); const [phase,setPhase]=useState(phases[1]);
  const [playing,setPlaying]=useState(true); const [progress,setProgress]=useState(64.2); const [o2b,setO2b]=useState(8.7); const [toast,setToast]=useState('');
  useEffect(()=>{const id=setInterval(()=>{if(!playing) return; setProgress(p=>Math.min(99,p+0.02)); setO2b(v=>Math.max(8,v+(Math.random()-0.45)*0.08));},1200);return()=>clearInterval(id)},[playing]);
  const chart=useMemo(()=>base.map(x=>({...x,v:+(x.v+(Math.random()-0.5)).toFixed(2)})),[playing,layer,tab]);
  const selectedZone=zones.find(z=>z.id===selected)??zones[1];
  return <div className='app'>
    <header className='top'>{/* nav */}<div className='title'>AI-Driven Digital Twin for<br/>Aerobic Landfill Remediation and Rapid Stabilization</div><nav>{tabs.map(t=><button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}>{t}</button>)}</nav><div className='icons'><Search/><Bell/><HelpCircle/><UserCircle2/>Engineer</div></header>
    <section className='kpis'>{[['Sensor Online Rate','98.6%','187 / 190 Online'],['Remediation Progress',`${progress.toFixed(1)}%`,'+3.6% vs last week'],['Average O₂','12.4%','Target: 10–18%'],['Average Temperature','38.7 °C','Target: < 60 °C'],['Average Humidity','42.1%','Target: 30–60%'],['Risk Score','Low','2.3 / 10']].map(k=><div key={k[0]} className='card'><h4>{k[0]}</h4><h2>{k[1]}</h2><p>{k[2]}</p></div>)}</section>
    <main className='main'><aside className='left'><h4>View Mode</h4>{['3D View','Split View','Dashboard View'].map(v=><button key={v} className='side'>{v}</button>)}<h4>Layers</h4>{layers.map(l=><button key={l} className={layer===l?'side active':''} onClick={()=>setLayer(l)}>{l}</button>)}<div className='weather'>24 °C Cloudy<br/>Wind: 6.2 m/s NE<br/>Last Update: 10:23:45</div></aside>
    <section className='center'><DigitalTwinScene layer={layer} selected={selected} onSelect={(z)=>{if(z==='Equipment') setTab('Equipment'); else setSelected(z)}}/>{selectedZone && <div className='zonecard'><b>{selectedZone.id}</b><p>Avg O₂: {selectedZone.id==='Zone B'?o2b.toFixed(1):selectedZone.o2}%</p><p>Temperature: {selectedZone.temperature} °C</p><p>Humidity: {selectedZone.humidity}%</p><p>Degradation Rate: {selectedZone.degradation} 1/day</p><p>Stabilization Index: {selectedZone.stabilization}</p><button>View Details</button></div>}</section>
    <aside className='right'><div className='card'><h3>System Status</h3><p className='ok'>All Systems Operational</p><p>Sensors: 187 / 190</p><p>Equipment: 32 / 32</p></div>
    <div className='card'><h3>AI Recommendation</h3><h4>Increase aeration in Zone B by 12%</h4><p>AI model predicts O₂ below optimal range within 6 hours based on current trends and weather forecast.</p><button onClick={()=>{setToast('AI recommendation applied successfully.');setTimeout(()=>setToast(''),1800);setO2b(v=>v+0.5)}}>Apply Recommendation</button><button>View Analysis</button></div>
    <div className='card'><h3>Alerts - 3 Active</h3>{alerts.map(a=><div key={a.title} className='alert' onClick={()=>setSelected(a.zone)}><b>{a.title}</b><p>{a.desc}</p><small>{a.time}</small></div>)}</div>
    <div className='card charts'>{['O₂ (%)','Temperature (°C)','Degradation Rate (1/day)','Stabilization Index'].map(name=><div key={name}><small>{name}</small><ResponsiveContainer width='100%' height={80}><AreaChart data={chart}><XAxis dataKey='t' hide/><Area type='monotone' dataKey='v' stroke='#00d9ff' fill='rgba(0,217,255,0.2)'/></AreaChart></ResponsiveContainer></div>)}</div></aside></main>
    <footer className='bottom'><div><button>⏮</button><button onClick={()=>setPlaying(!playing)}>{playing?'⏸':'▶'}</button><button>⏭</button> 1x</div><div>May 20, 2025 10:23:45 <span className='live'>LIVE</span> <input type='range' min={0} max={24}/></div><div>{phases.map(p=><button key={p} onClick={()=>setPhase(p)} className={phase===p?'active':''}>{p}</button>)}</div><div><button onClick={()=>setMode('Manual Mode')} className={mode==='Manual Mode'?'active':''}>Manual Mode</button><button onClick={()=>setMode('AI Auto Mode')} className={mode==='AI Auto Mode'?'active':''}>AI Auto Mode</button></div></footer>
    {mode==='Manual Mode' && <div className='manual card'>Aeration Intensity<input type='range'/>Moisture Injection<input type='range'/>Monitoring Frequency<input type='range'/></div>}
    {tab==='AI Control' && <div className='overlay card'>Sensor Input → Data Processing → AI Prediction → Strategy Generation → Control Execution → Feedback</div>}
    {tab==='Simulation' && <div className='overlay card'>Baseline | Manual Control | AI-Assisted | AI-Optimized | Fault Scenario</div>}
    {tab==='Reports' && <div className='overlay card'>Remediation Progress: 64.2% | Pollutant Reduction: 48.5% | Energy Consumption: 1,284 kWh <button>Export Daily Report</button> <button>Export Weekly Report</button> <button>Generate Technical Summary</button></div>}
    {toast && <div className='toast'>{toast}</div>}
  </div>
}
