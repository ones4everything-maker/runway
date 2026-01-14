import React, { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Group, MathUtils } from 'three';
import { GlassBase } from './GlassBase';
import { InteractiveItem } from './InteractiveItem';
import { IS_SHOPIFY_LIVE } from '../../config';
import { shopifyFetch, CHECKOUT_MUTATION } from '../../utils/shopify';

export interface CartItemData {
  id: string;
  label: string;
  price: number;
  variantId?: string; // Needed for Shopify Checkout
}

interface CartPanelProps {
  visible: boolean;
  onClose?: () => void;
  items: CartItemData[];
}

interface CartItemRowProps {
  y: number;
  label: string;
  price: string;
}

const CartItemRow: React.FC<CartItemRowProps> = ({ y, label, price }) => (
    <group position={[0, y, 0.02]}>
        <GlassBase width={0.35} height={0.08} depth={0.005} color="#111" edgeColor="#333">
             <Text position={[-0.15, 0, 0.01]} fontSize={0.025} anchorX="left" color="white">{label}</Text>
             <Text position={[0.15, 0, 0.01]} fontSize={0.025} anchorX="right" color="#a855f7">{price}</Text>
        </GlassBase>
    </group>
);

const Spinner = () => {
    const ref = useRef<Group>(null);
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.z -= delta * 5;
        }
    });
    return (
        <group ref={ref}>
             <mesh>
                <torusGeometry args={[0.04, 0.006, 16, 32, Math.PI * 1.5]} />
                <meshBasicMaterial color="#a855f7" transparent opacity={1} />
             </mesh>
        </group>
    )
}

