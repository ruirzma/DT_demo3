import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Line, OrbitControls, Tube } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { sensors } from '../../data/mockData';

type Props={activeLayer:string;activePage:string;selectedZone:string;onZoneSelect:(z:string)=>void;onSensorSelect:(id:string)=>void;pulseSignal:boolean}
const zonePos:{[k:string]:[number,number,number]}={'Zone A':[-2.9,0.55,-0.8],'Zone B':[0.1,0.62,0.2],'Zone C':[2.9,0.55,0.8],'Zone D':[0.2,0.52,2.2]};

function Fan({p}:{p:[number,number,number]}){const r=useRef<THREE.Mesh>(null!);useFrame(({clock})=>{r.current.rotation.y=clock.elapsedTime*5});return <mesh ref={r} position={p}><cylinderGeometry args={[0.26,0.26,0.09,24]}/><meshStandardMaterial color="#8ecae6" metalness={0.6} roughness={0.25}/></mesh>}
function Pulse({p,color='#00d9ff'}:{p:[number,number,number],color?:string}){const m=useRef<THREE.Mesh>(null!);useFrame(({clock})=>{const s=1+Math.sin(clock.elapsedTime*4+p[0])*0.35;m.current.scale.setScalar(s)});return <mesh ref={m} position={p}><sphereGeometry args={[0.085,14,14]}/><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8}/></mesh>}
function FlowDots({color}:{color:string}){const g=useRef<THREE.Group>(null!);useFrame(({clock})=>{g.current.children.forEach((c,i)=>{c.position.y=((clock.elapsedTime*0.35+i*0.3)%1.8)-1.1})});return <group ref={g}>{Array.from({length:18}).map((_,i)=><mesh key={i} position={[-2.5+(i%6),-1, -2+(Math.floor(i/6))*2]}><sphereGeometry args={[0.03,8,8]}/><meshStandardMaterial color={color} emissive={color}/></mesh>)}</group>}

