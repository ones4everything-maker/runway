import { SHOPIFY_CONFIG } from '../config';

// --- QUERIES ---

export const PRODUCTS_QUERY = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          handle
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  query productByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      handle
      images(first: 6) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 1) {
        edges {
          node {
            id
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const CHECKOUT_MUTATION = `
  mutation checkoutCreate($lineItems: [CheckoutLineItemInput!]!) {
    checkoutCreate(input: {lineItems: $lineItems}) {
      checkout {
        id
        webUrl
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
`;

// --- FETCHER ---

function buildEndpoint() {
  const domain = (SHOPIFY_CONFIG.domain || '').replace(/^https?:\/\//, '').replace(/\/+$/, '');
  if (!domain || !SHOPIFY_CONFIG.storefrontAccessToken) {
    throw new Error('Missing Shopify configuration (domain or token)');
  }

  return `https://${domain}/api/${SHOPIFY_CONFIG.apiVersion}/graphql.json`;
}

export async function shopifyFetch(query: string, variables: Record<string, any> = {}) {
  const endpoint = buildEndpoint();

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  let json: any;
  try {
    json = await response.json();
  } catch (error) {
    console.error('Shopify API returned invalid JSON', error);
    throw new Error('Invalid response from Shopify');
  }

  if (!response.ok) {
    console.error('Shopify API HTTP error:', response.status, response.statusText, json?.errors);
    throw new Error(json?.errors?.[0]?.message || `Shopify API error (${response.status})`);
  }

  if (json.errors) {
    console.error('Shopify API errors:', json.errors);
    throw new Error(json.errors[0]?.message || 'Shopify API error');
  }

  return json.data;
}

// --- HELPERS ---

export interface ShopifyProduct {
  id: string;
  label: string;
  price: string;
  priceVal: number;
  imageUrl: string;
  variantId: string;
  handle?: string;
  description?: string;
  images?: string[];
  currencyCode?: string;
}

export function formatShopifyProduct(node: any): ShopifyProduct {
  const price = node.variants?.edges?.[0]?.node?.price?.amount || '0';
  const currency = node.variants?.edges?.[0]?.node?.price?.currencyCode || 'USD';
  const images = node.images?.edges?.map((edge: any) => edge?.node?.url).filter(Boolean) || [];
  const image = images[0] || '';
  const variantId = node.variants?.edges?.[0]?.node?.id;

  return {
    id: node.id,
    label: node.title.toUpperCase(),
    price: `$${parseFloat(price).toLocaleString()}`, // Simplified formatting
    priceVal: parseFloat(price),
    imageUrl: image,
    variantId: variantId,
    handle: node.handle,
    description: node.description,
    images,
    currencyCode: currency
  };
}
