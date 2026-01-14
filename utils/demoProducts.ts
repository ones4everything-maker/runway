import { ShopifyProduct } from './shopify';

// Shared demo catalog for fallback/demo mode across Home/Shop/Product views.
export const DEMO_PRODUCTS: ShopifyProduct[] = [
  {
    id: 'p1',
    handle: 'aether-orb',
    label: 'AETHER ORB',
    price: '$850',
    priceVal: 850,
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop',
    variantId: 'mock_v1',
    description: 'Hand-polished obsidian core suspended in a transparent lattice. Ships in a zero-gravity display case.'
  },
  {
    id: 'p2',
    handle: 'chrono-cube',
    label: 'CHRONO CUBE',
    price: '$2,400',
    priceVal: 2400,
    imageUrl: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=400&auto=format&fit=crop',
    variantId: 'mock_v2',
    description: 'Precision-cut timepiece cube with luminous edges and programmable ambient glow.'
  },
  {
    id: 'p3',
    handle: 'void-knot',
    label: 'VOID KNOT',
    price: '$1,100',
    priceVal: 1100,
    imageUrl: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=400&auto=format&fit=crop',
    variantId: 'mock_v3',
    description: 'Interwoven alloy knot that refracts ambient light to create a floating halo.'
  },
  {
    id: 'p4',
    handle: 'neon-shard',
    label: 'NEON SHARD',
    price: '$950',
    priceVal: 950,
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=400&auto=format&fit=crop',
    variantId: 'mock_v4',
    description: 'Crystalline sculpture with internal neon veins and a brushed titanium mount.'
  },
  {
    id: 'p5',
    handle: 'flux-engine',
    label: 'FLUX ENGINE',
    price: '$3,200',
    priceVal: 3200,
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop',
    variantId: 'mock_v5',
    description: 'Conceptual generator block with exposed coils and reversible kinetic display.'
  },
  {
    id: 'p6',
    handle: 'quantum-loop',
    label: 'QUANTUM LOOP',
    price: '$1,800',
    priceVal: 1800,
    imageUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=400&auto=format&fit=crop',
    variantId: 'mock_v6',
    description: 'Floating carbon loop finished with iridescent plating and magnetic levitation base.'
  }
];
