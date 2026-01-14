import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Group, MathUtils } from 'three';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Text, Image as DreiImage } from '@react-three/drei';
import { GlassBase } from './GlassBase';
import { InteractiveItem } from './InteractiveItem';
import { IS_SHOPIFY_LIVE } from '../../config';
import { shopifyFetch, PRODUCTS_QUERY, formatShopifyProduct, ShopifyProduct } from '../../utils/shopify';

interface ProductsPanelProps {
  visible: boolean;
  onAddToCart: (item: { label: string, price: number, variantId?: string }) => void;
}

interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Robust Error Boundary for Images
class ImageErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.warn("Failed to load product image:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const LoadingPlaceholder = () => (
    <mesh>
        <planeGeometry args={[0.2, 0.2]} />
        <meshBasicMaterial color="#222" wireframe opacity={0.3} transparent />
    </mesh>
);

// --- STATIC FALLBACK DATA (Used if no Shopify keys are present) ---
const STATIC_PRODUCT_DATA = [
    {
        id: 'p1',
        label: 'AETHER ORB',
        price: '$850',
        priceVal: 850,
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop',
        variantId: 'mock_v1'
    },
    {
        id: 'p2',
        label: 'CHRONO CUBE',
        price: '$2,400',
        priceVal: 2400,
        imageUrl: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=400&auto=format&fit=crop',
        variantId: 'mock_v2'
    },
    {
        id: 'p3',
        label: 'VOID KNOT',
        price: '$1,100',
        priceVal: 1100,
        imageUrl: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=400&auto=format&fit=crop',
        variantId: 'mock_v3'
    },
    {
        id: 'p4',
        label: 'NEON SHARD',
        price: '$950',
        priceVal: 950,
        imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=400&auto=format&fit=crop',
        variantId: 'mock_v4'
    },
    {
        id: 'p5',
        label: 'FLUX ENGINE',
        price: '$3,200',
        priceVal: 3200,
        imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop',
        variantId: 'mock_v5'
    },
    {
        id: 'p6',
        label: 'QUANTUM LOOP',
        price: '$1,800',
        priceVal: 1800,
        imageUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=400&auto=format&fit=crop',
        variantId: 'mock_v6'
    }
];

const ProductCard = ({ 
    item,
    onAdd,
    isFocused
}: { 
    item: ShopifyProduct | typeof STATIC_PRODUCT_DATA[0],
    onAdd: (item: { label: string, price: number, variantId?: string }) => void,
    isFocused?: boolean
}) => {
    const [justAdded, setJustAdded] = useState(false);
    
    const handleClick = () => {
        onAdd({ label: item.label, price: item.priceVal, variantId: item.variantId });
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 800);
    };
    
    // Determine border color based on focus/action
    const getEdgeColor = (hovered: boolean) => {
        if (justAdded) return "#10b981";
        if (hovered) return "#d8b4fe";
        if (isFocused) return "#a855f7"; // Highlight focused item
        return "#4b5563"; // Dim others
    };

    return (
        <InteractiveItem 
            onClick={handleClick} 
            scaleHover={1.1}
            moveZHover={0.05}
        >
            {({ hovered }) => (
                <GlassBase 
                    width={0.32} 
                    height={0.42} 
                    depth={0.03} 
                    color={hovered || isFocused ? "#1a1a1a" : "#050505"} 
                    edgeColor={getEdgeColor(hovered)} 
                    glowIntensity={justAdded ? 4 : hovered ? 3 : isFocused ? 2 : 0.5}
                >
                    {/* Image Container */}
                    <group position={[0, 0.05, 0.02]}>
                        <ImageErrorBoundary fallback={<LoadingPlaceholder />}>
                            <Suspense fallback={<LoadingPlaceholder />}>
                                {item.imageUrl ? (
                                    <DreiImage 
                                        url={item.imageUrl} 
                                        scale={hovered || isFocused ? 0.23 : 0.21} 
                                        transparent 
                                        opacity={1} 
                                        toneMapped={false}
                                        color={undefined}
                                    />
                                ) : (
                                    <LoadingPlaceholder />
                                )}
                            </Suspense>
                        </ImageErrorBoundary>
                    </group>

                    {/* Text Info */}
                    <group position={[0, -0.13, 0.025]}>
                        <Text 
                            fontSize={0.025} 
                            color="white" 
                            anchorY="bottom" 
                            maxWidth={0.28}
                            textAlign="center"
                            fillOpacity={isFocused ? 1 : 0.7}
                        >
                            {item.label}
                        </Text>
                        <Text 
                            position={[0, -0.035, 0]} 
                            fontSize={0.02} 
                            color={justAdded ? "#10b981" : hovered || isFocused ? "#e9d5ff" : "#a855f7"}
                            fillOpacity={isFocused ? 1 : 0.6}
                        >
                            {justAdded ? "ADDED TO CART" : item.price}
                        </Text>
                    </group>
                </GlassBase>
            )}
        </InteractiveItem>
    );
};

