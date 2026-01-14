import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, MathUtils } from 'three';

interface InteractiveItemProps {
  children: React.ReactNode | ((props: { hovered: boolean }) => React.ReactNode);
  position?: [number, number, number];
  rotation?: [number, number, number];
  onClick?: () => void;
  scaleHover?: number;
  moveZHover?: number;
  isSelected?: boolean;
}

export const InteractiveItem: React.FC<InteractiveItemProps> = ({
  children,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  onClick,
  scaleHover = 1.1,
  moveZHover = 0.05,
  isSelected = false
}) => {
  const [hovered, setHover] = useState(false);
  const groupRef = useRef<Group>(null);
  
  // Animation state
  const currentScale = useRef(1);
  const currentZ = useRef(position[2]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Target values
    const targetScale = hovered || isSelected ? scaleHover : 1;
    const targetZ = (isSelected ? position[2] + moveZHover * 3 : hovered ? position[2] + moveZHover : position[2]);
    
    // Smooth lerp
    currentScale.current = MathUtils.lerp(currentScale.current, targetScale, delta * 10);
    currentZ.current = MathUtils.lerp(currentZ.current, targetZ, delta * 10);

    groupRef.current.scale.setScalar(currentScale.current);
    groupRef.current.position.z = currentZ.current;
  });

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1], position[2]]}
      rotation={[rotation[0], rotation[1], rotation[2]]}
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHover(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {typeof children === 'function' ? children({ hovered }) : children}
    </group>
  );
};