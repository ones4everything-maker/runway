import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { 
    ShoppingBag, 
    X, 
    Plus, 
    Minus, 
    Search, 
    Home, 
    Heart, 
    Menu, 
    Loader2, 
    Send,
    Sparkles,
    Filter,
    ChevronDown,
    Eye,
    Trash2,
    User,
    Mic,
    ChevronLeft,
    ChevronRight,
    Settings,
    FileText,
    Star
} from 'lucide-react';

// --- Shopify Configuration ---
// TO CONNECT YOUR STORE:
// 1. Get your Storefront Access Token from Shopify Admin -> Apps -> Sales Channels -> Headless
// 2. Paste your shop domain (e.g. 'mystore.myshopify.com') and token below.
// 3. Ensure your products have tags like 'theme:purple', 'theme:cyan', 'theme:orange' for styling.
const SHOPIFY_SETUP = {
    domain: (import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || '').trim(), // e.g. 'your-brand.myshopify.com'
    storefrontAccessToken: (import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '').trim(), // e.g. 'shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    apiVersion: (import.meta.env.VITE_SHOPIFY_API_VERSION || '').trim() || '2024-01'
};

// --- App Customization ---
// Edit these values to change the menu options, site title, and sorting.
const APP_CONFIG = {
    siteName: 'ONES4',
    // These items appear in the left sidebar menu
    menuItems: [
        'New Arrivals',
        'Best Sellers',
        'Streetwear',
        'Techwear',
        'Accessories',
        'Sale',
        'Community'
    ],
    // These options appear in the filter dropdown
    sortOptions: [
        { value: 'featured', label: 'Featured' },
        { value: 'rating', label: 'Top Rated' },
        { value: 'price-asc', label: 'Price: Low to High' },
        { value: 'price-desc', label: 'Price: High to Low' },
        { value: 'name-asc', label: 'Name: A to Z' }
    ]
};

// --- Types & Data ---

type ThemeColor = 'purple' | 'cyan' | 'orange';

interface Review {
    id: string;
    user: string;
    rating: number; // 1-5
    comment: string;
    date: string;
}

interface ProductItem {
    id: string;
    name: string;
    price: number;
    image: string;
    theme: ThemeColor;
    tags: string[];
    description?: string;
    reviews: Review[];
}

interface CartItem extends ProductItem {
    quantity: number;
}

// Fallback data used when Shopify config is empty or fetch fails
const MOCK_ITEMS: ProductItem[] = [
    {
        id: '1',
        name: 'Unisex Oversized Hoodie',
        price: 120.00,
        image: 'https://images.unsplash.com/photo-1551488852-080175b21631?auto=format&fit=crop&q=80&w=800',
        theme: 'purple',
        tags: ['streetwear', 'cotton', 'unisex'],
        description: 'Premium heavyweight cotton blend with a relaxed drop-shoulder fit. Perfect for layering in any cyberpunk cityscape.',
        reviews: [
            { id: 'r1', user: 'Alex K.', rating: 5, comment: 'Incredible quality. The fit is exactly what I was looking for.', date: '2023-11-15' },
            { id: 'r2', user: 'Jordan M.', rating: 4, comment: 'Super comfy, but runs a bit large.', date: '2023-12-02' }
        ]
    },
    {
        id: '2',
        name: 'Tech Zipper Jacket',
        price: 150.00,
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
        theme: 'cyan',
        tags: ['outerwear', 'waterproof', 'tech'],
        description: 'Engineered for the elements. Features waterproof ballistic nylon and concealed magnetic pockets for your tech essentials.',
        reviews: [
            { id: 'r3', user: 'Sarah Connor', rating: 5, comment: 'Essential gear for the rainy season. Looks futuristic.', date: '2024-01-10' }
        ]
    },
    {
        id: '3',
        name: 'Crop Top Thermal',
        price: 65.00,
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
        theme: 'orange',
        tags: ['women', 'sport', 'yellow'],
        description: 'Moisture-wicking thermal fabric with a high-visibility neon finish. Designed for high-performance motion.',
        reviews: []
    },
    {
        id: '4',
        name: 'Vaporwave Cargo',
        price: 95.00,
        image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800',
        theme: 'purple',
        tags: ['pants', 'denim', 'black'],
        description: 'Utility meets aesthetics. Loose fit denim with extended straps and deep cargo pockets for urban utility.',
        reviews: [
            { id: 'r4', user: 'Mike D.', rating: 3, comment: 'Cool pants but the straps get caught on things easily.', date: '2023-10-30' },
            { id: 'r5', user: 'Jenny', rating: 5, comment: 'My favorite pants ever!', date: '2023-11-05' }
        ]
    },
    {
        id: '5',
        name: 'Verz4 Tactical Bag',
        price: 30.00,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
        theme: 'cyan',
        tags: ['accessories', 'bag', 'utility'],
        description: 'Compact tactical storage. Modular attachment system allows you to secure it to any compatible outerwear.',
        reviews: [
            { id: 'r6', user: 'Operator', rating: 5, comment: 'Perfect size for daily carry.', date: '2024-01-15' }
        ]
    },
    {
        id: '6',
        name: 'Neon Soul Serum',
        price: 13.50,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
        theme: 'orange',
        tags: ['accessories', 'lifestyle'],
        description: 'A limited edition energy supplement bottle. Note: This is a collectible art piece.',
        reviews: []
    }
];

