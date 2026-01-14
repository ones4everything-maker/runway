import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const StarField: React.FC = () => {
  const ref = useRef<THREE.Points>(null);
  
  const { positions, colors } = useMemo(() => {
    const count = 4000;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const color = new THREE.Color();
    
    for(let i = 0; i < count; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 30; 
      // Distribute stars deep into the background (0 to -150)
      const depth = (Math.random() - 0.2) * 200; 
      
      pos[i3] = Math.cos(angle) * radius;     
      pos[i3+1] = Math.sin(angle) * radius;   
      pos[i3+2] = -depth + 50;
      
      // Random subtle colors
      color.setHSL(Math.random(), 0.2, 0.5 + Math.random() * 0.5);
      cols[i3] = color.r;
      cols[i3+1] = color.g;
      cols[i3+2] = color.b;
    }
    return { positions: pos, colors: cols };
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * 0.05;
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};