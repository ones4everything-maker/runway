import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IS_SHOPIFY_LIVE, SHOPIFY_CONFIG } from '../config';
import { DEMO_PRODUCTS } from '../utils/demoProducts';
import { shopifyFetch, PRODUCT_BY_HANDLE_QUERY, formatShopifyProduct, ShopifyProduct } from '../utils/shopify';

type LoadState = 'loading' | 'live' | 'demo' | 'error';

const ProductPage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [state, setState] = useState<LoadState>('loading');

  useEffect(() => {
    if (!handle) return;
    let cancelled = false;

    const setDemo = () => {
      const fallback = DEMO_PRODUCTS.find((p) => p.handle === handle || p.id === handle);
      if (fallback && !cancelled) {
        setProduct(fallback);
        setState('demo');
      } else if (!cancelled) {
        setState('error');
      }
    };

    const load = async () => {
      if (!IS_SHOPIFY_LIVE) {
        setDemo();
        return;
      }

      setState('loading');
      try {
        const data = await shopifyFetch(PRODUCT_BY_HANDLE_QUERY, { handle });
        const node = data?.product;
        if (node && !cancelled) {
          setProduct(formatShopifyProduct(node));
          setState('live');
          return;
        }
      } catch (error) {
        // Fall back to demo data below
      }

      setDemo();
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [handle]);

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-sm text-white/60">Loading product...</div>
      </div>
    );
  }

  if (state === 'error' || !product) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold">Product not found</p>
          <Link to="/shop" className="text-purple-300 hover:text-white text-sm transition-colors">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const gallery =
    product.images && product.images.length
      ? product.images
      : product.imageUrl
      ? [product.imageUrl]
      : [];

  const productUrl =
    product.handle && IS_SHOPIFY_LIVE && SHOPIFY_CONFIG.domain !== 'mock-store.myshopify.com'
      ? `https://${SHOPIFY_CONFIG.domain}/products/${product.handle}`
      : null;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link to="/shop" className="text-xs uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors">
            Shop
          </Link>
          <div className="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10">
            {state === 'live' ? 'Live Shopify' : 'Demo mode'}
          </div>
          <Link to="/" className="text-xs text-purple-300 hover:text-white transition-colors">
            Home
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-16 pt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-3">
          {gallery.length === 0 ? (
            <div className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/40">
              No media
            </div>
          ) : (
            gallery.map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden shadow-[0_12px_60px_rgba(0,0,0,0.35)]"
              >
                <img src={src} alt={product.label} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))
          )}
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase text-white/50 tracking-[0.25em]">Product</p>
            <h1 className="text-3xl font-semibold tracking-tight mt-2">{product.label}</h1>
            {product.description && (
              <p className="text-sm text-white/70 mt-3 leading-relaxed whitespace-pre-line">{product.description}</p>
            )}
          </div>

          <div className="text-xl font-semibold">{product.price}</div>

          <div className="flex flex-wrap items-center gap-3">
            {productUrl ? (
              <a
                href={productUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-sm font-semibold tracking-wide transition-colors"
              >
                View on Shopify
              </a>
            ) : (
              <button
                className="px-4 py-2 rounded-full bg-white/10 text-sm text-white/60 cursor-not-allowed"
                disabled
              >
                Shopify URL not set
              </button>
            )}

            <Link
              to="/shop"
              className="px-4 py-2 rounded-full border border-white/15 text-sm hover:border-white/40 transition-colors"
            >
              Back to shop
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductPage;