// --- Utilities ---

const themeStyles = {
    purple: {
        border: 'border-purple-500/30',
        glow: 'shadow-purple-500/20',
        btn: 'bg-purple-600 hover:bg-purple-500',
        text: 'text-purple-400',
        borderFocus: 'focus:border-purple-500',
        imageGlow: 'shadow-[0_0_25px_-5px_rgba(168,85,247,0.4)] border border-purple-500/40',
        iconHover: 'hover:text-purple-400'
    },
    cyan: {
        border: 'border-cyan-500/30',
        glow: 'shadow-cyan-500/20',
        btn: 'bg-cyan-600 hover:bg-cyan-500',
        text: 'text-cyan-400',
        borderFocus: 'focus:border-cyan-500',
        imageGlow: 'shadow-[0_0_25px_-5px_rgba(6,182,212,0.4)] border border-cyan-500/40',
        iconHover: 'hover:text-cyan-400'
    },
    orange: {
        border: 'border-orange-500/30',
        glow: 'shadow-orange-500/20',
        btn: 'bg-orange-500 hover:bg-orange-400',
        text: 'text-orange-400',
        borderFocus: 'focus:border-orange-500',
        imageGlow: 'shadow-[0_0_25px_-5px_rgba(249,115,22,0.4)] border border-orange-500/40',
        iconHover: 'hover:text-orange-400'
    }
};

const StarDisplay = ({ rating, size = 14, className = "" }: { rating: number, size?: number, className?: string }) => {
    return (
        <div className={`flex items-center gap-0.5 ${className}`}>
            {[1, 2, 3, 4, 5].map(star => (
                <Star 
                    key={star} 
                    size={size} 
                    fill={star <= rating ? "currentColor" : "none"}
                    className={`${star <= rating ? 'text-yellow-400' : 'text-slate-600'}`} 
                />
            ))}
        </div>
    );
};

// --- API Service ---