export default function DigitalTwinScene(props:Props){
  const layerColor={ 'O₂ Layer':'#36c8ff', Temperature:'#ff7a3d', Humidity:'#34c6c2', Pollutant:'#9f5cff', Microbial:'#50d66f', 'Sensor Layout':'#7df9ff'}[props.activeLayer]||'#36c8ff';
  const cameraPos= props.activePage==='Subsurface' ? [7,4.1,5] : props.activePage==='Equipment' ? [6.1,5.2,8.8] : [8.8,6.6,9.2];
  const wells=useMemo(()=>Array.from({length:16}).map((_,i)=>[(i%4)*2.1-3.2,0.3,Math.floor(i/4)*1.5-2.3] as [number,number,number]),[]);
  const mainPipe=useMemo(()=>new THREE.CatmullRomCurve3([new THREE.Vector3(2.8,0.22,2.8),new THREE.Vector3(1.8,0.24,1.6),new THREE.Vector3(0,0.22,0.4),new THREE.Vector3(-2.2,0.22,-1.2)]),[]);
  const ringRoad=useMemo(()=>new THREE.EllipseCurve(0,0,4.8,3.4,0,2*Math.PI).getPoints(120).map(p=>new THREE.Vector3(p.x,0.06,p.y)),[]);

  return <Canvas camera={{position:cameraPos as [number,number,number],fov:42}} shadows>
    <color attach='background' args={['#06101b']}/>
    <fog attach='fog' args={['#07111a',8,20]}/>
    <ambientLight intensity={0.45}/><directionalLight intensity={1.2} position={[7,10,6]} castShadow/><pointLight position={[0,3,0]} color={layerColor} intensity={1.3}/>

    <mesh position={[0,-0.05,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[18,14,60,60]}/><meshStandardMaterial color='#1c2b2a' roughness={0.95}/></mesh>
    <mesh position={[0,0.03,0]} receiveShadow castShadow><sphereGeometry args={[5.3,80,80,0,Math.PI*2,0,Math.PI/2.6]}/><meshStandardMaterial color='#3d3327' roughness={0.88} metalness={0.05}/></mesh>
    <Line points={ringRoad as any} color="#6f7d88" lineWidth={1.2} />

    <mesh position={[0,-1.9,0]}><boxGeometry args={[11.2,3.4,8.6]}/><meshStandardMaterial color={layerColor} transparent opacity={0.08}/></mesh>
    {['#8f6f4f','#936845','#6f7536','#71405f','#2f714e'].map((c,i)=><mesh key={i} position={[0,-0.62-(i*0.54),0]}><boxGeometry args={[10.8,0.46,8.2]}/><meshStandardMaterial color={c} transparent opacity={0.3}/></mesh>)}
    {[0,-10,-20,-30,-40,-50].map((d,i)=><Html key={d} position={[-5.15,-0.1-i*0.52,-3.92]}><div className='depth'>{d} m</div></Html>)}

    {Object.entries(zonePos).map(([z,p])=><group key={z} position={p} onClick={()=>props.onZoneSelect(z)}><mesh rotation={[-Math.PI/2,0,0]}><ringGeometry args={[1.1,1.24,64]}/><meshBasicMaterial color={props.selectedZone===z?'#52e5ff':'#5ac5d8'} /></mesh><Html><div className='zone-label'>{z}</div></Html></group>)}

    {wells.map((p,i)=><group key={i} position={p}><mesh position={[0,-1.22,0]} castShadow><cylinderGeometry args={[0.06,0.06,2.7,12]}/><meshStandardMaterial color='#93a8b9' metalness={0.35}/></mesh><Pulse p={[p[0],0.2,p[2]]} color={i%3===0?'#65f4d2':'#7dd3fc'}/></group>)}
    <Tube args={[mainPipe,80,0.06,10,false]}><meshStandardMaterial color='#3ea2ff' emissive='#2f8cff' emissiveIntensity={0.8}/></Tube>

    {sensors.map(s=><group key={s.id} position={s.position} onClick={()=>props.onSensorSelect(s.id)}><Pulse p={[0,0,0]} color={props.activeLayer==='Sensor Layout'?'#a2f2ff':'#76c7de'}/>{props.activeLayer==='Sensor Layout' && <Html position={[0,0.22,0]}><div className='sensor-tag'>{s.id}</div></Html>}</group>)}

    <mesh position={[2.8,0.55,2.9]} castShadow><boxGeometry args={[1.8,0.95,1.2]}/><meshStandardMaterial color='#293b4e' metalness={0.25}/></mesh>
    <mesh position={[2.8,1.2,2.9]}><boxGeometry args={[0.9,0.2,0.7]}/><meshStandardMaterial color='#425d75'/></mesh>
    <Html position={[2.8,1.85,2.9]}><div className='zone-label'>CONTROL ROOM<br/>AI COMMAND CENTER</div></Html>
    <Fan p={[2.1,0.5,2.2]}/><Fan p={[3.3,0.5,2.2]} />
    <mesh position={[2.2,0.28,3.5]}><boxGeometry args={[0.7,0.45,0.4]}/><meshStandardMaterial color='#505f66'/></mesh>
    <mesh position={[3.45,0.32,3.2]}><cylinderGeometry args={[0.22,0.22,0.65,16]}/><meshStandardMaterial color='#5e6f73'/></mesh>

    <mesh position={[-3.7,0.24,2.8]}><boxGeometry args={[0.9,0.33,0.38]}/><meshStandardMaterial color='#b47635'/></mesh>
    <mesh position={[-2.7,0.21,3.12]}><boxGeometry args={[0.62,0.24,0.32]}/><meshStandardMaterial color='#8b8b8b'/></mesh>
    {[[-3.0,0.3,2.4],[-2.5,0.3,2.5],[-2.2,0.3,2.3]].map((p,i)=><mesh key={i} position={p as any}><cylinderGeometry args={[0.04,0.05,0.25,8]}/><meshStandardMaterial color='#f2d15f'/></mesh>)}

    {props.activeLayer==='O₂ Layer' && <FlowDots color='#43d0ff'/>}
    {props.activeLayer==='Pollutant' && <FlowDots color='#b076ff'/>}
    {props.activeLayer==='Microbial' && <FlowDots color='#7fe28f'/>}
    {props.pulseSignal && <Line points={[[2.8,1.1,2.9],[1.2,1.0,1.5],[0,0.8,0.2]]} color='#42d7ff' lineWidth={3}/>}    
    <OrbitControls minDistance={6} maxDistance={15} maxPolarAngle={1.45}/>
  </Canvas>
}
