import React, { useState, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Group, Mesh, MathUtils, MeshBasicMaterial } from 'three';
import { InteractiveItem } from './InteractiveItem';
import { SearchBar } from './SearchBar';
import { CartPanel, CartItemData } from './CartPanel';
import { OptionsPanel } from './OptionsPanel';
import { ProductsPanel } from './ProductsPanel';
import { IconHamburger, IconUser, IconCart, IconBag } from './Icons';
import { GlassBase } from './GlassBase';

const Logo = ({ hovered }: { hovered?: boolean }) => {
    return (
        <group>
            <Text
                fontSize={0.06}
                letterSpacing={0.1}
                color="white"
                anchorX="left"
                anchorY="middle"
                fontWeight="bold"
                outlineWidth={hovered ? 0.002 : 0}
                outlineColor="#a855f7"
            >
                ONES4
            </Text>
        </group>
    );
};

const NotificationToast = ({ message }: { message: string | null }) => {
    const ref = useRef<Group>(null);
    useFrame((state, delta) => {
        if (!ref.current) return;
        const targetScale = message ? 1 : 0;
        const currentScale = ref.current.scale.x;
        // Springy open
        ref.current.scale.setScalar(MathUtils.lerp(currentScale, targetScale, delta * 12));
        ref.current.visible = ref.current.scale.x > 0.01;
    });

    return (
        <group ref={ref} position={[0, -0.45, 0.2]}>
            <GlassBase width={0.5} height={0.08} color="#050505" edgeColor="#10b981" glowIntensity={2}>
                 <Text position={[0, 0, 0.02]} fontSize={0.02} color="#10b981" letterSpacing={0.1} fontWeight="bold">
                    {message}
                 </Text>
            </GlassBase>
        </group>
    );
};