async function fetchProducts(): Promise<ProductItem[]> {
    // If config is missing, return mock data immediately
    if (!SHOPIFY_SETUP.domain || !SHOPIFY_SETUP.storefrontAccessToken) {
        // Use a larger mock set for pagination demo
        const extraItems = MOCK_ITEMS.map((item, i) => ({
             ...item, 
             id: `${item.id}-copy-${i}`, 
             name: `${item.name} V2`,
             reviews: [] 
        }));
        return new Promise(resolve => setTimeout(() => resolve([...MOCK_ITEMS, ...extraItems]), 800));
    }

    const query = `
    {
      products(first: 20) {
        edges {
          node {
            id
            title
            description
            tags
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  price {
                    amount
                  }
                }
              }
            }
          }
        }
      }
    }`;

    try {
        const response = await fetch(`https://${SHOPIFY_SETUP.domain}/api/${SHOPIFY_SETUP.apiVersion}/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': SHOPIFY_SETUP.storefrontAccessToken,
            },
            body: JSON.stringify({ query })
        });

        const json = await response.json();
        
        if (json.errors) {
            console.error("Shopify API Errors:", json.errors);
            return MOCK_ITEMS;
        }

        return json.data.products.edges.map((edge: any) => {
            const p = edge.node;
            const price = parseFloat(p.variants.edges[0]?.node.price.amount || '0');
            const image = p.images.edges[0]?.node.url || '';
            
            // Derive theme from tags or use a deterministic fallback based on ID
            let theme: ThemeColor = 'cyan';
            if (p.tags.some((t: string) => t.includes('purple'))) theme = 'purple';
            else if (p.tags.some((t: string) => t.includes('orange'))) theme = 'orange';
            else if (p.tags.some((t: string) => t.includes('cyan'))) theme = 'cyan';
            else {
                // Deterministic random theme if no tag present
                const lastChar = p.id.slice(-1).charCodeAt(0);
                if (lastChar % 3 === 0) theme = 'purple';
                else if (lastChar % 3 === 1) theme = 'orange';
            }

            return {
                id: p.id, // Storefront ID
                name: p.title,
                price: price,
                image: image,
                theme: theme,
                tags: p.tags,
                description: p.description,
                reviews: [] // Initialize empty reviews for fetched products
            };
        });

    } catch (error) {
        console.error("Failed to connect to Shopify:", error);
        return MOCK_ITEMS;
    }
}

// --- Components ---

const SetupGuide = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#151621] w-full max-w-2xl rounded-2xl border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-cyan-950/20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400">
                            <Settings size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Developer Setup Guide</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"><X size={24}/></button>
                </div>
                <div className="p-8 overflow-y-auto space-y-8 text-slate-300 custom-scrollbar">
                    <section>
                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                            <span className="bg-cyan-600 text-white text-xs px-2 py-0.5 rounded">1</span> 
                            Connect Shopify Store
                        </h3>
                        <p className="mb-3">To load real products, edit the <code className="text-cyan-400 bg-black/30 px-1.5 py-0.5 rounded border border-white/5">SHOPIFY_SETUP</code> object at the top of <code className="text-orange-400 bg-black/30 px-1.5 py-0.5 rounded border border-white/5">index.tsx</code>:</p>
                        <div className="bg-black/50 p-4 rounded-xl border border-white/5 font-mono text-xs md:text-sm overflow-x-auto">
                            <span className="text-purple-400">const</span> <span className="text-yellow-200">SHOPIFY_SETUP</span> = {'{'}<br/>
                            &nbsp;&nbsp;domain: <span className="text-green-400">'your-store.myshopify.com'</span>,<br/>
                            &nbsp;&nbsp;storefrontAccessToken: <span className="text-green-400">'your-public-access-token'</span>,<br/>
                            &nbsp;&nbsp;apiVersion: <span className="text-green-400">'2026-01'</span><br/>
                            {'}'};
                        </div>
                        <div className="mt-4 bg-black/40 p-4 rounded-xl border border-cyan-500/20 text-xs text-slate-200 space-y-2">
                            <div className="font-semibold text-cyan-300">Storefront scopes to enable:</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-slate-300">
                                <span>unauthenticated_read_product_listings</span>
                                <span>unauthenticated_read_product_inventory</span>
                                <span>unauthenticated_read_product_tags</span>
                                <span>unauthenticated_read_product_pickup_locations</span>
                                <span>unauthenticated_read_customers</span>
                                <span>unauthenticated_write_customers</span>
                                <span>unauthenticated_read_customer_tags</span>
                                <span>unauthenticated_read_content</span>
                                <span>unauthenticated_read_checkouts</span>
                                <span>unauthenticated_write_checkouts</span>
                                <span>unauthenticated_read_selling_plans</span>
                                <span>unauthenticated_read_metaobjects</span>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                            <span className="bg-cyan-600 text-white text-xs px-2 py-0.5 rounded">2</span> 
                            Customize Menu & Options
                        </h3>
                        <p className="mb-3">Modify the <code className="text-cyan-400 bg-black/30 px-1.5 py-0.5 rounded border border-white/5">APP_CONFIG</code> object to change the site name, side menu items, and sort options.</p>
                        <div className="bg-black/50 p-4 rounded-xl border border-white/5 font-mono text-xs md:text-sm overflow-x-auto">
                            <span className="text-purple-400">const</span> <span className="text-yellow-200">APP_CONFIG</span> = {'{'}<br/>
                            &nbsp;&nbsp;siteName: <span className="text-green-400">'{APP_CONFIG.siteName}'</span>,<br/>
                            &nbsp;&nbsp;menuItems: [<span className="text-green-400">'New Arrivals'</span>, <span className="text-green-400">'Sale'</span>...],<br/>
                             &nbsp;&nbsp;sortOptions: [...]<br/>
                            {'}'};
                        </div>
                    </section>
                </div>
                <div className="p-6 border-t border-white/10 bg-[#0B0C15] flex justify-end">
                    <button onClick={onClose} className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-cyan-900/40">
                        Got it, thanks!
                    </button>
                </div>
            </div>
        </div>
    );
}

const Navbar = ({ 
    cartCount, 
    onOpenCart, 
    onOpenMenu,
    searchTerm, 
    setSearchTerm 
}: { 
    cartCount: number, 
    onOpenCart: () => void,
    onOpenMenu: () => void,
    searchTerm: string,
    setSearchTerm: (t: string) => void
}) => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0C15]/80 backdrop-blur-md border-b border-white/10 h-16 md:h-20 flex items-center px-4 md:px-8 justify-between shadow-2xl">
            {/* Left: Logo & Menu */}
            <div className="flex items-center gap-4 md:gap-6">
                <button 
                    onClick={onOpenMenu}
                    className="text-white/80 hover:text-white transition-colors"
                >
                    <Menu size={24} />
                </button>
                <h1 className="text-xl md:text-2xl font-bold text-white tracking-widest font-sans">{APP_CONFIG.siteName}</h1>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-grow max-w-xl px-4 md:px-8">
                <div className="relative group">
                    <div className="absolute inset-0 bg-cyan-500/20 blur-md rounded-full group-focus-within:bg-cyan-500/30 transition-all duration-300"></div>
                    <div className="relative flex items-center bg-[#151621] border border-cyan-500/40 rounded-full overflow-hidden shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]">
                        <div className="pl-4 text-cyan-400">
                           {/* <Search size={18} /> */}
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search database..." 
                            className="w-full bg-transparent text-white px-4 py-2 md:py-2.5 focus:outline-none placeholder-slate-500 text-sm md:text-base"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="pr-4 text-slate-400 hover:text-white transition-colors">
                            <Mic size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4 md:gap-6">
                <button className="p-2 text-white/80 hover:text-white transition-colors">
                    <User size={24} />
                </button>
                
                <button 
                    onClick={onOpenCart}
                    className="relative p-2 text-white/80 hover:text-cyan-400 transition-colors group"
                >
                    <ShoppingBag size={24} className="group-hover:scale-110 transition-transform" />
                    {cartCount > 0 && (
                        <span className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0B0C15] animate-in zoom-in">
                            {cartCount}
                        </span>
                    )}
                </button>
            </div>
        </nav>
    );
};

const MenuDrawer = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />}
            <div className={`fixed inset-y-0 left-0 w-[300px] bg-[#151621] border-r border-white/10 z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-white tracking-widest">{APP_CONFIG.siteName}</h2>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="space-y-2">
                        {APP_CONFIG.menuItems.map((item, index) => (
                            <button 
                                key={index}
                                onClick={onClose}
                                className="w-full text-left py-3 px-4 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors font-medium flex items-center justify-between group"
                            >
                                {item}
                                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                            </button>
                        ))}
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/10 text-center text-slate-500 text-xs">
                         <p>© 2024 {APP_CONFIG.siteName} Inc.</p>
                         <p className="mt-1">Version 2.0.4</p>
                    </div>
                </div>
            </div>
        </>
    );
};

const Pagination = ({ 
    itemsPerPage, 
    totalItems, 
    paginate, 
    currentPage 
}: { 
    itemsPerPage: number, 
    totalItems: number, 
    paginate: (page: number) => void, 
    currentPage: number 
}) => {
    const pageNumbers = [];
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 mt-12 mb-8">
            <button 
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-[#151621] border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
            >
                <ChevronLeft size={20} />
            </button>
            
            {pageNumbers.map(number => (
                <button 
                    key={number} 
                    onClick={() => paginate(number)}
                    className={`w-10 h-10 rounded-lg border font-bold text-sm transition-all duration-300 ${
                        currentPage === number 
                            ? 'bg-cyan-600 border-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]' 
                            : 'bg-[#151621] border-white/10 text-slate-400 hover:text-white hover:border-white/30'
                    }`}
                >
                    {number}
                </button>
            ))}

            <button 
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-[#151621] border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

const ProductCard: React.FC<{ 
    item: ProductItem, 
    onAdd: (item: ProductItem, e: React.MouseEvent) => void,
    onQuickView: (item: ProductItem) => void,
    isFavorite: boolean,
    onToggleFavorite: (id: string) => void
}> = ({ item, onAdd, onQuickView, isFavorite, onToggleFavorite }) => {
    const styles = themeStyles[item.theme];
    const avgRating = item.reviews.length > 0 
        ? item.reviews.reduce((acc, r) => acc + r.rating, 0) / item.reviews.length 
        : 0;

    return (
        <div className={`bg-[#151621] rounded-2xl overflow-hidden border ${styles.border} flex flex-col group relative`}>
            {/* Quick View Button (Top Left) */}
            <button 
                onClick={() => onQuickView(item)}
                className={`absolute top-3 left-3 z-10 p-2 bg-black/40 backdrop-blur-sm rounded-full text-white/70 ${styles.iconHover} transition-colors`}
                title="Quick View"
            >
                <Eye size={18} />
            </button>

             {/* Heart Icon Overlay (Top Right) */}
             <button 
                onClick={() => onToggleFavorite(item.id)}
                className={`absolute top-3 right-3 z-10 p-2 bg-black/40 backdrop-blur-sm rounded-full transition-colors ${isFavorite ? 'text-pink-500' : 'text-white/70 hover:text-white'}`}
            >
                <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
            </button>

            <div className="relative aspect-[4/5] overflow-hidden cursor-pointer p-4 pb-0" onClick={() => onQuickView(item)}>
                <img 
                    src={item.image} 
                    alt={item.name} 
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-xl ${styles.imageGlow}`}
                />
            </div>
            
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-1">
                    <h3 className={`text-white font-bold text-lg leading-tight cursor-pointer ${styles.iconHover} transition-colors pr-2`} onClick={() => onQuickView(item)}>
                        {item.name}
                    </h3>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                     <p className="text-slate-400 text-sm">${item.price.toFixed(2)}</p>
                     {item.reviews.length > 0 && (
                        <div className="flex items-center gap-1 text-xs font-medium text-slate-300">
                             <Star size={12} className="text-yellow-400 fill-yellow-400"/>
                             <span>{avgRating.toFixed(1)}</span>
                             <span className="text-slate-500">({item.reviews.length})</span>
                        </div>
                     )}
                </div>
                
                <div className="mt-auto">
                    <button 
                        onClick={(e) => onAdd(item, e)}
                        className={`w-full py-3 rounded-lg font-bold text-white tracking-wide transition-all duration-300 ${styles.btn} shadow-lg shadow-black/20`}
                    >
                        ADD TO CART
                    </button>
                </div>
            </div>
        </div>
    );
};

const QuickViewModal: React.FC<{ 
    item: ProductItem | null, 
    isOpen: boolean, 
    onClose: () => void,
    onAdd: (item: ProductItem, e: React.MouseEvent) => void,
    onAddReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void
}> = ({ item, isOpen, onClose, onAdd, onAddReview }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    if (!isOpen || !item) return null;

    const styles = themeStyles[item.theme];
    const avgRating = item.reviews.length > 0 
        ? item.reviews.reduce((acc, r) => acc + r.rating, 0) / item.reviews.length 
        : 0;

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        onAddReview(item.id, {
            user: 'Guest User',
            rating,
            comment
        });
        setComment('');
        setRating(5);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            
            <div className={`relative bg-[#151621] w-full max-w-5xl h-[85vh] rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200`}>
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 z-20 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Image Section (Sticky on desktop) */}
                <div className="w-full md:w-5/12 p-6 flex items-center justify-center bg-[#0B0C15]/50 h-60 md:h-full shrink-0">
                    <div className="relative w-full h-full md:aspect-[3/4]">
                        <img 
                            src={item.image} 
                            alt={item.name} 
                            className={`w-full h-full object-cover rounded-xl ${styles.imageGlow}`}
                        />
                    </div>
                </div>

                {/* Content Section (Scrollable) */}
                <div className="w-full md:w-7/12 flex flex-col h-full overflow-hidden">
                    <div className="p-6 md:p-8 flex-grow overflow-y-auto custom-scrollbar">
                        {/* Header Details */}
                        <div className="mb-2">
                            {item.tags.map(tag => (
                                <span key={tag} className="inline-block px-2 py-1 mr-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white/5 rounded-md">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        
                        <h2 className="text-3xl font-black text-white mb-2 leading-tight">{item.name}</h2>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <p className={`text-2xl font-bold ${styles.text}`}>${item.price.toFixed(2)}</p>
                            <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                                <StarDisplay rating={Math.round(avgRating)} size={16} />
                                <span className="text-white text-sm font-bold">{avgRating.toFixed(1)}</span>
                                <span className="text-slate-500 text-xs">({item.reviews.length} reviews)</span>
                            </div>
                        </div>

                        <p className="text-slate-300 leading-relaxed mb-8">
                            {item.description || "Experience the future of streetwear with our signature design. Crafted for durability and style in the neon-lit metropolis."}
                        </p>

                        <div className="space-y-4 mb-10 border-b border-white/10 pb-8">
                            <button 
                                onClick={(e) => {
                                    onAdd(item, e);
                                }}
                                className={`w-full py-4 rounded-xl font-bold text-white text-lg tracking-wide transition-all duration-300 ${styles.btn} shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:scale-[1.02]`}
                            >
                                ADD TO CART
                            </button>
                        </div>

                        {/* Reviews Section */}
                        <div>
                            <h3 className="text-xl font-bold text-white mb-6">Reviews</h3>
                            
                            {/* Review Form */}
                            <form onSubmit={handleSubmitReview} className="mb-8 bg-white/5 p-4 rounded-xl border border-white/5">
                                <h4 className="text-sm font-bold text-slate-300 mb-3">Write a review</h4>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-xs text-slate-500 uppercase font-bold">Rating:</span>
                                    <div className="flex gap-1">
                                        {[1,2,3,4,5].map(star => (
                                            <button 
                                                key={star} 
                                                type="button" 
                                                onClick={() => setRating(star)}
                                                className="focus:outline-none transition-transform hover:scale-110"
                                            >
                                                <Star 
                                                    size={20} 
                                                    className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-600"} 
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Share your thoughts..."
                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-cyan-500/50 mb-3 h-24 resize-none"
                                    required
                                />
                                <div className="flex justify-end">
                                    <button 
                                        type="submit" 
                                        className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-lg transition-colors"
                                    >
                                        Submit Review
                                    </button>
                                </div>
                            </form>

                            {/* Reviews List */}
                            <div className="space-y-4">
                                {item.reviews.length === 0 ? (
                                    <p className="text-slate-500 text-center py-4">No reviews yet. Be the first to review!</p>
                                ) : (
                                    [...item.reviews].reverse().map(review => (
                                        <div key={review.id} className="bg-white/5 p-4 rounded-xl border border-white/5">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-400 font-bold text-xs">
                                                        {review.user.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-white text-sm font-bold">{review.user}</p>
                                                        <StarDisplay rating={review.rating} size={12} />
                                                    </div>
                                                </div>
                                                <span className="text-xs text-slate-500">{review.date}</span>
                                            </div>
                                            <p className="text-slate-300 text-sm leading-relaxed">
                                                {review.comment}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Header = () => (
    <div className="pt-8 pb-4 px-4">
        <div className="flex justify-center mb-6 relative">
             <h1 className="text-5xl md:text-6xl font-black text-white tracking-widest uppercase neon-text-cyan text-center">
                {APP_CONFIG.siteName}
            </h1>
        </div>
    </div>
);

const CartDrawer = ({ items, isOpen, onClose, updateQuantity }: { items: CartItem[], isOpen: boolean, onClose: () => void, updateQuantity: (id: string, delta: number) => void }) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />}
            <div className={`fixed inset-x-0 bottom-0 md:top-0 md:left-auto md:right-0 md:bottom-auto md:h-full md:w-[400px] h-[85vh] bg-[#151621] md:border-l border-t md:border-t-0 border-white/10 z-50 transform transition-transform duration-300 ease-out rounded-t-3xl md:rounded-none ${isOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full'}`}>
                <div className="p-6 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <ShoppingBag className="text-cyan-400" />
                            <h2 className="text-2xl font-bold text-white">Cart</h2>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                        {items.length === 0 ? (
                            <div className="text-center text-slate-500 mt-20">
                                <p>Your bag is empty.</p>
                            </div>
                        ) : (
                            items.map(item => (
                                <div key={item.id} className="flex gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                                    <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-lg" />
                                    <div className="flex-grow flex flex-col justify-between py-1">
                                        <div>
                                            <h4 className="font-bold text-white text-sm line-clamp-1">{item.name}</h4>
                                            <p className="text-cyan-400 font-bold">${item.price}</p>
                                        </div>
                                        <div className="flex items-center gap-4 bg-black/30 w-fit rounded-lg p-1">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-white text-slate-400"><Minus size={14} /></button>
                                            <span className="text-white text-sm font-bold w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-white text-slate-400"><Plus size={14} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="border-t border-white/10 pt-6 mt-4">
                        <div className="flex justify-between items-center mb-4 text-xl font-bold text-white">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <button className="w-full py-4 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-500 transition-colors uppercase tracking-wider shadow-lg shadow-cyan-900/50">
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

const FavoritesDrawer = ({ 
    items, 
    isOpen, 
    onClose, 
    onRemove, 
    onMoveToCart 
}: { 
    items: ProductItem[], 
    isOpen: boolean, 
    onClose: () => void, 
    onRemove: (id: string) => void,
    onMoveToCart: (item: ProductItem) => void
}) => {
    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />}
            <div className={`fixed inset-x-0 bottom-0 md:top-0 md:left-auto md:right-0 md:bottom-auto md:h-full md:w-[400px] h-[85vh] bg-[#151621] md:border-l border-t md:border-t-0 border-white/10 z-50 transform transition-transform duration-300 ease-out rounded-t-3xl md:rounded-none ${isOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full'}`}>
                <div className="p-6 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <Heart className="text-pink-500" fill="currentColor" />
                            <h2 className="text-2xl font-bold text-white">Favorites</h2>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                        {items.length === 0 ? (
                            <div className="text-center text-slate-500 mt-20">
                                <Heart size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No favorites yet.</p>
                            </div>
                        ) : (
                            items.map(item => (
                                <div key={item.id} className="flex gap-4 p-3 bg-white/5 rounded-xl border border-white/5 group">
                                    <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-lg" />
                                    <div className="flex-grow flex flex-col justify-between py-1">
                                        <div>
                                            <h4 className="font-bold text-white text-sm line-clamp-1">{item.name}</h4>
                                            <p className="text-slate-400 font-bold">${item.price}</p>
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            <button 
                                                onClick={() => onMoveToCart(item)}
                                                className="flex-grow py-1.5 bg-white/10 hover:bg-cyan-600 text-xs font-bold uppercase rounded text-white transition-colors"
                                            >
                                                Add to Cart
                                            </button>
                                            <button 
                                                onClick={() => onRemove(item.id)}
                                                className="p-1.5 bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-500 rounded transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

const AIStylist = ({ isOpen, onClose, onRecommend, items }: { isOpen: boolean, onClose: () => void, onRecommend: (id: string) => void, items: ProductItem[] }) => {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
        {role: 'model', text: 'Hey there! I\'m your Ones4 Stylist. Looking for a specific vibe or outfit recommendation?'}
    ]);
    const [isThinking, setIsThinking] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        const userMsg = query;
        setQuery('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsThinking(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const inventory = items.map(i => 
                `ID: ${i.id}, Name: ${i.name}, Price: $${i.price}, Style: ${i.tags.join(', ')}`
            ).join('\n');

            const prompt = `
            You are a trendy fashion stylist for "Ones4", a futuristic streetwear brand.
            
            Inventory:
            ${inventory}

            User says: "${userMsg}"

            1. Recommend 1 item from our inventory if it fits the request.
            2. Be cool, concise, and helpful. 
            3. If you recommend an item, mention its exact Name.
            `;

            const result = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
            });

            const responseText = result.text || "I'm having trouble connecting to the fashion mainframe.";
            setMessages(prev => [...prev, { role: 'model', text: responseText }]);

            // Simple keyword matching to find recommended items
            const recommendedItem = items.find(item => responseText.includes(item.name));
            if (recommendedItem) {
                onRecommend(recommendedItem.id);
            }

        } catch (error) {
            setMessages(prev => [...prev, { role: 'model', text: "Connection error. Try again." }]);
        } finally {
            setIsThinking(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#151621] w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col h-[600px]">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0B0C15]">
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-cyan-400" size={20} />
                        <h3 className="font-bold text-white text-lg">Ones4 Stylist</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                msg.role === 'user' 
                                ? 'bg-cyan-600 text-white rounded-tr-none' 
                                : 'bg-white/10 text-slate-200 rounded-tl-none'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isThinking && (
                        <div className="flex justify-start">
                            <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                                <Loader2 className="animate-spin text-cyan-400" size={16} />
                                <span className="text-xs text-slate-400">Thinking...</span>
                            </div>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSend} className="p-4 bg-[#0B0C15] border-t border-white/10">
                    <div className="relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask for an outfit..."
                            className="w-full bg-[#1E1F2E] border border-white/10 rounded-full py-3 px-5 pr-12 text-white focus:outline-none focus:border-cyan-500/50"
                        />
                        <button 
                            type="submit"
                            disabled={!query.trim() || isThinking}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-cyan-600 rounded-full text-white disabled:opacity-50 hover:bg-cyan-500 transition-colors"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Animation Components ---

interface FlyingItemProps {
    src: string;
    start: DOMRect;
    end: DOMRect;
    onComplete: () => void;
}

const FlyingItem: React.FC<FlyingItemProps> = ({ src, start, end, onComplete }) => {
    const [style, setStyle] = useState<React.CSSProperties>({
        position: 'fixed',
        top: start.top,
        left: start.left,
        width: '64px',
        height: '64px',
        objectFit: 'cover',
        borderRadius: '8px',
        zIndex: 100,
        opacity: 1,
        transform: 'scale(1)',
        transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)'
    });

    useEffect(() => {
        // Trigger animation next frame to ensure initial render position is correct
        requestAnimationFrame(() => {
            setStyle({
                position: 'fixed',
                top: end.top + (end.height/2) - 10,
                left: end.left + (end.width/2) - 10,
                width: '20px',
                height: '20px',
                objectFit: 'cover',
                borderRadius: '50%',
                zIndex: 100,
                opacity: 0, // Fade out at the very end
                transform: 'scale(0.5)',
                transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)'
            });
        });

        const timer = setTimeout(onComplete, 800);
        return () => clearTimeout(timer);
    }, []);

    return <img src={src} style={style} alt="" className="pointer-events-none shadow-2xl border border-white/20" />;
};

// --- Main App ---

export default function App() {
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
    const [isStylistOpen, setIsStylistOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSetupOpen, setIsSetupOpen] = useState(false);

    const [activeTag, setActiveTag] = useState('All');
    const [sortOption, setSortOption] = useState('featured');
    
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    
    // New State for features
    const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Animation state
    const [flyingItems, setFlyingItems] = useState<{id: number, src: string, start: DOMRect, end: DOMRect}[]>([]);
    const cartBtnRef = useRef<HTMLButtonElement>(null);

    // Initial Load & Setup Check
    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            const items = await fetchProducts();
            setProducts(items);
            setIsLoading(false);
        };
        load();

        // Check if setup is needed
        if (!SHOPIFY_SETUP.domain || !SHOPIFY_SETUP.storefrontAccessToken) {
            const hasSeenGuide = sessionStorage.getItem('hasSeenSetupGuide');
            if (!hasSeenGuide) {
                setTimeout(() => setIsSetupOpen(true), 1000);
            }
        }
    }, []);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, activeTag, sortOption]);

    const addToCart = (item: ProductItem, e?: React.MouseEvent) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });

        // Trigger animation
        if (e && cartBtnRef.current) {
            const startRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const endRect = cartBtnRef.current.getBoundingClientRect();
            
            const animId = Date.now();
            setFlyingItems(prev => [...prev, {
                id: animId,
                src: item.image,
                start: startRect,
                end: endRect
            }]);
        }
    };

    const toggleFavorite = (id: string) => {
        setFavorites(prev => 
            prev.includes(id) 
            ? prev.filter(fid => fid !== id) 
            : [...prev, id]
        );
    };

    const removeFlyingItem = (id: number) => {
        setFlyingItems(prev => prev.filter(i => i.id !== id));
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(i => {
            if (i.id === id) return { ...i, quantity: Math.max(0, i.quantity + delta) };
        }).filter(i => i && i.quantity > 0) as CartItem[]);
    };

    // Handler for adding reviews
    const handleAddReview = (productId: string, review: Omit<Review, 'id' | 'date'>) => {
        const newReview: Review = {
            ...review,
            id: `new-${Date.now()}`,
            date: new Date().toLocaleDateString()
        };

        // Update Products State
        setProducts(prevProducts => prevProducts.map(p => {
            if (p.id === productId) {
                return { ...p, reviews: [...p.reviews, newReview] };
            }
            return p;
        }));

        // Update QuickViewModal state if it's the current product
        if (quickViewProduct && quickViewProduct.id === productId) {
            setQuickViewProduct(prev => prev ? { ...prev, reviews: [...prev.reviews, newReview] } : null);
        }
    };

    // Filter and Sort Logic
    const filteredAndSortedItems = products
        .filter(item => {
            // Tag Filter
            const matchesTag = activeTag === 'All' || item.tags.includes(activeTag);
            
            // Search Filter
            const lowerQuery = searchTerm.toLowerCase();
            const matchesSearch = item.name.toLowerCase().includes(lowerQuery) || 
                                  item.tags.some(tag => tag.toLowerCase().includes(lowerQuery));

            return matchesTag && matchesSearch;
        })
        .sort((a, b) => {
            // Helper for rating calculation
            const getRating = (p: ProductItem) => 
                p.reviews.length > 0 ? p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length : 0;

            switch (sortOption) {
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                case 'rating': return getRating(b) - getRating(a);
                case 'name-asc': return a.name.localeCompare(b.name);
                default: return 0; // featured/original order
            }
        });

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAndSortedItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalItems = filteredAndSortedItems.length;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const cartCount = cart.reduce((a, b) => a + b.quantity, 0);
    const favoritedItems = products.filter(item => favorites.includes(item.id));

    return (
        <div className="min-h-screen pb-24 font-sans text-slate-200">
            {/* Navbar */}
            <Navbar 
                cartCount={cartCount} 
                onOpenCart={() => setIsCartOpen(true)}
                onOpenMenu={() => setIsMenuOpen(true)}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            {/* Flying Items Layer */}
            {flyingItems.map(item => (
                <FlyingItem 
                    key={item.id} 
                    src={item.src} 
                    start={item.start} 
                    end={item.end} 
                    onComplete={() => removeFlyingItem(item.id)} 
                />
            ))}

            <div className="max-w-7xl mx-auto pt-20"> {/* Added padding for fixed header */}
                <Header />

                <main className="px-4">
                    {/* Controls Section */}
                    <div className="mb-8 space-y-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-200 uppercase tracking-wide mb-1">
                                    Collection
                                </h2>
                                <p className="text-slate-400 text-sm font-medium">
                                    {isLoading ? (
                                        <span className="flex items-center gap-2 text-slate-500">
                                            <Loader2 size={14} className="animate-spin" /> Loading inventory...
                                        </span>
                                    ) : (
                                        <>Showing <span className="text-cyan-400">{filteredAndSortedItems.length}</span> {filteredAndSortedItems.length === 1 ? 'item' : 'items'}</>
                                    )}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                {/* Search Bar removed from here, now in Header */}

                                {/* Sort Dropdown */}
                                <div className="flex items-center gap-3 bg-[#151621] border border-white/10 rounded-lg p-1.5 pr-3 shadow-lg w-full md:w-auto">
                                    <div className="p-1.5 text-cyan-400">
                                        <Filter size={16} />
                                    </div>
                                    <div className="relative flex-grow">
                                        <select 
                                            value={sortOption}
                                            onChange={(e) => setSortOption(e.target.value)}
                                            className="bg-transparent text-white text-sm font-bold focus:outline-none appearance-none cursor-pointer w-full md:w-auto min-w-[140px] pr-8 py-1"
                                        >
                                            {APP_CONFIG.sortOptions.map(opt => (
                                                <option key={opt.value} value={opt.value} className="bg-[#151621]">{opt.label}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoading ? (
                            // Skeleton Loading State
                            Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="bg-[#151621] rounded-2xl overflow-hidden border border-white/5 h-[500px] animate-pulse">
                                    <div className="bg-white/5 h-[400px] w-full" />
                                    <div className="p-4 space-y-3">
                                        <div className="h-6 bg-white/5 rounded w-3/4" />
                                        <div className="h-4 bg-white/5 rounded w-1/4" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            currentItems.map(item => (
                                <ProductCard 
                                    key={item.id} 
                                    item={item} 
                                    onAdd={addToCart} 
                                    onQuickView={(item) => setQuickViewProduct(item)}
                                    isFavorite={favorites.includes(item.id)}
                                    onToggleFavorite={toggleFavorite}
                                />
                            ))
                        )}
                        
                        {!isLoading && filteredAndSortedItems.length === 0 && (
                            <div className="col-span-full py-20 text-center text-slate-500">
                                <Search size={48} className="mx-auto mb-4 opacity-50" />
                                <p className="text-lg">No items match your search.</p>
                                <button 
                                    onClick={() => {
                                        setActiveTag('All');
                                        setSearchTerm('');
                                    }}
                                    className="mt-4 text-cyan-400 hover:text-cyan-300 font-bold"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {!isLoading && (
                        <Pagination 
                            itemsPerPage={itemsPerPage} 
                            totalItems={totalItems} 
                            paginate={paginate} 
                            currentPage={currentPage}
                        />
                    )}
                </main>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#151621]/90 backdrop-blur-lg border border-white/10 rounded-full px-6 py-3 flex items-center gap-6 md:gap-8 shadow-2xl z-40">
                <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors"
                >
                    <Home size={24} />
                    <span className="text-[10px] font-bold uppercase">Home</span>
                </button>

                <button 
                    onClick={() => setIsFavoritesOpen(true)}
                    className="flex flex-col items-center gap-1 text-slate-400 hover:text-pink-500 transition-colors relative"
                >
                    <Heart size={24} />
                    {favorites.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-in fade-in zoom-in">
                            {favorites.length}
                        </span>
                    )}
                    <span className="text-[10px] font-bold uppercase">Faves</span>
                </button>

                <button 
                    onClick={() => setIsStylistOpen(true)}
                    className="relative -top-6 bg-cyan-500 hover:bg-cyan-400 text-white p-4 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all duration-300 hover:scale-105 border-4 border-[#0B0C15]"
                >
                    <Sparkles size={28} />
                </button>

                <button 
                    ref={cartBtnRef}
                    onClick={() => setIsCartOpen(true)}
                    className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors relative"
                >
                    <div className="relative">
                        <ShoppingBag size={24} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-neon-purple text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full bg-purple-600 transition-transform duration-200 animate-in fade-in zoom-in">
                                {cartCount}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] font-bold uppercase">Cart</span>
                </button>
            </div>

            <CartDrawer 
                items={cart} 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)} 
                updateQuantity={updateQuantity} 
            />

            <FavoritesDrawer 
                items={favoritedItems}
                isOpen={isFavoritesOpen}
                onClose={() => setIsFavoritesOpen(false)}
                onRemove={toggleFavorite}
                onMoveToCart={(item) => {
                    addToCart(item);
                    toggleFavorite(item.id); // Optionally remove from favorites
                }}
            />

            <MenuDrawer 
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
            />

            <SetupGuide 
                isOpen={isSetupOpen}
                onClose={() => {
                    setIsSetupOpen(false);
                    sessionStorage.setItem('hasSeenSetupGuide', 'true');
                }}
            />

            <QuickViewModal 
                item={quickViewProduct} 
                isOpen={!!quickViewProduct} 
                onClose={() => setQuickViewProduct(null)}
                onAdd={addToCart}
                onAddReview={handleAddReview}
            />

            <AIStylist 
                isOpen={isStylistOpen} 
                onClose={() => setIsStylistOpen(false)}
                onRecommend={(id) => {
                    const item = products.find(i => i.id === id);
                    if (item) {
                        addToCart(item);
                        setIsStylistOpen(false);
                        // Optional: Reset filters to find the item
                        setActiveTag('All');
                        setSearchTerm('');
                    }
                }}
                items={products}
            />
        </div>
    );
}

const rootElement = document.getElementById('root');
if (rootElement) {
    createRoot(rootElement).render(<App />);
}
