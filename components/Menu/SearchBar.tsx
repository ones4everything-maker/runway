import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import { Group, MathUtils } from 'three';
import { GlassBase } from './GlassBase';
import { IconMic } from './Icons';
import { InteractiveItem } from './InteractiveItem';

interface SearchBarProps {
  active: boolean;
  onActivate: () => void;
  hovered?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ active, onActivate, hovered }) => {
  const glowRef = useRef<Group>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputText, setInputText] = useState("");
  
  useFrame((state) => {
    if (glowRef.current && !active) {
      // Gentle pulse when inactive to invite interaction, boost frequency if hovered
      const t = state.clock.getElapsedTime();
      glowRef.current.scale.setScalar(1 + Math.sin(t * (hovered ? 3 : 1.5)) * 0.005);
    }
  });

  useEffect(() => {
    if (active) {
        // Delay focus slightly to ensure element is mounted and transition has started
        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
        return () => clearTimeout(timer);
    } else {
        setInputText(""); 
    }
  }, [active]);

  return (
    <group onClick={(e) => { e.stopPropagation(); onActivate(); }}>
      <group ref={glowRef}>
        <GlassBase 
            width={0.9} 
            height={0.12} 
            depth={0.02} 
            color="#050510" 
            edgeColor={active ? "#a855f7" : hovered ? "#8b5cf6" : "#60a5fa"}
            glowIntensity={active ? 2 : hovered ? 2.5 : 1.2}
        >
            {/* Search Icon */}
            <Text position={[-0.38, 0, 0.01]} fontSize={0.04} color={active || hovered ? "#a855f7" : "#60a5fa"}>
                ⌕
            </Text>
            
            {!active && (
                <Text
                    position={[-0.32, 0, 0.01]}
                    fontSize={0.035}
                    // Hover effect: Bright White/Purple glow vs Standard Gray
                    color={hovered ? "#e9d5ff" : "#94a3b8"}
                    anchorX="left"
                    anchorY="middle"
                    letterSpacing={0.05}
                    fillOpacity={hovered ? 1 : 0.7}
                >
                    Search database...
                </Text>
            )}

            {active && (
                <Html position={[-0.32, 0, 0.02]} transform wrapperClass="search-input-wrapper" style={{ pointerEvents: 'none' }}>
                    <div style={{ width: '240px', display: 'flex', alignItems: 'center', pointerEvents: 'auto' }}>
                         <input 
                            ref={inputRef}
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type to search..."
                            style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                color: 'white',
                                fontSize: '20px',
                                fontFamily: 'monospace',
                                outline: 'none',
                                letterSpacing: '2px',
                                caretColor: '#a855f7',
                                textShadow: '0 0 5px rgba(168, 85, 247, 0.5)'
                            }}
                         />
                    </div>
                </Html>
            )}

             <group position={[0.35, 0, 0.01]}>
                <InteractiveItem scaleHover={1.2}>
                    {({ hovered: micHovered }) => (
                        <IconMic color={active || micHovered ? "#fff" : "#60a5fa"} hovered={micHovered} />
                    )}
                </InteractiveItem>
            </group>

        </GlassBase>
      </group>
    </group>
  );
};