export const CurvedMenu: React.FC = () => {
  const { viewport } = useThree();
  const [activeItem, setActiveItem] = useState<'none' | 'search' | 'cart' | 'options' | 'products'>('none');
  const [cartItems, setCartItems] = useState<CartItemData[]>([
      { id: 'init-1', label: "NEO RUNNER", price: 450 },
      { id: 'init-2', label: "VOID JACKET", price: 1200 },
  ]);
  const [notification, setNotification] = useState<string | null>(null);
  
  // Animation Refs
  const leftGroupRef = useRef<Group>(null);
  const rightGroupRef = useRef<Group>(null);
  const connectorRef = useRef<Group>(null);
  const dimmerRef = useRef<Mesh>(null);
  
  // Cart Bounce Animation
  const cartBounceRef = useRef(0);
  const cartInnerRef = useRef<Group>(null);

  const handleAddToCart = (item: { label: string, price: number }) => {
      const newItem = { id: Date.now().toString(), ...item };
      setCartItems(prev => [...prev, newItem]);
      
      // Trigger Notification
      setNotification(`ADDED TO CART: ${item.label}`);
      setTimeout(() => setNotification(null), 3000);

      // Trigger Bounce
      cartBounceRef.current = 1; 
  };

  const responsiveScale = Math.min(1, viewport.width / 2.5) * 0.9;

  const toggleItem = (item: typeof activeItem) => {
    setActiveItem(prev => prev === item ? 'none' : item);
  }

  useFrame((state, delta) => {
    const isSearch = activeItem === 'search';
    const targetScale = isSearch ? 0 : 1; 
    const lerpSpeed = delta * 8;
    
    // Animate side groups
    if (leftGroupRef.current) leftGroupRef.current.scale.setScalar(MathUtils.lerp(leftGroupRef.current.scale.x, targetScale, lerpSpeed));
    if (rightGroupRef.current) rightGroupRef.current.scale.setScalar(MathUtils.lerp(rightGroupRef.current.scale.x, targetScale, lerpSpeed));
    if (connectorRef.current) connectorRef.current.scale.setScalar(MathUtils.lerp(connectorRef.current.scale.x, targetScale, lerpSpeed));
    
    // Dimmer
    if (dimmerRef.current) {
        const mat = dimmerRef.current.material as MeshBasicMaterial;
        const targetOpacity = isSearch ? 0.7 : 0;
        mat.opacity = MathUtils.lerp(mat.opacity, targetOpacity, delta * 5);
        dimmerRef.current.visible = mat.opacity > 0.01;
    }

    // Cart Bounce
    if (cartInnerRef.current) {
        if (cartBounceRef.current > 0) {
            // Decay
            cartBounceRef.current = Math.max(0, cartBounceRef.current - delta * 4);
            // Sine wave pulse
            const extraScale = Math.sin(cartBounceRef.current * Math.PI) * 0.5;
            cartInnerRef.current.scale.setScalar(1 + extraScale);
        } else {
            // Reset to 1 smoothly
            cartInnerRef.current.scale.setScalar(MathUtils.lerp(cartInnerRef.current.scale.x, 1, delta * 10));
        }
    }
  });

  return (
    <group scale={responsiveScale}>
        
        {/* Dimmer Overlay for Focus Mode */}
        <mesh ref={dimmerRef} position={[0, 0, -0.2]} visible={false}>
            <planeGeometry args={[10, 5]} />
            <meshBasicMaterial color="#000" transparent opacity={0} depthWrite={false} />
        </mesh>
        
        {/* Toast Notification */}
        <NotificationToast message={notification} />

        {/* Main Background Strip - Visual Connector */}
        <group ref={connectorRef} position={[0, 0, -0.05]}>
             {/* Left */}
             <mesh position={[-0.9, 0, 0]} rotation={[0, 0.15, 0]}>
                <boxGeometry args={[0.8, 0.1, 0.01]} />
                <meshBasicMaterial color="#000" transparent opacity={0.3} />
             </mesh>
             {/* Center */}
             <mesh position={[0, 0, 0.05]}>
                <boxGeometry args={[1.0, 0.12, 0.01]} />
                <meshBasicMaterial color="#000" transparent opacity={0.3} />
             </mesh>
             {/* Right */}
             <mesh position={[0.9, 0, 0]} rotation={[0, -0.15, 0]}>
                <boxGeometry args={[0.8, 0.1, 0.01]} />
                <meshBasicMaterial color="#000" transparent opacity={0.3} />
             </mesh>
        </group>

        {/* --- LEFT GROUP: Hamburger, Shop & Logo --- */}
        <group ref={leftGroupRef} position={[-1.0, 0, 0]} rotation={[0, 0.15, 0]}>
            
            {/* Hamburger (Options) */}
            <group position={[-0.3, 0, 0]}>
                <InteractiveItem 
                    position={[0, 0, 0]}
                    onClick={() => toggleItem('options')}
                    scaleHover={1.1}
                    isSelected={activeItem === 'options'}
                >
                    {({ hovered }) => (
                         <IconHamburger color={activeItem === 'options' ? "#a855f7" : "#fff"} hovered={hovered} />
                    )}
                </InteractiveItem>
            </group>

            {/* Shop Bag (Products) */}
            <group position={[-0.1, 0, 0]}>
                <InteractiveItem 
                    position={[0, 0, 0]}
                    onClick={() => toggleItem('products')}
                    scaleHover={1.1}
                    isSelected={activeItem === 'products'}
                >
                    {({ hovered }) => (
                        <IconBag color={activeItem === 'products' ? "#a855f7" : "#fff"} hovered={hovered} />
                    )}
                </InteractiveItem>
            </group>

            {/* Logo */}
            <group position={[0.15, 0, 0]}>
                 <InteractiveItem onClick={() => {}}>
                    {({ hovered }) => <Logo hovered={hovered} />}
                 </InteractiveItem>
            </group>
        </group>

        {/* --- CENTER GROUP: Search Bar --- */}
        <group position={[0, 0, 0.1]}>
             <InteractiveItem 
                scaleHover={1.01} 
                isSelected={activeItem === 'search'}
                onClick={() => toggleItem('search')}
            >
                {({ hovered }) => (
                     <SearchBar active={activeItem === 'search'} onActivate={() => toggleItem('search')} hovered={hovered} />
                )}
            </InteractiveItem>
        </group>

        {/* --- RIGHT GROUP: User & Cart --- */}
        <group ref={rightGroupRef} position={[1.0, 0, 0]} rotation={[0, -0.15, 0]}>
            
            <group position={[-0.15, 0, 0]}>
                <InteractiveItem scaleHover={1.2}>
                    {({ hovered }) => (
                        <>
                            <IconUser color="#fff" hovered={hovered} />
                            <Text position={[0.04, 0, 0]} fontSize={0.025} color={hovered ? "white" : "#ccc"} anchorX="left">Loion</Text>
                        </>
                    )}
                </InteractiveItem>
            </group>

            <group position={[0.25, 0, 0]}>
                <InteractiveItem 
                    scaleHover={1.2}
                    isSelected={activeItem === 'cart'}
                    onClick={() => toggleItem('cart')}
                >
                    {({ hovered }) => (
                        <group ref={cartInnerRef}>
                            <IconCart color={activeItem === 'cart' ? "#a855f7" : "#fff"} hovered={hovered} />
                            {cartItems.length > 0 && (
                                <group position={[0.025, 0.025, 0.01]}>
                                    <mesh>
                                        <circleGeometry args={[0.012, 16]} />
                                        <meshBasicMaterial color={hovered ? "#d8b4fe" : "#a855f7"} />
                                    </mesh>
                                    <Text position={[0, 0, 0.001]} fontSize={0.015} color="white" fontWeight="bold">
                                        {cartItems.length}
                                    </Text>
                                </group>
                            )}
                        </group>
                    )}
                </InteractiveItem>
            </group>
        </group>

        {/* PANELS */}
        {!activeItem.includes('search') && (
            <>
                <CartPanel 
                    visible={activeItem === 'cart'} 
                    onClose={() => toggleItem('cart')} 
                    items={cartItems}
                />
                <OptionsPanel visible={activeItem === 'options'} />
                <ProductsPanel 
                    visible={activeItem === 'products'} 
                    onAddToCart={handleAddToCart}
                />
            </>
        )}
    </group>
  );
};