// Shopify Storefront API configuration.
// Vite injects VITE_* keys from your .env.[mode] files.
const SHOPIFY_DOMAIN = (import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || '').trim();
const SHOPIFY_TOKEN = (import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '').trim();
const SHOPIFY_API_VERSION =
  (import.meta.env.VITE_SHOPIFY_API_VERSION || '').trim() || '2026-01';

export const SHOPIFY_CONFIG = {
  domain: SHOPIFY_DOMAIN,
  storefrontAccessToken: SHOPIFY_TOKEN,
  apiVersion: SHOPIFY_API_VERSION,
};

if (import.meta.env.DEV) {
  console.info('[Shopify] Config loaded', {
    domain: SHOPIFY_CONFIG.domain,
    tokenLength: SHOPIFY_CONFIG.storefrontAccessToken?.length || 0,
    apiVersion: SHOPIFY_CONFIG.apiVersion,
  });
}

export const USE_LIVE_DATA =
  SHOPIFY_CONFIG.domain !== '' && SHOPIFY_CONFIG.storefrontAccessToken !== '';

export const IS_SHOPIFY_LIVE = USE_LIVE_DATA;
