import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Torus, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const PlanetMarker = ({ depth, color, size = 4, x = 8 }: { depth: number, color: string, size?: number, x?: number }) => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.1;
            groupRef.current.rotation.x += delta * 0.05;
        }
    });

    return (
        <group position={[x, 0, depth]}>
            <group ref={groupRef}>
                {/* Main Sphere */}
                <Sphere args={[size, 32, 32]}>
                    <meshPhongMaterial 
                        color={color} 
                        emissive={color}
                        emissiveIntensity={0.2}
                        wireframe
                        transparent
                        opacity={0.3}
                    />
                </Sphere>
                {/* Inner Solid Core */}
                <Sphere args={[size * 0.8, 32, 32]}>
                    <meshBasicMaterial color="black" />
                </Sphere>
            </group>
            
            {/* Orbital Ring */}
            <group rotation={[Math.PI / 2, 0, 0]}>
                 <Torus args={[size * 3, 0.05, 16, 100]}>
                    <meshBasicMaterial color={color} transparent opacity={0.2} />
                 </Torus>
            </group>
        </group>
    )
}

export const SectionMarkers: React.FC = () => {
  return (
    <>
      <PlanetMarker depth={-10} color="#ffffff" x={-8} /> {/* Winter */}
      <PlanetMarker depth={-35} color="#94a3b8" x={8} /> {/* Tech */}
      <PlanetMarker depth={-60} color="#ff4000" size={6} x={0} /> {/* Horizon */}
    </>
  );
};