export const ProductsPanel: React.FC<ProductsPanelProps> = ({ visible, onAddToCart }) => {
  const animGroup = useRef<Group>(null);
  const opacityRef = useRef(0);
  
  // Data State
  const [products, setProducts] = useState<any[]>(STATIC_PRODUCT_DATA);
  const [loading, setLoading] = useState(false);

  // Carousel State
  const [targetIndex, setTargetIndex] = useState(0);
  const currentIndex = useRef(0);
  const listRef = useRef<Group>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Fetch Data Effect
  useEffect(() => {
    async function loadProducts() {
        if (!IS_SHOPIFY_LIVE) return;
        
        setLoading(true);
        try {
            const data = await shopifyFetch(PRODUCTS_QUERY, { first: 20 });
            const formatted = data.products.edges.map((edge: any) => formatShopifyProduct(edge.node));
            setProducts(formatted);
        } catch (e) {
            console.error("Shopify fetch failed, using static data", e);
        } finally {
            setLoading(false);
        }
    }

    if (visible && IS_SHOPIFY_LIVE && products === STATIC_PRODUCT_DATA) {
        loadProducts();
    }
  }, [visible, products]);

  // Scroll Handling
  const handleWheel = (e: ThreeEvent<WheelEvent>) => {
      e.stopPropagation(); 
      if (Math.abs(e.deltaY) > 20) {
          const direction = Math.sign(e.deltaY);
          const newIndex = MathUtils.clamp(targetIndex + direction, 0, products.length - 1);
          setTargetIndex(newIndex);
      }
  };

  useFrame((state, delta) => {
      if (!animGroup.current) return;
      
      const visibleTarget = visible ? 1 : 0;
      opacityRef.current = MathUtils.lerp(opacityRef.current, visibleTarget, delta * 10);
      
      const panelOpacity = opacityRef.current;
      const isVisible = panelOpacity > 0.01;
      animGroup.current.visible = isVisible;
      
      if (isVisible) {
          animGroup.current.position.z = MathUtils.lerp(-0.2, 0, panelOpacity);
          animGroup.current.scale.setScalar(MathUtils.lerp(0.9, 1, panelOpacity));
          
          // Smooth scroll interpolation
          currentIndex.current = MathUtils.lerp(currentIndex.current, targetIndex, delta * 6);
          
          // Update focused index state for React rendering (debounced visual update)
          const roundedIndex = Math.round(currentIndex.current);
          if (focusedIndex !== roundedIndex) {
            setFocusedIndex(roundedIndex);
          }

          if (listRef.current) {
             listRef.current.children.forEach((child, i) => {
                 const offset = i - currentIndex.current;
                 const absOffset = Math.abs(offset);
                 
                 // --- ENHANCED SCROLL ANIMATION LOGIC ---
                 
                 // Position: Spacing increases slightly on edges
                 const x = offset * 0.40;
                 
                 // Depth Curve: Quadratic falloff to create a semi-circle/carousel feel
                 // Items fade back significantly when not focused
                 const z = -Math.pow(absOffset, 1.8) * 0.15 + 0.1; 
                 
                 // Vertical Arch: Slight arch effect
                 const y = -Math.pow(absOffset, 1.2) * 0.02;

                 // Rotation: Face inward strongly as they move away
                 const rotY = offset * -0.45;

                 // Scale: Dramatic scaling. 
                 // Focus (offset 0) = 1.0
                 // Offset 1 = ~0.7
                 // Offset 2+ = ~0.45
                 const baseScale = 1 - Math.min(absOffset * 0.3, 0.55);
                 
                 // Add subtle breath to focused item
                 const breath = absOffset < 0.5 ? Math.sin(state.clock.elapsedTime * 2) * 0.02 : 0;
                 const scale = baseScale + breath;
                 
                 // Opacity: Sharp falloff. 
                 // Center is 1.0. Offset 1 is 0.7. Offset 2 drops to 0.2.
                 // This makes items "fade in" as they approach center.
                 const distOpacity = Math.max(0, 1 - Math.pow(absOffset * 0.55, 1.5)); 
                 const finalOpacity = distOpacity * panelOpacity;

                 child.position.set(x, y, z); 
                 child.rotation.y = rotY;
                 child.scale.setScalar(scale);

                 // Propagate opacity to materials
                 child.traverse((node: any) => {
                    if (node.isMesh && node.material) {
                        const mats = Array.isArray(node.material) ? node.material : [node.material];
                        mats.forEach((mat: any) => {
                            const baseOpacity = mat.userData.originalOpacity ?? 1;
                            if (mat.transparent) {
                                mat.opacity = baseOpacity * finalOpacity;
                            }
                            if (mat.uniforms?.opacity) {
                                mat.uniforms.opacity.value = baseOpacity * finalOpacity;
                            }
                        });
                        if (node.text && typeof node.fillOpacity === 'number') {
                             node.fillOpacity = finalOpacity;
                        }
                    }
                 });
             });
          }
      }
  });

  return (
    <group position={[0, -0.2, 0.4]}>
        <group ref={animGroup}>
            {/* Header */}
            <Text position={[0, 0.35, 0]} fontSize={0.025} color="#fff" letterSpacing={0.2} fillOpacity={0.7}>
                {loading ? "CONNECTING TO MAINFRAME..." : "FEATURED COLLECTION"}
            </Text>
            <Text position={[0, 0.31, 0]} fontSize={0.015} color="#a855f7" letterSpacing={0.1}>
                 {Math.round(currentIndex.current) + 1} / {products.length}
            </Text>
            
            {/* HIT PLANE */}
            <mesh 
                position={[0, 0, 0.2]} 
                onWheel={handleWheel}
            >
                <planeGeometry args={[5, 3]} />
                <meshBasicMaterial transparent opacity={0} color="red" />
            </mesh>
            
            <group ref={listRef}>
                {products.map((item, index) => (
                    <group key={item.id}>
                        <ProductCard 
                            item={item}
                            onAdd={onAddToCart}
                            isFocused={index === focusedIndex}
                        />
                    </group>
                ))}
            </group>

            {/* Hint */}
            <Text position={[0, -0.35, 0]} fontSize={0.012} color="#666" letterSpacing={0.1}>
                SCROLL TO BROWSE
            </Text>
        </group>
    </group>
  );
};
