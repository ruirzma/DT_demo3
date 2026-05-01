import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function PulseNode({position}:{position:[number,number,number]}){ const r=useRef<THREE.Mesh>(null!); useFrame(({clock})=>{r.current.scale.setScalar(1+Math.sin(clock.elapsedTime*3)*0.2)}); return <mesh ref={r} position={position}><sphereGeometry args={[0.15,16,16]}/><meshStandardMaterial emissive="#00d9ff" color="#3ad7ff"/></mesh>}

export default function DigitalTwinScene({layer,selected,onSelect}:{layer:string;selected:string;onSelect:(z:string)=>void}){
  const zoneColors:Record<string,string>={"O₂ Layer":"#00d9ff",Temperature:'#ff7b2f',Humidity:'#32c5ff',Pollutant:'#9f5cff',Microbial:'#35ff90','Sensor Layout':'#00f5c8'};
  const zpos = useMemo(()=>[['Zone A',[-3,0.4,-1]],['Zone B',[0,0.5,0]],['Zone C',[3,0.4,0.5]],['Zone D',[0,0.4,2]]] as const,[]);
  return <Canvas camera={{position:[8,7,8],fov:45}}>
    <color attach="background" args={['#040b16']} />
    <ambientLight intensity={0.6}/><directionalLight position={[5,10,2]} intensity={1.2}/>
    <mesh position={[0,-0.2,0]}><boxGeometry args={[10,0.4,8]}/><meshStandardMaterial color="#2a221c"/></mesh>
    <mesh position={[0,-1.8,0]}><boxGeometry args={[10,3,8]}/><meshStandardMaterial color={zoneColors[layer]} transparent opacity={0.16}/></mesh>
    {zpos.map(([name,p])=><group key={name} position={p as any} onClick={()=>onSelect(name)}>
      <mesh><cylinderGeometry args={[1.4,1.4,0.12,40]}/><meshStandardMaterial color={selected===name?'#00f5c8':'#0f2634'} emissive={selected===name?'#00d9ff':'#000'} /></mesh>
      <Html distanceFactor={12}><div className='zone-label'>{name}</div></Html>
    </group>)}
    {[[-2,1,-2],[1,1,-1],[2,1.1,2],[-1,1,1],[3,1,0]].map((p,i)=><PulseNode key={i} position={p as any}/>) }
    <mesh position={[2.8,0.6,2.8]} onClick={()=>onSelect('Equipment')}><boxGeometry args={[1.2,1,0.8]}/><meshStandardMaterial color="#1c2f44"/></mesh>
    <Html position={[2.8,1.5,2.8]}><div className='zone-label'>AI Command Center</div></Html>
    <OrbitControls minDistance={7} maxDistance={15} maxPolarAngle={1.4}/>
  </Canvas>
}
