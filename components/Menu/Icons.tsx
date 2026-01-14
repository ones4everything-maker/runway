import React from 'react';
import { Cylinder, Box, Sphere, Torus } from '@react-three/drei';

interface IconProps {
    color: string;
    hovered?: boolean;
}

const EmissiveMaterial = ({ color, hovered }: { color: string, hovered?: boolean }) => (
    <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={hovered ? 2.5 : 0.5} 
        toneMapped={false} 
    />
);

export const IconHamburger: React.FC<IconProps> = ({ color, hovered }) => (
  <group>
    <Box args={[0.04, 0.005, 0.001]} position={[0, 0.015, 0]}>
      <EmissiveMaterial color={color} hovered={hovered} />
    </Box>
    <Box args={[0.04, 0.005, 0.001]} position={[0, 0, 0]}>
      <EmissiveMaterial color={color} hovered={hovered} />
    </Box>
    <Box args={[0.04, 0.005, 0.001]} position={[0, -0.015, 0]}>
      <EmissiveMaterial color={color} hovered={hovered} />
    </Box>
  </group>
);

export const IconUser: React.FC<IconProps> = ({ color, hovered }) => (
  <group scale={0.6}>
    <Sphere args={[0.015, 16, 16]} position={[0, 0.02, 0]}>
      <EmissiveMaterial color={color} hovered={hovered} />
    </Sphere>
    <Torus args={[0.025, 0.005, 16, 32, Math.PI]} position={[0, -0.015, 0]} rotation={[0, 0, 0]}>
       <EmissiveMaterial color={color} hovered={hovered} />
    </Torus>
  </group>
);

export const IconCart: React.FC<IconProps> = ({ color, hovered }) => (
  <group scale={0.6} position={[0, -0.005, 0]}>
    <Box args={[0.05, 0.04, 0.001]} position={[0, 0, 0]}>
      <EmissiveMaterial color={color} hovered={hovered} />
    </Box>
    <Torus args={[0.01, 0.002, 8, 16, Math.PI]} position={[0, 0.025, 0]} rotation={[0, 0, 0]}>
       <EmissiveMaterial color={color} hovered={hovered} />
    </Torus>
    <Cylinder args={[0.005, 0.005, 0.005]} rotation={[Math.PI/2, 0, 0]} position={[-0.015, -0.025, 0]}>
        <meshStandardMaterial color={color} />
    </Cylinder>
    <Cylinder args={[0.005, 0.005, 0.005]} rotation={[Math.PI/2, 0, 0]} position={[0.015, -0.025, 0]}>
        <meshStandardMaterial color={color} />
    </Cylinder>
  </group>
);

export const IconMic: React.FC<IconProps> = ({ color, hovered }) => (
  <group scale={0.5} rotation={[0, 0, 0]}>
    <Cylinder args={[0.01, 0.01, 0.04]} position={[0, 0.01, 0]}>
        <meshStandardMaterial color={color} />
    </Cylinder>
    <Sphere args={[0.012]} position={[0, 0.03, 0]}>
        <meshStandardMaterial color={color} />
    </Sphere>
    <Box args={[0.005, 0.015, 0.005]} position={[0, -0.015, 0]}>
        <meshStandardMaterial color={color} />
    </Box>
    <Box args={[0.02, 0.005, 0.005]} position={[0, -0.025, 0]}>
        <meshStandardMaterial color={color} />
    </Box>
  </group>
);

export const IconBag: React.FC<IconProps> = ({ color, hovered }) => (
  <group scale={0.6} position={[0, -0.005, 0]}>
    <Box args={[0.04, 0.04, 0.01]} position={[0, 0, 0]}>
        <EmissiveMaterial color={color} hovered={hovered} />
    </Box>
    <Torus args={[0.01, 0.002, 8, 16, Math.PI]} position={[0, 0.025, 0]} rotation={[0, 0, 0]}>
        <EmissiveMaterial color={color} hovered={hovered} />
    </Torus>
  </group>
);