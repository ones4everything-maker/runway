import React, { useRef, useMemo, useEffect } from 'react';
import { Box, Edges } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GlassBaseProps {
  width: number;
  height: number;
  radius?: number; // Kept for interface compatibility
  depth?: number;
  color?: string;
  edgeColor?: string;
  glowIntensity?: number;
  children?: React.ReactNode;
}

const Shimmer: React.FC<{ width: number, height: number, color: string, intensity: number }> = ({ width, height, color, intensity }) => {
    const matRef = useRef<THREE.ShaderMaterial>(null);
    
    useFrame((state) => {
        if (matRef.current) {
            matRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
        }
    });

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(color) },
        uIntensity: { value: intensity }
    }), []);

    useEffect(() => {
        if (matRef.current) {
            matRef.current.uniforms.uColor.value.set(color);
            matRef.current.uniforms.uIntensity.value = intensity;
        }
    }, [color, intensity]);

    return (
        <mesh>
            <planeGeometry args={[width, height]} />
            <shaderMaterial
                ref={matRef}
                transparent
                depthWrite={false}
                uniforms={uniforms}
                vertexShader={`
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `}
                fragmentShader={`
                    uniform float uTime;
                    uniform vec3 uColor;
                    uniform float uIntensity;
                    varying vec2 vUv;

                    void main() {
                        // Animation Speed
                        float t = uTime * 0.6;
                        
                        // Diagonal coordinate (u + v * slope)
                        float coord = vUv.x + vUv.y * 0.4;
                        
                        // Cycle period (time gap between shimmers)
                        float cycle = mod(t, 4.5);
                        float pos = cycle - 1.5;

                        // 1. Primary Wide Glow
                        float dist1 = abs(coord - pos);
                        float alpha1 = smoothstep(0.4, 0.0, dist1);
                        alpha1 = pow(alpha1, 2.5) * 0.08; 

                        // 2. Secondary Sharp Glint (Offset slightly)
                        float dist2 = abs(coord - (pos - 0.08));
                        float alpha2 = smoothstep(0.03, 0.0, dist2);
                        alpha2 *= 0.25;

                        // Combine and scale by intensity
                        float totalAlpha = (alpha1 + alpha2) * max(0.8, uIntensity);

                        // Reflection color: mostly white mixed with a bit of edge color
                        vec3 finalColor = mix(uColor, vec3(1.0), 0.85);
                        
                        // Fade out if alpha is negligible
                        if (totalAlpha < 0.001) discard;

                        gl_FragColor = vec4(finalColor, totalAlpha);
                    }
                `}
            />
        </mesh>
    );
};

export const GlassBase: React.FC<GlassBaseProps> = ({ 
  width, 
  height, 
  radius = 0.02, 
  depth = 0.02,
  color = '#000000',
  edgeColor = '#8b5cf6', // Violet default
  glowIntensity = 1,
  children 
}) => {
  return (
    <group>
      {/* Main Glass Volume - Using Box for guaranteed stability */}
      <Box args={[width, height, depth]}>
        <meshPhysicalMaterial 
          color={color}
          transmission={0.6}
          opacity={0.9}
          metalness={0.4}
          roughness={0.2}
          ior={1.5}
          thickness={0.05}
          specularIntensity={1}
          envMapIntensity={1}
          transparent
          userData={{ originalOpacity: 0.9 }}
        />
        
        {/* Edge Outline */}
        <Edges threshold={15} color={edgeColor} scale={1.0} renderOrder={1}>
           <meshBasicMaterial 
              color={edgeColor} 
              transparent 
              opacity={0.6 * glowIntensity} 
              toneMapped={false} 
              userData={{ originalOpacity: 0.6 * glowIntensity }}
           />
        </Edges>
      </Box>

      {/* Shimmer Effect Surface - Placed just above the glass face */}
      <group position={[0, 0, depth/2 + 0.001]}>
         <Shimmer width={width * 0.98} height={height * 0.98} color={edgeColor} intensity={glowIntensity} />
      </group>

      {/* Subtle Inner Gradient/Highlight Simulation - Static Top Highlight */}
      <mesh position={[0, height/2 - 0.005, depth/2 + 0.002]}>
         <planeGeometry args={[width * 0.9, 0.005]} />
         <meshBasicMaterial 
            color={edgeColor} 
            opacity={0.5 * glowIntensity} 
            transparent 
            userData={{ originalOpacity: 0.5 * glowIntensity }}
         />
      </mesh>

      {/* Content Container */}
      <group position={[0, 0, depth / 2 + 0.003]}>
        {children}
      </group>
    </group>
  );
};
