import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ScrollControls, Scroll, useScroll } from "@react-three/drei";
import { MathUtils, Group } from "three";
import { CurvedMenu } from "./Menu/CurvedMenu";
import { StarField } from "./World/StarField";
import { SectionMarkers } from "./World/SectionMarkers";
import {
  WinterSection,
  TechSection,
  HorizonSection,
  IntroHint,
} from "./World/SpatialContent";
import { SHOPIFY_CONFIG } from "../config";

/**
 * -----------------------------
 * Shopify Storefront (Client-side)
 * -----------------------------
 * Uses public Storefront access token via:
 *  -H 'X-Shopify-Storefront-Access-Token: ...'
 */
const STORE_DOMAIN = SHOPIFY_CONFIG.domain;
const STOREFRONT_TOKEN = SHOPIFY_CONFIG.storefrontAccessToken;
const STOREFRONT_VERSION = SHOPIFY_CONFIG.apiVersion;

type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  imageUrl?: string;
  price?: string;
};

async function storefrontQuery<T>(query: string, variables?: Record<string, any>): Promise<T> {
  if (!STORE_DOMAIN || !STOREFRONT_TOKEN) {
    throw new Error("Missing VITE_SHOPIFY_STORE_DOMAIN or VITE_SHOPIFY_STOREFRONT_TOKEN");
  }

  // Storefront GraphQL endpoint
  const endpoint = `https://${STORE_DOMAIN}/api/${STOREFRONT_VERSION}/graphql.json`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Storefront public token header
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();

  if (!res.ok || json.errors) {
    const msg = JSON.stringify(json.errors || json, null, 2);
    throw new Error(`Storefront API error: ${msg}`);
  }

  return json.data as T;
}

async function getCollectionProducts(handle: string, first = 12): Promise<ShopifyProduct[]> {
  const query = `
    query CollectionProducts($handle: String!, $first: Int!) {
      collectionByHandle(handle: $handle) {
        title
        products(first: $first) {
          edges {
            node {
              id
              title
              handle
              featuredImage {
                url
                altText
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  `;

  type Resp = {
    collectionByHandle: null | {
      title: string;
      products: {
        edges: Array<{
          node: {
            id: string;
            title: string;
            handle: string;
            featuredImage: null | { url: string };
            priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
          };
        }>;
      };
    };
  };

  const data = await storefrontQuery<Resp>(query, { handle, first });

  const col = data.collectionByHandle;
  if (!col) return [];

  return col.products.edges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    handle: node.handle,
    imageUrl: node.featuredImage?.url,
    price: `${node.priceRange.minVariantPrice.amount} ${node.priceRange.minVariantPrice.currencyCode}`,
  }));
}

/**
 * -----------------------------
 * Experience / Scroll Overlay
 * -----------------------------
 */

type Panel = {
  key: string;
  title: string;
  collectionHandle: string; // Shopify collection handle
};

const PANELS: Panel[] = [
  // Replace these handles with your real ones:
  { key: "hoodies", title: "HOODIES", collectionHandle: "hoodies-1" },
  { key: "shirts", title: "SHIRTS", collectionHandle: "shirts" },
  // Add more when you have them:
  // { key: "kicks", title: "KICKS", collectionHandle: "kicks" },
  // { key: "gear", title: "GEAR", collectionHandle: "gear" },
];

// Component to handle camera movement based on scroll
const CameraRig = () => {
  const scroll = useScroll();
  const { camera } = useThree();

  useFrame((state, delta) => {
    if (!scroll) return;

    const targetZ = -(scroll.offset * 70);
    camera.position.z = MathUtils.lerp(camera.position.z, 5 + targetZ, delta * 2);

    const targetRotZ = scroll.offset * 0.2;
    camera.rotation.z = MathUtils.lerp(camera.rotation.z, targetRotZ, delta * 2);

    const targetRotX = -state.pointer.y * 0.05;
    const targetRotY = -state.pointer.x * 0.05;

    camera.rotation.x = MathUtils.lerp(camera.rotation.x, targetRotX, delta * 2);
    camera.rotation.y = MathUtils.lerp(camera.rotation.y, targetRotY, delta * 2);
  });

  return null;
};

