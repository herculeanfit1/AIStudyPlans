'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Animated calendar box component
function CalendarBox(props: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.2 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[1.5, 1.5, 0.1]} />
      <meshStandardMaterial color={hovered ? '#6366f1' : '#4f46e5'} />
    </mesh>
  );
}

// Book stack component
function BookStack(props: any) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.3;
    }
  });

  return (
    <group ref={groupRef} {...props}>
      {/* Book 1 */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.8, 0.1, 1]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      
      {/* Book 2 */}
      <mesh position={[0.05, 0.25, 0]}>
        <boxGeometry args={[0.7, 0.1, 1]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      
      {/* Book 3 */}
      <mesh position={[-0.05, 0.4, 0]}>
        <boxGeometry args={[0.75, 0.1, 1]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>
    </group>
  );
}

// Study progress chart
function ProgressChart(props: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.getElapsedTime()) * 0.1;
    }
  });

  return (
    <group {...props}>
      {/* Base circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.05, 32]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
      
      {/* Progress indicator */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.05, 32, 1, false, 0, Math.PI * 1.6]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>
    </group>
  );
}

export default function StudyPlan3D() {
  return (
    <div className="h-72 w-full rounded-lg overflow-hidden">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        
        <CalendarBox position={[-2, 0, 0]} />
        <BookStack position={[0, -0.5, 0]} />
        <ProgressChart position={[2, 0, 0]} />
        
        <Text
          position={[-2, -1.2, 0]}
          fontSize={0.3}
          color="#4b5563"
          anchorX="center"
          anchorY="middle"
        >
          Schedule
        </Text>
        
        <Text
          position={[0, -1.2, 0]}
          fontSize={0.3}
          color="#4b5563"
          anchorX="center"
          anchorY="middle"
        >
          Resources
        </Text>
        
        <Text
          position={[2, -1.2, 0]}
          fontSize={0.3}
          color="#4b5563"
          anchorX="center"
          anchorY="middle"
        >
          Progress
        </Text>
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
} 