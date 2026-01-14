# ONES4 Spatial Experience

A luxury VR e-commerce navigation experience built with React, Three.js (Fiber/Drei), and Tailwind CSS. This application features a spatial scrolling system, glassmorphism UI, and optional headless Shopify integration.

## 🚀 1. Quick Start & Setup

### Running Locally
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start Development Server**:
   ```bash
   npm run dev
   ```

## 🛍️ 2. Shopify Integration (Headless)

By default, the app runs in **Demo Mode** using static data. To connect your real Shopify store:

### Step A: Get Credentials
1. Log in to your **Shopify Admin**.
2. Go to **Settings > Apps and sales channels > Develop apps**.
3. Click **Create an app** (name it "ONES4 Headless").
4. Click **Configure Storefront API scopes** and select all of:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_product_tags`
   - `unauthenticated_read_product_pickup_locations`
   - `unauthenticated_read_customers`
   - `unauthenticated_write_customers`
   - `unauthenticated_read_customer_tags`
   - `unauthenticated_read_content`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_selling_plans`
   - `unauthenticated_read_metaobjects`
5. Click **Install app**.
6. Reveal and copy the **Storefront API Access Token**.

### Step B: Configure App
Open `config.ts` in the project root and update the config object:

```typescript
// config.ts
export const SHOPIFY_CONFIG = {
  // Your myshopify domain (NOT your custom domain)
  domain: 'your-brand-name.myshopify.com',
  
  // The token you copied in Step A
  storefrontAccessToken: 'shpat_xxxxxxxxxxxxxxxxxxxxxxxx',
  
  apiVersion: '2026-01',
};
```

**Note:** The app automatically detects these values. If they are valid, it switches to "Live Mode", fetching real products and creating real checkouts. If invalid, it safely falls back to "Demo Mode".

## 🎨 3. Customization Guide

### Changing Menu Options
The side menu (Hamburger icon) categories are defined in the `OptionsPanel` component.

1. Open `components/Menu/OptionsPanel.tsx`.
2. Locate the `<OptionsPanel>` component.
3. Modify the `<CategoryItem />` entries:

```tsx
// Example: Changing "Winter Core" to "Summer Edit"
<CategoryItem y={0.16} label="SUMMER EDIT" count="15 ITEMS" active />
```

### Editing Static Products
If you are **not** using Shopify and want to change the demo products:

1. Open `components/Menu/ProductsPanel.tsx`.
2. Locate `const STATIC_PRODUCT_DATA`.
3. Update the array objects:

```typescript
{
    id: 'p1',
    label: 'NEW PRODUCT NAME',
    price: '$500',
    priceVal: 500,
    imageUrl: 'https://your-image-url.com/image.jpg',
    variantId: 'mock_v1'
}
```

### Modifying the 3D World (Scroll Sections)
The 3D scrolling content is separated into "Sections".

1. **Content**: Edit `components/World/SpatialContent.tsx`.
   - `WinterSection`: The first deep section.
   - `TechSection`: The middle section.
   - `HorizonSection`: The final section.
   - You can update text, images, and HTML overlays here.

2. **Positioning**: Edit `components/Experience.tsx`.
   - Look for the `<group position={[0, 0, -Z]}>` blocks to change where sections appear in 3D space.

### Branding & Colors
- **Glass Effect**: defaults are in `components/Menu/GlassBase.tsx`. Change `edgeColor` props passed to this component in files like `CurvedMenu.tsx`.
- **Accent Color**: The primary purple is `#a855f7`. Search and replace this hex code to match your brand.
- **Logo**: Update the `Logo` component inside `components/Menu/CurvedMenu.tsx`.

## 🛠️ Technical Structure

- **`App.tsx`**: Main entry, Canvas setup, and UI overlays (TopBar/MobileNav).
- **`components/Experience.tsx`**: The 3D scene coordinator and camera rig.
- **`components/Menu/`**: All VR UI panels (Glassmorphism components).
- **`components/World/`**: Background elements (Stars, 3D Markers) and Html content.
- **`utils/shopify.ts`**: GraphQL queries and fetch logic.
