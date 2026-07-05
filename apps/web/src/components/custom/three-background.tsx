"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useState } from "react";
import * as THREE from "three";
import { PerformanceMonitor } from "@react-three/drei";

function Terrain({ detailed }: { detailed: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Lower geometry resolution if detailed is false
  const segments = detailed ? 64 : 32;
  const geometry = useMemo(() => new THREE.PlaneGeometry(30, 30, segments, segments), [segments]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const positions = meshRef.current.geometry.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = Math.sin(x * 0.3 + time * 0.5) * Math.cos(y * 0.3 + time * 0.5) * 1.5;
      positions.setZ(i, z);
    }
    positions.needsUpdate = true;
    
    meshRef.current.rotation.z = time * 0.05;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -4, -10]}>
      <meshBasicMaterial 
        color="#8b5cf6" 
        wireframe 
        transparent 
        opacity={0.3} 
      />
    </mesh>
  );
}

function Fragments({ detailed }: { detailed: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = detailed ? 150 : 50;

  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const fragmentsData = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10 - 5
      ],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ],
      speed: Math.random() * 0.02 + 0.005,
      spin: Math.random() * 0.02 - 0.01,
    }));
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    fragmentsData.forEach((data, i) => {
      // Drift upwards and rotate
      const y = data.position[1] + (time * data.speed * 20) % 30 - 15;
      
      dummy.position.set(data.position[0], y, data.position[2]);
      dummy.rotation.set(
        data.rotation[0] + time * data.spin,
        data.rotation[1] + time * data.spin,
        data.rotation[2] + time * data.spin
      );
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {/* Small rectangular plane representing a "receipt fragment" */}
      <planeGeometry args={[0.3, 0.8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.15} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

export function ThreeBackground() {
  const [dpr, setDpr] = useState(1.5);
  const [detailed, setDetailed] = useState(true);

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-black">
      <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.8)_100%)]" />
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={dpr}>
        <PerformanceMonitor 
          onIncline={() => { setDpr(2); setDetailed(true); }} 
          onDecline={() => { setDpr(1); setDetailed(false); }}
        />
        <fog attach="fog" args={["#000000", 2, 15]} />
        <Terrain detailed={detailed} />
        <Fragments detailed={detailed} />
      </Canvas>
    </div>
  );
}
