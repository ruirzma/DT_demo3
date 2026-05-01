import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Line, OrbitControls, Tube } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { sensors } from '../../data/mockData';

type Props={activeLayer:string;activePage:string;selectedZone:string;onZoneSelect:(z:string)=>void;onSensorSelect:(id:string)=>void;pulseSignal:boolean}
const zonePos:{[k:string]:[number,number,number]}={'Zone A':[-2.7,0.5,-0.6],'Zone B':[0,0.6,0.2],'Zone C':[2.8,0.5,0.7],'Zone D':[0,0.5,2.1]};

function Fan({p}:{p:[number,number,number]}){const r=useRef<THREE.Mesh>(null!);useFrame(({clock})=>{r.current.rotation.y=clock.elapsedTime*4});return <mesh ref={r} position={p}><cylinderGeometry args={[0.25,0.25,0.1,16]}/><meshStandardMaterial color="#6fd7ff"/></mesh>}
function Pulse({p,color='#00d9ff'}:{p:[number,number,number],color?:string}){const m=useRef<THREE.Mesh>(null!);useFrame(({clock})=>{const s=1+Math.sin(clock.elapsedTime*4+p[0])*0.3;m.current.scale.setScalar(s)});return <mesh ref={m} position={p}><sphereGeometry args={[0.08,12,12]}/><meshStandardMaterial color={color} emissive={color}/></mesh>}

export default function DigitalTwinScene(props:Props){
  const layerColor={ 'O₂ Layer':'#00d9ff', Temperature:'#ff6e3d', Humidity:'#29c5ff', Pollutant:'#a855f7', Microbial:'#4ade80', 'Sensor Layout':'#7df9ff'}[props.activeLayer]||'#00d9ff';
  const cameraPos= props.activePage==='Subsurface' ? [7,4,5] : props.activePage==='Equipment' ? [6,5,9] : [9,7,9];
  const wells=useMemo(()=>Array.from({length:16}).map((_,i)=>[(i%4)*2.1-3.1,0.3,Math.floor(i/4)*1.5-2.2] as [number,number,number]),[]);
  const curve=useMemo(()=>new THREE.CatmullRomCurve3([new THREE.Vector3(2.8,0.3,2.8),new THREE.Vector3(1,0.2,1),new THREE.Vector3(0,0.2,0),new THREE.Vector3(-2,0.2,-1)]),[]);
  return <Canvas camera={{position:cameraPos as [number,number,number],fov:44}}>
    <color attach='background' args={['#030914']}/><ambientLight intensity={0.55}/><directionalLight intensity={1.1} position={[5,10,6]}/><pointLight position={[0,3,0]} color={layerColor} intensity={1.4}/>
    <mesh position={[0,0,0]}><sphereGeometry args={[5.2,64,64,0,Math.PI*2,0,Math.PI/2.5]}/><meshStandardMaterial color='#2f281f' roughness={1}/></mesh>
    <mesh position={[0,-1.8,0]}><boxGeometry args={[11,3.2,8.4]}/><meshStandardMaterial color={layerColor} transparent opacity={0.14}/></mesh>
    {['#75523a','#97653f','#7f7b34','#7d3a58','#2f6f44'].map((c,i)=><mesh key={i} position={[0,-0.6-(i*0.52),0]}><boxGeometry args={[10.6,0.45,8.1]}/><meshStandardMaterial color={c} transparent opacity={0.26}/></mesh>)}
    {[0,-10,-20,-30,-40,-50].map((d,i)=><Html key={d} position={[-5.1,-0.1-i*0.5,-3.9]}><div className='depth'>{d} m</div></Html>)}
    {Object.entries(zonePos).map(([z,p])=><group key={z} position={p} onClick={()=>props.onZoneSelect(z)}><mesh><ringGeometry args={[1.1,1.25,64]}/><meshBasicMaterial color={props.selectedZone===z?'#00f5c8':'#00d9ff'} /></mesh><Html><div className='zone-label'>{z}</div></Html></group>)}
    {wells.map((p,i)=><group key={i} position={p}><mesh position={[0,-1.2,0]}><cylinderGeometry args={[0.06,0.06,2.6,10]}/><meshStandardMaterial color='#9ab4c9'/></mesh><Pulse p={[p[0],0.2,p[2]]} color={i%3===0?'#00f5c8':'#00d9ff'}/></group>)}
    <Tube args={[curve,64,0.06,8,false]}><meshStandardMaterial color='#1e88ff' emissive='#1e88ff'/></Tube>
    {sensors.map(s=><group key={s.id} position={s.position} onClick={()=>props.onSensorSelect(s.id)}><Pulse p={[0,0,0]} color={props.activeLayer==='Sensor Layout'?'#7df9ff':'#3ab8ff'}/>{props.activeLayer==='Sensor Layout' && <Html position={[0,0.2,0]}><div className='sensor-tag'>{s.id}</div></Html>}</group>)}
    <mesh position={[2.8,0.55,2.9]}><boxGeometry args={[1.6,0.9,1.1]}/><meshStandardMaterial color='#1f3245'/></mesh>
    <mesh position={[2.8,1.2,2.9]}><boxGeometry args={[0.8,0.2,0.6]}/><meshStandardMaterial color='#334e6b'/></mesh>
    <Html position={[2.8,1.8,2.9]}><div className='zone-label'>CONTROL ROOM<br/>AI COMMAND CENTER</div></Html>
    <Fan p={[2.1,0.5,2.2]}/><Fan p={[3.3,0.5,2.2]}/>
    <mesh position={[-3.6,0.25,2.8]}><boxGeometry args={[0.8,0.3,0.35]}/><meshStandardMaterial color='#c0843d'/></mesh>
    <mesh position={[-2.6,0.22,3.1]}><boxGeometry args={[0.6,0.22,0.32]}/><meshStandardMaterial color='#888'/></mesh>
    {[[-2.9,0.3,2.4],[-2.4,0.3,2.5],[-2.1,0.3,2.3]].map((p,i)=><mesh key={i} position={p as any}><cylinderGeometry args={[0.04,0.05,0.23,8]}/><meshStandardMaterial color='#eab308'/></mesh>)}
    {props.pulseSignal && <Line points={[[2.8,1.1,2.9],[1,1,1],[0,0.8,0.2]]} color='#00d9ff' lineWidth={3}/>}<OrbitControls minDistance={6} maxDistance={15} maxPolarAngle={1.45}/>
  </Canvas>
}
