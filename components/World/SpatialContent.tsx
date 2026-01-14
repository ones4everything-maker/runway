import React, { useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Icons as SVGs
const MouseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="M13 13l6 6"/></svg>
);

const CartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
)

const ProductGridItem = ({ image, title, price }: { image: string, title: string, price: string }) => (
    <div className="relative group overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]">
        <div className="aspect-square relative">
            <img src={image} alt={title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
        </div>
        <div className="absolute bottom-0 left-0 w-full p-3">
             <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-white font-mono text-xs font-bold tracking-wider">{title}</h3>
                    <p className="text-purple-400 text-xs">{price}</p>
                </div>
                <button className="bg-white/10 p-1.5 rounded-full hover:bg-purple-600 transition-colors">
                    <div className="w-3 h-3 border-t border-r border-white transform rotate-45 mb-[2px] ml-[1px]"></div>
                </button>
             </div>
        </div>
    </div>
);

// Wrapper for Smooth Spatial Fading
const FadingHtml = ({ position, children, className, style, fadeStart = 10, fadeEnd = 3 }: any) => {
    const groupRef = useRef<THREE.Group>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const { camera } = useThree();

    useFrame(() => {
        if (!groupRef.current || !contentRef.current) return;
        
        const worldPos = new THREE.Vector3();
        groupRef.current.getWorldPosition(worldPos);
        
        // Distance to camera
        const dist = camera.position.distanceTo(worldPos);
        
        // Fading Logic:
        // 1. Fade OUT when getting close (clean exit)
        // 2. Fade IN from distance (start deeper)
        
        const FADE_OUT_START = fadeStart; 
        const FADE_OUT_END = fadeEnd;    
        
        const FADE_IN_START = 50;  // Visible start (far)
        const FADE_IN_END = 35;    // Fully visible (closer)

        let opacity = 1;

        if (dist < FADE_OUT_START) {
            // Fade out as we approach
            opacity = Math.max(0, (dist - FADE_OUT_END) / (FADE_OUT_START - FADE_OUT_END));
        } else if (dist > FADE_IN_END) {
            // Fade in from deep space
            opacity = Math.max(0, Math.min(1, 1 - (dist - FADE_IN_END) / (FADE_IN_START - FADE_IN_END)));
        }

        contentRef.current.style.opacity = opacity.toString();
        
        // Clean Exit Effects
        if (opacity < 1) {
             const blur = (1 - opacity) * 15;
             const scale = 0.95 + (0.05 * opacity);
             const yOffset = (1 - opacity) * -10;
             
             contentRef.current.style.filter = `blur(${blur}px)`;
             contentRef.current.style.transform = `scale(${scale}) translateY(${yOffset}px)`;
             
             // Disable pointer events when faded significantly to prevent ghost clicks
             contentRef.current.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';
        } else {
             contentRef.current.style.filter = 'none';
             contentRef.current.style.transform = 'none';
             contentRef.current.style.pointerEvents = 'auto';
        }
        
        // Hide completely if invisible to save rendering cost
        contentRef.current.style.display = opacity <= 0.01 ? 'none' : 'block';
    });

    return (
        <group ref={groupRef} position={position}>
            <Html transform className={className} style={style} zIndexRange={[100, 0]}>
                <div ref={contentRef} style={{ transition: 'opacity 0.05s linear', width: '100%', height: '100%' }}>
                    {children}
                </div>
            </Html>
        </group>
    )
}

// Section 1: Winter / Cryo Stasis
export const WinterSection = () => (
  <group>
    {/* Left Side: Hero Text */}
    <FadingHtml position={[-4, 0, 0]} className="w-[600px] pointer-events-none select-none">
        <div className="text-left relative">
            {/* Depth Indicator from Concept */}
            <div className="absolute -top-12 left-0 border border-white/20 rounded-full px-4 py-1 flex items-center gap-2 bg-black/50 backdrop-blur">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-mono text-white/70 tracking-widest">DEPTH - 308m</span>
            </div>

            <h1 className="text-8xl font-black text-white mb-4 leading-[0.8] tracking-tighter drop-shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                ONES4
            </h1>
            
            <div className="text-2xl text-purple-400 font-light tracking-[0.2em] mb-6 uppercase border-l-2 border-purple-500 pl-4">
                One for multifunctional
            </div>

            <p className="text-slate-300 leading-relaxed mb-8 font-light text-lg max-w-md">
                For zero-degree environments. The Winter aerogel insulation derived from aerospace tech for maximum warmth with zero bulk.
            </p>
            
            <div className="pointer-events-auto inline-block group">
                <button className="relative px-8 py-3 bg-transparent overflow-hidden rounded-full border border-blue-400/50 group-hover:border-purple-500 transition-colors duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                     <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-purple-500/10 transition-colors" />
                     <div className="flex items-center gap-3 relative z-10">
                        <CartIcon />
                        <span className="font-bold tracking-widest text-white text-sm">ADD TO CART</span>
                     </div>
                </button>
                <div className="absolute left-1/2 bottom-0 w-[1px] h-20 bg-gradient-to-b from-blue-500 to-transparent -z-10 transform translate-y-full" />
                <div className="absolute left-1/2 bottom-[-80px] w-20 h-20 rounded-full border border-blue-500/20 transform -translate-x-1/2 scale-y-[0.3]" />
            </div>

            <div className="mt-12 flex gap-4">
                 <div className="w-12 h-12 rounded-xl border border-blue-500/30 flex items-center justify-center bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                    <div className="w-6 h-6 rounded-full border-2 border-blue-400 opacity-80" />
                 </div>
                 <div className="w-12 h-12 rounded-xl border border-blue-500/30 flex items-center justify-center bg-blue-500/5">
                    <div className="w-4 h-6 border border-blue-400 opacity-60 rounded-sm" />
                 </div>
            </div>
        </div>
    </FadingHtml>
    
    {/* Right Side: Product Grid */}
    <FadingHtml position={[3.5, 0, 0]} className="w-[800px] pointer-events-auto" style={{ transform: 'scale(0.8)' }}>
        <div className="grid grid-cols-4 gap-4 p-6 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-md shadow-2xl relative">
            <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 -z-10 blur-sm" />
            
            <div className="col-span-2 row-span-2">
                 <div className="h-full w-full relative group rounded-xl overflow-hidden border border-white/10">
                    <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="Model" />
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded text-white font-mono text-sm">pooasire</div>
                 </div>
            </div>

            <ProductGridItem title="FROST PACK" price="$120" image="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=300&auto=format&fit=crop" />
            <ProductGridItem title="ZERO TOTE" price="$85" image="https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=300&auto=format&fit=crop" />
            <ProductGridItem title="CRYO SHELL" price="$95" image="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=300&auto=format&fit=crop" />
            <ProductGridItem title="NEON PUFFER" price="$150" image="https://images.unsplash.com/photo-1545959952-4742f5e3dfd3?q=80&w=300&auto=format&fit=crop" />
            
            <ProductGridItem title="THERMAL HOOD" price="$110" image="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=300&auto=format&fit=crop" />
            <ProductGridItem title="BASE LAYER" price="$60" image="https://images.unsplash.com/photo-1571945153262-390872291b76?q=80&w=300&auto=format&fit=crop" />
        </div>
    </FadingHtml>
  </group>
);

// Section 2: Tech (Expanded with Product Grid)
export const TechSection = () => (
  <group>
    {/* Left Side: Hero Text */}
    <FadingHtml position={[-4, 0, 0]} className="w-[500px] pointer-events-none select-none">
        <div className="text-left">
            <span className="text-xs font-mono text-emerald-400 border border-emerald-400/30 px-2 py-1 rounded mb-4 inline-block bg-emerald-950/30">COLLECTION 02</span>
            <h2 className="text-8xl font-black text-slate-200 mb-6 leading-[0.85] tracking-tighter drop-shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                MODULAR<br/>SYSTEMS
            </h2>
             <p className="text-emerald-100/70 leading-relaxed mb-8 font-light text-lg max-w-md">
                Adaptive gear for dynamic environments. Interchangeable components, magnetic latches, and high-tensile fabrics.
            </p>
             <button className="pointer-events-auto px-8 py-3 border border-emerald-400/30 text-emerald-400 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all uppercase font-bold text-xs tracking-widest hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                VIEW SCHEMATICS
            </button>
        </div>
    </FadingHtml>
    
    {/* Right Side: Product Grid for Tech Section */}
    <FadingHtml position={[3.5, 0, 0]} className="w-[800px] pointer-events-auto" style={{ transform: 'scale(0.8)' }}>
        <div className="grid grid-cols-4 gap-4 p-6 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-md shadow-2xl relative">
            {/* Grid Glow Effect - Green/Emerald Theme */}
            <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 -z-10 blur-sm" />
            
            <div className="col-span-2 row-span-2 order-last">
                 <div className="h-full w-full relative group rounded-xl overflow-hidden border border-white/10">
                    <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="Techwear Model" />
                    <div className="absolute bottom-4 right-4 bg-emerald-900/80 backdrop-blur px-3 py-1 rounded text-emerald-100 font-mono text-sm border border-emerald-500/30">system_v2</div>
                 </div>
            </div>

            <ProductGridItem title="TAC-VEST" price="$240" image="https://images.unsplash.com/photo-1620799140408-ed5341cd2431?q=80&w=300&auto=format&fit=crop" />
            <ProductGridItem title="CARGO V2" price="$180" image="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=300&auto=format&fit=crop" />
            <ProductGridItem title="UTIL BELT" price="$55" image="https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?q=80&w=300&auto=format&fit=crop" />
            <ProductGridItem title="SHELL JKT" price="$320" image="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=300&auto=format&fit=crop" />
            
            <ProductGridItem title="MAG POUCH" price="$45" image="https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=300&auto=format&fit=crop" />
            <ProductGridItem title="FIELD CAP" price="$40" image="https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=300&auto=format&fit=crop" />
        </div>
    </FadingHtml>
  </group>
);

// Section 3: Horizon
export const HorizonSection = () => (
    <group>
        <FadingHtml position={[0, 0, 0]} className="pointer-events-none select-none">
            <div className="text-center w-[800px] flex flex-col items-center">
                <h2 className="text-[12rem] font-black text-orange-600 mb-8 mix-blend-screen leading-none opacity-90 blur-sm">
                    HORIZON
                </h2>
                 <p className="text-3xl text-white mb-12 font-light tracking-wide">The next generation drops in:</p>
                 <div className="text-5xl font-mono text-white tracking-widest border border-white/20 inline-block px-8 py-4 bg-black/50 backdrop-blur rounded-lg">
                    04:22:18
                 </div>
            </div>
        </FadingHtml>
    </group>
);

// Intro Overlay
export const IntroHint = () => (
    <Html transform position={[0, -1.8, 0]} center>
         <div className="flex flex-col items-center animate-pulse opacity-50">
            <span className="text-white text-[10px] tracking-[0.5em] uppercase mb-4">Scroll to Explore</span>
            <div className="text-white opacity-50"><MouseIcon /></div>
         </div>
    </Html>
);