import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IS_SHOPIFY_LIVE } from '../config';
import { shopifyFetch, PRODUCTS_QUERY, formatShopifyProduct, ShopifyProduct } from '../utils/shopify';
import { DEMO_PRODUCTS } from '../utils/demoProducts';

type LoadState = 'demo' | 'live' | 'loading' | 'error';

const ShopPage: React.FC = () => {
  const [items, setItems] = useState<ShopifyProduct[]>(DEMO_PRODUCTS);
  const [state, setState] = useState<LoadState>(IS_SHOPIFY_LIVE ? 'loading' : 'demo');

  useEffect(() => {
    let cancelled = false;

    async function loadFromShopify() {
      if (!IS_SHOPIFY_LIVE) return;
      setState('loading');
      try {
        const data = await shopifyFetch(PRODUCTS_QUERY, { first: 20 });
        const parsed =
          data?.products?.edges
            ?.map((edge: any) => formatShopifyProduct(edge.node))
            .filter(Boolean) ?? [];

        if (!cancelled && parsed.length) {
          setItems(parsed);
          setState('live');
        } else if (!cancelled) {
          setState('error');
        }
      } catch (error) {
        if (!cancelled) {
          setState('error');
        }
      }
    }

    loadFromShopify();
    return () => {
      cancelled = true;
    };
  }, []);

  const badge =
    state === 'live'
      ? 'Live Shopify'
      : state === 'loading'
      ? 'Loading Shopify...'
      : state === 'error'
      ? 'Demo (Shopify unavailable)'
      : 'Demo mode';

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="font-bold tracking-[0.25em] text-sm hover:text-purple-300 transition-colors">
            ONES4
          </Link>
          <div className="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10">{badge}</div>
          <Link to="/product/aether-orb" className="text-xs text-purple-300 hover:text-white transition-colors">
            Sample product
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-10 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-wide">Shop</h1>
            <p className="text-sm text-white/60">Route-ready catalog with Shopify fallback.</p>
          </div>
          <Link to="/" className="text-sm text-purple-300 hover:text-white transition-colors">
            Return Home
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/product/${item.handle || item.id}`}
              className="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-purple-400/40 transition-colors"
            >
              <div className="aspect-square bg-black relative">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.label} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="flex h-full items-center justify-center text-white/40 text-xs">No image</div>
                )}
                <div className="absolute top-3 right-3 text-[11px] px-3 py-1 rounded-full bg-black/60 border border-white/10">
                  {item.price}
                </div>
              </div>
              <div className="p-4 flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold tracking-wide">{item.label}</div>
                  <div className="text-[11px] text-white/50 mt-1">{item.handle || item.id}</div>
                </div>
                <span className="text-xs text-purple-300 group-hover:text-white transition-colors">View</span>
              </div>
            </Link>
          ))}
        </div>

        {state === 'error' && (
          <div className="mt-6 text-xs text-amber-300">
            Shopify could not load; showing demo products.
          </div>
        )}
      </main>
    </div>
  );
};

export default ShopPage;