const Hud = () => {
  const groupRef = useRef<Group>(null);
  const { camera, size } = useThree();
  const isMobile = size.width < 768;

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.copy(camera.position);
    groupRef.current.quaternion.copy(camera.quaternion);
    groupRef.current.translateZ(-1.5);
  });

  return (
    <group ref={groupRef}>
      {!isMobile && (
        <group position={[0, -0.4, 0]} rotation={[-0.1, 0, 0]}>
          <CurvedMenu />
        </group>
      )}
    </group>
  );
};

function CardsOverlay() {
  const scroll = useScroll();
  const total = PANELS.length;

  const [productsByHandle, setProductsByHandle] = useState<Record<string, ShopifyProduct[]>>({});
  const [error, setError] = useState<string | null>(null);

  // load all panels once
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setError(null);
        const entries = await Promise.all(
          PANELS.map(async (p) => [p.collectionHandle, await getCollectionProducts(p.collectionHandle, 12)] as const)
        );

        if (cancelled) return;
        const map: Record<string, ShopifyProduct[]> = {};
        for (const [handle, products] of entries) map[handle] = products;
        setProductsByHandle(map);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load products");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Crossfade panels (never blank)
  const pos = scroll.offset * total; // 0..total
  const i = Math.floor(pos);
  const frac = pos - i;

  return (
    <div className="sticky top-0 w-screen h-[100dvh] z-[9999] pointer-events-none">
      <div className="relative w-full h-full flex items-center justify-center px-6 pt-20 pb-32">
        {error && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-full max-w-3xl pointer-events-auto">
            <div className="rounded-2xl bg-red-500/10 border border-red-400/20 p-4 text-red-200 text-sm">
              {error}
            </div>
          </div>
        )}

        {PANELS.map((p, idx) => {
          const isCurrent = idx === i;
          const isNext = idx === i + 1;
          if (!isCurrent && !isNext) return null;

          const opacity = isCurrent ? 1 - frac : frac;
          const y = (1 - opacity) * 18;

          const products = productsByHandle[p.collectionHandle] || [];

          return (
            <div
              key={p.key}
              style={{ opacity, transform: `translateY(${y}px)` }}
              className="absolute w-full max-w-6xl pointer-events-auto"
            >
              <div className="mb-4 text-white/60 font-mono tracking-[0.3em] text-xs">
                {p.title}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.length === 0 ? (
                  <div className="col-span-full rounded-2xl bg-white/5 border border-white/10 p-6 text-white/70">
                    {Object.keys(productsByHandle).length === 0
                      ? "Loading products..."
                      : "No products found for this collection handle."}
                  </div>
                ) : (
                  products.map((prod) => (
                    <a
                      key={prod.id}
                      href={`https://${STORE_DOMAIN}/products/${prod.handle}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl bg-white/5 border border-white/10 p-6 text-white hover:bg-white/10 transition"
                    >
                      <div className="font-semibold">{prod.title}</div>
                      {prod.price && <div className="text-white/60 mt-2 text-sm">{prod.price}</div>}
                      {prod.imageUrl && (
                        <img
                          src={prod.imageUrl}
                          alt={prod.title}
                          className="mt-4 w-full h-40 object-cover rounded-xl border border-white/10"
                          loading="lazy"
                        />
                      )}
                    </a>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const Experience: React.FC = () => {
  return (
    <ScrollControls pages={PANELS.length} damping={0.2}>
      <CameraRig />

      <StarField />
      <SectionMarkers />

      <ambientLight intensity={0.2} />
      <pointLight position={[0, 2, 8]} intensity={1.5} color="#e0e0ff" distance={15} />
      <pointLight position={[0, 0, -5]} intensity={2} color="#bfdbfe" distance={20} />
      <pointLight position={[0, 0, -25]} intensity={2} color="#d8b4fe" distance={30} />
      <pointLight position={[0, 0, -45]} intensity={3} color="#ff8800" distance={40} />

      <Hud />

      <group position={[0, 0, 2]}>
        <IntroHint />
      </group>

      <group position={[0, 0, -10]}>
        <WinterSection />
      </group>

      <group position={[0, 0, -35]}>
        <TechSection />
      </group>

      <group position={[0, 0, -60]}>
        <HorizonSection />
      </group>

      <Scroll html>
        <CardsOverlay />
      </Scroll>
    </ScrollControls>
  );
};
