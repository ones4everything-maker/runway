import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Group } from 'three';
import { GlassBase } from './GlassBase';
import { InteractiveItem } from './InteractiveItem';

const NavItem = ({ x, label, icon }: { x: number, label: string, icon: string }) => {
    return (
        <group position={[x, 0, 0]}>
            <InteractiveItem scaleHover={1.1} moveZHover={0.01}>
                <GlassBase width={0.3} height={0.12} depth={0.01} color="#050505" edgeColor="#3b82f6" glowIntensity={0.5}>
                    {/* Simple Icon Representation using Text for now or could be svg texture */}
                    <Text position={[0, 0.02, 0.01]} fontSize={0.04} color="#60a5fa">{icon}</Text>
                    <Text position={[0, -0.03, 0.01]} fontSize={0.015} color="white" letterSpacing={0.1}>
                        {label}
                    </Text>
                </GlassBase>
            </InteractiveItem>
        </group>
    )
}

export const BottomNav: React.FC = () => {
  return (
    <group position={[0, -0.6, 0]} rotation={[-0.2, 0, 0]}>
        <NavItem x={-0.5} label="SHIRTS" icon="👕" />
        <NavItem x={-0.17} label="HOODIES" icon="🧥" />
        <NavItem x={0.17} label="SHORTS" icon="🩳" />
        <NavItem x={0.5} label="ACCESSORIES" icon="🧢" />
    </group>
  );
};