export const CartPanel: React.FC<CartPanelProps> = ({ visible, onClose, items }) => {
  const [step, setStep] = useState<'cart' | 'confirm' | 'processing' | 'success' | 'error'>('cart');
  const animGroup = useRef<Group>(null);
  const opacityRef = useRef(0);

  // Reset state when closed
  useEffect(() => {
    if (!visible) {
        const timer = setTimeout(() => setStep('cart'), 300);
        return () => clearTimeout(timer);
    }
  }, [visible]);

  useFrame((state, delta) => {
      if (!animGroup.current) return;
      
      const target = visible ? 1 : 0;
      opacityRef.current = MathUtils.lerp(opacityRef.current, target, delta * 12);
      
      const p = opacityRef.current;
      const isVisible = p > 0.001;
      animGroup.current.visible = isVisible;
      
      if (isVisible) {
          animGroup.current.position.z = MathUtils.lerp(-0.15, 0, p);
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

  const handlePay = async () => {
      setStep('processing');
      
      // If we are connected to Shopify, create a real checkout
      if (IS_SHOPIFY_LIVE) {
          try {
              // Filter out items without variant IDs (mock items)
              const lineItems = items
                .filter(item => item.variantId && !item.variantId.startsWith('mock'))
                .map(item => ({
                    variantId: item.variantId,
                    quantity: 1
                }));

              if (lineItems.length === 0) {
                   // Fallback for mixed/mock cart
                   setTimeout(() => setStep('success'), 2000);
                   return;
              }

              const data = await shopifyFetch(CHECKOUT_MUTATION, { lineItems });
              const webUrl = data.checkoutCreate.checkout.webUrl;
              
              // Redirect to Shopify
              window.location.href = webUrl;
          } catch (e) {
              console.error("Checkout failed", e);
              setStep('error');
          }
      } else {
          // Mock Checkout Simulation
          setTimeout(() => {
              setStep('success');
          }, 2500);
      }
  };

  const total = items.reduce((sum, item) => sum + item.price, 0);
  const formattedTotal = `$${total.toLocaleString()}`;
  const displayItems = [...items].reverse().slice(0, 3);

  return (
    <group position={[0.5, -0.3, 0.2]} rotation={[0, -0.2, 0]}>
       <group ref={animGroup}>
           <GlassBase width={0.4} height={0.5} depth={0.02} color="#000" edgeColor={step === 'success' ? '#10b981' : step === 'error' ? '#ef4444' : '#fff'}>
              
              {/* STEP 1: CART LIST */}
              {step === 'cart' && (
                  <>
                    <Text position={[0, 0.2, 0.01]} fontSize={0.03} color="#888" letterSpacing={0.1}>
                        YOUR CART ({items.length})
                    </Text>
                    
                    {items.length === 0 ? (
                        <Text position={[0, 0, 0.01]} fontSize={0.025} color="#444">CART IS EMPTY</Text>
                    ) : (
                        displayItems.map((item, index) => {
                            const yPos = 0.1 - (index * 0.1);
                            return (
                                <CartItemRow 
                                    key={item.id} 
                                    y={yPos} 
                                    label={item.label} 
                                    price={`$${item.price}`} 
                                />
                            );
                        })
                    )}

                    {items.length > 3 && (
                         <Text position={[0, -0.15, 0.01]} fontSize={0.015} color="#666">
                            + {items.length - 3} more items...
                         </Text>
                    )}
                    
                    <group position={[0, -0.2, 0.02]}>
                        <InteractiveItem onClick={() => items.length > 0 && setStep('confirm')} scaleHover={1.05}>
                            <GlassBase width={0.2} height={0.06} color={items.length > 0 ? "#fff" : "#333"} edgeColor={items.length > 0 ? "#fff" : "#333"}>
                                <Text fontSize={0.025} color={items.length > 0 ? "black" : "#666"}>CHECKOUT</Text>
                            </GlassBase>
                        </InteractiveItem>
                    </group>
                  </>
              )}

              {/* STEP 2: CONFIRMATION & PAYMENT */}
              {step === 'confirm' && (
                  <>
                    <Text position={[0, 0.2, 0.01]} fontSize={0.03} color="#888" letterSpacing={0.1}>CHECKOUT</Text>
                    
                    <Text position={[0, 0.12, 0.01]} fontSize={0.02} color="#aaa">TOTAL DUE</Text>
                    <Text position={[0, 0.06, 0.01]} fontSize={0.045} color="#fff" letterSpacing={0.05}>{formattedTotal}</Text>
                    
                    <group position={[0, -0.04, 0.01]}>
                        <GlassBase width={0.35} height={0.06} depth={0.005} color="#111" edgeColor="#555">
                            <Text position={[-0.14, 0, 0.01]} fontSize={0.02} anchorX="left" color="#ccc">
                                {IS_SHOPIFY_LIVE ? "REDIRECT" : "CREDIT CARD"}
                            </Text>
                            <Text position={[0.14, 0, 0.01]} fontSize={0.02} anchorX="right" color="#a855f7">
                                {IS_SHOPIFY_LIVE ? "TO SHOPIFY" : "•••• 4242"}
                            </Text>
                        </GlassBase>
                    </group>

                    <group position={[0, -0.14, 0.02]}>
                        <InteractiveItem onClick={handlePay} scaleHover={1.05}>
                            <GlassBase width={0.25} height={0.06} color="#a855f7" edgeColor="#d8b4fe">
                                <Text fontSize={0.025} color="white">
                                    {IS_SHOPIFY_LIVE ? "PROCEED" : "PAY NOW"}
                                </Text>
                            </GlassBase>
                        </InteractiveItem>
                    </group>

                    <group position={[0, -0.21, 0.02]}>
                        <InteractiveItem onClick={() => setStep('cart')} scaleHover={1.05}>
                             <Text fontSize={0.02} color="#666">CANCEL</Text>
                        </InteractiveItem>
                    </group>
                  </>
              )}

              {/* STEP 3: PROCESSING */}
              {step === 'processing' && (
                  <>
                     <group position={[0, 0.05, 0.02]}>
                        <Spinner />
                     </group>
                     <Text position={[0, -0.1, 0.01]} fontSize={0.025} color="#a855f7" letterSpacing={0.1}>
                        {IS_SHOPIFY_LIVE ? "CREATING SESSION..." : "PROCESSING PAYMENT"}
                     </Text>
                  </>
              )}

              {/* STEP 4: SUCCESS */}
              {step === 'success' && (
                  <>
                     <Text position={[0, 0.15, 0.01]} fontSize={0.03} color="#10b981" letterSpacing={0.1}>ORDER CONFIRMED</Text>
                     <Text position={[0, 0.05, 0.01]} fontSize={0.08} color="#fff">✓</Text>
                     <Text position={[0, -0.05, 0.01]} fontSize={0.02} color="#888">ID: #8821-X9</Text>
                     <Text position={[0, -0.09, 0.01]} fontSize={0.015} color="#666">SENT TO EMAIL</Text>
                     
                     <group position={[0, -0.18, 0.02]}>
                        <InteractiveItem onClick={() => onClose && onClose()} scaleHover={1.05}>
                            <GlassBase width={0.2} height={0.06} color="#111" edgeColor="#10b981">
                                <Text fontSize={0.025} color="#10b981">CLOSE</Text>
                            </GlassBase>
                        </InteractiveItem>
                    </group>
                  </>
              )}

               {/* STEP 5: ERROR */}
               {step === 'error' && (
                  <>
                     <Text position={[0, 0.1, 0.01]} fontSize={0.03} color="#ef4444" letterSpacing={0.1}>ERROR</Text>
                     <Text position={[0, 0, 0.01]} fontSize={0.015} color="#ccc" maxWidth={0.3} textAlign="center">
                        Could not connect to Storefront API. Check console.
                     </Text>
                     
                     <group position={[0, -0.15, 0.02]}>
                        <InteractiveItem onClick={() => setStep('cart')} scaleHover={1.05}>
                            <GlassBase width={0.2} height={0.06} color="#111" edgeColor="#ef4444">
                                <Text fontSize={0.025} color="#ef4444">BACK</Text>
                            </GlassBase>
                        </InteractiveItem>
                    </group>
                  </>
              )}

           </GlassBase>
       </group>
    </group>
  );
};
