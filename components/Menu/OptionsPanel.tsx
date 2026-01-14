import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Group, MathUtils } from 'three';
import { GlassBase } from './GlassBase';

interface OptionsPanelProps {
  visible: boolean;
}

const CategoryItem = ({ y, label, count, active = false }: { y: number, label: string, count: string, active?: boolean }) => (
    <group position={[0, y, 0.02]}>
        <GlassBase width={0.35} height={0.07} depth={0.005} color={active ? "#222" : "#000"} edgeColor={active ? "#a855f7" : "#333"}>
             <Text position={[-0.14, 0, 0.01]} fontSize={0.02} anchorX="left" color={active ? "white" : "#999"} letterSpacing={0.05} fontWeight={active ? "bold" : "normal"}>
                {label}
             </Text>
             <Text position={[-0.14, -0.015, 0.01]} fontSize={0.012} anchorX="left" color="#555">
                {count}
             </Text>
        </GlassBase>
    </group>
)

export const OptionsPanel: React.FC<OptionsPanelProps> = ({ visible }) => {
  const animGroup = useRef<Group>(null);
  const opacityRef = useRef(0);

  useFrame((state, delta) => {
      if (!animGroup.current) return;
      
      const target = visible ? 1 : 0;
      opacityRef.current = MathUtils.lerp(opacityRef.current, target, delta * 12);
      
      const p = opacityRef.current;
      const isVisible = p > 0.001;
      animGroup.current.visible = isVisible;
      
      if (isVisible) {
          // Slide in from left-back to front
          // Z: -0.15 to 0
          animGroup.current.position.z = MathUtils.lerp(-0.15, 0, p);
          // Scale: 0.9 to 1
          animGroup.current.scale.setScalar(MathUtils.lerp(0.9, 1, p));

          animGroup.current.traverse((child: any) => {
              if (child.isMesh && child.material) {
                  const mats = Array.isArray(child.material) ? child.material : [child.material];
                  mats.forEach((mat: any) => {
                      if (mat.transparent) {
                          if (mat.userData.originalOpacity === undefined) mat.userData.originalOpacity = mat.opacity;
                          mat.opacity = mat.userData.originalOpacity * p;
                      }
                      if (mat.uniforms && mat.uniforms.opacity) {
                           if (mat.userData.originalUniformOpacity === undefined) mat.userData.originalUniformOpacity = mat.uniforms.opacity.value;
                           mat.uniforms.opacity.value = mat.userData.originalUniformOpacity * p;
                      }
                  });
              }
          });
      }
  });

  return (
    <group position={[-0.8, -0.35, 0.1]} rotation={[0, 0.1, 0]}>
       <group ref={animGroup}>
           <GlassBase width={0.4} height={0.6} depth={0.02} color="#050505" edgeColor="#a855f7">
              <Text position={[-0.15, 0.25, 0.01]} fontSize={0.015} color="#a855f7" letterSpacing={0.2} anchorX="left">
                DEPARTMENTS
              </Text>
              
              <CategoryItem y={0.16} label="WINTER CORE" count="12 ITEMS" active />
              <CategoryItem y={0.07} label="MODULAR TECH" count="8 ITEMS" />
              <CategoryItem y={-0.02} label="FOOTWEAR" count="5 ITEMS" />
              <CategoryItem y={-0.11} label="ACCESSORIES" count="24 ITEMS" />
              <CategoryItem y={-0.20} label="ARCHIVE" count="VAULT" />
              
              <group position={[0, -0.26, 0.0]} scale={0.8}>
                 <GlassBase width={0.35} height={0.002} color="#333" />
              </group>

              <group position={[0, -0.28, 0.02]}>
                  <Text position={[-0.15, 0, 0]} fontSize={0.012} color="#666" anchorX="left">ACCOUNT</Text>
                  <Text position={[0.15, 0, 0]} fontSize={0.012} color="#666" anchorX="right">SETTINGS</Text>
              </group>
           </GlassBase>
       </group>
    </group>
  );
};